import express from "express";
import cors from "cors";
import { apiRouter } from "../router/api.js";
import authRoutes from "../router/authRoute.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Ganti dengan domain yang diizinkan
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Gunakan router
app.use("/api", apiRouter);

app.use("/api/auth", authRoutes);
