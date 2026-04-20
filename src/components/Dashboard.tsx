"use client";

import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

const statusColor: Record<string, string> = {
  "อนุมัติแล้ว": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "รอดำเนินการ": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "ส่งแล้ว": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  "ฉบับร่าง": "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  "ปฏิเสธ": "bg-red-50 text-red-600 ring-1 ring-red-200",
};

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

const statCards = [
  {
    label: "ใบเสนอราคาทั้งหมด",
    key: "total",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    label: "อนุมัติแล้ว",
    key: "approved",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    label: "รอดำเนินการ",
    key: "pending",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  {
    label: "รายได้รวม",
    key: "revenue",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
];

export default function Dashboard() {
  const { quotations, customers, updateQuotation, showToast } = useAppContext();
  const [activeStatusEdit, setActiveStatusEdit] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const currentYear = new Date().getFullYear() + 543;
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  const monthlyRevenue = months.map((_, i) => {
    return quotations
      .filter(q => {
        const parts = q.date.split("/");
        if (parts.length < 3) return false;
        return parseInt(parts[1]) - 1 === i && parseInt(parts[2]) === currentYear && q.status === "อนุมัติแล้ว";
      })
      .reduce((sum, q) => sum + q.amount, 0) / 1000;
  });

  const maxRevenue = Math.max(...monthlyRevenue, 1);

  const totalAmount = quotations.filter(q => q.status === "อนุมัติแล้ว").reduce((sum, q) => sum + q.amount, 0);
  const approvedCount = quotations.filter(q => q.status === "อนุมัติแล้ว").length;
  const pendingCount = quotations.filter(q => q.status === "รอดำเนินการ").length;

  const statValues: Record<string, string> = {
    total: quotations.length.toString(),
    approved: approvedCount.toString(),
    pending: pendingCount.toString(),
    revenue: formatCurrency(totalAmount),
  };

  const recentQuotations = [...quotations]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 6);

  const topCustomers = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 4);

  return (
    <div className="flex-1 overflow-auto bg-gray-50/40">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-5 md:space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle mt-1">ภาพรวมระบบจัดการใบเสนอราคา</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>ปี {currentYear}</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 stagger-children">
          {statCards.map((card) => (
            <div key={card.key} className="stat-card animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center ${card.text}`}>
                  {card.icon}
                </div>
                <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-500 mb-1">{card.label}</p>
              <p className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                {statValues[card.key]}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 md:gap-5">
          {/* Revenue Bar Chart */}
          <div className="card overflow-hidden">
            <div className="card-header">
              <div>
                <h2 className="text-sm font-bold text-gray-800">รายได้รายเดือน</h2>
                <p className="text-xs text-gray-400 mt-0.5">เฉพาะที่อนุมัติแล้ว</p>
              </div>
              <select className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600 cursor-pointer">
                <option>ปี {currentYear}</option>
                <option>ปี {currentYear - 1}</option>
              </select>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-1.5 h-[180px]">
                {monthlyRevenue.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full rounded-t-lg transition-all duration-700 cursor-pointer relative group min-h-[4px]"
                      style={{
                        height: `${Math.max((val / maxRevenue) * 160, 4)}px`,
                        background: val > 0
                          ? 'linear-gradient(to top, #283583, #6366f1)'
                          : '#e2e8f0',
                      }}
                    >
                      {val > 0 && (
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          ฿{val.toFixed(1)}K
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] md:text-[10px] text-gray-400 font-medium">
                      {months[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="card overflow-hidden">
            <div className="card-header">
              <h2 className="text-sm font-bold text-gray-800">ลูกค้ายอดนิยม</h2>
              <span className="text-xs text-gray-400">จากรายได้สูงสุด</span>
            </div>
            <div className="p-3 space-y-1">
              {topCustomers.length > 0 ? topCustomers.map((c, i) => (
                <div key={c.id || `c-${i}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm"
                    style={{
                      background: ['linear-gradient(135deg,#f59e0b,#ef4444)', 'linear-gradient(135deg,#283583,#6366f1)', 'linear-gradient(135deg,#10b981,#14b8a6)', 'linear-gradient(135deg,#8b5cf6,#6366f1)'][i] || 'linear-gradient(135deg,#94a3b8,#64748b)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.totalQuotations} ใบเสนอราคา</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">{formatCurrency(c.totalRevenue)}</span>
                </div>
              )) : (
                <div className="empty-state py-8">
                  <div className="empty-state-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">ยังไม่มีข้อมูลลูกค้า</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Quotations Table */}
        <div className="card overflow-hidden hidden md:block">
          <div className="card-header">
            <h2 className="text-sm font-bold text-gray-800">ใบเสนอราคาล่าสุด</h2>
            <span className="text-xs text-gray-400">{recentQuotations.length} รายการล่าสุด</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">เลขที่</th>
                  <th className="text-left">ลูกค้า</th>
                  <th className="text-right">จำนวนเงิน</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-right">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotations.map((q) => (
                  <tr key={q.id}>
                    <td className="px-4 py-3.5 text-sm font-bold" style={{ color: '#283583' }}>{q.id}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-700">{q.customer}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">{formatCurrency(q.amount)}</td>
                    <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className={`relative inline-block ${activeStatusEdit === q.id ? "z-50" : ""}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom, left: rect.left });
                            setActiveStatusEdit(activeStatusEdit === q.id ? null : q.id);
                          }}
                          className={`badge ${statusColor[q.status] || "bg-gray-100 text-gray-600"} hover:scale-105 transition-transform cursor-pointer`}
                        >
                          {q.status}
                        </button>

                        {activeStatusEdit === q.id && (
                          <>
                            <div className="fixed inset-0 z-[100]" onClick={() => setActiveStatusEdit(null)} />
                            <div
                              className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 w-48 py-2 z-[101] animate-scale-in overflow-hidden"
                              style={{ top: `${dropdownPos.top + 6}px`, left: `${Math.min(dropdownPos.left - 100, typeof window !== 'undefined' ? window.innerWidth - 200 : 0)}px` }}
                            >
                              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">เลือกสถานะ</p>
                              </div>
                              {["ฉบับร่าง", "ส่งแล้ว", "รอดำเนินการ", "อนุมัติแล้ว", "ปฏิเสธ"].map((status) => (
                                <button
                                  key={status}
                                  onClick={async () => {
                                    if (status !== q.status) {
                                      await updateQuotation({ ...q, status: status as any });
                                      showToast(`เปลี่ยนสถานะเป็น "${status}" เรียบร้อย`, "success");
                                    }
                                    setActiveStatusEdit(null);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${q.status === status ? "text-indigo-600" : "text-gray-600"}`}
                                >
                                  {status}
                                  {q.status === status && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-400 text-right">{q.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentQuotations.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">ยังไม่มีใบเสนอราคา</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
