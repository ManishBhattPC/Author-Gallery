import Bookshelf from "../models/Bookshelf.js";

/**
 * Get User Bookshelves
 * @route GET /api/bookshelves
 * @access Private
 */
export const getUserBookshelves = async (req, res) => {
  try {
    let shelves = await Bookshelf.find({ user: req.user._id }).populate({
      path: "books",
      select: "title author coverImage price genres",
      populate: { path: "author", select: "name" },
    });

    res.status(200).json(shelves);
  } catch (error) {
    console.error("Error fetching user bookshelves:", error);
    res.status(500).json({ message: "Server error fetching bookshelves" });
  }
};

/**
 * Add or Update Book on Bookshelf Category
 * @route POST /api/bookshelves
 * @access Private
 */
export const addBookToShelf = async (req, res) => {
  try {
    const { bookId, category } = req.body;

    if (!bookId || !category) {
      return res.status(400).json({ message: "Book ID and Category are required" });
    }

    let shelf = await Bookshelf.findOne({ user: req.user._id, category });

    if (!shelf) {
      shelf = new Bookshelf({
        user: req.user._id,
        category,
        books: [bookId],
      });
    } else {
      if (!shelf.books.includes(bookId)) {
        shelf.books.push(bookId);
      }
    }

    await shelf.save();

    res.status(200).json({ message: "Book added to shelf successfully", shelf });
  } catch (error) {
    console.error("Error adding book to shelf:", error);
    res.status(500).json({ message: "Server error adding to shelf" });
  }
};

/**
 * Remove Book from Bookshelf
 * @route DELETE /api/bookshelves/:id/books/:bookId
 * @access Private
 */
export const removeBookFromShelf = async (req, res) => {
  try {
    const { id, bookId } = req.params;

    const shelf = await Bookshelf.findOne({ _id: id, user: req.user._id });
    if (!shelf) {
      return res.status(404).json({ message: "Bookshelf not found" });
    }

    shelf.books = shelf.books.filter((b) => b.toString() !== bookId);
    await shelf.save();

    res.status(200).json({ message: "Book removed from shelf", shelf });
  } catch (error) {
    console.error("Error removing book from shelf:", error);
    res.status(500).json({ message: "Server error removing book from shelf" });
  }
};
