import express from "express";
import { submitReport, getMyReports } from "../controllers/reportController.js";
import { optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/Optional protected route for submitting a support ticket/report
router.post("/", optionalProtect, submitReport);
router.get("/my-reports", protect, getMyReports);

export default router;
