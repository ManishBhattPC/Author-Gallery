import express from "express";
import { submitContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// Public route to submit a contact message
router.post("/", submitContactMessage);

export default router;
