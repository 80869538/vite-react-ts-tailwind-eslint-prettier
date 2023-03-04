import express from "express";
import {
  getMeHandler,
  getAllUsersHandler,
} from "../controllers/user.controller";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";
import { deserializeUser } from "../middlewares/deserializeUser";

const router = express.Router();
// first deserialize the user with our public key, then check if the user is logged in
router.use(deserializeUser, requireUser);

// All routes below this middleware will be protected

// Admin only
// GET /api/users
router.get("/", restrictTo("admin"), getAllUsersHandler);

// GET /api/users/me
router.get("/me", getMeHandler);

export default router;
