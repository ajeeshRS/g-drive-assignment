import { Request, Response, NextFunction } from "express";
import multer from "multer";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error("Global Error Handler:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err instanceof Error) {
    // General error
    return res.status(500).json({ success: false, message: err.message });
  }

  // Unknown error type
  res.status(500).json({ success: false, message: "Something went wrong" });
}