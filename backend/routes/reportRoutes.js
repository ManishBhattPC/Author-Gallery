import express from "express";
import { submitReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route for submitting a report
router.post("/", protect, submitReport);

export default router;
