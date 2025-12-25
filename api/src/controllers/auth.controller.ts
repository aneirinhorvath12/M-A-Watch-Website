import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ userId: user.id, role: user.role });
  res.json({ accessToken: token, user: { id: user.id, email: user.email, role: user.role } });
}

export async function seedAdmin(_req: Request, res: Response) {
  const email = "admin@mnawatch.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.json({ ok: true, email, password: "Password123!" });

  const passwordHash = await hashPassword("Password123!");
  await prisma.user.create({ data: { email, passwordHash, role: "ADMIN", name: "Admin" } });

  res.json({ ok: true, email, password: "Password123!" });
}

