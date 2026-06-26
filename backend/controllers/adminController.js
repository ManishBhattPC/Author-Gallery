import User from "../models/User.js";
import Book from "../models/Book.js";
import AuthorProfile from "../models/authorProfile.js";
import Review from "../models/Review.js";
import Report from "../models/Report.js";

// Fetch all books, authors, reports, reviews for admin dashboard
export const getDashboardData = async (req, res) => {
  try {
    // 1. Fetch all books populated with author info
    const books = await Book.find({})
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    // 2. Fetch all users and lookup their profiles
    const users = await User.find({ email: { $ne: "admin@authorgallery.com" } })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    // Combine users with profiles and book count
    const authors = await Promise.all(
      users.map(async (u) => {
        const profile = await AuthorProfile.findOne({ user: u._id });
        const worksCount = await Book.countDocuments({ author: u._id });
        return {
          _id: u._id,
          name: profile?.displayName || u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          works: worksCount,
          profileImage: profile?.profileImage || "",
          bio: profile?.bio || "",
          genres: profile?.genres || [],
        };
      })
    );

    // 3. Fetch all reports populated with details
    const reports = await Report.find({})
      .populate("reporter", "name email")
      .populate({
        path: "book",
        select: "title coverImage author",
        populate: { path: "author", select: "name" }
      })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    // 4. Fetch all reviews
    const reviews = await Review.find({})
      .populate("reviewer", "name email")
      .populate("book", "title coverImage")
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      books,
      authors,
      reports,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD - Delete book
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Also delete any reports associated with this book
    await Report.deleteMany({ book: bookId });
    // Also delete any reviews associated with this book
    await Review.deleteMany({ book: bookId });

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD - Delete/Block Author
export const deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Delete author profile
    const profile = await AuthorProfile.findOne({ user: authorId });
    if (profile) {
      await profile.deleteOne();
    }

    // Delete all books by this author
    const authorBooks = await Book.find({ author: authorId });
    const bookIds = authorBooks.map((b) => b._id);

    // Delete reports/reviews on those books
    await Report.deleteMany({ book: { $in: bookIds } });
    await Review.deleteMany({ book: { $in: bookIds } });
    
    // Delete each book document individually to trigger Cloudinary deletion middleware
    for (const book of authorBooks) {
      await book.deleteOne();
    }

    // Delete reports/reviews directly against the author profile
    await Report.deleteMany({ author: authorId });
    await Review.deleteMany({ author: authorId });

    // Delete the user account
    await user.deleteOne();
    res.status(200).json({ message: "Author and all associated books/profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD - Dismiss Report
export const dismissReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Dismiss by deleting report
    await report.deleteOne();
    res.status(200).json({ message: "Report dismissed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD - Delete Review
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
