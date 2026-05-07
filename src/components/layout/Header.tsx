"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

interface HeaderProps {
  activePage: string;
  onNavigate?: (page: string) => void;
  onMobileMenuToggle?: () => void;
}

const pageLabels: Record<string, string> = {
  "Dashboard": "แดชบอร์ดฝ่ายบุคคล",
  "แดชบอร์ด": "แดชบอร์ดฝ่ายบุคคล",
  "แดชบอร์ดฝ่ายขาย": "แดชบอร์ดฝ่ายบุคคล",
  "Select Products": "สร้างใบเสนอราคา",
  "สร้างใบเสนอราคา": "สร้างใบเสนอราคา",
  "Quotation Form": "ใบเสนอราคา",
  "Quotations": "รายการใบเสนอราคา",
  "รายการใบเสนอราคา": "รายการใบเสนอราคา",
  "Customers": "ลูกค้า",
  "ลูกค้า": "ลูกค้า",
  "Products": "สินค้า & บริการ",
  "สินค้า & บริการ": "สินค้า & บริการ",
  "Production costs": "ต้นทุนการผลิต",
  "ต้นทุนการผลิต": "ต้นทุนการผลิต",
  "PR / PO": "ใบขอซื้อ / ใบสั่งซื้อ",

  // Accounting / Sales Sub-items
  "ดูภาพรวม": "ดูภาพรวม",
  "ใบเสนอราคา": "ใบเสนอราคา",
  "ใบแจ้งหนี้ (ใบส่งของ, บันทึกลูกหนี้)": "ใบแจ้งหนี้",
  "ใบเสร็จรับเงิน": "ใบเสร็จรับเงิน",
  "ใบกำกับภาษีขาย": "ใบกำกับภาษีขาย",
  "บันทึกซื้อสินค้า": "บันทึกซื้อสินค้า",
  "บันทึกค่าใช้จ่าย": "บันทึกค่าใช้จ่าย",
  "ใบสั่งซื้อสินทรัพย์": "ใบสั่งซื้อสินทรัพย์",
  "ซื้อสินทรัพย์": "ซื้อสินทรัพย์",
  "ใบกำกับภาษีซื้อ": "ใบกำกับภาษีซื้อ",
  "ผังบัญชี": "ผังบัญชี",
  "รูปแบบใบเสนอราคา": "รูปแบบใบเสนอราคา",
  "รูปแบบใบเสนอราคา รูปแบบเก่า": "รูปแบบใบเสนอราคา (เก่า)",

  // HR Section
  "แดชบอร์ดฝ่ายบุคคล": "แดชบอร์ดฝ่ายบุคคล",
  "Employee Management": "จัดการพนักงาน",
  "จัดการพนักงาน": "จัดการพนักงาน",
  "พนักงาน": "จัดการพนักงาน",
  "อนุมัติ": "อนุมัติคำขอ",
  "ค่าใช้จ่าย & เบิกเงิน": "ค่าใช้จ่าย & เบิกเงิน",
  "เงินเดือน": "บริหารจัดการเงินเดือน",
  "มอบหมายงาน": "มอบหมายงาน",
  "ประกาศ": "ประกาศประชาสัมพันธ์",
  "กิจกรรม": "กิจกรรมพนักงาน",
  "Payroll": "สรุปเงินเดือน",
  "สรุปเงินเดือน": "สรุปเงินเดือน",
  "Attendance": "บันทึกเวลา",
  "บันทึกเวลา": "บันทึกเวลา",
  "รายชื่อพนักงาน": "รายชื่อพนักงาน",
  "บันทึกเวลาเข้างาน": "บันทึกเวลาเข้างาน",
  "เข้างาน": "เข้างาน",
  "คำขอ": "คำขอ",
  "งานของฉัน": "งานของฉัน",
  "รายงานฝ่ายบุคคล": "รายงาน",
  "ตั้งค่าฝ่ายบุคคล": "ตั้งค่า",

  "Reports": "รายงาน",
  "รายงาน": "รายงาน",
  "Quotation Templates": "รูปแบบเอกสาร",
  "รูปแบบเอกสาร": "รูปแบบเอกสาร",
  "Settings": "ตั้งค่าโปรไฟล์",
  "ตั้งค่า": "ตั้งค่าโปรไฟล์",
  "ตั้งค่าโปรไฟล์": "ตั้งค่าโปรไฟล์",
  "ตั้งค่าการขาย": "ตั้งค่าการขาย",
  "ตั้งค่า (บัญชี)": "ตั้งค่า (บัญชี)",
  "Members": "สมาชิก",
  "สมาชิก": "สมาชิก",
  "ประวัติการใช้งาน": "ประวัติการใช้งาน",
  "ประวัติใช้งาน": "ประวัติการใช้งาน",
};

export default function Header({ activePage, onNavigate, onMobileMenuToggle }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { settings, logout, currentUser, setActivityDrawerOpen } = useAppContext();
  const profileName = currentUser?.name || settings?.profile?.name || "User";
  const profileInitial = profileName.charAt(0).toUpperCase();
  const displayPage = pageLabels[activePage] || activePage;

  const handleNavigate = (page: string) => {
    setProfileOpen(false);
    if (onNavigate) onNavigate(page);
  };

  return (
    <header
      id="header"
      className="h-14 md:h-[60px] bg-white/90 backdrop-blur-sm border-b border-gray-200/80 flex items-center relative z-30 print:hidden flex-shrink-0 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]"
    >
      <div className="w-full flex items-center justify-between px-3 md:px-5">
        {/* Left: hamburger + breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger - mobile */}
          <button
            onClick={onMobileMenuToggle}
            title="เปิดเมนูข้าง"
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors md:hidden flex-shrink-0 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden md:block text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
            </span>
            <span className="hidden md:block text-gray-300 text-xs">/</span>
            <span
              className="font-semibold text-sm truncate text-[#283583]"
            >
              {displayPage}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          {/* History button */}
          {!["รายชื่อพนักงาน", "โครงสร้างองค์กร", "สัญญาจ้าง", "สรุปเงินเดือน", "รายการจ่ายเงิน", "ประกันสังคม/ภาษี", "บันทึกเวลาเข้างาน", "จัดการวันลา", "ตารางเวร/กะ", "จัดการพนักงาน", "บันทึกเวลา", "โปรไฟล์", "เข้างาน", "คำขอ", "งานของฉัน", "แดชบอร์ดฝ่ายบุคคล", "พนักงาน", "อนุมัติ", "ค่าใช้จ่าย & เบิกเงิน", "เงินเดือน", "มอบหมายงาน", "รายงาน", "รายงานฝ่ายบุคคล", "ตั้งค่าฝ่ายบุคคล", "ประกาศ", "กิจกรรม"].includes(activePage) && (
            <button 
              onClick={() => setActivityDrawerOpen(true)}
              title="ประวัติการใช้งาน"
              className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-all active:scale-95"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}

          {/* Notification bell */}
          <button 
            title="การแจ้งเตือน"
            className="relative w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all active:scale-95"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden md:block mx-1" />

          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              title="เมนูโปรไฟล์"
              className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0 bg-gradient-to-br from-[#283583] to-[#4f46e5]"
              >
                {profileInitial}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[13px] font-semibold text-gray-800 leading-none">{profileName}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
                  {currentUser?.role === "Admin" ? "ผู้ดูแลระบบ" : (currentUser?.role || "ผู้ใช้งาน")}
                </p>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden md:block ${profileOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-scale-in">
                  {/* Profile header */}
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{profileName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {currentUser?.role === "Admin" ? "ผู้ดูแลระบบ" : (currentUser?.role || "ผู้ใช้งาน")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate("ตั้งค่าโปรไฟล์")}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ตั้งค่าบัญชี
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    ออกจากระบบ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
