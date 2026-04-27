import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, requireRole, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  // Only Admin/Manager can view activity logs
  if (!requireRole(auth.user, "Admin", "Manager")) {
    return jsonError("ไม่มีสิทธิ์ดูประวัติการใช้งาน", 403);
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const db = getDb();

  let sql = `SELECT id, user_id, user_name, action, description, ip_address, created_at
             FROM activity_logs`;
  const args: any[] = [];

  if (userId) {
    sql += ` WHERE user_id = ?`;
    args.push(userId);
  }

  sql += ` ORDER BY created_at DESC LIMIT ?`;
  args.push(limit);

  const result = await db.execute({ sql, args });

  const logs = result.rows.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    action: row.action,
    description: row.description,
    ipAddress: row.ip_address,
    createdAt: row.created_at,
  }));

  return Response.json(logs);
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const db = getDb();

  // Get IP from headers
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "";

  try {
    await db.execute({
      sql: `INSERT INTO activity_logs (user_id, user_name, action, description, ip_address)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        body.userId || auth.user.id,
        body.userName || auth.user.name || "Unknown User",
        body.action || "other",
        body.description || "",
        body.ipAddress || ip || "-",
      ],
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create activity log:", error);
    return jsonError("ไม่สามารถบันทึกประวัติได้", 500);
  }
}
