"use client";

import React, { useState } from "react";

export default function ExpenseOverview() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("รายเดือน");

  return (
    <div className="flex-1 overflow-auto bg-[#F4F7FE] p-4 lg:p-8 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Top Section: Tracked Accounts (บัญชีที่ติดตาม) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#1B2559]">บัญชีที่ติดตาม</h3>
              <button title="ช่วยเหลือ" className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <button className="text-sm font-bold text-[#4318FF] hover:underline">เลือกบัญชี</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "215101", title: "ภาษีขาย ภ.พ.30", subtitle: "หนี้สินทางภาษีและประกันสังคม" },
              { id: "215201", title: "ภ.ง.ด. 1 ค้างจ่าย", subtitle: "หนี้สินทางภาษีและประกันสังคม" },
              { id: "215203", title: "ภ.ง.ด. 3 ค้างจ่าย", subtitle: "หนี้สินทางภาษีและประกันสังคม" },
              { id: "215204", title: "ภ.ง.ด. 53 ค้างจ่าย", subtitle: "หนี้สินทางภาษีและประกันสังคม" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.id}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <h4 className="text-sm font-black text-[#1B2559]">{item.title}</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.subtitle}</p>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-lg font-black text-[#1B2559]">0.00 <span className="text-[10px] font-bold text-gray-400">บาท</span></span>
                  <span className="text-[9px] font-bold text-gray-400">N/A MoM</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: Main Header & Chart */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1B2559]">บันทึกค่าใช้จ่ายที่ชำระแล้ว รอชำระ และพ้นกำหนด</h1>
            <button title="ช่วยเหลือ" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#283583] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                บันทึกค่าใช้จ่าย
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-[#1B2559] rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              พิมพ์รายงาน
            </button>
          </div>
        </div>

        {/* Chart & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bar Chart Card */}
          <div className="lg:col-span-8 bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 p-6 flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select 
                    title="เลือกมุมมองช่วงเวลา"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-[#F4F7FE] border-none px-4 py-2 rounded-xl text-sm font-bold text-[#1B2559] pr-10 focus:ring-2 focus:ring-[#283583]/10 outline-none"
                  >
                    <option>รายเดือน</option>
                    <option>รายไตรมาส</option>
                  </select>
                  <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="relative">
                  <select 
                    title="เลือกปี"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-[#F4F7FE] border-none px-4 py-2 rounded-xl text-sm font-bold text-[#1B2559] pr-10 focus:ring-2 focus:ring-[#283583]/10 outline-none"
                  >
                    <option>2026</option>
                    <option>2025</option>
                  </select>
                  <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E2E8F0]" />
                  <span className="text-xs font-bold text-[#A3AED0]">ชำระแล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
                  <span className="text-xs font-bold text-[#A3AED0]">รอชำระ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
                  <span className="text-xs font-bold text-[#A3AED0]">พ้นกำหนดชำระ</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative mb-6">
                <div className="w-48 h-40 flex items-end justify-center gap-3">
                  <div className="w-6 bg-rose-100 rounded-t-lg h-[60%] animate-pulse" />
                  <div className="w-6 bg-rose-400 rounded-t-lg h-[40%] animate-pulse delay-75" />
                  <div className="w-6 bg-rose-200 rounded-t-lg h-[90%] animate-pulse delay-150" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl">
                  <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-black text-[#1B2559]">ไม่มีข้อมูลรายงานสำหรับ</h3>
                </div>
              </div>
              <div className="w-full mt-auto pt-6 flex justify-between text-[11px] font-bold text-[#A3AED0] px-4">
                {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map(m => (
                  <span key={m}>{m} 26</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary: Issued Documents */}
          <div className="lg:col-span-4 bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-[#1B2559] mb-6">เอกสารที่ออก</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="relative">
                <select title="ประเภทเอกสาร" className="w-full appearance-none bg-[#F4F7FE] border-none px-4 py-2.5 rounded-xl text-sm font-bold text-[#1B2559] pr-10 outline-none">
                  <option>บันทึกค่าใช้จ่าย</option>
                  <option>ใบสั่งซื้อ</option>
                </select>
                <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="relative">
                <select title="ช่วงเวลา" className="w-full appearance-none bg-[#F4F7FE] border-none px-4 py-2.5 rounded-xl text-sm font-bold text-[#1B2559] pr-10 outline-none">
                  <option>เดือนนี้</option>
                  <option>เดือนที่แล้ว</option>
                </select>
                <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {[
                { label: "บันทึกรายจ่าย", value: "0.00", count: 0 },
                { label: "บันทึกรายจ่ายที่ชำระแล้ว", value: "0.00", count: 0 },
                { label: "บันทึกรายจ่ายที่รอชำระ", value: "0.00", count: 0 },
                { label: "บันทึกรายจ่ายที่พ้นกำหนดชำระ", value: "0.00", count: 0 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1B2559]">{item.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-black text-[#1B2559]">{item.value}</span>
                      <span className="text-[11px] font-bold text-gray-400 ml-1">บาท</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[11px] font-bold text-gray-400">{item.count} รายการ</span>
                  </div>
                  {idx !== 3 && <div className="absolute bottom-[-12px] left-0 right-0 h-px bg-gray-50" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Doughnut Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpenseDoughnut title="คุณจ่ายให้ใครมากที่สุด" />
          <ExpenseDoughnut title="คุณจ่ายค่าอะไรมากที่สุด" />
        </div>

      </div>
    </div>
  );
}

function ExpenseDoughnut({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 p-6 flex flex-col group overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#A3AED0]">{title}</h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative mb-6">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="54" stroke="#F4F7FE" strokeWidth="12" fill="transparent" />
            <circle cx="64" cy="64" r="54" stroke="#6366f1" strokeWidth="12" fill="transparent" strokeDasharray="339.29" strokeDashoffset="339.29" className="transition-all duration-1000 group-hover:stroke-dashoffset-[280]" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <h4 className="text-xl font-black text-[#1B2559]">ไม่มีข้อมูลรายงานสำหรับ</h4>
          <div className="relative mt-4">
            <select title="เลือกช่วงเวลา" className="appearance-none bg-[#F4F7FE] border-none px-6 py-2 rounded-xl text-xs font-bold text-[#1B2559] pr-10 outline-none">
              <option>เดือนนี้</option>
              <option>เดือนที่แล้ว</option>
            </select>
            <svg className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">ยอดรวม</span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-[#1B2559]">0.00</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase">บาท</span>
        </div>
      </div>
    </div>
  );
}
