"use client";

import { useState } from "react";

interface AttendanceRecord {
  id: string;
  name: string;
  nickname: string;
  position: string;
  shift: string;
  department: string;
  avatar: string;
  hasOT: boolean;
  hasWarning: boolean;
  days: {
    [day: number]: {
      status: "present" | "leave" | "holiday" | "late" | "ot";
      timeIn?: string;
      timeOut?: string;
    };
  };
}

export default function HRReport() {
  const [activeTab, setActiveTab] = useState("เวลาทำงาน");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("เดือนนี้");

  const totalDays = 30;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const getDayName = (day: number) => {
    const names = ["อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา.", "จ."];
    return names[day % 7];
  };

  const getRecordForDay = (emp: AttendanceRecord, day: number) => {
    if (emp.days && emp.days[day]) return emp.days[day];

    const dayName = getDayName(day);
    if (dayName === "ส." || dayName === "อา.") {
      return { status: "holiday" as const };
    }

    const seed = parseInt(emp.id) + day;
    if (seed % 15 === 0) {
      return { status: "leave" as const, timeIn: "08:33", timeOut: "17:01" };
    }
    if (seed % 8 === 0) {
      return { status: "ot" as const, timeIn: "08:16", timeOut: "17:33" };
    }
    if (seed % 5 === 0) {
      return { status: "late" as const, timeIn: "07:53", timeOut: "17:11" };
    }
    return { status: "present" as const, timeIn: "07:50", timeOut: "17:00" };
  };

  const tabs = [
    "เวลาทำงาน",
    "วันลา",
    "จ่ายเงินเดือน",
    "ค่าใช้จ่าย",
    "เบิกเงินเดือน",
    "หนังสือเตือน",
    "ข้อมูลพนักงาน",
    "เปลี่ยนวันหยุด",
  ];

  const employees: AttendanceRecord[] = [
    {
      id: "2400001",
      name: "ทิติมา พาณุเวช",
      nickname: "ทิติมา",
      position: "เจ้าของบริษัท",
      shift: "SHIFT101",
      department: "ฝ่ายขาย",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "ot", timeIn: "08:33", timeOut: "17:01" },
        2: { status: "present", timeIn: "07:49", timeOut: "17:01" },
        3: { status: "present", timeIn: "07:59", timeOut: "17:02" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "ot", timeIn: "08:33", timeOut: "17:02" },
        7: { status: "present", timeIn: "07:42", timeOut: "17:01" },
        8: { status: "present", timeIn: "07:50", timeOut: "16:59" },
      },
    },
    {
      id: "2400002",
      name: "เจษฎากร พลดี",
      nickname: "ติ๊บ",
      position: "แผนก การสรรหาและคัดเลือกทรัพยากร...",
      shift: "SHIFT101",
      department: "การสรรหาและคัดเลือกทรัพยากร...",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "late", timeIn: "07:50", timeOut: "17:05" },
        2: { status: "late", timeIn: "07:51", timeOut: "17:11" },
        3: { status: "late", timeIn: "07:42", timeOut: "16:55" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "ot", timeIn: "08:16", timeOut: "17:05" },
        7: { status: "late", timeIn: "07:59", timeOut: "17:01" },
        8: { status: "late", timeIn: "07:51", timeOut: "17:17" },
      },
    },
    {
      id: "2400003",
      name: "จิตนันท์ โปตานนท์",
      nickname: "จิ๊บ",
      position: "แผนก การส่งเสริมการขาย",
      shift: "SHIFT101",
      department: "การส่งเสริมการขาย",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "late", timeIn: "07:50", timeOut: "17:01" },
        2: { status: "late", timeIn: "08:05", timeOut: "17:02" },
        3: { status: "late", timeIn: "08:05", timeOut: "16:55" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "ot", timeIn: "08:16", timeOut: "17:17" },
        7: { status: "late", timeIn: "07:53", timeOut: "17:11" },
        8: { status: "late", timeIn: "07:59", timeOut: "17:09" },
      },
    },
    {
      id: "2400004",
      name: "ภัทรานันท์ พงศ์วณิช",
      nickname: "ซานิ",
      position: "แผนก การพัฒนาผลิตภัณฑ์ใหม่",
      shift: "SHIFT101",
      department: "การพัฒนาผลิตภัณฑ์ใหม่",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "late", timeIn: "07:50", timeOut: "17:08" },
        2: { status: "ot", timeIn: "08:16", timeOut: "17:33" },
        3: { status: "late", timeIn: "07:50", timeOut: "17:01" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "late", timeIn: "07:49", timeOut: "17:01" },
        7: { status: "late", timeIn: "07:51", timeOut: "17:03" },
        8: { status: "late", timeIn: "08:05", timeOut: "17:09" },
      },
    },
    {
      id: "2400005",
      name: "กิตติพงศ์ พัฒนวิจิตร",
      nickname: "กิต",
      position: "ฝ่ายขาย",
      shift: "SHIFT101",
      department: "ฝ่ายขาย",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "late", timeIn: "07:53", timeOut: "17:17" },
        2: { status: "late", timeIn: "07:53", timeOut: "17:11" },
        3: { status: "late", timeIn: "07:42", timeOut: "17:16" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "late", timeIn: "08:05", timeOut: "17:09" },
        7: { status: "late", timeIn: "07:50", timeOut: "17:08" },
        8: { status: "late", timeIn: "07:59", timeOut: "17:08" },
      },
    },
    {
      id: "2400006",
      name: "นฤมล พรจิต",
      nickname: "น้ำใส",
      position: "แผนก การสรรหาและคัดเลือกทรัพยากร...",
      shift: "SHIFT101",
      department: "การสรรหาและคัดเลือกทรัพยากร...",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "present", timeIn: "07:50", timeOut: "16:59" },
        2: { status: "present", timeIn: "07:42", timeOut: "17:01" },
        3: { status: "present", timeIn: "07:59", timeOut: "16:59" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "present", timeIn: "07:42", timeOut: "17:11" },
        7: { status: "present", timeIn: "07:55", timeOut: "17:01" },
        8: { status: "present", timeIn: "07:49", timeOut: "17:17" },
      },
    },
    {
      id: "2400007",
      name: "ศิวะกร อำไพรพงษ์",
      nickname: "กร",
      position: "หัวหน้างาน แผนก การส่งเสริมการขาย",
      shift: "SHIFT101",
      department: "การส่งเสริมการขาย",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "ot", timeIn: "08:16", timeOut: "17:33" },
        2: { status: "late", timeIn: "07:50", timeOut: "17:16" },
        3: { status: "late", timeIn: "07:51", timeOut: "17:11" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "ot", timeIn: "08:16", timeOut: "17:03" },
        7: { status: "late", timeIn: "07:50", timeOut: "17:33" },
        8: { status: "late", timeIn: "07:51", timeOut: "17:25" },
      },
    },
    {
      id: "2400008",
      name: "อิทธิพงศ์ พงศ์วณิช",
      nickname: "ปอน",
      position: "แผนก การสรรหาและคัดเลือกทรัพยากร...",
      shift: "SHIFT101",
      department: "การสรรหาและคัดเลือกทรัพยากร...",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "late", timeIn: "07:53", timeOut: "17:11" },
        2: { status: "late", timeIn: "07:53", timeOut: "17:11" },
        3: { status: "late", timeIn: "07:50", timeOut: "17:25" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "leave", timeIn: "08:33", timeOut: "17:01" },
        7: { status: "late", timeIn: "07:51", timeOut: "17:16" },
        8: { status: "late", timeIn: "07:50", timeOut: "17:03" },
      },
    },
    {
      id: "2400009",
      name: "นันธิดา นาร่อง",
      nickname: "พลอย",
      position: "แผนก การส่งเสริมการขาย",
      shift: "SHIFT101",
      department: "การส่งเสริมการขาย",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      hasOT: true,
      hasWarning: true,
      days: {
        1: { status: "late", timeIn: "07:49", timeOut: "17:03" },
        2: { status: "late", timeIn: "07:49", timeOut: "17:08" },
        3: { status: "late", timeIn: "07:50", timeOut: "16:59" },
        4: { status: "holiday" },
        5: { status: "holiday" },
        6: { status: "ot", timeIn: "08:16", timeOut: "17:16" },
        7: { status: "late", timeIn: "08:05", timeOut: "17:03" },
        8: { status: "late", timeIn: "07:55", timeOut: "17:01" },
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F1F5F9] h-full overflow-hidden font-sans">
      {/* Top Tabs Navigation */}
      <div className="bg-white border-b border-slate-200/60 px-8 pt-4 flex items-center gap-1 overflow-x-auto scrollbar-none z-10 flex-shrink-0">
        {tabs.map((tab) => (
          <button title="ปุ่ม"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-4 text-[14px] font-bold transition-all whitespace-nowrap ${
              activeTab === tab ? "text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>{tab}</span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0EA5E9] rounded-t-full shadow-[0_-2px_8px_rgba(14,165,233,0.3)]" />
            )}
          </button>
        ))}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col gap-6">
        {/* Sub-help text */}
        <p className="text-[13px] text-slate-400 font-medium">
          แสดงข้อมูลวันทำงาน เช่น ตรงเวลา สาย ลาหยุด ขาดงาน พร้อมแสดงจำนวนรวมชั่วโมงการทำงาน
        </p>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <input title="กรอกข้อมูล"
                type="text"
                placeholder="รหัสพนักงาน, ชื่อ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] font-bold text-slate-600 placeholder-slate-400 focus:border-indigo-400 outline-none shadow-inner transition-all"
              />
              <svg className="w-4.5 h-4.5 absolute right-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Info / Dropdown Toggle */}
            <button title="ปุ่ม" className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center gap-1 text-slate-600 font-bold text-[13px]">
              <span>ℹ️</span>
              <span>▼</span>
            </button>

            {/* Filter Button */}
            <button title="ปุ่ม" className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-[13.5px] font-bold text-slate-600">
              📊 กรอง <span>▼</span>
            </button>

            {/* Range Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">ช่วงเวลา</span>
              <select title="เลือกข้อมูล"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none py-1.5 text-[13px] font-bold text-slate-600 outline-none cursor-pointer"
              >
                <option value="เดือนนี้">เดือนนี้</option>
                <option value="เดือนที่แล้ว">เดือนที่แล้ว</option>
                <option value="ปีนี้">ปีนี้</option>
              </select>
            </div>

            {/* Date Range Display */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[13.5px] font-bold text-slate-600">
              <button title="ปุ่ม" className="hover:text-indigo-600 transition-colors">❮</button>
              <span>01/04/2026 - 30/04/2026</span>
              <button title="ปุ่ม" className="hover:text-indigo-600 transition-colors">❯</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button title="ปุ่ม" className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-[13.5px] font-bold text-slate-600 shadow-sm">
              📥 ดาวน์โหลด <span>▼</span>
            </button>
            <button title="ปุ่ม" className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 shadow-sm">
              ⚙️
            </button>
          </div>
        </div>

        {/* Row count */}
        <div className="text-[14px] font-bold text-slate-600">
          พนักงาน {employees.length} คน
        </div>

        {/* Main Attendance Table */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/30 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[12px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-4 text-center w-[60px] sticky left-0 z-40 bg-[#F8FAFC] border-r border-slate-100">«</th>
                  <th className="px-5 py-4 w-[100px] sticky left-[60px] z-40 bg-[#F8FAFC] border-r border-slate-100">รหัส</th>
                  <th className="px-5 py-4 w-[320px] sticky left-[160px] z-40 bg-[#F8FAFC] border-r border-slate-100 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.05)]">พนักงาน</th>
                  {daysArray.map((day) => {
                    return (
                      <th key={day} className="px-2 py-4 text-center min-w-[110px] border-l border-slate-50">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-slate-700 text-[13px]">{day}</span>
                          <span className="text-slate-400 text-[11px] font-medium">{getDayName(day)}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-slate-50/30 transition-all duration-150 text-[13px]">
                    <td className="px-5 py-4 text-center sticky left-0 z-30 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-100">
                      <span className="text-slate-300 hover:text-slate-400 cursor-pointer">★</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-500 sticky left-[60px] z-30 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-100">{emp.id}</td>
                    <td className="px-5 py-4 sticky left-[160px] z-30 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-100 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover shadow-inner border border-slate-100" />
                          {emp.nickname === "ทิติมา" && (
                            <span className="absolute -top-1 -left-1 text-xs animate-bounce">👑</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-800 truncate">({emp.nickname}) {emp.name}</span>
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 mt-0.5 tracking-wide">
                            {emp.shift} {emp.position}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                          {emp.hasOT && <span className="px-1.5 py-0.5 bg-sky-50 text-sky-500 text-[9px] font-black rounded">OT</span>}
                          {emp.hasWarning && <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-500 text-[10px] font-black flex items-center justify-center border border-rose-100">!</span>}
                        </div>
                      </div>
                    </td>
  
                    {daysArray.map((day) => {
                      const record = getRecordForDay(emp, day);
                      if (!record) return <td key={day} className="px-2 py-4 border-l border-slate-50"></td>;
  
                      if (record.status === "holiday") {
                        return (
                          <td key={day} className="px-2 py-4 text-center bg-slate-50/50 border-l border-slate-50">
                            <span className="text-slate-400 font-black text-[14px]">H</span>
                          </td>
                        );
                      }
  
                      let statusIcon = "✔️";
                      let iconBg = "bg-sky-50 text-sky-500 border-sky-100";
                      
                      if (record.status === "ot") {
                        statusIcon = "🏃‍♂️";
                        iconBg = "bg-amber-50 text-amber-500 border-amber-100";
                      } else if (record.status === "leave") {
                        statusIcon = "🏃‍♀️";
                        iconBg = "bg-rose-50 text-rose-500 border-rose-100";
                      } else if (record.status === "present") {
                        statusIcon = "🏠";
                        iconBg = "bg-emerald-50 text-emerald-500 border-emerald-100";
                      }
  
                      return (
                        <td key={day} className="px-2 py-4 text-center border-l border-slate-50 group">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${iconBg} text-[12px] font-bold shadow-sm`}>
                              {statusIcon}
                            </div>
                            {record.timeIn && record.timeOut && (
                              <span className="text-[10px] font-bold text-slate-400">
                                {record.timeIn} - {record.timeOut}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
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
