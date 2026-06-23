import AuthorProfile from "../models/authorProfile.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js"; // Cloudinary upload

// Create Author Profile
export const createAuthorProfile = async (req, res) => {
  try {
    const existingProfile = await AuthorProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Author profile already exists",
      });
    }

    // Upload profile image to Cloudinary if provided
    let profileImageUrl = "";
    if (req.file) {
      const upload = await uploadToCloudinary(req.file.buffer, "author-profiles");
      profileImageUrl = upload.secure_url; // Cloudinary URL
    }

    let genresInput = req.body.genres || [];
    if (typeof genresInput === "string") {
      genresInput = [genresInput];
    }

    const profile = await AuthorProfile.create({
      user: req.user._id,
      displayName: req.body.displayName,
      age: req.body.age,
      gender: req.body.gender,
      genres: genresInput,
      bio: req.body.bio,
      location: req.body.location,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      website: req.body.website,
      profileImage: profileImageUrl, // Store Cloudinary URL
    });

    res.status(201).json({
      message: "Author profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged In Author Profile
export const getMyAuthorProfile = async (req, res) => {
  try {
    const profile = await AuthorProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        message: "Author profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Author Profile
export const updateAuthorProfile = async (req, res) => {
  try {
    const profile = await AuthorProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Author profile not found",
      });
    }

    // Update text fields
    if (req.body.displayName !== undefined) profile.displayName = req.body.displayName;
    if (req.body.age !== undefined) profile.age = req.body.age;
    if (req.body.gender !== undefined) profile.gender = req.body.gender;
    if (req.body.genres !== undefined) {
      let genresInput = req.body.genres;
      if (typeof genresInput === "string") {
        genresInput = [genresInput];
      }
      profile.genres = genresInput;
    }
    if (req.body.bio !== undefined) profile.bio = req.body.bio;
    if (req.body.location !== undefined) profile.location = req.body.location;
    if (req.body.instagram !== undefined) profile.instagram = req.body.instagram;
    if (req.body.twitter !== undefined) profile.twitter = req.body.twitter;
    if (req.body.website !== undefined) profile.website = req.body.website;

    // Upload profile image to Cloudinary if provided
    if (req.file) {
      const upload = await uploadToCloudinary(req.file.buffer, "author-profiles");
      profile.profileImage = upload.secure_url; // Store Cloudinary URL
    }

    const updatedProfile = await profile.save();

    res.status(200).json({
      message: "Author profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
Future Roadmap

1. Public Author Profile
   GET /api/authors/:id

2. Author Search
   GET /api/authors?search=yash

3. Author Genre Filter
   GET /api/authors?genre=fiction

4. Author Followers

5. Author Analytics

6. Author Verification

7. Author Banner Image
*/