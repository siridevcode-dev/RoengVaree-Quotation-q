import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const quotations = db.prepare(`
    SELECT q.*, 
      (SELECT COUNT(*) FROM quotation_items qi WHERE qi.quotation_id = q.id) as items_count
    FROM quotations q 
    ORDER BY q.created_at DESC
  `).all() as any[];

  // For each quotation, fetch its line items
  const getItems = db.prepare("SELECT * FROM quotation_items WHERE quotation_id = ? ORDER BY sort_order");

  const result = quotations.map((q) => {
    const lineItems = getItems.all(q.id);
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
      lineItems: lineItems.map((li: any) => ({
        id: li.id,
        name: li.name,
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unit_price,
        discount: li.discount,
        vatEnabled: !!li.vat_enabled,
        category: li.category,
      })),
    };
  });

  return Response.json(result);
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  try {
    const body = await req.json();
    const db = getDb();

    const insertQuotation = db.prepare(`
      INSERT INTO quotations (
        id, customer_name, customer_email, customer_phone, customer_address, customer_tax_id,
        amount, status, date, valid_until, notes, terms, global_vat_enabled,
        boat_model, summary_discount_amount, summary_discount_percentage,
        include_optional_equipment, frequency, created_by, member_name, member_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO quotation_items (quotation_id, name, description, quantity, unit_price, discount, vat_enabled, category, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const saveQuotation = db.transaction(() => {
      insertQuotation.run(
        body.id,
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
        body.createdBy || auth.user.name,
        body.memberName || auth.user.name,
        body.memberPhone || auth.user.phone
      );

      if (body.lineItems && Array.isArray(body.lineItems)) {
        body.lineItems.forEach((item: any, index: number) => {
          insertItem.run(
            body.id,
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

      // Update customer stats
      const existingCustomer = db.prepare("SELECT id FROM customers WHERE name = ?").get(body.customer || body.customerName || "") as any;
      if (existingCustomer) {
        db.prepare(`
          UPDATE customers 
          SET total_quotations = total_quotations + 1, 
              total_revenue = total_revenue + ?,
              last_activity = ?
          WHERE id = ?
        `).run(body.amount || 0, new Date().toLocaleDateString("th-TH"), existingCustomer.id);
      } else if (body.customer || body.customerName) {
        db.prepare(`
          INSERT INTO customers (name, email, phone, address, tax_id, total_quotations, total_revenue, last_activity)
          VALUES (?, ?, ?, ?, ?, 1, ?, ?)
        `).run(
          body.customer || body.customerName,
          body.customerEmail || "",
          body.customerPhone || "",
          body.customerAddress || "",
          body.customerTaxId || "",
          body.amount || 0,
          new Date().toLocaleDateString("th-TH")
        );
      }
    });

    saveQuotation();

    return Response.json({ success: true, id: body.id }, { status: 201 });
  } catch (error: any) {
    console.error("Create quotation error:", error);
    return jsonError("ไม่สามารถสร้างใบเสนอราคาได้: " + error.message, 500);
  }
}
