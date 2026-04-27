import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const result = await db.execute("SELECT * FROM products ORDER BY id");
  const products = result.rows as any[];

  return Response.json(products.map((p) => ({
    id: p.id, name: p.name, category: p.category, unitPrice: p.unit_price,
    unit: p.unit, description: p.description, sku: p.sku,
    inStock: !!p.in_stock, boatModel: p.boat_model,
  })));
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const db = getDb();

  try {
    const result = await db.execute({
      sql: `INSERT INTO products (name, category, unit_price, unit, description, sku, in_stock, boat_model)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.name || "", body.category || "", body.unitPrice || 0,
        body.unit || "ชุด", body.description || "", body.sku || null,
        body.inStock !== false ? 1 : 0, body.boatModel || ""
      ]
    });
    
    const newId = Number(result.lastInsertRowid);

    // Log the activity
    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "create_product",
      description: `เพิ่มสินค้าใหม่: ${body.name}${body.sku ? ` (SKU: ${body.sku})` : ""}`,
      ipAddress: getClientIp(req)
    });

    return Response.json({ success: true, id: newId }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE")) {
      return jsonError("SKU ซ้ำในระบบ", 409);
    }
    return jsonError("ไม่สามารถเพิ่มสินค้าได้", 500);
  }
}
