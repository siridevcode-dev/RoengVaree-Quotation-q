"use client";

import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

export default function Reports() {
  const { quotations } = useAppContext();
  const [period, setPeriod] = useState("yearly");

  const statusBreakdownTemplate = [
    { status: "อนุมัติแล้ว", color: "bg-emerald-500" },
    { status: "ส่งแล้ว", color: "bg-blue-500" },
    { status: "รอดำเนินการ", color: "bg-amber-500" },
    { status: "ฉบับร่าง", color: "bg-gray-400" },
    { status: "ปฏิเสธ", color: "bg-red-500" },
  ];

  // Aggregation Logic
  const currentYear = new Date().getFullYear() + 543;
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  
  const monthlyData = months.map((m, i) => {
     const monthlyQuotes = quotations.filter(q => {
        const parts = q.date.split("/");
        return parts.length === 3 && parseInt(parts[1]) - 1 === i && parseInt(parts[2]) === currentYear;
     });
     return {
        month: m,
        quotations: monthlyQuotes.length,
        approved: monthlyQuotes.filter(q => q.status === "อนุมัติแล้ว").length,
        revenue: monthlyQuotes.filter(q => q.status === "อนุมัติแล้ว").reduce((sum, q) => sum + q.amount, 0)
     };
  });

  // Calculate top products from lineItems
  const productMap: Record<string, { count: number, revenue: number }> = {};
  quotations.forEach(q => {
    if (q.lineItems) {
      q.lineItems.forEach(item => {
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
  
  // Real data for top summary stats
  const totalQuotations = quotations.length;
  const totalApproved = quotations.filter(q => q.status === "อนุมัติแล้ว").length;
  const totalRevenue = quotations.filter(q => q.status === "อนุมัติแล้ว").reduce((sum, q) => sum + q.amount, 0);
  const approvalRate = totalQuotations > 0 ? ((totalApproved / totalQuotations) * 100).toFixed(1) : "0.0";
  
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);
  const maxQuotations = Math.max(...monthlyData.map((d) => d.quotations), 1);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">รายงาน</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">วิเคราะห์ผลการดำเนินงาน</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500">
              <option value="yearly">รายปี 2026</option>
              <option value="q1">ไตรมาส 1</option>
              <option value="q2">ไตรมาส 2</option>
              <option value="q3">ไตรมาส 3</option>
              <option value="q4">ไตรมาส 4</option>
            </select>
            <button 
              onClick={() => {
                const csvData = quotations.map(q => `${q.id},${q.customer},${q.amount},${q.status},${q.date}`).join("\n");
                const blob = new Blob(["ID,Customer,Amount,Status,Date\n" + csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `quotation-report-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span className="hidden sm:inline">ส่งออก</span> CSV
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-5">
            <p className="text-sm text-gray-500">รายได้รวมทั้งปี</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-5">
            <p className="text-sm text-gray-500">ใบเสนอราคาทั้งหมด</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{totalQuotations}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-5">
            <p className="text-sm text-gray-500">อนุมัติแล้ว</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{totalApproved}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-5">
            <p className="text-sm text-gray-500">อัตราอนุมัติ</p>
            <p className="text-lg md:text-2xl font-bold text-emerald-600 mt-1">{approvalRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">รายได้รายเดือน</h2>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-2 h-[220px]">
                {monthlyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div
                        className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-md hover:from-teal-600 hover:to-teal-500 cursor-pointer relative group transition-all min-h-[4px]"
                        style={{ height: `${(d.revenue / maxRevenue) * 190}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {formatCurrency(d.revenue)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">สถานะใบเสนอราคา</h2>
            </div>
            <div className="p-5 space-y-4">
              {/* Donut-like visual */}
              <div className="flex items-center gap-1 h-4 rounded-full overflow-hidden">
                {statusBreakdownTemplate.map((s) => {
                  const count = quotations.filter(q => q.status === s.status).length;
                  const percentage = totalQuotations > 0 ? (count / totalQuotations) * 100 : 0;
                  return (
                    <div key={s.status} className={`${s.color} h-full transition-all`} style={{ width: `${percentage}%` }} title={`${s.status}: ${count}`} />
                  )
                })}
              </div>
              <div className="space-y-3 mt-4">
                {statusBreakdownTemplate.map((s) => {
                  const count = quotations.filter(q => q.status === s.status).length;
                  const percentage = totalQuotations > 0 ? ((count / totalQuotations) * 100).toFixed(1) : "0";
                  return (
                    <div key={s.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${s.color}`} />
                        <span className="text-sm text-gray-600">{s.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-800">{count}</span>
                        <span className="text-xs text-gray-400 w-8 text-right">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quotation Volume + Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Quotation Volume */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">จำนวนใบเสนอราคารายเดือน</h2>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-10">{d.month}</span>
                    <div className="flex-1 flex items-center gap-2 h-6">
                      <div className="h-4 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all" style={{ width: `${(d.quotations / maxQuotations) * 100}%` }} />
                      <span className="text-xs font-semibold text-gray-700">{d.quotations}</span>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium w-14 text-right">อนุมัติ {d.approved}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">สินค้า/บริการยอดนิยม</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">#</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">สินค้า/บริการ</th>
                    <th className="text-center text-xs font-semibold text-gray-600 px-5 py-3">จำนวนขาย</th>
                    <th className="text-right text-xs font-semibold text-gray-600 px-5 py-3">รายได้</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topProducts.map((p, i) => (
                    <tr key={p.name} className="hover:bg-teal-50/30 transition-colors">
                      <td className="px-5 py-3 text-sm font-bold text-teal-600">{i + 1}</td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">{p.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 text-center">{p.count}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-800 text-right">{formatCurrency(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
