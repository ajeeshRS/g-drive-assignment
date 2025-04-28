import express from "express";
import {
  deleteFile,
  getAllFiles,
  renameFile,
  searchFile,
  uploadFile,
} from "../controllers/fileController";
import { upload } from "../config/multer";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);

router.put("/rename", renameFile);

router.delete("/delete", deleteFile);

router.get("/search", searchFile);

router.get("/", getAllFiles);

export default router;
