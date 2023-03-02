import morgan, { StreamOptions } from "morgan";
import Logger from "../utils/logger";

// Create a stream object with a 'write' function that will be used by `morgan`
const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

// const skip = () => {
//     const env = process.env.NODE_ENV || "development";
//     return env !== "development";
// };

// Build the morgan middleware
const morganMiddleware = morgan("common", { stream });

export default morganMiddleware;
