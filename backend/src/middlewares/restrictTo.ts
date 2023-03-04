import { NextFunction, Request, Response } from "express";
import { Api401Error } from "../utils/errors/apiError";

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // if user role is not in allowedRoles array, return 401 unauthorized
      if (!allowedRoles.includes(res.locals.user.role)) {
        return next(
          new Api401Error("You do not have permission to perform this action")
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
