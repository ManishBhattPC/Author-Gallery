import express from "express";
import { getPublicSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.get("/public", getPublicSettings);

export default router;
