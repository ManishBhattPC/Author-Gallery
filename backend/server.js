import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

connectDB()

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Author Gallery API is running...")
})

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})