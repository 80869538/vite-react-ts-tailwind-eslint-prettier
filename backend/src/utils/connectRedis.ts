import { createClient } from "redis";
import config from "config";
import Logger from "./logger";
const redisUrl = `redis://${config.get("host_name")}:${config.get(
  "redis_port"
)}`;
const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    Logger.info("Redis client connected...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    Logger.error(err.message);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

redisClient.on("error", (err) => Logger.error(err));

export default redisClient;
