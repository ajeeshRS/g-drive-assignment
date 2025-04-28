import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      unique: true,
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
