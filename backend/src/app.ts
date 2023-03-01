import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "config";
import connectDB from "./utils/connectDB";
import {
  logErrorMiddleware,
  returnError,
  catchAllErrors,
} from "./middlewares/errorHandler";

console.log("NODE_CONFIG_ENV: " + config.util.getEnv("NODE_CONFIG_ENV"));

const app = express();

// Global Error Handler
app.use(logErrorMiddleware);
app.use(returnError);

// If error is not operational, return 500
app.use(catchAllErrors);

const port = config.get<number>("port");
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  connectDB();
});
