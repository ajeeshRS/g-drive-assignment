import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI || "";

export const connectDb = (startServer: () => void) => {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("server connected to db");
      startServer();
    })
    .catch((err) => {
      console.log("Error connecting to db : ", err);
    });
};
