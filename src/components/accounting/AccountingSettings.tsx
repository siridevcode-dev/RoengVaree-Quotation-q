"use client";

import React, { useState } from "react";

export default function AccountingSettings() {
  const [activeSection, setActiveSection] = useState("ข้อมูลกิจการ");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "ตั้งค่าองค์กร": true
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="flex h-full bg-[#F4F7FE] animate-in fade-in duration-500 overflow-hidden">
      
      {/* Left Sidebar */}
      <div className="w-[300px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-50">
          <h1 className="text-xl font-black text-[#1B2559]">ตั้งค่า</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <SettingsGroup 
            label="ข้อมูลแพ็กเกจ/ต่ออายุ" 
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            expanded={expandedGroups["ข้อมูลแพ็กเกจ"]}
            onToggle={() => toggleGroup("ข้อมูลแพ็กเกจ")}
          />
          
          <SettingsGroup 
            label="ตั้งค่าองค์กร" 
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            expanded={expandedGroups["ตั้งค่าองค์กร"]}
            onToggle={() => toggleGroup("ตั้งค่าองค์กร")}
          >
            <SettingsItem label="ข้อมูลกิจการ" active={activeSection === "ข้อมูลกิจการ"} onClick={() => setActiveSection("ข้อมูลกิจการ")} />
            <SettingsItem label="โลโก้และตราประทับ" active={activeSection === "โลโก้และตราประทับ"} onClick={() => setActiveSection("โลโก้และตราประทับ")} />
          </SettingsGroup>

          <SettingsGroup 
            label="ตั้งค่าสิทธิ์ผู้ใช้งาน" 
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            expanded={expandedGroups["ตั้งค่าสิทธิ์"]}
            onToggle={() => toggleGroup("ตั้งค่าสิทธิ์")}
          >
            <SettingsItem label="ผู้ใช้งาน" active={activeSection === "ผู้ใช้งาน"} onClick={() => setActiveSection("ผู้ใช้งาน")} />
            <SettingsItem label="สิทธิ์การใช้งาน" active={activeSection === "สิทธิ์การใช้งาน"} onClick={() => setActiveSection("สิทธิ์การใช้งาน")} />
          </SettingsGroup>

          <SettingsGroup 
            label="ตั้งค่าเอกสาร" 
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            expanded={expandedGroups["ตั้งค่าเอกสาร"]}
            onToggle={() => toggleGroup("ตั้งค่าเอกสาร")}
          >
            <SettingsItem label="เลขที่เอกสาร" active={activeSection === "เลขที่เอกสาร"} onClick={() => setActiveSection("เลขที่เอกสาร")} />
            <SettingsItem label="หมายเหตุเอกสาร" active={activeSection === "หมายเหตุเอกสาร"} onClick={() => setActiveSection("หมายเหตุเอกสาร")} />
            <SettingsItem label="วันที่ครบกำหนด" active={activeSection === "วันที่ครบกำหนด"} onClick={() => setActiveSection("วันที่ครบกำหนด")} />
            <SettingsItem label="ช่องทางการรับชำระเงิน" active={activeSection === "ช่องทางการรับชำระเงิน"} onClick={() => setActiveSection("ช่องทางการรับชำระเงิน")} />
            <SettingsItem label="กลุ่มจัดประเภท" active={activeSection === "กลุ่มจัดประเภท"} onClick={() => setActiveSection("กลุ่มจัดประเภท")} />
            <SettingsItem label="การแสดงข้อมูลสาธารณะ" active={activeSection === "การแสดงข้อมูลสาธารณะ"} onClick={() => setActiveSection("การแสดงข้อมูลสาธารณะ")} />
            <SettingsItem label="ใบกำกับภาษี" active={activeSection === "ใบกำกับภาษี"} onClick={() => setActiveSection("ใบกำกับภาษี")} isLocked />
            <SettingsItem label="รายงานเอกสาร" active={activeSection === "รายงานเอกสาร"} onClick={() => setActiveSection("รายงานเอกสาร")} />
            <SettingsItem label="บัญชีรายวัน" active={activeSection === "บัญชีรายวัน"} onClick={() => setActiveSection("บัญชีรายวัน")} />
            <SettingsItem label="ลิงก์ให้ลูกค้าขอใบกำกับภาษี" active={activeSection === "ลิงก์ให้ลูกค้าขอใบกำกับภาษี"} onClick={() => setActiveSection("ลิงก์ให้ลูกค้าขอใบกำกับภาษี")} />
          </SettingsGroup>

          <SettingsGroup 
            label="ตั้งค่านโยบายบัญชี" 
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            expanded={expandedGroups["ตั้งค่านโยบาย"]}
            onToggle={() => toggleGroup("ตั้งค่านโยบาย")}
          >
            <SettingsItem label="รายงานทางอีเมล" active={activeSection === "รายงานทางอีเมล"} onClick={() => setActiveSection("รายงานทางอีเมล")} />
            <SettingsItem label="ล็อกข้อมูลการใช้งาน" active={activeSection === "ล็อกข้อมูลการใช้งาน"} onClick={() => setActiveSection("ล็อกข้อมูลการใช้งาน")} />
            <SettingsItem label="การสร้างชื่อซ้ำ" active={activeSection === "การสร้างชื่อซ้ำ"} onClick={() => setActiveSection("การสร้างชื่อซ้ำ")} />
            <SettingsItem label="ประเภทราคา" active={activeSection === "ประเภทราคา"} onClick={() => setActiveSection("ประเภทราคา")} />
            <SettingsItem label="ผู้ติดต่อ" active={activeSection === "ผู้ติดต่อ"} onClick={() => setActiveSection("ผู้ติดต่อ")} />
            <SettingsItem label="บันทึกบัญชีรายรับ/รายจ่าย" active={activeSection === "บันทึกบัญชีรายรับ/รายจ่าย"} onClick={() => setActiveSection("บันทึกบัญชีรายรับ/รายจ่าย")} />
            <SettingsItem label="เมนูสินค้า/บริการ" active={activeSection === "เมนูสินค้า/บริการ"} onClick={() => setActiveSection("เมนูสินค้า/บริการ")} />
            <SettingsItem label="การออกเอกสารจากใบเสนอราคา" active={activeSection === "การออกเอกสารจากใบเสนอราคา"} onClick={() => setActiveSection("การออกเอกสารจากใบเสนอราคา")} />
            <SettingsItem label="การออกเอกสารจากใบสั่งซื้อ" active={activeSection === "การออกเอกสารจากใบสั่งซื้อ"} onClick={() => setActiveSection("การออกเอกสารจากใบสั่งซื้อ")} />
            <SettingsItem label="การแสดงผล Smart Insight" active={activeSection === "การแสดงผล Smart Insight"} onClick={() => setActiveSection("การแสดงผล Smart Insight")} />
          </SettingsGroup>

          <SettingsGroup 
            label="ตั้งค่าเชื่อมต่อระบบภายนอก" 
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            expanded={expandedGroups["ตั้งค่าเชื่อมต่อ"]}
            onToggle={() => toggleGroup("ตั้งค่าเชื่อมต่อ")}
          >
            <SettingsItem label="เชื่อมต่อ e-Tax Invoice" active={activeSection === "เชื่อมต่อ e-Tax Invoice"} onClick={() => setActiveSection("เชื่อมต่อ e-Tax Invoice")} />
            <SettingsItem label="เชื่อมต่อแอปพลิเคชันภายนอก" active={activeSection === "เชื่อมต่อแอปพลิเคชันภายนอก"} onClick={() => setActiveSection("เชื่อมต่อแอปพลิเคชันภายนอก")} />
          </SettingsGroup>

          <div className="py-2">
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span>ลงทะเบียนสำนักงานบัญชี</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <div className="max-w-[1000px] mx-auto space-y-8">
          
          {/* Content Header */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#4318FF]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#1B2559]">ข้อมูลกิจการ</h2>
                <p className="text-sm font-bold text-gray-400">ตั้งค่าข้อมูลพื้นฐานของกิจการ และข้อมูลที่อยู่เพื่อใช้แสดงในหน้าเอกสาร</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-100 font-bold text-sm">
                ยืนยันตัวตนกิจการ
              </button>
              <button className="px-5 py-2.5 bg-[#4318FF] text-white rounded-xl hover:bg-[#3b15e0] transition-all shadow-lg shadow-indigo-100 font-bold text-sm">
                แก้ไข
              </button>
            </div>
          </div>

          {/* Business Info Section */}
          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50">
            <div className="p-6 border-b border-gray-50 bg-[#F4F7FE]/30">
              <h3 className="text-sm font-black text-[#1B2559] uppercase tracking-wider">ข้อมูลกิจการ</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <InfoItem label="รูปแบบกิจการ" value="บุคคลธรรมดา" />
              <InfoItem label="เลข 13 หลัก" value="-" />
              <InfoItem label="สาขา" value="ไม่ระบุ" />
              <InfoItem label="ชื่อกิจการภาษาไทย" value="สิริ วัฒน" />
              <InfoItem label="ชื่อกิจการภาษาอังกฤษ" value="-" />
              <InfoItem label="คำอธิบายธุรกิจ" value="-" />
              <InfoItem label="วันที่จดทะเบียนกิจการ" value="-" />
              <InfoItem label="จดทะเบียนภาษีมูลค่าเพิ่ม" value="ไม่จดทะเบียนภาษีมูลค่าเพิ่ม" status="error" />
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50">
            <div className="p-6 border-b border-gray-50 bg-[#F4F7FE]/30">
              <h3 className="text-sm font-black text-[#1B2559] uppercase tracking-wider">ข้อมูลช่องทางการติดต่อ</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8">
              <InfoItem label="เบอร์โทร" value="-" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} />
              <InfoItem label="อีเมลกลาง" value="-" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
              <InfoItem label="เบอร์แฟกซ์" value="-" />
              <InfoItem label="เว็บไซต์" value="-" />
              <InfoItem label="LINE" value="-" />
            </div>
          </div>

          {/* Address Info Section */}
          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50">
            <div className="p-6 border-b border-gray-50 bg-[#F4F7FE]/30">
              <h3 className="text-sm font-black text-[#1B2559] uppercase tracking-wider">ข้อมูลที่อยู่กิจการ</h3>
            </div>
            <div className="p-8 space-y-10">
              <InfoItem label="ที่อยู่ตามทะเบียนภาษาไทย" value="-" isFull />
              <InfoItem label="ที่อยู่ตามทะเบียนภาษาอังกฤษ" value="-" isFull />
              <InfoItem label="ที่อยู่ส่งเอกสาร" value="-" isFull />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="flex justify-start pt-4 pb-12">
            <button className="flex items-center gap-2 px-6 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-black text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              ลบกิจการ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function SettingsGroup({ label, icon, expanded, onToggle, children }: { label: string, icon: React.ReactNode, expanded: boolean, onToggle: () => void, children?: React.ReactNode }) {
  return (
    <div className="py-1">
      <button 
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
          expanded ? "bg-[#F4F7FE] text-[#1B2559]" : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`${expanded ? "text-[#4318FF]" : "text-gray-400"}`}>{icon}</div>
          <span className={`text-sm tracking-tight ${expanded ? "font-black" : "font-bold"}`}>{label}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180 text-[#4318FF]" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && children && (
        <div className="mt-1 space-y-0.5 ml-9 animate-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

function SettingsItem({ label, active, onClick, isLocked }: { label: string, active: boolean, onClick: () => void, isLocked?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all relative flex items-center justify-between ${
        active 
          ? "text-[#4318FF] font-black" 
          : "text-gray-400 font-bold hover:text-gray-600"
      }`}
    >
      <div className="flex items-center gap-2">
        {isLocked && (
          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        <span>{label}</span>
      </div>
      {active && (
        <div className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#4318FF] rounded-full shadow-[0_0_8px_rgba(67,24,255,0.4)]" />
      )}
    </button>
  );
}

function InfoItem({ label, value, status, icon, isFull }: { label: string, value: string, status?: 'error' | 'success', icon?: React.ReactNode, isFull?: boolean }) {
  return (
    <div className={`${isFull ? "w-full" : ""}`}>
      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">{label}</label>
      <div className="flex items-center gap-2">
        {icon && <div className="text-gray-400">{icon}</div>}
        <span className={`text-sm font-bold ${
          status === 'error' ? "text-rose-500 flex items-center gap-2" : "text-[#1B2559]"
        }`}>
          {status === 'error' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {value}
        </span>
      </div>
    </div>
  );
}
