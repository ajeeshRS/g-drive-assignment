import express from "express";
import { getUser, passportCallback } from "../controllers/authController";
import passport from "passport";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  passportCallback
);

router.get("/user", getUser);

export default router;
