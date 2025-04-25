import express, { Request, Response } from "express";
import cors from "cors";
import { connectDb } from "./config/db";

const app = express();
const port = 5001;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

const startServer = () => {
  app.listen(port, (err) => {
    if (err) {
      console.log("Error starting server : ", err);
    }
    console.log(`Server listening on port ${port}`);
  });
};

connectDb(startServer);
