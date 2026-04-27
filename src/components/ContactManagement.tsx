"use client";

import React, { useState } from "react";

export default function ContactManagement() {
  const [activeGroup, setActiveGroup] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full bg-[#F4F7FE] animate-in fade-in duration-500 overflow-hidden">
      
      {/* Left Sidebar */}
      <div className="w-[280px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-50">
          <h1 className="text-xl font-bold text-[#1B2559]">ผู้ติดต่อ</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {/* Standard Groups */}
          <div className="space-y-2">
            <h3 className="px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">กลุ่มมาตรฐาน</h3>
            <div className="space-y-1">
              <GroupItem 
                label="ทั้งหมด" 
                count={0} 
                active={activeGroup === "ทั้งหมด"} 
                onClick={() => setActiveGroup("ทั้งหมด")} 
                color="bg-gray-400"
              />
              <GroupItem 
                label="ลูกค้า" 
                count={0} 
                active={activeGroup === "ลูกค้า"} 
                onClick={() => setActiveGroup("ลูกค้า")} 
                color="bg-emerald-500"
              />
              <GroupItem 
                label="ผู้ขาย" 
                count={0} 
                active={activeGroup === "ผู้ขาย"} 
                onClick={() => setActiveGroup("ผู้ขาย")} 
                color="bg-amber-500"
              />
              <GroupItem 
                label="ปิดใช้งาน" 
                count={0} 
                active={activeGroup === "ปิดใช้งาน"} 
                onClick={() => setActiveGroup("ปิดใช้งาน")} 
                color="bg-rose-500"
              />
            </div>
          </div>

          {/* Custom Groups */}
          <div className="space-y-2">
            <div className="px-4 flex items-center justify-between">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">กลุ่มกำหนดเอง</h3>
              <button title="เพิ่มกลุ่ม" className="text-[#4318FF] hover:bg-indigo-50 p-1 rounded-lg transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center opacity-40 group hover:opacity-60 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-500">สร้างกลุ่มใหม่</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header & Actions */}
        <div className="bg-white p-6 border-b border-gray-50 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-[#1B2559]">กลุ่ม {activeGroup}</h2>
              <span className="px-3 py-1 bg-[#F4F7FE] text-[#4318FF] text-xs font-bold rounded-full">0 รายการ</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative w-64 group">
                <input 
                  type="text"
                  placeholder="ค้นหาผู้ติดต่อ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F4F7FE] border-none rounded-xl px-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 outline-none transition-all"
                />
                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button title="ตัวกรอง" className="p-2.5 bg-[#F4F7FE] text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4318FF] text-white rounded-xl hover:bg-[#3b15e0] transition-all shadow-lg shadow-indigo-200 font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มผู้ติดต่อ
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm opacity-50 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              เพิ่มเข้ากลุ่ม
            </button>
            <div className="h-6 w-px bg-gray-100 mx-1" />
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              นำเข้าผู้ติดต่อ
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              พิมพ์รายงาน
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden flex flex-col min-h-full">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F4F7FE]/50 border-b border-gray-50">
                  <th className="px-6 py-4 w-10">
                    <input title="เลือกทั้งหมด" type="checkbox" className="rounded border-gray-300 text-[#4318FF] focus:ring-[#4318FF]/20" />
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">เลขที่</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">ชื่อ</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">กลุ่ม</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">คำสั่ง</th>
                </tr>
              </thead>
              <tbody className="flex-1">
                {/* Empty State */}
                <tr>
                  <td colSpan={5} className="py-32">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-[#F4F7FE] rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-black text-[#1B2559] mb-2">ไม่พบรายชื่อผู้ติดต่อ</h3>
                      <p className="text-gray-400 text-sm max-w-xs mb-8">เริ่มสร้างรายชื่อผู้ติดต่อของคุณได้ง่ายๆ เพื่อเริ่มทำธุรกรรมและจัดการงานบัญชี</p>
                      <button className="flex items-center gap-2 px-6 py-3 bg-[#4318FF] text-white rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all font-bold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        สร้างผู้ติดต่อใหม่
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-auto border-t border-gray-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400">แสดง</span>
                <select title="จำนวนรายการต่อหน้า" className="bg-[#F4F7FE] border-none rounded-lg px-3 py-1.5 text-xs font-bold text-[#1B2559] outline-none">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <span className="text-sm font-bold text-gray-400">รายการ</span>
              </div>

              <div className="flex items-center gap-2">
                <button title="หน้าก่อนหน้า" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-400 px-2">หน้า</span>
                  <select title="เลือกหน้า" className="bg-[#F4F7FE] border-none rounded-lg px-4 py-1.5 text-xs font-bold text-[#1B2559] outline-none">
                    <option>1</option>
                  </select>
                </div>
                <button title="หน้าถัดไป" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupItem({ label, count, active, onClick, color }: { label: string, count: number, active: boolean, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        active 
          ? "bg-[#F4F7FE] text-[#1B2559] shadow-sm" 
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color} ${active ? "scale-125 shadow-[0_0_8px_rgba(0,0,0,0.1)]" : "opacity-40"}`} />
        <span className={`text-sm tracking-tight ${active ? "font-black" : "font-bold"}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black ${active ? "text-[#4318FF]" : "text-gray-300"}`}>{count}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${active ? "text-[#4318FF] translate-x-1" : "text-gray-200 group-hover:translate-x-1"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
