import { Request, Response } from "express";

export const passportCallback = (req: Request, res: Response) => {
  try {
    console.log("=== Passport Callback ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session:", req.session);
    console.log("User:", req.user);
    console.log("Is Authenticated:", req.isAuthenticated());
    
    if (req.user) {
      console.log("User authenticated in callback:", req.user);
      // Ensure the session is saved before redirect
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.redirect("https://g-drive-assignment.vercel.app/login");
        }
        res.redirect("https://g-drive-assignment.vercel.app");
      });
    } else {
      console.log("No user in callback");
      res.redirect("https://g-drive-assignment.vercel.app/login");
    }
  } catch (err) {
    console.error("Error in passport callback:", err);
    res.redirect("https://g-drive-assignment.vercel.app/login");
  }
};

export const getUser = (req: Request, res: Response) => {
  try {
    console.log("=== Get User Request ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session:", req.session);
    console.log("User:", req.user);
    console.log("Is Authenticated:", req.isAuthenticated());
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);
    
    if (req.isAuthenticated()) {
      console.log("User is authenticated");
      res.json({ status: true, user: req.user });
    } else {
      console.log("User is not authenticated");
      res.status(401).json({ status: false, message: "Unauthorized: please login" });
    }
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
