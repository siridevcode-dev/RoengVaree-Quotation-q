"use client";

import { useState, useMemo } from "react";

interface DayShift {
  day: number;
  weekday: string;
  label: string;
  type: "work" | "holiday" | "off";
  badge?: string;
  isToday?: boolean;
}

interface EmployeeSchedule {
  id: string;
  code: string;
  name: string;
  department: string;
  image: string;
  totalDays: string;
  shifts: DayShift[];
}

export default function HRWorkSchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<"filter" | "time" | "shift" | null>(null);
  
  // Current date state for demo (May 2026 as per screenshot)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // 0-indexed, so 4 is May

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getWeekdayName = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString("th-TH", { weekday: "long" }).replace("วัน", "");
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Mock data generation based on month
  const mockSchedule: EmployeeSchedule[] = useMemo(() => [
    {
      id: "1",
      code: "2500001",
      name: "PP PP",
      department: "ฝ่าย บุคคล",
      image: "https://i.pravatar.cc/150?u=1",
      totalDays: `19/${daysInMonth}`,
      shifts: Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const weekday = getWeekdayName(currentYear, currentMonth, day);
        
        let label = "SHIFT101";
        let type: "work" | "holiday" | "off" = "work";
        let badge = "";

        // Sample logic for May 2026 (matching screenshot)
        if (day === 1) { label = "วันแรงงาน..."; type = "holiday"; badge = "H"; }
        else if (day === 2) { label = "SHIFT101"; type = "off"; badge = "OFF"; }
        else if (day === 3) { label = "SHIFT101"; type = "off"; badge = "OFF"; }
        else if (day === 4) { label = "วันฉัตรมงคล"; type = "holiday"; badge = "H"; }
        else if (day === 16) { label = "SHIFT101"; type = "off"; badge = "OFF"; }
        else if (day === 17) { label = "SHIFT101"; type = "off"; badge = "OFF"; }
        else if (day >= 5 && day <= 15) { type = "work"; }
        else if (day >= 18 && day <= 21) { type = "work"; }
        
        return { day, weekday, label, type, badge, isToday: day === 6 && currentMonth === 4 };
      }),
    },
  ], [daysInMonth, currentYear, currentMonth]);

  const toggleDropdown = (type: "filter" | "time" | "shift") => {
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
              placeholder="ค้นหาพนักงาน" 
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-[14px] focus:ring-2 focus:ring-[#0095FF]/20 transition-all outline-none"
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

        <div className="flex items-center gap-2">
          <button title="วิธีใช้งาน" className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

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
               <svg className={`w-3 h-3 text-slate-400 transition-transform ${activeDropdown === "filter" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
            </button>
            {activeDropdown === "filter" && (
              <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                {["ตำแหน่ง", "แผนก", "ใต้บังคับบัญชา (S)"].map((item) => (
                  <div key={item} className="px-5 py-2.5 hover:bg-slate-50 cursor-pointer text-[14px] font-bold text-slate-700 transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Range Dropdown */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown("time")}
              className="relative px-4 py-2 bg-white border-2 border-[#0095FF] rounded-xl cursor-pointer flex items-center justify-between min-w-[140px]"
            >
               <span className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-bold text-[#0095FF]">ช่วงเวลา</span>
               <span className="text-[14px] font-bold text-slate-800">เดือนนี้</span>
               <svg className={`w-3 h-3 text-slate-400 ml-2 transition-transform ${activeDropdown === "time" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15l-4-4h8l-4 4z" />
               </svg>
            </div>
            {activeDropdown === "time" && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-1 z-50 animate-in zoom-in-95 duration-200">
                <div className="px-5 py-2.5 bg-[#F0F7FF] text-[#0095FF] text-[14px] font-bold">เดือนนี้</div>
                <div className="px-5 py-2.5 hover:bg-slate-50 text-slate-700 text-[14px] font-bold cursor-pointer">เดือนก่อนหน้านี้</div>
              </div>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-lg">
             <button title="ก่อนหน้า" className="text-slate-300 hover:text-slate-600 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
               </svg>
             </button>
             <span className="text-[13px] font-bold text-slate-600 whitespace-nowrap">01/05/2026 – 31/05/2026</span>
             <button title="ถัดไป" className="text-slate-300 hover:text-slate-600 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
               </svg>
             </button>
          </div>

          {/* Set Shift Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("shift")}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0095FF] text-white rounded-lg text-[14px] font-bold hover:bg-[#0084E6] transition-all shadow-md shadow-blue-100"
            >
              <span>กำหนดกะ</span>
            </button>
            {activeDropdown === "shift" && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                <div className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-[14px] font-bold text-slate-700 transition-colors">เลือกกะที่ต้องการกำหนด</div>
                <div className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-[14px] font-bold text-slate-700 transition-colors">ปิดวันหยุด</div>
              </div>
            )}
          </div>

          <button title="ตั้งค่า" className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m12 4a2 2 0 100-4m0 4a2 2 0 110-4m-6 8v-2m-6 0v-2m12 0v-2" />
            </svg>
          </button>

          <button title="เมนู" className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
             </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold text-slate-400">1 คน</span>
      </div>

      {/* Scheduler Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#EDF2F7]">
                <th className="px-4 py-2 text-center w-10 border-b border-slate-200">
                   <div className="flex items-center justify-center">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                   </div>
                </th>
                <th className="px-4 py-2 text-[12px] font-bold text-slate-500 border-b border-slate-200 border-r border-slate-100 min-w-[80px]">รหัส</th>
                <th className="px-4 py-2 text-[12px] font-bold text-slate-500 border-b border-slate-200 border-r border-slate-100 min-w-[200px]">พนักงาน</th>
                {daysArray.map((day, i) => (
                  <th key={day} className={`px-1 py-1 text-center border-b border-slate-200 border-r border-slate-100 min-w-[80px] ${day === 6 ? 'bg-[#E6F4FF]' : ''}`}>
                    <div className="flex flex-col items-center">
                      <span className={`text-[12px] font-bold ${day === 6 ? 'text-[#0095FF]' : 'text-slate-600'}`}>{day}</span>
                      <span className="text-[10px] font-medium text-slate-400">{getWeekdayName(currentYear, currentMonth, day)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockSchedule.map((emp) => (
                <tr key={emp.id} className="group hover:bg-slate-50 transition-all border-b border-slate-100">
                  <td className="px-4 py-3 text-center border-r border-slate-100">
                    {/* Placeholder */}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-slate-100">
                    <span className="text-[13px] font-bold text-slate-400">{emp.code}</span>
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={emp.image} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
                        <div className="absolute -top-1 -left-1 text-amber-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-700">{emp.name}</span>
                        <span className="text-[11px] font-medium text-slate-400">{emp.department}</span>
                      </div>
                      <span className="ml-auto text-[11px] font-bold text-slate-400">{emp.totalDays}</span>
                    </div>
                  </td>
                  {emp.shifts.map((shift, i) => (
                    <td key={i} className={`p-1 border-r border-slate-100 text-center ${shift.isToday ? 'bg-[#E6F4FF]' : ''}`}>
                      <div className={`relative flex flex-col items-center justify-center h-12 rounded-md transition-all ${
                        shift.type === 'work' ? 'bg-[#0095FF] text-white' : 
                        shift.type === 'holiday' ? 'bg-[#F8FAFC] text-slate-400' :
                        'bg-[#F8FAFC] text-slate-400'
                      }`}>
                        {shift.badge && (
                          <span className="absolute top-0.5 right-1 text-[8px] font-bold opacity-60">{shift.badge}</span>
                        )}
                        <span className="text-[10px] font-bold leading-tight">{shift.label}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination/Controls */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
}
