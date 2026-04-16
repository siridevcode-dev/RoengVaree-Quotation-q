import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, requireRole, hashPassword, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const users = db.prepare(`
    SELECT id, name, username, phone, email, position, role, status, last_active
    FROM users ORDER BY created_at
  `).all() as any[];

  return Response.json(users.map((u) => ({
    id: u.id, name: u.name, username: u.username, phone: u.phone,
    email: u.email, position: u.position, role: u.role,
    status: u.status, lastActive: u.last_active,
  })));
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  if (!requireRole(auth.user, "Admin", "Manager")) {
    return jsonError("ไม่มีสิทธิ์เพิ่มสมาชิก", 403);
  }

  const body = await req.json();
  const db = getDb();

  // Generate ID
  const count = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count;
  const newId = `U${String(count + 1).padStart(3, "0")}`;

  try {
    db.prepare(`
      INSERT INTO users (id, name, username, phone, email, position, role, status, password_hash, last_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newId,
      body.name || "",
      body.username || "",
      body.phone || "",
      body.email || "",
      body.position || "",
      body.role || "Viewer",
      body.status || "Active",
      hashPassword(body.password || "password123"),
      "ไม่เคยเข้าใช้งาน"
    );

    return Response.json({ success: true, id: newId }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE")) {
      return jsonError("Username ซ้ำในระบบ", 409);
    }
    return jsonError("ไม่สามารถเพิ่มสมาชิกได้", 500);
  }
}
