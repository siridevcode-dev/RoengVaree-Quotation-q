import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  await initDb();
  const result = await db.execute(`
    SELECT q.*, 
      (SELECT COUNT(*) FROM quotation_items qi WHERE qi.quotation_id = q.id) as items_count
    FROM quotations q 
    ORDER BY q.created_at DESC
  `);
  const quotations = result.rows as any[];

  // Fetch all items for these quotations to avoid N+1 issues
  const itemsResult = await db.execute("SELECT * FROM quotation_items ORDER BY sort_order");
  const allItems = itemsResult.rows as any[];

  const finalResult = quotations.map((q) => {
    const lineItems = allItems.filter(li => li.quotation_id === q.id);
    let customImages: string[] | undefined;
    try {
      customImages = q.custom_images ? JSON.parse(q.custom_images as string) : undefined;
    } catch { customImages = undefined; }
    return {
      id: q.id,
      customer: q.customer_name,
      customerEmail: q.customer_email,
      customerPhone: q.customer_phone,
      customerAddress: q.customer_address,
      customerTaxId: q.customer_tax_id,
      amount: q.amount,
      status: q.status,
      date: q.date,
      items: q.items_count,
      validUntil: q.valid_until,
      notes: q.notes,
      terms: q.terms,
      globalVatEnabled: !!q.global_vat_enabled,
      boatModel: q.boat_model,
      summaryDiscountAmount: q.summary_discount_amount,
      summaryDiscountPercentage: q.summary_discount_percentage,
      includeOptionalEquipment: !!q.include_optional_equipment,
      frequency: q.frequency,
      createdBy: q.created_by,
      memberName: q.member_name,
      memberPhone: q.member_phone,
      customImages,
      lineItems: lineItems.map((li: any) => ({
        id: li.id,
        name: li.name,
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unit_price,
        discount: li.discount,
        vatEnabled: !!li.vat_enabled,
        category: li.category,
        costPrice: li.cost_price || 0,
      })),
    };
  });

  return NextResponse.json(finalResult);
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  try {
    const body = await req.json();
    const db = getDb();
    await initDb();

    // Serialize customImages to JSON string for storage
    const customImagesJson = body.customImages && Array.isArray(body.customImages) && body.customImages.length > 0
      ? JSON.stringify(body.customImages)
      : "";

    const statements: any[] = [];

    statements.push({
      sql: `INSERT INTO quotations (
        id, customer_name, customer_email, customer_phone, customer_address, customer_tax_id,
        amount, status, date, valid_until, notes, terms, global_vat_enabled,
        boat_model, summary_discount_amount, summary_discount_percentage,
        include_optional_equipment, frequency, created_by, member_name, member_phone, custom_images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.id || "",
        body.customer || body.customerName || "",
        body.customerEmail || "",
        body.customerPhone || "",
        body.customerAddress || "",
        body.customerTaxId || "",
        body.amount || 0,
        body.status || "ฉบับร่าง",
        body.date || new Date().toLocaleDateString("th-TH"),
        body.validUntil || "",
        body.notes || "",
        body.terms || "",
        body.globalVatEnabled !== false ? 1 : 0,
        body.boatModel || "",
        body.summaryDiscountAmount || 0,
        body.summaryDiscountPercentage || 0,
        body.includeOptionalEquipment !== false ? 1 : 0,
        body.frequency || "ไม่ระบุ",
        body.createdBy || auth.user.name || "System",
        body.memberName || auth.user.name || "System",
        body.memberPhone || auth.user.phone || "-",
        customImagesJson || ""
      ]
    });

    if (body.lineItems && Array.isArray(body.lineItems)) {
      body.lineItems.forEach((item: any, index: number) => {
        statements.push({
          sql: `INSERT INTO quotation_items (quotation_id, name, description, quantity, unit_price, discount, vat_enabled, category, cost_price, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            body.id || "",
            item.name || "",
            item.description || "",
            item.quantity || 1,
            item.unitPrice || 0,
            item.discount || 0,
            item.vatEnabled !== false ? 1 : 0,
            item.category || "",
            item.costPrice || 0,
            index
          ]
        });

        // Sync to production_costs
        const costCat = item.category || "วัสดุทางตรง";
        const costModel = body.boatModel || "ทุกรุ่น";
        
        // 1. Try to update existing cost item (matching name, category, boat_model AND quotation_id)
        statements.push({
          sql: `UPDATE production_costs 
                SET unit_price = ?, selling_price = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE name = ? AND category = ? AND boat_model = ? AND quotation_id = ?`,
          args: [
            item.costPrice || 0,
            item.unitPrice || 0,
            item.description || "",
            item.name || "",
            costCat || "",
            costModel || "",
            body.id || ""
          ]
        });
        
        // 2. Insert if it doesn't exist for THIS quotation
        statements.push({
          sql: `INSERT INTO production_costs (name, category, unit_price, selling_price, unit, sku, in_stock, boat_model, quotation_id, description, updated_at)
                SELECT ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, CURRENT_TIMESTAMP
                WHERE NOT EXISTS (
                  SELECT 1 FROM production_costs WHERE name = ? AND category = ? AND boat_model = ? AND quotation_id = ?
                )`,
          args: [
            item.name || "",
            costCat || "",
            item.costPrice || 0,
            item.unitPrice || 0,
            "หน่วย",
            `CST-AUTO-${Math.floor(Math.random() * 10000)}`,
            costModel || "",
            body.id || "",
            item.description || "",
            item.name || "",
            costCat || "",
            costModel || "",
            body.id || ""
          ]
        });
      });
    }

    const customerResult = await db.execute({
      sql: "SELECT id FROM customers WHERE name = ?",
      args: [body.customer || body.customerName || ""]
    });
    const existingCustomer = customerResult.rows[0];

    if (existingCustomer) {
      statements.push({
        sql: `UPDATE customers 
              SET total_quotations = total_quotations + 1, 
                  total_revenue = total_revenue + ?,
                  last_activity = ?
              WHERE id = ?`,
        args: [body.amount || 0, new Date().toLocaleDateString("th-TH"), existingCustomer.id]
      });
    } else if (body.customer || body.customerName) {
      statements.push({
        sql: `INSERT INTO customers (name, email, phone, address, tax_id, total_quotations, total_revenue, last_activity)
              VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
        args: [
          body.customer || body.customerName,
          body.customerEmail || "",
          body.customerPhone || "",
          body.customerAddress || "",
          body.customerTaxId || "",
          body.amount || 0,
          new Date().toLocaleDateString("th-TH")
        ]
      });
    }

    await db.batch(statements, "write");

    // Log the activity
    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "create_quotation",
      description: `สร้างใบเสนอราคาใหม่ #${body.id} สำหรับลูกค้า ${body.customer || body.customerName}`,
      ipAddress: getClientIp(req)
    });

    return NextResponse.json({ success: true, id: body.id }, { status: 201 });
  } catch (error: any) {
    console.error("Create quotation error:", error);
    return jsonError("ไม่สามารถสร้างใบเสนอราคาได้: " + error.message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  
  // This handles DELETE /api/quotations/ (which Next.js routes here)
  // We assume it's an attempt to delete a quotation with an empty ID
  const result = await db.execute("DELETE FROM quotations WHERE id = ''");
  
  if (result.rowsAffected === 0) {
    return jsonError("ไม่พบใบเสนอราคาที่ไม่มีเลขที่", 404);
  }

  // Log the activity
  await logActivity({
    userId: auth.user.id,
    userName: auth.user.name,
    action: "delete_quotation",
    description: `ลบใบเสนอราคาที่ไม่มีเลขที่`,
    ipAddress: getClientIp(req)
  });

  return NextResponse.json({ success: true });
}
