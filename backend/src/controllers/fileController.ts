import { Request, Response } from "express";
import { File } from "../models/fileSchema";
import { promises as fs } from "fs";
import path from "path";
import { User } from "../models/userSchema";

interface User {
  id: string;
  email: string;
  name: string;
  photo: string;
}

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const user: User = req.user as User;

    if (!req.file) {
      res.status(400).json({ success: false, message: "no file uploaded" });
      return;
    }

    console.log(req.file);

    const isFileAlreadyExists = await File.findOne({
      fileName: req.file.filename,
    });

    if (isFileAlreadyExists) {
      console.error("file already exists");

      await fs.unlink(req.file.path);
      console.log(`deleted uploaded file: ${req.file.path}`);

      res.status(409).json({ success: false, message: "file already exists" });
      return;
    }

    const userDetails = await User.findOne({ googleId: user.id });

    console.log({ userDetails });

    const newFile = new File({
      userId: userDetails?._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      path: req.file.path,
    });

    await newFile.save();

    res.status(200).json({
      success: true,
      message: "file uploaded successfully",
      newFile,
    });
  } catch (err) {
    console.error("Error uploading file : ", err);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
};

export const renameFile = async (req: Request, res: Response) => {
  try {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      res.status(400).json({
        success: false,
        message: "both old name and new name is required",
      });
      return;
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", oldName);
    const newFilePath = path.join(__dirname, "..", "..", "uploads", newName);

    try {
      await fs.access(filePath);
    } catch (err) {
      res.status(404).json({
        success: false,
        message: "file does not exist",
      });
      return;
    }

    await fs.rename(filePath, newFilePath);

    const updatedFile = await File.updateOne(
      {
        fileName: oldName,
      },
      { $set: { fileName: newName, originalName: newName, path: newFilePath } }
    );

    console.log("filename updated : ", updatedFile);

    res
      .status(200)
      .json({ success: true, message: "File renamed successfully" });
  } catch (err) {
    console.error("Error renaming file : ", err);
    res.status(500).json({ success: false, message: "Error renaming file" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      res.status(400).json({
        success: false,
        message: "File name is required to delete file",
      });
      return;
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", fileName);

    try {
      fs.access(filePath);
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "file does not exist",
      });
      return;
    }

    await fs.rm(filePath);

    const deletedFile = await File.deleteOne({
      fileName,
    });

    console.log("File deleted success : ", deletedFile);

    res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file : ", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete the file" });
  }
};

export const searchFile = async (req: Request, res: Response) => {
  try {
    const { searchQuery } = req.query;

    console.log(searchQuery);

    if (!searchQuery || typeof searchQuery !== "string") {
      res.status(400).json({
        success: false,
        message: "Keyword is required for searching",
      });
      return;
    }

    const files = await File.find({
      fileName: { $regex: searchQuery, $options: "i" },
    });

    res.status(200).json({
      success: true,
      files,
    });
  } catch (err) {
    console.error("Error searching file : ", err);
    res.status(500).json("Error searching file");
  }
};

export const getAllFiles = async (req: Request, res: Response) => {
  try {
    const user: User = req.user as User;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const id = user.id;

    const userDetail = await User.findOne({ googleId: id });

    const files = await File.find({ userId: userDetail?._id });
    console.log({ files });

    res
      .status(200)
      .json({ status: true, message: "Files fetched successfully", files });
  } catch (err) {
    console.error("Error getting all files : ", err);
    res.status(500).json({ success: false, message: "Error getting files" });
  }
};
