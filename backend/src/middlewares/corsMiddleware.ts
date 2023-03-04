import cors from "cors";
import config from "config";

const options: cors.CorsOptions = {
  origin: config.get<string[]>("origin"),
  credentials: true,
};
const corsMiddleware = cors(options);
export default corsMiddleware;
