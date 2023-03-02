import BaseError from "../utils/errors/baseError";
import { Request, Response, NextFunction } from "express";

const logError = (err: Error) => {
  console.error(err);
};

//log all incoming errors
const logErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logError(err);
  next(err);
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
  res.status(500);
  res.json({ error: err.message });
  next();
};

const isOperationalError = (err: BaseError) => {
  return err.isOperational;
};

export { logErrorMiddleware, returnError, catchAllErrors };
