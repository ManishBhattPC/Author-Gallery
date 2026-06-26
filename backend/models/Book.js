import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

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

    content: {
      type: String,
      required: false,
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

const signCloudinaryPdfUrl = (url) => {
  if (!url) return url;

  // If the URL is not from Cloudinary, or is not authenticated/private, return it as-is
  if (!url.includes("res.cloudinary.com") || (!url.includes("/authenticated/") && !url.includes("/private/"))) {
    return url;
  }

  try {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const parts = cleanUrl.split("/");
    const uploadIndex = parts.findIndex((p) =>
      ["upload", "private", "authenticated"].includes(p)
    );
    if (uploadIndex === -1) return url;

    // Get the resource type (e.g., "image", "raw")
    const resourceType = parts[uploadIndex - 1] || "image";

    // Extract public ID (everything after the uploadIndex)
    let remainingParts = parts.slice(uploadIndex + 1);

    // Shift off signature segment(s) (s--...--) and version segment(s) (v...) from the front
    while (remainingParts.length > 0) {
      const first = remainingParts[0];
      if (/^s--.*--$/.test(first) || /^v\d+$/.test(first)) {
        remainingParts.shift();
      } else {
        break;
      }
    }

    const publicIdWithExt = remainingParts.join("/");
    const extMatch = publicIdWithExt.match(/\.[^/.]+$/);
    const ext = extMatch ? extMatch[0] : "";
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    // Generate signed URL
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      type: "authenticated",
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes (600 seconds)
      secure: true,
      format: ext ? ext.substring(1) : undefined
    });
  } catch (error) {
    console.error("Error signing Cloudinary PDF URL:", error);
    return url;
  }
};

bookSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.pdfFile) {
      ret.pdfFile = signCloudinaryPdfUrl(ret.pdfFile);
    }
    return ret;
  },
});

bookSchema.set("toObject", {
  transform: (doc, ret) => {
    if (ret.pdfFile) {
      ret.pdfFile = signCloudinaryPdfUrl(ret.pdfFile);
    }
    return ret;
  },
});

// Pre-deleteOne hook to delete assets from Cloudinary when a book document is deleted
bookSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    if (this.coverImage) {
      await deleteFromCloudinary(this.coverImage);
    }
    if (this.pdfFile) {
      await deleteFromCloudinary(this.pdfFile);
    }
    next();
  } catch (error) {
    console.error("Error in Book pre-deleteOne middleware:", error);
    next(error);
  }
});

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