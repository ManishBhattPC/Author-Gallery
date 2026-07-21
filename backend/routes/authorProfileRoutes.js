import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  createAuthorProfile,
  getMyAuthorProfile,
  updateAuthorProfile,
} from "../controllers/authorProfileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

import { checkMaintenance } from "../middleware/maintenanceMiddleware.js";

// Create author profile
router.post(
  "/",
  protect,
  checkMaintenance,
  upload.single("profileImage"),
  createAuthorProfile
);

// Get logged-in author's profile
router.get(
  "/me",
  protect,
  getMyAuthorProfile
);

// Update logged-in author's profile
router.put(
  "/me",
  protect,
  checkMaintenance,
  upload.single("profileImage"),
  updateAuthorProfile
);

export default router;

/*
Routes

POST   /api/author-profile
GET    /api/author-profile/me
PUT    /api/author-profile/me

All routes require authentication.

Current Features
--------------------------------
- Create author profile
- Get logged-in author profile
- Update author profile
- Profile image upload support

Future Roadmap
--------------------------------
1. Public Author Profile
   GET /api/authors/:id

2. Author Search
   GET /api/authors?search=yash

3. Genre Filtering
   GET /api/authors?genre=fiction

4. Followers / Following

5. Author Analytics

6. Author Verification Badge

7. Author Banner Image

8. Public Author URL Slug
*/