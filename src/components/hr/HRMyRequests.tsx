"use client";

import { useState, useMemo } from "react";

interface MyRequest {
  id: string;
  docNo: string;
  status: "อนุมัติ" | "รออนุมัติ" | "ปฏิเสธ" | "ยกเลิก";
  type: string;
  requestedDate: string;
  duration: string;
  reason: string;
  createdDate: string;
}

export default function HRMyRequests() {
  const [viewMode, setViewMode] = useState<"categories" | "list" | "form">("categories");
  const [activeTab, setActiveTab] = useState("ลางาน");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2569");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("ทำงานที่บ้าน");
  const [isExpenseCreateOpen, setIsExpenseCreateOpen] = useState(false);
  const [expenseFormType, setExpenseFormType] = useState<"expense" | "salary_advance">("expense");

  const handleCategoryClick = (label: string) => {
    setActiveTab(label);
    setViewMode("list");
  };

  const handleCreateClick = () => {
    setViewMode("form");
  };

  const tabs = [
    { 
      label: "ลางาน", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      label: "ปฏิบัติงานนอกสถานที่", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      label: "โอที", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7V5m0 14v-2M5 12H3m18 0h-2" />
        </svg>
      )
    },
    { 
      label: "สลับกะการทำงาน", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    { 
      label: "เปลี่ยนกะการทำงาน", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    { 
      label: "เปลี่ยนเวลาทำงาน", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2" />
        </svg>
      )
    },
    { 
      label: "เปลี่ยนวันหยุด", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      label: "ค่าใช้จ่าย & เบิกเงิน", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
  ];

  const [requests] = useState<MyRequest[]>([
    {
      id: "1",
      docNo: "L2600011",
      status: "อนุมัติ",
      type: "ลาหยุดพักร้อนประจำปี",
      requestedDate: "05 - 08/05/2569",
      duration: "4 วัน (ทั้งวัน)",
      reason: "เที่ยว",
      createdDate: "28/04/2569",
    }
  ]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.docNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           req.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "ทั้งหมด" || req.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, selectedStatus]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "อนุมัติ": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "รออนุมัติ": return "bg-amber-50 text-amber-600 border-amber-100";
      case "ปฏิเสธ": return "bg-rose-50 text-rose-600 border-rose-100";
      case "ยกเลิก": return "bg-slate-50 text-slate-400 border-slate-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setViewMode("list");
    }, 1500);
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-hidden font-sans p-8 gap-6 animate-in fade-in duration-700">
      
      {viewMode === "categories" ? (
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04] bg-[radial-gradient(circle,#283583,transparent_70%)]" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-[0.03] bg-[radial-gradient(circle,#6366f1,transparent_70%)]" />
          </div>

          <div className="text-center mb-10 animate-fade-in relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold mb-4 bg-gradient-to-br from-[#283583]/[0.08] to-[#6366f1]/[0.08] text-[#283583]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              คำขอของฉัน
            </div>
            <h1 className="text-[30px] font-black mb-2 text-[#1e293b]">เลือกประเภทคำขอ</h1>
            <p className="text-[14px] font-medium text-[#94a3b8]">เลือกหมวดหมู่ที่ต้องการตรวจสอบหรือสร้างคำขอใหม่</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[960px] w-full relative z-10 stagger-children">
            {tabs.map((tab, i) => {
              const gradients = [
                'linear-gradient(135deg, #283583, #4f46e5)',
                'linear-gradient(135deg, #0d9488, #14b8a6)',
                'linear-gradient(135deg, #6366f1, #818cf8)',
                'linear-gradient(135deg, #0284c7, #38bdf8)',
                'linear-gradient(135deg, #7c3aed, #a78bfa)',
                'linear-gradient(135deg, #dc2626, #f87171)',
                'linear-gradient(135deg, #d97706, #fbbf24)',
              ];
              const currentGradient = gradients[i % gradients.length];
              const currentShadow = [
                'rgba(40,53,131,0.25)',
                'rgba(13,148,136,0.25)',
                'rgba(99,102,241,0.25)',
                'rgba(2,132,199,0.25)',
                'rgba(124,58,237,0.25)',
                'rgba(220,38,38,0.25)',
                'rgba(217,119,6,0.25)'
              ][i % 7];
              const gradClass = `grad-${(i % 7) + 1}`;
              const shadowClass = `shadow-grad-${(i % 7) + 1}`;
              const delayClass = `delay-${Math.min(i * 70, 630)}`;

              return (
              <button
                key={tab.label}
                onClick={() => handleCategoryClick(tab.label)}
                className={`animate-fade-in relative bg-white p-7 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all duration-300 group flex flex-col items-center gap-5 active:scale-[0.97] cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(40,53,131,0.1)] hover:-translate-y-1 ${delayClass}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-[0_8px_20px_var(--shadow-color)] ${gradClass} ${shadowClass}`} >
                  {tab.icon}
                </div>
                <span className="text-[13.5px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors text-center leading-snug">{tab.label}</span>
                <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${gradClass}`} />
              </button>
            );})}
          </div>
        </div>
      ) : viewMode === "list" ? (
        <>
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setViewMode("categories")}
              title="ย้อนกลับ"
              className="w-11 h-11 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#283583] hover:border-[#283583]/20 transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex flex-col">
              <h2 className="text-[24px] font-black text-slate-800 leading-tight">คำขอ{activeTab}</h2>
              <p className="text-slate-400 text-[13px] font-bold">จัดการและติดตามสถานะคำขอของคุณ</p>
            </div>
          </div>

          {/* Specific Filter Bar for Expenses (ค่าใช้จ่าย & เบิกเงิน) */}
          {activeTab === "ค่าใช้จ่าย & เบิกเงิน" ? (
            <div className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative group flex-1 max-w-xs">
                  <input 
                    type="text" 
                    placeholder="ค้นหาค่าใช้จ่าย" 
                    title="ค้นหาค่าใช้จ่าย"
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-700 outline-none focus:border-sky-500 transition-all"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Category Dropdown */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-2 text-[10px] font-bold text-slate-300">หมวดหมู่</label>
                  <select title="หมวดหมู่" className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-bold text-slate-600 outline-none appearance-none cursor-pointer min-w-[120px]">
                    <option>ทั้งหมด</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-2 text-[10px] font-bold text-slate-300">สถานะ</label>
                  <select title="สถานะ" className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-bold text-slate-600 outline-none appearance-none cursor-pointer min-w-[120px]">
                    <option>ทั้งหมด</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Year Picker */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-2 text-[10px] font-bold text-slate-300">ปี</label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer">
                    <span className="text-[14px] font-bold text-slate-600">2569</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>

                {/* Create Button with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsExpenseCreateOpen(!isExpenseCreateOpen)}
                    className="flex items-center gap-2 bg-[#0ea5e9] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-lg shadow-sky-100 hover:bg-[#0284c7] transition-all"
                  >
                    <span className="text-[18px] leading-none">+</span>
                    <span>สร้าง</span>
                    <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpenseCreateOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isExpenseCreateOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsExpenseCreateOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => { setViewMode("form"); setExpenseFormType("expense"); setIsExpenseCreateOpen(false); }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#283583] group-hover:bg-slate-100 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 11V9m0 0v2m0-2h-2m2 0h2" /></svg>
                          </div>
                          <span className="text-[14px] font-bold text-slate-600 group-hover:text-slate-800">สร้างค่าใช้จ่าย</span>
                        </button>
                        <button 
                          onClick={() => { setViewMode("form"); setExpenseFormType("salary_advance"); setIsExpenseCreateOpen(false); }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#283583] group-hover:bg-slate-100 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 11V9m0 0v2m0-2h-2m2 0h2" /></svg>
                          </div>
                          <span className="text-[14px] font-bold text-slate-600 group-hover:text-slate-800">เบิกเงินเดือน</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Filter Settings Button */}
                <button title="ตัวกรอง" className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </button>
              </div>
            </div>
          ) : (
            /* Original Filter Bar */
            <div className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative group flex-1 max-sm">
                  <input 
                    type="text" 
                    placeholder="ค้นหาเลขที่เอกสาร..." 
                    title="ค้นหาเลขที่เอกสาร"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-[14px] font-bold text-slate-700 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Year Select */}
                <div className="relative group">
                  <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black text-slate-300 group-focus-within:text-sky-500 z-10 border border-slate-50 rounded">ปี</span>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2 hover:border-sky-300 transition-all cursor-pointer">
                    <span className="text-[14px] font-black text-slate-600">{selectedYear}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>

                {/* Status Select */}
                <div className="relative group min-w-[140px]">
                  <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black text-slate-300 group-focus-within:text-sky-500 z-10 border border-slate-50 rounded">สถานะเอกสาร</span>
                  <select 
                    title="สถานะเอกสาร"
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 text-[13.5px] font-bold text-slate-700 outline-none hover:border-sky-300 transition-all appearance-none cursor-pointer"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option>ทั้งหมด</option>
                    <option>อนุมัติ</option>
                    <option>รออนุมัติ</option>
                    <option>ปฏิเสธ</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Create Button - Simple */}
                <button 
                  onClick={() => setViewMode("form")}
                  className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all active:scale-95 group shadow-lg shadow-sky-500/20 bg-[#0ea5e9]" 
                >
                  <span className="text-[18px] leading-none group-hover:rotate-90 transition-transform">+</span> 
                  <span>สร้าง</span>
                </button>
              </div>
            </div>
          )}

          {/* Request Table Card */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col flex-1">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-gradient-to-b from-[#283583] to-[#6366f1]" />
                <h3 className="text-[16px] font-black text-slate-800 uppercase tracking-tight">{filteredRequests.length} รายการ</h3>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50/50 sticky top-0 z-10">
                  <tr className="border-b border-slate-100">
                    <th className="pl-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        เลขที่
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest text-center">
                      <div className="flex items-center justify-center gap-2">
                        สถานะ
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </th>
                    {activeTab === "ค่าใช้จ่าย & เบิกเงิน" ? (
                      <>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest">ผู้สร้างเอกสาร</th>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            หัวข้อ
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                          </div>
                        </th>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest">หมวดหมู่</th>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest text-center">
                          <div className="flex items-center justify-center gap-2">
                            วันที่สร้าง
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                          </div>
                        </th>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest text-center">วันที่ใช้จ่าย</th>
                        <th className="px-6 py-5 text-[12px] font-black text-white uppercase tracking-widest bg-[#0ea5e9] text-center">รวมยอดค่าใช้จ่าย</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest">ประเภท</th>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest">วันที่ขอ</th>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest text-center">ระยะเวลา</th>
                        <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest">เหตุผล</th>
                        <th className="pr-8 py-5 text-right">จัดการ</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeTab === "ค่าใช้จ่าย & เบิกเงิน" ? (
                    <tr className="group hover:bg-slate-50/40 transition-all cursor-pointer">
                      <td className="pl-8 py-5">
                        <span className="text-[14px] font-bold text-slate-500 uppercase tracking-tight">EXP2600008</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-sky-50 text-sky-600 border border-sky-100 uppercase tracking-wider">
                          รอดำเนินการ
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center relative border border-white shadow-sm overflow-hidden">
                            <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            <div className="absolute -top-1 -left-1 text-[8px] scale-75">👑</div>
                          </div>
                          <span className="text-[13.5px] font-bold text-slate-600">กิติมา พาณุเวช (เจ้าของบริษัท)</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-bold text-slate-600">ค่าซื้ออุปกรณ์วันนี้</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-sm">
                            <span className="text-[10px] font-black leading-none">$</span>
                          </div>
                          <span className="text-[13.5px] font-bold text-slate-500">ค่าคอมมิชชั่น</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-[13.5px] font-bold text-slate-500">02/05/2569</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-[13.5px] font-bold text-slate-500">02/05/2569</span>
                      </td>
                      <td className="px-6 py-5 bg-sky-50/40">
                        <span className="text-[15px] font-black text-slate-700 block text-center">฿25.00</span>
                      </td>
                    </tr>
                  ) : filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="group hover:bg-slate-50/40 transition-all cursor-pointer">
                        <td className="pl-8 py-5">
                          <span className="text-[14.5px] font-bold text-slate-400 group-hover:text-sky-600 transition-colors">{req.docNo}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black border transition-all ${getStatusStyle(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[14.5px] font-bold text-slate-700">{req.type}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[14.5px] font-bold text-slate-600">{req.requestedDate}</span>
                            <span className="text-[11px] font-bold text-sky-500 mt-0.5">{req.duration.split(" ")[0]} วัน</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[14px] font-bold text-slate-500">{req.duration.includes("ทั้งวัน") ? "ทั้งวัน" : req.duration}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[14px] font-bold text-slate-500 line-clamp-1">{req.reason}</span>
                        </td>
                        <td className="pr-8 py-5 text-right">
                          <button title="ดูรายละเอียด" className="p-2 text-slate-300 hover:text-sky-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <p className="text-slate-400 font-bold">ไม่พบข้อมูลคำขอในหมวดหมู่นี้</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Redesigned Pagination Row */}
            <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select title="จำนวนต่อหน้า" className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[13px] font-bold text-slate-600 outline-none appearance-none cursor-pointer pr-8">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <button title="สลับ" className="text-slate-300 hover:text-slate-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v12a1 1 0 002 0V4zM11 5a1 1 0 011-1h5a1 1 0 110 2h-5a1 1 0 01-1-1zM9 11a1 1 0 011-1h7a1 1 0 110 2h-7a1 1 0 01-1-1zM7 17a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1z" /></svg>
                  </button>
                  <button title="สลับทิศทาง" className="text-slate-300 hover:text-slate-500 transition-colors">
                    <svg className="w-5 h-5 rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v12a1 1 0 002 0V4zM11 5a1 1 0 011-1h5a1 1 0 110 2h-5a1 1 0 01-1-1zM9 11a1 1 0 011-1h7a1 1 0 110 2h-7a1 1 0 01-1-1zM7 17a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1z" /></svg>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button title="ก่อนหน้า" className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-sky-500 text-white text-[13px] font-black flex items-center justify-center shadow-lg shadow-sky-100">1</button>
                  <button title="ถัดไป" className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Form Creation View */
        <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewMode("list")}
                title="ย้อนกลับ"
                className="w-11 h-11 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#283583] hover:border-[#283583]/20 transition-all active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex flex-col">
                <h2 className="text-[24px] font-black text-slate-800 leading-tight">
                  สร้างคำขอ{activeTab === "ค่าใช้จ่าย & เบิกเงิน" ? (expenseFormType === "expense" ? "ค่าใช้จ่าย" : "เบิกเงินเดือน") : activeTab}
                </h2>
                <p className="text-slate-400 text-[13px] font-bold">ระบุรายละเอียดคำขอของคุณให้ครบถ้วน</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-y-auto custom-scrollbar p-10">
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Redesigned Expense Form (สร้างค่าใช้จ่าย / เบิกเงินเดือน) */}
                {activeTab === "ค่าใช้จ่าย & เบิกเงิน" && (
                  <div className="space-y-10 py-2">
                    {expenseFormType === "expense" ? (
                      <>
                        <h2 className="text-[24px] font-black text-slate-800 mb-8">สร้างคำขอค่าใช้จ่าย</h2>
                        
                        {/* รายละเอียด Section */}
                        <div className="space-y-6">
                          <h3 className="text-[16px] font-black text-slate-800">รายละเอียด</h3>
                          
                          <div className="space-y-4">
                            <div className="relative group">
                              <input 
                                type="text" 
                                placeholder="หัวข้อ *" 
                                title="หัวข้อ"
                                required
                                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm"
                              />
                            </div>
                            
                            <div className="relative group">
                              <textarea 
                                placeholder="รายละเอียด" 
                                title="รายละเอียด"
                                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm min-h-[120px] resize-none"
                              />
                            </div>

                            <div className="relative group">
                              <label className="absolute -top-2.5 left-4 bg-white px-2 text-[12px] font-bold text-slate-400 z-10">วันที่ใช้จ่าย</label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  defaultValue="06/05/2569"
                                  title="วันที่ใช้จ่าย"
                                  placeholder="วว/ดด/ปปปป"
                                  className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* รายการ Section */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[16px] font-black text-slate-800">รายการ</h3>
                            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sky-100 text-sky-500 text-[14px] font-black hover:bg-sky-50 transition-all">
                              <span>+</span>
                              <span>เพิ่มรายการ</span>
                            </button>
                          </div>

                          <div className="p-6 rounded-[28px] border-2 border-dashed border-slate-100 space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex-1 min-w-[200px] relative">
                                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[12px] font-bold text-slate-300 z-10">หมวดหมู่</label>
                                <div className="relative">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                  </div>
                                  <select title="เลือกหมวดหมู่" className="w-full pl-11 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-sky-600 outline-none appearance-none cursor-pointer">
                                    <option>ค่าเดินทาง</option>
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 min-w-[200px] relative">
                                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[12px] font-bold text-slate-300 z-10">ยอดค่าใช้จ่าย *</label>
                                <div className="relative">
                                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[15px] font-black text-slate-300">฿</span>
                                  <input 
                                    type="text" 
                                    placeholder="0.00" 
                                    title="ยอดค่าใช้จ่าย"
                                    className="w-full pl-10 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[16px] font-black text-slate-800 pt-2">
                            <span>รวมยอดค่าใช้จ่าย :</span>
                            <span className="text-slate-900">฿0.00</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-[24px] font-black text-slate-800 mb-8">สร้างคำขอเบิกเงินเดือน</h2>
                        
                        {/* รายละเอียด Section */}
                        <div className="space-y-6">
                          <h3 className="text-[16px] font-black text-slate-800">รายละเอียด</h3>
                          <div className="relative group">
                            <textarea 
                              placeholder="รายละเอียด" 
                              title="รายละเอียด"
                              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm min-h-[120px] resize-none"
                            />
                          </div>
                        </div>

                        {/* Balance Info */}
                        <div className="flex items-center justify-between p-1">
                          <span className="text-[16px] font-bold text-slate-500">สามารถเบิกเงินเดือนได้ไม่เกิน :</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[18px] font-black text-slate-800">฿5,000.00</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-100">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                          </div>
                        </div>

                        {/* Amount Input */}
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-4 bg-white px-2 text-[12px] font-bold text-slate-300 z-10">ยอดเงิน *</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[15px] font-black text-slate-300">฿</span>
                            <input 
                              type="text" 
                              placeholder="0.00" 
                              title="ยอดเงิน"
                              className="w-full pl-10 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* ไฟล์แนบ Section (Shared) */}
                    <div className="space-y-6">
                      <h3 className="text-[16px] font-black text-slate-800">ไฟล์แนบ</h3>
                      
                      <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-12 bg-slate-50/30 group hover:bg-slate-50 transition-all cursor-pointer">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-slate-200 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          </div>
                          <p className="text-[16px] font-bold text-slate-400">
                            ลากไฟล์วางที่นี่หรือ<span className="text-slate-800">เลือกไฟล์</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-[12px] font-bold text-slate-300 ml-1">ประเภทไฟล์ .jpg .jpeg .png .pdf</p>
                    </div>

                    {/* Action Buttons (Shared) */}
                    <div className="pt-10 flex items-center justify-end gap-4">
                      <button 
                        type="button" 
                        onClick={() => setViewMode("list")}
                        className="px-10 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                      >
                        ยกเลิก
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3 rounded-xl bg-[#cceeff] text-[#0ea5e9] text-[15px] font-black shadow-lg shadow-sky-100 hover:bg-[#bce8ff] transition-all active:scale-95"
                      >
                        สร้าง
                      </button>
                    </div>
                  </div>
                )}

                {/* Redesigned Leave Form (ลางาน) */}
                {activeTab === "ลางาน" && (
                  <div className="space-y-8 py-2">
                    <h2 className="text-[22px] font-black text-slate-800 mb-6">สร้างคำขอลางาน</h2>
                    
                    {/* Leave Type with Balance Hint */}
                    <div className="space-y-2">
                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-white px-2 text-[12px] font-bold text-slate-400 z-10">ประเภทคำขอ *</label>
                        <div className="relative">
                          <select 
                            title="ประเภทการลา" 
                            required
                            className="w-full pl-5 pr-28 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all appearance-none cursor-pointer shadow-sm"
                          >
                            <option>ลาหยุดพักร้อนประจำปี</option>
                            <option>ลาป่วย</option>
                            <option>ลากิจ</option>
                          </select>
                          <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[14px] font-bold text-slate-300">
                            เหลือ 2 วัน
                          </div>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ระยะเวลา</label>
                      <div className="flex items-center gap-8 ml-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" title="ลาทั้งวัน" name="durationType" defaultChecked className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-sky-500 transition-all" />
                            <div className="absolute w-2.5 h-2.5 bg-sky-500 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className="text-[15px] font-bold text-slate-600 group-hover:text-slate-800">ทั้งวัน</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" title="ลาเป็นชั่วโมง" name="durationType" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-sky-500 transition-all" />
                            <div className="absolute w-2.5 h-2.5 bg-sky-500 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className="text-[15px] font-bold text-slate-600 group-hover:text-slate-800">ชั่วโมง</span>
                        </label>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันที่เริ่มต้น *" 
                            title="วันที่เริ่มต้น"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันที่สิ้นสุด *" 
                            title="วันที่สิ้นสุด"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="relative group">
                      <textarea 
                        rows={3} 
                        placeholder="เหตุผลการลา *" 
                        title="เหตุผลการลา"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all resize-none shadow-sm placeholder:text-slate-400"
                      />
                    </div>

                    {/* Supervisor / Responsible Person */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ผู้รับผิดชอบ</label>
                      <div className="relative group">
                        <div className="relative">
                          <select 
                            title="หัวหน้างาน"
                            className="w-full pl-5 pr-10 py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-[15px] font-medium text-slate-400 outline-none hover:border-slate-200 transition-all appearance-none cursor-pointer"
                          >
                            <option>หัวหน้างาน</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-4">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ไฟล์แนบ</label>
                      <div className="w-full p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 hover:border-sky-200 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-all duration-500">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                        </div>
                        <div className="text-center">
                          <p className="text-[16px] font-bold text-slate-500">ลากไฟล์วางที่นี้หรือ<span className="text-slate-800">เลือกไฟล์</span></p>
                        </div>
                      </div>
                      <p className="text-[12px] font-medium text-slate-400 ml-1">ประเภทไฟล์ .jpg .jpeg .png .pdf</p>
                    </div>

                    {/* Buttons Row */}
                    <div className="pt-6 flex items-center justify-end gap-4">
                      <button 
                        type="button"
                        onClick={() => setViewMode("list")}
                        className="px-10 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        ยกเลิก
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3 rounded-xl bg-[#c0eaff] text-[#0ea5e9] text-[15px] font-black transition-all active:scale-95 flex items-center gap-2 hover:bg-[#b0e0f8]"
                      >
                        <span className="text-[20px] leading-none font-light">+</span>
                        <span>สร้าง</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Redesigned Off-site Work Form (ปฏิบัติงานนอกสถานที่) */}
                {activeTab === "ปฏิบัติงานนอกสถานที่" && (
                  <div className="space-y-8 py-2">
                    <h2 className="text-[22px] font-black text-slate-800 mb-6">สร้างคำขอทำงานนอกสถานที่</h2>
                    
                    {/* Custom Work Type Dropdown */}
                    <div className="space-y-2">
                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-white px-2 text-[12px] font-bold text-slate-400 z-10">ประเภทคำขอ *</label>
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                            className={`w-full pl-5 pr-10 py-4 bg-white border ${isTypeDropdownOpen ? 'border-sky-500 ring-2 ring-sky-500/10' : 'border-slate-200'} rounded-2xl text-[15px] font-bold text-slate-700 text-left outline-none transition-all shadow-sm flex items-center justify-between`}
                          >
                            <span>{selectedType || "เลือกประเภทคำขอ..."}</span>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </button>

                          {isTypeDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsTypeDropdownOpen(false)} />
                              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-1">
                                  {["ทำงานที่บ้าน", "ทำงานนอกสถานที่ (ลูกค้า)", "สัมมนา / อบรม"].map((type) => (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => {
                                        setSelectedType(type);
                                        setIsTypeDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${selectedType === type ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                      {type}
                                    </button>
                                  ))}
                                  
                                  <div className="h-px bg-slate-100 my-1" />
                                  
                                  <button
                                    type="button"
                                    className="w-full text-left px-4 py-3 rounded-xl text-[15px] font-bold text-sky-500 hover:bg-sky-50 transition-all flex items-center gap-2"
                                  >
                                    <span className="text-[18px] leading-none">+</span>
                                    <span>เพิ่มใหม่</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ระยะเวลา</label>
                      <div className="flex items-center gap-8 ml-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" title="ทำงานนอกสถานที่ทั้งวัน" name="offsiteDurationType" defaultChecked className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-sky-500 transition-all" />
                            <div className="absolute w-2.5 h-2.5 bg-sky-500 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className="text-[15px] font-bold text-slate-600 group-hover:text-slate-800">ทั้งวัน</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" title="ทำงานนอกสถานที่รายชั่วโมง" name="offsiteDurationType" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-sky-500 transition-all" />
                            <div className="absolute w-2.5 h-2.5 bg-sky-500 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className="text-[15px] font-bold text-slate-600 group-hover:text-slate-800">ชั่วโมง</span>
                        </label>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันที่เริ่มต้น *" 
                            title="วันที่เริ่มต้น"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันที่สิ้นสุด *" 
                            title="วันที่สิ้นสุด"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="relative group">
                      <textarea 
                        rows={3} 
                        placeholder="รายละเอียดเพิ่มเติม *" 
                        title="รายละเอียดเพิ่มเติม"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all resize-none shadow-sm placeholder:text-slate-400"
                      />
                    </div>

                    {/* Supervisor / Responsible Person */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ผู้รับผิดชอบ</label>
                      <div className="relative group">
                        <div className="relative">
                          <select 
                            title="หัวหน้างาน"
                            className="w-full pl-5 pr-10 py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-[15px] font-medium text-slate-400 outline-none hover:border-slate-200 transition-all appearance-none cursor-pointer"
                          >
                            <option>หัวหน้างาน</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-4">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ไฟล์แนบ</label>
                      <div className="w-full p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 hover:border-sky-200 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-all duration-500">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                        </div>
                        <div className="text-center">
                          <p className="text-[16px] font-bold text-slate-500">ลากไฟล์วางที่นี้หรือ<span className="text-slate-800">เลือกไฟล์</span></p>
                        </div>
                      </div>
                      <p className="text-[12px] font-medium text-slate-400 ml-1">ประเภทไฟล์ .jpg .jpeg .png .pdf</p>
                    </div>

                    {/* Buttons Row */}
                    <div className="pt-6 flex items-center justify-end gap-4">
                      <button 
                        type="button"
                        onClick={() => setViewMode("list")}
                        className="px-10 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        ยกเลิก
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3 rounded-xl bg-[#c0eaff] text-[#0ea5e9] text-[15px] font-black transition-all active:scale-95 flex items-center gap-2 hover:bg-[#b0e0f8]"
                      >
                        <span className="text-[20px] leading-none font-light">+</span>
                        <span>สร้าง</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Redesigned OT Form (โอที) */}
                {activeTab === "โอที" && (
                  <div className="space-y-8 py-2">
                    <h2 className="text-[22px] font-black text-slate-800 mb-6">สร้างคำขอโอที</h2>
                    
                    {/* OT Date */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">เลือกวันที่ต้องการทำโอที</label>
                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-white px-2 text-[12px] font-bold text-slate-400 z-10">วันที่ต้องการทำโอที *</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            defaultValue="06/05/2569"
                            title="วันที่ต้องการทำโอที"
                            placeholder="วว/ดด/ปปปป"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Range */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="เวลาเริ่ม" 
                            title="เวลาเริ่มโอที"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm placeholder:text-slate-300"
                            onFocus={(e) => e.target.type = 'time'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-400 font-bold">—</div>
                      <div className="flex-1 relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="สิ้นสุด" 
                            title="เวลาสิ้นสุดโอที"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all shadow-sm placeholder:text-slate-300"
                            onFocus={(e) => e.target.type = 'time'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="relative group">
                      <textarea 
                        rows={3} 
                        placeholder="รายละเอียดเพิ่มเติม *" 
                        title="รายละเอียดเพิ่มเติม"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all resize-none shadow-sm placeholder:text-slate-300"
                      />
                    </div>

                    {/* Supervisor / Responsible Person */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ผู้รับผิดชอบ</label>
                      <div className="relative group">
                        <div className="relative">
                          <select 
                            title="หัวหน้างาน"
                            className="w-full pl-5 pr-10 py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-[15px] font-medium text-slate-400 outline-none hover:border-slate-200 transition-all appearance-none cursor-pointer"
                          >
                            <option>หัวหน้างาน</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-4">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ไฟล์แนบ</label>
                      <div className="w-full p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 hover:border-sky-200 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-all duration-500">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                        </div>
                        <div className="text-center">
                          <p className="text-[16px] font-bold text-slate-500">ลากไฟล์วางที่นี้หรือ<span className="text-slate-800">เลือกไฟล์</span></p>
                        </div>
                      </div>
                      <p className="text-[12px] font-medium text-slate-400 ml-1">ประเภทไฟล์ .jpg .jpeg .png .pdf</p>
                    </div>

                    {/* Buttons Row */}
                    <div className="pt-6 flex items-center justify-between">
                      <button 
                        type="button"
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>เงื่อนไขโอที</span>
                      </button>
                      
                      <div className="flex items-center gap-4">
                        <button 
                          type="button"
                          onClick={() => setViewMode("list")}
                          className="px-10 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                          ยกเลิก
                        </button>
                        <button 
                          type="submit"
                          className="px-10 py-3 rounded-xl bg-[#0ea5e9] text-white text-[15px] font-black transition-all active:scale-95 flex items-center gap-2 hover:bg-[#0284c7] shadow-lg shadow-sky-100"
                        >
                          <span className="text-[20px] leading-none font-light">+</span>
                          <span>สร้าง</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Redesigned Shift Swap Form (สลับกะการทำงาน) */}
                {activeTab === "สลับกะการทำงาน" && (
                  <div className="space-y-8 py-2">
                    <h2 className="text-[22px] font-black text-slate-800 mb-6">สร้างคำขอสลับกะการทำงาน</h2>
                    
                    {/* Swap Partner Selection */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">พนักงานที่สลับกะด้วย</label>
                      <div className="relative group">
                        <select 
                          title="พนักงานที่สลับกะด้วย" 
                          required
                          className="w-full pl-5 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                          <option>พนักงานที่สลับกะด้วย *</option>
                          <option>สมพงษ์ ใจดี</option>
                          <option>วิภาดา รักเรียน</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Swap Details Section */}
                    <div className="space-y-4">
                      <label className="text-[15px] font-black text-slate-800 ml-1">รายละเอียด</label>
                      
                      {/* Swap Date Picker */}
                      <div className="relative group max-w-sm">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันที่สลับกะ *" 
                            title="วันที่สลับกะ"
                            className="w-full pl-5 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>

                      {/* Comparison Cards */}
                      <div className="flex items-center gap-4 py-2">
                        {/* Original Shift Card */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                          <span className="text-[14px] font-black text-slate-800 block mb-3 underline decoration-slate-200 underline-offset-4">จากเดิม</span>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 relative">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                              <div className="absolute -top-1 -left-1 text-[10px]">👑</div>
                            </div>
                            <span className="text-[14px] font-bold text-slate-600">กิติมา พาณุเวช (เจ้าของบริษัท)</span>
                          </div>
                          <div className="flex items-center gap-3 ml-1">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-400 uppercase tracking-tighter">SHIFT101</span>
                            <span className="text-[13px] font-black text-slate-800">เวลาทำงาน 08:00 - 17:00</span>
                          </div>
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                              <span className="text-[14px] font-bold text-slate-300">-</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-sky-400"><div className="w-1.5 h-1.5 bg-sky-400 rounded-full" /></div>
                              <span className="text-[14px] font-bold text-slate-300">-</span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="text-slate-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>

                        {/* Swap Shift Card */}
                        <div className="flex-1 bg-white border border-sky-300 rounded-2xl p-5 shadow-[0_4px_20px_rgba(14,165,233,0.05)] space-y-4">
                          <span className="text-[14px] font-black text-sky-500 block mb-3 underline decoration-sky-100 underline-offset-4">สลับเป็น</span>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 relative">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                              <div className="absolute -top-1 -left-1 text-[10px]">👑</div>
                            </div>
                            <span className="text-[14px] font-bold text-slate-600">กิติมา พาณุเวช (เจ้าของบริษัท)</span>
                          </div>
                          <div className="flex items-center gap-3 ml-1">
                            <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-sky-400"><div className="w-1.5 h-1.5 bg-sky-400 rounded-full" /></div>
                            <span className="text-[14px] font-bold text-sky-400">-</span>
                          </div>
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-300"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                              <span className="text-[14px] font-bold text-sky-400">-</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-sky-400"><div className="w-1.5 h-1.5 bg-sky-400 rounded-full" /></div>
                              <span className="text-[14px] font-bold text-sky-400">-</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="relative group">
                      <textarea 
                        rows={3} 
                        placeholder="รายละเอียดเพิ่มเติม *" 
                        title="รายละเอียดเพิ่มเติม"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all resize-none shadow-sm placeholder:text-slate-300"
                      />
                    </div>

                    {/* Supervisor / Responsible Person */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ผู้รับผิดชอบ</label>
                      <div className="relative group">
                        <div className="relative">
                          <select 
                            title="หัวหน้างาน"
                            className="w-full pl-5 pr-10 py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-[15px] font-medium text-slate-400 outline-none hover:border-slate-200 transition-all appearance-none cursor-pointer"
                          >
                            <option>หัวหน้างาน</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="pt-6 flex items-center justify-end gap-4">
                      <button 
                        type="button"
                        onClick={() => setViewMode("list")}
                        className="px-10 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        ยกเลิก
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3 rounded-xl bg-[#0ea5e9] text-white text-[15px] font-black transition-all active:scale-95 flex items-center gap-2 hover:bg-[#0284c7] shadow-lg shadow-sky-100"
                      >
                        <span className="text-[20px] leading-none font-light">+</span>
                        <span>สร้าง</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Redesigned Shift Change Form (เปลี่ยนกะการทำงาน) */}
                {activeTab === "เปลี่ยนกะการทำงาน" && (
                  <div className="space-y-8 py-2">
                    <h2 className="text-[22px] font-black text-slate-800 mb-6">สร้างคำขอเปลี่ยนกะการทำงาน</h2>
                    
                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันเริ่มกะ *" 
                            title="วันที่เริ่มเปลี่ยนกะ"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันสิ้นสุดกะ *" 
                            title="วันที่สิ้นสุดเปลี่ยนกะ"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Shift Display */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">กะปัจจุบัน</label>
                      <div className="w-full pl-5 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl text-[15px] font-medium text-slate-400 shadow-inner">
                        กะการทำงาน
                      </div>
                    </div>

                    {/* New Shift Selection */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">กะที่ขอเปลี่ยน</label>
                      <div className="relative group">
                        <select 
                          title="กะที่ขอเปลี่ยน" 
                          required
                          className="w-full pl-5 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                          <option>กะการทำงาน *</option>
                          <option>กะเช้า (08:00 - 17:00)</option>
                          <option>กะบ่าย (13:00 - 22:00)</option>
                          <option>กะดึก (22:00 - 07:00)</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="relative group">
                      <textarea 
                        rows={3} 
                        placeholder="รายละเอียดเพิ่มเติม *" 
                        title="รายละเอียดเพิ่มเติม"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all resize-none shadow-sm placeholder:text-slate-300"
                      />
                    </div>

                    {/* Supervisor / Responsible Person */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ผู้รับผิดชอบ</label>
                      <div className="relative group">
                        <div className="relative">
                          <select 
                            title="หัวหน้างาน"
                            className="w-full pl-5 pr-10 py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-[15px] font-medium text-slate-400 outline-none hover:border-slate-200 transition-all appearance-none cursor-pointer"
                          >
                            <option>หัวหน้างาน</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="pt-6 flex items-center justify-end gap-4">
                      <button 
                        type="button"
                        onClick={() => setViewMode("list")}
                        className="px-10 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        ยกเลิก
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3 rounded-xl bg-[#0ea5e9] text-white text-[15px] font-black transition-all active:scale-95 flex items-center gap-2 hover:bg-[#0284c7] shadow-lg shadow-sky-100"
                      >
                        <span className="text-[20px] leading-none font-light">+</span>
                        <span>สร้าง</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Redesigned Holiday Change Form (เปลี่ยนวันหยุด) */}
                {activeTab === "เปลี่ยนวันหยุด" && (
                  <div className="space-y-8 py-2">
                    <h2 className="text-[22px] font-black text-slate-800 mb-6">สร้างคำขอเปลี่ยนวันหยุด</h2>
                    
                    {/* Date Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันที่หยุด *" 
                            title="วันที่หยุด"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="วันที่ทำงาน *" 
                            title="วันที่มาทำงานแทน"
                            className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-400 outline-none focus:border-sky-500 transition-all shadow-sm"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                          />
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="relative group">
                      <textarea 
                        rows={3} 
                        placeholder="รายละเอียดเพิ่มเติม *" 
                        title="รายละเอียดเพิ่มเติม"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-500 transition-all resize-none shadow-sm placeholder:text-slate-300"
                      />
                    </div>

                    {/* Supervisor / Responsible Person */}
                    <div className="space-y-3">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ผู้รับผิดชอบ</label>
                      <div className="relative group">
                        <div className="relative">
                          <select 
                            title="หัวหน้างาน"
                            className="w-full pl-5 pr-10 py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-[15px] font-medium text-slate-400 outline-none hover:border-slate-200 transition-all appearance-none cursor-pointer"
                          >
                            <option>หัวหน้างาน</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-4">
                      <label className="text-[15px] font-black text-slate-800 ml-1">ไฟล์แนบ</label>
                      <div className="w-full p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 hover:border-sky-200 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-all duration-500">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                        </div>
                        <div className="text-center">
                          <p className="text-[16px] font-bold text-slate-500">ลากไฟล์วางที่นี้หรือ<span className="text-slate-800">เลือกไฟล์</span></p>
                        </div>
                      </div>
                      <p className="text-[12px] font-medium text-slate-400 ml-1">ประเภทไฟล์ .jpg .jpeg .png .pdf</p>
                    </div>

                    {/* Buttons Row */}
                    <div className="pt-6 flex items-center justify-end gap-4">
                      <button 
                        type="button"
                        onClick={() => setViewMode("list")}
                        className="px-10 py-3 rounded-xl border border-slate-200 text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        ยกเลิก
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3 rounded-xl bg-[#c0eaff] text-[#0ea5e9] text-[15px] font-black transition-all active:scale-95 flex items-center gap-2 hover:bg-[#b0e0f8]"
                      >
                        <span className="text-[20px] leading-none font-light">+</span>
                        <span>สร้าง</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Default Fields (Attachments) */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-1">หลักฐานเพิ่มเติม (ถ้ามี)</label>
                  <div className="w-full p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 hover:border-[#283583]/30 transition-all group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-[#283583] group-hover:scale-110 transition-all duration-300 shadow-sm">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <div className="text-center">
                      <p className="text-[14px] font-black text-slate-600">คลิกหรือลากไฟล์เพื่ออัปโหลด</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">PNG, JPG, PDF (MAX 5MB)</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-end gap-4 shrink-0">
              <button 
                type="button"
                onClick={() => setViewMode("list")}
                className="px-8 py-3.5 rounded-2xl border border-slate-200 text-[14px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-3.5 rounded-2xl text-[14px] font-black text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 bg-gradient-to-br from-[#283583] to-[#4f46e5] shadow-[0_8px_25px_rgba(40,53,131,0.2)]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>กำลังส่งคำขอ...</span>
                  </>
                ) : (
                  <span>ส่งคำขอ</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
