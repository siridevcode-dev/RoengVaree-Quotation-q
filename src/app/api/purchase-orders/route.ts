import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  await initDb();

  // Support filtering by type via query param
  const { searchParams } = req.nextUrl;
  const typeFilter = searchParams.get("type"); // 'PO' or 'PR'

  let query = `
    SELECT po.*, 
      (SELECT COUNT(*) FROM purchase_order_items poi WHERE poi.po_id = po.id) as items_count
    FROM purchase_orders po
  `;
  const args: any[] = [];

  if (typeFilter && (typeFilter === "PO" || typeFilter === "PR")) {
    query += ` WHERE po.type = ?`;
    args.push(typeFilter);
  }

  query += ` ORDER BY po.created_at DESC`;

  const result = await db.execute({ sql: query, args });
  const orders = result.rows as any[];

  // Fetch all items
  const itemsResult = await db.execute("SELECT * FROM purchase_order_items ORDER BY sort_order");
  const allItems = itemsResult.rows as any[];

  const finalResult = orders.map((po) => {
    const lineItems = allItems.filter((li) => li.po_id === po.id);
    return {
      id: po.id,
      type: po.type,
      title: po.title,
      supplierName: po.supplier_name,
      supplierContact: po.supplier_contact,
      supplierPhone: po.supplier_phone,
      supplierEmail: po.supplier_email,
      supplierAddress: po.supplier_address,
      supplierTaxId: po.supplier_tax_id,
      quotationId: po.quotation_id,
      status: po.status,
      priority: po.priority,
      totalAmount: po.total_amount,
      notes: po.notes,
      requestedBy: po.requested_by,
      approvedBy: po.approved_by,
      date: po.date,
      deliveryDate: po.delivery_date,
      paymentTerms: po.payment_terms,
      itemsCount: po.items_count,
      createdAt: po.created_at,
      updatedAt: po.updated_at,
      lineItems: lineItems.map((li: any) => ({
        id: li.id,
        name: li.name,
        description: li.description,
        quantity: li.quantity,
        unit: li.unit,
        unitPrice: li.unit_price,
        totalPrice: li.total_price,
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

    const statements: any[] = [];

    statements.push({
      sql: `INSERT INTO purchase_orders (
        id, type, title, supplier_name, supplier_contact, supplier_phone, 
        supplier_email, supplier_address, supplier_tax_id, quotation_id,
        status, priority, total_amount, notes, requested_by, approved_by,
        date, delivery_date, payment_terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.id || "",
        body.type || "PR",
        body.title || "",
        body.supplierName || "",
        body.supplierContact || "",
        body.supplierPhone || "",
        body.supplierEmail || "",
        body.supplierAddress || "",
        body.supplierTaxId || "",
        body.quotationId || "",
        body.status || "ฉบับร่าง",
        body.priority || "ปกติ",
        body.totalAmount || 0,
        body.notes || "",
        body.requestedBy || auth.user.name || "System",
        body.approvedBy || "",
        body.date || new Date().toLocaleDateString("th-TH"),
        body.deliveryDate || "",
        body.paymentTerms || "",
      ],
    });

    if (body.lineItems && Array.isArray(body.lineItems)) {
      body.lineItems.forEach((item: any, index: number) => {
        statements.push({
          sql: `INSERT INTO purchase_order_items (po_id, name, description, quantity, unit, unit_price, total_price, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            body.id || "",
            item.name || "",
            item.description || "",
            item.quantity || 1,
            item.unit || "ชิ้น",
            item.unitPrice || 0,
            item.totalPrice || (item.quantity || 1) * (item.unitPrice || 0),
            index,
          ],
        });
      });
    }

    await db.batch(statements, "write");

    // Log the activity
    const typeLabel = body.type === "PO" ? "ใบสั่งซื้อ (PO)" : "ใบขอซื้อ (PR)";
    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "create_po",
      description: `สร้าง${typeLabel} #${body.id} สำหรับ ${body.supplierName || "ไม่ระบุ"}`,
      ipAddress: getClientIp(req)
    });

    return NextResponse.json({ success: true, id: body.id }, { status: 201 });
  } catch (error: any) {
    console.error("Create purchase order error:", error);
    return jsonError("ไม่สามารถสร้างเอกสารได้: " + error.message, 500);
  }
}
