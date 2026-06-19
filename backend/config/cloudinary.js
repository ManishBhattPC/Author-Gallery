import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

export default cloudinary;

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