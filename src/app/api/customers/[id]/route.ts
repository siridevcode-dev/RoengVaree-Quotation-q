import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM customers WHERE id = ?",
    args: [id]
  });
  const c = result.rows[0] as any;
  if (!c) return jsonError("ไม่พบข้อมูลลูกค้า", 404);

  return Response.json({
    id: c.id, name: c.name, email: c.email, phone: c.phone,
    address: c.address, taxId: c.tax_id, totalQuotations: c.total_quotations,
    totalRevenue: c.total_revenue, lastActivity: c.last_activity,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  await db.execute({
    sql: "UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, tax_id = ? WHERE id = ?",
    args: [body.name || "", body.email || "", body.phone || "", body.address || "", body.taxId || "", id]
  });

  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "update_customer",
    description: `แก้ไขข้อมูลลูกค้า: ${body.name || id}`,
    ipAddress: getClientIp(req)
  });

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: "DELETE FROM customers WHERE id = ?",
    args: [id]
  });
  if (result.rowsAffected === 0) return jsonError("ไม่พบข้อมูลลูกค้า", 404);

  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "delete_customer",
    description: `ลบข้อมูลลูกค้า ID: ${id}`,
    ipAddress: getClientIp(req)
  });

  return Response.json({ success: true });
}
