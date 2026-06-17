import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
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
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Book = mongoose.model("Book", bookSchema)

export default Book
