import cloudinary from "../config/cloudinary.js";

/*
Uploads file buffer to Cloudinary
Used for both:
- cover images
- PDF files
*/
const uploadToCloudinary = async (fileBuffer, folder) => {
  try {
    return new Promise((resolve, reject) => {
      const isPdf = folder === "book-pdfs";
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder, // e.g. "book-covers" or "book-pdfs"
          resource_type: "auto", // detects image or pdf automatically
          type: isPdf ? "authenticated" : "upload",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(fileBuffer);
    });
  } catch (error) {
    throw error;
  }
};

export default uploadToCloudinary;

/*
Future Roadmap

1. File optimization
   - compress images before upload
   - validate PDF size

2. Separate upload services
   - imageUploadService
   - pdfUploadService

3. Retry mechanism
   - handle failed uploads

4. Admin cleanup tools
   - delete unused Cloudinary files
*/