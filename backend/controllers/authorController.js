import mongoose from "mongoose"
import User from "../models/User.js"
import Book from "../models/Book.js"
import AuthorProfile from "../models/authorProfile.js"

// Match authors (users with role "author" or default role)
const authorMatch = {
  $or: [{ role: "author" }, { role: { $exists: false } }],
}

export const getAuthors = async (req, res) => {
  try {
    const { featured, search } = req.query // featured=true returns top 5 authors

    const pipeline = [
      { $match: authorMatch }, // Match only authors/users first to keep pipeline fast
      {
        $lookup: {
          from: "authorprofiles",
          localField: "_id",
          foreignField: "user",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "books", // Join with books collection
          localField: "_id",
          foreignField: "author",
          as: "books", // Store books in "books" array
        },
      },
      {
        $addFields: {
          works: { $size: "$books" }, // Count total books per author
          resolvedName: { $ifNull: ["$profile.displayName", "$name"] },
          resolvedBio: { $ifNull: ["$profile.bio", { $ifNull: ["$bio", ""] }] },
          resolvedProfileImage: { $ifNull: ["$profile.profileImage", { $ifNull: ["$profileImage", ""] }] },
          resolvedGenres: { $ifNull: ["$profile.genres", []] },
        },
      },
    ]

    // If search exists, filter resolved name, bio, genres
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { resolvedName: { $regex: searchRegex } },
            { resolvedBio: { $regex: searchRegex } },
            { resolvedGenres: { $regex: searchRegex } },
          ],
        },
      });
    }

    // Project fields matching frontend expected names
    pipeline.push({
      $project: {
        name: "$resolvedName",
        role: 1,
        profileImage: "$resolvedProfileImage",
        bio: "$resolvedBio",
        works: 1,
        genres: "$resolvedGenres",
      },
    });

    // If featured query param is true, get top 5 authors by book count
    if (featured === "true") {
      pipeline.push({ $sort: { works: -1, name: 1 } }) // Sort by works descending
      pipeline.push({ $limit: 5 }) // Limit to 5 authors
    } else {
      pipeline.push({ $sort: { name: 1 } }) // Standard sort alphabetically
    }

    const authors = await User.aggregate(pipeline)
    res.status(200).json({ authors })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAuthorById = async (req, res) => {
  try {
    const authorId = req.params.id

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ message: "Invalid author id" })
    }

    // Fetch author details (exclude password)
    const author = await User.findOne({
      _id: authorId,
      ...authorMatch, // Ensure user is an author
    }).select("name email profileImage bio role followers following")

    if (!author) {
      return res.status(404).json({ message: "Author not found" })
    }

    // Fetch profile details from AuthorProfile
    const profile = await AuthorProfile.findOne({ user: author._id })

    // Fetch all books by this author
    const books = await Book.find({ author: author._id })
      .sort({ createdAt: -1 }) // Newest books first
      .select("title coverImage price publishDate genres description pdfFile") // Include all details needed for BookCard

    const works = books.length // Total published books

    res.status(200).json({
      author: {
        _id: author._id,
        name: profile?.displayName || author.name,
        email: author.email,
        profileImage: profile?.profileImage || author.profileImage || "",
        bio: profile?.bio || author.bio || "",
        genres: profile?.genres || [],
        location: profile?.location || "",
        instagram: profile?.instagram || "",
        twitter: profile?.twitter || "",
        website: profile?.website || "",
        works, // Total books count
        followers: author.followers?.length || 0, // Follower count
        following: author.following?.length || 0, // Following count
        books, // Array of author's books
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get logged-in author's dashboard statistics
export const getAuthorDashboardStats = async (req, res) => {
  try {
    const authorId = req.user._id // Get logged-in user from auth middleware

    // Fetch all books by logged-in author
    const books = await Book.find({ author: authorId }).select(
      "price genres publishDate createdAt"
    )

    // Calculate total portfolio value (sum of all book prices)
    const totalValue = books.reduce(
      (sum, book) => sum + Number(book.price || 0),
      0
    )

    // Get all unique genres across author's books
    const allGenres = books.flatMap((book) => book.genres || [])
    const totalGenres = new Set(allGenres).size // Count unique genres

    // Find most recent published book
    const sortedBooks = books
      .slice()
      .sort(
        (a, b) =>
          new Date(b.publishDate || b.createdAt) -
          new Date(a.publishDate || a.createdAt)
      )

    // Fetch author details for followers/following counts
    const author = await User.findById(authorId).select(
      "followers following"
    )

    res.status(200).json({
      published: books.length, // Total published books
      totalValue, // Sum of all book prices
      totalGenres, // Unique genres count
      lastPublished:
        sortedBooks[0]?.publishDate || sortedBooks[0]?.createdAt || null, // Most recent book date
      followers: author?.followers?.length || 0, // Follower count
      following: author?.following?.length || 0, // Following count
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get logged-in author's recent activity (latest 5 books)
export const getAuthorActivity = async (req, res) => {
  try {
    const authorId = req.user._id // Get logged-in user from auth middleware

    // Fetch 5 most recent books by logged-in author
    const books = await Book.find({ author: authorId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(5) // Get only 5 recent books
      .select("title coverImage createdAt publishDate genres")

    res.status(200).json({ activity: books })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/*
Future Roadmap

1. Follower System
--------------------------------
- POST /api/users/:id/follow - Follow an author
- DELETE /api/users/:id/follow - Unfollow author
- GET /api/users/:id/followers - Get list of followers
- GET /api/users/following - Get list of following

2. Author Profile Update
--------------------------------
- PUT /api/authors/profile - Update author bio, name, profile image
- PUT /api/authors/profile-image - Upload new profile image

3. Advanced Statistics
--------------------------------
- Add views counter to Book model
- Add downloads counter to Book model
- GET /api/dashboard/views - Total views across books
- GET /api/dashboard/downloads - Total downloads
- GET /api/dashboard/analytics - Charts/graphs data

4. Author Rankings
--------------------------------
- GET /api/authors/trending - Top authors by book count
- GET /api/authors/most-followed - Most followed authors
- GET /api/authors/top-rated - Highest rated authors

5. Author Search & Filter
--------------------------------
- Add full-text search on author name/bio
- Filter authors by genre
- Filter by follower count

6. Real-time Updates
--------------------------------
- WebSocket for live follower notifications
- Live view/download counters
- Real-time book status updates

7. Author Collections
--------------------------------
- Create collections/series of books
- Organize books by theme
- Featured collections

8. Author Badges & Achievements
--------------------------------
- Milestone badges (10 books, 100 followers, etc)
- Top author badge
- Monthly leaderboard positions
*/