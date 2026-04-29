"use client";

import { useState } from "react";

export default function HRAttendance() {
  const [currentTime] = useState("15:32");
  const [currentDate] = useState("อ. 28 เม.ย. 69");

  return (
    <div className="flex-1 bg-[#F1F5F9] p-8 overflow-y-auto custom-scrollbar font-sans">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Time & Shift Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center text-center">
            <span className="text-slate-500 font-bold text-[18px] mb-2">{currentDate}</span>
            <div className="flex items-baseline gap-2 mb-4">
              <h1 className="text-[64px] font-black text-blue-600 leading-none">{currentTime} <span className="text-[32px] text-blue-500/60 uppercase">น.</span></h1>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl mb-8">
              <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">SHIFT101</span>
              <span className="text-[15px] font-bold text-slate-600">08:00 - 17:00</span>
              <div className="w-px h-3 bg-slate-200" />
              <span className="text-[15px] font-bold text-slate-400">12:00 - 13:00</span>
            </div>

            <div className="w-full space-y-4 mb-8">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className="text-[15px] font-bold text-slate-500">เข้างาน 08:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-black text-blue-600">08:04 น.</span>
                  <button title="แก้ไข" aria-label="แก้ไข" className="text-slate-300 hover:text-blue-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <span className="text-[15px] font-bold text-slate-500">ออกงาน 17:00</span>
                </div>
                <span className="text-[18px] font-black text-slate-300">-</span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.4)] w-[80%]" />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[14px] font-black text-blue-500/50">80 %</span>
                <span className="text-[13px] font-bold text-slate-400">เวลาทำงาน 6 ชั่วโมง 28 นาที</span>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex justify-around items-center">
            <button className="flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-[0_10px_25px_rgba(0,0,0,0.03)] flex items-center justify-center text-slate-300 transition-all group-hover:scale-110 group-hover:shadow-blue-100 group-hover:text-blue-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              </div>
              <span className="text-[14px] font-black text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">สแกน</span>
            </button>

            <button className="flex flex-col items-center gap-4 group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 border-8 border-white shadow-[0_20px_40px_rgba(245,158,11,0.25)] flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:shadow-[0_25px_50px_rgba(245,158,11,0.35)] active:scale-95">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <span className="text-[16px] font-black text-orange-500 uppercase tracking-[0.2em]">ออกงาน</span>
            </button>

            <button className="flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-[0_10px_25px_rgba(0,0,0,0.03)] flex items-center justify-center text-orange-400 transition-all group-hover:scale-110 group-hover:shadow-orange-100">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              </div>
              <span className="text-[14px] font-black text-slate-400 group-hover:text-orange-500 uppercase tracking-widest">สร้าง QR Code</span>
            </button>
          </div>

          {/* Grid Quick Access */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <div className="grid grid-cols-4 gap-y-10">
              {[
                { label: "ลาพักร้อน", icon: "ship", color: "bg-orange-50 text-orange-500" },
                { label: "เปลี่ยนกะ", icon: "refresh", color: "bg-emerald-50 text-emerald-500" },
                { label: "โอที", icon: "clock-plus", color: "bg-blue-50 text-blue-500" },
                { label: "โควต้าการลา", icon: "notepad", color: "bg-amber-50 text-amber-500" },
                { label: "วันหยุดประจำปี", icon: "calendar-x", color: "bg-rose-50 text-rose-500" },
                { label: "เบิกค่าใช้จ่าย", icon: "wallet", color: "bg-purple-50 text-purple-500" },
                { label: "ประกาศ", icon: "speaker", color: "bg-teal-50 text-teal-500" },
                { label: "สลิปเงินเดือน", icon: "receipt", color: "bg-pink-50 text-pink-500" },
              ].map((item, i) => (
                <button key={i} className="flex flex-col items-center gap-3 group">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-sm transition-all group-hover:scale-110 group-hover:-translate-y-1`}>
                    {item.icon === "ship" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 16l-3.5-3.5-3.5 3.5m7-4l-3.5-3.5L14 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16h18v2H3zM5 16l2-8h10l2 8" strokeWidth={2.5} strokeLinecap="round"/></svg>}
                    {item.icon === "refresh" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                    {item.icon === "clock-plus" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0zm-3-7l3 3m0-3l-3 3" /></svg>}
                    {item.icon === "notepad" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    {item.icon === "calendar-x" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM10 14l4 4m0-4l-4 4" /></svg>}
                    {item.icon === "wallet" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    {item.icon === "speaker" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.297A1.705 1.705 0 019.297 21h-.594A1.705 1.705 0 017 19.297V5.882c0-1.026.834-1.882 1.882-1.882h.412c1.048 0 1.882.856 1.882 1.882zM11 5.882c0-1.026.834-1.882 1.882-1.882h.412c1.048 0 1.882.856 1.882 1.882v13.415c0 1.026-.834 1.882-1.882 1.882h-.412c-1.048 0-1.882-.856-1.882-1.882V5.882z" /></svg>}
                    {item.icon === "receipt" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 14l2 2 4-4m5-1a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                  </div>
                  <span className="text-[12px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Stats Card */}
          <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white h-full flex flex-col">
            <h2 className="text-2xl font-black text-slate-800 mb-8 px-2 flex items-center justify-between">
              เวลาทำงาน
              <div className="flex gap-2">
                <button title="ตั้งค่า" aria-label="ตั้งค่า" className="p-2 text-slate-300 hover:text-blue-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
              </div>
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="relative group">
                <span className="absolute -top-2.5 left-4 px-1.5 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest z-10">เดือน</span>
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-blue-200 transition-colors cursor-pointer">
                  <button title="เดือนก่อนหน้า" aria-label="เดือนก่อนหน้า" className="text-slate-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                  <span className="text-[15px] font-black text-slate-600">เมษายน</span>
                  <button title="เดือนถัดไป" aria-label="เดือนถัดไป" className="text-slate-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
                </div>
              </div>
              <div className="relative group">
                <span className="absolute -top-2.5 left-4 px-1.5 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest z-10">ปี</span>
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-blue-200 transition-colors cursor-pointer">
                  <button title="ปีก่อนหน้า" aria-label="ปีก่อนหน้า" className="text-slate-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                  <span className="text-[15px] font-black text-slate-600">2569</span>
                  <button title="ปีถัดไป" aria-label="ปีถัดไป" className="text-slate-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { label: "ปฏิทิน", count: 30, icon: "calendar", color: "bg-slate-700 text-white" },
                { label: "เข้างาน", count: 16, icon: "check", color: "bg-emerald-500 text-white" },
                { label: "ขาดงาน", count: 4, icon: "x", color: "bg-rose-500 text-white" },
                { label: "สาย", count: 0, icon: "clock", color: "bg-amber-500 text-white" },
                { label: "กลับก่อน", count: 2, icon: "sun", color: "bg-blue-500 text-white" },
                { label: "ลาหยุด", count: 0, icon: "beach", color: "bg-orange-500 text-white" },
                { label: "โอที", count: 1, icon: "zap", color: "bg-sky-500 text-white" },
                { label: "หนังสือเตือน", count: 0, icon: "alert", color: "bg-rose-700 text-white" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-3xl border border-slate-100/50 group hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-sm`}>
                      {item.icon === "calendar" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                      {item.icon === "check" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                      {item.icon === "x" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                      {item.icon === "clock" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {item.icon === "sun" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" /></svg>}
                      {item.icon === "beach" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>}
                      {item.icon === "zap" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                      {item.icon === "alert" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                    </div>
                    <span className="text-[14px] font-bold text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-[20px] font-black text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-black text-slate-800">วันลาที่ใช้ไป ประจำปี 2569</h3>
                <div className="px-3 py-1 bg-orange-50 rounded-full">
                  <span className="text-[13px] font-black text-orange-500">0 วัน</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">ลาหยุดพักร้อนประจำปี</span>
                    <span className="text-[14px] font-black text-slate-700">0 วัน <span className="text-[11px] text-slate-300">/ 6</span></span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full w-0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">ลากิจ</span>
                    <span className="text-[14px] font-black text-slate-700">0 วัน <span className="text-[11px] text-slate-300">/ 3</span></span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full w-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
