import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    genres: {
      type: [String],
      enum: [
        "Novel",
        "Fiction",
        "Non-Fiction",
        "Romance",
        "Thriller",
        "Mystery",
        "Fantasy",
        "Science Fiction",
        "Biography",
        "History",
        "Poetry",
        "Spiritual",
        "Self-Help",
        "Education",
        "Business",
        "Technology",
        "Children",
        "Other",
      ],

      validate: {
        validator: (genres) => genres.length > 0,
        message: "At least one genre is required",
      },

      index: true,
    },

    // Cloudinary image URL
    coverImage: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary PDF URL
    pdfFile: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    publishDate: {
      type: Date,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;

/*
Future Roadmap

1. Views & Downloads
--------------------------------
Add fields:

views: {
  type: Number,
  default: 0,
}

downloads: {
  type: Number,
  default: 0,
}

2. Reviews & Ratings
--------------------------------
Create separate Review model.

Review:
- user
- book
- rating
- comment

Do NOT store review arrays directly in Book.

3. Followers System
--------------------------------
Implement in User model.

User:
- followers
- following

Not a Book responsibility.

4. Payments & Orders
--------------------------------
Create Order model.

Order:
- user
- book
- amount
- payment status

Sales should be calculated from orders.

5. Analytics
--------------------------------
Generate analytics from:
- views
- downloads
- followers
- orders

Do not store analytics directly in Book.

6. Cloudinary
--------------------------------
coverImage -> Cloudinary image URL
pdfFile -> Cloudinary PDF URL

Integrate after Book CRUD is completed and tested.
*/