"use client";

import React, { useState } from "react";

export default function ChartOfAccounts() {
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 overflow-auto bg-[#F4F7FE] p-4 lg:p-8 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1B2559]">ผังบัญชี</h1>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[#4318FF] hover:underline transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            คำแนะนำการใช้งาน
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4318FF] text-white rounded-xl hover:bg-[#3b15e0] transition-all shadow-lg shadow-indigo-200 font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มบัญชี
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              นำเข้าผังบัญชี
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              พิมพ์รายงาน
            </button>
          </div>

          <div className="relative w-64 group">
            <input 
              type="text"
              placeholder="ค้นหาชื่อบัญชี หรือรหัส..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl px-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 outline-none transition-all shadow-sm"
            />
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters / Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["ทั้งหมด", "สินทรัพย์", "หนี้สิน", "ส่วนของเจ้าของ", "รายได้", "ค่าใช้จ่าย"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 text-xs font-black rounded-full transition-all whitespace-nowrap ${
                activeFilter === filter 
                  ? "bg-[#1B2559] text-white shadow-md" 
                  : "bg-white text-gray-400 hover:text-gray-600 shadow-sm border border-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Table Header Controls */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#1B2559]">แสดงตามโครงสร้างบัญชี</span>
              <div className="w-10 h-5 bg-[#4318FF] rounded-full relative cursor-pointer p-0.5">
                <div className="absolute right-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4F7FE]/50 border-b border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-5">รหัสบัญชี</th>
                  <th className="px-8 py-5">ชื่อบัญชี</th>
                  <th className="px-8 py-5">ประเภทบัญชี</th>
                  <th className="px-8 py-5">หมวดหมู่</th>
                  <th className="px-8 py-5 text-right">คำสั่ง</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample Row 1: Assets Header */}
                <tr className="bg-gray-50/50">
                  <td className="px-8 py-4 text-sm font-black text-[#1B2559]">100000</td>
                  <td className="px-8 py-4 text-sm font-black text-[#1B2559]">สินทรัพย์</td>
                  <td className="px-8 py-4 text-xs font-bold text-gray-400">หมวดหมู่หลัก</td>
                  <td className="px-8 py-4 text-xs font-bold text-gray-400">สินทรัพย์</td>
                  <td className="px-8 py-4 text-right"></td>
                </tr>
                {/* Sample Row 2: Cash */}
                <tr className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-4 text-sm font-bold text-gray-600 pl-12">111101</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-800">เงินสด</td>
                  <td className="px-8 py-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">บัญชีคุม</span>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-gray-500">สินทรัพย์หมุนเวียน</td>
                  <td className="px-8 py-4 text-right">
                    <button title="แก้ไข" className="p-2 text-gray-400 hover:text-[#4318FF] opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                {/* Sample Row 3: Bank */}
                <tr className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-4 text-sm font-bold text-gray-600 pl-12">111201</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-800">เงินฝากธนาคาร</td>
                  <td className="px-8 py-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">บัญชีคุม</span>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-gray-500">สินทรัพย์หมุนเวียน</td>
                  <td className="px-8 py-4 text-right">
                    <button title="แก้ไข" className="p-2 text-gray-400 hover:text-[#4318FF] opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
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
