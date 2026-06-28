import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayOrderId: {
      type: String,
      required: false,
    },
    razorpayPaymentId: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "direct"],
      default: "direct",
    },
    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed"],
      default: "pending",
    },
    whatsapp: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
