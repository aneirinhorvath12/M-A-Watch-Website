import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error";

import authRoutes from "./routes/auth.routes";
import reportsRoutes from "./routes/reports.routes";
import adminRoutes from "./routes/admin.routes";
import mediaRoutes from "./routes/media.routes";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// Serve uploaded files
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
app.use("/uploads", express.static(path.resolve(uploadDir)));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/v1/auth", authRoutes);
app.use("/v1/reports", reportsRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/media", mediaRoutes);

app.use(errorHandler);

export default app;
export { app };
