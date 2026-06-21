import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
})

// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret Exists:", !!process.env.CLOUDINARY_API_SECRET);

export default cloudinary

/*
Future Roadmap

1. Separate folders
   - book-covers
   - book-pdfs

2. Automatic file deletion
   - Remove old files when books are updated

3. Admin cleanup tools
   - Remove orphaned uploads

4. File optimization
   - Image compression
   - PDF validation
*/