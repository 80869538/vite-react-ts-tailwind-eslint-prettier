import BaseError from "../utils/errors/baseError";
import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger";
const logError = (err: Error) => {
  Logger.error(err);
};

//return known operational errors to the client
const returnError = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseError && isOperationalError(err)) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    next(new Error("Unknown Error"));
  }
};

//return unknown errors to the client
const catchAllErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logError(err);
  res.status(500).json({ error: err.message });
  next();
};

const isOperationalError = (err: BaseError) => {
  return err.isOperational;
};

export { returnError, catchAllErrors };
