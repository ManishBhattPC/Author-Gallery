import express from "express"
import { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  resendOTP, 
  googleLogin 
} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)
router.post("/login", loginUser)
router.post("/google", googleLogin)

router.get("/profile", protect, (req, res) => {
  res.json(req.user)
})

export default router