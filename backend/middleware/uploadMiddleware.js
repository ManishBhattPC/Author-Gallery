import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory before Cloudinary upload

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "coverImage" || file.fieldname === "profileImage") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for covers and profiles!"), false);
    }
  } else if (file.fieldname === "pdfFile") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for eBooks!"), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB limit
  },
  fileFilter,
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