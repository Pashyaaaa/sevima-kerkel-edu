import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import classRoutes from "./routes/class.routes";
import assignmentRoutes from "./routes/assignment.routes";
import submissionRoutes from "./routes/submission.routes";
import reviewRoutes from "./routes/review.routes";
import { errorHandler, notFoundHandler } from "./middleware/error";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => res.json({ success: true, message: "Koreksi API is running." }));

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
// assignment, submission, review routes masing-masing sudah mendefinisikan path lengkapnya
// (termasuk prefix /classes/:classId/... dan /assignments/:id/...) supaya nested resource jelas
app.use("/api", assignmentRoutes);
app.use("/api", submissionRoutes);
app.use("/api", reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
