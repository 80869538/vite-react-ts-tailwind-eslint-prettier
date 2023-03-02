import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "http";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} ${
        info.stack ? info.stack : " "
      }`
  )
);

const transports: (
  | winston.transports.ConsoleTransportInstance
  | DailyRotateFile
)[] = [
  new DailyRotateFile({
    handleExceptions: true,
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
    auditFile: "logs/audit.json",
  }),
  new DailyRotateFile({
    handleExceptions: true,
    filename: "logs/all-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    auditFile: "logs/audit.json",
  }),
];

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(winston.format.colorize({ all: true })),
    })
  );
}

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false, // do not exit on handled exceptions
});

export default Logger;
