import mongoose from "mongoose";

const bookshelfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["Want to Read", "Currently Reading", "Completed", "Favorites"],
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

bookshelfSchema.index({ user: 1, category: 1 }, { unique: true });

const Bookshelf = mongoose.model("Bookshelf", bookshelfSchema);
export default Bookshelf;
