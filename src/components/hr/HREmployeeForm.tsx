"use client";

import { useState, useEffect, useRef } from "react";
import { thaiAddressData } from "@/data/thaiAddressData";
import ThaiAddressSelects from "../shared/ThaiAddressSelects";

interface HREmployeeFormProps {
  onBack: () => void;
}

interface Bank {
  name: string;
  color: string;
  icon: string;
}

const banks: Bank[] = [
  { name: "ซิตี้แบงก์", color: "#003b70", icon: "Citi" },
  { name: "ธนาคาร มิซูโฮ", color: "#002d62", icon: "Mizuho" },
  { name: "ธนาคารกรุงศรีอยุธยา", color: "#fec43b", icon: "BAY" },
  { name: "ธนาคารกรุงเทพ", color: "#1e4598", icon: "BBL" },
  { name: "ธนาคารกรุงไทย", color: "#00a1e0", icon: "KTB" },
  { name: "ธนาคารกสิกรไทย", color: "#138f2d", icon: "KBANK" },
  { name: "ธนาคารการค้าต่างประเทศลาว", color: "#e31e24", icon: "BCEL" },
  { name: "ธนาคารซีไอเอ็มบีไทย", color: "#7e1d1a", icon: "CIMB" },
  { name: "ธนาคารทหารไทย", color: "#005da4", icon: "TMB" },
  { name: "ธนาคารทหารไทยธนชาต", color: "#005da4", icon: "ttb" },
  { name: "ธนาคารทิสโก้", color: "#003399", icon: "Tisco" },
  { name: "ธนาคารธนชาต", color: "#f36f21", icon: "Thanachart" },
  { name: "ธนาคารพัฒนาลาว", color: "#00a1e0", icon: "LDB" },
  { name: "ธนาคารยูโอบี", color: "#003366", icon: "UOB" },
  { name: "ธนาคารออมสิน", color: "#ec008c", icon: "GSB" },
  { name: "ธนาคารอาคารสงเคราะห์", color: "#f36f21", icon: "GHB" },
  { name: "ธนาคารอิสลามแห่งประเทศไทย", color: "#006b3c", icon: "iBank" },
  { name: "ธนาคารฮ่องกงและเซี่ยงไฮ้แบงกิ้งคอร์ปอเรชั่น จำกัด", color: "#db0011", icon: "HSBC" },
  { name: "ธนาคารเกียรตินาคิน", color: "#2d3091", icon: "KKP" },
  { name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร", color: "#4eb44a", icon: "BAAC" },
  { name: "ธนาคารแลนด์ แอนด์ เฮ้าส์", color: "#612d11", icon: "LH" },
  { name: "ธนาคารไทยพาณิชย์", color: "#4e2e7f", icon: "SCB" },
  { name: "อิออน ธนสินทรัพย์", color: "#004098", icon: "AEON" },
];

const paymentTypes = ["รายวัน", "รายเดือน", "รายชั่วโมง"];

const steps = [
  { id: 1, label: "พนักงาน" },
  { id: 2, label: "ที่อยู่" },
  { id: 3, label: "การจ้างงาน" },
  { id: 4, label: "เงินเดือน" },
];

const BankIcon = ({ color, char, className }: { color?: string; char?: string; className?: string }) => {
  const iconRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (iconRef.current && color) {
      iconRef.current.style.setProperty('--bg', color);
    }
  }, [color]);

  return (
    <div 
      ref={iconRef}
      className={`${className} dynamic-bg`}
    >
      {char}
    </div>
  );
};

export default function HREmployeeForm({ onBack }: HREmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Employee
    prefix: "นาย",
    firstName: "",
    lastName: "",
    firstNameEn: "",
    lastNameEn: "",
    nickname: "",
    nicknameEn: "",
    birthday: "",
    gender: "ชาย",
    type: "คนไทย",
    idNumber: "",
    
    // Step 2: Address & Contact
    email: "",
    phone: "",
    lineId: "",
    lineName: "",
    idAddress: "",
    idProvince: "",
    idDistrict: "",
    idSubDistrict: "",
    idPostcode: "",
    sameAsIdAddress: false,
    currentAddress: "",
    currentProvince: "",
    currentDistrict: "",
    currentSubDistrict: "",
    currentPostcode: "",
    locationCoords: "",
    emergencyFirstName: "",
    emergencyLastName: "",
    emergencyPhone: "",
    emergencyRelationship: "",
    
    // Step 3: Employment
    employeeId: "2600002",
    department: "",
    position: "",
    supervisor: "",
    allowCrossDay: "ไม่อนุญาต",
    allowConcurrent: "ไม่อนุญาต",
    shift: "SHIFT1 : เวลาทำงาน 08:00 - 17:00",
    holidayCalendar: "วันหยุดประจำปี",
    employmentStatus: "ทดลองงาน",
    employmentType: "ประจำ",
    workingHours: "ตามตั้งค่าบริษัท",
    responsibilities: "",
    startDate: "",
    hrsoftStartDate: "06/05/2569",
    confirmationDate: "",
    contractEndDate: "",
    branches: ["สำนักงานใหญ่"],
    workplaces: ["pp", "WFH", "QR Code"],
    recordClockIn: "บันทึก",
    
    // Step 4: Salary
    paymentMethod: "ธนาคาร",
    bank: "",
    accountNumber: "",
    paymentType: "รายเดือน",
    salaryAmount: "",
    salaryPeriod: "งวดที่ 1",
  });



  useEffect(() => {
    if (formData.sameAsIdAddress) {
      setFormData(prev => ({
        ...prev,
        currentAddress: prev.idAddress,
        currentProvince: prev.idProvince,
        currentDistrict: prev.idDistrict,
        currentSubDistrict: prev.idSubDistrict,
        currentPostcode: prev.idPostcode
      }));
    }
  }, [formData.sameAsIdAddress, formData.idAddress, formData.idProvince, formData.idDistrict, formData.idSubDistrict, formData.idPostcode]);

  const [isFinished, setIsFinished] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showPaymentTypeDropdown, setShowPaymentTypeDropdown] = useState(false);


  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-[24px] font-black text-slate-800 mb-2">เพิ่มพนักงานสำเร็จ!</h2>
        <p className="text-slate-500 font-medium mb-10 text-center max-w-xs">ระบบได้บันทึกข้อมูลพนักงานใหม่เข้าสู่ฐานข้อมูลเรียบร้อยแล้ว</p>
        <button 
          onClick={onBack}
          className="px-10 py-3 bg-[#0095FF] text-white rounded-xl text-[15px] font-black hover:bg-[#0084E6] transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 relative">
      {/* Stepper at the very top */}
      <div className="py-8 bg-white border-b border-slate-50 flex justify-center sticky top-0 z-10">
        <div className="flex items-center justify-center max-w-4xl w-full px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                    currentStep === step.id 
                      ? "bg-[#0095FF] text-white shadow-lg shadow-blue-100 ring-4 ring-blue-50" 
                      : currentStep > step.id 
                        ? "bg-[#0095FF] text-white" 
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.id}
                </div>
                <span 
                  className={`absolute -bottom-7 whitespace-nowrap text-[12px] font-bold transition-colors duration-300 ${
                    currentStep >= step.id ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-[1.5px] mx-4 transition-colors duration-300 ${
                  currentStep > step.id ? "bg-[#0095FF]" : "bg-slate-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pt-10 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
             <button 
               onClick={onBack}
               title="ย้อนกลับ"
               className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
             </button>
             <h1 className="text-[26px] font-black text-slate-800 tracking-tight">เพิ่มพนักงาน</h1>
          </div>

          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-[#E6F4FF] flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                     <img 
                       src="https://i.ibb.co/L8p5n7M/bear-cup.png" 
                       alt="Profile Placeholder" 
                       className="w-24 h-24 object-contain opacity-80"
                     />
                  </div>
                  <button title="อัปโหลดรูปภาพ" className="absolute bottom-0 right-0 w-10 h-10 bg-[#0095FF] text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Prefix */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-slate-400 ml-1">คำนำหน้า</label>
                  <div className="relative max-w-[200px]">
                    <select 
                      title="คำนำหน้า"
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                      value={formData.prefix}
                      onChange={(e) => setFormData({...formData, prefix: e.target.value})}
                    >
                      <option>นาย</option>
                      <option>นาง</option>
                      <option>นางสาว</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="flex flex-col gap-1.5">
                  <input 
                    type="text" 
                    placeholder="ชื่อ *" 
                    title="ชื่อ"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <input 
                    type="text" 
                    placeholder="นามสกุล *" 
                    title="นามสกุล"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>

                {/* EN Names */}
                <div className="flex flex-col gap-1.5">
                  <input 
                    type="text" 
                    placeholder="ชื่อ (EN)" 
                    title="ชื่อ (ภาษาอังกฤษ)"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.firstNameEn}
                    onChange={(e) => setFormData({...formData, firstNameEn: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <input 
                    type="text" 
                    placeholder="นามสกุล (EN)" 
                    title="นามสกุล (ภาษาอังกฤษ)"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.lastNameEn}
                    onChange={(e) => setFormData({...formData, lastNameEn: e.target.value})}
                  />
                </div>

                {/* Nicknames */}
                <div className="flex flex-col gap-1.5">
                  <input 
                    type="text" 
                    placeholder="ชื่อเล่น" 
                    title="ชื่อเล่น"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <input 
                    type="text" 
                    placeholder="ชื่อเล่น (EN)" 
                    title="ชื่อเล่น (ภาษาอังกฤษ)"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.nicknameEn}
                    onChange={(e) => setFormData({...formData, nicknameEn: e.target.value})}
                  />
                </div>

                {/* Birthday & Gender */}
                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                  <input 
                    type="text" 
                    placeholder="วันเกิด" 
                    title="วันเกิด"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.birthday}
                    onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                       </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-bold text-slate-400 ml-1 uppercase">เพศ</label>
                  <div className="flex items-center gap-6">
                    {["ชาย", "หญิง", "อื่นๆ"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="gender" 
                            title={option}
                            className="peer sr-only" 
                            checked={formData.gender === option}
                            onChange={() => setFormData({...formData, gender: option})}
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-slate-200 peer-checked:border-[#0095FF] transition-all" />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0095FF] scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span className={`text-[14px] font-bold transition-colors ${formData.gender === option ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type & ID Number */}
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-bold text-slate-400 ml-1 uppercase">ประเภท</label>
                  <div className="flex items-center gap-6">
                    {["คนไทย", "ต่างชาติ"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="type" 
                            title={option}
                            className="peer sr-only" 
                            checked={formData.type === option}
                            onChange={() => setFormData({...formData, type: option})}
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-slate-200 peer-checked:border-[#0095FF] transition-all" />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0095FF] scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span className={`text-[14px] font-bold transition-colors ${formData.type === option ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5 mt-2">
                  <input 
                    type="text" 
                    placeholder="เลขบัตรประชาชน" 
                    title="เลขบัตรประชาชน"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-10">
              {/* ข้อมูลการติดต่อ */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">ข้อมูลการติดต่อ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <input 
                    type="text" 
                    placeholder="อีเมล" 
                    title="อีเมล"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="หมายเลขโทรศัพท์" 
                    title="หมายเลขโทรศัพท์"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="ไอดีไลน์" 
                    title="ไอดีไลน์"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.lineId}
                    onChange={(e) => setFormData({...formData, lineId: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="ชื่อไลน์" 
                    title="ชื่อไลน์"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.lineName}
                    onChange={(e) => setFormData({...formData, lineName: e.target.value})}
                  />
                </div>
              </section>

              {/* ที่อยู่ตามบัตรประชาชน */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">ที่อยู่ตามบัตรประชาชน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <input 
                    type="text" 
                    placeholder="ที่อยู่" 
                    title="ที่อยู่ตามบัตรประชาชน"
                    className="md:col-span-2 w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.idAddress}
                    onChange={(e) => setFormData({...formData, idAddress: e.target.value})}
                  />
                  <div className="md:col-span-2 space-y-5">
                    <ThaiAddressSelects
                      province={formData.idProvince}
                      district={formData.idDistrict}
                      subDistrict={formData.idSubDistrict}
                      zipCode={formData.idPostcode}
                      onProvinceChange={(v) => setFormData(prev => ({ ...prev, idProvince: v }))}
                      onDistrictChange={(v) => setFormData(prev => ({ ...prev, idDistrict: v }))}
                      onSubDistrictChange={(v) => setFormData(prev => ({ ...prev, idSubDistrict: v }))}
                      onZipCodeChange={(v) => setFormData(prev => ({ ...prev, idPostcode: v }))}
                      gridClassName="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
                      selectClassName="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                      inputClassName="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-400 outline-none cursor-not-allowed"
                      showLabels={false}
                    />
                  </div>
                </div>
              </section>

              {/* ที่อยู่ปัจจุบัน */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[16px] font-black text-slate-800">ที่อยู่ปัจจุบัน</h3>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        title="เหมือนกับที่อยู่ตามบัตรประชาชน"
                        className="peer sr-only" 
                        checked={formData.sameAsIdAddress}
                        onChange={(e) => setFormData({...formData, sameAsIdAddress: e.target.checked})}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-200 peer-checked:bg-[#0095FF] peer-checked:border-[#0095FF] transition-all" />
                      <svg className="absolute w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">เหมือนกับที่อยู่ตามบัตรประชาชน</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <input 
                    type="text" 
                    placeholder="ที่อยู่" 
                    title="ที่อยู่ปัจจุบัน"
                    className="md:col-span-2 w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({...formData, currentAddress: e.target.value})}
                  />
                  <div className="md:col-span-2 space-y-5">
                    <ThaiAddressSelects
                      province={formData.currentProvince}
                      district={formData.currentDistrict}
                      subDistrict={formData.currentSubDistrict}
                      zipCode={formData.currentPostcode}
                      onProvinceChange={(v) => setFormData(prev => ({ ...prev, currentProvince: v }))}
                      onDistrictChange={(v) => setFormData(prev => ({ ...prev, currentDistrict: v }))}
                      onSubDistrictChange={(v) => setFormData(prev => ({ ...prev, currentSubDistrict: v }))}
                      onZipCodeChange={(v) => setFormData(prev => ({ ...prev, currentPostcode: v }))}
                      gridClassName="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
                      selectClassName="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                      inputClassName="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-400 outline-none cursor-not-allowed"
                      showLabels={false}
                      disabled={formData.sameAsIdAddress}
                    />
                  </div>
                  <div className="md:col-span-2 relative">
                    <input 
                      type="text" 
                      placeholder="พิกัด สถานที่ของพนักงาน" 
                      title="พิกัด สถานที่ของพนักงาน"
                      className="w-full h-11 px-4 pr-12 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                      value={formData.locationCoords}
                      onChange={(e) => setFormData({...formData, locationCoords: e.target.value})}
                    />
                    <button title="ดูตำแหน่ง" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0095FF] p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </section>

              {/* ข้อมูลติดต่อกรณีฉุกเฉิน */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">ข้อมูลติดต่อกรณีฉุกเฉิน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <input 
                    type="text" 
                    placeholder="ชื่อ" 
                    title="ชื่อผู้ติดต่อกรณีฉุกเฉิน"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.emergencyFirstName}
                    onChange={(e) => setFormData({...formData, emergencyFirstName: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="นามสกุล" 
                    title="นามสกุลผู้ติดต่อกรณีฉุกเฉิน"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.emergencyLastName}
                    onChange={(e) => setFormData({...formData, emergencyLastName: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="หมายเลขโทรศัพท์" 
                    title="หมายเลขโทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  />
                  <div className="relative">
                    <select 
                      title="ความสัมพันธ์"
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all text-slate-400 font-normal"
                      value={formData.emergencyRelationship}
                      onChange={(e) => setFormData({...formData, emergencyRelationship: e.target.value})}
                    >
                      <option value="">ความสัมพันธ์</option>
                      <option>บิดา/มารดา</option>
                      <option>สามี/ภรรยา</option>
                      <option>บุตร</option>
                      <option>พี่น้อง</option>
                      <option>อื่นๆ</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-10">
              {/* ข้อมูลองค์กร */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">ข้อมูลองค์กร</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                   <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">รหัสพนักงาน</label>
                    <input 
                      type="text" 
                      placeholder="รหัสพนักงาน" 
                      title="รหัสพนักงาน"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold text-slate-400 outline-none cursor-not-allowed"
                      value={formData.employeeId}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">แผนก *</label>
                    <div className="relative">
                      <select 
                        title="แผนก"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      >
                        <option value=""></option>
                        <option>ฝ่ายบุคคล</option>
                        <option>ฝ่ายขาย</option>
                        <option>ฝ่ายผลิต</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">ตำแหน่ง *</label>
                    <div className="relative">
                      <select 
                        title="ตำแหน่ง"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                      >
                        <option value=""></option>
                        <option>Manager</option>
                        <option>Staff</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">หัวหน้างาน</label>
                    <div className="relative">
                      <select 
                        title="หัวหน้างาน"
                        className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.supervisor}
                        onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                      >
                        <option value=""></option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* การจ้างงาน */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">การจ้างงาน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-slate-400 ml-1 uppercase">อนุญาตให้ทำงานข้ามวัน</label>
                    <div className="flex items-center gap-6">
                      {["อนุญาต", "ไม่อนุญาต"].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="allowCrossDay" 
                              title={option}
                              className="peer sr-only" 
                              checked={formData.allowCrossDay === option}
                              onChange={() => setFormData({...formData, allowCrossDay: option})}
                            />
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 peer-checked:border-[#0095FF] transition-all" />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0095FF] scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className={`text-[14px] font-bold transition-colors ${formData.allowCrossDay === option ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-slate-400 ml-1 uppercase">อนุญาตให้ทำงานควบคณะ</label>
                    <div className="flex items-center gap-6">
                      {["อนุญาต", "ไม่อนุญาต"].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="allowConcurrent" 
                              title={option}
                              className="peer sr-only" 
                              checked={formData.allowConcurrent === option}
                              onChange={() => setFormData({...formData, allowConcurrent: option})}
                            />
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 peer-checked:border-[#0095FF] transition-all" />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0095FF] scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className={`text-[14px] font-bold transition-colors ${formData.allowConcurrent === option ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">กะการทำงาน *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0095FF] z-10" />
                      <select 
                        title="กะการทำงาน"
                        className="w-full h-11 pl-8 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.shift}
                        onChange={(e) => setFormData({...formData, shift: e.target.value})}
                      >
                        <option>SHIFT1 : เวลาทำงาน 08:00 - 17:00</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">ปฏิทินวันหยุด *</label>
                    <div className="relative">
                      <select 
                        title="ปฏิทินวันหยุด"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.holidayCalendar}
                        onChange={(e) => setFormData({...formData, holidayCalendar: e.target.value})}
                      >
                        <option>วันหยุดประจำปี</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">สถานะการจ้าง *</label>
                    <div className="relative">
                      <select 
                        title="สถานะการจ้าง"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.employmentStatus}
                        onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
                      >
                        <option>ทดลองงาน</option>
                        <option>บรรจุ</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">ประเภทการจ้าง *</label>
                    <div className="relative">
                      <select 
                        title="ประเภทการจ้าง"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.employmentType}
                        onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                      >
                        <option>ประจำ</option>
                        <option>ชั่วคราว</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">ชั่วโมงการทำงาน</label>
                    <div className="relative">
                      <select 
                        title="ชั่วโมงการทำงาน"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                        value={formData.workingHours}
                        onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                      >
                        <option>ตามตั้งค่าบริษัท</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* หน้าที่ความรับผิดชอบ */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">หน้าที่ความรับผิดชอบ</h3>
                <textarea 
                  placeholder="ตัวอย่างเช่น - วางแผนและจัดทำงบประมาณประจำปี" 
                  title="หน้าที่ความรับผิดชอบ"
                  className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal resize-none"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                />
              </section>

              {/* วันที่จ้างงาน */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">วันที่จ้างงาน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                   <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">วันที่เริ่มทำงาน *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="วันที่เริ่มทำงาน *" 
                        title="วันที่เริ่มทำงาน"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                         </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">วันที่เริ่มใช้ระบบ &apos;hrsoft&apos; *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="วันที่เริ่มใช้ระบบ 'hrsoft' *" 
                        title="วันที่เริ่มใช้ระบบ hrsoft"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                        value={formData.hrsoftStartDate}
                        onChange={(e) => setFormData({...formData, hrsoftStartDate: e.target.value})}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                         </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">วันที่บรรจุ *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="วันที่บรรจุ *" 
                        title="วันที่บรรจุ"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                        value={formData.confirmationDate}
                        onChange={(e) => setFormData({...formData, confirmationDate: e.target.value})}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                         </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 ml-1">วันที่หมดสัญญา</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="วันที่หมดสัญญา" 
                        title="วันที่หมดสัญญา"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                        value={formData.contractEndDate}
                        onChange={(e) => setFormData({...formData, contractEndDate: e.target.value})}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                         </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* สาขา */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">สาขา</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">สาขา</label>
                  <div className="relative">
                    <div className="w-full min-h-[44px] px-4 py-2 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center">
                      {formData.branches.map(branch => (
                        <div key={branch} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                          <span className="text-[13px] font-bold text-slate-600">{branch}</span>
                          <button title="ลบ" className="text-slate-300 hover:text-slate-500">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                          </button>
                        </div>
                      ))}
                      <div className="flex-1 min-w-[50px] relative">
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* สถานที่ทำงาน */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">สถานที่ทำงาน</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">สถานที่ทำงาน</label>
                  <div className="relative">
                    <div className="w-full min-h-[44px] px-4 py-2 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center">
                      {formData.workplaces.map(place => (
                        <div key={place} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                          <span className="text-[13px] font-bold text-slate-600">{place}</span>
                          <button title="ลบ" className="text-slate-300 hover:text-slate-500">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                          </button>
                        </div>
                      ))}
                      <div className="flex-1 min-w-[50px] relative">
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ให้บันทึกเวลาเข้างาน ในระบบ 'hrsoft' */}
              <section className="flex flex-col gap-4">
                <h3 className="text-[14px] font-bold text-slate-400">ให้บันทึกเวลาเข้างาน ในระบบ &apos;hrsoft&apos;</h3>
                <div className="flex items-center gap-6">
                  {["บันทึก", "ไม่บันทึก"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="recordClockIn" 
                          title={option}
                          className="peer sr-only" 
                          checked={formData.recordClockIn === option}
                          onChange={() => setFormData({...formData, recordClockIn: option})}
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 peer-checked:border-[#0095FF] transition-all" />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0095FF] scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <span className={`text-[14px] font-bold transition-colors ${formData.recordClockIn === option ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 pb-10">
              {/* รายละเอียดเงินเดือน */}
              <section>
                <h3 className="text-[16px] font-black text-slate-800 mb-6">รายละเอียดเงินเดือน</h3>
                <div className="space-y-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-slate-400 ml-1">วิธีการชำระเงิน</label>
                    <div className="flex items-center gap-6">
                      {["ธนาคาร", "เงินสด"].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              title={option}
                              className="peer sr-only" 
                              checked={formData.paymentMethod === option}
                              onChange={() => setFormData({...formData, paymentMethod: option})}
                            />
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 peer-checked:border-[#0095FF] transition-all" />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0095FF] scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className={`text-[14px] font-bold transition-colors ${formData.paymentMethod === option ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    {formData.paymentMethod === "ธนาคาร" && (
                      <>
                        {/* ธนาคาร Custom Dropdown */}
                        <div className="flex flex-col gap-1.5 relative">
                          <div 
                            onClick={() => setShowBankDropdown(!showBankDropdown)}
                            className={`w-full h-11 px-4 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all relative ${showBankDropdown ? "border-[#0095FF] ring-4 ring-[#0095FF]/5" : "border-slate-200 hover:border-[#0095FF]"}`}
                          >
                            <label className="absolute -top-2.5 left-3 bg-white px-2 text-[11px] font-bold text-[#0095FF] z-10">
                              ธนาคาร *
                            </label>
                            
                            <div className="flex items-center gap-3">
                              {formData.bank ? (
                                <>
                                  <BankIcon 
                                    color={banks.find(b => b.name === formData.bank)?.color}
                                    char={banks.find(b => b.name === formData.bank)?.icon[0]}
                                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-white font-bold"
                                  />
                                  <span className="text-[14px] font-bold text-slate-700">{formData.bank}</span>
                                </>
                              ) : (
                                <span className="text-[14px] text-slate-400"></span>
                              )}
                            </div>
                            <div className="text-slate-400">
                              <svg className={`w-4 h-4 transition-transform duration-300 ${showBankDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          {showBankDropdown && (
                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                                {banks.map((bank) => (
                                  <div 
                                    key={bank.name}
                                    onClick={() => {
                                      setFormData({...formData, bank: bank.name});
                                      setShowBankDropdown(false);
                                    }}
                                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                                  >
                                    <BankIcon color={bank.color} char={bank.icon[0]} className="w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-bold shrink-0 shadow-sm" />
                                    <span className="text-[14px] font-bold text-slate-700 group-hover:text-[#0095FF] transition-colors">{bank.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <input 
                          type="text" 
                          placeholder="เลขที่บัญชี *" 
                          title="เลขที่บัญชี"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                        />
                      </>
                    )}
                    
                    {/* ประเภทการจ่ายเงิน Custom Dropdown */}
                    <div className="flex flex-col gap-1.5 relative">
                      <div 
                        onClick={() => setShowPaymentTypeDropdown(!showPaymentTypeDropdown)}
                        className={`w-full h-11 px-4 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all relative ${showPaymentTypeDropdown ? "border-[#0095FF] ring-4 ring-[#0095FF]/5" : "border-slate-200 hover:border-[#0095FF]"}`}
                      >
                        <label className="absolute -top-2.5 left-3 bg-white px-2 text-[11px] font-bold text-[#0095FF] z-10">
                          ประเภทการจ่ายเงิน *
                        </label>
                        
                        <span className={`text-[14px] font-bold ${formData.paymentType ? "text-slate-700" : "text-slate-400"}`}>
                          {formData.paymentType || ""}
                        </span>
                        
                        <div className="text-slate-400">
                          <svg className={`w-4 h-4 transition-transform duration-300 ${showPaymentTypeDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {showPaymentTypeDropdown && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="p-2">
                            {paymentTypes.map((type) => (
                              <div 
                                key={type}
                                onClick={() => {
                                  setFormData({...formData, paymentType: type});
                                  setShowPaymentTypeDropdown(false);
                                }}
                                className="px-4 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer text-[14px] font-bold text-slate-700 hover:text-[#0095FF] transition-all"
                              >
                                {type}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <input 
                      type="text" 
                      placeholder="จำนวนเงินเดือน *" 
                      title="จำนวนเงินเดือน"
                      className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 transition-all placeholder:text-slate-300 placeholder:font-normal"
                      value={formData.salaryAmount}
                      onChange={(e) => setFormData({...formData, salaryAmount: e.target.value})}
                    />
                    <div className="flex flex-col gap-1.5">
                      <div className="relative">
                        <select 
                          title="งวดเงินเดือน"
                          className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-[#0095FF] focus:ring-4 focus:ring-[#0095FF]/5 appearance-none transition-all"
                          value={formData.salaryPeriod}
                          onChange={(e) => setFormData({...formData, salaryPeriod: e.target.value})}
                        >
                          <option value="">เลือกงวดเงินเดือน</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex items-center justify-between">
        <button 
          onClick={currentStep === 1 ? onBack : handlePrev}
          className="px-6 py-2 border border-slate-200 text-slate-400 hover:text-[#0095FF] hover:border-[#0095FF] rounded-xl text-[14px] font-bold transition-all active:scale-95"
        >
          {currentStep === 1 ? "ยกเลิก" : "ย้อนกลับ"}
        </button>
        
        <button 
          onClick={handleNext}
          className={`px-10 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-lg active:scale-95 ${
            currentStep === 4 
              ? "bg-[#0095FF] text-white hover:bg-[#0084E6] shadow-blue-100" 
              : "bg-[#0095FF] text-white hover:bg-[#0084E6] shadow-blue-100"
          }`}
        >
          {currentStep === 4 ? "สำเร็จ" : "ต่อไป"}
        </button>
      </div>
    </div>
  );
}
