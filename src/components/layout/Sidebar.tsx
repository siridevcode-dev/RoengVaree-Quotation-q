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
    title: "ฝ่ายบุคคล",
    items: [
      {
        label: "แดชบอร์ดฝ่ายบุคคล",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        label: "พนักงาน",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        ),
      },
      {
        label: "อนุมัติ",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
      },
      {
        label: "ค่าใช้จ่าย & เบิกเงิน",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
      {
        label: "เงินเดือน",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        label: "มอบหมายงาน",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
      {
        label: "รายงาน",
        page: "รายงานฝ่ายบุคคล",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        label: "ประกาศ",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.297A1.705 1.705 0 019.297 21h-.594A1.705 1.705 0 017 19.297V5.882c0-1.026.834-1.882 1.882-1.882h.412c1.048 0 1.882.856 1.882 1.882zM11 5.882c0-1.026.834-1.882 1.882-1.882h.412c1.048 0 1.882.856 1.882 1.882v13.415c0 1.026-.834 1.882-1.882 1.882h-.412c-1.048 0-1.882-.856-1.882-1.882V5.882zM15.5 14h.5a2 2 0 002-2V8a2 2 0 00-2-2h-.5" />
          </svg>
        ),
      },
      {
        label: "ตั้งค่า",
        page: "ตั้งค่าฝ่ายบุคคล",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        label: "กิจกรรม",
        icon: (
          <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        ),
      }
    ]
  }
];

export default function Sidebar({ activePage, onPageChange, mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"me" | "team">("team");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "ฝ่ายบุคคล": true
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
    } else if (label.includes("รูปแบบใบเสนอราคา") || label === "รูปแบบเอกสาร") {
      setActiveLayout("premium");
    }
    
    // Mapping sub-items to specific internal names if needed
    let targetPage = label;
    if (label === "ดูภาพรวม") {
      // Find parent section
      const revenueSection = navGroups.find(g => g.title === "บัญชี")?.items.find(i => i.label === "รายรับ") as any;
      const expenseSection = navGroups.find(g => g.title === "บัญชี")?.items.find(i => i.label === "รายจ่าย") as any;
      
      if (revenueSection?.subItems?.some((s: any) => s.label === label) && expandedItems["รายรับ"]) {
        targetPage = "Revenue Overview";
      } else if (expenseSection?.subItems?.some((s: any) => s.label === label) && expandedItems["รายจ่าย"]) {
        targetPage = "Expense Overview";
      } else if (label === "ผังบัญชี") {
        targetPage = "Chart of Accounts";
      }
    }

    onPageChange(
      item.page ? item.page : (targetPage === "สร้างใบเสนอราคา" || targetPage === "Create Quotation" 
        ? "Select Products" 
        : targetPage)
    );
    if (onMobileClose) onMobileClose();
  };

  const isActive = (item: any) => {
    const page = item.page || item.label;
    return activePage === page || 
    (item.label === "แดชบอร์ด" && activePage === "Dashboard") ||
    (item.label === "สร้างใบเสนอราคา" && activePage === "Select Products");
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev: Record<string, boolean>) => ({ ...prev, [title]: !prev[title] }));
  };

  // Auto-expand section containing active page
  useEffect(() => {
    navGroups.forEach(group => {
      if (group.title && group.items.some(item => isActive(item))) {
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

  const meItems = [
    {
      label: "เข้างาน",
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "โปรไฟล์",
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "คำขอ",
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      label: "งานของฉัน",
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

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
              <span className="text-[15px] font-black truncate text-[#283583]">
                ROENGVAREE
              </span>
              <span className="text-[10px] font-bold uppercase text-gray-400 mt-0.5">
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
          const isExpanded = true;
          
          return (
            <div key={group.title || `general-${gIdx}`} className="space-y-0.5">
              
              <div className="block">
                <div className="overflow-hidden space-y-0.5">
                  {group.title === "ฝ่ายบุคคล" && (!collapsed || mobileOpen) && (
                    <div className="px-1.5 py-2 mb-2">
                      <div className="bg-gray-200/50 p-1 rounded-[16px] flex items-center gap-0.5 shadow-inner border border-gray-200/20">
                        <button 
                          onClick={() => {
                            setViewMode("me");
                            onPageChange("เข้างาน");
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-[13px] transition-all duration-300 ${
                            viewMode === "me" 
                            ? "bg-white text-slate-700 shadow-sm font-bold scale-[1.02]" 
                            : "text-slate-400 hover:text-slate-600 font-medium"
                          }`}
                        >
                          <svg className={`w-3.5 h-3.5 ${viewMode === "me" ? "text-blue-500" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[13px]">ฉัน</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setViewMode("team");
                            onPageChange("แดชบอร์ดฝ่ายบุคคล");
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-[13px] transition-all duration-300 ${
                            viewMode === "team" 
                            ? "bg-[#1E3A8A] text-white shadow-md font-bold scale-[1.02]" 
                            : "text-slate-400 hover:text-slate-600 font-medium"
                          }`}
                        >
                          <div className="relative">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full flex items-center justify-center border ${viewMode === "team" ? "border-[#1E3A8A]" : "border-slate-50"}`}>
                              <div className={`w-0.5 h-0.5 rounded-full ${viewMode === "team" ? "bg-blue-500" : "bg-slate-300"}`} />
                            </div>
                          </div>
                          <span className="text-[13px]">ทีมงาน</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {(group.title === "ฝ่ายบุคคล" && viewMode === "me" ? meItems : group.items).map((item: any) => {
                    const active = isActive(item);
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
                              <span className={`whitespace-nowrap ${
                                item.label === "แดชบอร์ด" ? "text-[18px] font-bold" : "text-[15px] font-semibold"
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
              <p className="text-[11px] text-indigo-500 mt-0.5">ใช้งานได้ปกติ</p>
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
