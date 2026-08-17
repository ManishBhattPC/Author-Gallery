import Comment from "../models/Comment.js";

/**
 * Get Comments for a Book or Chapter
 * @route GET /api/comments/book/:bookId
 * @access Public
 */
export const getCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { chapterNumber } = req.query;

    const query = { book: bookId };
    if (chapterNumber) {
      query.chapterNumber = Number(chapterNumber);
    }

    const comments = await Comment.find(query)
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error fetching comments" });
  }
};

/**
 * Post a Comment or Reply
 * @route POST /api/comments
 * @access Private
 */
export const postComment = async (req, res) => {
  try {
    const { bookId, chapterNumber, content, parentCommentId } = req.body;

    if (!bookId || !content) {
      return res.status(400).json({ message: "Book ID and Content are required" });
    }

    const comment = new Comment({
      book: bookId,
      chapterNumber: chapterNumber || 1,
      user: req.user._id,
      content,
      parentComment: parentCommentId || null,
    });

    await comment.save();
    await comment.populate("user", "name profileImage");

    res.status(201).json({ message: "Comment posted successfully", comment });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Server error posting comment" });
  }
};

/**
 * Toggle Like on Comment
 * @route POST /api/comments/:id/like
 * @access Private
 */
export const toggleLikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userIdStr = req.user._id.toString();
    const existingIndex = comment.likes.findIndex((u) => u.toString() === userIdStr);

    if (existingIndex > -1) {
      comment.likes.splice(existingIndex, 1);
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.status(200).json({ message: "Like updated", likesCount: comment.likes.length });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Server error updating comment like" });
  }
};
