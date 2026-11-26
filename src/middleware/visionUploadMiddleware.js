
import multer from "multer";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const visionUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG and WEBP images are allowed")
      );
    }

    cb(null, true);
  }
});

export default visionUpload;
