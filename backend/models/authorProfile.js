import mongoose from "mongoose";

const authorProfileSchema = new mongoose.Schema(
  {
    // Reference to logged-in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Public author name / pen name
    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
    },

    gender: {
      type: String,
      trim: true,
    },

    genres: [
      {
        type: String,
        trim: true,
      },
    ],

    bio: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    instagram: {
      type: String,
      trim: true,
    },

    twitter: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },
 
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const AuthorProfile = mongoose.model(
  "AuthorProfile",
  authorProfileSchema
);

export default AuthorProfile;

/*
Future Roadmap

1. Followers / Following
   - followerCount
   - followingCount

2. Verification
   - isVerified

3. Author Analytics
   - totalViews
   - totalDownloads
   - totalSales

4. Social Links
   - youtube
   - facebook
   - linkedin

5. Author Banner
   - bannerImage

6. Public Profile URL
   - slug
*/