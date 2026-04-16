import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();

  // Quotation stats
  const totalQuotations = (db.prepare("SELECT COUNT(*) as c FROM quotations").get() as any).c;
  const approvedCount = (db.prepare("SELECT COUNT(*) as c FROM quotations WHERE status = 'อนุมัติแล้ว'").get() as any).c;
  const pendingCount = (db.prepare("SELECT COUNT(*) as c FROM quotations WHERE status = 'รอดำเนินการ'").get() as any).c;
  const totalRevenue = (db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM quotations WHERE status = 'อนุมัติแล้ว'").get() as any).total;

  // Monthly data (current year in Thai Buddhist)
  const quotations = db.prepare("SELECT * FROM quotations").all() as any[];

  // Top products
  const allItems = db.prepare("SELECT * FROM quotation_items").all() as any[];
  const productMap: Record<string, { count: number; revenue: number }> = {};
  for (const item of allItems) {
    if (!productMap[item.name]) productMap[item.name] = { count: 0, revenue: 0 };
    productMap[item.name].count += item.quantity || 0;
    productMap[item.name].revenue += (item.quantity * item.unit_price) || 0;
  }

  const topProducts = Object.entries(productMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top customers
  const topCustomers = db.prepare(`
    SELECT * FROM customers ORDER BY total_revenue DESC LIMIT 5
  `).all() as any[];

  return Response.json({
    totalQuotations,
    approvedCount,
    pendingCount,
    totalRevenue,
    topProducts,
    topCustomers: topCustomers.map((c) => ({
      name: c.name,
      totalQuotations: c.total_quotations,
      totalRevenue: c.total_revenue,
    })),
    quotations: quotations.map((q) => ({
      id: q.id,
      customer: q.customer_name,
      amount: q.amount,
      status: q.status,
      date: q.date,
    })),
  });
}
