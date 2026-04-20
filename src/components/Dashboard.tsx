"use client";

import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

const statusColor: Record<string, string> = {
  "อนุมัติแล้ว": "bg-emerald-100 text-emerald-700",
  "รอดำเนินการ": "bg-amber-100 text-amber-700",
  "ส่งแล้ว": "bg-blue-100 text-blue-700",
  "ฉบับร่าง": "bg-gray-100 text-gray-600",
  "ปฏิเสธ": "bg-red-100 text-red-600",
};

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

export default function Dashboard() {
  const { quotations, customers, updateQuotation, showToast } = useAppContext();
  const [activeStatusEdit, setActiveStatusEdit] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Real Data Aggregation
  const currentYear = new Date().getFullYear() + 543; // Thai year for display consistency
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  
  const monthlyRevenue = months.map((_, i) => {
    return quotations
      .filter(q => {
        // Parse "DD/MM/YYYY" format
        const parts = q.date.split("/");
        if (parts.length < 3) return false;
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return month === i && year === currentYear && q.status === "อนุมัติแล้ว";
      })
      .reduce((sum, q) => sum + q.amount, 0) / 1000; // In Thousands
  });
  
  const maxRevenue = Math.max(...monthlyRevenue, 1); // Avoid div by zero

  // Compute dynamic stats
  const totalAmount = quotations.filter(q => q.status === "อนุมัติแล้ว").reduce((sum, q) => sum + q.amount, 0);
  const approvedCount = quotations.filter(q => q.status === "อนุมัติแล้ว").length;
  const pendingCount = quotations.filter(q => q.status === "รอดำเนินการ").length;

  const stats = [
    { label: "ใบเสนอราคาทั้งหมด", value: quotations.length.toString(), change: quotations.length > 0 ? "+100%" : "0.0%", up: true, icon: "📄", color: "from-teal-500 to-teal-600" },
    { label: "อนุมัติแล้ว", value: approvedCount.toString(), change: approvedCount > 0 ? "Real data" : "0.0%", up: true, icon: "✅", color: "from-emerald-500 to-emerald-600" },
    { label: "รอดำเนินการ", value: pendingCount.toString(), change: pendingCount > 0 ? "Real data" : "0.0%", up: false, icon: "⏳", color: "from-amber-500 to-amber-600" },
    { label: "รายได้รวม (฿)", value: formatCurrency(totalAmount), change: totalAmount > 0 ? "Real revenue" : "0.0%", up: true, icon: "💰", color: "from-blue-500 to-blue-600" },
  ];

  const recentQuotations = [...quotations].sort((a, b) => {
    // Basic sort by date string (could be improved by parsing to Date object)
    return b.id.localeCompare(a.id);
  }).slice(0, 6);

  // Compute top customers (derive from customers context)
  const topCustomers = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 4);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">ภาพรวมระบบจัดการใบเสนอราคา</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-lg`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-2 md:mt-3 flex items-center gap-1.5 flex-wrap">
                <span className={`text-xs font-semibold ${stat.up ? "text-emerald-600" : "text-red-500"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400">จากเดือนที่แล้ว</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Activity Row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 md:gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">รายได้รายเดือน</h2>
              <select className="text-xs px-2 py-1 border border-gray-200 rounded-md bg-white focus:outline-none">
                <option>ปี 2026</option>
                <option>ปี 2025</option>
              </select>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-2 h-[200px]">
                {monthlyRevenue.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-md transition-all duration-500 hover:from-teal-600 hover:to-teal-500 cursor-pointer relative group min-h-[4px]"
                      style={{ height: `${(val / maxRevenue) * 180}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ฿{val}K
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">ลูกค้ายอดนิยม</h2>
            </div>
            <div className="p-4 space-y-3">
              {topCustomers.map((c, i) => (
                <div key={c.id || `customer-${i}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.totalQuotations} ใบเสนอราคา</p>
                  </div>
                  <span className="text-sm font-bold text-teal-700">{formatCurrency(c.totalRevenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Quotations Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">ใบเสนอราคาล่าสุด</h2>
            <button className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors">ดูทั้งหมด →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">เลขที่</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">ลูกค้า</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-5 py-3">จำนวนเงิน</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-5 py-3">สถานะ</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-5 py-3">วันที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentQuotations.map((q) => (
                  <tr key={q.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-teal-700">{q.id}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{q.customer}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 text-right">{formatCurrency(q.amount)}</td>
                    <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className={`relative inline-block text-left ${activeStatusEdit === q.id ? "z-50" : ""}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom, left: rect.left });
                            setActiveStatusEdit(activeStatusEdit === q.id ? null : q.id);
                          }}
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[q.status] || "bg-gray-100 text-gray-600"} hover:ring-2 hover:ring-teal-500/20 hover:scale-105 transition-all active:scale-95`}
                        >
                          {q.status}
                        </button>
                        
                        {activeStatusEdit === q.id && (
                          <>
                            {/* Overlay to handle clicks outside */}
                            <div className="fixed inset-0 z-[100]" onClick={() => setActiveStatusEdit(null)} />
                            
                            {/* Local Dropdown - Fixed positioning to avoid clipping by table scroll */}
                            <div 
                              className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 w-48 py-3 z-[101] transition-all duration-200 overflow-hidden"
                              style={{ 
                                top: `${dropdownPos.top + 8}px`, 
                                left: `${Math.min(dropdownPos.left - 120, typeof window !== 'undefined' ? window.innerWidth - 200 : 0)}px` 
                              }}
                            >
                              <div className="px-5 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">เลือกสถานะ</p>
                              </div>
                              {["ฉบับร่าง", "ส่งแล้ว", "รอดำเนินการ", "อนุมัติแล้ว", "ปฏิเสธ"].map((status) => (
                                <button
                                  key={status}
                                  onClick={async () => {
                                    if (status !== q.status) {
                                      const updatedQ = { ...q, status: status as any };
                                      await updateQuotation(updatedQ);
                                      showToast(`เปลี่ยนสถานะเป็น "${status}" เรียบร้อย`, "success");
                                    }
                                    setActiveStatusEdit(null);
                                  }}
                                  className={`w-full text-left px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${
                                    q.status === status ? "text-teal-600 bg-teal-50/50" : "text-gray-600"
                                  }`}
                                >
                                  {status}
                                  {q.status === status && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 text-right">{q.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
