import express from "express";
import {
  getDiscussions,
  createDiscussion,
  replyToDiscussion,
} from "../controllers/discussionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", protect, createDiscussion);
router.post("/:id/reply", protect, replyToDiscussion);

export default router;
