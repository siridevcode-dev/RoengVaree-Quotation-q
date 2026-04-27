import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, requireRole, hashPassword, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, name, username, phone, email, position, role, status, last_active
          FROM users WHERE id = ?`,
    args: [id]
  });
  const u = result.rows[0] as any;
  if (!u) return jsonError("ไม่พบสมาชิก", 404);

  return Response.json({
    id: u.id, name: u.name, username: u.username, phone: u.phone,
    email: u.email, position: u.position, role: u.role,
    status: u.status, lastActive: u.last_active,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  // Allow users to update themselves, or Admin/Manager to update others
  if (auth.user.id !== id && !requireRole(auth.user, "Admin", "Manager")) {
    return jsonError("ไม่มีสิทธิ์แก้ไขข้อมูลสมาชิกคนอื่น", 403);
  }

  let sql = `UPDATE users SET name = ?, username = ?, phone = ?, email = ?, position = ?, role = ?, status = ?`;
  const params_arr: any[] = [
    body.name || "", body.username || "", body.phone || "",
    body.email || "", body.position || "", body.role || "Viewer", body.status || "Active"
  ];

  // Only update password if provided
  if (body.password && body.password.trim()) {
    sql += `, password_hash = ?`;
    params_arr.push(hashPassword(body.password));
  }

  sql += ` WHERE id = ?`;
  params_arr.push(id);

  await db.execute({ sql, args: params_arr });

  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "update_user",
    description: `แก้ไขข้อมูลสมาชิก: ${body.name || id}`,
    ipAddress: getClientIp(req)
  });

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  if (!requireRole(auth.user, "Admin", "Manager")) {
    return jsonError("ไม่มีสิทธิ์ลบสมาชิก", 403);
  }

  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: "DELETE FROM users WHERE id = ?",
    args: [id]
  });
  if (result.rowsAffected === 0) return jsonError("ไม่พบสมาชิก", 404);

  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "delete_user",
    description: `ลบสมาชิก ID: ${id}`,
    ipAddress: getClientIp(req)
  });

  return Response.json({ success: true });
}
