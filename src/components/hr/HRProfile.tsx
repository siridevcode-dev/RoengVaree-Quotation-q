"use client";

import { useState } from "react";
import ThaiAddressSelects from "../shared/ThaiAddressSelects";

export default function HRProfile() {
  const [activeTab, setActiveTab] = useState("ข้อมูลส่วนตัว");
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    subDistrict: "",
    zipCode: "",
    address: "",
    phone: "015-326-1788",
    email: "titi.tana@gmail.com",
    lineId: "-"
  });

  const tabs = [
    "ข้อมูลส่วนตัว",
    "ข้อมูลการจ้างงาน",
    "ข้อมูลติดต่อ",
    "สลิปเงินเดือน",
    "ข้อมูลเงินเดือน",
    "ประกันสังคม",
    "สิทธิลดหย่อนภาษี",
    "หนังสือเตือน",
    "โควตาวันลา",
    "ครอบครัว",
    "ประสบการณ์การทำงาน",
    "การศึกษา",
    "ตั้งค่าบัญชี",
    "เอกสาร",
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-200/60 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 tracking-tight">โปรไฟล์</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[14px] font-bold text-slate-800">ฐิติยา พาลุเวช (เจ้าของบริษัท)</p>
            <p className="text-[12px] font-medium text-slate-500">กรรมการผู้จัดการ</p>
          </div>
          <img
            src="https://i.pravatar.cc/150?u=2400001"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
          />
          <button title="เมนูผู้ใช้" className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Employee Summary Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/150?u=2400001"
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-slate-50 shadow-sm object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-[16px] font-black text-slate-800">ฐิติยา พาลุเวช (เจ้าของบริษัท)</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium text-slate-500">
                <span className="flex items-center gap-1"><span className="text-slate-400">#</span> 2400001</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> กรรมการผู้จัดการ</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> ฝ่าย ขาย</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> titi.tana@gmail.com</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> 015-326-1788</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ตั้งค่าบัญชี
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto custom-scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-[14px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#00B2FF] text-[#00B2FF]"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "ข้อมูลส่วนตัว" && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Panel */}
            <div className="w-full lg:w-[320px] shrink-0 space-y-6">
              {/* Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center relative">
                <span className="absolute top-4 left-4 text-[12px] font-medium text-slate-400">2400001</span>
                <div className="relative mb-4">
                  <img
                    src="https://i.pravatar.cc/150?u=2400001"
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover"
                  />
                  <button title="เปลี่ยนรูปโปรไฟล์" className="absolute bottom-0 right-0 w-8 h-8 bg-[#00B2FF] text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white hover:bg-blue-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                </div>
                <h3 className="text-[16px] font-black text-slate-800 mb-1">ฐิติยา พาลุเวช (เจ้าของบริษัท)</h3>
                <p className="text-[13px] font-medium text-slate-500">กรรมการผู้จัดการ</p>
              </div>

              {/* Contact Info List */}
              <div className="space-y-4">
                <h4 className="text-[15px] font-black text-slate-800">ข้อมูลติดต่อ</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    titi.tana@gmail.com
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    015-326-1788
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                    <svg className="w-4 h-4 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.901 8.868 9.381 9.615.39.085.918.258 1.054.595.122.302.079.773.038 1.082l-.164 1.02c-.045.301-.24.966.845.508 1.084-.457 5.86-3.454 8.286-6.136 1.684-1.854 2.56-4.148 2.56-6.684zm-15.006 4.39h-2.522c-.394 0-.712-.318-.712-.712v-6.353c0-.394.318-.712.712-.712.395 0 .713.318.713.712v5.641h1.809c.395 0 .713.318.713.712 0 .394-.318.712-.713.712zm3.842 0h-1.425c-.395 0-.713-.318-.713-.712v-6.353c0-.394.318-.712.713-.712h1.425c.395 0 .713.318.713.712v6.353c0 .394-.318.712-.713.712zm6.273 0h-1.425c-.177 0-.348-.066-.477-.184l-2.071-2.483v2.327c0 .394-.318.712-.713.712-.395 0-.713-.318-.713-.712v-6.353c0-.394.318-.712.713-.712.176 0 .348.066.476.184l2.072 2.484v-2.328c0-.394.318-.712.713-.712.395 0 .713.318.713.712v6.353c0 .394-.318.712-.713.712z"/></svg>
                    -
                  </div>
                </div>
              </div>

              {/* Employee Info List */}
              <div className="space-y-4">
                <h4 className="text-[15px] font-black text-slate-800">ข้อมูลพนักงาน</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">บริษัท</span>
                    <span className="text-[13px] font-bold text-slate-700">บริษัท เอชอาร์ ซอฟต์ จำกัด</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">แผนก</span>
                    <span className="text-[13px] font-bold text-slate-700">ขาย</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">วันเริ่มงาน</span>
                    <span className="text-[13px] font-bold text-slate-700">12/02/2567 (2 ปี 2 เดือน)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">สถานะพนักงาน</span>
                    <span className="text-[13px] font-bold text-slate-700">บรรจุ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">ประเภทการจ้าง</span>
                    <span className="text-[13px] font-bold text-slate-700">ประจำ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">ผู้บังคับบัญชา</span>
                    <span className="text-[13px] font-bold text-slate-700">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">กะการทำงาน</span>
                    <span className="text-[13px] font-bold text-slate-700">08:00 - 17:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">เลขบัตรประชาชน</span>
                    <span className="text-[13px] font-bold text-slate-700">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">วันเกิด</span>
                    <span className="text-[13px] font-bold text-slate-700">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-400">วันเริ่มต้นใช้งาน</span>
                    <span className="text-[13px] font-bold text-slate-700">12/02/2567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Edit Form */}
            <div className="flex-1 space-y-8">
              {/* General Info */}
              <div className="space-y-4">
                <h4 className="text-[16px] font-black text-slate-800">ข้อมูลทั่วไป</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 w-full md:w-[240px]">
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">คำนำหน้า <span className="text-red-500">*</span></label>
                    <select title="คำนำหน้า" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all">
                      <option>นาย</option>
                      <option>นางสาว</option>
                      <option>นาง</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">ชื่อ <span className="text-red-500">*</span></label>
                    <input type="text" title="ชื่อ" defaultValue="ฐิติยา" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">นามสกุล <span className="text-red-500">*</span></label>
                    <input type="text" title="นามสกุล" defaultValue="พาลุเวช (เจ้าของบริษัท)" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">ชื่อ (EN)</label>
                    <input type="text" title="ชื่อ (ภาษาอังกฤษ)" defaultValue="" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">นามสกุล (EN)</label>
                    <input type="text" title="นามสกุล (ภาษาอังกฤษ)" defaultValue="" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">ชื่อเล่น</label>
                    <input type="text" title="ชื่อเล่น" defaultValue="" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">ชื่อเล่น (EN)</label>
                    <input type="text" title="ชื่อเล่น (ภาษาอังกฤษ)" defaultValue="" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  
                  <div className="md:col-span-2 w-full md:w-[240px]">
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">วันเกิด</label>
                    <div className="relative">
                      <input type="text" defaultValue="" placeholder="วันเกิด" title="วันเกิด" className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                      <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Type and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[14px] font-black text-slate-800 mb-2">ประเภท <span className="text-red-500">*</span></h4>
                  <div className="flex bg-white border border-slate-200 rounded-lg p-1 w-fit">
                    <button className="px-4 py-1.5 rounded-md text-[13px] font-bold bg-[#E6F7FF] text-[#00B2FF]">คนไทย</button>
                    <button className="px-4 py-1.5 rounded-md text-[13px] font-bold text-slate-500 hover:bg-slate-50">ต่างชาติ</button>
                  </div>
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-slate-800 mb-2">เพศ <span className="text-red-500">*</span></h4>
                  <div className="flex bg-white border border-slate-200 rounded-lg p-1 w-fit">
                    <button className="px-4 py-1.5 rounded-md text-[13px] font-bold text-slate-500 hover:bg-slate-50">ชาย</button>
                    <button className="px-4 py-1.5 rounded-md text-[13px] font-bold text-slate-500 hover:bg-slate-50">หญิง</button>
                    <button className="px-4 py-1.5 rounded-md text-[13px] font-bold bg-[#E6F7FF] text-[#00B2FF]">อื่นๆ</button>
                  </div>
                </div>
              </div>

              {/* ID Card */}
              <div>
                <label className="block text-[12px] font-medium text-slate-400 mb-1">เลขบัตรประชาชน</label>
                <input type="text" defaultValue="" title="เลขบัตรประชาชน" placeholder="เลขบัตรประชาชน" className="w-full md:w-[320px] bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="text-[16px] font-black text-slate-800">ข้อมูลส่วนตัว</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">เชื้อชาติ</label>
                    <select title="เชื้อชาติ" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all">
                      <option>ไทย</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">สัญชาติ</label>
                    <select title="สัญชาติ" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all">
                      <option>ไทย</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">ศาสนา</label>
                    <select title="ศาสนา" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all">
                      <option>พุทธ</option>
                      <option>คริสต์</option>
                      <option>อิสลาม</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">กรุ๊ปเลือด</label>
                    <select title="กรุ๊ปเลือด" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all">
                      <option>โอ</option>
                      <option>เอ</option>
                      <option>บี</option>
                      <option>เอบี</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">สถานะภาพเกณฑ์ทหาร</label>
                    <select title="สถานะภาพเกณฑ์ทหาร" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all">
                      <option>ได้รับการยกเว้น</option>
                      <option>ผ่านการเกณฑ์ทหารแล้ว</option>
                      <option>ยังไม่ผ่านการเกณฑ์ทหาร</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">สถานะภาพสมรส</label>
                    <select title="สถานะภาพสมรส" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all">
                      <option>โสด</option>
                      <option>สมรส</option>
                      <option>หย่าร้าง</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">น้ำหนัก</label>
                    <input type="text" title="น้ำหนัก" defaultValue="0" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">ส่วนสูง</label>
                    <input type="text" title="ส่วนสูง" defaultValue="0" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-[12px] font-medium text-slate-400 mb-1">หมายเหตุ</label>
                    <textarea rows={6} title="หมายเหตุ" placeholder="หมายเหตุ" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ข้อมูลติดต่อ" && (
          <div className="bg-white rounded-2xl p-8 max-w-4xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-[18px] font-black text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00B2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ข้อมูลติดต่อและที่อยู่
            </h4>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    title="เบอร์โทรศัพท์"
                    placeholder="0xx-xxx-xxxx"
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">อีเมลส่วนตัว</label>
                  <input 
                    type="email" 
                    title="อีเมลส่วนตัว"
                    placeholder="example@email.com"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Line ID</label>
                  <input 
                    type="text" 
                    title="Line ID"
                    placeholder="Line ID"
                    value={formData.lineId} 
                    onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <label className="block text-[12px] font-medium text-slate-400 mb-1.5">ที่อยู่ปัจจุบัน <span className="text-red-500">*</span></label>
                <textarea 
                  rows={2} 
                  title="ที่อยู่ปัจจุบัน"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="บ้านเลขที่, ถนน, ซอย..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all resize-none mb-4"
                ></textarea>

                <ThaiAddressSelects 
                  province={formData.province}
                  district={formData.district}
                  subDistrict={formData.subDistrict}
                  zipCode={formData.zipCode}
                  onProvinceChange={(v) => setFormData({ ...formData, province: v })}
                  onDistrictChange={(v) => setFormData({ ...formData, district: v })}
                  onSubDistrictChange={(v) => setFormData({ ...formData, subDistrict: v })}
                  onZipCodeChange={(v) => setFormData({ ...formData, zipCode: v })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white px-8 py-4 border-t border-slate-200 flex justify-between items-center z-30">
        <button title="ลบข้อมูล" className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-lg text-[14px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            ยกเลิก
          </button>
          <button className="px-8 py-2 rounded-lg text-[14px] font-bold text-white bg-[#D6EFFF] text-[#00B2FF] hover:bg-[#00B2FF] hover:text-white transition-colors shadow-sm">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
