import { Router } from "express";
import { login, seedAdmin } from "../controllers/auth.controller";
const r = Router();
r.post("/login", login);
r.post("/seed-admin", seedAdmin); // dev-only convenience
export default r;
