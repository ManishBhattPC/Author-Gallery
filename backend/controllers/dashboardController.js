import Book from "../models/Book.js"
import User from "../models/User.js"

export const getAuthorDashboardStats = async (req, res) => {
  try {
    const authorId = req.user._id // Logged-in user from auth middleware

    // Get all books by this author
    const books = await Book.find({ author: authorId })

    // Calculate total value
    const totalValue = books.reduce((sum, book) => sum + Number(book.price || 0), 0)

    // Get unique genres
    const allGenres = books.flatMap((book) => book.genres || [])
    const totalGenres = new Set(allGenres).size

    // Get recent books (last 5)
    const recentBooks = books
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((book) => ({
        _id: book._id,
        title: book.title,
        coverImage: book.coverImage,
        createdAt: book.createdAt,
      }))

    // Get author follower/following counts
    const author = await User.findById(authorId).select("followers following")

    res.status(200).json({
      stats: {
        published: books.length,
        totalValue,
        totalGenres,
        lastPublished: books.length > 0 ? books[0].createdAt : null,
        followers: author?.followers?.length || 0,
        following: author?.following?.length || 0,
      },
      recentBooks,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}