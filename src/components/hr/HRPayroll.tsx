"use client";

import { useState, useEffect } from "react";

export default function HRPayroll() {
 const [activeTab, setActiveTab] = useState("รอทำเงินเดือน");
 const [isCreatingPeriod, setIsCreatingPeriod] = useState(false);
 const [selectedYear, setSelectedYear] = useState("2569");
 const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
 const [isHiddenAmounts, setIsHiddenAmounts] = useState(false);
 const [periodStatusFilter, setPeriodStatusFilter] = useState("ทั้งหมด");
 const [selectedPeriodDetails, setSelectedPeriodDetails] = useState<number | null>(null);
 const [isCalculated, setIsCalculated] = useState(false);
 const [workflowStep, setWorkflowStep] = useState(1);
 const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
 const [isPaid, setIsPaid] = useState(false);
 const [isPeriodClosed, setIsPeriodClosed] = useState(false);
 const [toast, setToast] = useState<string | null>(null);
 const [isCreatePeriodDropdownOpen, setIsCreatePeriodDropdownOpen] = useState(false);
 const [allowEmployeeViewSlip, setAllowEmployeeViewSlip] = useState(true);
 const [viewSlipFromStatus, setViewSlipFromStatus] = useState("คำนวณแล้ว");
 const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
 const [allowEmailDelivery, setAllowEmailDelivery] = useState(true);
 const [payType, setPayType] = useState("รายเดือน");
 const [paymentDay, setPaymentDay] = useState("วันสุดท้ายของงวด");
 const [paymentFrequency, setPaymentFrequency] = useState("เดือนละ 1 ครั้ง");
 const [paymentDayWeekly, setPaymentDayWeekly] = useState("ศุกร์");
 const [isCreatingSupplementaryPeriod, setIsCreatingSupplementaryPeriod] = useState(false);
 const [isEarningsSettingsOpen, setIsEarningsSettingsOpen] = useState(false);
 const [earningsTab, setEarningsTab] = useState("เงินได้");
 const [activeEditingEarning, setActiveEditingEarning] = useState<string | null>(null);
 const [monthlyCalcType, setMonthlyCalcType] = useState("ตามจำนวนวันในเดือนนั้น ๆ");
 const [customDividerCheck, setCustomDividerCheck] = useState(false);
 const [customMultiplierCheck, setCustomMultiplierCheck] = useState(false);
 const [paymentDay2, setPaymentDay2] = useState("วันสุดท้ายของงวด");
 const [limitPaymentAmount, setLimitPaymentAmount] = useState(false);
 const [limitSalaryBase, setLimitSalaryBase] = useState(false);
 const [maxLimitAmount, setMaxLimitAmount] = useState("0");
 const [welfareMonthlyToggle, setWelfareMonthlyToggle] = useState(true);
 const [welfareDailyToggle, setWelfareDailyToggle] = useState(false);
 const [welfareMonthlyEligible, setWelfareMonthlyEligible] = useState("พนักงานทุกคน");
 const [welfareMonthlyCalcType, setWelfareMonthlyCalcType] = useState("คิดตามวันทำงาน");

 useEffect(() => {
 if (toast) {
 const timer = setTimeout(() => {
 setToast(null);
 }, 3000);
 return () => clearTimeout(timer);
 }
 }, [toast]);
 const [employeesState, setEmployeesState] = useState([
 { id: "2400001", name: "ทิติมา พาณุเวช (เจ้าของ...)", role: "ฝ่าย ขาย", base: 30000, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 30100, img: "👩‍💼", bankAcc: "123-4-56789-0", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400002", name: "(ตี๋) เจษฎากร ผลดี", role: "แผนก การสรรหาและคัดเลือก...", base: 34500, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 34600, img: "👨‍💼", bankAcc: "0000000000000", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400003", name: "( จิ๊บ ) จิตนันท์ โปตานนท์", role: "แผนก การส่งเสริมการขาย", base: 45000, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 45100, img: "👩‍💻", bankAcc: "984-6-53770-9", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400004", name: "(ซานิ) ภัทรานันท์ พงศ์วินิช", role: "แผนก การพัฒนาผลิตภัณฑ์ใหม่", base: 24500, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 24600, img: "👩‍🎨", bankAcc: "760-3-98776-4", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400005", name: "(กิต) กิตติพงศ์ พัฒนวิจิตร", role: "ฝ่าย ขาย", base: 61000, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 61100, img: "👨‍💻", bankAcc: "765900873", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400006", name: "(น้ำใส) นฤมล พรจิต", role: "แผนก การสรรหาและคัดเลือก...", base: 26000, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 26100, img: "👩‍🔬", bankAcc: "938-5-78339-0", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400007", name: "(กร) ศิวะกร อำไพรพงษ์...", role: "แผนก การส่งเสริมการขาย", base: 56000, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 56100, img: "👨‍🔬", bankAcc: "874-6-53850-6", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400008", name: "(ป๊อบ) อิทธิพงศ์ พงศ์วินิช", role: "แผนก การสรรหาและคัดเลือก...", base: 25000, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 25100, img: "👨‍🔧", bankAcc: "67895433309", bankName: "ธนาคารกสิกรไทย" },
 { id: "2400009", name: "(พลอย) นันธิชา นาร่อง", role: "แผนก การส่งเสริมการขาย", base: 27500, ot: 0, diligence: 100, bonus: 0, comm: 0, retro: 0, claims: 0, others: 0, tax: 0, sso: 0, studentLoan: 0, unpaidLeave: 0, late: 0, absent: 0, early: 0, advance: 0, forgotOut: 0, otherDeduct: 0, net: 27600, img: "👩‍🔧", bankAcc: "65790320956", bankName: "ธนาคารกสิกรไทย" },
 ]);
 const handleCalculate = () => {
 const inputs = document.querySelectorAll('input[data-emp-id]');
 const updates = [...employeesState];
 
 inputs.forEach((input: any) => {
 const empId = input.getAttribute('data-emp-id');
 const field = input.getAttribute('data-field');
 const val = parseFloat(input.value.replace(/,/g, '')) || 0;
 
 const empIndex = updates.findIndex(e => e.id === empId);
 if (empIndex !== -1) {
 updates[empIndex] = {
 ...updates[empIndex],
 [field]: val
 };
 }
 });
 
 const finalUpdates = updates.map(emp => {
 const earnings = (emp.base || 0) + (emp.ot || 0) + (emp.diligence || 0) + (emp.bonus || 0) + (emp.comm || 0) + (emp.retro || 0) + (emp.claims || 0) + (emp.others || 0);
 const deductions = (emp.tax || 0) + (emp.sso || 0) + (emp.studentLoan || 0) + (emp.unpaidLeave || 0) + (emp.late || 0) + (emp.absent || 0) + (emp.early || 0) + (emp.advance || 0) + (emp.forgotOut || 0) + (emp.otherDeduct || 0);
 return {
 ...emp,
 net: earnings - deductions
 };
 });
 
 setEmployeesState(finalUpdates);
 setIsCalculated(true);
 };



 const tabs = [
 { id: "รอทำเงินเดือน", label: "รอทำเงินเดือน", count: 0 },
 { id: "งวดทั้งหมด", label: "งวดทั้งหมด", count: 3 },
 { id: "เงินสะสมประจำปี", label: "เงินสะสมประจำปี", count: null },
 { id: "ตั้งค่าสลิปเงินเดือน", label: "ตั้งค่าสลิปเงินเดือน", count: null },
 ];

 if (selectedPeriodDetails !== null) {
 const mockEmployees = employeesState;
 const totalBase = employeesState.reduce((sum, emp) => sum + (emp.base || 0), 0);
 const totalOt = employeesState.reduce((sum, emp) => sum + (emp.ot || 0), 0);
 const totalDiligence = employeesState.reduce((sum, emp) => sum + (emp.diligence || 0), 0);
 const totalBonus = employeesState.reduce((sum, emp) => sum + (emp.bonus || 0), 0);
 const totalComm = employeesState.reduce((sum, emp) => sum + (emp.comm || 0), 0);
 const totalRetro = employeesState.reduce((sum, emp) => sum + (emp.retro || 0), 0);
 const totalClaims = employeesState.reduce((sum, emp) => sum + (emp.claims || 0), 0);
 const totalOthers = employeesState.reduce((sum, emp) => sum + (emp.others || 0), 0);
 const totalTax = employeesState.reduce((sum, emp) => sum + (emp.tax || 0), 0);
 const totalSso = employeesState.reduce((sum, emp) => sum + (emp.sso || 0), 0);
 const totalStudentLoan = employeesState.reduce((sum, emp) => sum + (emp.studentLoan || 0), 0);
 const totalUnpaidLeave = employeesState.reduce((sum, emp) => sum + (emp.unpaidLeave || 0), 0);
 const totalLate = employeesState.reduce((sum, emp) => sum + (emp.late || 0), 0);
 const totalAbsent = employeesState.reduce((sum, emp) => sum + (emp.absent || 0), 0);
 const totalEarly = employeesState.reduce((sum, emp) => sum + (emp.early || 0), 0);
 const totalAdvance = employeesState.reduce((sum, emp) => sum + (emp.advance || 0), 0);
 const totalForgotOut = employeesState.reduce((sum, emp) => sum + (emp.forgotOut || 0), 0);
 const totalOtherDeduct = employeesState.reduce((sum, emp) => sum + (emp.otherDeduct || 0), 0);
 const totalNet = employeesState.reduce((sum, emp) => sum + (emp.net || 0), 0);

 return (
 <div className="flex-1 bg-[#F1F5F9] flex flex-col h-full overflow-y-auto font-sans p-8 gap-6 animate-in fade-in duration-300 relative">
 {toast && (
 <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-[#0EA5E9] text-white px-6 py-3 rounded-2xl text-[13.5px] font-black shadow-lg shadow-sky-500/20 animate-in slide-in-from-top duration-300">
 <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
 </svg>
 <span>{toast}</span>
 </div>
 )}
 {/* Breadcrumbs */}
 <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
 <button onClick={() => setSelectedPeriodDetails(null)} className="hover:text-indigo-600 transition-colors">เงินเดือน</button>
 <span>&gt;</span>
 <span className="text-slate-600">งวดเงินเดือน</span>
 </div>

 {/* Header Section */}
 <div className="flex items-start justify-between gap-6 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
 <div className="flex flex-col gap-2">
 <span className="text-[13px] font-black text-slate-400 tracking-wider">งวดที่ {selectedPeriodDetails}</span>
 <div className="flex items-center gap-3">
 <h2 className="text-[22px] font-black text-slate-800 tracking-tight">01/10/2569 - 31/10/2569</h2>
 <span className={`inline-flex items-center px-2.5 py-1 text-[11.5px] font-black rounded-lg border ${
 workflowStep === 1 
 ? "bg-orange-50 text-orange-500 border-orange-100/60" 
 : workflowStep === 2
 ? "bg-blue-50 text-blue-500 border-blue-100/60"
 : isPaid
 ? "bg-emerald-50 text-emerald-500 border-emerald-100/60"
 : "bg-indigo-50 text-indigo-500 border-indigo-100/60"
 }`}>
 {workflowStep === 1 ? "รอคำนวณ" : workflowStep === 2 ? "รออนุมัติ" : isPaid ? "รอปิดงวด" : "รอชำระเงิน"}
 </span>
 <button title="แก้ไข" aria-label="แก้ไขงวดเงินเดือน" id="payroll-edit-period-btn" className="text-slate-400 hover:text-slate-600 transition-all">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
 </svg>
 </button>
 </div>

 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-[13px] font-bold text-slate-500">
 <div className="flex items-center gap-1.5">
 <span className="text-slate-400 font-medium">พนักงาน</span>
 <span className="text-slate-800">{mockEmployees.length} คน</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-slate-400 font-medium">ประเภทการจ่ายเงิน</span>
 <span className="text-slate-800 flex items-center gap-1">
 📅 รายเดือน
 </span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-slate-400 font-medium">วันที่ชำระ</span>
 <span className="text-slate-800">01/11/2569</span>
 </div>
 </div>
 </div>

 {/* Workflow Steps Tracker */}
 <div className="flex items-center gap-8 pr-4">
 {[
 { step: 1, label: "คำนวณ", active: workflowStep >= 1, completed: workflowStep > 1 },
 { step: 2, label: "อนุมัติ", active: workflowStep === 2, completed: workflowStep > 2 },
 { step: 3, label: "ชำระเงิน", active: workflowStep === 3, completed: workflowStep > 3 },
 ].map((wf, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="flex flex-col items-center gap-1.5">
 <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
 wf.completed 
 ? "bg-sky-500 text-white shadow-md shadow-sky-100" 
 : wf.active 
 ? "bg-sky-500 text-white shadow-md shadow-sky-100" 
 : "bg-slate-200 text-slate-500"
 }`}>
 {wf.completed ? (
 <svg className="w-3 h-3 text-white animate-in zoom-in duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 5" />
 </svg>
 ) : wf.step}
 </span>
 <span className={`text-[13px] font-bold transition-colors duration-300 ${
 wf.active || wf.completed ? "text-sky-500" : "text-slate-400"
 }`}>{wf.label}</span>
 </div>
 {i < 2 && <div className={`w-12 h-0.5 -mt-4 transition-colors duration-300 ${wf.completed ? "bg-sky-500" : "bg-slate-100"}`} />}
 </div>
 ))}
 </div>
 </div>

 {/* Filter Controls Row */}
 <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-[28px] shadow-sm border border-slate-100 flex-wrap">
 <div className="flex items-center gap-3">
 <button onClick={() => setIsHiddenAmounts(!isHiddenAmounts)}
 className={`p-3 bg-slate-50 border border-slate-200/60 text-slate-400 hover:text-slate-600 rounded-2xl transition-all ${isHiddenAmounts ? 'text-sky-500 bg-sky-50/20' : ''}`}
 title={isHiddenAmounts ? "แสดงยอดเงิน" : "ซ่อนยอดเงิน"}
 aria-label={isHiddenAmounts ? "แสดงยอดเงิน" : "ซ่อนยอดเงิน"}
 id="payroll-toggle-amounts-btn"
 >
 {isHiddenAmounts ? (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
 </svg>
 ) : (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 )}
 </button>

 <div className="relative">
 <div className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-black text-slate-400 tracking-wider">รายชื่อพนักงาน</div>
 <select 
 title="รายชื่อพนักงาน"
 aria-label="รายชื่อพนักงาน"
 id="payroll-employee-filter-select"
 className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer"
 >
 <option>ทั้งหมด</option>
 </select>
 </div>

 <div className="relative">
 <div className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-black text-slate-400 tracking-wider">การแสดงผล</div>
 <select 
 title="การแสดงผล"
 aria-label="การแสดงผล"
 id="payroll-display-mode-select"
 className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer"
 >
 <option>โปรไฟล์, แผนก, เลขบัญชี...</option>
 </select>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl text-[13.5px] font-bold transition-all active:scale-95">
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
 </svg>
 <span>ดาวน์โหลดเอกสาร</span>
 </button>

 <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl text-[13.5px] font-bold transition-all active:scale-95">
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span>ประวัติการดำเนินการ</span>
 </button>
 </div>
 </div>
 {/* Actions Row */}
 <div className="flex items-center justify-between bg-white/50 p-2 px-3 rounded-[24px] border border-slate-100 flex-wrap gap-4">
 {workflowStep === 1 ? (
 <>
 <div>
 <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-[13px] font-bold transition-all shadow-sm active:scale-95">
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.356-2m15.356 2H15" />
 </svg>
 <span>รีเซ็ตข้อมูล</span>
 <svg className="w-3.5 h-3.5 text-slate-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
 </svg>
 </button>
 </div>

 <div className="flex items-center gap-3">
 <button onClick={handleCalculate} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-[13px] font-bold transition-all shadow-sm active:scale-95">
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
 </svg>
 <span>คำนวณเงินเดือน</span>
 </button>

 <button onClick={() => isCalculated && setWorkflowStep(2)} 
 disabled={!isCalculated}
 className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-black transition-all active:scale-95 ${
 isCalculated 
 ? "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white shadow-md shadow-sky-500/10 cursor-pointer" 
 : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
 }`}
 title={!isCalculated ? "กรุณากดคำนวณเงินเดือนก่อน" : ""}
 >
 <span>ส่งตรวจสอบ</span>
 <svg className={`w-4 h-4 ${isCalculated ? "text-white" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
 </svg>
 </button>
 </div>
 </>
 ) : workflowStep === 2 ? (
 <>
 <div>
 <button onClick={() => setWorkflowStep(1)} className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-slate-50 text-sky-500 border border-sky-400/60 rounded-xl text-[13px] font-bold transition-all shadow-sm active:scale-95">
 <span>ย้อนกลับ</span>
 </button>
 </div>

 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-[13px] font-bold transition-all shadow-sm active:scale-95">
 <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
 </svg>
 <span>อัปโหลดเอกสารอนุมัติ (ถ้ามี)</span>
 </button>

 <button onClick={() => setWorkflowStep(3)} className="flex items-center gap-2 px-5 py-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white rounded-xl text-[13px] font-bold transition-all shadow-md shadow-sky-500/10 active:scale-95">
 <span>อนุมัติ</span>
 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
 </svg>
 </button>
 </div>
 </>
 ) : (
 <>
 <div>
 <button onClick={() => setWorkflowStep(2)} className="flex items-center gap-2 px-6 py-2 bg-white hover:bg-sky-50/50 text-[#0EA5E9] border border-[#0EA5E9] rounded-xl text-[13px] font-black transition-all shadow-sm active:scale-95">
 <span>ย้อนกลับ</span>
 </button>
 </div>

 <div className="flex items-center gap-3">
 {!isPaid && (
 <button onClick={() => {
 if (selectedEmpIds.length > 0) {
 setIsPaid(true);
 setToast("ชำระเงินสำเร็จแล้ว");
 }
 }}
 disabled={selectedEmpIds.length === 0}
 className={`flex items-center gap-2 px-5 py-2 border rounded-xl text-[13px] font-black transition-all active:scale-95 ${
 selectedEmpIds.length > 0 
 ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm cursor-pointer" 
 : "bg-slate-100 text-slate-300 border-slate-200/60 cursor-not-allowed"
 }`}
 title={selectedEmpIds.length === 0 ? "กรุณาเลือกพนักงานอย่างน้อย 1 คน" : ""}
 >
 <svg className={`w-4 h-4 ${selectedEmpIds.length > 0 ? "text-slate-500" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span>ชำระเงิน</span>
 </button>
 )}

 {!isPeriodClosed && (
 <button onClick={() => {
 setIsPeriodClosed(true);
 setToast("ปิดงวดแล้ว");
 }}
 className="flex items-center gap-2 px-6 py-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white rounded-xl text-[13px] font-black transition-all shadow-md shadow-sky-500/10 active:scale-95"
 >
 <span>ปิดงวด</span>
 </button>
 )}
 </div>
 </>
 )}
 </div>
 {/* Table Workspace */}
 <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
 {workflowStep <= 2 ? (
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[1600px]">
 <thead className="bg-slate-50 text-[12px] font-black text-slate-500 tracking-wider whitespace-nowrap">
 <tr>
 <th className="sticky left-0 z-20 bg-slate-50 pl-8 py-4 border-b border-slate-100 w-[100px] min-w-[100px] max-w-[100px]">รหัส</th>
 <th className="sticky left-[100px] z-20 bg-slate-50 px-4 py-4 border-b border-slate-100 w-60">พนักงาน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-36 bg-emerald-50 text-emerald-700">เงินเดือน / ค่าจ้าง</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">ค่าโอที</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">เบี้ยขยัน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">โบนัส</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">ค่าคอมมิชชั่น</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">เงินตกเบิก</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">เบิกค่าใช้จ่าย</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">เงินได้อื่นๆ</th>
 <th className="px-4 py-4 border-b border-slate-100 w-32 bg-rose-50 text-rose-700 text-center">ภาษีหัก ณ ที่จ่าย</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">ประกันสังคม</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">เงินกู้ กยศ.</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">หักลาไม่รับค่าจ้าง</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">หักมาสาย</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">หักขาดงาน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">หักกลับก่อน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">เบิกเงินเดือน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">หักลืมลงเวลาออก</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 bg-rose-50 text-rose-700 text-center">เงินหักอื่นๆ</th>
 <th className="sticky right-0 z-20 bg-sky-50 pr-8 py-4 border-b border-slate-100 w-40 text-right text-[#0EA5E9] font-black shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">ยอดชำระสุทธิ</th>
 </tr>
 </thead>
 
 <tbody className="divide-y divide-slate-50 text-[13.5px] font-bold text-slate-600 whitespace-nowrap">
 {employeesState.map((emp, index) => (
 <tr key={index} className="group hover:bg-slate-50/30 transition-all">
 <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors pl-8 py-4 text-slate-400 font-medium w-[100px] min-w-[100px] max-w-[100px]">
 {emp.id}
 </td>
 <td className="sticky left-[100px] z-10 bg-white group-hover:bg-slate-50 transition-colors px-4 py-4">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-[18px] shadow-sm border border-white">
 {emp.img}
 </div>
 <div className="flex flex-col">
 <div className="flex items-center gap-1">
 <span className="text-slate-800 font-black">{emp.name}</span>
 <span className="w-4 h-4 flex items-center justify-center bg-rose-500 text-white rounded-full text-[9px] font-black">!</span>
 </div>
 <span className="text-[11px] font-bold text-slate-400">{emp.role}</span>
 </div>
 </div>
 </td>
 <td className="px-4 py-4 text-slate-800 font-black bg-emerald-50/10">
 {isHiddenAmounts ? "฿ ••••" : `฿${emp.base.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
 </td>
 {/* Inputs */}
 <td className="px-4 py-4 text-center">
 <input data-emp-id={emp.id} data-field="ot" title="ค่าโอที" aria-label={`${emp.name} ค่าโอที`} type="text" defaultValue={emp.ot === 0 ? "" : emp.ot} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center">
 <input data-emp-id={emp.id} data-field="diligence" title="เบี้ยขยัน" aria-label={`${emp.name} เบี้ยขยัน`} type="text" defaultValue={emp.diligence === 0 ? "" : emp.diligence} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center">
 <input data-emp-id={emp.id} data-field="bonus" title="โบนัส" aria-label={`${emp.name} โบนัส`} type="text" defaultValue={emp.bonus === 0 ? "" : emp.bonus} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center">
 <input data-emp-id={emp.id} data-field="comm" title="ค่าคอมมิชชั่น" aria-label={`${emp.name} ค่าคอมมิชชั่น`} type="text" defaultValue={emp.comm === 0 ? "" : emp.comm} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center">
 <input data-emp-id={emp.id} data-field="retro" title="เงินตกเบิก" aria-label={`${emp.name} เงินตกเบิก`} type="text" defaultValue={emp.retro === 0 ? "" : emp.retro} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center">
 <input data-emp-id={emp.id} data-field="claims" title="เบิกค่าใช้จ่าย" aria-label={`${emp.name} เบิกค่าใช้จ่าย`} type="text" defaultValue={emp.claims === 0 ? "" : emp.claims} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center">
 <input data-emp-id={emp.id} data-field="others" title="เงินได้อื่นๆ" aria-label={`${emp.name} เงินได้อื่นๆ`} type="text" defaultValue={emp.others === 0 ? "" : emp.others} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="tax" title="ภาษีหัก ณ ที่จ่าย" aria-label={`${emp.name} ภาษีหัก ณ ที่จ่าย`} type="text" defaultValue={emp.tax === 0 ? "" : emp.tax} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="sso" title="ประกันสังคม" aria-label={`${emp.name} ประกันสังคม`} type="text" defaultValue={emp.sso === 0 ? "" : emp.sso} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="studentLoan" title="เงินกู้ กยศ." aria-label={`${emp.name} เงินกู้ กยศ.`} type="text" defaultValue={emp.studentLoan === 0 ? "" : emp.studentLoan} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="unpaidLeave" title="หักลาไม่รับค่าจ้าง" aria-label={`${emp.name} หักลาไม่รับค่าจ้าง`} type="text" defaultValue={emp.unpaidLeave === 0 ? "" : emp.unpaidLeave} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="late" title="หักมาสาย" aria-label={`${emp.name} หักมาสาย`} type="text" defaultValue={emp.late === 0 ? "" : emp.late} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="absent" title="หักขาดงาน" aria-label={`${emp.name} หักขาดงาน`} type="text" defaultValue={emp.absent === 0 ? "" : emp.absent} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="early" title="หักกลับก่อน" aria-label={`${emp.name} หักกลับก่อน`} type="text" defaultValue={emp.early === 0 ? "" : emp.early} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="advance" title="เบิกเงินเดือน" aria-label={`${emp.name} เบิกเงินเดือน`} type="text" defaultValue={emp.advance === 0 ? "" : emp.advance} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="forgotOut" title="หักลืมลงเวลาออก" aria-label={`${emp.name} หักลืมลงเวลาออก`} type="text" defaultValue={emp.forgotOut === 0 ? "" : emp.forgotOut} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="px-4 py-4 text-center bg-rose-50/5">
 <input data-emp-id={emp.id} data-field="otherDeduct" title="เงินหักอื่นๆ" aria-label={`${emp.name} เงินหักอื่นๆ`} type="text" defaultValue={emp.otherDeduct === 0 ? "" : emp.otherDeduct} placeholder="-" className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 focus:border-sky-400 outline-none shadow-inner" />
 </td>
 <td className="sticky right-0 z-10 bg-sky-50 group-hover:bg-sky-100 transition-colors pr-8 py-4 text-right text-[#0EA5E9] font-black text-[14px] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">
 {isHiddenAmounts ? "฿ ••••" : isCalculated ? `฿${emp.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "฿0.00"}
 </td>
 </tr>
 ))}
 
 {/* Summary Row */}
 <tr className="bg-slate-50/40 text-[13.5px] font-black text-slate-800">
 <td colSpan={2} className="sticky left-0 z-10 bg-slate-50/80 group-hover:bg-slate-100 transition-colors pl-8 py-4 text-center text-slate-500">รวม</td>
 <td className="px-4 py-4 text-slate-800">฿{totalBase.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600">฿{totalOt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600">฿{totalDiligence.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600">฿{totalBonus.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600">฿{totalComm.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600">฿{totalRetro.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600">฿{totalClaims.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600">฿{totalOthers.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalSso.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalStudentLoan.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalUnpaidLeave.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalLate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalAbsent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalEarly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalAdvance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalForgotOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-slate-600 bg-rose-50/5">฿{totalOtherDeduct.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="sticky right-0 z-20 bg-sky-50 group-hover:bg-sky-100 transition-colors pr-8 py-4 text-right text-[#0EA5E9] font-black text-[14px] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">฿{isCalculated ? totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}</td>
 </tr>
 </tbody>
 </table>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[1200px]">
 <thead className="bg-slate-50 text-[12px] font-black text-slate-500 tracking-wider whitespace-nowrap">
 <tr>
 <th className="sticky left-0 z-20 bg-slate-50 pl-8 py-4 border-b border-slate-100 w-[100px] min-w-[100px] max-w-[100px]">รหัส</th>
 <th className="sticky left-[100px] z-20 bg-slate-50 px-4 py-4 border-b border-slate-100 w-60">พนักงาน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-48">บัญชีรับเงิน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-36 bg-emerald-50/40 text-emerald-700">เงินเดือน / ค่าจ้าง</th>
 <th className="px-4 py-4 border-b border-slate-100 w-36 text-center bg-emerald-50/20 text-emerald-600">รวมเงินได้</th>
 <th className="px-4 py-4 border-b border-slate-100 w-36 text-center bg-rose-50/20 text-rose-600">รวมเงินหัก</th>
 <th className="px-4 py-4 border-b border-slate-100 w-40 text-right text-[#0EA5E9] font-black bg-sky-50/40">ยอดชำระสุทธิ</th>
 {!isPaid && <th className="px-4 py-4 border-b border-slate-100 w-36 text-center">สถานะ</th>}
 {!isPaid && (
 <th className="pr-8 py-4 border-b border-slate-100 w-16 text-center">
 <input 
 type="checkbox" 
 title="เลือกทั้งหมด"
 aria-label="เลือกพนักงานทั้งหมด"
 id="payroll-select-all-checkbox"
 checked={selectedEmpIds.length === employeesState.length && employeesState.length > 0}
 onChange={(e) => {
 if (e.target.checked) {
 setSelectedEmpIds(employeesState.map(emp => emp.id));
 } else {
 setSelectedEmpIds([]);
 }
 }}
 className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400 cursor-pointer" 
 />
 </th>
 )}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-[13px] font-bold text-slate-700 whitespace-nowrap">
 {employeesState.map((emp) => {
 const totalEarnings = isCalculated ? (emp.base + emp.ot + emp.diligence + emp.bonus + emp.comm + emp.retro + emp.claims + emp.others) : 0;
 const totalDeductions = isCalculated ? (emp.tax + emp.sso + emp.studentLoan + emp.unpaidLeave + emp.late + emp.absent + emp.early + emp.advance + emp.forgotOut + emp.otherDeduct) : 0;
 const netPay = isCalculated ? emp.net : 0;

 return (
 <tr key={emp.id} className="hover:bg-slate-50/80 transition-all group">
 <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 pl-8 py-4 text-slate-500 font-black">{emp.id}</td>
 <td className="sticky left-[100px] z-10 bg-white group-hover:bg-slate-50 px-4 py-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[15px]">{emp.img}</div>
 <div className="flex flex-col">
 <span className="text-[13px] text-slate-800 font-black flex items-center gap-1.5">
 {emp.name}
 {emp.id === "2400001" && (
 <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
 </svg>
 )}
 </span>
 <span className="text-[11.5px] text-slate-400 font-bold">{emp.role}</span>
 </div>
 </div>
 </td>
 <td className="px-4 py-4">
 <div className="flex flex-col gap-0.5">
 <span className="text-[13px] text-slate-700 font-black">{emp.bankAcc}</span>
 <div className="flex items-center gap-1">
 <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[8px] font-black">K</div>
 <span className="text-[11px] text-slate-400 font-bold">{emp.bankName}</span>
 </div>
 </div>
 </td>
 <td className="px-4 py-4 font-black text-slate-800">฿{emp.base.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 font-black text-center text-emerald-600 bg-emerald-50/5">฿{totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 font-black text-center text-rose-500 bg-rose-50/5">฿{totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 font-black text-right text-[#0EA5E9] bg-sky-50/5">฿{netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 {!isPaid && (
 <td className="px-4 py-4 text-center">
 <div className="flex items-center justify-center gap-2">
 <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg text-[11px] font-black">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
 </svg>
 ยังไม่ชำระเงิน
 </span>
 <button title="ดูเอกสาร" aria-label="ดูเอกสารพนักงาน" className="text-slate-400 hover:text-slate-600">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
 </svg>
 </button>
 </div>
 </td>
 )}
 {!isPaid && (
 <td className="pr-8 py-4 text-center">
 <input 
 type="checkbox" 
 title="เลือกพนักงาน"
 aria-label={`เลือกพนักงาน ${emp.name}`}
 
 checked={selectedEmpIds.includes(emp.id)}
 onChange={(e) => {
 if (e.target.checked) {
 setSelectedEmpIds([...selectedEmpIds, emp.id]);
 } else {
 setSelectedEmpIds(selectedEmpIds.filter(id => id !== emp.id));
 }
 }}
 className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400 cursor-pointer" 
 />
 </td>
 )}
 </tr>
 );
 })}
 <tr className="bg-slate-50/40 text-[13px] font-black text-slate-800">
 <td className="sticky left-0 z-10 bg-slate-50 pl-8 py-4" colSpan={2}>รวม</td>
 <td className="px-4 py-4" />
 <td className="px-4 py-4 font-black">฿{(employeesState.reduce((acc, emp) => acc + emp.base, 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-emerald-600">฿{(isCalculated ? employeesState.reduce((acc, emp) => acc + (emp.base + emp.ot + emp.diligence + emp.bonus + emp.comm + emp.retro + emp.claims + emp.others), 0) : 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-center text-rose-500">฿{(isCalculated ? employeesState.reduce((acc, emp) => acc + (emp.tax + emp.sso + emp.studentLoan + emp.unpaidLeave + emp.late + emp.absent + emp.early + emp.advance + emp.forgotOut + emp.otherDeduct), 0) : 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 <td className="px-4 py-4 text-right text-[#0EA5E9] text-[14px]">฿{(isCalculated ? employeesState.reduce((acc, emp) => acc + emp.net, 0) : 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
 {!isPaid && <td className="px-4 py-4" />}
 {!isPaid && <td className="pr-8 py-4" />}
 </tr>
 </tbody>
 </table>
 </div>
 )}
 </div>

 </div>
 );
 }

 if (isEarningsSettingsOpen) {
 if (activeEditingEarning === "create_new") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">เพิ่มข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">เพิ่มข้อมูลเงินได้</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" placeholder="ระบุรหัสเงินได้" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" placeholder="ระบุชื่อเงินได้" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" placeholder="ระบุชื่อเงินได้ภาษาอังกฤษ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณต่องวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณต่องวด</option>
 <option>ทั้งปี</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เงินเดือน / ค่าจ้างรายวัน") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Header & Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 {/* Close button */}
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เงินเดือน / ค่าจ้างรายวัน</h1>
 </div>

 {/* Top Settings Form */}
 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN01" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เงินเดือน / ค่าจ้างรายวัน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Salary / Wage" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณทั้งปี</option>
 <option>คำนวณต่องวด</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>
 </div>

 <div className="h-[1px] bg-slate-100 max-w-4xl my-2" />

 {/* ประเภทรายเดือน */}
 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex flex-col gap-1">
 <h3 className="text-[14px] font-black text-slate-800">ประเภทรายเดือน</h3>
 <p className="text-[12px] font-bold text-slate-400">ตั้งค่าการคำนวณเงินเดือนเป็นรายวัน</p>
 </div>

 <div className="flex flex-col gap-3 ml-2">
 <label className="flex items-center gap-2 cursor-pointer text-[13.5px] font-bold text-slate-700">
 <input title="กรอกข้อมูล" type="radio" 
 name="monthly_calc" 
 checked={monthlyCalcType === "ตามมาตรฐาน 30 วัน"} 
 onChange={() => setMonthlyCalcType("ตามมาตรฐาน 30 วัน")}
 className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>ตามมาตรฐาน 30 วัน <span className="text-slate-300 text-[11px]">ⓘ</span></span>
 </label>

 <label className="flex items-start gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" 
 name="monthly_calc" 
 checked={monthlyCalcType === "ตามจำนวนวันในเดือนนั้น ๆ"} 
 onChange={() => setMonthlyCalcType("ตามจำนวนวันในเดือนนั้น ๆ")}
 className="mt-0.5 w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <div className="flex flex-col gap-1 text-[13.5px] font-bold text-slate-700 flex-1">
 <span>ตามจำนวนวันในเดือนนั้น ๆ <span className="text-slate-300 text-[11px]">ⓘ</span></span>
 {monthlyCalcType === "ตามจำนวนวันในเดือนนั้น ๆ" && (
 <div className="text-[12px] font-bold text-slate-400 bg-slate-50/60 p-4 rounded-2xl mt-2 border border-slate-100/60 flex flex-col gap-3 animate-in fade-in duration-200 max-w-2xl shadow-sm">
 <div className="flex items-center gap-4">
 <span className="text-slate-400 w-20 text-[11px] font-black">การคำนวณ</span>
 <span className="text-slate-600 w-28">เดือนมกราคม</span>
 <span className="text-slate-300 font-black">→</span>
 <span className="text-slate-500 flex-1 leading-relaxed">
 ฐานเงินเดือน / 31 = รายได้ต่อวัน<br/>
 <span className="text-[#0EA5E9]">รายได้ต่อวัน x 31 = รายได้ต่อเดือน</span>
 </span>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-slate-400 w-20 text-[11px] font-black"></span>
 <span className="text-slate-600 w-28">เดือนกุมภาพันธ์</span>
 <span className="text-slate-300 font-black">→</span>
 <span className="text-slate-500 flex-1 leading-relaxed">
 ฐานเงินเดือน / 28 = รายได้ต่อวัน<br/>
 <span className="text-[#0EA5E9]">รายได้ต่อวัน x 28 = รายได้ต่อเดือน</span>
 </span>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-slate-400 w-20 text-[11px] font-black"></span>
 <span className="text-slate-600 w-28">เดือนเมษายน</span>
 <span className="text-slate-300 font-black">→</span>
 <span className="text-slate-500 flex-1 leading-relaxed">
 ฐานเงินเดือน / 30 = รายได้ต่อวัน<br/>
 <span className="text-[#0EA5E9]">รายได้ต่อวัน x 30 = รายได้ต่อเดือน</span>
 </span>
 </div>
 </div>
 )}
 </div>
 </label>

 <label className="flex items-start gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" 
 name="monthly_calc" 
 checked={monthlyCalcType === "กำหนดเอง"} 
 onChange={() => setMonthlyCalcType("กำหนดเอง")}
 className="mt-0.5 w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <div className="flex flex-col gap-1 text-[13.5px] font-bold text-slate-700 flex-1">
 <span>กำหนดเอง</span>
 
 {monthlyCalcType === "กำหนดเอง" && (
 <div className="grid grid-cols-2 gap-8 mt-3 p-5 bg-slate-50/60 border border-slate-100/60 rounded-3xl animate-in fade-in duration-200 max-w-2xl shadow-sm">
 {/* Divider column */}
 <div className="flex flex-col gap-2">
 <span className="text-[13px] font-black text-slate-700 flex items-center gap-1">
 จำนวนวันในการหาร <span className="text-slate-300 text-[11px]">ⓘ</span>
 </span>
 <label className="flex items-center gap-2 text-[12.5px] font-bold text-slate-500 cursor-pointer mt-1">
 <input title="กรอกข้อมูล" type="checkbox" 
 checked={customDividerCheck}
 onChange={(e) => setCustomDividerCheck(e.target.checked)}
 className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>ตามจำนวนวันในเดือนนั้น ๆ</span>
 </label>
 {!customDividerCheck && (
 <div className="relative flex items-center bg-white border border-slate-200/60 rounded-xl px-4 py-2 mt-1 shadow-sm max-w-[160px]">
 <input title="กรอกข้อมูล" type="text" defaultValue="30" className="w-full bg-transparent text-[13px] font-bold text-slate-700 outline-none text-center" />
 <span className="text-[12px] font-bold text-slate-400 ml-2">วัน</span>
 </div>
 )}
 </div>

 {/* Multiplier column */}
 <div className="flex flex-col gap-2">
 <span className="text-[13px] font-black text-slate-700 flex items-center gap-1">
 จำนวนวันในการคูณ <span className="text-slate-300 text-[11px]">ⓘ</span>
 </span>
 <label className="flex items-center gap-2 text-[12.5px] font-bold text-slate-500 cursor-pointer mt-1">
 <input title="กรอกข้อมูล" type="checkbox" 
 checked={customMultiplierCheck}
 onChange={(e) => setCustomMultiplierCheck(e.target.checked)}
 className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>ตามจำนวนวันในเดือนนั้น ๆ</span>
 </label>
 {!customMultiplierCheck && (
 <div className="relative flex items-center bg-white border border-slate-200/60 rounded-xl px-4 py-2 mt-1 shadow-sm max-w-[160px]">
 <input title="กรอกข้อมูล" type="text" defaultValue="30" className="w-full bg-transparent text-[13px] font-bold text-slate-700 outline-none text-center" />
 <span className="text-[12px] font-bold text-slate-400 ml-2">วัน</span>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </label>
 </div>

 <div className="flex flex-col gap-3 mt-2 ml-2">
 <span className="text-[13px] font-black text-slate-600">วิธีการคำนวณค่าจ้าง</span>
 <div className="flex flex-col gap-4">
 <label className="flex items-start gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="wage_calc" defaultChecked className="mt-0.5 w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <div className="flex flex-col gap-1 text-[13.5px] font-bold text-slate-700">
 <span>วันทำงาน x ค่าจ้างต่อวัน</span>
 <div className="text-[12px] font-bold text-slate-400 bg-slate-50 p-3 rounded-2xl mt-1 border border-slate-100/60">
 <span><span className="text-slate-500">การคำนวณ</span> วันทำงาน x ค่าจ้างต่อวัน = ค่าจ้าง</span>
 </div>
 </div>
 </label>

 <label className="flex items-start gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="wage_calc" className="mt-0.5 w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <div className="flex flex-col gap-1 text-[13.5px] font-bold text-slate-700">
 <span>เงินเดือน - ค่าจ้างวันไม่ทำงาน</span>
 <div className="text-[12px] font-bold text-slate-400 bg-slate-50 p-3 rounded-2xl mt-1 border border-slate-100/60">
 <span><span className="text-slate-500">การคำนวณ</span> ฐานเงินเดือน - (วันไม่ทำงาน x ค่าจ้างต่อวัน) = ค่าจ้าง</span>
 </div>
 </div>
 </label>
 </div>
 </div>
 </div>

 <div className="h-[1px] bg-slate-100 max-w-4xl my-2" />

 {/* ประเภทรายวัน */}
 <div className="flex flex-col gap-4 max-w-4xl">
 <h3 className="text-[14px] font-black text-slate-800">ประเภทรายวัน</h3>
 <div className="flex flex-col gap-1 ml-2">
 <label className="flex items-start gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <div className="flex flex-col gap-1 text-[13.5px] font-bold text-slate-700">
 <span>ได้รับค่าแรงในวันหยุดตามปฏิทิน</span>
 <div className="text-[12px] font-bold text-slate-400 bg-slate-50 p-3 rounded-2xl mt-1 border border-slate-100/60 flex flex-col gap-0.5">
 <span><span className="text-slate-500">การคำนวณ</span> ค่าจ้างรายวัน / ชั่วโมงการทำงานตามเงื่อนไขบริษัท = รายได้ต่อชั่วโมง</span>
 <span>รายได้ต่อชั่วโมง x ชั่วโมงการทำงานตามเงื่อนไขบริษัท = รายได้ต่อวัน</span>
 </div>
 </div>
 </label>
 </div>
 </div>
 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "ค่าโอที") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC] flex flex-col gap-6 font-sans">
 <div className="flex flex-col gap-2">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข ค่าโอที</h1>
 </div>

 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 flex flex-col gap-4 shadow-sm">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>
 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 rounded-2xl text-[13px] font-bold transition-all">
 ⚙️ ตั้งค่าเงื่อนไขการทำโอที
 </button>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN02" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="ค่าโอที" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Overtime" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>ปัดอัตโนมัติ</option>
 <option>ไม่ปัดเศษ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">เงื่อนไขการจ่ายเงิน</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>งวดปัจจุบัน</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>คำนวณต่องวด</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการจ่ายที่งวด</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>ทุกงวด</option>
 </select>
 </div>
 </div>
 </div>

 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 flex flex-col gap-4 shadow-sm">
 <div className="flex items-center gap-2">
 📅 <h3 className="text-[14px] font-black text-slate-800">ประเภทรายเดือน</h3>
 </div>
 <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9]" />
 <span>แบบกำหนดอัตราโอทีเอง</span>
 </label>

 <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
 <table className="w-full text-left border-collapse text-[13px] font-bold text-slate-600">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-200/60 text-[12px] font-black text-slate-500">
 <th className="px-6 py-3">ช่วงเวลา</th>
 <th className="px-6 py-3 text-center">ทำงานในกะ 🖩</th>
 <th className="px-6 py-3 text-center">ทำงานนอกกะ 🖩</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 <tr>
 <td className="px-6 py-4 text-slate-400">วันทำงานปกติ ⓘ</td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-slate-50 px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-400">- เท่า</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">1.5 เท่า</span>
 </td>
 </tr>
 <tr>
 <td className="px-6 py-4 text-slate-400">วันหยุดประจำสัปดาห์ ⓘ</td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">1 เท่า</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">3 เท่า</span>
 </td>
 </tr>
 <tr>
 <td className="px-6 py-4 text-slate-400">วันหยุดตามปฏิทิน ⓘ</td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">1 เท่า</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">3 เท่า</span>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 flex flex-col gap-4 shadow-sm">
 <div className="flex items-center gap-2">
 📅 <h3 className="text-[14px] font-black text-slate-800">ประเภทรายวัน</h3>
 </div>
 <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9]" />
 <span>แบบกำหนดอัตราโอทีเอง</span>
 </label>

 <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
 <table className="w-full text-left border-collapse text-[13px] font-bold text-slate-600">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-200/60 text-[12px] font-black text-slate-500">
 <th className="px-6 py-3">ช่วงเวลา</th>
 <th className="px-6 py-3 text-center">ทำงานในกะ 🖩</th>
 <th className="px-6 py-3 text-center">ทำงานนอกกะ 🖩</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 <tr>
 <td className="px-6 py-4 text-slate-400">วันทำงานปกติ ⓘ</td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-slate-50 px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-400">- เท่า</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">1.5 เท่า</span>
 </td>
 </tr>
 <tr>
 <td className="px-6 py-4 text-slate-400">วันหยุดประจำสัปดาห์ ⓘ</td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">2 เท่า</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">3 เท่า</span>
 </td>
 </tr>
 <tr>
 <td className="px-6 py-4 text-slate-400">วันหยุดตามปฏิทิน ⓘ</td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">2 เท่า</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="inline-flex items-center bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl text-slate-600">3 เท่า</span>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เบี้ยขยัน") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC] flex flex-col gap-6 font-sans">
 <div className="flex flex-col gap-2">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เบี้ยขยัน</h1>
 </div>

 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 flex flex-col gap-4 shadow-sm">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN03" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เบี้ยขยัน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Diligence Allowance" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">เงื่อนไขการจ่ายเงิน</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>งวดปัจจุบัน</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>คำนวณต่องวด</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการจ่ายที่งวด</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none">
 <option>งวดสิ้นเดือน</option>
 <option>ทุกงวด</option>
 </select>
 </div>
 </div>
 </div>

 {/* พนักงานที่ได้รับสิทธิ์ */}
 <div className="flex flex-col gap-2">
 <span className="text-[13px] font-black text-slate-800">พนักงานที่ได้รับสิทธิ์</span>
 <div className="flex items-center gap-3 max-w-md">
 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 flex-1">
 <button className="flex-1 text-center py-2 bg-white shadow-sm rounded-[10px] text-[12.5px] font-black text-[#0EA5E9]">
 พนักงานทุกคน
 </button>
 <button className="flex-1 text-center py-2 text-[12.5px] font-bold text-slate-500 hover:text-slate-700">
 กำหนดเอง
 </button>
 </div>
 <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
 </svg>
 </button>
 </div>
 </div>

 {/* เงื่อนไขการได้รับเบี้ยขยัน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 flex flex-col gap-4 shadow-sm">
 <div className="flex items-center gap-2 text-[14px] font-black text-slate-800">
 🎛️ เงื่อนไขการได้รับเบี้ยขยัน
 </div>

 <div className="flex items-center justify-between py-2 border-b border-slate-50">
 <span className="text-[13px] font-bold text-slate-600">อายุงาน</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" />
 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0EA5E9]"></div>
 </label>
 </div>

 <div className="flex items-center justify-between py-2 border-b border-slate-50">
 <span className="text-[13px] font-bold text-slate-600">กำหนดเวลาเข้า - ออกงาน</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" />
 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0EA5E9]"></div>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-4 mt-2">
 <div className="relative flex items-center bg-white border border-slate-200/60 rounded-xl px-4 py-2 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">มาสายไม่เกิน</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="0" className="w-full bg-transparent text-[13px] font-bold text-slate-600 outline-none" />
 <span className="text-[12px] font-bold text-slate-400 mr-2">ครั้ง</span>
 <span className="text-slate-300 text-[11px]">ⓘ</span>
 </div>
 <div className="relative flex items-center bg-white border border-slate-200/60 rounded-xl px-4 py-2 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">พักสายไม่เกิน</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="0" className="w-full bg-transparent text-[13px] font-bold text-slate-600 outline-none" />
 <span className="text-[12px] font-bold text-slate-400 mr-2">ครั้ง</span>
 <span className="text-slate-300 text-[11px]">ⓘ</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="relative flex items-center bg-white border border-slate-200/60 rounded-xl px-4 py-2 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ขาดงานไม่เกิน</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="0" className="w-full bg-transparent text-[13px] font-bold text-slate-600 outline-none" />
 <span className="text-[12px] font-bold text-slate-400 mr-2">ครั้ง</span>
 <span className="text-slate-300 text-[11px]">ⓘ</span>
 </div>
 <div className="relative flex items-center bg-white border border-slate-200/60 rounded-xl px-4 py-2 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ลาหยุดไม่เกิน</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="0" className="w-full bg-transparent text-[13px] font-bold text-slate-600 outline-none" />
 <span className="text-[12px] font-bold text-slate-400 mr-2">ครั้ง</span>
 <span className="text-slate-300 text-[11px]">ⓘ</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="relative flex items-center bg-white border border-slate-200/60 rounded-xl px-4 py-2 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">วันที่ไม่ทำงาน ไม่เกิน</span>
 <select title="เลือกข้อมูล" className="w-full bg-transparent text-[13px] font-bold text-slate-600 outline-none cursor-pointer">
 <option>ไม่มีเงื่อนไข</option>
 </select>
 <span className="text-slate-300 text-[11px]">ⓘ</span>
 </div>
 </div>
 </div>

 {/* รูปแบบการจ่าย */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 flex flex-col gap-6 shadow-sm">
 <div className="flex items-center gap-2 text-[14px] font-black text-slate-800">
 💳 รูปแบบการจ่าย
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 max-w-xs">
 <button className="flex-1 text-center py-2 text-[12.5px] font-bold text-slate-500 hover:text-slate-700">
 อัตราคงที่
 </button>
 <button className="flex-1 text-center py-2 bg-white shadow-sm rounded-[10px] text-[12.5px] font-black text-[#0EA5E9]">
 ขั้นบันได
 </button>
 </div>

 <div className="flex flex-col gap-4">
 <span className="text-[13.5px] font-black text-slate-600">การจ่ายเงินแบบสะสม</span>
 <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9]" />
 <span>อนุญาตให้สะสมข้ามปี</span>
 </label>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 max-w-sm">
 <button className="flex-1 text-center py-2 bg-white shadow-sm rounded-[10px] text-[12.5px] font-black text-[#0EA5E9]">
 นับใหม่เมื่อไม่ผ่านเงื่อนไข
 </button>
 <button className="flex-1 text-center py-2 text-[12.5px] font-bold text-slate-500 hover:text-slate-700">
 นับสะสมไปเรื่อย ๆ
 </button>
 </div>

 <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-2 text-[13px] font-bold text-slate-600">
 {[
 { label: "เดือนที่ 1", val: "100" },
 { label: "ติดต่อกัน 2 เดือน", val: "500" },
 { label: "ติดต่อกัน 3 เดือน", val: "500" },
 { label: "ติดต่อกัน 4 เดือน", val: "1000" },
 { label: "ติดต่อกัน 5 เดือน", val: "1000" },
 { label: "ติดต่อกัน 6 เดือน", val: "1000" },
 { label: "ติดต่อกัน 7 เดือน", val: "1000" },
 { label: "ติดต่อกัน 8 เดือน", val: "1000" },
 { label: "ติดต่อกัน 9 เดือน", val: "1000" },
 { label: "ติดต่อกัน 10 เดือน", val: "1000" },
 { label: "ติดต่อกัน 11 เดือน", val: "1000" },
 { label: "มากกว่า 12 เดือน", val: "3000" }
 ].map((step, index) => (
 <div key={index} className="flex items-center justify-between max-w-md">
 <span>{step.label}</span>
 <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 w-52 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ได้งวดละ</span>
 <span className="text-slate-400 mr-2">฿</span>
 <input title="กรอกข้อมูล" type="text" defaultValue={step.val} className="w-full bg-transparent text-slate-700 outline-none" />
 </div>
 </div>
 ))}
 </div>

 <button className="text-[#0EA5E9] hover:underline text-[13px] font-bold flex items-center gap-1 mt-2 self-start">
 ⓘ ดูสูตรคำนวณ
 </button>
 </div>
 </div>
 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เงินได้อื่นๆ") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เงินได้อื่นๆ</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN07" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เงินได้อื่นๆ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Other Earnings" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณต่องวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณต่องวด</option>
 <option>ทั้งปี</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เบิกค่าใช้จ่าย") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เบิกค่าใช้จ่าย</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN101" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เบิกค่าใช้จ่าย" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Expense" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการจ่ายที่งวด</span>
 <select title="เลือกข้อมูล" defaultValue="งวดสิ้นเดือน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>งวดสิ้นเดือน</option>
 <option>ทุกงวด</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>

 <div className="flex items-center gap-3 mt-2">
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 <span className="text-[13.5px] font-bold text-slate-700">ต้องแนบเอกสารอนุมัติ</span>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "สวัสดิการ") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข สวัสดิการ</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN100" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="สวัสดิการ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Welfare" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณทั้งปี" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณต่องวด</option>
 <option>คำนวณทั้งปี</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการจ่ายที่งวด</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ทุกงวด</option>
 <option>งวดสิ้นเดือน</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-6 max-w-4xl mt-2">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col gap-5">
 <div className="flex items-center justify-between text-[14.5px] font-black text-slate-800">
 <span className="flex items-center gap-2">
 <span className="text-slate-400 text-[16px]">📅</span> ประเภทรายเดือน
 </span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" checked={welfareMonthlyToggle} onChange={(e) => setWelfareMonthlyToggle(e.target.checked)} />
 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>
 
 {welfareMonthlyToggle && (
 <div className="flex flex-col gap-5 border-t border-slate-100 pt-4 animate-in fade-in duration-200">
 <div className="flex flex-col gap-2">
 <span className="text-[12.5px] font-bold text-slate-500">พนักงานที่ได้รับสิทธิ์</span>
 <div className="flex items-center gap-3">
 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 flex-1 max-w-[220px]">
 <button onClick={() => setWelfareMonthlyEligible("พนักงานทุกคน")}
 className={`flex-1 text-center py-1.5 rounded-[10px] text-[12px] font-black transition-all ${welfareMonthlyEligible === "พนักงานทุกคน" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-500 hover:text-slate-700"}`}
 >
 พนักงานทุกคน
 </button>
 <button onClick={() => setWelfareMonthlyEligible("กำหนดเอง")}
 className={`flex-1 text-center py-1.5 rounded-[10px] text-[12px] font-black transition-all ${welfareMonthlyEligible === "กำหนดเอง" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-500 hover:text-slate-700"}`}
 >
 กำหนดเอง
 </button>
 </div>
 {welfareMonthlyEligible === "กำหนดเอง" && (
 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/60 cursor-pointer hover:bg-slate-200 transition-colors">
 👤+
 </div>
 )}
 {welfareMonthlyEligible === "พนักงานทุกคน" && (
 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60">
 👥
 </div>
 )}
 </div>
 </div>

 <div className="flex flex-col gap-2">
 <span className="text-[12.5px] font-bold text-slate-500">วิธีคำนวณ</span>
 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 w-fit">
 <button onClick={() => setWelfareMonthlyCalcType("รายเดือน")}
 className={`px-4 py-1.5 rounded-[10px] text-[12px] font-black transition-all ${welfareMonthlyCalcType === "รายเดือน" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-500 hover:text-slate-700"}`}
 >
 รายเดือน
 </button>
 <button onClick={() => setWelfareMonthlyCalcType("คิดตามวันทำงาน")}
 className={`px-4 py-1.5 rounded-[10px] text-[12px] font-black transition-all ${welfareMonthlyCalcType === "คิดตามวันทำงาน" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-500 hover:text-slate-700"}`}
 >
 คิดตามวันทำงาน
 </button>
 </div>
 </div>

 <div className="relative max-w-[220px]">
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คิดตามมาตรฐาน</option>
 </select>
 </div>

 <div className="flex items-center gap-3">
 <div className="relative w-full max-w-[220px] bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">จำนวนเงิน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="30" className="w-full bg-transparent text-slate-700 outline-none text-[13px] font-bold" />
 <span className="text-slate-400 text-[12px] font-bold ml-2 flex-shrink-0">฿ / วัน</span>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[12.5px] font-bold text-slate-600 cursor-pointer mt-1">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" defaultChecked />
 <span>รวมพนักงานที่ไม่ลงเวลา</span>
 </label>

 <button className="text-[#0EA5E9] hover:underline text-[12px] font-bold flex items-center gap-1 self-start">
 ⓘ ดูสูตรคำนวณ
 </button>
 </div>
 )}
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col gap-5 h-fit">
 <div className="flex items-center justify-between text-[14.5px] font-black text-slate-800">
 <span className="flex items-center gap-2">
 <span className="text-slate-400 text-[16px]">📅</span> ประเภทรายวัน
 </span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" checked={welfareDailyToggle} onChange={(e) => setWelfareDailyToggle(e.target.checked)} />
 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>
 {!welfareDailyToggle && (
 <span className="text-[13px] font-bold text-slate-400 border-t border-slate-100 pt-4 animate-in fade-in duration-200">
 เปิด &quot;เปิด&quot; เพื่อกำหนดรายละเอียด
 </span>
 )}
 {welfareDailyToggle && (
 <div className="flex flex-col gap-5 border-t border-slate-100 pt-4 animate-in fade-in duration-200">
 <div className="flex flex-col gap-2">
 <span className="text-[12.5px] font-bold text-slate-500">พนักงานที่ได้รับสิทธิ์</span>
 <span className="text-[13px] font-bold text-slate-700">พนักงานทุกคน</span>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เงินตกเบิก") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เงินตกเบิก</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN06" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เงินตกเบิก" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Salary in practising period" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณต่องวด</option>
 <option>ทั้งปี</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "ประกันสังคม") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข ประกันสังคม</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D02" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="ประกันสังคม" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Social Security Fund" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" defaultValue="ปัดอัตโนมัติ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการหัก</span>
 <select title="เลือกข้อมูล" defaultValue="ทุกงวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ทุกงวด</option>
 <option>งวดสิ้นเดือน</option>
 </select>
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl mt-4">
 <span className="text-[15px] font-black text-slate-700 tracking-tight border-b border-slate-100 pb-2">
 อัตราการจ่ายประกันสังคม
 </span>
 
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-1">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>หักวิธีถัวเฉลี่ย</span>
 </label>

 <div className="grid grid-cols-2 gap-6 mt-2">
 <div className="relative bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ฐานค่าจ้างต่ำสุดเดือนละ *</span>
 <span className="text-slate-400 font-bold mr-2">฿</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="1650" className="w-full bg-transparent text-slate-700 outline-none text-[13.5px] font-bold" />
 </div>

 <div className="relative bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ฐานค่าจ้างสูงสุดเดือนละ *</span>
 <span className="text-slate-400 font-bold mr-2">฿</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="15000" className="w-full bg-transparent text-slate-700 outline-none text-[13.5px] font-bold" />
 </div>

 <div className="relative bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">อัตราสมทบลูกจ้าง *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="5" className="w-full bg-transparent text-slate-700 outline-none text-[13.5px] font-bold" />
 <span className="text-slate-400 font-bold ml-2">%</span>
 </div>

 <div className="relative bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">อัตราสมทบนายจ้าง *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="5" className="w-full bg-transparent text-slate-700 outline-none text-[13.5px] font-bold" />
 <span className="text-slate-400 font-bold ml-2">%</span>
 </div>

 <div className="relative bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">สมทบขั้นต่ำเดือนละ *</span>
 <span className="text-slate-400 font-bold mr-2">฿</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="83" className="w-full bg-transparent text-slate-700 outline-none text-[13.5px] font-bold" />
 </div>

 <div className="relative bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">สมทบสูงสุดเดือนละ *</span>
 <span className="text-slate-400 font-bold mr-2">฿</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="750" className="w-full bg-transparent text-slate-700 outline-none text-[13.5px] font-bold" />
 </div>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เงินหักอื่น ๆ") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เงินหักอื่น ๆ</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D08" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เงินหักอื่น ๆ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Other Deductions" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณ</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "หักลืมลงเวลาออกงาน") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-6xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข หักลืมลงเวลาออกงาน</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-6xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D101" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="หักลืมลงเวลาออกงาน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Deduct for forgetting to check out" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" defaultValue="ไม่ปัดเศษ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการหัก</span>
 <select title="เลือกข้อมูล" defaultValue="ทุกงวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ทุกงวด</option>
 <option>งวดสิ้นเดือน</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณ</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-8 max-w-6xl mt-4">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-6">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายเดือน</span>
 
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_forgot_out_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_forgot_out_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงินต่อวัน</span>
 </label>
 </div>
 </div>

 <div className="flex flex-col gap-4">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 max-w-md shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงินหลังจาก ลืมออกงาน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="0" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ครั้ง</span>
 </div>
 
 <div className="flex items-center gap-3">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-32 shadow-sm">
 <input title="กรอกข้อมูล" type="text" defaultValue="1" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ครั้งขึ้นไป</span>
 </div>
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-40 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงินครั้งละ xx ฿ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="50" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">฿</span>
 </div>
 </div>
 
 <button className="flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] text-[13px] font-bold mt-1 self-start">
 <span className="w-6 h-6 border-2 border-dashed border-[#0EA5E9] rounded-xl flex items-center justify-center">+</span>
 <span>เพิ่ม</span>
 </button>
 </div>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-6">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายวัน</span>
 
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_forgot_out_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_forgot_out_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงินต่อวัน</span>
 </label>
 </div>
 </div>

 <div className="flex flex-col gap-4">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 max-w-md shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงินหลังจาก ลืมออกงาน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="0" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ครั้ง</span>
 </div>
 
 <div className="flex items-center gap-3">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-32 shadow-sm">
 <input title="กรอกข้อมูล" type="text" defaultValue="1" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ครั้งขึ้นไป</span>
 </div>
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-40 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงินครั้งละ xx ฿ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="50" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">฿</span>
 </div>
 </div>
 
 <button className="flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] text-[13px] font-bold mt-1 self-start">
 <span className="w-6 h-6 border-2 border-dashed border-[#0EA5E9] rounded-xl flex items-center justify-center">+</span>
 <span>เพิ่ม</span>
 </button>
 </div>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-6xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เบิกเงินเดือน") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-6xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เบิกเงินเดือน</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-6xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D100" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เบิกเงินเดือน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Salary Advance" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการหัก</span>
 <select title="เลือกข้อมูล" defaultValue="งวดสิ้นเดือน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>งวดสิ้นเดือน</option>
 <option>ทุกงวด</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">แบบเอกสารอนุมัติ</span>
 <select title="เลือกข้อมูล" defaultValue="ไม่ต้องแนบ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ต้องแนบ</option>
 <option>ต้องแนบเอกสาร</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-8 max-w-6xl mt-4">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-6">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายเดือน</span>
 
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">พนักงานที่ได้รับสิทธิ์</span>
 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 max-w-xs">
 {["พนักงานทุกคน", "กำหนดเอง"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "พนักงานทุกคน" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>
 </div>

 <div className="flex items-center gap-3">
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" />
 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0EA5E9]"></div>
 </label>
 <span className="text-[13.5px] font-bold text-slate-600">อายุงาน</span>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 max-w-xs">
 {["กำหนดวงเงิน", "คิดตามวันทำงาน"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "กำหนดวงเงิน" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <div className="flex flex-col gap-4">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 max-w-md shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">เบิกได้หลังจากวันทำงานไปแล้ว *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="3" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">วัน</span>
 </div>
 
 <div className="flex items-center gap-3">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-48 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ไม่เกิน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="5000" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <select title="เลือกข้อมูล" defaultValue="฿" className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-[13.5px] font-bold text-slate-700 shadow-sm cursor-pointer outline-none">
 <option>฿</option>
 <option>%</option>
 </select>
 <span className="text-[13px] font-bold text-slate-500">งวด</span>
 </div>
 </div>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-6">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายวัน</span>
 
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">พนักงานที่ได้รับสิทธิ์</span>
 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 max-w-xs">
 {["พนักงานทุกคน", "กำหนดเอง"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "พนักงานทุกคน" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>
 </div>

 <div className="flex items-center gap-3">
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" />
 <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0EA5E9]"></div>
 </label>
 <span className="text-[13.5px] font-bold text-slate-600">อายุงาน</span>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 max-w-xs">
 {["กำหนดวงเงิน", "คิดตามวันทำงาน"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "คิดตามวันทำงาน" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <div className="flex flex-col gap-4">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 max-w-md shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">เบิกได้หลังจากวันทำงานไปแล้ว *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="3" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">วัน</span>
 </div>

 <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-4 text-[12.5px] font-bold text-slate-600 flex flex-col gap-1 mt-2">
 <span className="text-[#0EA5E9]">การคำนวณ: <span className="text-slate-700 font-bold">ค่าจ้างรายวัน x วันทำงานจริง = รายได้ตามวันทำงาน</span></span>
 <span className="text-[#0EA5E9] mt-1">ตัวอย่างเช่น:</span>
 <span className="text-slate-500 pl-3 font-normal leading-relaxed">ค่าจ้างรายวัน 500 วันทำงานจริง 10 ไม่รวมวันหยุด จะได้ 500 x 10 = 5,000 บาท ดังนั้นสามารถเบิกเงินเดือนได้ไม่เกิน 5,000 บาท</span>
 </div>
 </div>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-6xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "หักกลับก่อน") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-[12.5px] font-bold shadow-sm transition-all">
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <span>ตั้งค่าเงื่อนไขการทำงาน</span>
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-6xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข หักกลับก่อน</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-6xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D07" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="หักกลับก่อน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Deduct for leaving early" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" defaultValue="ไม่ปัดเศษ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการหัก</span>
 <select title="เลือกข้อมูล" defaultValue="ทุกงวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ทุกงวด</option>
 <option>งวดสิ้นเดือน</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณ</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-8 max-w-6xl mt-4">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายเดือน</span>
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_early_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_early_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงิน</span>
 </label>
 </div>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 mt-2 max-w-lg">
 {["ตามค่าจ้าง", "รายครั้ง", "เป็นรอบๆ", "ขั้นบันได (ต่อครั้ง)"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "ตามค่าจ้าง" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-3 mt-2">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-60 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงินหลังจาก กลับก่อนเกิน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="20" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ครั้ง</span>
 </div>
 </div>

 <button className="text-[#0EA5E9] hover:underline text-[13px] font-bold flex items-center gap-1 mt-4 self-start">
 ⓘ ดูสูตรคำนวณ
 </button>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายวัน</span>
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_early_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_early_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงิน</span>
 </label>
 </div>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 mt-2 max-w-lg">
 {["ตามค่าจ้าง", "รายครั้ง", "เป็นรอบๆ", "ขั้นบันได (ต่อครั้ง)"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "ตามค่าจ้าง" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-3 mt-2">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-60 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงินหลังจาก กลับก่อนเกิน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="20" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ครั้ง</span>
 </div>
 </div>

 <button className="text-[#0EA5E9] hover:underline text-[13px] font-bold flex items-center gap-1 mt-4 self-start">
 ⓘ ดูสูตรคำนวณ
 </button>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-6xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "หักขาดงาน") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-[12.5px] font-bold shadow-sm transition-all">
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <span>ตั้งค่าเงื่อนไขการทำงาน</span>
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-6xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข หักขาดงาน</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-6xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D06" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="หักขาดงาน" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Deduct for absence from work" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" defaultValue="ไม่ปัดเศษ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการหัก</span>
 <select title="เลือกข้อมูล" defaultValue="ทุกงวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ทุกงวด</option>
 <option>งวดสิ้นเดือน</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณ</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-8 max-w-6xl mt-4">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายเดือน</span>
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_absent_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_absent_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงิน</span>
 </label>
 </div>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 mt-2 max-w-xs">
 {["ตามค่าจ้าง", "รายครั้ง"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "ตามค่าจ้าง" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <button className="text-[#0EA5E9] hover:underline text-[13px] font-bold flex items-center gap-1 mt-4 self-start">
 ⓘ ดูสูตรคำนวณ
 </button>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายวัน</span>
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_absent_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_absent_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงิน</span>
 </label>
 </div>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 mt-2 max-w-xs">
 {["ตามค่าจ้าง", "รายครั้ง"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "ตามค่าจ้าง" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <button className="text-[#0EA5E9] hover:underline text-[13px] font-bold flex items-center gap-1 mt-4 self-start">
 ⓘ ดูสูตรคำนวณ
 </button>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-6xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "หักมาสาย") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-[12.5px] font-bold shadow-sm transition-all">
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <span>ตั้งค่าเงื่อนไขการทำงาน</span>
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-6xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข หักมาสาย</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-6xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D05" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="หักมาสาย" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Deduct for being late" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" defaultValue="ไม่ปัดเศษ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ทำการหัก</span>
 <select title="เลือกข้อมูล" defaultValue="ทุกงวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ทุกงวด</option>
 <option>งวดสิ้นเดือน</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณ</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-8 max-w-6xl mt-4">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายเดือน</span>
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_late_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="monthly_late_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงิน</span>
 </label>
 </div>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 mt-2 max-w-lg">
 {["ตามค่าจ้าง", "รายครั้ง", "เป็นรอบๆ", "ขั้นบันได (ต่อครั้ง)"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "ขั้นบันได (ต่อครั้ง)" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <div className="flex flex-col gap-4 mt-2">
 {[
 { min: "1", amt: "10" },
 { min: "10", amt: "20" },
 { min: "100", amt: "100" }
 ].map((row, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-40 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นาที</span>
 <input title="กรอกข้อมูล" type="text" defaultValue={row.min} className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ขึ้นไป</span>
 </div>
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-40 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงิน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue={row.amt} className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">฿</span>
 </div>
 {i > 0 && (
 <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
 </svg>
 </button>
 )}
 </div>
 ))}
 </div>

 <button className="flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] text-[13px] font-bold mt-2 self-start">
 <span className="w-6 h-6 border-2 border-dashed border-[#0EA5E9] rounded-xl flex items-center justify-center">+</span>
 <span>เพิ่ม</span>
 </button>

 <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>นำเวลาพักเกินไปคำนวณด้วย</span>
 </label>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <span className="text-[15px] font-black text-slate-800 tracking-tight">ประเภทรายวัน</span>
 <div className="flex flex-col gap-2">
 <span className="text-[12px] font-bold text-slate-400">รูปแบบการหัก</span>
 <div className="flex items-center gap-4 mt-1">
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_late_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" />
 <span>ไม่มีการหัก</span>
 </label>
 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" name="daily_late_type" className="w-4 h-4 border-slate-300 text-[#0EA5E9]" defaultChecked />
 <span>หักเป็นเงิน</span>
 </label>
 </div>
 </div>

 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 mt-2 max-w-lg">
 {["ตามค่าจ้าง", "รายครั้ง", "เป็นรอบๆ", "ขั้นบันได (ต่อครั้ง)"].map((tab, idx) => (
 <button key={idx} className={`flex-1 text-center py-2 rounded-[10px] text-[12.5px] font-black ${tab === "ตามค่าจ้าง" ? "bg-white shadow-sm text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"}`}>
 {tab}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-3 mt-2">
 <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-60 shadow-sm">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">หักเงินหลังจาก มาสายเกิน *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="0" className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none" />
 <span className="text-slate-400 font-bold text-[11.5px] ml-2">ครั้ง</span>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9]" />
 <span>นำเวลาพักเกินไปคำนวณด้วย</span>
 </label>

 <button className="text-[#0EA5E9] hover:underline text-[13px] font-bold flex items-center gap-1 mt-4 self-start">
 ⓘ ดูสูตรคำนวณ
 </button>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-6xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "หักลาไม่รับค่าจ้าง") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข หักลาไม่รับค่าจ้าง</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D04" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="หักลาไม่รับค่าจ้าง" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Leave Without Pay" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" defaultValue="ไม่ปัดเศษ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="คำนวณ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณ</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "เงินกู้ กยศ.") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข เงินกู้ กยศ.</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D03" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="เงินกู้ กยศ." className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Student Loan Fund" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl mt-4">
 <span className="text-[15px] font-black text-slate-700 tracking-tight border-b border-slate-100 pb-2">
 จำนวนเงินกู้ กยศ. ที่จ่ายต่องวด
 </span>
 
 <div className="grid grid-cols-4 gap-6 mt-2">
 {/* Period Card 1 */}
 <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-center gap-2 cursor-pointer group">
 <span className="text-[13.5px] font-black text-slate-800 group-hover:text-[#0EA5E9] transition-colors">
 06/07/2568 - 05/07/2569
 </span>
 <span className="text-[11.5px] font-bold text-slate-400">
 วันที่มีผล : 06/07/2568
 </span>
 </div>

 {/* Large Add Button Card */}
 <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[24px] flex items-center justify-center p-6 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all group">
 <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#0EA5E9] transition-all">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
 </svg>
 </div>
 </div>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "ภาษีหัก ณ ที่จ่าย") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินหัก</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข ภาษีหัก ณ ที่จ่าย</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="D01" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="ภาษีหัก ณ ที่จ่าย" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินหัก (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Tax" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-6 max-w-4xl mt-2">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col gap-3">
 <span className="text-[14px] font-black text-slate-700">ประเภทรายเดือน</span>
 <div className="relative">
 <select title="เลือกข้อมูล" defaultValue="อัตโนมัติ (ตามที่กฎหมายกำหนด)" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>อัตโนมัติ (ตามที่กฎหมายกำหนด)</option>
 <option>กำหนดเอง</option>
 </select>
 </div>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col gap-3">
 <span className="text-[14px] font-black text-slate-700">ประเภทรายวัน</span>
 <div className="relative">
 <select title="เลือกข้อมูล" defaultValue="อัตโนมัติ (ตามที่กฎหมายกำหนด)" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>อัตโนมัติ (ตามที่กฎหมายกำหนด)</option>
 <option>กำหนดเอง</option>
 </select>
 </div>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning === "ค่าคอมมิชชั่น") {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูลเงินได้</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข ค่าคอมมิชชั่น</h1>
 </div>

 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">รหัส *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="IN05" disabled className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="ค่าคอมมิชชั่น" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อเงินได้ (EN)</span>
 <input title="กรอกข้อมูล" type="text" defaultValue="Commission" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">นำไปคำนวณภาษี</span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณต่องวด</option>
 <option>ทั้งปี</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 text-[13.5px] font-bold text-slate-600 cursor-pointer mt-2">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำไปคำนวณประกันสังคม</span>
 </label>
 </div>

 <div className="grid grid-cols-2 gap-6 max-w-4xl mt-2">
 {/* ประเภทรายเดือน */}
 <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <div className="flex items-center gap-2 text-[14.5px] font-black text-slate-800">
 <span className="text-slate-400 text-[16px]">📅</span> ประเภทรายเดือน
 </div>
 <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer mt-1">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำเข้าค่าคอมฯ จากระบบ POSPOS</span>
 </label>
 </div>

 {/* ประเภทรายวัน */}
 <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col gap-4">
 <div className="flex items-center gap-2 text-[14.5px] font-black text-slate-800">
 <span className="text-slate-400 text-[16px]">📅</span> ประเภทรายวัน
 </div>
 <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer mt-1">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>นำเข้าค่าคอมฯ จากระบบ POSPOS</span>
 </label>
 </div>
 </div>

 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6 max-w-4xl">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (activeEditingEarning !== null) {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Header & Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <button onClick={() => setActiveEditingEarning(null)} className="hover:text-indigo-600 transition-colors font-bold">
 เงินได้/เงินหัก
 </button>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">แก้ไขข้อมูล</span>
 </div>
 
 <button onClick={() => setActiveEditingEarning(null)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-10 bg-white flex flex-col gap-8 font-sans">
 <div className="flex flex-col gap-2 max-w-4xl">
 <h1 className="text-[22px] font-black text-slate-800 tracking-tight">แก้ไข {activeEditingEarning}</h1>
 </div>

 {/* Settings Form */}
 <div className="flex flex-col gap-4 max-w-4xl">
 <div className="flex items-center gap-3">
 <span className="text-[13px] font-black text-slate-500">สถานะ</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="sr-only peer" defaultChecked />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
 </label>
 </div>

 <div className="grid grid-cols-3 gap-4 mt-2">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">ชื่อ *</span>
 <input title="กรอกข้อมูล" type="text" defaultValue={activeEditingEarning} className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]" />
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การปัดเศษ</span>
 <select title="เลือกข้อมูล" defaultValue="ไม่ปัดเศษ" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>ไม่ปัดเศษ</option>
 <option>ปัดอัตโนมัติ</option>
 <option>ปัดขึ้น</option>
 <option>ปัดลง</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">การคำนวณภาษี</span>
 <select title="เลือกข้อมูล" defaultValue="ต่องวด" className="w-full bg-white border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0EA5E9]">
 <option>คำนวณต่องวด</option>
 <option>ทั้งปี</option>
 <option>ไม่คำนวณ</option>
 </select>
 </div>
 </div>
 </div>
 {/* Action Buttons Row */}
 <div className="flex items-center justify-end gap-3 mt-10 mb-6">
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13.5px] font-bold transition-all bg-white shadow-sm"
 >
 ยกเลิก
 </button>
 <button onClick={() => setActiveEditingEarning(null)}
 className="px-8 py-2.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[13.5px] font-black shadow-sm shadow-sky-100 transition-all"
 >
 บันทึกข้อมูล
 </button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full font-sans animate-in fade-in duration-200">
 {/* Header & Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-4 flex-shrink-0 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <button onClick={() => setEarningsTab("เงินได้")}
 className={`relative px-6 py-3 text-[14px] font-black transition-all flex items-center gap-2 ${
 earningsTab === "เงินได้" ? "text-[#0EA5E9] border-b-2 border-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"
 }`}
 >
 <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0EA5E9] text-white text-[12px]">+</span>
 <span>เงินได้</span>
 </button>
 <button onClick={() => setEarningsTab("เงินหัก")}
 className={`relative px-6 py-3 text-[14px] font-black transition-all flex items-center gap-2 ${
 earningsTab === "เงินหัก" ? "text-[#0EA5E9] border-b-2 border-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"
 }`}
 >
 <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#64748B] text-white text-[12px]">-</span>
 <span>เงินหัก</span>
 </button>
 </div>
 
 {/* Close button */}
 <button onClick={() => setIsEarningsSettingsOpen(false)}
 className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100 bg-white"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* View Content */}
 <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto bg-[#F1F5F9]">
 {/* Search and Actions */}
 <div className="flex items-center justify-between">
 <div className="flex items-center bg-white border border-slate-200/60 rounded-2xl px-4 py-2.5 max-w-xs w-full shadow-sm hover:border-slate-300 focus-within:border-[#0EA5E9] focus-within:ring-2 focus-within:ring-[#0EA5E9]/10 transition-all">
 <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 <input title="กรอกข้อมูล" 
 type="text" 
 placeholder="ค้นหา รหัส, ชื่อ" 
 className="w-full bg-transparent text-[13px] font-bold text-slate-600 outline-none" 
 />
 </div>

 <div className="flex items-center gap-3">
 <div className="relative">
 <span className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-black text-slate-400 tracking-wider">สถานะ</span>
 <select title="เลือกข้อมูล" className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-bold text-slate-700 outline-none cursor-pointer shadow-sm hover:border-slate-300 focus:border-[#0EA5E9]">
 <option value="ทั้งหมด">ทั้งหมด</option>
 <option value="เปิดใช้งาน">เปิดใช้งาน</option>
 <option value="ปิดใช้งาน">ปิดใช้งาน</option>
 </select>
 </div>

 <button onClick={() => setActiveEditingEarning("create_new")}
 className="flex items-center gap-2 px-5 py-2.5 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-2xl text-[13px] font-black transition-all shadow-lg shadow-[#0EA5E9]/20 active:scale-95"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
 </svg>
 <span>{earningsTab === "เงินได้" ? "เพิ่มเงินได้" : "เพิ่มเงินหัก"}</span>
 </button>
 </div>
 </div>

 {/* Items count */}
 <span className="text-[12px] font-bold text-slate-400">
 {earningsTab === "เงินได้" ? "9 รายการ" : "10 รายการ"}
 </span>

 {/* Table */}
 <div className="bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full border-collapse text-left">
 <thead>
 <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[12.5px] font-black text-slate-600 uppercase tracking-wider">
 <th className="px-6 py-4">รหัส</th>
 <th className="px-6 py-4">{earningsTab === "เงินได้" ? "ชื่อเงินได้" : "ชื่อเงินหัก"}</th>
 <th className="px-6 py-4">การปัดเศษ</th>
 <th className="px-6 py-4">{earningsTab === "เงินได้" ? "ทำการจ่ายที่งวด" : "ทำการหัก"}</th>
 <th className="px-6 py-4">คำนวณภาษี</th>
 <th className="px-6 py-4">สถานะ</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-[13px] font-bold text-slate-600">
 {earningsTab === "เงินได้" ? (
 <>
 {[
 { id: "IN01", name: "เงินเดือน / ค่าจ้างรายวัน", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "ทั้งปี", status: "เปิดใช้งาน" },
 { id: "IN02", name: "ค่าโอที", round: "ปัดอัตโนมัติ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "IN03", name: "เบี้ยขยัน", round: "ไม่ปัดเศษ", period: "งวดสิ้นเดือน", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "IN04", name: "โบนัส", round: "ไม่ปัดเศษ", period: "งวดสิ้นเดือน", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "IN05", name: "ค่าคอมมิชชั่น", round: "ปัดอัตโนมัติ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "IN06", name: "เงินตกเบิก", round: "ปัดอัตโนมัติ", period: "งวดสิ้นเดือน", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "IN100", name: "สวัสดิการ", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "ทั้งปี", status: "ปิดใช้งาน" },
 { id: "IN101", name: "เบิกค่าใช้จ่าย", round: "ไม่ปัดเศษ", period: "งวดสิ้นเดือน", tax: "ไม่คำนวณ", status: "เปิดใช้งาน" },
 { id: "IN07", name: "เงินได้อื่นๆ", round: "ปัดอัตโนมัติ", period: "งวดสิ้นเดือน", tax: "คำนวณ", status: "เปิดใช้งาน" }
 ].map((item, idx) => (
 <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4 text-slate-500">{item.id}</td>
 <td className="px-6 py-4 text-slate-800">
 <button onClick={() => setActiveEditingEarning(item.name)} 
 className="hover:text-[#0EA5E9] transition-colors text-left"
 >
 {item.name}
 </button>
 </td>
 <td className="px-6 py-4 text-slate-500">{item.round}</td>
 <td className="px-6 py-4 text-slate-500">{item.period}</td>
 <td className="px-6 py-4 text-slate-500">{item.tax}</td>
 <td className="px-6 py-4">
 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black ${
 item.status === "เปิดใช้งาน" 
 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
 : "bg-slate-50 text-slate-400 border border-slate-200"
 }`}>
 <span className={`w-1.5 h-1.5 rounded-full ${item.status === "เปิดใช้งาน" ? "bg-emerald-500" : "bg-slate-400"}`} />
 {item.status}
 </span>
 </td>
 </tr>
 ))}
 </>
 ) : (
 <>
 {[
 { id: "D01", name: "ภาษีหัก ณ ที่จ่าย", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "-", status: "เปิดใช้งาน" },
 { id: "D02", name: "ประกันสังคม", round: "ปัดอัตโนมัติ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "D03", name: "เงินกู้ กยศ.", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "ไม่คำนวณ", status: "เปิดใช้งาน" },
 { id: "D04", name: "หักลาไม่รับค่าจ้าง", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "D05", name: "หักมาสาย", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "D06", name: "หักขาดงาน", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "D07", name: "หักกลับก่อน", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "D100", name: "เบิกเงินเดือน", round: "ไม่ปัดเศษ", period: "งวดสิ้นเดือน", tax: "ไม่คำนวณ", status: "เปิดใช้งาน" },
 { id: "D101", name: "หักลืมลงเวลาออกงาน", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" },
 { id: "D08", name: "เงินหักอื่น ๆ", round: "ไม่ปัดเศษ", period: "ทุกงวด", tax: "คำนวณ", status: "เปิดใช้งาน" }
 ].map((item, idx) => (
 <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4 text-slate-500">{item.id}</td>
 <td className="px-6 py-4 text-slate-800">
 <button onClick={() => setActiveEditingEarning(item.name)} 
 className="hover:text-[#0EA5E9] transition-colors text-left"
 >
 {item.name}
 </button>
 </td>
 <td className="px-6 py-4 text-slate-500">{item.round}</td>
 <td className="px-6 py-4 text-slate-500">{item.period}</td>
 <td className="px-6 py-4 text-slate-500">{item.tax}</td>
 <td className="px-6 py-4">
 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black ${
 item.status === "เปิดใช้งาน" 
 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
 : "bg-slate-50 text-slate-400 border border-slate-200"
 }`}>
 <span className={`w-1.5 h-1.5 rounded-full ${item.status === "เปิดใช้งาน" ? "bg-emerald-500" : "bg-slate-400"}`} />
 {item.status}
 </span>
 </td>
 </tr>
 ))}
 </>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </div>
 );
 }

 if (isCreatingPeriod) {
 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-y-auto font-sans animate-in fade-in duration-300">
 {/* Header & Breadcrumbs */}
 <div className="bg-white border-b border-slate-200/60 px-10 py-6 flex-shrink-0">
 <div className="flex items-center gap-2 text-[12.5px] font-bold text-slate-400">
 <span>เงินเดือน</span>
 <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-600 font-black">สร้างงวดเงินเดือน</span>
 </div>
 <h1 className="text-[22px] font-black text-slate-800 mt-2 tracking-tight">สร้างงวดเงินเดือน</h1>
 </div>

 {/* Form Body */}
 <div className="flex-1 max-w-3xl mx-auto w-full p-10 flex flex-col gap-8">
 {/* ประเภทการจ่ายเงิน */}
 <div className="flex flex-col gap-3">
 <label id="label-payType" className="text-[13px] font-black text-slate-800">ประเภทการจ่ายเงิน</label>
 <div className="flex items-center gap-8">
 <label htmlFor="payType-monthly" className="flex items-center gap-2 cursor-pointer text-[13.5px] font-bold text-slate-700">
 <input title="กรอกข้อมูล" 
 type="radio" 
 id="payType-monthly"
 aria-label="ประเภทการจ่ายเงินรายเดือน"
 name="payType" 
 checked={payType === "รายเดือน"} 
 onChange={() => setPayType("รายเดือน")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>รายเดือน</span>
 </label>
 <label htmlFor="payType-daily" className="flex items-center gap-2 cursor-pointer text-[13.5px] font-bold text-slate-700">
 <input title="กรอกข้อมูล" 
 type="radio" 
 id="payType-daily"
 aria-label="ประเภทการจ่ายเงินรายวัน"
 name="payType" 
 checked={payType === "รายวัน"} 
 onChange={() => setPayType("รายวัน")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>รายวัน</span>
 </label>
 </div>
 </div>

 {/* วันที่เริ่มงวดแรกของปี */}
 <div className="flex flex-col gap-2 max-w-sm">
 <label htmlFor="start-date-first-period" className="text-[13px] font-black text-slate-800">วันที่เริ่มงวดแรกของปี</label>
 <div className="relative">
 <input title="กรอกข้อมูล" 
 type="text" 
 id="start-date-first-period"
 aria-label="วันที่เริ่มงวดแรกของปี"
 defaultValue="01/01/2569"
 className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-[13.5px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 shadow-sm"
 />
 <svg className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 </div>
 </div>

 {/* จำนวนงวดการจ่าย */}
 <div className="flex flex-col gap-2">
 <label className="text-[13px] font-black text-slate-800">จำนวนงวดการจ่าย</label>
 <div className={`flex bg-slate-100/80 rounded-2xl p-1 border border-slate-200/40 transition-all duration-300 ${payType === "รายวัน" ? "max-w-md" : "max-w-sm"}`}>
 <button onClick={() => setPaymentFrequency("เดือนละ 1 ครั้ง")}
 className={`flex-1 text-center py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-all duration-200 ${
 paymentFrequency === "เดือนละ 1 ครั้ง" 
 ? "bg-white shadow-sm font-black text-[#0EA5E9] border border-slate-100" 
 : "font-bold text-slate-500 hover:text-slate-700"
 }`}
 >
 <span>เดือนละ 1 ครั้ง</span>
 {paymentFrequency === "เดือนละ 1 ครั้ง" && (
 <svg className="w-3.5 h-3.5 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
 </svg>
 )}
 </button>
 <button onClick={() => setPaymentFrequency("เดือนละ 2 ครั้ง")}
 className={`flex-1 text-center py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-all duration-200 ${
 paymentFrequency === "เดือนละ 2 ครั้ง" 
 ? "bg-white shadow-sm font-black text-[#0EA5E9] border border-slate-100" 
 : "font-bold text-slate-500 hover:text-slate-700"
 }`}
 >
 <span>เดือนละ 2 ครั้ง</span>
 {paymentFrequency === "เดือนละ 2 ครั้ง" && (
 <svg className="w-3.5 h-3.5 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
 </svg>
 )}
 </button>
 {payType === "รายวัน" && (
 <button onClick={() => setPaymentFrequency("ทุกสัปดาห์")}
 className={`flex-1 text-center py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-all duration-200 ${
 paymentFrequency === "ทุกสัปดาห์" 
 ? "bg-white shadow-sm font-black text-[#0EA5E9] border border-slate-100" 
 : "font-bold text-slate-500 hover:text-slate-700"
 }`}
 >
 <span>ทุกสัปดาห์</span>
 {paymentFrequency === "ทุกสัปดาห์" && (
 <svg className="w-3.5 h-3.5 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
 </svg>
 )}
 </button>
 )}
 </div>
 </div>

 {paymentFrequency === "เดือนละ 2 ครั้ง" && (
 <div className="flex flex-col gap-2 max-w-sm">
 <label className="text-[13px] font-black text-slate-800">วันสุดท้ายของงวดที่ 1</label>
 <div className="flex items-center gap-3 text-[13.5px] font-bold text-slate-700">
 <span className="text-slate-400 text-[13px]">วันที่</span>
 <div className="max-w-[100px] relative flex-1">
 <select 
 title="วันสุดท้ายของงวดที่ 1"
 aria-label="วันสุดท้ายของงวดที่ 1"
 id="payroll-period1-last-day-select"
 className="w-full px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black text-slate-600 outline-none hover:border-slate-300 shadow-sm">
 <option value="15">15</option>
 <option value="10">10</option>
 <option value="20">20</option>
 </select>
 </div>
 <span className="text-slate-400 text-[13px]">ของเดือน</span>
 </div>
 </div>
 )}

 {/* งวดที่เริ่มทำเงินเดือนบน hrzoft */}
 <div className="flex flex-col gap-2 max-w-sm">
 <label className="text-[13px] font-black text-slate-800">งวดที่เริ่มทำเงินเดือนบน hrzoft <span className="text-rose-500">*</span></label>
 <select 
 title="งวดที่เริ่มทำเงินเดือน"
 aria-label="งวดที่เริ่มทำเงินเดือน"
 id="payroll-start-period-select"
 className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-[13.5px] font-bold text-slate-400 outline-none cursor-pointer hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 shadow-sm">
 <option value="">กรุณาเลือก</option>
 <option value="1">งวดที่ 1 (มกราคม)</option>
 <option value="2">งวดที่ 2 (กุมภาพันธ์)</option>
 <option value="3">งวดที่ 3 (มีนาคม)</option>
 </select>
 </div>

 {/* พนักงาน */}
 <div className="flex flex-col gap-2">
 <label className="text-[13px] font-black text-slate-800">พนักงาน</label>
 <div className="flex items-center gap-3">
 <div className="flex max-w-xs bg-slate-100/80 rounded-2xl p-1 border border-slate-200/40 flex-1">
 <button className="flex-1 text-center py-2 bg-white shadow-sm rounded-xl text-[13px] font-black text-[#0EA5E9] border border-slate-100">
 ทุกคน
 </button>
 <button className="flex-1 text-center py-2 text-slate-500 text-[13px] font-bold hover:text-slate-700 transition-colors">
 กำหนดเอง
 </button>
 </div>
 <button 
 title="เพิ่มพนักงาน"
 aria-label="เพิ่มพนักงาน"
 id="payroll-add-emp-btn"
 className="p-2 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400 transition-colors shadow-sm">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
 </svg>
 </button>
 </div>
 </div>

 {/* วันที่ชำระ */}
 {paymentFrequency === "เดือนละ 2 ครั้ง" ? (
 <div className="flex flex-col gap-6">
 {/* วันที่ชำระงวดที่ 1 */}
 <div className="flex flex-col gap-3">
 <label className="text-[13px] font-black text-slate-800">วันที่ชำระงวดที่ 1</label>
 <div className="flex items-center gap-3 text-[13.5px] font-bold text-slate-700">
 <span>ทุกวันที่</span>
 <div className="max-w-[100px] relative">
 <select 
 title="วันที่ชำระงวดที่ 1"
 aria-label="วันที่ชำระงวดที่ 1"
 id="payroll-period1-pay-day-select"
 className="w-full px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black text-slate-600 outline-none hover:border-slate-300 shadow-sm">
 {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
 <option key={day} value={day}>{day}</option>
 ))}
 </select>
 </div>
 <span>ของเดือน</span>
 </div>
 
 {/* Extra Checkboxes */}
 <div className="flex items-center gap-6 mt-1 text-[13px] font-bold text-slate-600">
 <label htmlFor="limit-payment-amount" className="flex items-center gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" 
 id="limit-payment-amount" 
 aria-label="จำกัดวงเงินชำระ" 
 type="checkbox" 
 checked={limitPaymentAmount}
 onChange={() => {
 setLimitPaymentAmount(!limitPaymentAmount);
 setLimitSalaryBase(false);
 }}
 className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>จำกัดวงเงินชำระ</span>
 </label>
 <label htmlFor="limit-salary-base" className="flex items-center gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" 
 id="limit-salary-base" 
 aria-label="จำกัดฐานเงินเดือน" 
 type="checkbox" 
 checked={limitSalaryBase}
 onChange={() => {
 setLimitSalaryBase(!limitSalaryBase);
 setLimitPaymentAmount(false);
 }}
 className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>จำกัดฐานเงินเดือน</span>
 </label>
 </div>

 {(limitPaymentAmount || limitSalaryBase) && (
 <div className="relative mt-3 max-w-[320px] animate-in fade-in duration-200">
 <span className="absolute -top-2.5 left-4 bg-[#F8FAFC] px-1 text-[10px] font-black text-slate-400 tracking-wide">
 วงเงินสูงสุด
 </span>
 <div className="flex items-center bg-white border border-slate-200/60 rounded-2xl px-4 py-2.5 shadow-sm hover:border-slate-300 focus-within:border-[#0EA5E9] focus-within:ring-2 focus-within:ring-[#0EA5E9]/10 transition-all">
 <span className="text-slate-400 font-black mr-2 text-[13.5px]">฿</span>
 <input title="กรอกข้อมูล" type="text"
 value={maxLimitAmount}
 onChange={(e) => setMaxLimitAmount(e.target.value)}
 className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none"
 aria-label="วงเงินสูงสุด"
 />
 </div>
 </div>
 )}
 </div>

 {/* วันที่ชำระงวดที่ 2 */}
 <div className="flex flex-col gap-3">
 <label className="text-[13px] font-black text-slate-800">วันที่ชำระงวดที่ 2</label>
 <div className="flex flex-col gap-3">
 <label htmlFor="paymentDay2-last-day" className="flex items-center gap-3 cursor-pointer text-[13.5px] font-bold text-slate-700">
 <input title="กรอกข้อมูล" 
 type="radio" 
 id="paymentDay2-last-day"
 aria-label="ชำระงวดที่ 2 วันสุดท้ายของงวด"
 name="paymentDay2" 
 checked={paymentDay2 === "วันสุดท้ายของงวด"} 
 onChange={() => setPaymentDay2("วันสุดท้ายของงวด")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>วันสุดท้ายของงวด</span>
 </label>
 
 <div className="flex items-center gap-3 text-[13.5px] font-bold text-slate-700">
 <label htmlFor="paymentDay2-specific-day" className="flex items-center gap-3 cursor-pointer">
 <input title="กรอกข้อมูล" 
 type="radio" 
 id="paymentDay2-specific-day"
 aria-label="ชำระงวดที่ 2 ทุกวันที่"
 name="paymentDay2" 
 checked={paymentDay2 === "ทุกวันที่"} 
 onChange={() => setPaymentDay2("ทุกวันที่")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>ทุกวันที่</span>
 </label>
 <div className="max-w-[100px] relative">
 <select 
 title="วันที่ชำระงวดที่ 2"
 aria-label="วันที่ชำระงวดที่ 2"
 id="payroll-period2-pay-day-select"
 className={`w-full px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black outline-none shadow-sm ${
 paymentDay2 === "ทุกวันที่" 
 ? "text-slate-600 hover:border-slate-300" 
 : "text-slate-400 bg-slate-50/60 pointer-events-none"
 }`}
 disabled={paymentDay2 !== "ทุกวันที่"}
 >
 {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
 <option key={day} value={day}>{day}</option>
 ))}
 </select>
 </div>
 <span>ของเดือน</span>
 </div>

 <div className="flex items-center gap-3 text-[13.5px] font-bold text-slate-700">
 <label htmlFor="paymentDay2-next-month" className="flex items-center gap-3 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" 
 id="paymentDay2-next-month"
 name="paymentDay2" 
 checked={paymentDay2 === "ทุกวันที่ในเดือนถัดไป"} 
 onChange={() => setPaymentDay2("ทุกวันที่ในเดือนถัดไป")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>ทุกวันที่</span>
 </label>
 <div className="max-w-[100px] relative">
 <select 
 title="วันที่ชำระงวดที่ 2 ในเดือนถัดไป"
 aria-label="วันที่ชำระงวดที่ 2 ในเดือนถัดไป"
 id="payroll-period2-next-month-pay-day-select"
 className={`w-full px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black outline-none shadow-sm ${
 paymentDay2 === "ทุกวันที่ในเดือนถัดไป" 
 ? "text-slate-600 hover:border-slate-300" 
 : "text-slate-400 bg-slate-50/60 pointer-events-none"
 }`}
 disabled={paymentDay2 !== "ทุกวันที่ในเดือนถัดไป"}
 >
 {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
 <option key={day} value={day}>{day}</option>
 ))}
 </select>
 </div>
 <span>ในเดือนถัดไป</span>
 </div>
 </div>
 </div>
 </div>
 ) : paymentFrequency === "ทุกสัปดาห์" ? (
 <div className="flex flex-col gap-3">
 <label className="text-[13px] font-black text-slate-800">วันที่ชำระ</label>
 <div className="flex flex-col gap-3 text-[13.5px] font-bold text-slate-700">
 {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"].map((day) => (
 <label key={day} className="flex items-center gap-3 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" 
 name="paymentDayWeekly"
 checked={paymentDayWeekly === day}
 onChange={() => setPaymentDayWeekly(day)}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>{day}</span>
 </label>
 ))}
 </div>
 </div>
 ) : (
 <div className="flex flex-col gap-3">
 <label className="text-[13px] font-black text-slate-800">วันที่ชำระ</label>
 <div className="flex flex-col gap-4">
 <label htmlFor="paymentDay-last-day" className="flex items-center gap-3 cursor-pointer text-[13.5px] font-bold text-slate-700">
 <input title="กรอกข้อมูล" 
 type="radio" 
 id="paymentDay-last-day"
 aria-label="ชำระวันสุดท้ายของงวด"
 name="paymentDay" 
 checked={paymentDay === "วันสุดท้ายของงวด"} 
 onChange={() => setPaymentDay("วันสุดท้ายของงวด")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>วันสุดท้ายของงวด</span>
 </label>

 <div className="flex items-center gap-3 text-[13.5px] font-bold text-slate-700">
 <label htmlFor="paymentDay-specific-day" className="flex items-center gap-3 cursor-pointer">
 <input title="กรอกข้อมูล" 
 type="radio" 
 id="paymentDay-specific-day"
 aria-label="ชำระทุกวันที่"
 name="paymentDay" 
 checked={paymentDay === "ทุกวันที่ 15"} 
 onChange={() => setPaymentDay("ทุกวันที่ 15")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>ทุกวันที่</span>
 </label>
 <div className="max-w-[100px] relative">
 <select 
 title="วันที่ชำระ"
 aria-label="วันที่ชำระ"
 id="payroll-pay-day-select"
 className={`w-full px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black outline-none shadow-sm ${
 paymentDay === "ทุกวันที่ 15" 
 ? "text-slate-600 hover:border-slate-300" 
 : "text-slate-400 bg-slate-50/60 pointer-events-none"
 }`}
 disabled={paymentDay !== "ทุกวันที่ 15"}
 >
 {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
 <option key={day} value={day}>{day}</option>
 ))}
 </select>
 </div>
 <span>ของเดือน</span>
 </div>

 <div className="flex items-center gap-3 text-[13.5px] font-bold text-slate-700">
 <label htmlFor="paymentDay-next-month" className="flex items-center gap-3 cursor-pointer">
 <input title="กรอกข้อมูล" type="radio" 
 id="paymentDay-next-month"
 name="paymentDay" 
 checked={paymentDay === "ทุกวันที่ถัดไป"} 
 onChange={() => setPaymentDay("ทุกวันที่ถัดไป")}
 className="w-4.5 h-4.5 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>ทุกวันที่</span>
 </label>
 <div className="max-w-[100px] relative">
 <select 
 title="วันที่ชำระในเดือนถัดไป"
 aria-label="วันที่ชำระในเดือนถัดไป"
 id="payroll-next-month-pay-day-select"
 className={`w-full px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black outline-none shadow-sm ${
 paymentDay === "ทุกวันที่ถัดไป" 
 ? "text-slate-600 hover:border-slate-300" 
 : "text-slate-400 bg-slate-50/60 pointer-events-none"
 }`}
 disabled={paymentDay !== "ทุกวันที่ถัดไป"}
 >
 {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
 <option key={day} value={day}>{day}</option>
 ))}
 </select>
 </div>
 <span>ในเดือนถัดไป</span>
 </div>

 {/* Extra Checkboxes for monthly/single pay */}
 <div className="flex items-center gap-6 mt-3 text-[13px] font-bold text-slate-600">
 <label htmlFor="limit-payment-amount-single" className="flex items-center gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" 
 id="limit-payment-amount-single" 
 aria-label="จำกัดวงเงินชำระ" 
 type="checkbox" 
 checked={limitPaymentAmount}
 onChange={() => {
 setLimitPaymentAmount(!limitPaymentAmount);
 setLimitSalaryBase(false);
 }}
 className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>จำกัดวงเงินชำระ</span>
 </label>
 <label htmlFor="limit-salary-base-single" className="flex items-center gap-2 cursor-pointer">
 <input title="กรอกข้อมูล" 
 id="limit-salary-base-single" 
 aria-label="จำกัดฐานเงินเดือน" 
 type="checkbox" 
 checked={limitSalaryBase}
 onChange={() => {
 setLimitSalaryBase(!limitSalaryBase);
 setLimitPaymentAmount(false);
 }}
 className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
 />
 <span>จำกัดฐานเงินเดือน</span>
 </label>
 </div>

 {(limitPaymentAmount || limitSalaryBase) && (
 <div className="relative mt-2 max-w-[320px] animate-in fade-in duration-200">
 <span className="absolute -top-2.5 left-4 bg-[#F8FAFC] px-1 text-[10px] font-black text-slate-400 tracking-wide">
 วงเงินสูงสุด
 </span>
 <div className="flex items-center bg-white border border-slate-200/60 rounded-2xl px-4 py-2.5 shadow-sm hover:border-slate-300 focus-within:border-[#0EA5E9] focus-within:ring-2 focus-within:ring-[#0EA5E9]/10 transition-all">
 <span className="text-slate-400 font-black mr-2 text-[13.5px]">฿</span>
 <input title="กรอกข้อมูล" type="text"
 value={maxLimitAmount}
 onChange={(e) => setMaxLimitAmount(e.target.value)}
 className="w-full bg-transparent text-[13.5px] font-bold text-slate-700 outline-none"
 aria-label="วงเงินสูงสุด"
 />
 </div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* Action Buttons moved inside */}
 <div className="flex items-center gap-3 mt-6 max-w-sm">
 <button onClick={() => setIsCreatingPeriod(false)}
 className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-[13.5px] font-bold text-slate-600 transition-colors active:scale-95 shadow-sm flex-1 text-center"
 >
 ยกเลิก
 </button>
 <button onClick={() => {
 setIsCreatingPeriod(false);
 setToast("สร้างงวดเงินเดือนสำเร็จ");
 }}
 className="px-6 py-2.5 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-2xl text-[13.5px] font-black transition-all shadow-md shadow-sky-500/10 active:scale-95 flex-1 text-center"
 >
 สร้าง
 </button>
 </div>

 </div>
 </div>
 );
 }

 return (
 <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-hidden font-sans">
 
 {/* Top Menu Tab Bar */}
 <div className="bg-white border-b border-slate-200/60 px-8 flex-shrink-0 z-20 flex items-center justify-between">
 <div className="flex items-center gap-2">
 {tabs.map((tab) => (
 <button key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`relative px-6 py-5 text-[14px] font-black transition-all group flex items-center gap-2 ${
 activeTab === tab.id ? "text-[#0EA5E9]" : "text-slate-400 hover:text-slate-600"
 }`}
 >
 {tab.count !== null && (
 <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
 activeTab === tab.id ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-400"
 }`}>
 {tab.count}
 </span>
 )}
 <span>{tab.label}</span>
 {activeTab === tab.id && (
 <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0EA5E9] rounded-t-full shadow-[0_-4px_10px_rgba(14,165,233,0.2)]" />
 )}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-4 py-3">
 <button 
 title="วิธีใช้งาน"
 className="flex items-center gap-2 px-3 py-2 bg-transparent text-slate-400 hover:text-slate-600 text-[13px] font-bold transition-colors"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span>วิธีใช้งาน</span>
 </button>
 </div>
 </div>

 {/* View Content */}
 <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto bg-[#F1F5F9]">
 
 {/* Controls Row */}
 <div className="flex items-center justify-end gap-3">
 <button onClick={() => setIsHiddenAmounts(!isHiddenAmounts)}
 className={`p-3 bg-white border border-slate-200/60 text-slate-400 hover:text-slate-600 rounded-2xl transition-all shadow-sm hover:shadow active:scale-95 ${isHiddenAmounts ? 'text-sky-500 bg-sky-50/20 border-sky-100' : ''}`}
 title={isHiddenAmounts ? "แสดงยอดเงิน" : "ซ่อนยอดเงิน"}
 aria-label={isHiddenAmounts ? "แสดงยอดเงิน" : "ซ่อนยอดเงิน"}
 id="payroll-toggle-amounts-btn-2"
 >
 {isHiddenAmounts ? (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
 </svg>
 ) : (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 )}
 </button>

 {/* Year Selector */}
 <div className="relative">
 <div className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-black text-slate-400 tracking-wider">ปี</div>
 <button onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
 className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13.5px] font-bold text-slate-700 transition-all shadow-sm hover:border-slate-300"
 >
 <span>{selectedYear}</span>
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 </button>
 {isYearDropdownOpen && (
 <>
 <div className="fixed inset-0 z-30" onClick={() => setIsYearDropdownOpen(false)} />
 <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-in fade-in duration-100 text-[13.5px] font-bold">
 {["2569", "2568", "2567"].map(year => (
 <button key={year}
 onClick={() => {
 setSelectedYear(year);
 setIsYearDropdownOpen(false);
 }}
 className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-slate-700"
 >
 {year}
 </button>
 ))}
 </div>
 </>
 )}
 </div>

 {/* Status Filter Dropdown */}
 {activeTab === "งวดทั้งหมด" && (
 <div className="relative">
 <div className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-black text-slate-400 tracking-wider">สถานะ</div>
 <select 
 title="กรองสถานะ"
 aria-label="กรองสถานะ"
 id="payroll-status-filter-select"
 value={periodStatusFilter}
 onChange={(e) => setPeriodStatusFilter(e.target.value)}
 className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13.5px] font-bold text-slate-700 outline-none cursor-pointer shadow-sm hover:border-slate-300"
 >
 <option value="ทั้งหมด">ทั้งหมด</option>
 <option value="รอคำนวณ">รอคำนวณ</option>
 <option value="จ่ายแล้ว">จ่ายแล้ว</option>
 </select>
 </div>
 )}

 {/* Earnings Settings button */}
 {activeTab !== "เงินสะสมประจำปี" && activeTab !== "ตั้งค่าสลิปเงินเดือน" && (
 <button onClick={() => setIsEarningsSettingsOpen(true)}
 className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 text-slate-600 rounded-2xl text-[13.5px] font-bold transition-all shadow-sm"
 >
 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <span>เงินได้/เงินหัก</span>
 </button>
 )}

 {/* Create Period Dropdown */}
 {activeTab !== "เงินสะสมประจำปี" && activeTab !== "ตั้งค่าสลิปเงินเดือน" && (
 <div className="relative">
 <button onClick={() => setIsCreatePeriodDropdownOpen(!isCreatePeriodDropdownOpen)}
 className="flex items-center gap-2 px-5 py-2.5 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-[16px] text-[13.5px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95"
 >
 <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
 </svg>
 <span>สร้างงวด</span>
 <svg className={`w-4 h-4 ml-0.5 transition-transform duration-200 ${isCreatePeriodDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
 </svg>
 </button>
 
 {isCreatePeriodDropdownOpen && (
 <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
 <button onClick={() => {
 setIsCreatePeriodDropdownOpen(false);
 setIsCreatingPeriod(true);
 }}
 className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[13.5px] font-bold text-slate-700 transition-colors"
 >
 สร้างงวด
 </button>
 <button onClick={() => {
 setIsCreatePeriodDropdownOpen(false);
 setIsCreatingSupplementaryPeriod(true);
 }}
 className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[13.5px] font-bold text-slate-700 transition-colors border-t border-slate-50"
 >
 สร้างงวดเสริม
 </button>
 </div>
 )}
 </div>
 )}

 {/* Import Annual Accumulations Button */}
 {activeTab === "เงินสะสมประจำปี" && (
 <button onClick={() => setToast("นำเข้าเงินสะสมประจำปีสำเร็จ")}
 className="flex items-center gap-2 px-5 py-2.5 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-[16px] text-[13.5px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 <span>นำเข้าเงินสะสมประจำปี</span>
 </button>
 )}
 </div>

 {/* Main Data View */}
 {/* Main Data View */}
 {activeTab === "งวดทั้งหมด" ? (
 <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col animate-in fade-in duration-300">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[1200px]">
 <thead className="bg-slate-50/80 text-[12px] font-black text-slate-500 tracking-wider whitespace-nowrap">
 <tr>
 <th className="pl-8 py-4 border-b border-slate-100 w-20">งวดที่</th>
 <th className="px-4 py-4 border-b border-slate-100 w-32">รวมค่าใช้จ่าย</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28">สถานะ</th>
 <th className="px-4 py-4 border-b border-slate-100 w-48">ช่วงวันที่</th>
 <th className="px-4 py-4 border-b border-slate-100 w-36">วันที่ชำระ</th>
 <th className="px-4 py-4 border-b border-slate-100 w-36">ประเภทการจ่ายเงิน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-28 text-center">พนักงาน(คน)</th>
 <th className="px-4 py-4 border-b border-slate-100 w-32 text-right">ยอดชำระพนักงาน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-32 text-right">ภาษีหัก ณ ที่จ่าย</th>
 <th className="px-4 py-4 border-b border-slate-100 w-36 text-right">
 <span className="flex items-center justify-end gap-1.5">
 <span>รวมประกันสังคม</span>
 <svg className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <title>ข้อมูลเพิ่มเติม</title>
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </span>
 </th>
 <th className="pr-8 py-4 border-b border-slate-100 w-28 text-right">กยศ.</th>
 </tr>
 </thead>
 
 <tbody className="divide-y divide-slate-50 text-[13.5px] font-bold text-slate-600 whitespace-nowrap">
 {[
 { no: 10, total: 0.00, status: "รอคำนวณ", start: "01/10/2569", end: "31/10/2569", pay: "01/11/2569", type: "รายเดือน", emp: 9, payout: 0.00, tax: 0.00, sso: 0.00, student: 0.00 },
 { no: 11, total: 0.00, status: "รอคำนวณ", start: "01/11/2569", end: "30/11/2569", pay: "01/12/2569", type: "รายเดือน", emp: 9, payout: 0.00, tax: 0.00, sso: 0.00, student: 0.00 },
 { no: 12, total: 0.00, status: "รอคำนวณ", start: "01/12/2569", end: "31/12/2569", pay: "01/01/2570", type: "รายเดือน", emp: 9, payout: 0.00, tax: 0.00, sso: 0.00, student: 0.00 },
 ].map((row, index) => (
 <tr key={index} onClick={() => setSelectedPeriodDetails(row.no)} className="group hover:bg-slate-50/30 transition-all cursor-pointer">
 <td className="pl-8 py-4 text-slate-500 font-medium">
 {row.no}
 </td>
 <td className="px-4 py-4 text-slate-800 font-black bg-emerald-50/30">
 {isHiddenAmounts ? "฿ ••••" : `฿${row.total.toFixed(2)}`}
 </td>
 <td className="px-4 py-4">
 <span className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-500 text-[11.5px] font-black rounded-lg border border-orange-100/60">
 {row.status}
 </span>
 </td>
 <td className="px-4 py-4 text-[13px] text-slate-500 font-medium">
 {row.start} - {row.end}
 </td>
 <td className="px-4 py-4 text-[13px] text-slate-500 font-medium">
 {row.pay}
 </td>
 <td className="px-4 py-4 text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
 <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 <span>{row.type}</span>
 </td>
 <td className="px-4 py-4 text-[13px] text-slate-700 font-black text-center">
 {row.emp}
 </td>
 <td className="px-4 py-4 text-slate-700 font-black text-right">
 {isHiddenAmounts ? "••••" : row.payout.toFixed(2)}
 </td>
 <td className="px-4 py-4 text-slate-500 text-right">
 {isHiddenAmounts ? "••••" : row.tax.toFixed(2)}
 </td>
 <td className="px-4 py-4 text-slate-500 text-right">
 {isHiddenAmounts ? "••••" : row.sso.toFixed(2)}
 </td>
 <td className="pr-8 py-4 text-slate-500 text-right">
 {isHiddenAmounts ? "••••" : row.student.toFixed(2)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 ) : activeTab === "เงินสะสมประจำปี" ? (
 <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col animate-in fade-in duration-300">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[1000px]">
 <thead className="bg-slate-50/80 text-[12px] font-black text-slate-500 tracking-wider whitespace-nowrap">
 <tr>
 <th className="pl-8 py-4 border-b border-slate-100 w-20">รหัสพนักงาน</th>
 <th className="px-4 py-4 border-b border-slate-100 w-60">ชื่อ-นามสกุล</th>
 <th className="px-4 py-4 border-b border-slate-100 w-40 text-right">เงินได้สะสม</th>
 <th className="px-4 py-4 border-b border-slate-100 w-32 text-right">ประกันสังคมสะสม</th>
 <th className="px-4 py-4 border-b border-slate-100 w-32 text-right">ภาษีสะสม</th>
 <th className="pr-8 py-4 border-b border-slate-100 w-32 text-right">กยศ. สะสม</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 text-[13.5px] font-bold text-slate-600 whitespace-nowrap">
 {employeesState.map((emp) => {
 const accumulatedBase = emp.base * 10;
 const accumulatedSso = (emp.base * 0.05 > 750 ? 750 : emp.base * 0.05) * 10;
 const accumulatedTax = (emp.base * 0.03) * 10;
 const accumulatedStudent = emp.studentLoan ? emp.studentLoan * 10 : 0;

 return (
 <tr key={emp.id} className="group hover:bg-slate-50/30 transition-all cursor-pointer">
 <td className="pl-8 py-4 text-slate-500 font-medium">
 {emp.id}
 </td>
 <td className="px-4 py-4 text-slate-800 font-black flex items-center gap-2">
 <span className="text-[16px]">{emp.img}</span>
 <span>{emp.name}</span>
 </td>
 <td className="px-4 py-4 text-slate-700 font-black text-right bg-emerald-50/10">
 {isHiddenAmounts ? "฿ ••••" : `฿${accumulatedBase.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
 </td>
 <td className="px-4 py-4 text-slate-500 text-right">
 {isHiddenAmounts ? "฿ ••••" : `฿${accumulatedSso.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
 </td>
 <td className="px-4 py-4 text-slate-500 text-right">
 {isHiddenAmounts ? "฿ ••••" : `฿${accumulatedTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
 </td>
 <td className="pr-8 py-4 text-slate-500 text-right">
 {isHiddenAmounts ? "฿ ••••" : `฿${accumulatedStudent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 ) : activeTab === "ตั้งค่าสลิปเงินเดือน" ? (
 <div className="flex-1 bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-10 flex flex-col gap-8 animate-in fade-in duration-300">
 <h2 className="text-[20px] font-black text-slate-800 tracking-tight mb-2">ช่องทางการรับสลิปเงินเดือน</h2>

 {/* Toggle 1 */}
 <div className="flex items-center justify-between max-w-md">
 <span className="text-[14px] font-bold text-slate-700">อนุญาตให้พนักงานดูสลิป</span>
 <button onClick={() => setAllowEmployeeViewSlip(!allowEmployeeViewSlip)}
 className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
 allowEmployeeViewSlip ? "bg-[#22C55E]" : "bg-slate-200"
 }`}
 >
 <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
 allowEmployeeViewSlip ? "translate-x-6" : "translate-x-0"
 }`} />
 </button>
 </div>

 {/* Dropdown Selection */}
 <div className="relative max-w-md mt-2">
 <div className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10.5px] font-black text-sky-500 tracking-wider z-10">อนุญาตให้ดูสลิปเงินเดือนตั้งแต่สถานะ</div>
 <button onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
 className={`w-full flex items-center justify-between px-4 py-3.5 bg-white border rounded-2xl text-[13.5px] font-bold text-slate-700 transition-all shadow-sm ${
 isStatusDropdownOpen ? "border-sky-400 ring-2 ring-sky-400/10" : "border-slate-200"
 }`}
 >
 <span>{viewSlipFromStatus}</span>
 <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
 </svg>
 </button>

 {isStatusDropdownOpen && (
 <>
 <div className="fixed inset-0 z-30" onClick={() => setIsStatusDropdownOpen(false)} />
 <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-in fade-in duration-100 text-[13.5px] font-bold">
 {["คำนวณแล้ว", "รออนุมัติ", "อนุมัติแล้ว", "ชำระแล้ว", "ปิดงวด"].map((status) => (
 <button key={status}
 onClick={() => {
 setViewSlipFromStatus(status);
 setIsStatusDropdownOpen(false);
 }}
 className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 ${
 viewSlipFromStatus === status ? "text-sky-600 bg-sky-50/30" : ""
 }`}
 >
 {status}
 </button>
 ))}
 </div>
 </>
 )}
 </div>

 {/* Toggle 2 */}
 <div className="flex items-center justify-between max-w-md mt-2">
 <span className="text-[14px] font-bold text-slate-700">อนุญาตให้รับผ่าน Email</span>
 <button onClick={() => setAllowEmailDelivery(!allowEmailDelivery)}
 className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
 allowEmailDelivery ? "bg-[#22C55E]" : "bg-slate-200"
 }`}
 >
 <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
 allowEmailDelivery ? "translate-x-6" : "translate-x-0"
 }`} />
 </button>
 </div>

 </div>
 ) : (
 <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
 
 {/* Empty State Illustration */}
 <div className="relative flex items-center justify-center w-60 h-60 animate-pulse duration-2000">
 <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 to-indigo-50 rounded-[50px] blur-2xl opacity-60" />
 
 <div className="relative flex flex-col items-center">
 <div className="w-32 h-32 bg-white rounded-[36px] shadow-[0_16px_32px_rgba(15,23,42,0.08)] flex items-center justify-center border border-slate-50">
 <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
 </svg>
 </div>
 {/* Floating Document Elements */}
 <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-50 text-indigo-400 rounded-2xl shadow-sm border border-indigo-100/30 flex items-center justify-center transform rotate-12">
 📄
 </div>
 <div className="absolute bottom-4 -left-6 w-14 h-14 bg-sky-50 text-sky-400 rounded-2xl shadow-sm border border-sky-100/30 flex items-center justify-center transform -rotate-12">
 📊
 </div>
 </div>
 </div>

 <div className="mt-6 flex flex-col gap-1 max-w-xs">
 <h3 className="text-[17px] font-black text-slate-700">ไม่มีข้อมูล</h3>
 <p className="text-[13px] font-medium text-slate-400 leading-relaxed">คุณยังไม่มีการสร้างรอบเงินเดือนในระบบ</p>
 </div>
 
 </div>
 )}

 </div>

 {/* Supplementary Period Drawer */}
 {isCreatingSupplementaryPeriod && (
 <div className="fixed inset-0 z-50 flex justify-end font-sans animate-in fade-in duration-200">
 <div 
 className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] transition-opacity"
 onClick={() => setIsCreatingSupplementaryPeriod(false)}
 />
 <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
 {/* Header */}
 <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
 <h3 className="text-[16px] font-black text-slate-800">สร้างงวดเสริม</h3>
 <button onClick={() => setIsCreatingSupplementaryPeriod(false)}
 className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
 <div className="grid grid-cols-2 gap-3">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-black text-slate-400 tracking-wide">
 ประเภท
 </span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-700 outline-none shadow-sm hover:border-slate-300 focus:border-[#0EA5E9]">
 <option value="รายเดือน">รายเดือน</option>
 <option value="รายวัน">รายวัน</option>
 </select>
 </div>
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-black text-slate-400 tracking-wide">
 ปี
 </span>
 <select title="เลือกข้อมูล" className="w-full bg-white border border-slate-200/60 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-700 outline-none shadow-sm hover:border-slate-300 focus:border-[#0EA5E9]">
 <option value="2569">2569</option>
 <option value="2568">2568</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3 opacity-50 pointer-events-none">
 <div className="relative">
 <select title="เลือกข้อมูล" className="w-full bg-slate-50/60 border border-slate-200/60 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-400 outline-none">
 <option value="">เลือกงวดเงินเดือน</option>
 </select>
 </div>
 <div className="relative">
 <select title="เลือกข้อมูล" className="w-full bg-slate-50/60 border border-slate-200/60 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-400 outline-none">
 <option value="">เดือน</option>
 </select>
 </div>
 </div>

 <label className="flex items-center gap-2 cursor-pointer opacity-60">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" disabled />
 <span className="text-[12px] font-bold text-slate-600">กำหนดวันที่ตามงวดเดือนที่เลือก</span>
 </label>

 <div className="flex flex-col gap-3">
 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">
 วันที่เริ่มต้น *
 </span>
 <div className="flex items-center bg-white border border-slate-200/60 rounded-xl px-3 py-2.5 shadow-sm hover:border-slate-300">
 <input title="กรอกข้อมูล" type="text" placeholder="DD/MM/YYYY" className="w-full text-[13px] font-bold text-slate-600 outline-none" />
 <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 </div>
 </div>

 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">
 วันที่สิ้นสุด *
 </span>
 <div className="flex items-center bg-white border border-slate-200/60 rounded-xl px-3 py-2.5 shadow-sm hover:border-slate-300">
 <input title="กรอกข้อมูล" type="text" placeholder="DD/MM/YYYY" className="w-full text-[13px] font-bold text-slate-600 outline-none" />
 <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 </div>
 </div>

 <div className="relative">
 <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">
 วันที่ชำระเงิน *
 </span>
 <div className="flex items-center bg-white border border-slate-200/60 rounded-xl px-3 py-2.5 shadow-sm hover:border-slate-300">
 <input title="กรอกข้อมูล" type="text" placeholder="DD/MM/YYYY" className="w-full text-[13px] font-bold text-slate-600 outline-none" />
 <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 </div>
 </div>
 </div>

 {/* พนักงาน */}
 <div className="flex flex-col gap-2">
 <span className="text-[13px] font-black text-slate-800">พนักงาน</span>
 <div className="flex items-center gap-3">
 <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/30 flex-1">
 <button className="flex-1 text-center py-2 bg-white shadow-sm rounded-[10px] text-[12.5px] font-black text-[#0EA5E9]">
 พนักงานทุกคน
 </button>
 <button className="flex-1 text-center py-2 text-[12.5px] font-bold text-slate-500 hover:text-slate-700">
 กำหนดเอง
 </button>
 </div>
 <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
 </svg>
 </button>
 </div>
 </div>

 {/* Table of Income and Deductions */}
 <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
 <div className="grid grid-cols-2 bg-slate-50/80 text-[12.5px] font-black text-slate-700 border-b border-slate-200/60 px-4 py-2.5">
 <div>เงินได้</div>
 <div>เงินหัก</div>
 </div>
 <div className="grid grid-cols-2 text-[12.5px] font-bold text-slate-600 divide-x divide-slate-100">
 {/* เงินได้ Column */}
 <div className="flex flex-col divide-y divide-slate-100">
 {[
 "ค่าโอที", "เบี้ยขยัน", "โบนัส", "ค่าคอมมิชชั่น", 
 "เงินตกเบิก", "สวัสดิการ", "เบิกค่าใช้จ่าย", "ค้างจ่าย"
 ].map((item) => (
 <label key={item} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50/30 cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>{item}</span>
 </label>
 ))}
 </div>
 {/* เงินหัก Column */}
 <div className="flex flex-col divide-y divide-slate-100">
 {[
 "ภาษีหัก ณ ที่จ่าย", "เงินกู้ กยศ.", "หักลาไม่รับค่าจ้าง", 
 "หักมาสาย", "หักขาดงาน", "หักกลับก่อน", "เบิกเงินเดือน", "หักลืมลงเวลาออกงาน"
 ].map((item) => (
 <label key={item} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50/30 cursor-pointer">
 <input title="กรอกข้อมูล" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" />
 <span>{item}</span>
 </label>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30">
 <button onClick={() => setIsCreatingSupplementaryPeriod(false)}
 className="px-5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl shadow-sm transition-colors active:scale-95"
 >
 ยกเลิก
 </button>
 <button onClick={() => {
 setIsCreatingSupplementaryPeriod(false);
 setToast("สร้างงวดเสริมสำเร็จ");
 }}
 className="px-5 py-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white text-[13px] font-bold rounded-xl shadow-sm shadow-[#0EA5E9]/20 transition-colors active:scale-95"
 >
 สร้าง
 </button>
 </div>
 </div>
 </div>
 )}
 
 </div>
 );
}
