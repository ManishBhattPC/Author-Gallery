import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    guestName: {
      type: String,
      trim: true,
      default: "",
    },
    guestEmail: {
      type: String,
      trim: true,
      default: "",
    },
    // Optional - a report can be for a book...
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      default: null,
    },
    // ...or for an author profile
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
