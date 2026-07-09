import Book from "../models/Book.js"
import User from "../models/User.js"
import AuthorProfile from "../models/authorProfile.js"
import uploadToCloudinary from "../utils/uploadToCloudinary.js"
import PDFDocument from "pdfkit"
import jwt from "jsonwebtoken"
import Order from "../models/Order.js"
export const getBooks = async (req, res) => {
  try {
    const { search, genre, sortBy, page = 1, limit = 10 } = req.query

    const query = {}

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      // Find matching authors (users) by name
      const matchingUsers = await User.find({
        name: { $regex: searchRegex }
      }).select("_id");
      const userIds = matchingUsers.map(u => u._id);

      // Find matching author profiles by displayName
      const matchingProfiles = await AuthorProfile.find({
        displayName: { $regex: searchRegex }
      }).select("user");
      const profileUserIds = matchingProfiles.map(p => p.user);

      // Combine matching author IDs
      const allMatchingAuthorIds = [...new Set([...userIds, ...profileUserIds])];

      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { genres: { $regex: searchRegex } },
        { author: { $in: allMatchingAuthorIds } }
      ];
    }

    if (genre) {
      query.genres = genre; // Filter by genre
    }

    const sortOption = {};
    if (sortBy === "trending") {
      sortOption.views = -1;
      sortOption.downloads = -1;
    }
    sortOption.createdAt = -1; // Fallback

    const books = await Book.find(query)
      .populate("author", "name email") // Include author details
      .sort(sortOption)
      .skip((page - 1) * limit) // Pagination
      .limit(Number(limit))

    const totalBooks = await Book.countDocuments(query) // Total matching books

    res.status(200).json({
      books,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "author",
      "name email"
    ) // Include author information

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      })
    }

    // Increment views count
    await Book.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Determine access to book content/PDF (Free vs. Premium)
    let hasAccess = false;
    let isPendingApproval = false;
    if (book.price === 0) {
      hasAccess = true;
    } else {
      // Premium book: verify token optionally
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;

          const isAuthor = book.author._id.toString() === userId;
          const userObj = await User.findById(userId);
          const isAdmin = userObj?.role === "admin";

          const paidOrder = await Order.findOne({
            user: userId,
            book: book._id,
            status: "paid",
          });

          const pendingOrder = await Order.findOne({
            user: userId,
            book: book._id,
            status: "pending",
          });

          if (isAuthor || isAdmin || paidOrder) {
            hasAccess = true;
          }
          if (pendingOrder) {
            isPendingApproval = true;
          }
        } catch (err) {
          // Token is invalid/expired, default to no access
        }
      }
    }

    const bookData = book.toObject();
    if (!hasAccess) {
      bookData.pdfFile = null;
      bookData.content = null;
      bookData.isPurchased = false;
      bookData.isPendingApproval = isPendingApproval;
    } else {
      bookData.isPurchased = true;
      bookData.isPendingApproval = false;
    }

    res.status(200).json(bookData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}



const cleanTextForPDF = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/[\u2013\u2014]/g, "-") // en/em dashes
    .replace(/\u2026/g, "...")       // ellipsis
    .replace(/[^\x00-\x7F]/g, (char) => {
      // Replace common characters, or map to space
      const mappings = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
        'ñ': 'n', 'Ñ': 'N', 'ü': 'u', 'Ü': 'U'
      };
      return mappings[char] || " ";
    });
};

export const createBook = async (req, res) => {
  try {

    // Enforce free plan limit: max 10 books per author
    const bookCount = await Book.countDocuments({ author: req.user._id });
    if (bookCount >= 10) {
      return res.status(400).json({
        message: "Free plan limit reached: You can create a maximum of 10 books.",
      });
    }

    const { title, description, genres, price, publishDate, content } = req.body;

    if (publishDate) {
      const selectedDate = new Date(publishDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        return res.status(400).json({
          message: "Publish date cannot be in the future.",
        });
      }
    }

    let coverBuffer = req.files?.coverImage?.[0]?.buffer;

    // Support base64 cover image if sent as string from client-side canvas
    const base64Str = req.body.coverImageBase64 || req.body.coverImage;
    if (!coverBuffer && base64Str && base64Str.startsWith("data:image")) {
      const base64Data = base64Str.split(",")[1];
      coverBuffer = Buffer.from(base64Data, "base64");
    }

    if (!coverBuffer) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

    let pdfBuffer;
    const pdfFile = req.files?.pdfFile?.[0];

    if (pdfFile) {
      // Flow 1: Quick Upload - PDF File was provided
      pdfBuffer = pdfFile.buffer;
      const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
      if (pdfBuffer.length > MAX_PDF_SIZE) {
        return res.status(400).json({
          message: "PDF file size must not exceed 10MB.",
        });
      }
    } else if (content && content.trim()) {
      // Flow 2: Create Work - Write directly, generate PDF buffer from text
      const cleanTitle = cleanTextForPDF(title || "Untitled Masterpiece");
      const cleanContent = cleanTextForPDF(content);
      const cleanAuthor = cleanTextForPDF(req.user.name || "Unknown Author");

      pdfBuffer = await new Promise((resolve, reject) => {
        const doc = new PDFDocument({ 
          margin: 50,
          bufferPages: true 
        });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // --- TITLE PAGE ---
        doc.moveDown(4);
        doc.font("Helvetica-Bold").fontSize(28).fillColor("#3A3026").text(cleanTitle, { align: "center" });
        doc.moveDown(1);
        doc.font("Helvetica-Oblique").fontSize(14).fillColor("#5C4E40").text(`by ${cleanAuthor}`, { align: "center" });
        
        // Brand attribution details
        doc.moveDown(7);
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#8C4E35").text("Published via Author Gallery", { align: "center" });
        doc.font("Helvetica").fontSize(9).fillColor("#7E7262").text("A premium platform for independent authors and readers.", { align: "center" });
        doc.moveDown(0.8);
        doc.font("Helvetica-Oblique").fontSize(8).fillColor("#A09485").text(`Published on ${new Date().toLocaleDateString()}`, { align: "center" });
        
        // --- CONTENT PAGE ---
        doc.addPage();
        
        // Content body
        doc.font("Helvetica").fontSize(11).fillColor("#1A1A1A").text(cleanContent, {
          align: "justify",
          lineGap: 5
        });

        // Add headers, footers and lines to content pages (i.e. pages after page 1)
        const range = doc.bufferedPageRange();
        for (let i = range.start + 1; i < range.start + range.count; i++) {
          doc.switchToPage(i);

          // Temporarily set bottom margin to 0 for this page to prevent auto page breaks from footer text
          const oldBottom = doc.page.margins.bottom;
          doc.page.margins.bottom = 0;
          
          // Header title
          doc.fontSize(8).fillColor("#A09485")
             .text(cleanTitle, 50, 20, { align: "left", width: doc.page.width - 100 });
          doc.moveTo(50, 32).lineTo(doc.page.width - 50, 32).strokeColor("#EADCC9").lineWidth(0.5).stroke();
          
          // Footer line & attribution
          doc.moveTo(50, doc.page.height - 45).lineTo(doc.page.width - 50, doc.page.height - 45).strokeColor("#EADCC9").lineWidth(0.5).stroke();
          doc.fontSize(8).fillColor("#A09485")
             .text("Published via Author Gallery | www.authorgallery.com", 50, doc.page.height - 35, { align: "center", width: doc.page.width - 100 });
          
          // Page Number
          doc.text(`Page ${i}`, doc.page.width - 80, doc.page.height - 35, { align: "right" });

          // Restore bottom margin
          doc.page.margins.bottom = oldBottom;
        }

        doc.end();
      });
    } else {
      return res.status(400).json({
        message: "eBook PDF file or Notepad text content is required",
      });
    }

    // Upload cover image to Cloudinary
    const coverUpload = await uploadToCloudinary(
      coverBuffer,
      "book-covers"
    );

    // Upload PDF to Cloudinary
    const pdfUpload = await uploadToCloudinary(
      pdfBuffer,
      "book-pdfs"
    );

    const book = await Book.create({
      title,
      description,
      genres: Array.isArray(genres) ? genres : [genres],
      price,
      publishDate,
      author: req.user._id,
      coverImage: coverUpload.secure_url,
      pdfFile: pdfUpload.secure_url,
      content: content || "",
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({
      author: req.user._id, // Only logged-in user's books
    })
      .sort({ createdAt: -1 })
      .populate("author", "name email")

    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      author: req.user._id, // Ownership check
    })

    if (!book) {
      return res.status(404).json({
        message: "Book not found or unauthorized",
      })
    }

    if (req.body.publishDate) {
      const selectedDate = new Date(req.body.publishDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        return res.status(400).json({
          message: "Publish date cannot be in the future.",
        });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Validate updated fields
      }
    )

    res.status(200).json(updatedBook)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      author: req.user._id, // Ownership check
    })

    if (!book) {
      return res.status(404).json({
        message: "Book not found or unauthorized",
      })
    }

    await book.deleteOne() // Delete book

    res.status(200).json({
      message: "Book deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const incrementDownloads = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Download count incremented successfully", downloads: book.downloads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
Future Roadmap

1. Cloudinary Integration
--------------------------------
- Upload cover images
- Upload PDF files
- Store Cloudinary URLs in coverImage and pdfFile

2. Views & Downloads
--------------------------------
- Increment views when a book is opened
- Increment downloads when PDF is downloaded

3. Advanced Search
--------------------------------
- Search by title
- Search by author name
- Search by multiple genres

4. Reviews & Ratings
--------------------------------
Create separate Review model:
- user
- book
- rating
- comment

5. Payments & Orders
--------------------------------
Create Order model:
- buyer
- book
- amount
- payment status

6. Analytics
--------------------------------
Generate analytics from:
- views
- downloads
- purchases

7. Admin Panel
--------------------------------
Admins will be able to:
- Update any book
- Delete any book
- Manage platform content

Current version remains author-owned only.
*/