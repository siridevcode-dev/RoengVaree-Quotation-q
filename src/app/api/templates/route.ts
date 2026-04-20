import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const result = await db.execute("SELECT * FROM templates ORDER BY created_at DESC");
  const templates = result.rows as any[];

  return Response.json(templates.map((t) => ({
    id: t.id, name: t.name, customer: t.customer,
    items: t.items_count, amount: t.amount, frequency: t.frequency,
    lastUsed: t.last_used, nextDue: t.next_due,
    isActive: !!t.is_active,
    lineItems: JSON.parse(t.line_items_json || "[]"),
  })));
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const db = getDb();

  const result = await db.execute({
    sql: `INSERT INTO templates (name, customer, items_count, amount, frequency, last_used, next_due, is_active, line_items_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      body.name || "", body.customer || "", body.items || 0,
      body.amount || 0, body.frequency || "รายเดือน",
      body.lastUsed || "-", body.nextDue || "-",
      body.isActive !== false ? 1 : 0,
      JSON.stringify(body.lineItems || [])
    ]
  });

  return Response.json({ success: true, id: Number(result.lastInsertRowid) }, { status: 201 });
}
