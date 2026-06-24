import mongoose from "mongoose"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Bhatt@2006", 10);
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

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected")
    await seedAdmin();
  } catch (error) {
    console.log(error)
  }
}

export default connectDB