import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export type AuthedRequest = Request & { user?: { userId: string; role: string } };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing auth" });
  try {
    req.user = verifyToken(h.slice("Bearer ".length));
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Missing auth" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
