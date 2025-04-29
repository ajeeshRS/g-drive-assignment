import { Request, Response } from "express";
import { Session } from "express-session";

interface CustomSession extends Session {
  user?: any;
}

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://g-drive-assignment.vercel.app";

export const passportCallback = (
  req: Request & { session: CustomSession },
  res: Response
) => {
  try {
    if (req.isAuthenticated() && req.user) {
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.redirect(`${FRONTEND_URL}/login?error=session`);
        }

        res.redirect(`${FRONTEND_URL}?auth=success`);
      });
    } else {
      res.redirect(`${FRONTEND_URL}/login?error=nouser`);
    }
  } catch (err) {
    res.redirect(`${FRONTEND_URL}/login?error=callback`);
  }
};

export const getUser = (
  req: Request & { session: CustomSession },
  res: Response
) => {
  try {
    if (req.isAuthenticated() || req.session.user) {
      const user = req.user || req.session.user;

      console.log("User is authenticated");
      res.json({ status: true, user });
    } else {
      console.log("User is not authenticated");
      res
        .status(401)
        .json({ status: false, message: "Unauthorized: please login" });
    }
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
