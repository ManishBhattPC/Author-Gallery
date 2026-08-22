import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    genre: {
      type: String,
      default: "General",
    },
    tags: [String],
    replies: [replySchema],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

discussionSchema.index({ createdAt: -1 });
discussionSchema.index({ genre: 1, createdAt: -1 });

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;
