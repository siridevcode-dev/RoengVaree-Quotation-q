"use client";

import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  project: string;
  responsible: string;
  avatar: string;
  deadline: string;
  status: "รอดำเนินการ" | "ดำเนินการอยู่" | "เสร็จแล้ว" | "เกินกำหนด";
  isUrgent: boolean;
  isStarred: boolean;
}

export default function HRTask() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "ส่งใบเสนอราคาให้ลูกค้า A",
      description: "แนบรายการผลิตเรือ 28 ฟุต พร้อมรายละเอียดส่วนลดพิเศษ",
      project: "Project-28ft",
      responsible: "สมชาย ใจดี",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      deadline: "2026-05-01",
      status: "เสร็จแล้ว",
      isUrgent: false,
      isStarred: true,
    },
    {
      id: 2,
      title: "จัดทำรายงานภาษีครึ่งปี",
      description: "สรุปงบซื้อขายและภาษีหัก ณ ที่จ่ายทั้งหมดในแผนก",
      project: "Finance",
      responsible: "สมศรี มีสุข",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      deadline: "2026-05-15",
      status: "ดำเนินการอยู่",
      isUrgent: true,
      isStarred: false,
    },
    {
      id: 3,
      title: "ตรวจสอบตารางเวลาการทำงาน",
      description: "ตรวจเช็คกะการทำงานของช่างต่อเรือให้สอดคล้องกับเป้าหมาย",
      project: "Operations",
      responsible: "กิตติ สุดขยัน",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
      deadline: "2026-04-30",
      status: "รอดำเนินการ",
      isUrgent: false,
      isStarred: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ทั้งหมด");
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskResponsible, setNewTaskResponsible] = useState("สมชาย ใจดี");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskUrgent, setNewTaskUrgent] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("รอดำเนินการ");
  const [checklists, setChecklists] = useState<string[]>([""]);

  const handleAddChecklist = () => {
    setChecklists([...checklists, ""]);
  };

  const handleChecklistChange = (index: number, value: string) => {
    const updated = [...checklists];
    updated[index] = value;
    setChecklists(updated);
  };

  const counts = {
    ทั้งหมด: tasks.length,
    รอดำเนินการ: tasks.filter(t => t.status === "รอดำเนินการ").length,
    ดำเนินการอยู่: tasks.filter(t => t.status === "ดำเนินการอยู่").length,
    เสร็จแล้ว: tasks.filter(t => t.status === "เสร็จแล้ว").length,
    เกินกำหนด: tasks.filter(t => t.status === "เกินกำหนด").length,
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ทั้งหมด" || task.status === filterStatus;
    const matchesUrgent = !showUrgentOnly || task.isUrgent;

    return matchesSearch && matchesStatus && matchesUrgent;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDesc,
      project: newTaskProject || "ทั่วไป",
      responsible: newTaskResponsible,
      avatar: newTaskResponsible === "สมชาย ใจดี" 
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      deadline: newTaskDeadline || new Date().toISOString().split('T')[0],
      status: newTaskStatus,
      isUrgent: newTaskUrgent,
      isStarred: false,
    };

    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskProject("");
    setNewTaskUrgent(false);
    setNewTaskStatus("รอดำเนินการ");
    setChecklists([""]);
  };

  const toggleStarred = (taskId: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isStarred: !t.isStarred } : t));
  };

  const updateStatus = (taskId: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-800 pb-10">
      
      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "ทั้งหมด", count: counts.ทั้งหมด, gradient: "from-slate-800 to-slate-900", icon: "📊" },
          { label: "รอดำเนินการ", count: counts.รอดำเนินการ, gradient: "from-amber-500 to-amber-600", icon: "⏳" },
          { label: "ดำเนินการอยู่", count: counts.ดำเนินการอยู่, gradient: "from-sky-500 to-sky-600", icon: "⚡" },
          { label: "เสร็จแล้ว", count: counts.เสร็จแล้ว, gradient: "from-emerald-500 to-emerald-600", icon: "🎉" },
          { label: "เกินกำหนด", count: counts.เกินกำหนด, gradient: "from-rose-500 to-rose-600", icon: "🚨" },
        ].map((card) => (
          <div
            key={card.label}
            onClick={() => setFilterStatus(card.label)}
            className={`cursor-pointer p-5 rounded-[24px] bg-gradient-to-br ${card.gradient} text-white shadow-lg shadow-slate-200/30 hover:scale-[1.02] transition-all duration-200 relative overflow-hidden group`}
          >
            <div className="absolute right-[-10px] bottom-[-10px] text-5xl opacity-10 group-hover:scale-125 transition-all duration-300">
              {card.icon}
            </div>
            <span className="text-[13px] font-bold opacity-80 tracking-wide">{card.label}</span>
            <div className="text-3xl font-black mt-2 flex items-baseline gap-1">
              {card.count}
              <span className="text-xs opacity-60 font-medium">งาน</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input title="กรอกข้อมูล"
              type="text"
              placeholder="ค้นหาชื่องาน, รายละเอียด หรือผู้รับผิดชอบ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] font-bold text-slate-600 placeholder-slate-400 focus:border-indigo-400 outline-none shadow-inner transition-all"
            />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Urgent Toggle */}
          <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <input title="กรอกข้อมูล"
              type="checkbox"
              checked={showUrgentOnly}
              onChange={(e) => setShowUrgentOnly(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-400 h-4 w-4 border-slate-300"
            />
            <span className="text-[13px] font-bold text-slate-600 flex items-center gap-1">
              🔥 งานด่วน
            </span>
          </label>
        </div>

        <button title="ปุ่ม"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-[13.5px] font-black transition-all active:scale-95 shadow-md shadow-indigo-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          มอบหมายงาน
        </button>
      </div>

      {/* Tasks Table / List */}
      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/30 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="w-12 px-5 py-4 text-center text-[11.5px] font-black text-slate-400 uppercase tracking-wider">⭐</th>
                <th className="px-5 py-4 text-[11.5px] font-black text-slate-400 uppercase tracking-wider">สถานะ</th>
                <th className="px-5 py-4 text-[11.5px] font-black text-slate-400 uppercase tracking-wider">ชื่องาน / รายละเอียด</th>
                <th className="px-5 py-4 text-[11.5px] font-black text-slate-400 uppercase tracking-wider">โปรเจกต์</th>
                <th className="px-5 py-4 text-[11.5px] font-black text-slate-400 uppercase tracking-wider">ผู้รับผิดชอบ</th>
                <th className="px-5 py-4 text-[11.5px] font-black text-slate-400 uppercase tracking-wider">กำหนดส่ง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTasks.map((task) => {
                let statusClass = "bg-amber-50 text-amber-600 border-amber-200/50";
                if (task.status === "ดำเนินการอยู่") statusClass = "bg-sky-50 text-sky-600 border-sky-200/50";
                if (task.status === "เสร็จแล้ว") statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200/50";
                if (task.status === "เกินกำหนด") statusClass = "bg-rose-50 text-rose-600 border-rose-200/50";

                return (
                  <tr key={task.id} className="hover:bg-slate-50/30 transition-all duration-150">
                    {/* Star */}
                    <td className="px-5 py-4 text-center">
                      <button title="ปุ่ม"
                        onClick={() => toggleStarred(task.id)}
                        className={`text-lg transition-transform active:scale-125 ${task.isStarred ? 'text-amber-400' : 'text-slate-300 hover:text-slate-400'}`}
                      >
                        ★
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="relative group/status inline-block">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-black border ${statusClass} shadow-sm cursor-pointer flex items-center gap-1`}>
                          {task.status}
                        </span>
                        {/* Status Dropdown on Hover */}
                        <div className="hidden group-hover/status:block absolute left-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 min-w-[140px] animate-in fade-in-50 zoom-in-95 duration-100">
                          {(["รอดำเนินการ", "ดำเนินการอยู่", "เสร็จแล้ว", "เกินกำหนด"] as const).map((st) => (
                            <button title="ปุ่ม"
                              key={st}
                              onClick={() => updateStatus(task.id, st)}
                              className="w-full text-left px-4 py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Title & Desc */}
                    <td className="px-5 py-4 max-w-xs md:max-w-md">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-black text-slate-800">{task.title}</span>
                          {task.isUrgent && (
                            <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded uppercase tracking-wider animate-pulse">
                              ด่วน
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-slate-400 line-clamp-1">{task.description}</p>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-5 py-4 text-[13px] font-bold text-slate-600">
                      {task.project}
                    </td>

                    {/* Responsible */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={task.avatar}
                          alt={task.responsible}
                          className="w-7 h-7 rounded-full object-cover shadow-inner"
                        />
                        <span className="text-[13px] font-bold text-slate-600">{task.responsible}</span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="px-5 py-4 text-[13px] font-bold text-slate-500">
                      {task.deadline}
                    </td>
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="text-4xl mb-3 opacity-30">📭</div>
                    <p className="text-[14px] font-bold text-slate-400">ไม่พบงานที่ตรงกับตัวกรอง</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal มอบหมายงาน - Wireframe Accurate */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl shadow-slate-900/30 border border-slate-200/80 overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button title="ปุ่ม" 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-[14px] font-bold flex items-center gap-1 transition-colors"
              >
                <span>«</span> เพิ่มการมอบหมายงาน
              </button>
              <button title="ปุ่ม"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="p-6 flex flex-col gap-6 font-sans">
              
              {/* Task Title */}
              <div className="w-full">
                <input title="กรอกข้อมูล"
                  type="text"
                  required
                  placeholder="ชื่องาน *"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[15px] font-bold text-slate-700 placeholder-slate-400/80 outline-none hover:border-slate-300 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Details Textarea */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-bold text-slate-600 flex items-center gap-1.5">
                    📝 รายละเอียด
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[13px] font-bold text-slate-600">
                    <input title="กรอกข้อมูล"
                      type="checkbox"
                      checked={newTaskUrgent}
                      onChange={(e) => setNewTaskUrgent(e.target.checked)}
                      className="rounded text-rose-500 h-4 w-4 border-slate-300"
                    />
                    <span>งานด่วน 🔥</span>
                  </label>
                </div>
                <textarea
                  rows={4}
                  placeholder="ระบุรายละเอียดเพิ่มเติมของงาน..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-slate-700 placeholder-slate-400/60 outline-none hover:border-slate-300 focus:border-indigo-500 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Status & Project Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[13.5px] font-bold text-slate-600 flex items-center gap-1.5">
                    🔵 สถานะ
                  </span>
                  <select title="เลือกข้อมูล"
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value as Task["status"])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="รอดำเนินการ">รอดำเนินการ</option>
                    <option value="ดำเนินการอยู่">ดำเนินการอยู่</option>
                    <option value="เสร็จแล้ว">เสร็จแล้ว</option>
                    <option value="เกินกำหนด">เกินกำหนด</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[13.5px] font-bold text-slate-600 flex items-center gap-1.5">
                    📁 โปรเจกต์
                  </span>
                  <select title="เลือกข้อมูล"
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="ทั่วไป">ทั่วไป</option>
                    <option value="งานออกแบบ">งานออกแบบ</option>
                    <option value="Project-28ft">Project-28ft</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              {/* Start Date & Deadline Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[13.5px] font-bold text-slate-600 flex items-center gap-1.5">
                    📅 วันที่เริ่ม
                  </span>
                  <input title="กรอกข้อมูล"
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all shadow-sm"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[13.5px] font-bold text-slate-600 flex items-center gap-1.5">
                    📅 กำหนดส่ง
                  </span>
                  <input title="กรอกข้อมูล"
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Responsible (Assignees) */}
              <div className="flex flex-col gap-2">
                <span className="text-[13.5px] font-bold text-slate-600 flex items-center gap-1.5">
                  👤 ผู้รับผิดชอบ
                </span>
                <div className="flex items-center gap-2 flex-wrap bg-slate-50 border border-slate-200 rounded-2xl p-3 min-h-[54px]">
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-[13px] font-bold text-slate-700 shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px]">KP</span>
                    <span>กิติมา พาณุเวช (เจ้าของบริษัท)</span>
                    <button title="ปุ่ม" type="button" className="text-slate-400 hover:text-slate-600 text-xs ml-1 font-black">×</button>
                  </div>
                  
                  <button title="ปุ่ม" type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg transition-all">
                    ＋
                  </button>
                </div>
              </div>

              {/* Attachment Drag & Drop */}
              <div className="flex flex-col gap-2">
                <span className="text-[13.5px] font-bold text-slate-600 flex items-center gap-1.5">
                  📎 ไฟล์แนบ
                </span>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group shadow-inner">
                  <svg className="w-10 h-10 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-[13px] font-bold text-slate-500">
                    ลากไฟล์วางที่นี่ หรือ<span className="text-indigo-500 hover:underline font-black">เลือกไฟล์</span>
                  </p>
                  <span className="text-[11px] text-slate-400 tracking-wide">
                    ประเภทไฟล์ .jpg .jpeg .png .pdf
                  </span>
                </div>
              </div>

              {/* Checklist Section */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <span className="text-[13px] font-bold text-slate-600 flex items-center gap-1.5">
                  📑 Checklist
                </span>
                <div className="flex flex-col gap-2">
                  {checklists.map((chk, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input title="กรอกข้อมูล" type="checkbox" disabled className="h-4.5 w-4.5 rounded border-slate-300 text-slate-400 bg-slate-50" />
                      <input title="กรอกข้อมูล"
                        type="text"
                        placeholder="ระบุงานที่ต้องทำ"
                        value={chk}
                        onChange={(e) => handleChecklistChange(idx, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button title="ปุ่ม"
                  type="button"
                  onClick={handleAddChecklist}
                  className="text-[#0EA5E9] hover:text-[#0EA5E9]/80 text-[13px] font-black flex items-center gap-1 mt-1 self-start"
                >
                  ＋ เพิ่มรายการ
                </button>
              </div>

              {/* Submit Button */}
              <button title="ปุ่ม"
                type="submit"
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-[14px] font-black transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/25"
              >
                ยืนยันมอบหมายงาน
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
