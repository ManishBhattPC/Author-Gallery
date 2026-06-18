import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Keep only relational source of truth
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Optional optimization (denormalized for UI speed)
    authorNames: [
      {
        type: String,
        trim: true,
      },
    ],

    coverImage: {
      type: String,
      default: null,
    },

    genre: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Romance",
        "Thriller",
        "Biography",
        "Science",
        "History",
        "Poetry",
        "Self-Help",
        "Other",
      ],
      default: "Other",
      index: true,
    },

    // Improved rating system
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    downloads: {
      type: Number,
      default: 0,
    },

    readCount: {
      type: Number,
      default: 0,
    },

    content: {
      type: String,
      default: "",
    },

    publishedDate: {
      type: Date,
      default: Date.now,
    },

    language: {
      type: String,
      default: "English",
    },

    tags: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;