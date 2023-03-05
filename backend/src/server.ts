import * as dotenv from "dotenv";
dotenv.config();
import app from "./app";
import config from "config";
import connectDB from "./utils/connectDB";
import { connectRedis } from "./utils/connectRedis";
import Logger from "./utils/logger";
const port = config.get<number>("port");
app.listen(port, () => {
  Logger.info(`Server started on port: ${port}`);
  connectDB();
  connectRedis();
});
