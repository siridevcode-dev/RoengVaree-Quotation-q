import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const customers = db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all() as any[];

  return Response.json(customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    taxId: c.tax_id,
    totalQuotations: c.total_quotations,
    totalRevenue: c.total_revenue,
    lastActivity: c.last_activity,
  })));
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const db = getDb();

  const result = db.prepare(`
    INSERT INTO customers (name, email, phone, address, tax_id, total_quotations, total_revenue, last_activity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.name || "",
    body.email || "",
    body.phone || "",
    body.address || "",
    body.taxId || "",
    body.totalQuotations || 0,
    body.totalRevenue || 0,
    body.lastActivity || new Date().toLocaleDateString("th-TH")
  );

  return Response.json({ success: true, id: result.lastInsertRowid }, { status: 201 });
}
