"use client";

import React, { useState } from "react";

export default function ProductManagement() {
  const [mainTab, setMainTab] = useState("สินค้า");
  const [subTab, setSubTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 overflow-auto bg-[#F4F7FE] p-4 lg:p-8 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1B2559]">สินค้า</h1>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[#4318FF] hover:underline transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            คำแนะนำการใช้งาน
          </button>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center border-b border-gray-100">
          {["สินค้า", "บริการ"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`px-8 py-3 text-sm font-black transition-all relative ${
                mainTab === tab ? "text-[#4318FF]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {mainTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4318FF] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tracked Products Section */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-[#1B2559]">สินค้าที่ติดตาม</h2>
          <button className="text-xs font-bold text-[#4318FF] hover:underline">
            เลือกสินค้าที่ติดตาม
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4318FF] text-white rounded-xl hover:bg-[#3b15e0] transition-all shadow-lg shadow-indigo-200 font-bold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มสินค้า
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            นำเข้าสินค้า
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            พิมพ์รายงาน
          </button>
        </div>

        {/* Secondary Tabs & Content Area */}
        <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden flex flex-col min-h-[500px]">
          {/* Sub Tabs */}
          <div className="flex items-center border-b border-gray-50 px-6">
            {["ทั้งหมด", "ปิดใช้งาน"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-6 py-4 text-sm font-bold transition-all relative ${
                  subTab === tab ? "text-[#1B2559]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {subTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2559] rounded-full mx-6" />
                )}
              </button>
            ))}
          </div>

          {/* Search Bar inside area */}
          <div className="p-6 flex justify-end">
            <div className="relative w-64 group">
              <input 
                type="text"
                placeholder="ค้นหา..."
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
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">รหัส</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">ชื่อสินค้า</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">หน่วย</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">จำนวนคงเหลือ</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">ราคาขาย/หน่วย</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty State */}
                <tr>
                  <td colSpan={5} className="py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-[#F4F7FE] rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-black text-[#1B2559] mb-2">ไม่พบรายการสินค้า</h3>
                      <p className="text-gray-400 text-sm max-w-xs mb-8">เริ่มสร้างรายการสินค้าและบริการของคุณเพื่อนำไปใช้งานในเอกสารต่างๆ</p>
                      <button className="flex items-center gap-2 px-6 py-3 bg-[#4318FF] text-white rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all font-bold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        สร้างสินค้าใหม่
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
