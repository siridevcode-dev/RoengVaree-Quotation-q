import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "roengvaree-secret-key-change-in-production-2026";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  position: string;
  role: string;
  status: string;
  last_active: string;
}

// ----- Password Helpers -----
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// ----- JWT Helpers -----
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ----- Auth Middleware -----
export async function authenticateRequest(req: NextRequest): Promise<{ user: AuthUser } | { error: string; status: number }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "ไม่มี token สำหรับยืนยันตัวตน", status: 401 };
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return { error: "Token ไม่ถูกต้องหรือหมดอายุ", status: 401 };
  }

  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, name, username, phone, email, position, role, status, last_active
          FROM users WHERE id = ?`,
    args: [payload.userId]
  });
  
  const user = result.rows[0] as unknown as AuthUser | undefined;

  if (!user) {
    return { error: "ไม่พบผู้ใช้งาน", status: 401 };
  }

  if (user.status === "Inactive") {
    return { error: "บัญชีถูกระงับการใช้งาน", status: 403 };
  }

  return { user };
}

// ----- Role Check Helpers -----
export function requireRole(user: AuthUser, ...roles: string[]): boolean {
  return roles.includes(user.role);
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
