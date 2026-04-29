"use client";

import { useState, useMemo } from "react";

interface ApprovalRequest {
  id: string;
  docNo: string;
  status: "รออนุมัติ" | "อนุมัติแล้ว" | "ปฏิเสธ";
  employeeName: string;
  employeeImage: string;
  employeeRole: string;
  docType: string;
  duration?: string;
  requestedDate: string;
  reason: string;
  createdDate: string;
}

export default function HRApproval() {
  const [activeTab, setActiveTab] = useState<"general" | "shift" | "holiday">("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  
  const [generalRequests, setGeneralRequests] = useState<ApprovalRequest[]>([
    {
      id: "1",
      docNo: "L2600007",
      status: "อนุมัติแล้ว",
      employeeName: "เจษฎากร ผลดี",
      employeeImage: "https://i.pravatar.cc/150?u=j1",
      employeeRole: "ฝ่ายผลิต",
      docType: "ลาหยุดพักร้อนประจำปี",
      duration: "1 วัน",
      requestedDate: "29/04/2569",
      reason: "ทดสอบ2",
      createdDate: "28/04/2569",
    },
    {
      id: "2",
      docNo: "L2600006",
      status: "อนุมัติแล้ว",
      employeeName: "เจษฎากร ผลดี",
      employeeImage: "https://i.pravatar.cc/150?u=j1",
      employeeRole: "ฝ่ายผลิต",
      docType: "ลาหยุดพักร้อนประจำปี",
      duration: "1 วัน",
      requestedDate: "29/04/2569",
      reason: "ทดสอบ1",
      createdDate: "28/04/2569",
    },
    {
      id: "3",
      docNo: "L2600008",
      status: "รออนุมัติ",
      employeeName: "เชษฐพงศ์ พลอย",
      employeeImage: "https://i.pravatar.cc/150?u=2",
      employeeRole: "ฝ่ายขาย",
      docType: "ลากิจ",
      duration: "0.5 วัน",
      requestedDate: "30/04/2569",
      reason: "ทำธุระครอบครัว",
      createdDate: "28/04/2569",
    },
    {
      id: "4",
      docNo: "L2600009",
      status: "รออนุมัติ",
      employeeName: "นราภรณ์ พงศ์วิชัย",
      employeeImage: "https://i.pravatar.cc/150?u=4",
      employeeRole: "ฝ่ายบัญชี",
      docType: "ลาป่วย",
      duration: "2 วัน",
      requestedDate: "02/05/2569",
      reason: "เป็นไข้หวัดใหญ่",
      createdDate: "29/04/2569",
    }
  ]);

  const [shiftRequests, setShiftRequests] = useState<ApprovalRequest[]>([
    {
      id: "s1",
      docNo: "S2600001",
      status: "รออนุมัติ",
      employeeName: "วิชัย เรียนรู้",
      employeeImage: "https://i.pravatar.cc/150?u=w1",
      employeeRole: "ฝ่ายปฏิบัติการ",
      docType: "เปลี่ยนกะ (เช้า -> บ่าย)",
      requestedDate: "01/05/2569",
      reason: "ติดธุระช่วงเช้า",
      createdDate: "28/04/2569",
    }
  ]);

  const [holidayRequests, setHolidayRequests] = useState<ApprovalRequest[]>([
    {
      id: "h1",
      docNo: "H2600001",
      status: "รออนุมัติ",
      employeeName: "จิตรินทร์ โสมานนท์",
      employeeImage: "https://i.pravatar.cc/150?u=3",
      employeeRole: "ฝ่ายผลิต",
      docType: "สลับวันหยุด (อาทิตย์ -> จันทร์)",
      requestedDate: "03/05/2569",
      reason: "ต้องการพักผ่อนต่อเนื่อง",
      createdDate: "28/04/2569",
    }
  ]);

  const currentRequests = useMemo(() => {
    switch (activeTab) {
      case "general": return generalRequests;
      case "shift": return shiftRequests;
      case "holiday": return holidayRequests;
    }
  }, [activeTab, generalRequests, shiftRequests, holidayRequests]);

  const filteredRequests = useMemo(() => {
    return currentRequests.filter(req => 
      req.docNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.docType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentRequests, searchQuery]);

  const counts = {
    general: generalRequests.filter(r => r.status === "รออนุมัติ").length,
    shift: shiftRequests.filter(r => r.status === "รออนุมัติ").length,
    holiday: holidayRequests.filter(r => r.status === "รออนุมัติ").length,
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests(filteredRequests.map(r => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(item => item !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const handleApprove = (id: string) => {
    const updater = (list: ApprovalRequest[]) => 
      list.map(r => r.id === id ? { ...r, status: "อนุมัติแล้ว" as const } : r);
    
    if (activeTab === "general") setGeneralRequests(updater);
    if (activeTab === "shift") setShiftRequests(updater);
    if (activeTab === "holiday") setHolidayRequests(updater);
  };

  const handleReject = (id: string) => {
    const updater = (list: ApprovalRequest[]) => 
      list.map(r => r.id === id ? { ...r, status: "ปฏิเสธ" as const } : r);
      
    if (activeTab === "general") setGeneralRequests(updater);
    if (activeTab === "shift") setShiftRequests(updater);
    if (activeTab === "holiday") setHolidayRequests(updater);
  };

  const handleBulkApprove = () => {
    const updater = (list: ApprovalRequest[]) => 
      list.map(r => selectedRequests.includes(r.id) ? { ...r, status: "อนุมัติแล้ว" as const } : r);
      
    if (activeTab === "general") setGeneralRequests(updater);
    if (activeTab === "shift") setShiftRequests(updater);
    if (activeTab === "holiday") setHolidayRequests(updater);
    setSelectedRequests([]);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "อนุมัติแล้ว": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "รออนุมัติ": return "bg-amber-50 text-amber-600 border-amber-100 animate-pulse";
      case "ปฏิเสธ": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-hidden font-sans p-8 gap-6">
      
      {/* Top Navigation Tabs */}
      <div className="bg-white rounded-3xl p-1.5 flex items-center gap-1 shadow-sm border border-slate-100 w-fit flex-shrink-0">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-6 py-3 rounded-[20px] text-[15px] font-black transition-all ${
            activeTab === "general" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span>คำขอทั่วไป</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === "general" ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-400"
          }`}>
            {counts.general}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab("shift")}
          className={`flex items-center gap-2 px-6 py-3 rounded-[20px] text-[15px] font-black transition-all ${
            activeTab === "shift" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span>เปลี่ยนกะ</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === "shift" ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-400"
          }`}>
            {counts.shift}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("holiday")}
          className={`flex items-center gap-2 px-6 py-3 rounded-[20px] text-[15px] font-black transition-all ${
            activeTab === "holiday" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span>เปลี่ยนวันหยุด</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === "holiday" ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-400"
          }`}>
            {counts.holiday}
          </span>
        </button>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-shrink-0 bg-white p-4 rounded-[28px] shadow-sm border border-slate-100">
        
        {/* Search */}
        <div className="relative group w-full lg:w-80">
          <input 
            type="text" 
            placeholder="เลขที่เอกสาร, ชื่อพนักงาน..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-[14px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-3">
          
          {selectedRequests.length > 0 && (
            <button
              onClick={handleBulkApprove}
              className="px-5 py-3 bg-emerald-600 text-white rounded-2xl text-[14px] font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>อนุมัติที่เลือก ({selectedRequests.length})</span>
            </button>
          )}

          <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 rounded-2xl text-[13px] font-bold transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>ตามลำดับอนุมัติ</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 rounded-2xl text-[13px] font-bold transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>กรอง</span>
          </button>

          {/* Date Range Display */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2">
            <select title="ช่วงเวลา" className="bg-transparent text-[13px] font-bold text-slate-600 outline-none cursor-pointer">
              <option>ปีนี้</option>
              <option>เดือนนี้</option>
            </select>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button title="ก่อนหน้า" className="text-slate-400 hover:text-slate-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
            <span className="text-[13px] font-bold text-slate-600 whitespace-nowrap">01/01/2026 - 31/12/2026</span>
            <button title="ถัดไป" className="text-slate-400 hover:text-slate-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
          </div>

        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="pl-8 py-5 w-12 border-b border-slate-100">
                  <input 
                    type="checkbox" 
                    title="เลือกทั้งหมด"
                    className="w-5 h-5 rounded-md border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-32">เลขที่</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-36 text-center">สถานะ</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-60">พนักงาน</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-52">ประเภทเอกสาร</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-36">วันที่ขอ</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 max-w-[250px]">เหตุผล</th>
                <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-36">วันที่สร้าง</th>
                <th className="pr-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right w-40">จัดการ</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-[15px] font-black text-slate-400">ไม่มีข้อมูลคำขอ</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="group hover:bg-slate-50/40 transition-all">
                    <td className="pl-8 py-5">
                      <input 
                        type="checkbox" 
                        title="เลือกรายการ"
                        className="w-5 h-5 rounded-md border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        checked={selectedRequests.includes(req.id)}
                        onChange={() => handleSelectRow(req.id)}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">{req.docNo}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${getStatusStyle(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img src={req.employeeImage} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-100 group-hover:scale-105 transition-transform" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-slate-700 leading-tight">{req.employeeName}</span>
                          <span className="text-[11px] font-bold text-slate-400 mt-1">{req.employeeRole}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-slate-600">{req.docType}</span>
                        {req.duration && (
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-black border border-indigo-100/50">
                            {req.duration}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-slate-600">{req.requestedDate}</span>
                    </td>
                    <td className="px-6 py-5 max-w-[250px]">
                      <p className="text-[13px] font-bold text-slate-500 line-clamp-2" title={req.reason}>{req.reason}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-slate-400">{req.createdDate}</span>
                    </td>
                    <td className="pr-8 py-5 text-right">
                      {req.status === "รออนุมัติ" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(req.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                          >
                            อนุมัติ
                          </button>
                          <button 
                            onClick={() => handleReject(req.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-bold rounded-xl transition-all"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      ) : (
                        <span className="text-[12px] font-bold text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-slate-400">แสดง {filteredRequests.length} รายการ</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button aria-label="หน้าก่อนหน้า" className="p-2 text-slate-300 hover:text-slate-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
            <button className="w-8 h-8 rounded-full bg-indigo-600 text-white text-[14px] font-black shadow-md shadow-indigo-200">1</button>
            <button aria-label="หน้าถัดไป" className="p-2 text-slate-300 hover:text-slate-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>

      </div>

    </div>
  );
}
