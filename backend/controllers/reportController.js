import Report from "../models/Report.js";

// Submit a content report or general support ticket
export const submitReport = async (req, res) => {
  try {
    const { reason, description, book, author, name, email } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Reason for reporting/support is required" });
    }

    const reportData = {
      reason: reason.trim(),
      description: description ? description.trim() : "",
    };

    if (req.user) {
      // Authenticated user
      reportData.reporter = req.user._id;
      reportData.guestName = req.user.name;
      reportData.guestEmail = req.user.email;
    } else {
      // Unauthenticated guest user
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Name is required for guest support tickets" });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ message: "Email is required for guest support tickets" });
      }
      reportData.guestName = name.trim();
      reportData.guestEmail = email.trim();
    }

    if (book) reportData.book = book;
    if (author) reportData.author = author;

    const report = await Report.create(reportData);

    res.status(201).json({
      message: "Ticket submitted successfully. The administration team will review this shortly.",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
