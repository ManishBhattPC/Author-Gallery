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


dotenv.config()

connectDB()

const app = express()



const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use("/api/books", bookRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/authors", authorRoutes)
app.use("/api/author-profile", authorProfileRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/reports", reportRoutes)


app.get("/", (req, res) => {
  res.send("Author Gallery API is running...")
})


// app.use("/api/books", bookRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})