import Report from "../models/Report.js";

// Submit a content report
export const submitReport = async (req, res) => {
  try {
    const { reason, description, book, author } = req.body;
    const reporterId = req.user._id;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Reason for reporting is required" });
    }

    // Removed restriction requiring a target book or author profile to allow general support tickets

    const reportData = {
      reporter: reporterId,
      reason: reason.trim(),
      description: description ? description.trim() : "",
    };

    if (book) reportData.book = book;
    if (author) reportData.author = author;

    const report = await Report.create(reportData);

    res.status(201).json({
      message: "Content reported successfully. The administration team will review this shortly.",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
