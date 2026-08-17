import express from "express";
import {
  checkGrammar,
  generatePlotIdeas,
  summarizeChapter,
} from "../controllers/aiAssistantController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/grammar-check", checkGrammar);
router.post("/plot-prompts", generatePlotIdeas);
router.post("/summarize-chapter", summarizeChapter);

export default router;
