import Discussion from "../models/Discussion.js";

/**
 * Get Discussion Forum Threads
 * @route GET /api/discussions
 * @access Public
 */
export const getDiscussions = async (req, res) => {
  try {
    const { genre, search } = req.query;
    const query = {};

    if (genre && genre !== "All") {
      query.genre = genre;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const discussions = await Discussion.find(query)
      .populate("author", "name profileImage")
      .populate("replies.user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ message: "Server error fetching discussions" });
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
