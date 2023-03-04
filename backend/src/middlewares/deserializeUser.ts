import { NextFunction, Request, Response } from "express";
import { findUserById } from "../services/user.service";
import redisClient from "../utils/connectRedis";
import { verifyJwt } from "../utils/jwt";
import { Api401Error } from "../utils/errors/apiError";
import Logger from "../utils/logger";
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the access token from the cookie or the header
    let accessToken: string | undefined;
    // req.cookies is parsed by cookie-parser
    if (req.cookies.access_token) {
      accessToken = req.cookies.access_token; // Cookie
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1]; // Bearer <token>
    }

    if (!accessToken) {
      return next(
        new Api401Error("You are not logged in! Please log in to get access.")
      );
    }

    // Verify the access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey"
    );

    // If public key cannot verify the token, decoded will be null
    if (!decoded) {
      return next(
        new Api401Error(
          "Invalid access token! Please log in again to get access."
        )
      );
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);
    if (!session) {
      return next(
        new Api401Error(
          "Your session has expired! Please log in again to get access."
        )
      );
    }
    // Check if user still exists
    const currentUser = await findUserById(JSON.parse(session)._id);
    if (!currentUser) {
      return next(
        new Api401Error(
          "The user belonging to this token does no longer exist."
        )
      );
    }
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};
