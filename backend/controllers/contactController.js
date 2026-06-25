import ContactMessage from "../models/ContactMessage.js";
import { sendContactEmail } from "../utils/mailService.js";

// Handle contact form submission
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    // 1. Save message to database
    const savedMessage = await ContactMessage.create(contactData);

    // 2. Send email to admin/owner in the background (non-blocking to prevent timeout errors if SMTP is slow/invalid)
    sendContactEmail(contactData).catch((err) => {
      console.error("Failed to send contact email in background:", err);
    });

    res.status(201).json({
      message: "Your message has been sent successfully. We will contact you soon!",
      savedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
