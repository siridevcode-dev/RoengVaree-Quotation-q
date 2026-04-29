"use client";

import React from "react";

export default function AccountingDashboard() {
  return (
    <div className="flex-1 overflow-auto bg-[#f8fafc] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">หน้าหลัก (บัญชี)</h1>
            <p className="text-slate-500 font-medium mt-1">ยินดีต้อนรับสู่แดชบอร์ดสรุปภาพรวมบัญชีของคุณ</p>
          </div>
          <div className="flex items-center gap-3">
            <button title="เลือกช่วงเวลา" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-bold text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              มกราคม - ธันวาคม 2026
            </button>
            <button title="สร้างเอกสารใหม่" className="px-5 py-2.5 bg-[#283583] text-white rounded-xl hover:bg-[#3b4ba4] transition-all shadow-lg shadow-[#283583]/20 font-bold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              สร้างเอกสารใหม่
            </button>
          </div>
        </div>

        {/* First Row: Main Chart and Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-indigo-100/50 duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">ภาพรวมรายรับและรายจ่าย</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button title="สร้างเอกสาร" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all font-bold text-xs border border-slate-200">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    สร้างเอกสาร
                    <svg className="w-3 h-3 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">รายได้ 2026</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">฿0.00</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                    <span className="text-emerald-500">N/A</span> YoY Growth
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ค่าใช้จ่าย 2026</p>
                  <p className="text-2xl font-black text-rose-600 mt-1">฿0.00</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                    <span className="text-rose-500">N/A</span> YoY Growth
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#283583] shadow-lg shadow-indigo-900/10">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest">กำไร/ขาดทุน</p>
                  <p className="text-2xl font-black text-white mt-1">฿0.00</p>
                  <p className="text-[10px] font-bold text-white/40 mt-1">Net Performance</p>
                </div>
              </div>

              {/* Chart Placeholder (SVG Based) */}
              <div className="h-[280px] w-full relative">
                <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" y1={300 - i * 75} x2="1000" y2={300 - i * 75} stroke="#f1f5f9" strokeWidth="1" />
                  ))}
                  
                  {/* Empty State Line (Flat) */}
                  <line x1="0" y1="280" x2="1000" y2="280" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="8,8" />
                  
                  {/* Monthly Labels */}
                  {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((m, i) => (
                    <text key={m} x={i * (1000 / 11)} y="300" textAnchor="middle" className="text-[12px] fill-slate-400 font-bold">{m}</text>
                  ))}
                </svg>
                
                {/* Empty Overlay */}
                <div className="absolute inset-0 flex items-center justify-center flex-col opacity-40">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-slate-400">ยังไม่มีข้อมูลการแสดงผลในปีนี้</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Awaiting Items */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-800">รอรับชำระ/รอชำระ</h3>
                <button title="ตัวเลือกเพิ่มเติม" className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-indigo-50/50 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 text-white rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-800">ไม่มีข้อมูลรายงานสำหรับ</h4>
                <div className="mt-4 w-full px-4">
                  <select title="ประเภทรายงาน" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700 appearance-none">
                    <option>ลูกหนี้ (Account Receivable)</option>
                    <option>เจ้าหนี้ (Account Payable)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ยอดรอรับชำระ</p>
                  <p className="text-lg font-black text-emerald-700 mt-1">฿0.00</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-center">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">ยอดรอชำระ</p>
                  <p className="text-lg font-black text-amber-700 mt-1">฿0.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Doughnut Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ChartCard 
            title="รายได้" 
            color="emerald" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} 
            actionText="สร้างใบเสร็จรับเงิน"
          />
          <ChartCard 
            title="ค่าใช้จ่าย" 
            color="rose" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />} 
            actionText="บันทึกค่าใช้จ่าย"
          />
          <ChartCard 
            title="เงินของคุณอยู่ไหน" 
            color="indigo" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />} 
            actionText="ภาพรวมการเงิน"
          />
        </div>

        {/* Third Row: Bank Accounts */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">เงินสด/เงินฝากธนาคารที่ติดตาม</h3>
                <p className="text-xs font-medium text-slate-400">สรุปยอดเงินคงเหลือในแต่ละบัญชีของคุณ</p>
              </div>
            </div>
            <button title="เลือกบัญชีธนาคาร" className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all font-bold text-xs flex items-center gap-2">
              เลือกบัญชี
            </button>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">CSH001</p>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-md uppercase">Active</span>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500">เงินสด</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">฿0.00</h4>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400">อัปเดตเมื่อครู่</p>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            {/* Empty Slots */}
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 rounded-3xl bg-slate-50/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-indigo-300 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 mb-4 group-hover:text-indigo-400 group-hover:shadow-md transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-slate-400">เพิ่มบัญชีธนาคาร</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, color, icon, actionText }: { title: string, color: string, icon: React.ReactNode, actionText: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 ring-emerald-500/20",
    rose: "text-rose-600 bg-rose-50 border-rose-100 ring-rose-500/20",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 ring-indigo-500/20"
  };
  
  const colorClasses = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses.split(' ')[1]} ${colorClasses.split(' ')[0]}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <button title={actionText} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {actionText}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
        <div className="relative">
          {/* Doughnut SVG */}
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-50" />
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray="502.6" strokeDashoffset="502.6" className={`${colorClasses.split(' ')[0]} transition-all duration-1000 group-hover:stroke-dashoffset-[400]`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">ยอดรวม</p>
            <p className="text-2xl font-black text-slate-900 leading-none">฿0.00</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-slate-400">ไม่มีข้อมูลรายงานสำหรับ</p>
          <div className="relative">
            <select title="เลือกช่วงเวลาข้อมูล" className="appearance-none bg-slate-50 border border-slate-200 px-6 py-2 rounded-xl text-xs font-bold text-slate-600 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-500/20">
              <option>เดือนนี้</option>
              <option>เดือนที่แล้ว</option>
              <option>ไตรมาสนี้</option>
            </select>
            <svg className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
