"use client";

import { useState, useMemo } from "react";

interface EmployeeAttendance {
  id: string;
  code: string;
  name: string;
  role: string;
  status: "ตรงเวลา" | "มาสาย" | "ขาดงาน" | "ลาหยุด" | "ออกนอกสถานที่" | "วันหยุด" | "กลับก่อน";
  score: number;
  location: string;
  checkIn: string;
  checkOut: string;
  image: string;
  totalHours: string;
  lateTime: string;
  date: string;
  isFavorite: boolean;
}

const mockAttendance: EmployeeAttendance[] = [];

export default function HRDashboard() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("วันนี้");
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    "การแสดงผล": "ทั้งหมด",
    "สถานที่ทำงาน": "ออฟฟิศ",
    "ประเภทสถานที่": "สำนักงานใหญ่",
    "แผนก": "ฝ่ายขาย",
    "ใต้บังคับบัญชา (S)": "ทีมของฉัน"
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(["การแสดงผล", "สถานที่ทำงาน", "ประเภทสถานที่", "แผนก", "ใต้บังคับบัญชา (S)"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const statFilters = [
    { label: "ทั้งหมด", count: 0, icon: "users", color: "from-blue-600 to-indigo-600", iconColor: "text-blue-500", shadow: "shadow-blue-500/30" },
    { label: "ตรงเวลา", count: 0, icon: "check", color: "from-emerald-500 to-teal-500", iconColor: "text-emerald-500", shadow: "shadow-emerald-500/30" },
    { label: "มาสาย", count: 0, icon: "clock", color: "from-amber-500 to-orange-500", iconColor: "text-amber-500", shadow: "shadow-amber-500/30" },
    { label: "ลาหยุด", count: 0, icon: "calendar", color: "from-rose-500 to-pink-500", iconColor: "text-rose-500", shadow: "shadow-rose-500/30" },
    { label: "ออกนอกสถานที่", count: 0, icon: "map-pin", color: "from-purple-500 to-indigo-500", iconColor: "text-purple-500", shadow: "shadow-purple-500/30" },
    { label: "วันหยุด", count: 0, icon: "archive", color: "from-slate-500 to-slate-700", iconColor: "text-slate-500", shadow: "shadow-slate-500/30" },
    { label: "กลับก่อน", count: 0, icon: "sun", color: "from-sky-500 to-blue-500", iconColor: "text-sky-500", shadow: "shadow-sky-500/30" },
  ];

  const attendanceSummary = [
    { label: "มาทำงาน", count: 0, total: 0, color: "bg-emerald-500", icon: "check" },
    { label: "ขาดงาน", count: 0, total: 0, color: "bg-rose-500", icon: "x" },
    { label: "ลาหยุด", count: 0, total: 0, color: "bg-orange-500", icon: "calendar" },
    { label: "เปลี่ยนเวลาทำงาน", count: 0, total: 0, color: "bg-purple-500", icon: "refresh" },
    { label: "ออกนอกสถานที่", count: 0, total: 0, color: "bg-emerald-500", icon: "home" },
    { label: "แบบประเมินเข้างาน", count: 0, total: 0, color: "bg-amber-500", icon: "user" },
    { label: "โอที", count: 0, total: 0, color: "bg-blue-500", icon: "zap" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ตรงเวลา": return "text-emerald-700 bg-emerald-50 ring-1 ring-inset ring-emerald-600/20";
      case "มาสาย": return "text-amber-700 bg-amber-50 ring-1 ring-inset ring-amber-600/20";
      case "ขาดงาน": return "text-rose-700 bg-rose-50 ring-1 ring-inset ring-rose-600/20";
      case "ลาหยุด": return "text-orange-700 bg-orange-50 ring-1 ring-inset ring-orange-600/20";
      default: return "text-slate-700 bg-slate-50 ring-1 ring-inset ring-slate-600/20";
    }
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-hidden font-sans relative">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/40 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Section */}
      <div className="bg-white px-8 py-5 border-b border-slate-200/60 flex flex-col gap-5 sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {/* Row 1: Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="relative group w-64">
            <div className="flex items-center bg-white border border-slate-300 rounded-xl px-4 py-2 hover:border-blue-400 transition-all cursor-pointer shadow-sm">
              <span className="text-slate-600 text-[15px] font-medium flex-1">ค้นหา</span>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 hover:border-blue-400 transition-all shadow-sm active:scale-95">
              <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              สร้าง QR Code
            </button>
            <button 
              onClick={() => setIsFilterOpen(prev => !prev)}
              title="ตัวกรองเพิ่มเติม"
              className="w-11 h-11 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Filters and Date Range */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => {
                setIsFilterMenuOpen(!isFilterMenuOpen);
                setIsTimeMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-6 py-2.5 bg-white border rounded-xl text-[15px] font-bold transition-all shadow-sm group ${isFilterMenuOpen ? "border-blue-500 text-blue-600 ring-2 ring-blue-50" : "border-slate-200 text-slate-700 hover:border-blue-400"}`}
            >
              <svg className={`w-5 h-5 transition-colors ${isFilterMenuOpen ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4.5h18m-18 5h18m-18 5h18m-18 5h18" />
              </svg>
              กรอง
              <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${isFilterMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFilterMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {["การแสดงผล", "สถานที่ทำงาน", "ประเภทสถานที่", "แผนก", "ใต้บังคับบัญชา (S)"].map((item) => (
                  <button 
                    key={item}
                    className="w-full text-left px-5 py-3 text-[15px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between group"
                    onClick={() => setIsFilterMenuOpen(false)}
                  >
                    {item === "ใต้บังคับบัญชา (S)" ? (
                      <>
                        ใต้บังคับบัญชา <span className="text-slate-400 font-medium ml-1">(S)</span>
                      </>
                    ) : item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className={`absolute -top-2.5 left-4 px-1.5 bg-white text-[11px] font-bold uppercase tracking-wider z-10 transition-colors ${isTimeMenuOpen ? "text-blue-500" : "text-slate-600"}`}>ช่วงเวลา</div>
            <div 
              onClick={() => {
                setIsTimeMenuOpen(!isTimeMenuOpen);
                setIsFilterMenuOpen(false);
              }}
              className={`flex items-center gap-6 px-5 py-2.5 bg-white border rounded-xl text-[15px] font-bold transition-all cursor-pointer min-w-[160px] shadow-sm ${isTimeMenuOpen ? "border-blue-500 ring-2 ring-blue-50 text-blue-600" : "border-slate-200 text-slate-700 hover:border-blue-400"}`}
            >
              <span className="flex-1">{selectedTimeRange}</span>
              <svg className={`w-4 h-4 transition-all duration-300 ${isTimeMenuOpen ? "text-blue-500 rotate-180" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isTimeMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {["วันนี้", "สัปดาห์นี้", "เดือนนี้", "เดือนก่อนหน้านี้"].map((time) => (
                  <button 
                    key={time}
                    className={`w-full text-left px-5 py-3 text-[15px] font-bold transition-colors ${time === selectedTimeRange ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"}`}
                    onClick={() => {
                      setSelectedTimeRange(time);
                      setIsTimeMenuOpen(false);
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1 max-w-[500px] hover:border-blue-300 transition-all">
            <button title="วันก่อนหน้า" className="p-2.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 text-center py-2.5 text-[15px] font-bold text-slate-700 border-x border-slate-100">
              06/05/2026 - 06/05/2026
            </div>
            <button title="วันถัดไป" className="p-2.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pb-12">
        {/* Stats Section */}
        <div className="px-8 py-10 flex flex-col items-center">
          <div className="mb-10 text-center flex flex-col items-center">
            <h2 className="text-[32px] font-black text-slate-800 tracking-tight">แดชบอร์ดฝ่ายบุคคล <span className="text-blue-600">.</span></h2>
            <p className="text-slate-500 text-[15px] font-medium mt-2">สรุปภาพรวมการเข้างานของทีมงานทั้งหมดในวันนี้</p>
          </div>
          
          <div className="flex gap-8 max-w-full overflow-x-auto pt-6 pb-16 px-10 custom-scrollbar-hide justify-center">
            {statFilters.map((stat, i) => {
              const isActive = selectedStatus === stat.label;
              return (
                <div key={i} className="relative flex-shrink-0">
                  {isActive && (
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] h-16 blur-[32px] rounded-full opacity-40 z-0 bg-gradient-to-t ${stat.color.replace('from-', 'to-')} to-transparent`} />
                  )}

                  <button
                    onClick={() => setSelectedStatus(stat.label)}
                    className={`relative overflow-hidden rounded-[30px] bg-gradient-to-b ${stat.color} p-4 flex flex-col items-center justify-center gap-3 text-white transition-all duration-500 hover:-translate-y-2 group w-[140px] h-[160px] border-2 z-10 ${
                      isActive 
                        ? "border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] scale-[1.08]" 
                        : "border-white/10 shadow-lg hover:shadow-xl opacity-90 hover:opacity-100"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/5 pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 mb-1">
                      {stat.icon === "users" && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                      {stat.icon === "check" && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {stat.icon === "clock" && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {stat.icon === "calendar" && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                      {stat.icon === "map-pin" && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                      {stat.icon === "archive" && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
                      {stat.icon === "sun" && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 9a3 3 0 100 6 3 3 0 000-6z" /></svg>}
                    </div>
                    <span className="relative z-10 text-[15px] font-bold text-white leading-tight text-center tracking-tight">{stat.label}</span>
                    <div className="relative z-10 bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg">
                      <span className="text-[15px] font-black text-slate-900 leading-none">{stat.count} <span className="text-[11px] font-bold text-slate-600 uppercase ml-0.5">คน</span></span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-8 bg-white px-8 py-4 rounded-[30px] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)] whitespace-nowrap mx-auto">
             <span className="flex items-center gap-3 text-[14px] font-bold text-slate-500 tracking-wide">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-300" /> ยังไม่มาทำงาน <span className="text-slate-800 font-black ml-1">0 คน</span>
             </span>
             <div className="w-px h-5 bg-slate-200/80" />
             <span className="flex items-center gap-3 text-[14px] font-bold text-rose-500 tracking-wide">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse" /> ขาดงาน <span className="text-rose-600 font-black ml-1">0 คน</span>
             </span>
             <button title="ตัวเลือกเพิ่มเติม" aria-label="ตัวเลือกเพิ่มเติม" className="ml-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
             </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 flex overflow-hidden px-8 pb-8 gap-8">
          {/* Table Column - Enhanced Shadow and Border */}
          <div className="flex-1 bg-white rounded-[32px] shadow-[0_12px_45px_rgba(0,0,0,0.08)] border border-slate-200/60 flex flex-col overflow-hidden relative ring-1 ring-slate-200/10">
            <div className="overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50/90 backdrop-blur-md border-b border-slate-200/60">
                    <th className="pl-6 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider w-12 text-center whitespace-nowrap"><svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg></th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">รหัส</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">เข้างาน</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider text-center whitespace-nowrap">คะแนน</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">สถานที่ปฏิบัติงาน</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">เวลาเข้า-ออกงาน</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">รูปภาพยืนยันตัวตน</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">ชั่วโมงการทำงาน</th>
                    <th className="px-4 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">โอที</th>
                    <th className="px-6 py-5 text-[12px] font-black text-slate-600 uppercase tracking-wider text-right whitespace-nowrap">วันที่</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {mockAttendance.length > 0 ? (
                    mockAttendance.map((item) => (
                      <tr key={item.id} className="group hover:bg-blue-50/40 transition-colors cursor-pointer relative">
                        <td className="relative pl-6 py-4 text-center">
                           <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <button title="เพิ่มในรายการโปรด" className={`text-slate-300 hover:text-amber-400 transition-colors ${item.isFavorite ? 'text-amber-400' : ''}`}><svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg></button>
                        </td>
                        <td className="px-4 py-4">
                           <span className="text-[14px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">{item.code}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white" />
                            <div className="whitespace-nowrap">
                              <p className="text-[15px] font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</p>
                              <p className="text-[12px] font-medium text-slate-500 mt-0.5">{item.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                           <span className={`text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm ${getStatusStyle(item.status)}`}>
                             {item.status === "ตรงเวลา" ? `ตรงเวลา ${item.totalHours}` : item.status}
                           </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                           <div className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-[13px] font-bold ${item.score > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                             {item.score > 0 ? "+" : ""}{item.score.toFixed(2)}
                           </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             </div>
                             <span className="text-[14px] font-bold text-slate-600">{item.location}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                           <span className="text-[14px] font-bold text-slate-600 whitespace-nowrap bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{item.checkIn} - {item.checkOut}</span>
                        </td>
                        <td className="px-4 py-4">
                           <div className="flex gap-4 px-2">
                             <span className="text-slate-300 text-sm font-black">-</span>
                             <span className="text-slate-300 text-sm font-black">-</span>
                             <span className="text-slate-300 text-sm font-black">-</span>
                             <span className="text-slate-300 text-sm font-black">-</span>
                           </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                           <span className="text-slate-400 text-[13px] font-bold">-</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                           <span className="text-slate-400 text-[13px] font-bold">-</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-[13px] font-bold text-slate-500 whitespace-nowrap">ล. {item.date}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
                          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <p className="text-[18px] font-black text-slate-600 tracking-tight">รอข้อมูลรายชื่อพนักงานจากระบบ</p>
                          <p className="text-[14px] font-bold text-slate-500 mt-1.5">ขณะนี้ยังไม่มีข้อมูลการเข้างานที่แสดงผล</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-slate-600">แสดงผล:</span>
                <select title="จำนวนรายการต่อหน้า" className="bg-white border border-slate-200 rounded-xl text-[13px] font-bold px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer">
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button aria-label="หน้าก่อนหน้า" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-[13px] font-black shadow-md shadow-blue-500/30">1</button>
                <button aria-label="หน้าถัดไป" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="w-[360px] flex flex-col gap-6 shrink-0">
            {/* Attendance Summary Card */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_12px_45px_rgba(0,0,0,0.08)] border border-slate-200/60 relative overflow-hidden ring-1 ring-slate-200/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex flex-col">
                   <h3 className="text-[17px] font-black text-slate-800 leading-none">สรุปการเข้างาน</h3>
                   <span className="text-[13px] font-bold text-blue-500 mt-2">28/04/2026</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl text-[12px] font-black text-blue-600">
                    วันนี้ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <button title="เพิ่มเติม" className="text-slate-300 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-colors border border-transparent hover:border-slate-100 shadow-sm"><svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2 s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg></button>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {attendanceSummary.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer p-2.5 -mx-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        {item.icon === "check" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                        {item.icon === "x" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                        {item.icon === "calendar" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        {item.icon === "refresh" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                        {item.icon === "home" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" /></svg>}
                        {item.icon === "user" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        {item.icon === "zap" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                      </div>
                      <span className="text-[15px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[15px] font-black whitespace-nowrap bg-white px-3 py-1 rounded-xl shadow-sm border border-slate-100 ${item.count > 0 ? (item.label === 'ขาดงาน' ? 'text-rose-500' : 'text-emerald-500') : 'text-slate-300'}`}>{item.count} คน</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Ranking Card - Enhanced */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_12px_45px_rgba(0,0,0,0.08)] border border-slate-200/60 flex-1 flex flex-col min-h-0 relative overflow-hidden ring-1 ring-slate-200/10">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
               <div className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-[17px] font-black text-slate-800 leading-none">จัดอันดับสูงสุด</h3>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[12px] font-black text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                       5 คน <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                     </div>
                     <button title="คัดลอกข้อมูล" className="text-slate-300 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-colors shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
                  </div>
               </div>

               <div className="flex border-b border-slate-100 mb-8 shrink-0 relative px-2">
                  <button className="flex-1 py-3 text-[14px] font-black text-blue-600 relative">
                    สาย
                    <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                  </button>
                  <button className="flex-1 py-3 text-[14px] font-bold text-slate-400 hover:text-slate-600 transition-colors">ลาหยุด</button>
                  <button className="flex-1 py-3 text-[14px] font-bold text-slate-400 hover:text-slate-600 transition-colors">ขาดงาน</button>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center text-center pb-12">
                  <div className="relative mb-6 group">
                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center overflow-hidden shadow-inner ring-4 ring-white group-hover:scale-110 transition-transform duration-700">
                      <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="" className="w-full h-full object-contain opacity-20 grayscale group-hover:opacity-40 group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                  </div>
                  <p className="text-[16px] font-black text-slate-300 tracking-tight">ไม่มีข้อมูลการมาสาย</p>
                  <p className="text-[14px] font-medium text-slate-300/80 mt-1.5">ยอดเยี่ยมมาก ทีมงานมาตรงเวลาทุกคน</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md transition-all duration-300 ${
          isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Sliding Filter Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] bg-white z-[101] shadow-[-15px_0_60px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isFilterOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"
        }`}
      >
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[24px] font-black text-slate-800 tracking-tight">ตัวกรองข้อมูล</h3>
            <button 
              onClick={() => setIsFilterOpen(false)} 
              title="ปิด"
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-10">
            {/* Date Range Selector */}
            <div className="space-y-5">
              <span className="text-[16px] font-black text-slate-800">ช่วงวันที่</span>
              <div className="flex flex-col items-center justify-center p-10 bg-[#F8FAFC] border border-slate-200 rounded-[32px] relative group hover:border-blue-400 transition-all shadow-inner">
                <button title="ย้อนกลับ" className="absolute left-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-2xl bg-white shadow-md text-slate-400 hover:text-blue-600 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-[20px] font-black text-blue-600 tracking-tight leading-none">28/04/2026</span>
                  <span className="text-[14px] font-bold text-slate-400">ถึง</span>
                  <span className="text-[20px] font-black text-blue-600 tracking-tight leading-none">28/04/2026</span>
                </div>
                <button title="ไปข้างหน้า" className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-2xl bg-white shadow-md text-slate-400 hover:text-blue-600 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Filter Sections */}
            {[
              { label: "การแสดงผล", options: ["ทั้งหมด", "เฉพาะวันนี้", "รายสัปดาห์"] },
              { label: "สถานที่ทำงาน", options: ["ออฟฟิศ", "บ้าน", "อื่นๆ"] },
              { label: "ประเภทสถานที่", options: ["สำนักงานใหญ่", "สาขา"] },
              { label: "แผนก", options: ["ฝ่ายขาย", "ฝ่ายผลิต", "ฝ่ายบัญชี", "กัปตันเรือ"] },
              { label: "ใต้บังคับบัญชา (S)", options: ["ทีมของฉัน", "ทั้งหมด"] },
            ].map((section, idx) => {
              const isExpanded = expandedSections.includes(section.label);
              return (
              <div key={idx} className="flex flex-col border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                <div className="flex items-center justify-between cursor-pointer group py-2" onClick={() => toggleSection(section.label)}>
                  <span className="text-[16px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">{section.label}</span>
                  <svg className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all duration-300 ${isExpanded ? "rotate-0" : "-rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[400px] opacity-100 mt-4 gap-3" : "max-h-0 opacity-0 mt-0 gap-0"}`}>
                  {section.options.map((opt) => (
                    <label key={opt} className={`flex items-center gap-4 cursor-pointer group p-4 rounded-2xl transition-all ${opt === activeFilters[section.label] ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}`}>
                      <input 
                        type="radio" 
                        name={section.label} 
                        value={opt} 
                        checked={opt === activeFilters[section.label]}
                        onChange={() => setActiveFilters(prev => ({...prev, [section.label]: opt}))}
                        className="hidden" 
                      />
                      <div className={`w-6 h-6 rounded-full border-[3px] transition-all flex items-center justify-center ${opt === activeFilters[section.label] ? "border-blue-600 bg-white" : "border-slate-300 bg-white group-hover:border-blue-400"}`}>
                        {opt === activeFilters[section.label] && (
                          <div className="w-3 h-3 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <span className={`text-[16px] font-bold transition-colors ${opt === activeFilters[section.label] ? "text-blue-700" : "text-slate-600"}`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )})}
          </div>
          
          <div className="pt-10 mt-auto grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveFilters({"การแสดงผล": "ทั้งหมด", "สถานที่ทำงาน": "ออฟฟิศ", "ประเภทสถานที่": "สำนักงานใหญ่", "แผนก": "ฝ่ายขาย", "ใต้บังคับบัญชา (S)": "ทีมของฉัน"})}
              className="py-4 bg-slate-50 text-slate-600 rounded-2xl text-[16px] font-black hover:bg-slate-100 transition-all border border-slate-200"
            >
              ล้างตัวกรอง
            </button>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="py-4 bg-blue-600 text-white rounded-2xl text-[16px] font-black hover:bg-blue-700 hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all shadow-lg shadow-blue-500/20"
            >
              ใช้ตัวกรอง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
