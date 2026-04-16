import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();
  const q = db.prepare("SELECT * FROM quotations WHERE id = ?").get(id) as any;
  if (!q) return jsonError("ไม่พบใบเสนอราคา", 404);

  const lineItems = db.prepare("SELECT * FROM quotation_items WHERE quotation_id = ? ORDER BY sort_order").all(id);

  return Response.json({
    id: q.id,
    customer: q.customer_name,
    customerEmail: q.customer_email,
    customerPhone: q.customer_phone,
    customerAddress: q.customer_address,
    customerTaxId: q.customer_tax_id,
    amount: q.amount,
    status: q.status,
    date: q.date,
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
    lineItems: (lineItems as any[]).map((li) => ({
      id: li.id,
      name: li.name,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unit_price,
      discount: li.discount,
      vatEnabled: !!li.vat_enabled,
      category: li.category,
    })),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  const existing = db.prepare("SELECT id FROM quotations WHERE id = ?").get(id);
  if (!existing) return jsonError("ไม่พบใบเสนอราคา", 404);

  const updateQuotation = db.transaction(() => {
    db.prepare(`
      UPDATE quotations SET
        customer_name = ?, customer_email = ?, customer_phone = ?,
        customer_address = ?, customer_tax_id = ?,
        amount = ?, status = ?, date = ?, valid_until = ?,
        notes = ?, terms = ?, global_vat_enabled = ?,
        boat_model = ?, summary_discount_amount = ?, summary_discount_percentage = ?,
        include_optional_equipment = ?, frequency = ?,
        created_by = ?, member_name = ?, member_phone = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      body.customer || body.customerName || "",
      body.customerEmail || "",
      body.customerPhone || "",
      body.customerAddress || "",
      body.customerTaxId || "",
      body.amount || 0,
      body.status || "ฉบับร่าง",
      body.date || "",
      body.validUntil || "",
      body.notes || "",
      body.terms || "",
      body.globalVatEnabled !== false ? 1 : 0,
      body.boatModel || "",
      body.summaryDiscountAmount || 0,
      body.summaryDiscountPercentage || 0,
      body.includeOptionalEquipment !== false ? 1 : 0,
      body.frequency || "ไม่ระบุ",
      body.createdBy || auth.user.name,
      body.memberName || auth.user.name,
      body.memberPhone || auth.user.phone,
      id
    );

    // Replace line items
    db.prepare("DELETE FROM quotation_items WHERE quotation_id = ?").run(id);

    if (body.lineItems && Array.isArray(body.lineItems)) {
      const insertItem = db.prepare(`
        INSERT INTO quotation_items (quotation_id, name, description, quantity, unit_price, discount, vat_enabled, category, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      body.lineItems.forEach((item: any, index: number) => {
        insertItem.run(
          id,
          item.name || "",
          item.description || "",
          item.quantity || 1,
          item.unitPrice || 0,
          item.discount || 0,
          item.vatEnabled !== false ? 1 : 0,
          item.category || "",
          index
        );
      });
    }
  });

  updateQuotation();

  return Response.json({ success: true, id });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  const db = getDb();

  const result = db.prepare("DELETE FROM quotations WHERE id = ?").run(id);
  if (result.changes === 0) return jsonError("ไม่พบใบเสนอราคา", 404);

  return Response.json({ success: true });
}
