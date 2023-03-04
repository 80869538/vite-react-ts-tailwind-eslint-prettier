import config from "config";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { CreateUserSchema, LoginUserSchema } from "../schemas/user.schema";
import {
  createUser,
  findUser,
  findUserById,
  signToken,
} from "../services/user.service";
import redisClient from "../utils/connectRedis";
import {
  Api409Error,
  Api401Error,
  Api403Error,
} from "../utils/errors/apiError";
import { signJwt, verifyJwt } from "../utils/jwt";
import { DocumentType } from "@typegoose/typegoose";

// import Logger from "../utils/logger";

// Exclude this fields from the response
export const excludedFields = ["password"];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
// refresh token cookie options
const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production https
if (process.env.NODE_ENV === "production")
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<object, object, CreateUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // 11000 is the error code for duplicate key
    if (err.code === 11000) {
      next(new Api409Error("Email already exists"));
    }
    next(err);
  }
};

export const loginHandler = async (
  req: Request<object, object, LoginUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new Api401Error("Invalid email or password"));
    }

    // Create an Access Token
    const { accessToken, refresh_token } = await signToken(user);
    // Send Access Token in Cookie
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: "success",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

const logout = (res: Response) => {
  res.cookie("access_token", "", { maxAge: 1 });
  res.cookie("refresh_token", "", { maxAge: 1 });
  res.cookie("logged_in", "", {
    maxAge: 1,
  });
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the refresh token from cookie
    const refreshToken = req.cookies.refresh_token;
    // Validate the Refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
    if (!decoded) {
      return next(new Api403Error("Invalid refresh token"));
    }
    // Check if the user has a valid session
    const session = await redisClient.get(decoded.sub);
    if (!session) {
      return next(new Api403Error("Invalid refresh token"));
    }

    // Check if the user exists
    const user = await findUserById(JSON.parse(session)._id);
    if (!user) {
      return next(new Api403Error("User does not exist"));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    // Send the access token as cookie
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    //Send response
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: DocumentType<User> = res.locals.user;
    // Delete the session from redis, when user logs out
    await redisClient.del(user._id.toString());
    logout(res);
    return res.status(200).json({ status: "success" });
  } catch (err) {
    next(err);
  }
};
