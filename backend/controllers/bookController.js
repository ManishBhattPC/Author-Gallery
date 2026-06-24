import Book from "../models/Book.js"
import User from "../models/User.js"
import AuthorProfile from "../models/authorProfile.js"
import uploadToCloudinary from "../utils/uploadToCloudinary.js"
import PDFDocument from "pdfkit"
export const getBooks = async (req, res) => {
  try {
    const { search, genre, page = 1, limit = 10 } = req.query

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

    const books = await Book.find(query)
      .populate("author", "name email") // Include author details
      .sort({ createdAt: -1 }) // Newest books first
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

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}



export const createBook = async (req, res) => {
  try {
    console.log("BODY:", req.body); // Debug
    console.log("FILES:", req.files); // Debug

    const { title, description, genres, price, publishDate, content } = req.body;

    let coverBuffer = req.files?.coverImage?.[0]?.buffer;

    // Support base64 cover image if sent as string from client-side canvas
    if (!coverBuffer && req.body.coverImage && req.body.coverImage.startsWith("data:image")) {
      const base64Data = req.body.coverImage.split(",")[1];
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
    } else if (content && content.trim()) {
      // Flow 2: Create Work - Write directly, generate PDF buffer from text
      pdfBuffer = await new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // PDF Layout & Typography
        doc.font("Helvetica-Bold").fontSize(26).text(title, { align: "center" });
        doc.moveDown(0.5);
        doc.font("Helvetica-Oblique").fontSize(14).text(`by ${req.user.name}`, { align: "center" });
        doc.moveDown(2.5);

        // Body content
        doc.font("Helvetica").fontSize(11).leading(1.6).text(content, {
          align: "justify"
        });
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