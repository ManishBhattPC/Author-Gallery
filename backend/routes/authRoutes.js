import express from "express"
import { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  resendOTP, 
  googleLogin,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)
router.post("/login", loginUser)
router.post("/google", googleLogin)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

router.get("/profile", protect, (req, res) => {
  res.json(req.user)
})

export default router