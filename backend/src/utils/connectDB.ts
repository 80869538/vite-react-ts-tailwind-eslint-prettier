import mongoose from "mongoose";
import config from "config";
import Logger from "./logger";
const dbUrl = `mongodb://${config.get("mongoUser")}:${config.get(
  "mongoPass"
)}@${config.get("host_name")}:${config.get("mongo_port")}/${config.get(
  "dbName"
)}?authSource=admin`;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(dbUrl);
    Logger.info("Mongo database connected...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    Logger.error(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
