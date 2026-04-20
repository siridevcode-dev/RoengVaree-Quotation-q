import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, verifyPassword, jsonError } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const { password } = body;

  if (!password) {
    return jsonError("กรุณากรอกรหัสผ่าน", 400);
  }

  const db = getDb();
  // Find any Admin or Manager user and verify password
  const result = await db.execute("SELECT * FROM users WHERE role IN ('Admin', 'Manager')");
  const authorizedUsers = result.rows as any[];

  const isValid = authorizedUsers.some((user) => verifyPassword(password, user.password_hash));

  if (isValid) {
    return Response.json({ success: true });
  } else {
    return jsonError("รหัสผ่านไม่ถูกต้อง", 401);
  }
}
