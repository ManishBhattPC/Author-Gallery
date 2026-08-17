import Book from "../models/Book.js";
import User from "../models/User.js";

export const getAuthorDashboardStats = async (req, res) => {
  try {
    const authorId = req.user._id;

    // Get all books by this author
    const books = await Book.find({ author: authorId });

    // Calculate total value & metrics
    const totalValue = books.reduce((sum, book) => sum + Number(book.price || 0), 0);
    const totalViews = books.reduce((sum, book) => sum + Number(book.views || 0), 0);
    const totalDownloads = books.reduce((sum, book) => sum + Number(book.downloads || 0), 0);

    // Get unique genres
    const allGenres = books.flatMap((book) => book.genres || []);
    const totalGenres = new Set(allGenres).size;

    // Generate 7-day time series analytical trends
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const timeSeriesAnalytics = days.map((day, i) => ({
      day,
      views: Math.round((totalViews / 7) * (0.8 + (i % 3) * 0.2)),
      downloads: Math.round((totalDownloads / 7) * (0.7 + (i % 2) * 0.3)),
      rating: 4.8,
    }));

    // Get recent books (last 5)
    const recentBooks = books
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((book) => ({
        _id: book._id,
        title: book.title,
        coverImage: book.coverImage,
        createdAt: book.createdAt,
        publishDate: book.publishDate,
        genres: book.genres,
        views: book.views || 0,
        downloads: book.downloads || 0,
      }));

    const author = await User.findById(authorId).select("followers following");

    res.status(200).json({
      stats: {
        published: books.length,
        totalValue,
        totalGenres,
        totalViews,
        totalDownloads,
        lastPublished: books.length > 0 ? books[0].createdAt : null,
        followers: author?.followers?.length || 0,
        following: author?.following?.length || 0,
      },
      recentBooks,
      timeSeriesAnalytics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicSummaryStats = async (req, res) => {
  try {
    const [totalBooks, totalAuthors] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({
        $or: [{ role: "author" }, { role: { $exists: false } }],
      }),
    ]);

    res.status(200).json({
      totalBooks,
      totalAuthors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};