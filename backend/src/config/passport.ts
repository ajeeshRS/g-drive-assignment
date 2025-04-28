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
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile :", profile);

        if (profile.emails) {
          const isUserExists = await User.findOne({
            email: profile.emails[0].value,
          });

          console.log("existing user : ", isUserExists);
          if (!isUserExists) {
            const newUser = new User({
              email: profile.emails[0].value,
              googleId: profile.id,
              name: profile.displayName,
              avatar: profile.photos?.[0].value,
            });

            await newUser.save();

            console.log("newUser : ", newUser);
          }
        }

        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          photo: profile.photos?.[0].value,
        };
        done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    console.log("deserialised user : ", user);
    done(null, user);
  });
};
