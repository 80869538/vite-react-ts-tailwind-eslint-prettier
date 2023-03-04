import { NextFunction, Request, Response } from "express";
import { findAllUsers } from "../services/user.service";
import httpStatusCodes from "../utils/httpStatusCodes";
export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    res.status(httpStatusCodes.OK).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findAllUsers();
    res.status(httpStatusCodes.OK).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};
