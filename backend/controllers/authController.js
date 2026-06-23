import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email
  })
}
export const loginUser = async (req, res) => {
  const {email,password}= req.body
  const user = await User.findOne({email})

  if(!user){
    return res.status(404).json({
       message:"user illeeee"    //  there i have to change this message
    })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
  return res.status(401).json({
    message: "Invalid credentials"
  })
}const token = jwt.sign(
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

return res.status(200).json({
  message: "Login successful",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email
  }
})
}