import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const result = await db.execute("SELECT * FROM customers ORDER BY created_at DESC");
  const customers = result.rows as any[];

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
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const db = getDb();

  const result = await db.execute({
    sql: `INSERT INTO customers (name, email, phone, address, tax_id, total_quotations, total_revenue, last_activity)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      body.name || "",
      body.email || "",
      body.phone || "",
      body.address || "",
      body.taxId || "",
      body.totalQuotations || 0,
      body.totalRevenue || 0,
      body.lastActivity || new Date().toLocaleDateString("th-TH")
    ]
  });
  
  const newId = Number(result.lastInsertRowid);

  // Log the activity
  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "create_customer",
    description: `เพิ่มข้อมูลลูกค้าใหม่: ${body.name}`,
    ipAddress: getClientIp(req)
  });

  return Response.json({ success: true, id: newId }, { status: 201 });
}
