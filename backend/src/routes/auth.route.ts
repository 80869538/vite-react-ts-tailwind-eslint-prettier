import express from "express";
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post("/register", validate(createUserSchema), registerHandler);

// POST /api/auth//login - Login a user
router.post("/login", validate(loginUserSchema), loginHandler);

// GET /api/auth/refresh - Refresh access token
router.get("/refresh", refreshAccessTokenHandler);

router.use(deserializeUser, requireUser);

// GET /api/auth/logout - Logout a user
router.get("/logout", logoutHandler);

export default router;
