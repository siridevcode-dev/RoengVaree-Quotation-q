import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);
  
  const { id } = await params;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM production_costs WHERE id = ?",
    args: [id]
  });
  
  const row = result.rows[0] as any;
  if (!row) return jsonError("ไม่พบข้อมูลต้นทุน", 404);
  
  return NextResponse.json({
    ...row,
    unitPrice: row.unit_price,
    sellingPrice: row.selling_price,
    quotationId: row.quotation_id,
    inStock: !!row.in_stock,
    boatModel: row.boat_model,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);
  try {
    const { id } = await params;
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
    await db.execute({
      sql: `UPDATE production_costs 
            SET name = ?, category = ?, unit_price = ?, selling_price = ?, unit = ?, sku = ?, in_stock = ?, boat_model = ?, quotation_id = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`,
      args: [
        name,
        category,
        Number(finalUnitPrice) || 0,
        Number(finalSellingPrice) || 0,
        unit,
        sku || "",
        finalInStock === false ? 0 : 1,
        finalBoatModel || "",
        finalQuotationId || "",
        description,
        id
      ],
    });

    const updatedCost = await db.execute({
      sql: "SELECT * FROM production_costs WHERE id = ?",
      args: [id]
    });

    const row = updatedCost.rows[0] as any;

    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "update_product",
      description: `แก้ไขต้นทุนการผลิต: ${name || id}`,
      ipAddress: getClientIp(req)
    });

    return NextResponse.json({
      ...row,
      unitPrice: row.unit_price,
      sellingPrice: row.selling_price,
      quotationId: row.quotation_id,
      inStock: !!row.in_stock,
      boatModel: row.boat_model,
    });
  } catch (error) {
    console.error("Error updating production cost:", error);
    return NextResponse.json({ error: "Failed to update production cost" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);
  try {
    const { id } = await params;
    const db = getDb();
    
    await db.execute({
      sql: "DELETE FROM production_costs WHERE id = ?",
      args: [id]
    });

    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "delete_product",
      description: `ลบต้นทุนการผลิต ID: ${id}`,
      ipAddress: getClientIp(req)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting production cost:", error);
    return NextResponse.json({ error: "Failed to delete production cost" }, { status: 500 });
  }
}
