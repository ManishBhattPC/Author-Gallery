import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Book from "../models/Book.js";

dotenv.config();

const cleanupCovers = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log("Connecting to primary MongoDB URI...");
    try {
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB successfully.");
    } catch (err) {
      console.log("Primary MongoDB connection failed, attempting local fallback (127.0.0.1:27017)...");
      await mongoose.connect("mongodb://127.0.0.1:27017/author-gallery");
      console.log("Connected to local MongoDB successfully.");
    }

    const books = await Book.find({});
    console.log(`Found ${books.length} books in the database. Validating covers...`);

    let cleanedCount = 0;

    for (const book of books) {
      if (book.coverImage && book.coverImage.startsWith("http")) {
        try {
          // Perform a fast HEAD request to check if the asset is active
          await axios.head(book.coverImage, { timeout: 4000 });
        } catch (err) {
          // If 404, the image doesn't exist on Cloudinary anymore
          if (err.response && err.response.status === 404) {
            console.log(`[Broken Cover] Resetting orphaned cover for: "${book.title}"`);
            book.coverImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500";
            await book.save();
            cleanedCount++;
          }
        }
      }
    }

    console.log(`\nCleanup completed successfully! Reset ${cleanedCount} broken book covers.`);
    process.exit(0);
  } catch (error) {
    console.error("Database connection or processing error:", error);
    process.exit(1);
  }
};

cleanupCovers();
