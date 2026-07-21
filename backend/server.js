import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import authorProfileRoutes from "./routes/authorProfileRoutes.js"
import authorRoutes from "./routes/authorRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"

dotenv.config()

connectDB()

const app = express()

// 1. CORS Configuration (Must be first to handle all preflight OPTIONS requests)
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

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 2. Security Headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// 3. Body & Cookie Parsers
app.use(cookieParser())
app.use(express.json())

// 4. Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 auth requests per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again after 15 minutes." }
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // max 300 general requests per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again after 15 minutes." }
})

app.use("/api/auth", authLimiter)
app.use("/api", apiLimiter)

// 5. API Routes
app.use("/api/settings", settingsRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/authors", authorRoutes)
app.use("/api/author-profile", authorProfileRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/payments", paymentRoutes)

app.get("/", (req, res) => {
  res.send("Author Gallery API is running...")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})