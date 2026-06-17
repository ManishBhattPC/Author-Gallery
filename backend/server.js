import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"


dotenv.config()

connectDB()

const app = express()

app.use(cookieParser())

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Author Gallery API is running...")
});

const PORT = process.env.PORT || 5000

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})