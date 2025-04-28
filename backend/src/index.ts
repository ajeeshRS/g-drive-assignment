import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import path from "path";
import authRoutes from "./routes/authRoutes";
import fileRoutes from "./routes/fileRoutes";
import { initializePassport } from "./config/passport";
import { connectDb } from "./config/db";
import { errorHandler } from "./middlewares/errorHandlers";
import { authMiddleware } from "./middlewares/middleware";
import MongoStore from "connect-mongo";

const app = express();
const port = process.env.PORT || 5001;

app.use(
  cors({
    origin: "https://g-drive-assignment.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
      httpOnly: true
    },
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.json());

// routes prefix
app.use("/auth", authRoutes);
app.use("/file", authMiddleware, fileRoutes);

// error handler
app.use(errorHandler as ErrorRequestHandler);

const startServer = () => {
  app.listen(port, (err) => {
    if (err) {
      console.log("Error starting server : ", err);
    }
    console.log(`Server listening on port ${port}`);
  });
};

connectDb(startServer);
