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
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";
console.log("NODE_CONFIG_ENV: " + config.util.getEnv("NODE_CONFIG_ENV"));

const app = express();

app.use(morganMiddleware);
app.get("/logger", (_, res) => {
  // Logger.error(new Error("This is an error log"));
  Logger.warn("This is a warn log");
  Logger.info("This is a info log");
  Logger.http("This is a http log");
  Logger.debug("This is a debug log");
  throw new Error("This is an error");
  res.send("Hello world");
});

// Global Error Handler
app.use(logErrorMiddleware);
app.use(returnError);

// If error is not operational, return 500
app.use(catchAllErrors);

const port = config.get<number>("port");
app.listen(port, () => {
  Logger.info(`Server started on port: ${port}`);
  connectDB();
});
