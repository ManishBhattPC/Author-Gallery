import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AuthorProfile from "../models/authorProfile.js";
import OTP from "../models/OTP.js";
import { sendOTPEmail } from "../utils/mailService.js";
import { OAuth2Client } from "google-auth-library";
import { promises as dnsPromises } from "dns";

// Strict email regex for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

    // Create active user directly
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
    });

    // Auto-login after registration
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: "",
      },
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

    // Auto-login after verification
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Verification successful. Registration complete.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: "",
      },
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

    await sendOTPEmail(record.email, newOtp);

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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days persistent cookie
    });

    const profile = await AuthorProfile.findOne({ user: user._id });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: profile?.displayName || user.name,
        email: user.email,
        profileImage: profile?.profileImage || "",
        role: user.role,
      },
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
    if (!googleClientId || googleClientId === "your-google-client-id" || idToken.startsWith("mock_")) {
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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const profile = await AuthorProfile.findOne({ user: user._id });

    return res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        name: profile?.displayName || user.name,
        email: user.email,
        profileImage: profile?.profileImage || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({
      message: error.message || "Google authentication failed",
    });
  }
};