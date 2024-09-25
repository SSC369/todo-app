import {
  register,
  login,
  profile,
  editProfile,
} from "../controllers/authController.js";
import { Router } from "express";
const router = Router();

import authMiddleware from "../middlewares/authMiddleware.js";

router.post("/login", login);
router.post("/register", register);
router.put("/edit-profile", authMiddleware, editProfile);
router.get("/profile", authMiddleware, profile);

export default router;
