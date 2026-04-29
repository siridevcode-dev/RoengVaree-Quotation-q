"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";

interface WarningLetter {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeImage: string;
  date: string;
  type: "ตักเตือนด้วยวาจา" | "ตักเตือนเป็นลายลักษณ์อักษร" | "ภาคทัณฑ์" | "พักงาน";
  description: string;
  witness?: string;
  status: "รอดำเนินการ" | "อนุมัติแล้ว" | "ยกเลิก";
  attachments?: string[];
}

const mockWarnings: WarningLetter[] = [
  {
    id: "W001",
    employeeId: "E2",
    employeeName: "เชษฐพงศ์ พลอย",
    employeeImage: "https://i.pravatar.cc/150?u=2",
    date: "20/04/2569",
    type: "ตักเตือนด้วยวาจา",
    description: "มาทำงานสายเกินเวลาที่กำหนด 3 ครั้งในสัปดาห์เดียว",
    status: "อนุมัติแล้ว",
  },
  {
    id: "W002",
    employeeId: "E3",
    employeeName: "จิตรินทร์ โสมานนท์",
    employeeImage: "https://i.pravatar.cc/150?u=3",
    date: "25/04/2569",
    type: "ตักเตือนเป็นลายลักษณ์อักษร",
    description: "ไม่ปฏิบัติตามกฎความปลอดภัยในพื้นที่โรงงาน",
    status: "รอดำเนินการ",
  },
];

export default function HRWarningLetter() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [warnings, setWarnings] = useState<WarningLetter[]>(mockWarnings);

  const filteredWarnings = useMemo(() => {
    return warnings.filter(w => 
      w.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [warnings, searchQuery]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "อนุมัติแล้ว": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "รอดำเนินการ": return "bg-amber-50 text-amber-600 border-amber-100";
      case "ยกเลิก": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "พักงาน": return "text-rose-600";
      case "ภาคทัณฑ์": return "text-orange-600";
      case "ตักเตือนเป็นลายลักษณ์อักษร": return "text-amber-600";
      default: return "text-blue-600";
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">หนังสือเตือนพนักงาน</h2>
          <div className="px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
            <span className="text-[13px] font-black text-rose-500">{warnings.length} รายการ</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-64">
            <input 
              type="text" 
              placeholder="ค้นหาชื่อพนักงาน, ประเภท..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button title="ตัวกรอง" className="w-11 h-11 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 transition-all shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </button>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[14px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>สร้างหนังสือเตือน</span>
          </button>
        </div>
      </div>

      {/* Warnings Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="pl-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">วันที่</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">พนักงาน</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ประเภทหนังสือเตือน</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">รายละเอียด</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">สถานะ</th>
                <th className="pr-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredWarnings.map((warn) => (
                <tr key={warn.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td className="pl-8 py-5">
                    <span className="text-[14px] font-bold text-slate-600">{warn.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img src={warn.employeeImage} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">{warn.employeeName}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">ID: {warn.employeeId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[13px] font-black ${getTypeStyle(warn.type)}`}>{warn.type}</span>
                  </td>
                  <td className="px-6 py-5 max-w-[300px]">
                    <span className="text-[13px] font-bold text-slate-500 line-clamp-1">{warn.description}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${getStatusStyle(warn.status)}`}>
                      {warn.status}
                    </span>
                  </td>
                  <td className="pr-8 py-5 text-right">
                    <button title="ดูรายละเอียด" className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Warning Modal */}
      {isFormOpen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[36px] flex flex-col max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] animate-in zoom-in-95 duration-300 border border-slate-100 relative">
            
            {/* Premium Top Gradient Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 flex-shrink-0" />

            {/* Sticky Header */}
            <div className="flex items-center justify-between p-7 border-b border-slate-100/80 flex-shrink-0 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center text-violet-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-[20px] font-black text-slate-800 tracking-tight">สร้างหนังสือเตือนพนักงาน</h3>
              </div>
              <button 
                title="ปิด" 
                onClick={() => setIsFormOpen(false)} 
                className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:text-slate-600 hover:bg-slate-100 hover:rotate-90 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar p-7 space-y-6 bg-slate-50/30">
              
              {/* Employee & Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                    <span>เลือกพนักงานที่กระทำผิด</span>
                    <span className="text-rose-500 text-[14px]">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <select 
                      title="เลือกพนักงาน" 
                      className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 hover:border-slate-300 transition-all appearance-none shadow-sm"
                    >
                      <option className="text-slate-400">เลือกพนักงาน...</option>
                      <option>ภัทรินทร์ พงศธรธนเดช</option>
                      <option>เชษฐพงศ์ พลอย</option>
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none group-focus-within:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label htmlFor="warning-date" className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                    <span>วันที่กระทำผิด</span>
                    <span className="text-rose-500 text-[14px]">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      id="warning-date" 
                      type="text" 
                      defaultValue="28/04/2569" 
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 hover:border-slate-300 transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              {/* Warning Type */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <span>ประเภทหนังสือเตือน</span>
                  <span className="text-rose-500 text-[14px]">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <select 
                    title="ประเภทหนังสือเตือน" 
                    className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 hover:border-slate-300 transition-all appearance-none shadow-sm"
                  >
                    <option>ตักเตือนวาจา</option>
                    <option>ตักเตือนเป็นลายลักษณ์อักษร</option>
                    <option>ภาคทัณฑ์</option>
                    <option>พักงาน</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none group-focus-within:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <span>รายละเอียด</span>
                  <span className="text-rose-500 text-[14px]">*</span>
                </label>
                <textarea 
                  rows={4} 
                  placeholder="ระบุรายละเอียดการกระทำความผิดอย่างชัดเจน..." 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 hover:border-slate-300 transition-all resize-none shadow-sm" 
                />
              </div>

              {/* Witness */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <span>พยาน (ถ้ามี)</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <select 
                    title="พยาน" 
                    className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 hover:border-slate-300 transition-all appearance-none shadow-sm"
                  >
                    <option className="text-slate-400">เลือกพยาน (ถ้ามี)...</option>
                    <option>นราภรณ์ พงศ์วิชัย</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none group-focus-within:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">ไฟล์แนบ (Image, PDF)</label>
                <div className="w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white hover:bg-violet-50/30 hover:border-violet-300 transition-all group cursor-pointer shadow-sm hover:shadow-md duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-500 group-hover:scale-110 group-hover:bg-violet-100 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[14px] font-bold text-slate-700">ลากไฟล์มาวางที่นี่ หรือ <span className="text-violet-600 font-black underline underline-offset-2 hover:text-violet-700">เลือกไฟล์</span></span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">รองรับไฟล์ .JPG, .JPEG, .PNG, .PDF</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Footer */}
            <div className="p-7 bg-white flex items-center gap-4 flex-shrink-0 border-t border-slate-100/80 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="flex-1 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-[14px] font-bold hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="flex-[2] py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white rounded-2xl text-[14px] font-black hover:opacity-95 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
              >
                สร้างหนังสือเตือน
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
