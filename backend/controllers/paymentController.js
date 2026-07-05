import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { sendPurchaseRequestEmail } from "../utils/mailService.js";

// Helper to check if key is set up (optional now, since direct payments are primary)
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

/**
 * Request Direct Author Payment (Offline)
 * @route POST /api/payments/request
 * @access Private
 */
export const requestDirectPayment = async (req, res) => {
  try {
    const { bookId, whatsapp, address, note } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!whatsapp || !address) {
      return res.status(400).json({ message: "WhatsApp number and address are required" });
    }

    const book = await Book.findById(bookId).populate("author", "name email");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.price <= 0) {
      return res.status(400).json({ message: "Cannot purchase a free book" });
    }

    // Check if user has already requested or purchased the book
    const existingOrder = await Order.findOne({
      user: req.user._id,
      book: bookId,
      status: { $in: ["pending", "paid"] },
    });

    if (existingOrder) {
      if (existingOrder.status === "paid") {
        return res.status(400).json({ message: "You have already purchased this book" });
      } else {
        return res.status(400).json({ message: "Your purchase request is already pending author approval" });
      }
    }

    // Create the order with Direct payment method and Pending status
    const order = await Order.create({
      user: req.user._id,
      book: bookId,
      amount: book.price,
      currency: "INR",
      paymentMethod: "direct",
      status: "pending",
      whatsapp,
      address,
      note,
    });

    // Send notification email to the book's author
    if (book.author && book.author.email) {
      await sendPurchaseRequestEmail({
        authorEmail: book.author.email,
        authorName: book.author.name,
        buyerName: req.user.name,
        buyerEmail: req.user.email,
        bookTitle: book.title,
        bookPrice: book.price,
        whatsapp,
        address,
        note,
      });
    }

    res.status(201).json({
      success: true,
      message: "Purchase request sent to the author successfully.",
      order,
    });
  } catch (error) {
    console.error("Error creating direct payment request:", error);
    res.status(500).json({ message: error.message || "Failed to submit purchase request" });
  }
};

/**
 * Get pending purchase requests for books authored by the logged-in user
 * @route GET /api/payments/requests/author
 * @access Private
 */
export const getAuthorRequests = async (req, res) => {
  try {
    // Find all books authored by current user
    const books = await Book.find({ author: req.user._id });
    const bookIds = books.map((b) => b._id);

    // Find all pending direct orders for these books
    const requests = await Order.find({
      book: { $in: bookIds },
      paymentMethod: "direct",
      status: "pending",
    })
      .populate("user", "name email")
      .populate("book", "title price coverImage")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching author requests:", error);
    res.status(500).json({ message: error.message || "Failed to fetch purchase requests" });
  }
};

/**
 * Approve a purchase request and grant buyer access
 * @route POST /api/payments/requests/:id/approve
 * @access Private
 */
export const approveRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("book");
    if (!order) {
      return res.status(404).json({ message: "Purchase request not found" });
    }

    // Verify current user is the author of this book
    if (order.book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to approve this request" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: `Request cannot be approved. Current status is '${order.status}'` });
    }

    // Grant access & set status to paid
    order.status = "paid";
    await order.save();

    await User.findByIdAndUpdate(order.user, {
      $addToSet: { purchasedBooks: order.book._id },
    });

    res.status(200).json({
      success: true,
      message: "Request approved and book access granted successfully.",
    });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: error.message || "Failed to approve request" });
  }
};

/**
 * Decline/Reject a purchase request
 * @route POST /api/payments/requests/:id/decline
 * @access Private
 */
export const declineRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("book");
    if (!order) {
      return res.status(404).json({ message: "Purchase request not found" });
    }

    // Verify current user is the author of this book
    if (order.book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to decline this request" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: `Request cannot be declined. Current status is '${order.status}'` });
    }

    order.status = "failed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Purchase request declined successfully.",
    });
  } catch (error) {
    console.error("Error declining request:", error);
    res.status(500).json({ message: error.message || "Failed to decline request" });
  }
};

/**
 * Create a new Razorpay order (Kept for modularity / future use)
 * @route POST /api/payments/order
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.price <= 0) {
      return res.status(400).json({ message: "Cannot purchase a free book" });
    }

    const existingOrder = await Order.findOne({
      user: req.user._id,
      book: bookId,
      status: "paid",
    });

    if (existingOrder) {
      return res.status(400).json({ message: "You have already purchased this book" });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(503).json({ message: "Razorpay payment services are currently disabled." });
    }

    const amountInPaise = Math.round(book.price * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${bookId}_${req.user._id}_${Date.now()}`,
    };

    const rpOrder = await razorpay.orders.create(options);

    const order = await Order.create({
      user: req.user._id,
      book: bookId,
      amount: book.price,
      currency: "INR",
      razorpayOrderId: rpOrder.id,
      paymentMethod: "razorpay",
      status: "created",
    });

    res.status(201).json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      orderId: rpOrder.id,
      book: {
        title: book.title,
        price: book.price,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: error.message || "Failed to initiate payment order" });
  }
};

/**
 * Verify Razorpay payment signature (Kept for modularity / future use)
 * @route POST /api/payments/verify
 * @access Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification parameters are missing" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ message: "Transaction order not found in database" });
    }

    if (razorpay_signature === expectedSign) {
      order.status = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { purchasedBooks: order.book },
      });

      const book = await Book.findById(order.book);

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        pdfFile: book.pdfFile,
        content: book.content,
      });
    } else {
      order.status = "failed";
      await order.save();
      res.status(400).json({ success: false, message: "Cryptographic verification failed. Invalid signature." });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ message: error.message || "Payment verification encountered an internal error" });
  }
};

/**
 * Get orders purchased by the logged-in user (as a buyer)
 * @route GET /api/payments/orders/buyer
 * @access Private
 */
export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("book", "title price coverImage author")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
};
