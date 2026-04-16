import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const c = db.prepare("SELECT * FROM customers WHERE id = ?").get(id) as any;
  if (!c) return jsonError("ไม่พบข้อมูลลูกค้า", 404);

  return Response.json({
    id: c.id, name: c.name, email: c.email, phone: c.phone,
    address: c.address, taxId: c.tax_id, totalQuotations: c.total_quotations,
    totalRevenue: c.total_revenue, lastActivity: c.last_activity,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  db.prepare(`
    UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, tax_id = ?
    WHERE id = ?
  `).run(body.name || "", body.email || "", body.phone || "", body.address || "", body.taxId || "", id);

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const result = db.prepare("DELETE FROM customers WHERE id = ?").run(id);
  if (result.changes === 0) return jsonError("ไม่พบข้อมูลลูกค้า", 404);

  return Response.json({ success: true });
}
