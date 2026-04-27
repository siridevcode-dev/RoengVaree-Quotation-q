import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);
  try {
    const db = getDb();
    const result = await db.execute("SELECT * FROM production_costs ORDER BY created_at DESC");
    const rows = result.rows as any[];
    
    return NextResponse.json(rows.map(row => ({
      ...row,
      unitPrice: row.unit_price,
      sellingPrice: row.selling_price,
      quotationId: row.quotation_id,
      inStock: !!row.in_stock,
      boatModel: row.boat_model,
    })));
  } catch (error) {
    console.error("Error fetching production costs:", error);
    return NextResponse.json({ error: "Failed to fetch production costs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);
  try {
    const body = await req.json();
    const { 
      name, 
      category, 
      unitPrice, unit_price, 
      sellingPrice, selling_price, 
      unit, 
      sku, 
      inStock, in_stock, 
      boatModel, boat_model, 
      quotationId, quotation_id, 
      description 
    } = body;

    const finalUnitPrice = unitPrice !== undefined ? unitPrice : unit_price;
    const finalSellingPrice = sellingPrice !== undefined ? sellingPrice : selling_price;
    const finalInStock = inStock !== undefined ? inStock : in_stock;
    const finalBoatModel = boatModel !== undefined ? boatModel : boat_model;
    const finalQuotationId = quotationId !== undefined ? quotationId : quotation_id;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = getDb();
    const result = await db.execute({
      sql: `INSERT INTO production_costs (name, category, unit_price, selling_price, unit, sku, in_stock, boat_model, quotation_id, description, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        name,
        category || "วัสดุทางตรง",
        Number(finalUnitPrice) || 0,
        Number(finalSellingPrice) || 0,
        unit || "หน่วย",
        sku || "",
        finalInStock === false ? 0 : 1,
        finalBoatModel || "",
        finalQuotationId || "",
        description || "",
      ],
    });

    const newId = result.lastInsertRowid;
    const newCost = await db.execute({
      sql: "SELECT * FROM production_costs WHERE id = ?",
      args: [Number(newId)]
    });

    const row = newCost.rows[0] as any;
    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "create_product",
      description: `เพิ่มต้นทุนการผลิตใหม่: ${name}`,
      ipAddress: getClientIp(req)
    });

    return NextResponse.json({
      ...row,
      unitPrice: row.unit_price,
      sellingPrice: row.selling_price,
      quotationId: row.quotation_id,
      inStock: !!row.in_stock,
      boatModel: row.boat_model,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating production cost:", error);
    return NextResponse.json({ error: "Failed to create production cost" }, { status: 500 });
  }
}
