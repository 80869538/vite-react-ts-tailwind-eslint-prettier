import mongoose from "mongoose";
import config from "config";

const dbUrl = `mongodb://${config.get("mongoUser")}:${config.get(
  "mongoPass"
)}@${config.get("host_name")}:${config.get("mongo_port")}/${config.get(
  "dbName"
)}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
