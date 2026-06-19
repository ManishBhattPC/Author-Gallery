import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    const { search, genre, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      }; // Case-insensitive title search
    }

    if (genre) {
      query.genres = genre; // Filter by genre
    }

    const books = await Book.find(query)
      .populate("author", "name email") // Include author details
      .sort({ createdAt: -1 }) // Newest books first
      .skip((page - 1) * limit) // Pagination
      .limit(Number(limit));

    const totalBooks = await Book.countDocuments(query); // Total matching books

    res.status(200).json({
      books,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "author",
      "name email"
    ); // Include author information

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      author: req.user._id, // Logged-in user becomes book owner
    });

    res.status(201).json(book);
  } catch (error) {
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
      .populate("author", "name email");

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      author: req.user._id, // Ownership check
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found or unauthorized",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Validate updated fields
      }
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      author: req.user._id, // Ownership check
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found or unauthorized",
      });
    }

    await book.deleteOne(); // Delete book

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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