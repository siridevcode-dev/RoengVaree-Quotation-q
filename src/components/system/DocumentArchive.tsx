"use client";

import React, { useState } from "react";

export default function DocumentArchive() {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 overflow-auto bg-[#F4F7FE] p-4 lg:p-8 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Breadcrumb & Promo Banner */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
            <span>เอกสาร</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#4318FF]">คลังเอกสาร</span>
          </div>

          <div className="bg-white border border-indigo-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm group hover:shadow-md transition-all">
            <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">e-Document</div>
            <p className="text-sm font-bold text-[#1B2559]">
              ฟีเจอร์นี้ตอบโจทย์ธุรกิจคุณหรือไม่? 
              <button className="ml-2 text-[#4318FF] hover:underline decoration-2 underline-offset-4">อัปเกรด e-Document เพื่อใช้งานต่อ!</button>
            </p>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-[#1B2559]">คลังเอกสาร</h1>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4318FF] text-white rounded-xl hover:bg-[#3b15e0] transition-all shadow-lg shadow-indigo-200 font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มไฟล์ใหม่
            </button>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[#4318FF] hover:underline transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            คำแนะนำการใช้งาน
          </button>
        </div>

        {/* Tabs & Content Area */}
        <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Tabs */}
          <div className="flex items-center border-b border-gray-50 px-6">
            {["ทั้งหมด", "ยังไม่ออกเอกสาร", "ออกเอกสาร"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-5 text-sm font-bold transition-all relative flex items-center gap-2 ${
                  activeTab === tab ? "text-[#4318FF]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {tab === "ยังไม่ออกเอกสาร" && (
                  <span className="w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm shadow-orange-200">0</span>
                )}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4318FF] rounded-full mx-6" />
                )}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400">วันที่อัปโหลด</span>
              <div className="flex items-center gap-3 bg-[#F4F7FE] px-4 py-2.5 rounded-xl border border-transparent focus-within:border-[#4318FF]/20 transition-all cursor-pointer">
                <span className="text-sm font-black text-[#1B2559]">01/01/2025 - 31/12/2026</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="relative w-72 group">
              <input 
                type="text"
                placeholder="ค้นหาชื่อไฟล์, ชื่อผู้นำเข้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4F7FE] border-none rounded-xl px-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 outline-none transition-all"
              />
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F4F7FE]/50 border-y border-gray-50">
                  <th className="px-6 py-4 w-10">
                    <input title="เลือกทั้งหมด" type="checkbox" className="rounded border-gray-300 text-[#4318FF] focus:ring-[#4318FF]/20" />
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">ชื่อไฟล์</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">วันที่อัปโหลด</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">ประเภท</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">ผู้อัปโหลด</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">คำสั่ง</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty State */}
                <tr>
                  <td colSpan={6} className="py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-8 mb-10">
                        <div className="relative">
                          <div className="w-20 h-20 bg-[#F4F7FE] rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#4318FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#4318FF] text-white rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-400 whitespace-nowrap">PEAK & @PEAKConnect</p>
                        </div>

                        <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>

                        <div className="relative">
                          <div className="w-20 h-20 bg-indigo-50/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-indigo-100">
                            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-400 whitespace-nowrap">คลังเอกสาร PEAK</p>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-[#1B2559] mb-3">คลังเอกสาร พื้นที่รวมไฟล์ที่อัปโหลด</h3>
                      <p className="text-gray-400 text-sm max-w-lg mb-8 leading-relaxed">
                        พื้นที่รวมไฟล์ที่อัปโหลดจากโปรแกรมและ LINE @ROENGVAREE <br/>
                        สามารถนำมาสร้าง/แนบเอกสาร หรือบันทึกรายจ่ายได้เลยง่ายๆ
                      </p>
                      
                      <button className="flex items-center gap-2 px-8 py-3.5 bg-[#4318FF] text-white rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all font-bold group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        เพิ่มไฟล์ใหม่
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
  );
}
