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

const mockAttendance: EmployeeAttendance[] = [
  {
    id: "1",
    code: "2400001",
    name: "ภัทรินทร์ พงศธรธนเดช (เจ้าของบริษัท)",
    role: "กรรมการผู้จัดการ (CEO)",
    status: "ตรงเวลา",
    score: 1.0,
    location: "บ้าน",
    checkIn: "08:04",
    checkOut: "--:--",
    image: "https://i.pravatar.cc/150?u=1",
    totalHours: "4 ชั่วโมง",
    lateTime: "-",
    date: "28/04/2569",
    isFavorite: true,
  },
  {
    id: "2",
    code: "2400002",
    name: "เชษฐพงศ์ พลอย",
    role: "ฝ่ายขาย",
    status: "ขาดงาน",
    score: -1.0,
    location: "-",
    checkIn: "--:--",
    checkOut: "--:--",
    image: "https://i.pravatar.cc/150?u=2",
    totalHours: "-",
    lateTime: "-",
    date: "28/04/2569",
    isFavorite: false,
  },
  {
    id: "3",
    code: "2400003",
    name: "จิตรินทร์ โสมานนท์",
    role: "ฝ่ายผลิต",
    status: "ขาดงาน",
    score: -1.0,
    location: "-",
    checkIn: "--:--",
    checkOut: "--:--",
    image: "https://i.pravatar.cc/150?u=3",
    totalHours: "-",
    lateTime: "-",
    date: "28/04/2569",
    isFavorite: false,
  },
  {
    id: "4",
    code: "2400004",
    name: "นราภรณ์ พงศ์วิชัย",
    role: "ฝ่ายบัญชี",
    status: "ขาดงาน",
    score: -1.0,
    location: "-",
    checkIn: "--:--",
    checkOut: "--:--",
    image: "https://i.pravatar.cc/150?u=4",
    totalHours: "-",
    lateTime: "-",
    date: "28/04/2569",
    isFavorite: false,
  },
  {
    id: "5",
    code: "2400005",
    name: "กิตติพงศ์ พัฒนวณิชกร",
    role: "กัปตันเรือ",
    status: "ขาดงาน",
    score: -1.0,
    location: "-",
    checkIn: "--:--",
    checkOut: "--:--",
    image: "https://i.pravatar.cc/150?u=5",
    totalHours: "-",
    lateTime: "-",
    date: "28/04/2569",
    isFavorite: false,
  },
  {
    id: "6",
    code: "2400006",
    name: "นฤมล พรชัย",
    role: "ฝ่ายบริการ",
    status: "ขาดงาน",
    score: -1.0,
    location: "-",
    checkIn: "--:--",
    checkOut: "--:--",
    image: "https://i.pravatar.cc/150?u=6",
    totalHours: "-",
    lateTime: "-",
    date: "28/04/2569",
    isFavorite: false,
  },
  {
    id: "7",
    code: "2400007",
    name: "ศิวะพร อําไพรพงษ์ (หัวหน้างาน)",
    role: "ฝ่ายปฏิบัติการ",
    status: "ขาดงาน",
    score: -1.0,
    location: "-",
    checkIn: "--:--",
    checkOut: "--:--",
    image: "https://i.pravatar.cc/150?u=7",
    totalHours: "-",
    lateTime: "-",
    date: "28/04/2569",
    isFavorite: false,
  },
];

export default function HRDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statFilters = [
    { label: "ทั้งหมด", count: 9, icon: "users", color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200" },
    { label: "ตรงเวลา", count: 1, icon: "check", color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200" },
    { label: "มาสาย", count: 0, icon: "clock", color: "from-amber-400 to-orange-500", shadow: "shadow-amber-200" },
    { label: "ลาหยุด", count: 0, icon: "calendar", color: "from-rose-400 to-pink-500", shadow: "shadow-rose-200" },
    { label: "ออกนอกสถานที่", count: 0, icon: "map-pin", color: "from-purple-500 to-indigo-600", shadow: "shadow-purple-200" },
    { label: "วันหยุด", count: 0, icon: "archive", color: "from-slate-400 to-slate-600", shadow: "shadow-slate-200" },
    { label: "กลับก่อน", count: 0, icon: "sun", color: "from-sky-400 to-blue-500", shadow: "shadow-sky-200" },
  ];

  const attendanceSummary = [
    { label: "มาทำงาน", count: 1, total: 9, color: "bg-emerald-500", icon: "check" },
    { label: "ขาดงาน", count: 8, total: 9, color: "bg-rose-500", icon: "x" },
    { label: "ลาหยุด", count: 0, total: 9, color: "bg-orange-500", icon: "calendar" },
    { label: "เปลี่ยนเวลาทำงาน", count: 0, total: 9, color: "bg-purple-500", icon: "refresh" },
    { label: "ออกนอกสถานที่", count: 1, total: 9, color: "bg-emerald-500", icon: "home" },
    { label: "แบบประเมินเข้างาน", count: 1, total: 9, color: "bg-amber-500", icon: "user" },
    { label: "โอที", count: 0, total: 9, color: "bg-blue-500", icon: "zap" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ตรงเวลา": return "text-emerald-600 bg-emerald-50 border border-emerald-100/50";
      case "มาสาย": return "text-amber-600 bg-amber-50 border border-amber-100/50";
      case "ขาดงาน": return "text-rose-600 bg-rose-50 border border-rose-100/50";
      case "ลาหยุด": return "text-orange-600 bg-orange-50 border border-orange-100/50";
      default: return "text-slate-500 bg-slate-50 border border-slate-100/50";
    }
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200/60 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="ค้นหาพนักงาน, แผนก, สถานะ..." 
              className="w-80 pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-[15px] font-medium focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            title="ตัวกรอง"
            onClick={() => setIsFilterOpen(true)}
            className="w-11 h-11 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 transition-all shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Horizontal Stats Section */}
        <div className="px-8 py-10 flex flex-col items-center">
          <div className="mb-8 text-center flex flex-col items-center">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">พนักงานทั้งหมด <span className="text-blue-600">.</span></h2>
            <p className="text-slate-400 text-[15px] font-medium mt-1">สรุปภาพรวมการเข้างานของทีมงานทั้งหมดในวันนี้</p>
          </div>
          
          <div className="flex gap-8 max-w-full overflow-x-auto pt-6 pb-6 custom-scrollbar-hide -mt-6">
            {statFilters.map((stat, i) => (
              <button
                key={i}
                onClick={() => setSelectedStatus(stat.label)}
                className={`flex flex-col items-center gap-4 group relative transition-all duration-500 ${
                  selectedStatus === stat.label ? "scale-105" : "hover:scale-102"
                }`}
              >
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 relative overflow-hidden ${
                  selectedStatus === stat.label 
                  ? `bg-gradient-to-br ${stat.color} text-white shadow-2xl ${stat.shadow} -translate-y-1` 
                  : "bg-white text-slate-400 border border-slate-100 hover:border-blue-200 hover:text-blue-500 shadow-[0_10px_25px_rgba(0,0,0,0.03)]"
                }`}>
                  {stat.icon === "users" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  {stat.icon === "check" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                  {stat.icon === "clock" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {stat.icon === "calendar" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  {stat.icon === "map-pin" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  {stat.icon === "archive" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
                  {stat.icon === "sun" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" /></svg>}
                  
                  {/* Glossy overlay */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
                </div>
                <div className="flex flex-col items-center gap-1.5 whitespace-nowrap">
                  <span className={`text-[14px] font-black uppercase tracking-widest ${selectedStatus === stat.label ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>{stat.label}</span>
                  <div className={`px-4 py-1 rounded-full shadow-sm transition-all duration-500 ${
                    selectedStatus === stat.label ? "bg-blue-600 text-white scale-110 shadow-blue-200" : "bg-white text-slate-500 border border-slate-100"
                  }`}>
                    <span className="text-[15px] font-black">{stat.count} <span className="text-[11px] font-bold opacity-70">คน</span></span>
                  </div>
                </div>
                
                {/* Selected Indicator Dot */}
                {selectedStatus === stat.label && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-8 bg-white/50 backdrop-blur-sm px-6 py-2.5 rounded-2xl border border-white shadow-sm whitespace-nowrap">
             <span className="flex items-center gap-2 text-[13px] font-black text-slate-400 uppercase tracking-wider">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-inner" /> ยังไม่มาทำงาน <span className="text-slate-800 ml-1">8 คน</span>
             </span>
             <div className="w-px h-4 bg-slate-200" />
             <span className="flex items-center gap-2 text-[13px] font-black text-rose-500 uppercase tracking-wider">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse" /> ขาดงาน <span className="text-rose-600 ml-1">8 คน</span>
             </span>
             <button title="ตัวเลือกเพิ่มเติม" aria-label="ตัวเลือกเพิ่มเติม" className="ml-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
             </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 flex overflow-hidden px-8 pb-8 gap-6">
          {/* Table Column */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                  <tr>
                    <th className="pl-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider w-12 text-center whitespace-nowrap"><svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">รหัส <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z" /></svg></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">ชื่อ-นามสกุล <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z" /></svg></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">เข้างาน <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z" /></svg></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider text-center whitespace-nowrap">คะแนน <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z" /></svg></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">สถานที่ปฏิบัติงาน <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z" /></svg></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">เวลาเข้า-ออกงาน <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z" /></svg></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">รูปภาพยืนยันตัวตน <div className="flex gap-4 mt-0.5"><span className="text-[11px] font-normal lowercase">เข้างาน</span> <span className="text-[11px] font-normal lowercase">พักเบรก</span> <span className="text-[11px] font-normal lowercase">ออกพักเบรก</span> <span className="text-[11px] font-normal lowercase">ออกงาน</span></div></th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">ชั่วโมงการทำงาน</th>
                    <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">โอที</th>
                    <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider text-right whitespace-nowrap">วันที่</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockAttendance.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="pl-6 py-4 text-center">
                         <button title="เพิ่มในรายการโปรด" aria-label="เพิ่มในรายการโปรด" className={`text-slate-200 hover:text-amber-400 transition-colors ${item.isFavorite ? 'text-amber-400' : ''}`}><svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg></button>
                      </td>
                      <td className="px-4 py-4">
                         <span className="text-[14px] font-bold text-slate-400">{item.code}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                          <div className="whitespace-nowrap">
                            <p className="text-[15px] font-bold text-slate-700 leading-tight">{item.name}</p>
                            <p className="text-[12px] font-bold text-slate-400 mt-0.5">{item.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                         <span className={`text-[12px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider whitespace-nowrap ${getStatusStyle(item.status)}`}>
                           {item.status === "ตรงเวลา" ? `ตรงเวลา ${item.totalHours}` : item.status}
                         </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                         <span className={`text-[14px] font-black ${item.score > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                           {item.score > 0 ? "+" : ""}{item.score.toFixed(2)}
                         </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          {item.location !== "-" ? (
                            <>
                              <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              </div>
                              <span className="text-[14px] font-bold text-emerald-500 whitespace-nowrap">{item.location}</span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-300">
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              </div>
                              <span className="text-[14px] font-bold text-slate-300">-</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                         <span className="text-[14px] font-black text-slate-400 whitespace-nowrap">{item.checkIn} - {item.checkOut}</span>
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex gap-4">
                           <span className="text-slate-200 text-sm font-black">-</span>
                           <span className="text-slate-200 text-sm font-black">-</span>
                           <span className="text-slate-200 text-sm font-black">-</span>
                           <span className="text-slate-200 text-sm font-black">-</span>
                         </div>
                      </td>
                      <td className="px-4 py-4">
                         <span className="text-slate-200 text-[12px] font-black">-</span>
                      </td>
                      <td className="px-4 py-4">
                         <span className="text-slate-200 text-[12px] font-black">-</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className="text-[13px] font-bold text-slate-400">ล. {item.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select title="จำนวนรายการต่อหน้า" className="bg-white border border-slate-200 rounded-lg text-[12px] font-bold px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>50</option>
                  <option>100</option>
                </select>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              
              <div className="flex items-center gap-2">
                <button aria-label="หน้าก่อนหน้า" className="p-2 text-slate-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                <button className="w-8 h-8 rounded-full bg-blue-500 text-white text-[14px] font-black shadow-md shadow-blue-200">1</button>
                <button aria-label="หน้าถัดไป" className="p-2 text-slate-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="w-[320px] flex flex-col gap-6 shrink-0">
            {/* Attendance Summary Card */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                   <h3 className="text-[15px] font-black text-slate-800 leading-none">สรุปการเข้างาน</h3>
                   <span className="text-[12px] font-bold text-slate-400 mt-1">28/04/2026</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg text-[12px] font-bold text-slate-600">
                    วันนี้ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <button title="เพิ่มเติม" aria-label="เพิ่มเติม" className="text-slate-400"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2 s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg></button>
                </div>
              </div>

              <div className="space-y-4">
                {attendanceSummary.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`}>
                        {item.icon === "check" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                        {item.icon === "x" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                        {item.icon === "calendar" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        {item.icon === "refresh" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                        {item.icon === "home" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" /></svg>}
                        {item.icon === "user" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        {item.icon === "zap" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                      </div>
                      <span className="text-[14px] font-bold text-slate-600">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                         <div className="flex -space-x-2 mr-1">
                           <img className="w-5 h-5 rounded-full border border-white" src="https://i.pravatar.cc/100?u=a" alt="" />
                           <img className="w-5 h-5 rounded-full border border-white" src="https://i.pravatar.cc/100?u=b" alt="" />
                           <img className="w-5 h-5 rounded-full border border-white" src="https://i.pravatar.cc/100?u=c" alt="" />
                         </div>
                      )}
                      {i === 5 && (
                         <div className="flex -space-x-2 mr-1">
                           <img className="w-5 h-5 rounded-full border border-white" src="https://i.pravatar.cc/100?u=d" alt="" />
                         </div>
                      )}
                      <span className={`text-[14px] font-black whitespace-nowrap ${item.count > 0 ? (item.label === 'ขาดงาน' ? 'text-rose-500' : 'text-emerald-500') : 'text-slate-300'}`}>{item.count} คน</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Ranking Card */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-0">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[15px] font-black text-slate-800 leading-none">จัดอันดับสูงสุด</h3>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg text-[12px] font-bold text-slate-600">
                       5 คน <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                     </div>
                     <button title="พิมพ์รายงาน" aria-label="พิมพ์รายงาน" className="text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
                  </div>
               </div>

               <div className="flex border-b border-slate-100 mb-6 shrink-0">
                  <button className="flex-1 py-2 text-[13px] font-black text-blue-500 border-b-2 border-blue-500">สาย</button>
                  <button className="flex-1 py-2 text-[13px] font-black text-slate-400 hover:text-slate-600">ลาหยุด</button>
                  <button className="flex-1 py-2 text-[13px] font-black text-slate-400 hover:text-slate-600">ขาดงาน</button>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center text-center pb-10">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center overflow-hidden">
                      <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="" className="w-full h-full object-contain opacity-50 grayscale" />
                    </div>
                  </div>
                  <p className="text-[15px] font-black text-slate-300">ไม่มีข้อมูล</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer Overlay */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Sliding Filter Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[340px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out transform ${isFilterOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[20px] font-black text-slate-800 tracking-tight">ตัวกรอง</h3>
            <button className="text-[14px] font-bold text-blue-400 hover:text-blue-600 transition-colors">ล้างทั้งหมด</button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-12">
            {/* Date Range Selector */}
            <div className="space-y-5">
              <span className="text-[15px] font-black text-slate-700">วันที่</span>
              <div className="flex flex-col items-center justify-center p-8 bg-[#F8FAFC] border border-slate-50 rounded-[40px] relative group transition-all">
                <button title="วันก่อนหน้า" className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[16px] font-black text-slate-600 tracking-tight leading-tight">28/04/2026 -</span>
                  <span className="text-[16px] font-black text-slate-600 tracking-tight leading-tight">28/04/2026</span>
                </div>
                <button title="วันถัดไป" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>

              </div>
            </div>

            {/* Filter Sections */}
            {[
              { label: "การแสดงผล", options: ["ทั้งหมด", "เฉพาะวันนี้", "รายสัปดาห์"], selected: "ทั้งหมด" },
              { label: "สถานที่ทำงาน", options: ["ออฟฟิศ", "บ้าน", "อื่นๆ"], selected: "ออฟฟิศ" },
              { label: "ประเภทสถานที่", options: ["สำนักงานใหญ่", "สาขา"], selected: "สำนักงานใหญ่" },
              { label: "แผนก", options: ["ฝ่ายขาย", "ฝ่ายผลิต", "ฝ่ายบัญชี", "กัปตันเรือ"], selected: "ฝ่ายขาย" },
              { label: "ใต้บังคับบัญชา (S)", options: ["ทีมของฉัน", "ทั้งหมด"], selected: "ทีมของฉัน" },
            ].map((section, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[15px] font-black text-slate-700 group-hover:text-blue-500 transition-colors">{section.label}</span>
                  <svg className={`w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all ${idx === 0 ? "rotate-0" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Options List */}
                <div className="flex flex-col gap-5 pl-1">
                  {section.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-5 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${opt === section.selected ? "border-blue-500" : "border-slate-200 bg-white group-hover:border-blue-300"}`}>
                        {opt === section.selected ? (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        ) : null}
                      </div>
                      <span className={`text-[15px] font-bold transition-colors ${opt === section.selected ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[28px] text-[16px] font-black hover:bg-slate-800 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200"
          >
            ใช้ตัวกรอง
          </button>
        </div>
      </div>
    </div>
  );
}
