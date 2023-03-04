import { NextFunction, Request, Response } from "express";
import { Api401Error } from "../utils/errors/apiError";

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      return next(new Api401Error("Invalid token or session has expired"));
    }
    next();
  } catch (err) {
    next(err);
  }
};
