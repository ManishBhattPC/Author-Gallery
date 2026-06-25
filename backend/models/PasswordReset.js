import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Document will auto-delete in 10 minutes (600 seconds)
    },
  },
  { timestamps: true }
);

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);
export default PasswordReset;
