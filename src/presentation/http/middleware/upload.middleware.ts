import multer from "multer";

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 mb
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, Only CSV files are allowed"));
    }
  },
});
