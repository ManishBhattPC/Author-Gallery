import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coverImage: {
      type: String,
    },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        volumeNumber: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Series = mongoose.model("Series", seriesSchema);
export default Series;
