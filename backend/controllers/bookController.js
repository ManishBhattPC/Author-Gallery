import Book from "../models/Book.js";


// 📚 GET ALL BOOKS (+ SEARCH)
export const getBooks = async (req, res) => {
  try {
    const search = req.query.search;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const books = await Book.find(query).populate("authors", "name email");

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📖 GET SINGLE BOOK
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("authors", "name email");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ➕ CREATE BOOK
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏️ UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};