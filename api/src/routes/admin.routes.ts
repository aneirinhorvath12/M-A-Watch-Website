import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { createReport, updateReport, publishReport, listAllReports, attachMedia } from "../controllers/admin.controller";

const r = Router();

r.use(requireAuth);
r.use(requireRole(["ADMIN", "EDITOR", "AUTHOR"]));

r.get("/reports", listAllReports);
r.post("/reports", createReport);
r.patch("/reports/:id", updateReport);
r.post("/reports/:id/publish", requireRole(["ADMIN", "EDITOR"]), publishReport);
r.post("/reports/:id/attach", attachMedia);

export default r;
