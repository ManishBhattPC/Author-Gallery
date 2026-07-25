import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import AuthorProfile from "../models/authorProfile.js";
import RefreshToken from "../models/RefreshToken.js";
import OTP from "../models/OTP.js";
import PasswordReset from "../models/PasswordReset.js";
import { sendOTPEmail, sendResetPasswordOTPEmail } from "../utils/mailService.js";
import { OAuth2Client } from "google-auth-library";
import { promises as dnsPromises } from "dns";

// Strict email regex for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const DISPOSABLE_DOMAINS = new Set([
  "divahd.com",
  "mailinator.com",
  "yopmail.com",
  "tempmail.com",
  "10minutemail.com",
  "dispostable.com",
  "guerrillamail.com",
  "sharklasers.com",
  "getairmail.com",
  "trashmail.com",
  "maildrop.cc",
  "tempmailaddress.com",
  "disposablemail.com",
  "generator.email",
  "spambog.com",
  "spambog.de",
  "spambog.ru",
  "temp-mail.org",
  "fakeinbox.com",
  "throwawaymail.com",
  "mintemail.com",
  "disposable.com",
]);

const isDisposableEmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
};

const verifyEmailDomain = async (email) => {
  const domain = email.split("@")[1];
  if (!domain) return false;
  try {
    const addresses = await dnsPromises.resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch (error) {
    return false;
  }
};

const isProduction = process.env.NODE_ENV === "production" || !!process.env.FRONTEND_URL;

const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

const getAccessTokenCookieOptions = () => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };
};

const getRefreshTokenCookieOptions = () => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

const clearAccessTokenCookieOptions = () => {
  const opts = getAccessTokenCookieOptions();
  delete opts.maxAge;
  return opts;
};

const clearRefreshTokenCookieOptions = () => {
  const opts = getRefreshTokenCookieOptions();
  delete opts.maxAge;
  return opts;
};

const sendTokens = async (user, res, statusCode, message, customResponseData = {}) => {
  // 1. Generate short-lived Access Token (15m expiry)
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // 2. Generate long-lived Refresh Token (random hex string)
  const refreshTokenString = crypto.randomBytes(40).toString("hex");
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

  // 3. Save Refresh Token in MongoDB
  await RefreshToken.create({
    token: refreshTokenString,
    user: user._id,
    expiresAt: refreshTokenExpiry,
  });

  // 4. Set cookies
  res.cookie("token", accessToken, getAccessTokenCookieOptions());
  res.cookie("refreshToken", refreshTokenString, getRefreshTokenCookieOptions());

  // 5. Respond
  res.status(statusCode).json({
    message,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken, // for backward compatibility/frontend headers
      ...customResponseData,
    },
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Validate email format
    const trimmedEmail = email.trim();
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Strict validation of the email username (local part before @)
    const localPart = trimmedEmail.split("@")[0];
    if (localPart.length > 64) {
      return res.status(400).json({
        message: "Email username (before @) cannot exceed 64 characters",
      });
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return res.status(400).json({
        message: "Email username (before @) cannot start or end with a dot",
      });
    }

    if (localPart.includes("..")) {
      return res.status(400).json({
        message: "Email username (before @) cannot contain consecutive dots",
      });
    }

    if (/^\d+$/.test(localPart)) {
      return res.status(400).json({
        message: "Email username (before @) cannot consist entirely of numbers",
      });
    }

    // Validate if the email domain is disposable/temporary
    if (isDisposableEmail(trimmedEmail)) {
      return res.status(400).json({
        message: "Registration using temporary or disposable email addresses is not allowed.",
      });
    }

    // Verify email domain MX records
    const isDomainValid = await verifyEmailDomain(email.trim());
    if (!isDomainValid) {
      return res.status(400).json({
        message: "The email domain is invalid or cannot receive emails",
      });
    }

    // 3. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the pending registration inside the OTP collection
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        name: name.trim(),
        password: hashedPassword,
        otp,
        createdAt: new Date(), // Refresh the 10-minute expiry window
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send the OTP verification email in the background (non-blocking)
    sendOTPEmail(email.toLowerCase().trim(), otp).catch((err) => {
      console.error("Failed to send OTP verification email:", err);
    });

    res.status(200).json({
      message: "A verification code has been sent to your email.",
      email: email.toLowerCase().trim(),
      requiresVerification: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP code are required",
      });
    }

    const record = await OTP.findOne({ email: email.toLowerCase().trim() });

    if (!record) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({
        message: "Incorrect verification code",
      });
    }

    // Create active user
    const user = await User.create({
      name: record.name,
      email: record.email,
      password: record.password,
    });

    // Delete verification record
    await record.deleteOne();

    // Auto-login after verification using sendTokens helper
    await sendTokens(user, res, 201, "Verification successful. Registration complete.", {
      profileImage: "",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const record = await OTP.findOne({ email: email.toLowerCase().trim() });

    if (!record) {
      return res.status(400).json({
        message: "Registration session not found. Please sign up again.",
      });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    record.otp = newOtp;
    record.createdAt = new Date(); // Refresh expiration window
    await record.save();

    // Send OTP email in the background (non-blocking)
    sendOTPEmail(record.email, newOtp).catch((err) => {
      console.error("Failed to send OTP email in background:", err);
    });

    res.status(200).json({
      message: "New verification code sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Use generic "Invalid email or password" error for security (prevent username enumeration)
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const profile = await AuthorProfile.findOne({ user: user._id });

    await sendTokens(user, res, 200, "Login successful", {
      name: profile?.displayName || user.name,
      profileImage: profile?.profileImage || "",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken, password } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Google ID Token is required." });
    }

    let payload;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    // Developer simulation mode if no credentials exist or token starts with mock_
    if (!isProduction && (!googleClientId || googleClientId === "your-google-client-id" || idToken.startsWith("mock_"))) {
      console.log("Using Google OAuth simulation mode.");
      if (idToken.startsWith("mock_")) {
        const parts = idToken.split("_");
        const name = parts[1] ? parts[1].replace("-", " ") : "Mock User";
        const email = parts[2] || "mockuser@example.com";
        payload = { name, email, sub: `mock_google_id_${email}` };
      } else {
        return res.status(400).json({
          message: "Google Client ID not configured on server. Please use a mock token starting with 'mock_' in development mode."
        });
      }
    } else {
      // Real Google token verification
      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    }

    const { email, name } = payload;

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      if (!password) {
        return res.status(200).json({
          isNewUser: true,
          email: email.toLowerCase().trim(),
          name: name || "Google User",
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: name || "Google User",
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "user",
      });
    }

    const profile = await AuthorProfile.findOne({ user: user._id });

    await sendTokens(user, res, 200, "Google login successful", {
      name: profile?.displayName || user.name,
      profileImage: profile?.profileImage || "",
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({
      message: error.message || "Google authentication failed",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // 1. Verify email format
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email: trimmedEmail });
    
    // For security reasons, if user doesn't exist, we still return a generic success message
    if (!user) {
      return res.status(200).json({
        message: "If that email is registered, a password reset code has been sent.",
        email: trimmedEmail,
      });
    }

    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Save/update record in PasswordReset collection
    await PasswordReset.findOneAndUpdate(
      { email: trimmedEmail },
      { otp, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 5. Send Reset Password Email in the background
    sendResetPasswordOTPEmail(trimmedEmail, otp).catch((err) => {
      console.error("Failed to send password reset email:", err);
    });

    return res.status(200).json({
      message: "If that email is registered, a password reset code has been sent.",
      email: trimmedEmail,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP code, and new password are required.",
      });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // 1. Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    // 2. Find password reset record
    const record = await PasswordReset.findOne({ email: trimmedEmail });

    if (!record) {
      return res.status(400).json({
        message: "Invalid or expired verification code.",
      });
    }

    // 3. Verify OTP
    if (record.otp !== otp.trim()) {
      return res.status(400).json({
        message: "Incorrect verification code.",
      });
    }

    // 4. Find the user
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 5. Hash new password and update user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // 6. Delete reset record
    await record.deleteOne();

    return res.status(200).json({
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshTokenString = req.cookies.refreshToken;
    if (!refreshTokenString) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    const savedToken = await RefreshToken.findOne({ token: refreshTokenString }).populate("user");
    if (!savedToken) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    if (savedToken.expiresAt < new Date()) {
      await savedToken.deleteOne();
      return res.status(403).json({ message: "Refresh token has expired" });
    }

    // Generate new Access Token (15m expiry)
    const newAccessToken = jwt.sign(
      { id: savedToken.user._id, role: savedToken.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Rotate refresh token (highly secure: delete old, issue new)
    const newRefreshTokenString = crypto.randomBytes(40).toString("hex");
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    // Update refresh token in DB
    savedToken.token = newRefreshTokenString;
    savedToken.expiresAt = refreshTokenExpiry;
    await savedToken.save();

    // Set new cookies
    res.cookie("token", newAccessToken, getAccessTokenCookieOptions());
    res.cookie("refreshToken", newRefreshTokenString, getRefreshTokenCookieOptions());

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshTokenString = req.cookies.refreshToken;
    if (refreshTokenString) {
      // Delete from DB
      await RefreshToken.deleteOne({ token: refreshTokenString });
    }

    // Clear cookies
    res.clearCookie("token", clearAccessTokenCookieOptions());
    res.clearCookie("refreshToken", clearRefreshTokenCookieOptions());

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};