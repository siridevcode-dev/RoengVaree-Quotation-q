"use client";

import { useState } from "react";

export default function HRAnnouncement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("ทั้งหมด");
  const [status, setStatus] = useState("ทั้งหมด");

  return (
    <div className="flex-1 flex flex-col bg-white h-full font-sans">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        {/* Left: Search */}
        <div className="relative w-80">
          <input title="ค้นหาหัวข้อประกาศ"
            type="text"
            placeholder="ค้นหาหัวข้อประกาศ"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-slate-700 outline-none focus:border-blue-500 transition-colors shadow-sm"
          />
          <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Right: Filters & Actions */}
        <div className="flex items-center gap-4">
          {/* Date Range Dropdown */}
          <div className="relative border border-gray-200 rounded-xl px-3 py-1.5 bg-white shadow-sm flex flex-col">
            <span className="text-[10px] text-gray-400 absolute -top-2.5 left-2 bg-white px-1">ช่วงเวลา</span>
            <select title="ช่วงเวลา"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none text-[14px] text-gray-700 outline-none cursor-pointer pr-4 appearance-none min-w-[100px]"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="เดือนนี้">เดือนนี้</option>
              <option value="เดือนที่แล้ว">เดือนที่แล้ว</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative border border-gray-200 rounded-xl px-3 py-1.5 bg-white shadow-sm flex flex-col">
            <span className="text-[10px] text-gray-400 absolute -top-2.5 left-2 bg-white px-1">สถานะ</span>
            <select title="สถานะ"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent border-none text-[14px] text-gray-700 outline-none cursor-pointer pr-4 appearance-none min-w-[100px]"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="ใช้งาน">ใช้งาน</option>
              <option value="ระงับ">ระงับ</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Create Button */}
          <button title="สร้างประกาศ" className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            สร้างประกาศ
          </button>

          {/* Settings/Filter Button */}
          <button title="ตัวกรอง" className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content (Empty State) */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        {/* Empty State Illustration */}
        <div className="relative w-64 h-64 mb-6 flex items-center justify-center">
          <svg className="w-full h-full text-slate-200/50" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M160 60H110L90 40H40C28.9543 40 20 48.9543 20 60V140C20 151.046 28.9543 160 40 160H160C171.046 160 180 151.046 180 140V80C180 68.9543 171.046 60 160 60Z" fill="#F1F5F9" />
            <path d="M40 70H160C171.046 70 180 78.9543 180 90V140C180 151.046 171.046 160 160 160H40C28.9543 160 20 151.046 20 140V90C20 78.9543 28.9543 70 40 70Z" fill="#E2E8F0" />
            <rect x="50" y="20" width="40" height="50" rx="4" fill="#CBD5E1" transform="rotate(-15 50 20)" />
            <rect x="100" y="10" width="50" height="60" rx="4" fill="#94A3B8" transform="rotate(10 100 10)" />
            <circle cx="160" cy="40" r="8" fill="#E2E8F0" />
            <circle cx="30" cy="170" r="5" fill="#E2E8F0" />
            <circle cx="180" cy="170" r="12" fill="#F1F5F9" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center mt-4">
             <div className="w-24 h-24 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
             </div>
          </div>
        </div>
        <h3 className="text-[20px] font-bold text-slate-400">ไม่มีข้อมูล</h3>
      </div>
    </div>
  );
}
