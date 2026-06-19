import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory before Cloudinary upload

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB limit
  },
});

export default upload;

/*
Future Roadmap

1. File Type Validation
--------------------------------
- Images only for coverImage
- PDFs only for bookFile

2. Different Size Limits
--------------------------------
- Cover images
- PDF books

3. Malware Scanning
--------------------------------
- Validate uploaded files

4. Admin Upload Monitoring
--------------------------------
- Detect abuse
- Storage reporting
*/