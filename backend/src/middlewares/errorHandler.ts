import BaseError from "../utils/errors/baseError";
import { Request, Response } from "express";

const logError = (err: Error) => {
  console.error(err);
};

const logErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: (err: Error) => void
) => {
  logError(err);
  next(err);
};

const returnError = (
  err: BaseError,
  req: Request,
  res: Response,
  next: (err: Error) => void
) => {
  if (err instanceof BaseError && isOperationalError(err)) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    next(new Error("Unknown Error"));
  }
};

const catchAllErrors = (
  err: Error,
  req: Request,
  res: Response,
  next?: (err: Error) => void
) => {
  logError(err);
  res.status(500);
  res.render("error", { error: err });
};

const isOperationalError = (err: BaseError) => {
  return err.isOperational;
};

export { logErrorMiddleware, returnError, catchAllErrors };
