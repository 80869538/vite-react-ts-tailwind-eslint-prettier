import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import Logger from "../src/utils/logger";
import config from "config";
import { connectRedis } from "../src/utils/connectRedis";
import redisClient from "../src/utils/connectRedis";
const dbUrl = `mongodb://${config.get("mongoUser")}:${config.get(
  "mongoPass"
)}@${config.get("host_name")}:${config.get("mongo_port")}/${config.get(
  "dbName"
)}?authSource=admin`;

/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect(dbUrl);
  connectRedis();
  Logger.debug("NODE_CONFIG_ENV: " + config.util.getEnv("NODE_CONFIG_ENV"));
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection
    .close()
    .then(() => Logger.info("MongoDB connection closed"))
    .catch((err) => Logger.error(err));
  await redisClient
    .quit()
    .then(() => Logger.info("Redis client disconnected"))
    .then((err) => Logger.error(err));
});

// Test for the healthChecker route
describe("GET /healthChecker", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/healthChecker");
    expect(res.statusCode).toBe(200);
  });
});
