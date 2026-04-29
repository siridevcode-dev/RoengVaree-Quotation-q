"use client";

import React, { useState } from "react";

export default function FinanceManagement() {
  const [activeTab, setActiveTab] = useState("ภาพรวม");

  return (
    <div className="flex-1 overflow-auto bg-[#F4F7FE] p-4 lg:p-8 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-[#1B2559]">ภาพรวมการเงิน</h1>
          
          {/* Main Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
            {[
              "ภาพรวม", 
              "เงินสด/ธนาคาร/e-Wallet", 
              "สำรองรับจ่าย", 
              "เช็ครับ", 
              "เช็คจ่าย", 
              "ภาษีถูกหัก ณ ที่จ่าย", 
              "ภาษีหัก ณ ที่จ่าย"
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-black whitespace-nowrap transition-all relative ${
                  activeTab === tab ? "text-[#4318FF]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4318FF] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tracked Accounts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1B2559]">เงินสด/เงินฝากธนาคารที่ติดตาม</h2>
              <button title="ช่วยเหลือ" className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <button className="text-sm font-bold text-[#4318FF] hover:underline">เลือกบัญชี</button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="w-[260px] bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-50 group hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#4318FF]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#4318FF]">เงินสด</h4>
                  <p className="text-[10px] font-bold text-gray-400">เงินสด</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CSH001</p>
                <h3 className="text-xl font-black text-[#1B2559]">0.00 <span className="text-[11px] font-bold text-gray-400">บาท</span></h3>
              </div>
            </div>

            {/* Add New Account Placeholder */}
            <div className="w-[260px] bg-gray-50/50 rounded-2xl p-5 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center group hover:border-[#4318FF]/30 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-300 group-hover:text-[#4318FF] transition-colors mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-400">เพิ่มบัญชีธนาคาร</span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Cash In-Out Calendar */}
          <div className="lg:col-span-8 bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1B2559]">ตารางเงินเข้า-ออก</h2>
              <div className="flex items-center gap-4 bg-[#F4F7FE] p-1.5 rounded-xl">
                <button title="เดือนก่อนหน้า" className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-[#1B2559]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-black text-[#1B2559] px-2">เมษายน 2026</span>
                <button title="เดือนถัดไป" className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-[#1B2559]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatusBox label="เงินเข้า" color="emerald" />
              <StatusBox label="ค้างรับเกินเวลารับชำระ" color="amber" />
              <StatusBox label="เช็คคาดว่าจะเข้า" color="indigo" />
              <StatusBox label="เงินออก" color="rose" />
              <StatusBox label="ค้างจ่ายเกินเวลาชำระ" color="orange" />
              <StatusBox label="เช็คคาดว่าจะออก" color="purple" />
            </div>

            {/* Calendar Placeholder */}
            <div className="border border-gray-50 rounded-2xl overflow-hidden shadow-inner bg-gray-50/20">
              <div className="grid grid-cols-7 bg-[#F4F7FE] border-b border-gray-50">
                {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
                  <div key={day} className="py-3 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 h-[400px]">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className={`border-r border-b border-gray-50 p-2 text-xs font-bold ${i === 27 ? "bg-indigo-50/30" : "bg-white"}`}>
                    <span className={`${i === 27 ? "w-6 h-6 bg-[#4318FF] text-white rounded-full flex items-center justify-center" : "text-gray-400"}`}>
                      {(i % 30) + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Reconciled Items */}
            <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 p-6 flex flex-col group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#A3AED0]">รายการที่กระทบยอดแล้ว</h3>
                  <button title="ช่วยเหลือ" className="text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <button className="flex items-center gap-1 text-[11px] font-bold text-[#4318FF] hover:underline">
                  เลือกบัญชี
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="relative mb-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="54" stroke="#F4F7FE" strokeWidth="12" fill="transparent" />
                    <circle cx="64" cy="64" r="54" stroke="#4318FF" strokeWidth="12" fill="transparent" strokeDasharray="339.29" strokeDashoffset="339.29" className="transition-all duration-1000 group-hover:stroke-dashoffset-[300]" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#4318FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h4 className="text-md font-black text-[#1B2559]">ไม่มีช่องทางการเงินที่เลือกไว้</h4>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F4F7FE] text-[#1B2559] rounded-xl hover:bg-gray-100 transition-all font-bold text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  พิมพ์รายงาน
                </button>
              </div>
            </div>

            {/* Where is your money? */}
            <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 p-6 flex flex-col group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#A3AED0]">เงินของคุณอยู่ไหน</h3>
                  <button title="ช่วยเหลือ" className="text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <button className="text-[11px] font-bold text-[#4318FF] hover:underline">ช่องทางการเงินทั้งหมด</button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="relative mb-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="54" stroke="#F4F7FE" strokeWidth="12" fill="transparent" />
                    <circle cx="64" cy="64" r="54" stroke="#4318FF" strokeWidth="12" fill="transparent" strokeDasharray="339.29" strokeDashoffset="339.29" className="transition-all duration-1000 group-hover:stroke-dashoffset-[240]" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#4318FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h4 className="text-md font-black text-[#1B2559]">ไม่มีข้อมูลรายงานสำหรับ</h4>
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

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">ยอดรวม</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-[#1B2559]">0.00</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">บาท</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function StatusBox({ label, color }: { label: string, color: string }) {
  const mapping = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  const colorClasses = mapping[color as keyof typeof mapping] || mapping.indigo;

  return (
    <div className={`px-4 py-3 rounded-xl border flex flex-col gap-0.5 shadow-sm transition-all hover:shadow-md cursor-pointer ${colorClasses}`}>
      <span className="text-[10px] font-black uppercase tracking-wider opacity-80">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-black">0.00</span>
        <span className="text-[9px] font-bold opacity-60">บาท</span>
      </div>
    </div>
  );
}
