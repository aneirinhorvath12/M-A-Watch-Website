import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET missing");

export type JwtUser = { userId: string; role: string };

export function signToken(u: JwtUser) {
  return jwt.sign(u, secret, { expiresIn: "12h" });
}
export function verifyToken(t: string): JwtUser {
  return jwt.verify(t, secret) as JwtUser;
}
