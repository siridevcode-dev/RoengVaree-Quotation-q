"use client";

import { useState, useMemo } from "react";

interface Employee {
  id: string;
  code: string;
  name: string;
  image: string;
  email: string;
  role: string;
  department: string;
  position: string;
  branch: string;
  salaryType: string;
  salary: number;
  employmentType: string;
  status: string;
  startDate: string;
  tenure: string;
  shift?: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    code: "2500001",
    name: "PP PP",
    image: "https://i.ibb.co/L8p5n7M/bear-cup.png", // Placeholder matching the screenshot
    email: "bb.ss.siri@gmail.com",
    role: "Owner",
    department: "บุคคล",
    branch: "สำนักงานใหญ่",
    position: "กรรมการผู้จัดการ",
    shift: "(SHIFT101) เวลาทำงาน 0...",
    salaryType: "รายเดือน",
    salary: 45000.00,
    employmentType: "ประจำ",
    status: "บรรจุ",
    startDate: "06/05/2569",
    tenure: "2 ปี 2 เดือน"
  }
];

interface HREmployeeListProps {
  onAddIndividual?: () => void;
}

export default function HREmployeeList({ onAddIndividual }: HREmployeeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showSalary, setShowSalary] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"display" | "filter" | "add" | null>(null);

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.includes(searchQuery) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleDropdown = (type: "display" | "filter" | "add") => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 animate-in fade-in duration-500 relative" onClick={() => setActiveDropdown(null)}>
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative group flex-1 max-w-[240px]">
          <div className="relative">
            <input 
              type="text" 
              placeholder="ค้นหา" 
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-[#0095FF]/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button 
              title="มุมมองรายการ"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-[#E6F4FF] text-[#0095FF]" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              title="มุมมองตาราง"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-[#E6F4FF] text-[#0095FF]" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          {/* Display Options Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("display")}
              className={`p-2 bg-white border rounded-lg text-slate-500 hover:bg-slate-50 flex items-center gap-2 px-3 transition-all ${activeDropdown === "display" ? "border-[#0095FF] ring-2 ring-[#0095FF]/10" : "border-slate-200"}`}
            >
               <svg className="w-5 h-5 text-[#0095FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2m0 10V7" />
               </svg>
               <span className="text-[13px] font-bold">การแสดงผล</span>
               <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === "display" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
            </button>

            {activeDropdown === "display" && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                {[
                  "ทั้งหมด", "รหัส", "ชื่อ - นามสกุล", "อีเมล", "แผนก", "แผนก", "สาขา", "ตำแหน่ง", 
                  "กะการทำงาน", "ประเภทการจ่ายเงิน", "จำนวนเงินเดือน", "ประเภทการจ้าง", "สถานะ", "วันที่เริ่มทำงาน"
                ].map((item, idx) => (
                  <div key={item} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${idx === 0 ? "bg-[#0095FF] border-[#0095FF]" : "border-slate-300 group-hover:border-[#0095FF]"}`}>
                      {idx === 0 && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[14px] font-bold ${idx === 0 ? "text-[#0095FF]" : "text-slate-600"}`}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("filter")}
              className={`p-2 bg-white border rounded-lg text-slate-500 hover:bg-slate-50 flex items-center gap-2 px-3 transition-all ${activeDropdown === "filter" ? "border-[#0095FF] ring-2 ring-[#0095FF]/10" : "border-slate-200"}`}
            >
               <svg className="w-5 h-5 text-[#0095FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
               </svg>
               <span className="text-[13px] font-bold">กรอง</span>
               <span className="bg-[#0095FF] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
               <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === "filter" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
            </button>

            {activeDropdown === "filter" && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                {[
                  { name: "ตำแหน่ง" },
                  { name: "กะการทำงาน" },
                  { name: "ประเภทการจ้าง" },
                  { name: "สถานะการจ้าง", badge: 1, active: true },
                  { name: "อายุงาน" },
                  { name: "แผนก" },
                  { name: "ประเภทการจ่ายเงิน" },
                  { name: "ใต้บังคับบัญชา (S)" }
                ].map((item) => (
                  <div key={item.name} className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all ${item.active ? "bg-[#F0F7FF]" : "hover:bg-slate-50"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[14px] font-bold ${item.active ? "text-slate-800" : "text-slate-600"}`}>{item.name}</span>
                      {item.badge && (
                        <span className="bg-[#0095FF] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{item.badge}</span>
                      )}
                    </div>
                    {item.active && (
                      <svg className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Employee Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("add")}
              className="flex items-center gap-2 px-4 py-2 bg-[#0095FF] text-white rounded-lg text-[14px] font-bold hover:bg-[#0084E6] transition-all shadow-md shadow-blue-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>เพิ่มพนักงาน</span>
              <svg className={`w-3 h-3 ml-1 transition-transform duration-200 ${activeDropdown === "add" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeDropdown === "add" && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                {[
                  { name: "เพิ่มรายบุคคล", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /> },
                  { name: "นำเข้าผ่าน Excel", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
                  { name: "อัปเดตข้อมูลพนักงานผ่าน Excel", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> },
                  { name: "ดาวน์โหลดพนักงาน (.xlsx)", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
                  { name: "ดาวน์โหลดพนักงาน (.csv)", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> },
                  { name: "ซิงค์ไปยัง POSPOS", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /> }
                ].map((item) => (
                  <div 
                    key={item.name} 
                    onClick={() => {
                      if (item.name === "เพิ่มรายบุคคล") {
                        onAddIndividual?.();
                      }
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#E6F4FF] group-hover:text-[#0095FF] transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <span className="text-[14px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button title="ตั้งค่า" className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m12 4a2 2 0 100-4m0 4a2 2 0 110-4m-6 8v-2m-6 0v-2m12 0v-2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-slate-400">พนักงาน {filteredEmployees.length} / {mockEmployees.length} คน</span>
        <button 
          onClick={() => setShowSalary(!showSalary)}
          className="flex items-center gap-1 text-[13px] font-bold text-slate-400 hover:text-[#0095FF] transition-colors"
        >
          <svg className="w-5 h-5 text-[#0095FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSalary ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
          </svg>
          <span className="mt-0.5">แสดงจำนวนเงิน</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {viewMode === "list" ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#EDF2F7]">
                    <th className="px-4 py-3 text-center w-10 border-b border-slate-200">
                       <div className="flex items-center justify-center">
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                       </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>รหัส</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>ชื่อ - นามสกุล</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>อีเมล</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>แผนก</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>แผนก</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>สาขา</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>ตำแหน่ง</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>กะการทำงาน</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>ประเภทการจ่ายเงิน</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>จำนวนเงินเดือน</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>ประเภทการจ้าง</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>สถานะ</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[12px] font-bold text-slate-500 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <span>วันที่เริ่มทำงาน</span>
                        <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="group hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-100 last:border-0">
                      <td className="px-4 py-4 text-center">
                        <button title="เพิ่มในรายการโปรด" className="text-slate-300 hover:text-amber-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-400">{emp.code}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={emp.image} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                            {emp.role === "Owner" && (
                              <div className="absolute -top-1.5 -left-1.5 bg-amber-400 rounded-full p-0.5 shadow-sm border border-white">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="text-[13px] font-bold text-slate-700">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-slate-500">{emp.email}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-600">{emp.role}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-600">{emp.department}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-600">{emp.branch}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-600">{emp.position}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-600">{emp.shift}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-600">{emp.salaryType}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-slate-500">
                          {showSalary ? emp.salary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "xxx.xx"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-slate-600">{emp.employmentType}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[13px] font-bold text-slate-600">{emp.status}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-slate-500">{emp.startDate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in slide-in-from-bottom-2 duration-500">
            {filteredEmployees.map((emp) => (
              <div key={emp.id} className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex flex-col items-center relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Top Right Icons */}
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                   <button title="โปรด" className="text-slate-300 hover:text-amber-400 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                   </button>
                   <button title="ข้อมูล" className="text-slate-300 hover:text-[#0095FF] transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </button>
                </div>

                {/* Avatar */}
                <div className="mb-4">
                  <img src="https://i.ibb.co/L8p5n7M/bear-cup.png" alt="" className="w-32 h-32 rounded-[24px] object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Info */}
                <div className="text-center space-y-1 mb-6">
                  <h4 className="text-[18px] font-bold text-slate-800 tracking-tight">{emp.name}</h4>
                  <p className="text-[14px] font-bold text-slate-400">{emp.department}</p>
                </div>

                {/* Status Badge */}
                <div className="px-5 py-1.5 bg-[#E7F9EF] text-[#28C76F] rounded-full text-[14px] font-bold border border-emerald-50">
                  {emp.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination (Only in List View) */}
      {viewMode === "list" && (
        <div className="mt-4 px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-slate-400">แสดง :</span>
            <select title="จำนวนรายการต่อหน้า" className="bg-white border border-slate-200 rounded-lg text-[13px] font-bold px-2 py-1 outline-none">
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1">
                <button title="หน้าก่อนหน้า" className="p-1 text-slate-300 hover:text-[#0095FF] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
             </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-full bg-[#0095FF] text-white text-[13px] font-bold">1</button>
            </div>
            <div className="flex items-center gap-1">
                <button title="หน้าถัดไป" className="p-1 text-slate-300 hover:text-[#0095FF] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
