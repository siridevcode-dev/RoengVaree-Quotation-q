"use client";

import React from "react";

interface AccountingPlaceholderProps {
  title: string;
}

export default function AccountingPlaceholder({ title }: AccountingPlaceholderProps) {
  return (
    <div className="flex-1 overflow-auto bg-[#f8fafc] p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการข้อมูล{title}ในระบบบัญชี</p>
          </div>
          <button className="px-4 py-2 bg-[#283583] text-white rounded-lg hover:bg-[#3b4ba4] transition-all shadow-md font-medium text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            เพิ่ม{title}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500">ยอดรวมทั้งหมด</p>
            <p className="text-3xl font-black text-[#283583] mt-2">฿0.00</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full w-fit">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +0% จากเดือนที่แล้ว
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500">รายการเดือนนี้</p>
            <p className="text-3xl font-black text-gray-900 mt-2">0</p>
            <p className="text-xs text-gray-400 mt-4">อัปเดตล่าสุด: เมื่อครู่</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500">สถานะระบบ</p>
            <div className="flex items-center gap-2 mt-4 text-emerald-500 font-bold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              พร้อมใช้งาน
            </div>
            <p className="text-xs text-gray-400 mt-4">เชื่อมต่อกับฐานข้อมูลหลักแล้ว</p>
          </div>
        </div>

        {/* Table/List Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">รายการล่าสุด</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="ค้นหา..." 
                  className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] w-64"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900">ไม่พบข้อมูล{title}</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-[300px]">เริ่มสร้างรายการแรกของคุณเพื่อดูข้อมูลทางสถิติและการจัดการที่มีประสิทธิภาพ</p>
            <button className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-bold text-sm">
              สร้างรายการใหม่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
