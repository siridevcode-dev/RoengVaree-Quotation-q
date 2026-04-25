"use client";

import { useAppContext } from "@/context/AppContext";
import { useState, useRef, useEffect } from "react";

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

export default function Reports() {
  const { quotations } = useAppContext();
  const [period, setPeriod] = useState("yearly");

  const statusBreakdownTemplate = [
    { status: "อนุมัติแล้ว", color: "#10b981", light: "#ecfdf5" },
    { status: "ส่งแล้ว",     color: "#3b82f6", light: "#eff6ff" },
    { status: "รอดำเนินการ", color: "#f59e0b", light: "#fffbeb" },
    { status: "ฉบับร่าง",    color: "#94a3b8", light: "#f8fafc" },
    { status: "ปฏิเสธ",      color: "#ef4444", light: "#fef2f2" },
  ];

  const currentYear = new Date().getFullYear() + 543;
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  const monthlyData = months.map((m, i) => {
    const monthlyQuotes = quotations.filter((q) => {
      const parts = q.date.split("/");
      return parts.length === 3 && parseInt(parts[1]) - 1 === i && parseInt(parts[2]) === currentYear;
    });
    return {
      month: m,
      quotations: monthlyQuotes.length,
      approved: monthlyQuotes.filter((q) => q.status === "อนุมัติแล้ว").length,
      revenue: monthlyQuotes.filter((q) => q.status === "อนุมัติแล้ว").reduce((s, q) => s + q.amount, 0),
    };
  });

  const productMap: Record<string, { count: number; revenue: number }> = {};
  quotations.forEach((q) => {
    if (q.lineItems) {
      q.lineItems.forEach((item) => {
        if (!productMap[item.name]) productMap[item.name] = { count: 0, revenue: 0 };
        productMap[item.name].count += item.quantity || 0;
        productMap[item.name].revenue += (item.quantity * item.unitPrice) || 0;
      });
    }
  });
  const topProducts = Object.entries(productMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const totalQuotations = quotations.length;
  const totalApproved = quotations.filter((q) => q.status === "อนุมัติแล้ว").length;
  const totalRevenue = quotations.filter((q) => q.status === "อนุมัติแล้ว").reduce((s, q) => s + q.amount, 0);
  const approvalRate = totalQuotations > 0 ? ((totalApproved / totalQuotations) * 100).toFixed(1) : "0.0";

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);
  const maxQuotations = Math.max(...monthlyData.map((d) => d.quotations), 1);

  const summaryCards = [
    { label: "รายได้รวมทั้งปี", value: formatCurrency(totalRevenue), color: "#283583", bg: "#eef2ff" },
    { label: "ใบเสนอราคาทั้งหมด", value: totalQuotations.toString(), color: "#0d9488", bg: "#f0fdf9" },
    { label: "อนุมัติแล้ว", value: totalApproved.toString(), color: "#059669", bg: "#ecfdf5" },
    { label: "อัตราอนุมัติ", value: `${approvalRate}%`, color: "#d97706", bg: "#fffbeb" },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50/40">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="page-title">รายงาน</h1>
            <p className="page-subtitle mt-1">วิเคราะห์ผลการดำเนินงาน</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)} 
              title="เลือกช่วงเวลาของรายงาน"
              className="input-modern py-2 text-sm cursor-pointer w-auto pr-8"
            >
              <option value="yearly">รายปี {currentYear}</option>
              <option value="q1">ไตรมาส 1</option>
              <option value="q2">ไตรมาส 2</option>
              <option value="q3">ไตรมาส 3</option>
              <option value="q4">ไตรมาส 4</option>
            </select>
            <button
              onClick={() => {
                const csvData = quotations.map((q) => `${q.id},${q.customer},${q.amount},${q.status},${q.date}`).join("\n");
                const blob = new Blob(["ID,Customer,Amount,Status,Date\n" + csvData], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `report-${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
              }}
              className="btn-secondary py-2 px-4 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              ส่งออก CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 stagger-children">
          {summaryCards.map((card) => (
            <div key={card.label} className="stat-card animate-fade-in" title={card.label}>
              <DynamicBox className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-sm font-bold flex-shrink-0" backgroundColor={card.bg} color={card.color}>
                <svg className="w-4.5 h-4.5 w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </DynamicBox>
              <p className="text-xs font-medium text-gray-500 mb-1">{card.label}</p>
              <DynamicBox className="text-xl md:text-2xl font-black tracking-tight" color={card.color}>{card.value}</DynamicBox>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 md:gap-5">
          <div className="card overflow-hidden">
            <div className="card-header">
              <div>
                <h2 className="text-sm font-bold text-gray-800">รายได้รายเดือน</h2>
                <p className="text-xs text-gray-400 mt-0.5">เฉพาะที่อนุมัติแล้ว (฿)</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-1.5 h-[200px]">
                {monthlyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <DynamicBox
                      className="w-full rounded-t-lg transition-all duration-700 cursor-pointer relative group min-h-[4px] bg-gradient-to-t from-indigo-500 to-blue-900"
                      height={`${Math.max((d.revenue / maxRevenue) * 175, 4)}px`}
                    >
                      {d.revenue > 0 && (
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {formatCurrency(d.revenue)}
                        </div>
                      )}
                    </DynamicBox>
                    <span className="text-[9px] md:text-[10px] text-gray-400 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="card-header">
              <h2 className="text-sm font-bold text-gray-800">สถานะใบเสนอราคา</h2>
              <span className="text-xs text-gray-400">ทั้งหมด {totalQuotations}</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center h-3 rounded-full overflow-hidden bg-gray-100 gap-px">
                {statusBreakdownTemplate.map((s) => {
                  const count = quotations.filter((q) => q.status === s.status).length;
                  const pct = totalQuotations > 0 ? (count / totalQuotations) * 100 : 0;
                  return pct > 0 ? (
                    <DynamicBox 
                      key={s.status} 
                      className="h-full rounded-full transition-all duration-500" 
                      width={`${pct}%`} 
                      backgroundColor={s.color} 
                      title={`${s.status}: ${count} (${pct.toFixed(1)}%)`} 
                    />
                  ) : null;
                })}
              </div>
              <div className="space-y-2.5 mt-2">
                {statusBreakdownTemplate.map((s) => {
                  const count = quotations.filter((q) => q.status === s.status).length;
                  const pct = totalQuotations > 0 ? ((count / totalQuotations) * 100).toFixed(1) : "0";
                  return (
                    <div key={s.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <DynamicBox className="w-2.5 h-2.5 rounded-full flex-shrink-0" backgroundColor={s.color} />
                        <span className="text-sm text-gray-600">{s.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-800">{count}</span>
                        <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
          <div className="card overflow-hidden">
            <div className="card-header">
              <h2 className="text-sm font-bold text-gray-800">จำนวนใบเสนอราคารายเดือน</h2>
            </div>
            <div className="p-5 space-y-2">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-10 font-medium flex-shrink-0">{d.month}</span>
                  <div className="flex-1 flex items-center gap-2 h-6">
                    <DynamicBox
                      className="h-5 rounded-lg transition-all duration-700 min-w-[4px] bg-gradient-to-r from-blue-900 to-indigo-500"
                      width={`${Math.max((d.quotations / maxQuotations) * 100, d.quotations > 0 ? 5 : 0)}%`}
                    />
                    <span className="text-xs font-bold text-gray-700">{d.quotations}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold w-16 text-right flex-shrink-0">✓ {d.approved}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products Table */}
          <div className="card overflow-hidden">
            <div className="card-header">
              <h2 className="text-sm font-bold text-gray-800">สินค้า/บริการยอดนิยม</h2>
              <span className="text-xs text-gray-400">Top {topProducts.length}</span>
            </div>
            {topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left">#</th>
                      <th className="text-left">สินค้า/บริการ</th>
                      <th className="text-center">จำนวน</th>
                      <th className="text-right">รายได้</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p, i) => (
                      <tr key={p.name}>
                        <td className="px-4 py-3 text-sm font-black text-[#283583]">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">{p.count}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">{formatCurrency(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state py-10">
                <div className="empty-state-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <p className="text-sm text-gray-400">ยังไม่มีข้อมูลสินค้า</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicBox({ height, width, backgroundColor, color, className, title, children, top, left }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (height) ref.current.style.height = height;
      if (width) ref.current.style.width = width;
      if (backgroundColor) ref.current.style.backgroundColor = backgroundColor;
      if (color) ref.current.style.color = color;
      if (top) ref.current.style.top = top;
      if (left) ref.current.style.left = left;
    }
  }, [height, width, backgroundColor, color, top, left]);
  return <div ref={ref} className={className} title={title}>{children}</div>;
}
