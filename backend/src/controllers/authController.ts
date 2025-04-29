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
    console.log("=== Passport Callback ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session:", req.session);
    console.log("User:", req.user);
    console.log("Is Authenticated:", req.isAuthenticated());
    console.log("Cookies:", req.cookies);

    if (req.isAuthenticated() && req.user) {
      console.log("User authenticated in callback:", req.user);
      // Don't regenerate session - it could be losing the passport session data
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.redirect(`${FRONTEND_URL}/login?error=session`);
        }

        // Set a timestamp to confirm session was saved
        // req.session.lastLogin = new Date().toISOString();

        // Redirect to frontend with success
        res.redirect(`${FRONTEND_URL}?auth=success`);
      });
    } else {
      console.log("No user in callback");
      res.redirect(`${FRONTEND_URL}/login?error=nouser`);
    }
  } catch (err) {
    console.error("Error in passport callback:", err);
    res.redirect(`${FRONTEND_URL}/login?error=callback`);
  }
};

export const getUser = (
  req: Request & { session: CustomSession },
  res: Response
) => {
  try {
    console.log("=== Get User Request ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session:", req.session);
    console.log("User:", req.user);
    console.log("Is Authenticated:", req.isAuthenticated());
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);

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
