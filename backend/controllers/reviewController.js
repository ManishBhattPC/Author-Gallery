import Review from "../models/Review.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { rating, comment, book, author } = req.body;
    const reviewerId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    if (!book && !author) {
      return res.status(400).json({ message: "Review must target a book or an author" });
    }

    const reviewData = {
      reviewer: reviewerId,
      rating,
      comment: comment.trim(),
    };

    if (book) reviewData.book = book;
    if (author) reviewData.author = author;

    const review = await Review.create(reviewData);
    
    // Populate reviewer name for immediate display
    const populatedReview = await Review.findById(review._id).populate("reviewer", "name");

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a specific book
export const getBookReviews = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const reviews = await Review.find({ book: bookId })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a specific author profile
export const getAuthorReviews = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const reviews = await Review.find({ author: authorId })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
