import express from "express";
import { submitReport } from "../controllers/reportController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/Optional protected route for submitting a support ticket/report
router.post("/", optionalProtect, submitReport);

export default router;
