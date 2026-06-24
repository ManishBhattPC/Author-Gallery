import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import AuthorProfile from "../models/authorProfile.js"


// Simple email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // 1. Validate required fields
    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    // 2. Validate email format
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      })
    }

    // 3. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Validate required fields
    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Use generic "Invalid email or password" error for security (prevent username enumeration)
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days persistent cookie
    })

    const profile = await AuthorProfile.findOne({ user: user._id })

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: profile?.displayName || user.name,
        email: user.email,
        profileImage: profile?.profileImage || "",
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}