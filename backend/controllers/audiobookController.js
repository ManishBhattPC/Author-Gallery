import Book from "../models/Book.js";
import AuthorProfile from "../models/authorProfile.js";
import User from "../models/User.js";

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Get Paginated List of Audiobooks
 * @route GET /api/audiobooks
 * @access Public
 */
export const getAudiobooks = async (req, res) => {
  try {
    const { search, genre, sortBy = "newest", page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.trim()) {
      const escapedSearch = escapeRegExp(search.trim());
      const searchRegex = new RegExp(escapedSearch, "i");

      const matchingUsers = await User.find({ name: { $regex: searchRegex } }).select("_id");
      const userIds = matchingUsers.map((u) => u._id);

      const matchingProfiles = await AuthorProfile.find({ displayName: { $regex: searchRegex } }).select("user");
      const profileUserIds = matchingProfiles.map((p) => p.user);

      const allAuthorIds = [...new Set([...userIds, ...profileUserIds])];

      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { narrator: { $regex: searchRegex } },
        { genres: { $regex: searchRegex } },
        { author: { $in: allAuthorIds } },
      ];
    }

    if (genre && genre !== "All") {
      query.genres = genre;
    }

    const sortOption = {};
    if (sortBy === "trending") {
      sortOption.views = -1;
      sortOption.downloads = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));

    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "book",
          as: "reviews",
        },
      },
      {
        $addFields: {
          author: {
            _id: "$authorDetails._id",
            name: "$authorDetails.name",
            email: "$authorDetails.email",
          },
          rating: { $ifNull: [{ $avg: "$reviews.rating" }, 4.8] },
          reviewsCount: { $size: "$reviews" },
        },
      },
      {
        $project: {
          authorDetails: 0,
          reviews: 0,
        },
      },
      { $sort: sortOption },
      { $skip: (pageNum - 1) * limitNum },
      { $limit: limitNum },
    ];

    const audiobooks = await Book.aggregate(pipeline);
    const totalAudiobooks = await Book.countDocuments(query);

    res.status(200).json({
      audiobooks,
      currentPage: pageNum,
      totalPages: Math.ceil(totalAudiobooks / limitNum) || 1,
      totalAudiobooks,
    });
  } catch (error) {
    console.error("Error fetching audiobooks:", error);
    res.status(500).json({ message: "Server error fetching audiobooks", error: error.message });
  }
};

/**
 * Get Single Audiobook by ID
 * @route GET /api/audiobooks/:id
 * @access Public
 */
export const getAudiobookById = async (req, res) => {
  try {
    const { id } = req.params;
    const audiobook = await Book.findById(id).populate("author", "name email");

    if (!audiobook) {
      return res.status(404).json({ message: "Audiobook not found" });
    }

    res.status(200).json(audiobook);
  } catch (error) {
    console.error("Error fetching audiobook by ID:", error);
    res.status(500).json({ message: "Server error fetching audiobook details" });
  }
};

/**
 * Create a New Audiobook Entry
 * @route POST /api/audiobooks
 * @access Private (Author)
 */
export const createAudiobook = async (req, res) => {
  try {
    const { title, description, genres, coverImage, pdfFile, narrator, totalDuration, chapters } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newAudiobook = new Book({
      title,
      description,
      genres: genres || ["Novel"],
      coverImage: coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      pdfFile: pdfFile || "https://res.cloudinary.com/demo/image/upload/sample.pdf",
      author: req.user._id,
      publishDate: new Date(),
      isAudiobook: true,
      narrator: narrator || req.user.name,
      totalDuration: totalDuration || "5h 30m",
      chapters: chapters || [
        { chapterNumber: 1, title: "Chapter 1: The Beginning", duration: 320, textContent: description }
      ],
    });

    await newAudiobook.save();
    res.status(201).json({ message: "Audiobook created successfully", audiobook: newAudiobook });
  } catch (error) {
    console.error("Error creating audiobook:", error);
    res.status(500).json({ message: "Server error creating audiobook" });
  }
};
