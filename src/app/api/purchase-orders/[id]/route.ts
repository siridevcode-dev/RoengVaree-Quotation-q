import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();

  const result = await db.execute({
    sql: "SELECT * FROM purchase_orders WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return jsonError("ไม่พบเอกสาร", 404);
  }

  const po = result.rows[0] as any;
  const itemsResult = await db.execute({
    sql: "SELECT * FROM purchase_order_items WHERE po_id = ? ORDER BY sort_order",
    args: [id],
  });

  return NextResponse.json({
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
    lineItems: (itemsResult.rows as any[]).map((li) => ({
      id: li.id,
      name: li.name,
      description: li.description,
      quantity: li.quantity,
      unit: li.unit,
      unitPrice: li.unit_price,
      totalPrice: li.total_price,
    })),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const statements: any[] = [];

    statements.push({
      sql: `UPDATE purchase_orders SET
        type = ?, title = ?, supplier_name = ?, supplier_contact = ?, supplier_phone = ?,
        supplier_email = ?, supplier_address = ?, supplier_tax_id = ?, quotation_id = ?,
        status = ?, priority = ?, total_amount = ?, notes = ?, requested_by = ?,
        approved_by = ?, date = ?, delivery_date = ?, payment_terms = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      args: [
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
        body.date || "",
        body.deliveryDate || "",
        body.paymentTerms || "",
        id || "",
      ],
    });

    // Delete old items and re-insert
    statements.push({
      sql: "DELETE FROM purchase_order_items WHERE po_id = ?",
      args: [id],
    });

    if (body.lineItems && Array.isArray(body.lineItems)) {
      body.lineItems.forEach((item: any, index: number) => {
        statements.push({
          sql: `INSERT INTO purchase_order_items (po_id, name, description, quantity, unit, unit_price, total_price, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            id,
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

    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "update_po",
      description: `แก้ไข${body.type === "PO" ? "ใบสั่งซื้อ" : "ใบขอซื้อ"} #${id} สำหรับ ${body.supplierName || "ไม่ระบุ"}`,
      ipAddress: getClientIp(req)
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update purchase order error:", error);
    return jsonError("ไม่สามารถอัปเดตเอกสารได้: " + error.message, 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  try {
    const { id } = await params;
    const db = getDb();

    await db.batch(
      [
        { sql: "DELETE FROM purchase_order_items WHERE po_id = ?", args: [id] },
        { sql: "DELETE FROM purchase_orders WHERE id = ?", args: [id] },
      ],
      "write"
    );

    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "delete_po",
      description: `ลบเอกสาร PR/PO ID: ${id}`,
      ipAddress: getClientIp(req)
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete purchase order error:", error);
    return jsonError("ไม่สามารถลบเอกสารได้: " + error.message, 500);
  }
}
