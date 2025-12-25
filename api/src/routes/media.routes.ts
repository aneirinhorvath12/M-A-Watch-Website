import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { uploadSingle, createMediaFromUpload } from "../controllers/media.controller";

const r = Router();

r.post(
  "/upload",
  requireAuth,
  requireRole(["ADMIN", "EDITOR", "AUTHOR"]),
  uploadSingle,
  createMediaFromUpload
);

export default r;
