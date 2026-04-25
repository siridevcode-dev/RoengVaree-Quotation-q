"use client";

import { useAppContext } from "@/context/AppContext";
import { useState, useRef, useEffect } from "react";

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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: "from-blue-600 to-indigo-700",
    shadow: "shadow-indigo-500/30",
  },
  {
    label: "อนุมัติแล้ว",
    key: "approved",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/30",
  },
  {
    label: "รอดำเนินการ",
    key: "pending",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-orange-500/30",
  },
  {
    label: "รายได้รวม",
    key: "revenue",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-violet-500 to-fuchsia-600",
    shadow: "shadow-fuchsia-500/30",
  },
];

export default function Dashboard() {
  const { quotations, customers, updateQuotation, showToast } = useAppContext();
  const [activeStatusEdit, setActiveStatusEdit] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const currentYearBE = new Date().getFullYear() + 543;
  const currentYearAD = new Date().getFullYear();
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  const monthlyRevenue = months.map((_, i) => {
    return quotations
      .filter(q => {
        const parts = q.date.split("/");
        if (parts.length < 3) return false;
        const qMonth = parseInt(parts[1]);
        const qYear = parseInt(parts[2]);
        // Handle both AD and BE years in data
        const isMatchYear = qYear === currentYearAD || qYear === currentYearBE;
        return qMonth - 1 === i && isMatchYear && q.status === "อนุมัติแล้ว";
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
    <div className="flex-1 overflow-auto bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in">
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
            <span>ปี {currentYearBE}</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 stagger-children">
          {statCards.map((card) => (
            <div 
              key={card.key} 
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 md:p-6 text-white shadow-lg ${card.shadow} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}
            >
              {/* Decorative background shape */}
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
              
              <div className="relative z-10 flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner">
                  {card.icon}
                </div>
                <button 
                  title="ดูรายละเอียดแนวโน้ม"
                  className="bg-white/20 backdrop-blur-md rounded-full p-1.5 cursor-pointer hover:bg-white/30 transition-colors border-none"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </button>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-white/80 mb-1">{card.label}</p>
                <p className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  {statValues[card.key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 md:gap-6">
          {/* Revenue Bar Chart */}
          <div className="card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-indigo-50/50">
            <div className="card-header">
              <div>
                <h2 className="text-sm font-bold text-gray-800">รายได้รายเดือน</h2>
                <p className="text-xs text-gray-400 mt-0.5">เฉพาะที่อนุมัติแล้ว</p>
              </div>
              <select 
                title="เลือกปีที่แสดงข้อมูล"
                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600 cursor-pointer"
              >
                <option>ปี {currentYearBE}</option>
                <option>ปี {currentYearBE - 1}</option>
              </select>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-1.5 h-[180px]">
                {monthlyRevenue.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <DynamicBox
                      className={`w-full rounded-t-xl transition-all duration-700 cursor-pointer relative group min-h-[4px] ${
                        val > 0 ? 'bg-gradient-to-t from-indigo-600 to-purple-500' : 'bg-slate-100'
                      }`}
                      height={`${Math.max((val / maxRevenue) * 160, 4)}px`}
                    >
                      {val > 0 && (
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          ฿{val.toFixed(1)}K
                        </div>
                      )}
                    </DynamicBox>
                    <span className="text-[9px] md:text-[10px] text-gray-400 font-medium">
                      {months[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-indigo-50/50 flex flex-col">
            <div className="card-header">
              <h2 className="text-sm font-bold text-gray-800">ลูกค้ายอดนิยม</h2>
              <span className="text-xs text-gray-400">จากรายได้สูงสุด</span>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-center">
              {topCustomers.length > 0 ? topCustomers.map((c, i) => (
                <div key={c.id || `c-${i}`} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-indigo-50/50 transition-colors group cursor-pointer border border-transparent hover:border-indigo-100">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-md transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br ${
                      [
                        'from-amber-500 to-red-500',
                        'from-blue-500 to-indigo-600',
                        'from-emerald-500 to-teal-500',
                        'from-violet-500 to-fuchsia-500'
                      ][i] || 'from-slate-400 to-slate-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate group-hover:text-indigo-700 transition-colors">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.totalQuotations} ใบเสนอราคา</p>
                  </div>
                  <span className="text-sm font-black text-gray-800 flex-shrink-0 bg-gray-50 px-2.5 py-1 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">{formatCurrency(c.totalRevenue)}</span>
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
        <div className="card overflow-hidden hidden md:block shadow-sm border-indigo-50/50">
          <div className="card-header bg-white">
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
                  <tr key={q.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-black text-indigo-600">{q.id}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-800">{q.customer}</td>
                    <td className="px-5 py-4 text-sm font-black text-gray-800 text-right">{formatCurrency(q.amount)}</td>
                    <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className={`relative inline-block ${activeStatusEdit === q.id ? "z-50" : ""}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom, left: rect.left });
                            setActiveStatusEdit(activeStatusEdit === q.id ? null : q.id);
                          }}
                          title="คลิกเพื่อเปลี่ยนสถานะ"
                          className={`badge ${statusColor[q.status] || "bg-gray-100 text-gray-600"} hover:scale-105 transition-transform cursor-pointer shadow-sm`}
                        >
                          {q.status}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-500 text-right">{q.date}</td>
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

      {/* Status Edit Dropdown (Fixed Positioning) */}
      {activeStatusEdit && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setActiveStatusEdit(null)} />
          <DynamicBox 
            className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 w-48 py-2 z-[101] animate-scale-in overflow-hidden"
            top={`${dropdownPos.top + 6}px`}
            left={`${Math.min(dropdownPos.left - 100, typeof window !== 'undefined' ? window.innerWidth - 200 : 0)}px`}
          >
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">เลือกสถานะ</p>
            </div>
            {["ฉบับร่าง", "ส่งแล้ว", "รอดำเนินการ", "อนุมัติแล้ว", "ปฏิเสธ"].map((status) => {
              const activeQ = quotations.find(q => q.id === activeStatusEdit);
              if (!activeQ) return null;
              return (
                <button
                  key={status}
                  onClick={async () => {
                    if (status !== activeQ.status) {
                      await updateQuotation({ ...activeQ, status: status as any });
                      showToast(`เปลี่ยนสถานะเป็น "${status}" เรียบร้อย`, "success");
                    }
                    setActiveStatusEdit(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${activeQ.status === status ? "text-indigo-600" : "text-gray-600"}`}
                >
                  {status}
                  {activeQ.status === status && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </button>
              );
            })}
          </DynamicBox>
        </>
      )}
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
