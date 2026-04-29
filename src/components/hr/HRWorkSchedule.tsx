"use client";

import { useState, useMemo } from "react";

interface ShiftAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeImage: string;
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  color: string;
  date: string; // ISO format
}

const mockShifts = [
  { id: "S1", name: "กะเช้า (Day Shift)", time: "08:00 - 17:00", color: "bg-emerald-500" },
  { id: "S2", name: "กะบ่าย (Afternoon Shift)", time: "13:00 - 22:00", color: "bg-blue-500" },
  { id: "S3", name: "กะดึก (Night Shift)", time: "22:00 - 07:00", color: "bg-indigo-500" },
  { id: "S4", name: "วันหยุด (Day Off)", time: "-", color: "bg-slate-400" },
];

const mockAssignments: ShiftAssignment[] = [
  {
    id: "1",
    employeeId: "E1",
    employeeName: "ภัทรินทร์ พงศธรธนเดช",
    employeeImage: "https://i.pravatar.cc/150?u=1",
    shiftId: "S1",
    shiftName: "กะเช้า",
    startTime: "08:00",
    endTime: "17:00",
    color: "emerald",
    date: "2026-04-28",
  },
  {
    id: "2",
    employeeId: "E2",
    employeeName: "เชษฐพงศ์ พลอย",
    employeeImage: "https://i.pravatar.cc/150?u=2",
    shiftId: "S2",
    shiftName: "กะบ่าย",
    startTime: "13:00",
    endTime: "22:00",
    color: "blue",
    date: "2026-04-28",
  },
  {
    id: "3",
    employeeId: "E3",
    employeeName: "จิตรินทร์ โสมานนท์",
    employeeImage: "https://i.pravatar.cc/150?u=3",
    shiftId: "S1",
    shiftName: "กะเช้า",
    startTime: "08:00",
    endTime: "17:00",
    color: "emerald",
    date: "2026-04-28",
  },
  {
    id: "4",
    employeeId: "E4",
    employeeName: "นราภรณ์ พงศ์วิชัย",
    employeeImage: "https://i.pravatar.cc/150?u=4",
    shiftId: "S4",
    shiftName: "วันหยุด",
    startTime: "-",
    endTime: "-",
    color: "slate",
    date: "2026-04-28",
  },
];

export default function HRWorkSchedule() {
  const [selectedDate, setSelectedDate] = useState<string>("2026-04-28");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ShiftAssignment | null>(null);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>(mockAssignments);

  const filteredSidebarAssignments = useMemo(() => {
    return assignments.filter(a => 
      a.employeeName.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
    );
  }, [assignments, sidebarSearchQuery]);

  const daysOfWeek = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  
  // Generating a simple calendar for April 2026
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const firstDayOffset = 3; // Wednesday (0=Sun, 1=Mon, 2=Tue, 3=Wed...)

  const handleOpenEdit = (assign: ShiftAssignment) => {
    setEditingAssignment(assign);
    setIsEditModalOpen(true);
  };

  const handleSaveShift = (shiftId: string) => {
    if (!editingAssignment) return;
    
    const selectedShift = mockShifts.find(s => s.id === shiftId);
    if (!selectedShift) return;

    const newColorMap: Record<string, string> = {
      "S1": "emerald",
      "S2": "blue",
      "S3": "indigo",
      "S4": "slate"
    };

    setAssignments(prev => prev.map(a => 
      a.id === editingAssignment.id 
        ? { 
            ...a, 
            shiftId: selectedShift.id, 
            shiftName: selectedShift.name.split(' ')[0], 
            startTime: selectedShift.time.split(' - ')[0] || "-",
            endTime: selectedShift.time.split(' - ')[1] || "-",
            color: newColorMap[selectedShift.id] || "slate"
          } 
        : a
    ));
    setIsEditModalOpen(false);
  };

  const getShiftColor = (color: string) => {
    switch (color) {
      case "emerald": return "bg-emerald-500";
      case "blue": return "bg-blue-500";
      case "indigo": return "bg-indigo-500";
      case "slate": return "bg-slate-400";
      default: return "bg-slate-500";
    }
  };

  const getShiftBg = (color: string) => {
    switch (color) {
      case "emerald": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "blue": return "bg-blue-50 text-blue-600 border-blue-100";
      case "indigo": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "slate": return "bg-slate-50 text-slate-500 border-slate-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <button title="เดือนก่อนหน้า" className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-xl font-black text-slate-800 whitespace-nowrap">เมษายน 2569</h2>
            <button title="เดือนถัดไป" className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-xl text-[14px] font-bold transition-all ${viewMode === "calendar" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:text-slate-600"}`}
            >
              ปฏิทิน
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-xl text-[14px] font-bold transition-all ${viewMode === "list" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:text-slate-600"}`}
            >
              รายชื่อ
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-64">
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, แผนก..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button 
            title="ตัวกรอง"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="w-11 h-11 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 transition-all shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[14px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>จัดตารางงาน</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Calendar View */}
        <div className="xl:col-span-8 flex flex-col min-h-[600px]">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col flex-1">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b border-slate-50">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-4 text-center text-[12px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1">
              {/* Empty offsets */}
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="border-b border-r border-slate-50 bg-slate-50/20" />
              ))}
              
              {daysInMonth.map((day) => {
                const dateString = `2026-04-${day.toString().padStart(2, '0')}`;
                const isSelected = selectedDate === dateString;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDate(dateString)}
                    className={`relative p-3 border-b border-r border-slate-50 transition-all cursor-pointer group min-h-[110px] ${
                      isSelected 
                      ? 'bg-blue-600/5 ring-4 ring-blue-600/20 z-10 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]' 
                      : 'hover:bg-blue-50/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-[15px] font-black transition-all ${
                        isSelected 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                        : 'text-slate-400 group-hover:text-blue-500'
                      }`}>
                        {day}
                      </span>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                    
                    <div className="mt-3 space-y-1.5">
                      {day % 3 === 0 && (
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border overflow-hidden transition-all ${
                          isSelected ? 'bg-white border-transparent shadow-sm' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className={`text-[10px] font-black whitespace-nowrap uppercase tracking-tighter ${isSelected ? 'text-emerald-600' : ''}`}>Day: 12</span>
                        </div>
                      )}
                      {day % 4 === 0 && (
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border overflow-hidden transition-all ${
                          isSelected ? 'bg-white border-transparent shadow-sm' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className={`text-[10px] font-black whitespace-nowrap uppercase tracking-tighter ${isSelected ? 'text-blue-600' : ''}`}>Aft: 8</span>
                        </div>
                      )}
                      {day % 5 === 0 && (
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border overflow-hidden transition-all ${
                          isSelected ? 'bg-white border-transparent shadow-sm' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span className={`text-[10px] font-black whitespace-nowrap uppercase tracking-tighter ${isSelected ? 'text-indigo-600' : ''}`}>Night: 5</span>
                        </div>
                      )}
                    </div>

                    {/* Selected border bottom */}
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 shadow-[0_-2px_10px_rgba(37,99,235,0.3)]" />
                    )}
                  </div>
                );
              })}
              
              {/* Fill remaining empty cells */}
              {Array.from({ length: 35 - (daysInMonth.length + firstDayOffset) }).map((_, i) => (
                <div key={`end-offset-${i}`} className="border-b border-r border-slate-50 bg-slate-50/20" />
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-6 px-4">
             {mockShifts.map(shift => (
               <div key={shift.id} className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${shift.color}`} />
                 <span className="text-[13px] font-bold text-slate-500">{shift.name}</span>
                 <span className="text-[11px] font-bold text-slate-300">({shift.time})</span>
               </div>
             ))}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white flex flex-col flex-1 min-h-0">
             <div className="flex items-center justify-between mb-8">
               <div className="flex flex-col">
                 <h3 className="text-[18px] font-black text-slate-800 leading-none">รายละเอียดกะงาน</h3>
                 <span className="text-[13px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">อังคารที่ 28 เมษายน 2569</span>
               </div>
               <button title="ตัวเลือกเพิ่มเติม" className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
               </button>
             </div>

             <div className="space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-2 -mr-2">
                {/* Summary Section */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/50">
                    <span className="text-[12px] font-black text-emerald-600/60 uppercase tracking-widest">Day Shift</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[24px] font-black text-emerald-600">12</span>
                      <span className="text-[13px] font-bold text-emerald-500/70">คน</span>
                    </div>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50">
                    <span className="text-[12px] font-black text-blue-600/60 uppercase tracking-widest">Aft Shift</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[24px] font-black text-blue-600">8</span>
                      <span className="text-[13px] font-bold text-blue-500/70">คน</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* Employee List in Shift */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-[14px] font-black text-slate-700 uppercase tracking-widest">พนักงานทั้งหมด ({filteredSidebarAssignments.length})</h4>
                  </div>
                  
                  {/* Local Search in Sidebar */}
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="ค้นชื่อในรายการนี้..." 
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none group-hover:bg-white group-hover:border-blue-100"
                      value={sidebarSearchQuery}
                      onChange={(e) => setSidebarSearchQuery(e.target.value)}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  {filteredSidebarAssignments.map((assign) => (
                    <div key={assign.id} 
                      onClick={() => handleOpenEdit(assign)}
                      className="flex items-center justify-between group p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={assign.employeeImage} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getShiftColor(assign.color)}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">{assign.employeeName}</span>
                          <span className={`text-[11px] font-black mt-1 uppercase tracking-tighter ${getShiftBg(assign.color)} px-1.5 py-0.5 rounded-md border w-fit`}>
                            {assign.shiftName} {assign.startTime !== '-' && `(${assign.startTime} - ${assign.endTime})`}
                          </span>
                        </div>
                      </div>
                      <button title="แก้ไขกะงาน" className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-indigo-600 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  ))}
                  
                  <button className="w-full py-3 mt-4 border-2 border-dashed border-slate-100 rounded-2xl text-[13px] font-bold text-slate-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all">
                    + เพิ่มพนักงานในกะ
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Edit Shift Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">เปลี่ยนกะทำงาน</h3>
                <div className="flex items-center gap-2 text-blue-500 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[14px] font-black uppercase tracking-wider">{selectedDate}</span>
                </div>
              </div>
              <button title="ปิด" onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

            </div>

            {editingAssignment && (
              <div className="flex items-center gap-4 mb-8 p-5 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                </div>
                <img src={editingAssignment.employeeImage} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-md ring-4 ring-white" />
                <div className="flex flex-col">
                  <span className="text-[17px] font-black text-slate-800">{editingAssignment.employeeName}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter">กะปัจจุบัน:</span>
                    <span className={`text-[11px] font-black ${getShiftBg(editingAssignment.color)} px-2 py-0.5 rounded-md border`}>{editingAssignment.shiftName}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">เลือกกะที่ต้องการเปลี่ยน</span>
                <button className="text-[12px] font-bold text-blue-500 hover:underline">ตั้งค่ากะล่วงหน้า</button>
              </div>
              {mockShifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => handleSaveShift(shift.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                    editingAssignment?.shiftId === shift.id 
                    ? "border-blue-500 bg-blue-50/30 shadow-xl shadow-blue-100/50" 
                    : "border-slate-50 bg-white hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-3.5 h-3.5 rounded-full ${shift.color} shadow-sm group-hover:scale-125 transition-transform ring-4 ring-white`} />
                    <div className="flex flex-col items-start">
                      <span className={`text-[15px] font-black ${editingAssignment?.shiftId === shift.id ? "text-blue-600" : "text-slate-700"}`}>
                        {shift.name}
                      </span>
                      <span className="text-[12px] font-bold text-slate-400">{shift.time}</span>
                    </div>
                  </div>
                  {editingAssignment?.shiftId === shift.id ? (
                    <div className="w-7 h-7 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 animate-in zoom-in-50 duration-300">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  ) : (
                    <div className="w-7 h-7 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 mb-8">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-200 bg-white flex items-center justify-center transition-all group-hover:border-blue-400">
                    <input type="checkbox" className="hidden" />
                    <div className="w-3 h-3 rounded bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                  </div>
                  <span className="text-[14px] font-bold text-slate-500 group-hover:text-slate-700">นำไปใช้กับวันที่เลือกไว้ทั้งหมด (Bulk Update)</span>
               </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="py-4 bg-slate-100 text-slate-400 rounded-[24px] text-[15px] font-black hover:bg-slate-200 transition-all"
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="py-4 bg-blue-600 text-white rounded-[24px] text-[15px] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
              >
                ยืนยันการเปลี่ยน
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsFilterDrawerOpen(false)}
        />
      )}

      {/* Sliding Filter Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[360px] bg-white z-[201] shadow-2xl transition-transform duration-500 ease-out transform ${isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[22px] font-black text-slate-800 tracking-tight">ตัวกรอง</h3>
            <button className="text-[14px] font-bold text-blue-500 hover:text-blue-700 transition-colors">ล้างทั้งหมด</button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-12">
            {/* Date Selection Section */}
            <div className="space-y-6">
              <span className="text-[15px] font-black text-slate-700 uppercase tracking-widest px-1">วันที่ (Date)</span>
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-[40px] relative group transition-all hover:bg-blue-50/30 hover:border-blue-100">
                <button title="วันก่อนหน้า" className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[16px] font-black text-slate-700 tracking-tight leading-tight">28/04/2026 -</span>
                  <span className="text-[16px] font-black text-slate-700 tracking-tight leading-tight">28/04/2026</span>
                </div>
                <button title="วันถัดไป" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Filter Sections */}
            {[
              { label: "แผนก (Department)", options: ["ทั้งหมด", "ฝ่ายขาย", "ฝ่ายผลิต", "ฝ่ายบัญชี", "กัปตันเรือ"], selected: "ทั้งหมด" },
              { label: "ตำแหน่ง (Position)", options: ["ทั้งหมด", "ผู้จัดการ", "พนักงานทั่วไป", "หัวหน้างาน"], selected: "ทั้งหมด" },
              { label: "ใต้บังคับบัญชา (S)", options: ["ทีมของฉัน", "ทั้งหมด"], selected: "ทีมของฉัน" },
            ].map((section, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center justify-between group">
                  <span className="text-[15px] font-black text-slate-700 group-hover:text-blue-600 transition-colors">{section.label}</span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Options List */}
                <div className="flex flex-col gap-5 pl-1">
                  {section.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-5 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${opt === section.selected ? "border-blue-500 shadow-lg shadow-blue-100" : "border-slate-200 bg-white group-hover:border-blue-300"}`}>
                        {opt === section.selected ? (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        ) : null}
                      </div>
                      <span className={`text-[15px] font-bold transition-colors ${opt === section.selected ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setIsFilterDrawerOpen(false)}
            className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[28px] text-[16px] font-black hover:bg-slate-800 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200"
          >
            ใช้ตัวกรอง
          </button>
        </div>
      </div>
    </div>
  );
}
