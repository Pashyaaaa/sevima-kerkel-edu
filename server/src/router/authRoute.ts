// src/routes/auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controller/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
