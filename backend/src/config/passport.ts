import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userSchema";

export const initializePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.CALLBACK_URL || "",
        scope: ["profile", "email"],
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (profile.emails) {
            const isUserExists = await User.findOne({
              email: profile.emails[0].value,
            });

            if (!isUserExists) {
              const newUser = new User({
                email: profile.emails[0].value,
                googleId: profile.id,
                name: profile.displayName,
                avatar: profile.photos?.[0].value,
              });

              await newUser.save();
              return done(null, newUser);
            }

            return done(null, isUserExists);
          }
          return done(new Error("No email found in profile"), undefined);
        } catch (err) {
          console.error("Error in Google Strategy:", err);
          return done(err as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    console.log("Serializing user:", user);
    // Store the entire user object in the session
    done(null, user);
  });

  passport.deserializeUser(async (user: any, done) => {
    console.log("Deserializing user:", user);
    // The user object is already complete, just pass it through
    done(null, user);
  });
};
