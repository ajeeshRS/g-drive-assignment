import { NextFunction, Response, Request } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Please login" });
    return;
  }
  next();
};
