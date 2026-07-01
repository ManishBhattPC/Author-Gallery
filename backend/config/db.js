import mongoose from "mongoose"
import User from "../models/User.js"
import AuthorProfile from "../models/authorProfile.js"
import Book from "../models/Book.js"
import bcrypt from "bcryptjs"

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Bhatt@2006";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Super Admin seeded successfully");
    }
  } catch (err) {
    console.error("Error seeding Super Admin:", err);
  }
};

const syncAuthorRoles = async () => {
  try {
    const profiles = await AuthorProfile.find().select("user");
    const userIdsWithProfile = profiles.map(p => p.user).filter(Boolean);

    const books = await Book.find().select("author");
    const userIdsWithBooks = books.map(b => b.author).filter(Boolean);

    const uniqueUserIds = Array.from(new Set([...userIdsWithProfile, ...userIdsWithBooks]));

    if (uniqueUserIds.length > 0) {
      const res = await User.updateMany(
        { _id: { $in: uniqueUserIds }, role: "user" },
        { role: "author" }
      );
      if (res.modifiedCount > 0) {
        console.log(`[Startup Migration] Synced roles: promoted ${res.modifiedCount} user(s) to "author" role.`);
      }
    }
  } catch (err) {
    console.error("Error syncing author roles on startup:", err);
  }
};

const dropDuplicateIndex = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const orderColExists = collections.some(col => col.name === "orders");
    if (orderColExists) {
      await mongoose.connection.db.collection("orders").dropIndex("razorpayOrderId_1");
      console.log("Successfully dropped legacy unique index 'razorpayOrderId_1' from orders collection.");
    }
  } catch (err) {
    if (err.code !== 27 && err.codeName !== "IndexNotFound") {
      console.warn("Index drop check result:", err.message);
    }
  }
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to primary MongoDB URI...");
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected to Atlas successfully");
    await dropDuplicateIndex();
    await seedAdmin();
    await syncAuthorRoles();
  } catch (error) {
    console.log("Primary MongoDB Atlas connection failed:", error.message);
    console.log("Attempting connection to local fallback MongoDB (127.0.0.1:27017)...");
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/author-gallery");
      console.log("Connected to local MongoDB successfully");
      await dropDuplicateIndex();
      await seedAdmin();
      await syncAuthorRoles();
    } catch (localError) {
      console.error("Local MongoDB connection also failed:", localError.message);
    }
  }
}

export default connectDB