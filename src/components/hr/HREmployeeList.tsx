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
  shift: string;
  salaryType: string;
  salary: number;
  employmentType: string;
  status: string;
  startDate: string;
  tenure: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    code: "2400001",
    name: "ภัทรินทร์ พงศธรธนเดช (เจ้าของบริษัท)",
    image: "https://i.pravatar.cc/150?u=1",
    email: "pitt.tana@gmail.com",
    role: "Owner",
    department: "ขาย",
    position: "กรรมการผู้จัดการ",
    shift: "(SHIFT001) เวลาเข้างาน 0...",
    salaryType: "รายเดือน",
    salary: 130000.00,
    employmentType: "ประจำ",
    status: "บรรจุ",
    startDate: "12/02/2567",
    tenure: "2 ปี 2 เดือน"
  },
  {
    id: "2",
    code: "2400002",
    name: "เชษฐพงศ์ พลอย",
    image: "https://i.pravatar.cc/150?u=2",
    email: "krisbadinn.hr@hotmail.com",
    role: "Staff",
    department: "การสรรหาและคัดเลือกทรัพยากรบุคคล",
    position: "ผู้จัดการแผนก",
    shift: "(SHIFT001) เวลาเข้างาน 0...",
    salaryType: "รายเดือน",
    salary: 34500.00,
    employmentType: "ประจำ",
    status: "ทดลองงาน",
    startDate: "01/02/2557",
    tenure: "12 ปี 2 เดือน"
  },
  {
    id: "3",
    code: "2400003",
    name: "จิตรินทร์ โสมานนท์",
    image: "https://i.pravatar.cc/150?u=3",
    email: "jittranan.p.hr@gmail.com",
    role: "Staff",
    department: "การส่งเสริมการขาย",
    position: "พนักงานทั่วไป",
    shift: "(SHIFT001) เวลาเข้างาน 0...",
    salaryType: "รายเดือน",
    salary: 45000.00,
    employmentType: "ประจำ",
    status: "ทดลองงาน",
    startDate: "02/11/2554",
    tenure: "14 ปี 5 เดือน"
  },
  {
    id: "4",
    code: "2400004",
    name: "ภัทรินทร์ พงศ์วิชัย",
    image: "https://i.pravatar.cc/150?u=4",
    email: "pattara.p.hr@gmail.com",
    role: "Staff",
    department: "การฝึกอบรมพนักงานใหม่",
    position: "พนักงานทั่วไป",
    shift: "(SHIFT001) เวลาเข้างาน 0...",
    salaryType: "รายเดือน",
    salary: 24500.00,
    employmentType: "ประจำ",
    status: "ทดลองงาน",
    startDate: "01/04/2563",
    tenure: "6 ปี"
  },
  {
    id: "5",
    code: "2400005",
    name: "กิตติพงศ์ พัฒนวณิชกร",
    image: "https://i.pravatar.cc/150?u=5",
    email: "kittipong.p.hr@gmail.com",
    role: "Staff",
    department: "ขาย",
    position: "พนักงานทั่วไป",
    shift: "(SHIFT001) เวลาเข้างาน 0...",
    salaryType: "รายเดือน",
    salary: 61000.00,
    employmentType: "ประจำ",
    status: "ทดลองงาน",
    startDate: "01/01/2556",
    tenure: "13 ปี 3 เดือน"
  }
];

export default function HREmployeeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.includes(searchQuery) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "บรรจุ":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "ทดลองงาน":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 animate-in fade-in duration-500">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative group flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="ค้นหาพนักงาน, แผนก, ตำแหน่ง..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              title="มุมมองรายการ"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-100 text-indigo-600 shadow-inner" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              title="มุมมองตาราง"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-100 text-indigo-600 shadow-inner" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>ตัวกรอง</span>
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[14px] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>เพิ่มพนักงาน</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="pl-6 py-4 text-center w-12 border-b border-slate-100">
                  <svg className="w-4 h-4 mx-auto text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">รหัส</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">ชื่อ - นามสกุล</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">อีเมล</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">บทบาท</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">แผนก</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">ตำแหน่ง</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">กะการทำงาน</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">เงินเดือน</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">ประเภท</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">สถานะ</th>
                <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider text-right border-b border-slate-100 whitespace-nowrap">เริ่มงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                  <td className="pl-6 py-4 text-center">
                    <button title="เพิ่มในรายการโปรด" className="text-slate-200 hover:text-amber-400 transition-colors">
                      <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{emp.code}</span>
                  </td>
                  <td className="px-4 py-4 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={emp.image} alt="" className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white shadow-sm transition-transform group-hover:scale-105" />
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">{emp.name}</span>
                        <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter truncate max-w-[150px]">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-bold text-slate-600 truncate max-w-[120px] block">{emp.email}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                      emp.role === 'Owner' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 min-w-[150px]">
                    <span className="text-[13px] font-bold text-slate-500 truncate block max-w-[180px]">{emp.department}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-[13px] font-bold text-slate-600">{emp.position}</span>
                  </td>
                  <td className="px-4 py-4 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[12px] font-bold text-slate-500 truncate max-w-[150px]">{emp.shift}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-black text-slate-700">฿{emp.salary.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{emp.salaryType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-bold text-slate-600">{emp.employmentType}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${getStatusBadge(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-bold text-slate-700">{emp.startDate}</span>
                      <span className="text-[11px] font-bold text-slate-400 mt-0.5 tracking-tight">({emp.tenure})</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-slate-400">แสดงรายการ</span>
            <select title="จำนวนรายการต่อหน้า" className="bg-white border border-slate-200 rounded-xl text-[13px] font-bold px-3 py-1.5 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all">
              <option>50</option>
              <option>100</option>
              <option>200</option>
            </select>
            <span className="text-[13px] font-bold text-slate-400">จากทั้งหมด {mockEmployees.length} คน</span>
          </div>

          <div className="flex items-center gap-2">
            <button title="หน้าก่อนหน้า" className="p-2 text-slate-300 hover:text-indigo-600 transition-colors disabled:opacity-30" disabled>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 rounded-xl bg-indigo-600 text-white text-[14px] font-black shadow-lg shadow-indigo-100">1</button>
              <button className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm text-slate-400 text-[14px] font-black transition-all">2</button>
              <button className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm text-slate-400 text-[14px] font-black transition-all">3</button>
            </div>
            <button title="หน้าถัดไป" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
