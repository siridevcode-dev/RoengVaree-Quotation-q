"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";

type ExpenseCategory = 
  | "ค่าเดินทาง" 
  | "ค่าขนส่ง" 
  | "ค่าน้ำมัน" 
  | "ค่าที่พัก" 
  | "ค่าอุปกรณ์" 
  | "ค่าอาหาร" 
  | "ค่าเลี้ยงรับรอง" 
  | "เค้กวันเกิด" 
  | "ค่าเบี้ยเลี้ยง" 
  | "ค่าอบรม" 
  | "ค่ารักษาพยาบาล" 
  | "ค่าคอมมิชชั่น" 
  | "อื่นๆ";

interface ExpenseRequest {
  id: string;
  docNo: string;
  date: string;
  employeeName: string;
  employeeImage: string;
  employeeRole: string;
  type: ExpenseCategory;
  amount: number;
  status: "รออนุมัติ" | "อนุมัติแล้ว" | "ปฏิเสธ";
  description: string;
}

interface ExpenseItem {
  category: ExpenseCategory;
  amount: number;
}

const categoryIcons: Record<string, string> = {
  "ค่าเดินทาง": "🚗",
  "ค่าขนส่ง": "🚚",
  "ค่าน้ำมัน": "⛽",
  "ค่าที่พัก": "🏢",
  "ค่าอุปกรณ์": "💻",
  "ค่าอาหาร": "🍴",
  "ค่าเลี้ยงรับรอง": "🍸",
  "เค้กวันเกิด": "🎂",
  "ค่าเบี้ยเลี้ยง": "💰",
  "ค่าอบรม": "📖",
  "ค่ารักษาพยาบาล": "🏥",
  "ค่าคอมมิชชั่น": "💵",
  "อื่นๆ": "💬"
};

export default function HRExpenses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState<number | null>(null);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("ปีนี้");
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isSettingCategories, setIsSettingCategories] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [categoryStatusFilter, setCategoryStatusFilter] = useState("ทั้งหมด");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  
  const [newWithdrawal, setNewWithdrawal] = useState({
    employeeName: "",
    description: "",
    amount: "",
    date: "29/04/2569",
  });
  
  const [newExpense, setNewExpense] = useState<{
    employeeName: string;
    subject: string;
    description: string;
    date: string;
    items: ExpenseItem[];
  }>({
    employeeName: "",
    subject: "",
    description: "",
    date: "29/04/2569",
    items: [{ category: "ค่าเดินทาง", amount: 0 }]
  });

  const [expenses, setExpenses] = useState<ExpenseRequest[]>([
    {
      id: "1",
      docNo: "EXP2600001",
      date: "25/04/2569",
      employeeName: "เชษฐพงศ์ พลอย",
      employeeImage: "https://i.pravatar.cc/150?u=2",
      employeeRole: "ฝ่ายขาย",
      type: "ค่าเดินทาง",
      amount: 1200,
      status: "อนุมัติแล้ว",
      description: "ค่าน้ำมันไปพบลูกค้าที่ชลบุรี",
    },
    {
      id: "2",
      docNo: "EXP2600002",
      date: "28/04/2569",
      employeeName: "นราภรณ์ พงศ์วิชัย",
      employeeImage: "https://i.pravatar.cc/150?u=4",
      employeeRole: "ฝ่ายบัญชี",
      type: "ค่าอุปกรณ์",
      amount: 850,
      status: "รออนุมัติ",
      description: "ซื้อกระดาษ A4 และหมึกพิมพ์",
    },
    {
      id: "3",
      docNo: "EXP2600003",
      date: "29/04/2569",
      employeeName: "เจษฎากร ผลดี",
      employeeImage: "https://i.pravatar.cc/150?u=j1",
      employeeRole: "ฝ่ายผลิต",
      type: "อื่นๆ",
      amount: 3500,
      status: "ปฏิเสธ",
      description: "ค่าซ่อมแซมเครื่องจักรเร่งด่วน",
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    employeeName: "",
    type: "ค่าเดินทาง" as const,
    amount: "",
    date: "29/04/2569",
    description: "",
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => 
      exp.docNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [expenses, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedExpenses(filteredExpenses.map(e => e.id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedExpenses.includes(id)) {
      setSelectedExpenses(selectedExpenses.filter(item => item !== id));
    } else {
      setSelectedExpenses([...selectedExpenses, id]);
    }
  };

  const handleApprove = (id: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, status: "อนุมัติแล้ว" as const } : exp
    ));
  };

  const handleReject = (id: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, status: "ปฏิเสธ" as const } : exp
    ));
  };

  const handleCreateRequest = () => {
    if (!formData.employeeName || !formData.amount) return;

    const newRequest: ExpenseRequest = {
      id: Math.random().toString(),
      docNo: `EXP260000${expenses.length + 1}`,
      date: formData.date,
      employeeName: formData.employeeName,
      employeeImage: "https://i.pravatar.cc/150?u=emp",
      employeeRole: "พนักงาน",
      type: formData.type,
      amount: parseFloat(formData.amount),
      status: "รออนุมัติ",
      description: formData.description,
    };

    setExpenses([newRequest, ...expenses]);
    setIsFormOpen(false);
    setFormData({
      employeeName: "",
      type: "ค่าเดินทาง",
      amount: "",
      date: "29/04/2569",
      description: "",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "อนุมัติแล้ว": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "รออนุมัติ": return "bg-amber-50 text-amber-600 border-amber-100";
      case "ปฏิเสธ": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  if (isCreating) {
    const totalAmount = newExpense.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const handleAddItem = () => {
      setNewExpense({
        ...newExpense,
        items: [...newExpense.items, { category: "ค่าเดินทาง", amount: 0 }]
      });
    };

    const handleRemoveItem = (index: number) => {
      const updatedItems = newExpense.items.filter((_, i) => i !== index);
      setNewExpense({ ...newExpense, items: updatedItems.length ? updatedItems : [{ category: "ค่าเดินทาง", amount: 0 }] });
    };

    const handleItemChange = (index: number, field: "category" | "amount", value: any) => {
      const updatedItems = newExpense.items.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: field === "amount" ? parseFloat(value) || 0 : value };
        }
        return item;
      });
      setNewExpense({ ...newExpense, items: updatedItems });
    };

    const handleSubmit = () => {
      if (!newExpense.employeeName || !newExpense.subject) return;

      const newRequest: ExpenseRequest = {
        id: `exp_${expenses.length + 1}`,
        docNo: `EXP260000${expenses.length + 1}`,
        date: newExpense.date,
        employeeName: newExpense.employeeName,
        employeeImage: "https://i.pravatar.cc/150?u=emp",
        employeeRole: "พนักงาน",
        type: newExpense.items[0]?.category || "อื่นๆ",
        amount: totalAmount,
        status: "รออนุมัติ",
        description: `${newExpense.subject} - ${newExpense.description}`,
      };

      setExpenses([newRequest, ...expenses]);
      setIsCreating(false);
      setNewExpense({
        employeeName: "",
        subject: "",
        description: "",
        date: "29/04/2569",
        items: [{ category: "ค่าเดินทาง", amount: 0 }]
      });
    };

    return (
      <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-y-auto font-sans p-8 gap-6 animate-in fade-in duration-300">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
          <button onClick={() => setIsCreating(false)} className="hover:text-indigo-600 transition-colors">ค่าใช้จ่าย & เบิกเงิน</button>
          <span>&gt;</span>
          <span className="text-slate-600">สร้างค่าใช้จ่าย</span>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-10 max-w-3xl w-full mx-auto flex flex-col gap-8">
          <h2 className="text-[24px] font-black text-slate-800 tracking-tight">สร้างค่าใช้จ่าย</h2>

          {/* Employee Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">เลือกพนักงาน *</label>
            <select 
              title="เลือกพนักงาน"
              value={newExpense.employeeName}
              onChange={(e) => setNewExpense({ ...newExpense, employeeName: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none cursor-pointer shadow-inner"
            >
              <option value="">พนักงาน *</option>
              <option value="เชษฐพงศ์ พลอย">เชษฐพงศ์ พลอย (ฝ่ายขาย)</option>
              <option value="นราภรณ์ พงศ์วิชัย">นราภรณ์ พงศ์วิชัย (ฝ่ายบัญชี)</option>
              <option value="เจษฎากร ผลดี">เจษฎากร ผลดี (ฝ่ายผลิต)</option>
            </select>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">รายละเอียด</label>
              <input 
                type="text" 
                placeholder="หัวข้อ *" 
                value={newExpense.subject}
                onChange={(e) => setNewExpense({ ...newExpense, subject: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-inner"
              />
            </div>
            <div className="flex flex-col gap-2">
              <textarea 
                rows={4} 
                placeholder="รายละเอียด" 
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">วันที่ใช้จ่าย</label>
            <div className="relative group">
              <input 
                type="text" 
                title="วันที่ใช้จ่าย"
                placeholder="วว/ดด/ปปปป"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full pl-5 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-inner"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Items Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-black text-slate-800 tracking-tight">รายการ</span>
              <button 
                onClick={handleAddItem}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border-2 border-sky-400 hover:border-sky-500 text-sky-500 hover:text-sky-600 rounded-2xl text-[13px] font-black transition-all shadow-sm active:scale-95"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                <span>เพิ่มรายการ</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 p-6 bg-slate-50/50 rounded-[28px] border border-slate-200/60 shadow-inner">
              {newExpense.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex-1">
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setActiveCategoryDropdown(activeCategoryDropdown === index ? null : index)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 flex items-center justify-between shadow-sm cursor-pointer hover:border-indigo-300 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span>{
                            item.category === "ค่าเดินทาง" ? "🚗" :
                            item.category === "ค่าขนส่ง" ? "🚚" :
                            item.category === "ค่าน้ำมัน" ? "⛽" :
                            item.category === "ค่าที่พัก" ? "🏢" :
                            item.category === "ค่าอุปกรณ์" ? "💻" :
                            item.category === "ค่าอาหาร" ? "🍴" :
                            item.category === "ค่าเลี้ยงรับรอง" ? "🍸" :
                            item.category === "เค้กวันเกิด" ? "🎂" :
                            item.category === "ค่าเบี้ยเลี้ยง" ? "💰" :
                            item.category === "ค่าอบรม" ? "📖" :
                            item.category === "ค่ารักษาพยาบาล" ? "🏥" :
                            item.category === "ค่าคอมมิชชั่น" ? "💵" : "💬"
                          }</span>
                          <span>{item.category}</span>
                        </div>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeCategoryDropdown === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {activeCategoryDropdown === index && (
                        <>
                          {/* Backdrop to close */}
                          <div className="fixed inset-0 z-40" onClick={() => setActiveCategoryDropdown(null)} />
                          
                          <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 custom-scrollbar">
                            {[
                              { id: "ค่าเดินทาง", label: "ค่าเดินทาง", icon: "🚗" },
                              { id: "ค่าขนส่ง", label: "ค่าขนส่ง", icon: "🚚" },
                              { id: "ค่าน้ำมัน", label: "ค่าน้ำมัน", icon: "⛽" },
                              { id: "ค่าที่พัก", label: "ค่าที่พัก", icon: "🏢" },
                              { id: "ค่าอุปกรณ์", label: "ค่าอุปกรณ์", icon: "💻" },
                              { id: "ค่าอาหาร", label: "ค่าอาหาร", icon: "🍴" },
                              { id: "ค่าเลี้ยงรับรอง", label: "ค่าเลี้ยงรับรอง", icon: "🍸" },
                              { id: "เค้กวันเกิด", label: "เค้กวันเกิด", icon: "🎂" },
                              { id: "ค่าเบี้ยเลี้ยง", label: "ค่าเบี้ยเลี้ยง", icon: "💰" },
                              { id: "ค่าอบรม", label: "ค่าอบรม", icon: "📖" },
                              { id: "ค่ารักษาพยาบาล", label: "ค่ารักษาพยาบาล", icon: "🏥" },
                              { id: "ค่าคอมมิชชั่น", label: "ค่าคอมมิชชั่น", icon: "💵" },
                              { id: "อื่นๆ", label: "อื่นๆ", icon: "💬" }
                            ].map((cat) => (
                              <button 
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  handleItemChange(index, "category", cat.id);
                                  setActiveCategoryDropdown(null);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-bold transition-colors ${
                                  item.category === cat.id 
                                    ? "bg-sky-50 text-sky-600" 
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <span className="text-[16px]">{cat.icon}</span>
                                <span>{cat.label}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-slate-400">฿</span>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 focus:border-indigo-500 transition-all outline-none shadow-sm"
                    />
                  </div>
                  {newExpense.items.length > 1 && (
                    <button 
                      title="ลบรายการ"
                      onClick={() => handleRemoveItem(index)}
                      className="p-3 bg-white hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition-all shadow-sm"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6M1 4h22M10 4V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="text-[16px] font-black text-slate-800 text-right mt-2">
              รวมยอดค่าใช้จ่าย : <span className="text-indigo-600 text-[20px]">฿{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* File Attachment */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">ไฟล์แนบ</label>
            <div className="border-2 border-dashed border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-[28px] p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group shadow-inner">
              <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-[14px] font-bold text-slate-500">
                <span className="text-indigo-600 hover:underline">ลากไฟล์วางที่นี่</span> หรือ <span className="text-indigo-600 hover:underline">เลือกไฟล์</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">ประเภทไฟล์ .jpg .jpeg .png .pdf</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setIsCreating(false)}
              className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-2xl text-[14px] font-bold transition-all active:scale-95"
            >
              ยกเลิก
            </button>
            <button 
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#0EA5E9] hover:bg-sky-500 text-white rounded-2xl text-[14px] font-black transition-all shadow-md active:scale-95"
            >
              สร้าง
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (isWithdrawing) {
    const maxWithdrawal = 15000; // Example limit

    const handleSubmitWithdrawal = () => {
      if (!newWithdrawal.employeeName || !newWithdrawal.amount) return;

      const newRequest: ExpenseRequest = {
        id: Math.random().toString(),
        docNo: `EXP260000${expenses.length + 1}`,
        date: newWithdrawal.date,
        employeeName: newWithdrawal.employeeName,
        employeeImage: "https://i.pravatar.cc/150?u=emp",
        employeeRole: "พนักงาน",
        type: "อื่นๆ",
        amount: parseFloat(newWithdrawal.amount) || 0,
        status: "รออนุมัติ",
        description: `เบิกเงินเดือนล่วงหน้า - ${newWithdrawal.description}`,
      };

      setExpenses([newRequest, ...expenses]);
      setIsWithdrawing(false);
      setNewWithdrawal({
        employeeName: "",
        description: "",
        amount: "",
        date: "29/04/2569",
      });
    };

    return (
      <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-y-auto font-sans p-8 gap-6 animate-in fade-in duration-300">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
          <button onClick={() => setIsWithdrawing(false)} className="hover:text-indigo-600 transition-colors">ค่าใช้จ่าย & เบิกเงิน</button>
          <span>&gt;</span>
          <span className="text-slate-600">เบิกเงินเดือน</span>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-10 max-w-3xl w-full mx-auto flex flex-col gap-8">
          <h2 className="text-[24px] font-black text-slate-800 tracking-tight">เบิกเงินเดือน</h2>

          {/* Employee Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">เลือกพนักงาน *</label>
            <select 
              title="เลือกพนักงาน"
              value={newWithdrawal.employeeName}
              onChange={(e) => setNewWithdrawal({ ...newWithdrawal, employeeName: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none cursor-pointer shadow-inner"
            >
              <option value="">พนักงาน *</option>
              <option value="เชษฐพงศ์ พลอย">เชษฐพงศ์ พลอย (ฝ่ายขาย)</option>
              <option value="นราภรณ์ พงศ์วิชัย">นราภรณ์ พงศ์วิชัย (ฝ่ายบัญชี)</option>
              <option value="เจษฎากร ผลดี">เจษฎากร ผลดี (ฝ่ายผลิต)</option>
            </select>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">รายละเอียด</label>
            <textarea 
              rows={4} 
              placeholder="รายละเอียด" 
              value={newWithdrawal.description}
              onChange={(e) => setNewWithdrawal({ ...newWithdrawal, description: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none shadow-inner"
            />
          </div>

          {/* Amount Section */}
          <div className="flex flex-col gap-4">
            <div className="text-[14px] font-bold text-slate-600 flex justify-between items-center">
              <span>สามารถเบิกเงินเดือนได้ไม่เกิน :</span>
              <span className="font-black text-slate-800">฿{maxWithdrawal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">ยอดเงิน *</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[16px] font-bold text-slate-400">฿</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={newWithdrawal.amount}
                  onChange={(e) => setNewWithdrawal({ ...newWithdrawal, amount: e.target.value })}
                  className="w-full pl-10 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[16px] font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* File Attachment */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">ไฟล์แนบ</label>
            <div className="border-2 border-dashed border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-[28px] p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group shadow-inner">
              <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-[14px] font-bold text-slate-500">
                <span className="text-indigo-600 hover:underline">ลากไฟล์วางที่นี่</span> หรือ <span className="text-indigo-600 hover:underline">เลือกไฟล์</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">ประเภทไฟล์ .jpg .jpeg .png .pdf</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setIsWithdrawing(false)}
              className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-2xl text-[14px] font-bold transition-all active:scale-95"
            >
              ยกเลิก
            </button>
            <button 
              onClick={handleSubmitWithdrawal}
              className="px-8 py-3 bg-[#0EA5E9] hover:bg-sky-500 text-white rounded-2xl text-[14px] font-black transition-all shadow-md active:scale-95"
            >
              สร้าง
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (isSettingCategories) {
    const categoriesData = [
      { icon: "🚗", th: "ค่าเดินทาง", en: "Travel Expense", desc: "เบิกค่าใช้จ่ายในการเดินทาง นอกเหนือจากค่าน้ำมัน เช่น ค่ารถไฟฟ้า ค่าทางด่วน ค่าที่จอดรถ", status: "เปิดใช้งาน" },
      { icon: "🚚", th: "ค่าขนส่ง", en: "Transportation Expense", desc: "เบิกค่าขนส่งในการจัดส่งต่าง ๆ", status: "เปิดใช้งาน" },
      { icon: "⛽", th: "ค่าน้ำมัน", en: "Transportation Expense", desc: "เบิกค่าน้ำมันในการเดินทางไปปฏิบัติงานนอกสถานที่", status: "เปิดใช้งาน" },
      { icon: "🏢", th: "ค่าที่พัก", en: "Accommodation Expense", desc: "เบิกค่าที่พักในระหว่างการปฏิบัติงานนอกสถานที่", status: "เปิดใช้งาน" },
      { icon: "💻", th: "ค่าอุปกรณ์", en: "Equipment Expense", desc: "เบิกค่าอุปกรณ์ในการทำงาน", status: "เปิดใช้งาน" },
      { icon: "🍴", th: "ค่าอาหาร", en: "Food Expense", desc: "เบิกค่าสวัสดิการอาหารต่าง ๆ", status: "เปิดใช้งาน" },
      { icon: "🍸", th: "ค่าเลี้ยงรับรอง", en: "Entertainment Expense", desc: "เบิกค่าใช้จ่ายในการเลี้ยงรับรอง หรือเลี้ยงพบปะลูกค้า", status: "เปิดใช้งาน" },
      { icon: "🎂", th: "เค้กวันเกิด", en: "Birthday Cake Expense", desc: "-", status: "เปิดใช้งาน" },
      { icon: "💰", th: "ค่าเบี้ยเลี้ยง", en: "Per Diem Expense", desc: "เบิกค่าเบี้ยเลี้ยงให้พนักงานที่ปฏิบัติงานนอกเหนือจากงานที่มอบหมาย", status: "เปิดใช้งาน" },
      { icon: "📖", th: "ค่าอบรม", en: "Training Expense", desc: "เบิกค่าใช้จ่ายในการจัดอบรม", status: "เปิดใช้งาน" },
      { icon: "🏥", th: "ค่ารักษาพยาบาล", en: "Medical Expense", desc: "เบิกค่ารักษาพยาบาล เช่น ยาแก้ปวด ยาทาผิวหนัง ยาแก้แพ้", status: "เปิดใช้งาน" },
      { icon: "💵", th: "ค่าคอมมิชชั่น", en: "Commission", desc: "เบิกค่าคอมมิชชั่น", status: "เปิดใช้งาน" },
      { icon: "💬", th: "อื่นๆ", en: "Other Expense", desc: "ค่าใช้จ่ายอื่นๆ", status: "เปิดใช้งาน" },
    ];

    const filteredCats = categoriesData.filter(cat => {
      const matchesSearch = cat.th.includes(categorySearchQuery) || cat.en.toLowerCase().includes(categorySearchQuery.toLowerCase());
      const matchesStatus = categoryStatusFilter === "ทั้งหมด" || cat.status === categoryStatusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-y-auto font-sans p-8 gap-6 animate-in fade-in duration-300">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
          <button onClick={() => setIsSettingCategories(false)} className="hover:text-indigo-600 transition-colors">ค่าใช้จ่าย & เบิกเงิน</button>
          <span>&gt;</span>
          <span className="text-slate-600">ตั้งค่าหมวดหมู่</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[24px] font-black text-slate-800 tracking-tight">ตั้งค่าหมวดหมู่</h2>
          <button 
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-[16px] text-[13px] font-black transition-all shadow-lg shadow-sky-100 hover:shadow-xl active:scale-95"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>เพิ่มหมวดหมู่</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-[28px] shadow-sm border border-slate-100">
          <div className="relative group w-80">
            <input 
              type="text" 
              placeholder="ค้นหาหมวดหมู่..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-[14px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-inner"
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">สถานะ:</label>
            <select 
              title="กรองสถานะ"
              value={categoryStatusFilter}
              onChange={(e) => setCategoryStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-700 outline-none cursor-pointer shadow-inner"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="เปิดใช้งาน">เปิดใช้งาน</option>
              <option value="ปิดใช้งาน">ปิดใช้งาน</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50/80 text-[12px] font-black text-slate-500 tracking-wider">
                <tr>
                  <th className="pl-8 py-4 border-b border-slate-100 w-24">สัญลักษณ์</th>
                  <th className="px-4 py-4 border-b border-slate-100 w-48">ชื่อหมวดหมู่ (TH)</th>
                  <th className="px-4 py-4 border-b border-slate-100 w-48">ชื่อหมวดหมู่ (EN)</th>
                  <th className="px-4 py-4 border-b border-slate-100">รายละเอียด</th>
                  <th className="pr-8 py-4 border-b border-slate-100 text-center w-36">สถานะ</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-50 text-[13.5px] font-bold text-slate-600">
                {filteredCats.map((cat, index) => (
                  <tr key={index} className="group hover:bg-slate-50/30 transition-all">
                    <td className="pl-8 py-4 text-[20px]">
                      {cat.icon}
                    </td>
                    <td className="px-4 py-4 text-slate-800 font-black">
                      {cat.th}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {cat.en}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-slate-500 font-normal max-w-xs truncate md:max-w-none">
                      {cat.desc}
                    </td>
                    <td className="pr-8 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-black rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        {cat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Category Modal */}
        {isAddingCategory && (
          <div className="fixed inset-0 z-[100] bg-slate-950/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[36px] flex flex-col max-w-md w-full overflow-hidden shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] border border-slate-100 relative animate-in zoom-in-95 duration-200">
              <div className="h-2 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 flex-shrink-0" />
              
              <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0 bg-white">
                <h3 className="text-[18px] font-black text-slate-800 tracking-tight">เพิ่มหมวดหมู่</h3>
                <button 
                  title="ปิด" 
                  onClick={() => setIsAddingCategory(false)} 
                  className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:text-slate-600 transition-all"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">สัญลักษณ์ (Emoji)</label>
                  <input 
                    type="text" 
                    placeholder="เช่น 🚗, 🍔, 💼" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 focus:border-sky-400 outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">ชื่อหมวดหมู่ (TH)</label>
                  <input 
                    type="text" 
                    placeholder="ระบุชื่อภาษาไทย" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 focus:border-sky-400 outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">ชื่อหมวดหมู่ (EN)</label>
                  <input 
                    type="text" 
                    placeholder="ระบุชื่อภาษาอังกฤษ" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 focus:border-sky-400 outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">รายละเอียด</label>
                  <textarea 
                    rows={3}
                    placeholder="ระบุรายละเอียดการเบิกจ่าย..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 focus:border-sky-400 outline-none shadow-inner resize-none"
                  />
                </div>
              </div>

              <div className="p-6 flex items-center gap-3 pt-4 border-t border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setIsAddingCategory(false)}
                  className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[14px] font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={() => setIsAddingCategory(false)}
                  className="flex-1 py-3 bg-[#0EA5E9] hover:bg-sky-600 text-white text-[14px] font-black rounded-xl transition-all active:scale-95 shadow-md shadow-sky-100"
                >
                  บันทึก
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-hidden font-sans p-8 gap-6">
      
      {/* Top Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-shrink-0 bg-white p-4 rounded-[28px] shadow-sm border border-slate-100">
        
        {/* Search Bar */}
        <div className="relative group w-full lg:w-80">
          <input 
            type="text" 
            placeholder="ค้นหาค่าใช้จ่าย..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-[14px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter and Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
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

          {/* Date Range Picker & Period Filter */}
          <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200/60 rounded-2xl px-4 py-2 relative">
            {/* Period Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                className="flex items-center gap-1.5 bg-transparent text-[13px] font-bold text-slate-600 outline-none cursor-pointer hover:text-sky-500 transition-colors"
              >
                <span>{selectedPeriod}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isPeriodDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isPeriodDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPeriodDropdownOpen(false)} />
                  <div className="absolute left-0 mt-3 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {["เดือนนี้", "เดือนก่อนหน้านี้", "ปีนี้", "ปีที่แล้ว", "ปีหน้า"].map((period) => (
                      <button 
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setIsPeriodDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${selectedPeriod === period ? 'bg-sky-50 text-sky-600' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-4 bg-slate-200 mx-1" />

            <button title="ก่อนหน้า" className="text-slate-400 hover:text-slate-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
            
            <button 
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="text-[13px] font-bold text-slate-600 hover:text-sky-500 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span>{startDate.split('-').reverse().join('/')} - {endDate.split('-').reverse().join('/')}</span>
            </button>

            {isDatePickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDatePickerOpen(false)} />
                <div className="absolute left-1/2 -translate-x-1/2 mt-12 bg-white rounded-[28px] shadow-2xl border border-slate-100/80 p-6 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-4 w-72">
                  <div className="text-[14px] font-black text-slate-700 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>เลือกวันเดือนปี</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">จากวันที่</label>
                    <input 
                      type="date"
                      title="จากวันที่"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 focus:border-sky-400 outline-none shadow-inner"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">ถึงวันที่</label>
                    <input 
                      type="date"
                      title="ถึงวันที่"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 focus:border-sky-400 outline-none shadow-inner"
                    />
                  </div>

                  <button 
                    onClick={() => setIsDatePickerOpen(false)}
                    className="mt-2 w-full py-2.5 bg-[#0EA5E9] hover:bg-sky-600 text-white text-[13px] font-bold rounded-xl transition-all shadow-md shadow-sky-100 active:scale-95"
                  >
                    บันทึก
                  </button>
                </div>
              </>
            )}

            <button title="ถัดไป" className="text-slate-400 hover:text-slate-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 rounded-2xl text-[13px] font-bold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>ตั้งค่า</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isSettingsDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSettingsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button 
                      onClick={() => {
                        setIsSettingCategories(true);
                        setIsSettingsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      หมวดหมู่
                    </button>
                    <button 
                      onClick={() => setIsSettingsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      ค่าใช้จ่าย
                    </button>
                    <button 
                      onClick={() => {
                        setIsWithdrawing(true);
                        setIsSettingsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      เบิกเงินเดือน
                    </button>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-2xl text-[15px] font-bold transition-all shadow-md active:scale-95"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span>สร้าง</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    onClick={() => {
                      setIsCreating(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>สร้างค่าใช้จ่าย</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsWithdrawing(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>เบิกเงินเดือน</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Request Count */}
      <div className="text-[13px] font-bold text-slate-500 px-2">
        {filteredExpenses.length} คำขอ
      </div>

      {/* Main Content / Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 text-[12px] font-black text-slate-500 tracking-wider">
              <tr>
                <th className="pl-8 py-4 w-12 border-b border-slate-100">
                  <input 
                    type="checkbox" 
                    title="เลือกทั้งหมด"
                    className="w-4.5 h-4.5 rounded-md border-2 border-slate-300 text-sky-500 focus:ring-sky-500/20 transition-all cursor-pointer"
                    checked={selectedExpenses.length === filteredExpenses.length && filteredExpenses.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-sky-600 transition-colors">
                    <span>เลขที่</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-sky-600 transition-colors">
                    <span>สถานะ</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">ผู้สร้างเอกสาร</th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-sky-600 transition-colors">
                    <span>หัวข้อ</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">หมวดหมู่</th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-sky-600 transition-colors">
                    <span>วันที่สร้าง</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-sky-600 transition-colors">
                    <span>วันที่ใช้จ่าย</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </th>
                <th className="px-4 py-4 border-b border-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-sky-600 transition-colors">
                    <span>วันที่ชำระเงิน</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </th>
                <th className="px-6 py-4 bg-[#0EA5E9] text-white font-black text-center border-b border-sky-600 whitespace-nowrap w-44">
                  รวมยอดค่าใช้จ่าย
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50 text-[13px] font-bold text-slate-600">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-[15px] font-black text-slate-400">ไม่มีข้อมูล</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="group hover:bg-slate-50/40 transition-all">
                    <td className="pl-8 py-4">
                      <input 
                        type="checkbox" 
                        title="เลือกรายการ"
                        className="w-4.5 h-4.5 rounded-md border-2 border-slate-300 text-sky-500 focus:ring-sky-500/20 transition-all cursor-pointer"
                        checked={selectedExpenses.includes(exp.id)}
                        onChange={() => handleSelectRow(exp.id)}
                      />
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {exp.docNo}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-sky-50 border border-sky-100 text-sky-500 text-[11px] font-black rounded-full">
                        รอดำเนินการ
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <img src={exp.employeeImage} alt="" className="w-9 h-9 rounded-xl object-cover shadow-sm border border-slate-100 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13.5px] font-black text-slate-700 truncate">{exp.employeeName}</span>
                          <span className="text-[11px] font-bold text-slate-400 mt-0.5 truncate">{exp.employeeRole}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-black max-w-[120px] truncate">
                      {exp.description.replace("เบิกเงินเดือนล่วงหน้า - ", "")}
                    </td>
                    <td className="px-4 py-4 text-slate-600 flex items-center gap-1.5">
                      <span className="text-[16px]">{categoryIcons[exp.type] || "💬"}</span>
                      <span className="font-bold">{exp.type}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {exp.date}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {exp.date}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      -
                    </td>
                    <td className="px-6 py-4 bg-sky-50/50 text-[#0EA5E9] font-black text-[15px] text-center">
                      ฿{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-white z-10 text-[13px] font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <select title="จำนวนแถว" className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none cursor-pointer">
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <button title="เลื่อนซ้าย" className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button title="เลื่อนขวา" className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button title="หน้าก่อน" className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="w-8 h-8 flex items-center justify-center bg-[#0EA5E9] text-white rounded-full font-black text-[14px] shadow-md shadow-sky-100">1</span>
            <button title="หน้าถัดไป" className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Create Reimbursement Modal */}
      {isFormOpen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[36px] flex flex-col max-w-md w-full overflow-hidden shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] animate-in zoom-in-95 duration-300 border border-slate-100 relative">
            
            <div className="h-2 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 flex-shrink-0" />

            <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0 bg-white">
              <h3 className="text-[18px] font-black text-slate-800 tracking-tight">สร้างคำขอเบิกเงิน</h3>
              <button 
                title="ปิด" 
                onClick={() => setIsFormOpen(false)} 
                className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:text-slate-600 transition-all"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto min-h-0">
              <div className="space-y-1.5">
                <label htmlFor="employee-name" className="text-[11px] font-black text-slate-400 uppercase tracking-wider">ชื่อพนักงาน</label>
                <input 
                  id="employee-name" 
                  type="text" 
                  placeholder="ระบุชื่อพนักงาน..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">ประเภทค่าใช้จ่าย</label>
                <select 
                  title="ประเภทค่าใช้จ่าย" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option>ค่าเดินทาง</option>
                  <option>ค่ารับรองลูกค้า</option>
                  <option>อุปกรณ์สำนักงาน</option>
                  <option>อื่นๆ</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="amount" className="text-[11px] font-black text-slate-400 uppercase tracking-wider">จำนวนเงิน (บาท)</label>
                <input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="desc" className="text-[11px] font-black text-slate-400 uppercase tracking-wider">รายละเอียด</label>
                <textarea 
                  id="desc" 
                  rows={3} 
                  placeholder="ระบุรายละเอียดการเบิกเงิน..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex items-center gap-3 flex-shrink-0 bg-white">
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-2xl text-[14px] font-bold transition-all"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleCreateRequest} 
                className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-[14px] font-black transition-all shadow-md shadow-sky-100 active:scale-95"
              >
                บันทึก
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
