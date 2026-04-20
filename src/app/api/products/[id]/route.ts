import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM products WHERE id = ?",
    args: [id]
  });
  const p = result.rows[0] as any;
  if (!p) return jsonError("ไม่พบสินค้า", 404);

  return Response.json({
    id: p.id, name: p.name, category: p.category, unitPrice: p.unit_price,
    unit: p.unit, description: p.description, sku: p.sku,
    inStock: !!p.in_stock, boatModel: p.boat_model,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  await db.execute({
    sql: `UPDATE products SET name = ?, category = ?, unit_price = ?, unit = ?,
          description = ?, sku = ?, in_stock = ?, boat_model = ?
          WHERE id = ?`,
    args: [
      body.name || "", body.category || "", body.unitPrice || 0,
      body.unit || "ชุด", body.description || "", body.sku || null,
      body.inStock !== false ? 1 : 0, body.boatModel || "", id
    ]
  });

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: "DELETE FROM products WHERE id = ?",
    args: [id]
  });
  if (result.rowsAffected === 0) return jsonError("ไม่พบสินค้า", 404);

  return Response.json({ success: true });
}
