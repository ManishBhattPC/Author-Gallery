import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

// Helper to check if key is set up
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are missing in backend environment configurations.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

/**
 * Create a new Razorpay order
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

    // Check if user has already purchased the book
    const existingOrder = await Order.findOne({
      user: req.user._id,
      book: bookId,
      status: "paid",
    });

    if (existingOrder) {
      return res.status(400).json({ message: "You have already purchased this book" });
    }

    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round(book.price * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${bookId}_${req.user._id}_${Date.now()}`,
    };

    const rpOrder = await razorpay.orders.create(options);

    // Save order in database with status 'created'
    const order = await Order.create({
      user: req.user._id,
      book: bookId,
      amount: book.price,
      currency: "INR",
      razorpayOrderId: rpOrder.id,
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
 * Verify Razorpay payment signature
 * @route POST /api/payments/verify
 * @access Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification parameters are missing" });
    }

    // Cryptographic signature check
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
      // Payment matches signature!
      order.status = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      // Add book to user's purchased list
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { purchasedBooks: order.book },
      });

      // Fetch the full book details to return pdfFile / content links to the client
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
