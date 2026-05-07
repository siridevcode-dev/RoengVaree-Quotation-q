"use client";

import { useState } from "react";

export default function HRWarningLetter() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2569");
  const [activeDropdown, setActiveDropdown] = useState<"filter" | "year" | "type" | null>(null);
  const [selectedType, setSelectedType] = useState("ตักเตือนวาจา");

  const toggleDropdown = (type: "filter" | "year" | "type") => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  if (isCreating) {
    return (
      <div className="flex-1 flex flex-col min-w-0 animate-in slide-in-from-right duration-500 bg-slate-50/50 -m-6 p-6 overflow-y-auto custom-scrollbar" onClick={() => setActiveDropdown(null)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-[20px] font-black text-slate-800">สร้างหนังสือเตือน</h2>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-40">
          {/* Section 1: Select Employee */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold text-slate-800">เลือกพนักงานที่กระทำผิด</h3>
            <div className="relative">
              <select title="เลือกพนักงาน" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[14px] font-medium text-slate-400 outline-none focus:ring-2 focus:ring-[#0095FF]/10 transition-all appearance-none shadow-sm">
                <option>พนักงาน *</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Section 2: Date */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold text-slate-800">วันที่</h3>
            <div className="relative">
              <div className="relative px-4 py-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                <span className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-bold text-[#0095FF]">วันที่กระทำผิด *</span>
                <span className="text-[14px] font-bold text-slate-700">06/05/2569</span>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold text-slate-800">รายละเอียดหนังสือเตือน</h3>
            <div className="space-y-4">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <div 
                  onClick={() => toggleDropdown("type")}
                  className={`relative px-4 py-3 bg-white border-2 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all ${activeDropdown === "type" ? "border-[#0095FF]" : "border-[#0095FF]"}`}
                >
                  <span className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-bold text-[#0095FF]">ประเภทหนังสือเตือน *</span>
                  <span className="text-[14px] font-bold text-slate-700">{selectedType}</span>
                  <svg className={`w-3 h-3 text-slate-400 transition-transform ${activeDropdown === "type" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15l-4-4h8l-4 4z" />
                  </svg>
                </div>

                {activeDropdown === "type" && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                    {[
                      "ตักเตือนวาจา",
                      "ตักเตือนหนังสือ",
                      "พักงาน",
                      "พ้นสภาพ",
                      "อื่น ๆ"
                    ].map((item) => (
                      <div 
                        key={item} 
                        onClick={() => { setSelectedType(item); setActiveDropdown(null); }}
                        className={`px-5 py-3 text-[14px] font-bold cursor-pointer transition-colors ${selectedType === item ? "bg-[#F0F7FF] text-[#0095FF]" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <textarea 
                  placeholder="รายละเอียด *"
                  rows={6}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[24px] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#0095FF]/10 transition-all resize-none shadow-sm"
                />
              </div>

              <div className="relative">
                <div className="relative px-4 py-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm">
                  <span className="text-[14px] font-bold text-slate-400">พยาน</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Attachments */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold text-slate-800">ไฟล์แนบ (Image, PDF)</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 bg-white flex flex-col items-center justify-center gap-4 group hover:border-[#0095FF] hover:bg-blue-50/30 transition-all cursor-pointer shadow-sm">
               <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg className="w-8 h-8 text-slate-300 group-hover:text-[#0095FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
               </div>
               <p className="text-[14px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">ลากไฟล์มาวางที่นี่หรือ <span className="text-[#0095FF]">เลือกไฟล์</span></p>
            </div>
            <p className="text-[11px] font-medium text-slate-300">ประเภทไฟล์ .jpg .jpeg .png .pdf</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 right-0 left-0 bg-white/80 backdrop-blur-md border-t border-slate-100 py-5 px-8 flex items-center justify-center md:justify-end gap-4 z-50">
           <button 
             onClick={() => setIsCreating(false)}
             className="px-10 py-3 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
           >
             ยกเลิก
           </button>
           <button className="px-8 py-3 bg-[#0095FF] text-white rounded-2xl text-[15px] font-bold hover:bg-[#0084E6] transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
             </svg>
             <span>สร้างหนังสือเตือน</span>
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 animate-in fade-in duration-500 relative" onClick={() => setActiveDropdown(null)}>
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative group flex-1 max-w-[320px]">
          <div className="relative">
            <input 
              type="text" 
              placeholder="เลขที่หนังสือเตือน, ชื่อพนักงาน..." 
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] focus:ring-2 focus:ring-[#0095FF]/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("filter")}
              className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-2xl text-slate-500 hover:bg-slate-50 transition-all ${activeDropdown === "filter" ? "border-[#0095FF] ring-2 ring-[#0095FF]/10" : "border-slate-200"}`}
            >
               <svg className="w-5 h-5 text-[#0095FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
               </svg>
               <span className="text-[14px] font-bold">กรอง</span>
               <svg className={`w-3 h-3 text-slate-400 transition-transform ${activeDropdown === "filter" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
            </button>
            {activeDropdown === "filter" && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                {["ประเภทหนังสือเตือน", "สถานะ", "ใต้บังคับบัญชา (S)"].map((item) => (
                  <div key={item} className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-[14px] font-bold text-slate-700 transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown("year")}
              className="relative px-4 py-2.5 bg-white border-2 border-[#0095FF] rounded-2xl cursor-pointer flex items-center justify-between min-w-[140px]"
            >
               <span className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-bold text-[#0095FF]">ปี</span>
               <span className="text-[14px] font-bold text-slate-800">{selectedYear}</span>
               <svg className="w-5 h-5 text-slate-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            </div>
            {activeDropdown === "year" && (
              <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-4 z-50 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between gap-2">
                   {["2568", "2569", "2570"].map((year) => (
                     <div 
                        key={year} 
                        onClick={() => { setSelectedYear(year); setActiveDropdown(null); }}
                        className={`flex-1 py-2 text-center rounded-full text-[14px] font-bold cursor-pointer transition-all ${selectedYear === year ? "bg-[#005F8F] text-white" : "hover:bg-slate-50 text-slate-600"}`}
                     >
                        {year}
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0095FF] text-white rounded-2xl text-[14px] font-black hover:bg-[#0084E6] transition-all shadow-lg shadow-blue-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <span>สร้างหนังสือเตือน</span>
          </button>

          <button title="ตั้งค่า" className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m12 4a2 2 0 100-4m0 4a2 2 0 110-4m-6 8v-2m-6 0v-2m12 0v-2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-20">
         <div className="relative mb-8">
            <div className="w-48 h-40 relative">
               <div className="absolute inset-0 bg-slate-50 border border-slate-100 rounded-[24px]" />
               <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-32 h-40 bg-white border border-slate-100 rounded-xl shadow-sm rotate-[-5deg] z-10 flex flex-col p-4 gap-2">
                  <div className="w-full h-2 bg-slate-50 rounded" />
                  <div className="w-4/5 h-2 bg-slate-50 rounded" />
                  <div className="w-2/3 h-2 bg-slate-50 rounded" />
               </div>
               <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-32 h-40 bg-white border border-slate-100 rounded-xl shadow-sm rotate-[5deg] z-20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-slate-100">?</span>
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-32 bg-white/80 backdrop-blur-sm border border-white rounded-[24px] shadow-lg z-30 transform origin-bottom hover:rotate-x-12 transition-transform duration-500" />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-50 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-indigo-50 rounded-full blur-xl" />
         </div>
         <h3 className="text-xl font-black text-slate-400">ไม่มีข้อมูล</h3>
      </div>
    </div>
  );
}
