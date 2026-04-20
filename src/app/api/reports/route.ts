import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();

  // Quotation stats
  const totalQuotationsRes = await db.execute("SELECT COUNT(*) as c FROM quotations");
  const totalQuotations = totalQuotationsRes.rows[0].c;

  const approvedRes = await db.execute("SELECT COUNT(*) as c FROM quotations WHERE status = 'อนุมัติแล้ว'");
  const approvedCount = approvedRes.rows[0].c;

  const pendingRes = await db.execute("SELECT COUNT(*) as c FROM quotations WHERE status = 'รอดำเนินการ'");
  const pendingCount = pendingRes.rows[0].c;

  const revenueRes = await db.execute("SELECT COALESCE(SUM(amount), 0) as total FROM quotations WHERE status = 'อนุมัติแล้ว'");
  const totalRevenue = revenueRes.rows[0].total;

  // Monthly data
  const quotationsRes = await db.execute("SELECT * FROM quotations");
  const quotations = quotationsRes.rows as any[];

  // Top products
  const itemsRes = await db.execute("SELECT * FROM quotation_items");
  const allItems = itemsRes.rows as any[];
  const productMap: Record<string, { count: number; revenue: number }> = {};
  for (const item of allItems) {
    if (!productMap[item.name]) productMap[item.name] = { count: 0, revenue: 0 };
    productMap[item.name].count += item.quantity || 0;
    productMap[item.name].revenue += (Number(item.quantity) * Number(item.unit_price)) || 0;
  }

  const topProducts = Object.entries(productMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top customers
  const customersRes = await db.execute("SELECT * FROM customers ORDER BY total_revenue DESC LIMIT 5");
  const topCustomers = customersRes.rows as any[];

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
