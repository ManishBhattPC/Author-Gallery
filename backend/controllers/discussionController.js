import Discussion from "../models/Discussion.js";

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Get Paginated Discussion Forum Threads
 * @route GET /api/discussions
 * @access Public
 */
export const getDiscussions = async (req, res) => {
  try {
    const { genre, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (genre && genre !== "All") {
      query.genre = genre;
    }

    if (search && search.trim()) {
      const safeSearch = escapeRegExp(search.trim());
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [discussions, totalDiscussions] = await Promise.all([
      Discussion.find(query)
        .populate("author", "name profileImage")
        .populate("replies.user", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Discussion.countDocuments(query),
    ]);

    res.status(200).json({
      discussions,
      currentPage: pageNum,
      totalPages: Math.ceil(totalDiscussions / limitNum) || 1,
      totalDiscussions,
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ message: "Server error fetching discussions" });
  }
};

/**
 * Get Single Discussion Thread by ID and Increment View Count
 * @route GET /api/discussions/:id
 * @access Public
 */
export const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await Discussion.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name profileImage role")
      .populate("replies.user", "name profileImage role")
      .lean();

    if (!discussion) {
      return res.status(404).json({ message: "Discussion thread not found" });
    }

    res.status(200).json(discussion);
  } catch (error) {
    console.error("Error fetching discussion thread:", error);
    res.status(500).json({ message: "Server error fetching thread" });
  }
};

/**
 * Create a New Discussion Thread
 * @route POST /api/discussions
 * @access Private
 */
export const createDiscussion = async (req, res) => {
  try {
    const { title, content, genre, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and Content are required" });
    }

    const discussion = new Discussion({
      title,
      content,
      author: req.user._id,
      genre: genre || "General",
      tags: tags || [],
    });

    await discussion.save();
    await discussion.populate("author", "name profileImage");

    res.status(201).json({ message: "Discussion created successfully", discussion });
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ message: "Server error creating discussion" });
  }
};

/**
 * Reply to a Discussion Thread
 * @route POST /api/discussions/:id/reply
 * @access Private
 */
export const replyToDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    discussion.replies.push({
      user: req.user._id,
      content,
    });

    await discussion.save();
    await discussion.populate("replies.user", "name profileImage");

    res.status(200).json({ message: "Reply posted", discussion });
  } catch (error) {
    console.error("Error replying to discussion:", error);
    res.status(500).json({ message: "Server error posting reply" });
  }
};
