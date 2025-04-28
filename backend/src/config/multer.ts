import multer, { MulterError } from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "..", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "..", "uploads");
    const filePath = path.join(uploadDir, file.originalname);

    // prevent duplicate uploads
    if (fs.existsSync(filePath)) {
      const error = new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
      error.message = "File with the same name already exists";
      return cb(error, "");
    }

    const fileName = file.originalname;
    cb(null, fileName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //10mb
});
