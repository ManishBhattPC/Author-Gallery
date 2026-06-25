import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.cookies.token; // Read JWT from cookie
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next(); // Continue to controller
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Not authorized as an admin",
    });
  }
};

/*
Future Roadmap

1. Admin Authorization
--------------------------------
Add role-based access control.

Example:
- Author
- Admin

2. Admin Middleware
--------------------------------
Separate middleware for admin-only routes.

3. Refresh Tokens
--------------------------------
Support long-term authentication.

Current Version:
- Cookie-based JWT authentication
- Authenticated user attached to req.user
*/