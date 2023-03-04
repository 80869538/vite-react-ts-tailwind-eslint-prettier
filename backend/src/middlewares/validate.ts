import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { Api400Error } from "../utils/errors/apiError";
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      // if zoderror return 400 bad request with zod error message
      if (err instanceof ZodError) {
        err = new Api400Error(err.issues[0].message);
        next(err);
      }
      // if not zoderror return 500 internal server error
      next(err);
    }
  };
};
