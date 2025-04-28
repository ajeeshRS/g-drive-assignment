import { Request, Response } from "express";

export const passportCallback = (req: Request, res: Response) => {
  try {
    res.redirect("https://g-drive-assignment.vercel.app");
  } catch (err) {
    console.error("Error logging in : ", err);
  }
};

export const getUser = (req: Request, res: Response) => {
  try {
    console.log("i am here");
    console.log(req.user)
    if (req.isAuthenticated()) {
      res.json({ status: "true", user: req.user });
    } else {
      res.json({ status: false, message: "Unauthorized: please login" });
    }
  } catch (err) {
    console.error("Error getting user : ", err);
  }
};
