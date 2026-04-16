import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  db.prepare(`
    UPDATE templates SET name = ?, customer = ?, items_count = ?, amount = ?,
    frequency = ?, last_used = ?, next_due = ?, is_active = ?, line_items_json = ?
    WHERE id = ?
  `).run(
    body.name || "", body.customer || "", body.items || 0,
    body.amount || 0, body.frequency || "รายเดือน",
    body.lastUsed || "-", body.nextDue || "-",
    body.isActive !== false ? 1 : 0,
    JSON.stringify(body.lineItems || []),
    id
  );

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM templates WHERE id = ?").run(id);

  return Response.json({ success: true });
}
