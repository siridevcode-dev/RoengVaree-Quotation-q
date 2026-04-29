"use client";

import { useState, useEffect } from "react";
import HREmployeeList from "./HREmployeeList";
import HRWorkSchedule from "./HRWorkSchedule";
import HRWarningLetter from "./HRWarningLetter";
import HRJoinRequests from "./HRJoinRequests";
import HRPayroll from "./HRPayroll";
import HRTask from "./HRTask";
import HRReport from "./HRReport";
import HRAnnouncement from "./HRAnnouncement";
import HRSettings from "./HRSettings";

interface HRManagementProps {
  activeTab?: string;
}

export default function HRManagement({ activeTab: initialTab = "มอบหมายงาน" }: HRManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);
  
  const subTabs = [
    { id: "มอบหมายงาน", label: "มอบหมายงาน", count: 3 },
    { id: "พนักงาน", label: "พนักงาน", count: 9 },
    { id: "ตารางการทำงาน", label: "ตารางการทำงาน", count: null },
    { id: "หนังสือเตือน", label: "หนังสือเตือน", count: 0 },
    { id: "ขอเข้าร่วมบริษัท", label: "ขอเข้าร่วมบริษัท", count: 1 },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case "พนักงาน":
        return <HREmployeeList />;
      case "ตารางการทำงาน":
        return <HRWorkSchedule />;
      case "มอบหมายงาน":
        return <HRTask />;
      case "รายงานฝ่ายบุคคล":
        return <HRReport />;
      case "หนังสือเตือน":
        return <HRWarningLetter />;
      case "ขอเข้าร่วมบริษัท":
        return <HRJoinRequests />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-white rounded-[32px] border border-slate-100 shadow-sm animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
             </div>
             <h2 className="text-xl font-black text-slate-800">กำลังพัฒนาส่วนนี้</h2>
             <p className="text-slate-400 mt-2">ฟีเจอร์ {activeSubTab} จะพร้อมใช้งานเร็วๆ นี้</p>
          </div>
        );
    }
  };

  if (activeSubTab === "เงินเดือน") {
    return <HRPayroll />;
  }

  if (activeSubTab === "รายงานฝ่ายบุคคล") {
    return <HRReport />;
  }

  if (activeSubTab === "ประกาศ") {
    return <HRAnnouncement />;
  }

  if (activeSubTab === "ตั้งค่าฝ่ายบุคคล") {
    return <HRSettings />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
      {/* Top Tab Navigation Bar */}
      <div className="bg-white border-b border-slate-200/60 px-8 flex-shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {subTabs.map((tab) => (
              <button title="ปุ่ม"
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative px-6 py-5 text-[15px] font-black transition-all group ${
                  activeSubTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      activeSubTab === tab.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeSubTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_10px_rgba(79,70,229,0.2)]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <button title="ปุ่ม" className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-[14px]">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>วิธีใช้งาน</span>
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F1F5F9]">
        {renderContent()}
      </div>
    </div>
  );
}
