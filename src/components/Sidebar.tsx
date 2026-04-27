"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navGroups = [
  {
    title: null,
    items: [
      {
        label: "แดชบอร์ด",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
          </svg>
        ),
      }
    ]
  },
  {
    title: "Sales",
    items: [
      {
        label: "สร้างใบเสนอราคา",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
      {
        label: "รายการใบเสนอราคา",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: "ลูกค้า",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        label: "สินค้า",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
      {
        label: "ต้นทุนการผลิต",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        label: "รายงาน",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        subItems: [
          { label: "รายงาน" },
          { label: "รายงาน ผู้ติดต่อ" },
        ]
      },
      {
        label: "รูปแบบใบเสนอราคา",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
        subItems: [
          { label: "รูปแบบใบเสนอราคา" },
          { label: "รูปแบบใบเสนอราคา รูปแบบเก่า" },
        ]
      },
      {
        label: "Settings",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      }
    ]
  },
  {
    title: "Production Costs",
    items: [
      {
        label: "แผนการผลิต",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
      {
        label: "บันทึกการผลิต",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        label: "รายงานการผลิต",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-4m3 2v-6m0 10H4.6a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v11a2 2 0 01-2 2z" />
          </svg>
        ),
      }
    ]
  },
  {
    title: "Accounting",
    items: [
      {
        label: "หน้าหลัก (บัญชี)",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
          </svg>
        ),
      },
      {
        label: "รายรับ",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
        subItems: [
          { label: "ดูภาพรวม" },
          { label: "ใบเสนอราคา" },
          { label: "ใบแจ้งหนี้ (ใบส่งของ, บันทึกลูกหนี้)" },
          { label: "ใบเสร็จรับเงิน" },
          { label: "ใบกำกับภาษีขาย" },
          { label: "ขยายดูเมนูเพิ่มเติม", isToggle: true },
          { label: "ใบรับเงินมัดจำ", isExtra: true },
          { label: "ใบลดหนี้", isExtra: true },
          { label: "ใบเพิ่มหนี้", isExtra: true },
          { label: "ใบวางบิล", isExtra: true },
          { label: "นำเข้าเอกสาร", isExtra: true },
        ]
      },
      {
        label: "รายจ่าย",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        ),
        subItems: [
          { label: "ดูภาพรวม" },
          { label: "บันทึกซื้อสินค้า" },
          { label: "บันทึกค่าใช้จ่าย" },
          { label: "ใบสั่งซื้อสินทรัพย์" },
          { label: "ซื้อสินทรัพย์" },
          { label: "ใบกำกับภาษีซื้อ" },
          { label: "ขยายดูเมนูเพิ่มเติม", isToggle: true },
          { label: "ใบสั่งซื้อ", isExtra: true },
          { label: "ใบจ่ายเงินมัดจำ", isExtra: true },
          { label: "รับใบลดหนี้", isExtra: true },
          { label: "รับใบเพิ่มหนี้", isExtra: true },
          { label: "ใบรวมจ่าย", isExtra: true },
          { label: "นำเข้าเอกสาร", isExtra: true },
        ]
      },
      {
        label: "ผู้ติดต่อ",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        label: "จัดการสินค้า",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
      {
        label: "การเงิน",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
      {
        label: "บัญชี",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        subItems: [
          { label: "บัญชีรายวัน" },
          { label: "บัญชีแยกประเภท" },
          { label: "งบทดลอง" },
          { label: "งบฐานะการเงิน" },
          { label: "งบกำไรขาดทุน" },
          { label: "ขยายดูเมนูเพิ่มเติม", isToggle: true },
          { label: "ผังบัญชี", isExtra: true },
          { label: "งบกระแสเงินสด", isExtra: true },
          { label: "DBD e-Filing", isExtra: true },
          { label: "สินทรัพย์", isExtra: true },
        ]
      },
      {
        label: "คลังเอกสาร",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        ),
      },
      {
        label: "ตั้งค่า",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      }
    ]
  },
  {
    title: "System",
    items: [
      {
        label: "สมาชิก",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        label: "ประวัติใช้งาน",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      }
    ]
  }
];

export default function Sidebar({ activePage, onPageChange, mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Sales: false,
    Purchasing: false,
    Accounting: false,
    System: false
  });
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showExtraRevenue, setShowExtraRevenue] = useState(false);
  const [showExtraExpenses, setShowExtraExpenses] = useState(false);
  const [showExtraAccounting, setShowExtraAccounting] = useState(false);
  const { currentUser, setActiveLayout } = useAppContext();

  const handleNavClick = (item: any) => {
    if (item.subItems) {
      setExpandedItems(prev => ({ ...prev, [item.label]: !prev[item.label] }));
      if (item.label === "รายรับ") {
        onPageChange("Revenue Overview");
      } else if (item.label === "รายจ่าย") {
        onPageChange("Expense Overview");
      } else if (item.label === "บัญชี") {
        onPageChange("Chart of Accounts");
      }
      return;
    }
    const label = typeof item === 'string' ? item : item.label;

    // Handle layout switching for quotations
    if (label.includes("รูปแบบเก่า")) {
      setActiveLayout("classic");
    } else if (label.includes("รูปแบบใบเสนอราคา")) {
      setActiveLayout("premium");
    }
    
    // Mapping sub-items to specific internal names if needed
    let targetPage = label;
    if (label === "ดูภาพรวม") {
      // Find parent section
      const revenueSection = navGroups.find(g => g.title === "Accounting")?.items.find(i => i.label === "รายรับ") as any;
      const expenseSection = navGroups.find(g => g.title === "Accounting")?.items.find(i => i.label === "รายจ่าย") as any;
      
      if (revenueSection?.subItems?.some((s: any) => s.label === label) && expandedItems["รายรับ"]) {
        targetPage = "Revenue Overview";
      } else if (expenseSection?.subItems?.some((s: any) => s.label === label) && expandedItems["รายจ่าย"]) {
        targetPage = "Expense Overview";
      } else if (label === "ผังบัญชี") {
        targetPage = "Chart of Accounts";
      }
    }

    onPageChange(targetPage === "สร้างใบเสนอราคา" ? "Select Products" : targetPage);
    if (onMobileClose) onMobileClose();
  };

  const isActive = (label: string) =>
    activePage === label || (label === "สร้างใบเสนอราคา" && activePage === "Select Products");

  const toggleSection = (title: string) => {
    setExpandedSections((prev: Record<string, boolean>) => ({ ...prev, [title]: !prev[title] }));
  };

  // Auto-expand section containing active page
  useEffect(() => {
    navGroups.forEach(group => {
      if (group.title && group.items.some(item => isActive(item.label))) {
        setExpandedSections((prev: Record<string, boolean>) => ({ ...prev, [group.title as string]: true }));
      }
    });
  }, [activePage]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-[68px] border-b border-gray-100/80 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[15px] font-black tracking-wide truncate text-[#283583]">
                ROENGVAREE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mt-0.5">
                Speed Boat
              </span>
            </div>
          )}
        </div>
        {/* Collapse button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 hidden md:flex"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Close - mobile only */}
        <button
          onClick={onMobileClose}
          title="ปิดเมนู"
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors md:hidden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, gIdx) => {
          const isExpanded = group.title ? expandedSections[group.title] : true;
          
          return (
            <div key={group.title || `general-${gIdx}`} className="space-y-0.5">
              {group.title && (!collapsed || mobileOpen) && (
                <button
                  onClick={() => toggleSection(group.title!)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 group/head rounded-xl transition-all duration-200 ${
                    isExpanded ? "bg-[#eef2ff] mb-1 mt-1 shadow-sm" : "hover:bg-gray-50 pt-4 pb-2"
                  }`}
                >
                  <span className={`text-[15px] font-black uppercase tracking-[0.12em] transition-colors ${
                    isExpanded ? "text-[#283583]" : "text-[#6A789A] group-hover/head:text-[#283583]"
                  }`}>
                    {group.title}
                  </span>
                  <svg 
                    className={`w-3 h-3 transition-all duration-300 ${
                      isExpanded ? "text-[#283583] rotate-180" : "text-[#283583]/30 group-hover/head:text-[#283583]/60"
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              
              <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}>
                <div className={`overflow-hidden space-y-0.5 ${group.title ? "bg-[#f4f7fa] rounded-xl p-1.5 mb-1" : ""}`}>
                  {group.items.map((item: any) => {
                    const active = isActive(item.label);
                    const isItemExpanded = expandedItems[item.label];
                    
                    return (
                      <div key={item.label} className="space-y-0.5">
                        <button
                          onClick={() => handleNavClick(item)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                            active
                              ? "text-white shadow-md bg-gradient-to-br from-[#283583] to-[#3b4ba4] shadow-[0_4px_12px_rgba(40,53,131,0.25)]"
                              : group.title 
                                  ? "text-gray-600 hover:bg-white hover:shadow-sm hover:text-gray-900" 
                                  : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                          }`}
                          title={collapsed && !mobileOpen ? item.label : undefined}
                        >
                          <div className="flex items-center gap-3">
                            {/* Active indicator bar */}
                            {!active && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-indigo-500 rounded-r transition-all duration-200 group-hover:h-5" />
                            )}
                            <span className={`flex-shrink-0 transition-colors ${active ? "text-white" : "text-gray-500 group-hover:text-gray-800"}`}>
                              {item.icon}
                            </span>
                            {(!collapsed || mobileOpen) && (
                              <span className={`whitespace-nowrap tracking-[-0.01em] ${
                                item.label === "Dashboard" ? "text-[18px] font-bold" : "text-[15px] font-semibold"
                              }`}>
                                {item.label}
                              </span>
                            )}
                          </div>
                          
                          {item.subItems && (!collapsed || mobileOpen) && (
                            <svg 
                              className={`w-3.5 h-3.5 transition-transform duration-300 ${isItemExpanded ? "rotate-180" : ""}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* Sub Items */}
                        {item.subItems && isItemExpanded && (!collapsed || mobileOpen) && (
                          <div className="ml-4 pl-4 border-l border-gray-200 space-y-0.5 mt-1 mb-2 animate-slide-down">
                            {item.subItems.map((sub: any) => {
                              let isShowingExtra = false;
                              if (item.label === "รายรับ") isShowingExtra = showExtraRevenue;
                              else if (item.label === "รายจ่าย") isShowingExtra = showExtraExpenses;
                              else if (item.label === "บัญชี") isShowingExtra = showExtraAccounting;
                              
                              if (sub.isExtra && !isShowingExtra) return null;
                              
                              if (sub.isToggle) {
                                return (
                                  <div key={sub.label} className="py-1">
                                    <div className="h-px bg-gray-100 my-1 -ml-4" />
                                    <button
                                      onClick={() => {
                                        if (item.label === "รายรับ") setShowExtraRevenue(!showExtraRevenue);
                                        else if (item.label === "รายจ่าย") setShowExtraExpenses(!showExtraExpenses);
                                        else if (item.label === "บัญชี") setShowExtraAccounting(!showExtraAccounting);
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#283583] hover:bg-[#eef2ff] transition-all group/sub"
                                    >
                                      <div className="flex items-center gap-2">
                                        <svg 
                                          className={`w-4 h-4 transition-transform duration-300 ${isShowingExtra ? "rotate-180" : ""}`}
                                          fill="none" 
                                          stroke="currentColor" 
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 15l-7-7-7 7" />
                                        </svg>
                                        <span className="text-[14px] font-black">{sub.label}</span>
                                      </div>
                                    </button>
                                    {!isShowingExtra && <div className="h-px bg-gray-100 my-1 -ml-4" />}
                                  </div>
                                );
                              }

                              const subActive = activePage === sub.label;
                              return (
                                <button
                                  key={sub.label}
                                  onClick={() => handleNavClick(sub)}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group/sub ${
                                    subActive ? "bg-[#eef2ff] text-[#283583] font-bold" : "text-gray-600 hover:bg-white hover:text-gray-900"
                                  } ${sub.label === "นำเข้าเอกสาร" ? "bg-gray-50/50 mt-1" : ""}`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {sub.icon && (
                                      <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center flex-shrink-0 shadow-sm">
                                        {sub.icon}
                                      </div>
                                    )}
                                    <span className="text-[14px] font-semibold truncate leading-tight">{sub.label}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    {sub.badge && (
                                      <span className="px-1.5 py-0.5 text-[#ff8a65] text-[10px] font-bold rounded uppercase">
                                        {sub.badge}
                                      </span>
                                    )}
                                    {!sub.icon && sub.label !== "ดูภาพรวม" && (
                                      <svg className="w-3.5 h-3.5 text-gray-300 group-hover/sub:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom badge */}
      {(!collapsed || mobileOpen) && (
        <div className="p-3 border-t border-gray-100/80 flex-shrink-0">
          <div className="rounded-xl p-3 flex items-center gap-2.5 bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff]">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#283583] to-[#4f46e5]">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-indigo-800 leading-none">Enterprise Edition</p>
              <p className="text-[11px] text-indigo-500 mt-0.5">Active License</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        id="sidebar"
        className={`${
          collapsed ? "w-[68px]" : "w-[260px]"
        } h-full bg-white border-r border-gray-200/80 flex-col transition-all duration-300 ease-in-out flex-shrink-0 print:hidden hidden md:flex`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-white shadow-2xl flex flex-col animate-slide-in-left">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
