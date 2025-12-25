import { Router } from "express";
import { listPublished, getPublishedBySlug } from "../controllers/reports.controller";
const r = Router();
r.get("/", listPublished);
r.get("/:slug", getPublishedBySlug);
export default r;
