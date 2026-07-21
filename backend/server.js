import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import authorProfileRoutes from "./routes/authorProfileRoutes.js";
import authorRoutes from "./routes/authorRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

dotenv.config()

connectDB()

const app = express()

// Enforce secure HTTP headers via helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// Rate limiting configurations (Free & open-source in-memory shielding)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 auth requests per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again after 15 minutes." }
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // max 200 general requests per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again after 15 minutes." }
})

app.use("/api/auth", authLimiter)
app.use("/api", apiLimiter)

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://author-gallery.onrender.com"
];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(",").forEach(url => {
    const cleaned = url.trim().replace(/\/$/, "");
    if (cleaned && !allowedOrigins.includes(cleaned)) {
      allowedOrigins.push(cleaned);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
)

import settingsRoutes from "./routes/settingsRoutes.js";

app.use(cookieParser())
app.use(express.json())
app.use("/api/settings", settingsRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/authors", authorRoutes)
app.use("/api/author-profile", authorProfileRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/payments", paymentRoutes)


app.get("/", (req, res) => {
  res.send("Author Gallery API is running...")
})


// app.use("/api/books", bookRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})