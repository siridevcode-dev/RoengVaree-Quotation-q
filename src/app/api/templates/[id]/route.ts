import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  await db.execute({
    sql: `UPDATE templates SET name = ?, customer = ?, items_count = ?, amount = ?,
          frequency = ?, last_used = ?, next_due = ?, is_active = ?, line_items_json = ?
          WHERE id = ?`,
    args: [
      body.name || "", body.customer || "", body.items || 0,
      body.amount || 0, body.frequency || "รายเดือน",
      body.lastUsed || "-", body.nextDue || "-",
      body.isActive !== false ? 1 : 0,
      JSON.stringify(body.lineItems || []),
      id
    ]
  });

  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "other",
    description: `แก้ไขเทมเพลต: ${body.name || id}`,
    ipAddress: getClientIp(req)
  });

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  await db.execute({
    sql: "DELETE FROM templates WHERE id = ?",
    args: [id]
  });

  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "other",
    description: `ลบเทมเพลต ID: ${id}`,
    ipAddress: getClientIp(req)
  });

  return Response.json({ success: true });
}
