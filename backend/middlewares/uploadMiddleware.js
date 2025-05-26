// middlewares/uploadMiddleware.js
import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = file.mimetype === "application/pdf";

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."));
  }
};

// Initialize upload middleware for PDFs
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
});
