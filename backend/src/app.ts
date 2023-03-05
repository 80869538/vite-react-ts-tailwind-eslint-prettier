import express, { NextFunction, Request, Response } from "express";
import { Api404Error } from "./utils/errors/apiError";
import config from "config";
import { returnError, catchAllErrors } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";
import corsMiddleware from "./middlewares/corsMiddleware";
Logger.info("NODE_CONFIG_ENV: " + config.util.getEnv("NODE_CONFIG_ENV"));
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
const app = express();

// Middlewares

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Parse request body
app.use(express.json({ limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Log requests
app.use(morganMiddleware);

// Enable CORS
app.use(corsMiddleware);

// Above this line, all middlewares are executed for every request

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// Testing
app.get("/healthChecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to CodevoWeb",
  });
});

// 5. Catch 404 and forward to error handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Api404Error(`Route ${req.originalUrl} not found`);
  next(err);
});

// Global Error Handler
app.use(returnError);

// If error is not operational, return 500
app.use(catchAllErrors);

export default app;
