"use client";

import { useState, useEffect } from "react";
import ThaiAddressSelects from "../shared/ThaiAddressSelects";
import { thaiAddressData } from "@/data/thaiAddressData";

export default function HRSettings() {
  const [activeTab, setActiveTab] = useState("บริษัท");
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
  const [activeTopTab, setActiveTopTab] = useState("ข้อมูลบริษัท");
  const [activeSubTabInCompany, setActiveSubTabInCompany] = useState("ข้อมูลทั่วไป");
  const [showShiftDropdown, setShowShiftDropdown] = useState(false);
  const [shiftModal, setShiftModal] = useState<"add_shift" | "add_holiday_shift" | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [calendarModal, setCalendarModal] = useState<"add_holiday" | "add_calendar" | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [isAddingRequestType, setIsAddingRequestType] = useState(false);
  const [addRequestTypeTab, setAddRequestTypeTab] = useState("ประเภทคำขอ");
  const [locationsTab, setLocationsTab] = useState("ตั้งค่าสถานที่ทำงาน");
  const [locationModal, setLocationModal] = useState(false);
  const [showDeviceCommandDropdown, setShowDeviceCommandDropdown] = useState(false);
  const [selectedDeviceCommand, setSelectedDeviceCommand] = useState("คำสั่งทั้งหมด");
  const [showDeviceStatusDropdown, setShowDeviceStatusDropdown] = useState(false);
  const [selectedDeviceStatus, setSelectedDeviceStatus] = useState("ทุกสถานะ");

  const [locTimeTypeDropdown, setLocTimeTypeDropdown] = useState(false);
  const [selectedLocTimeType, setSelectedLocTimeType] = useState("GPS");
  const [locPlaceTypeDropdown, setLocPlaceTypeDropdown] = useState(false);
  const [selectedLocPlaceType, setSelectedLocPlaceType] = useState("นอกสถานที่");
  const [locConditionDropdown, setLocConditionDropdown] = useState(false);
  const [selectedLocCondition, setSelectedLocCondition] = useState("ไม่มีเงื่อนไข");
  
  const [roleModal, setRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleDescEn, setNewRoleDescEn] = useState("");
  const [roleActive, setRoleActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [logo, setLogo] = useState<string | null>(null);
  
  const addBankAccount = () => {
    const newId = bankAccounts.length > 0 ? Math.max(...bankAccounts.map(b => b.id)) + 1 : 1;
    setBankAccounts([...bankAccounts, { id: newId, bank: "ธนาคารกสิกรไทย", accountNumber: "" }]);
  };

  const removeBankAccount = (id: number) => {
    setBankAccounts(bankAccounts.filter(b => b.id !== id));
  };

  const updateBankAccount = (id: number, field: string, value: string) => {
    setBankAccounts(bankAccounts.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      if (data.bank_accounts) {
        setBankAccounts(data.bank_accounts);
      }
      if (data.company_logo) {
        setLogo(data.company_logo);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    const payload = { ...settings, bank_accounts: bankAccounts, company_logo: logo };
    await handleSave(payload);
  };

  const handleSave = async (newSettings: Record<string, any>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, ...newSettings }));
        alert("บันทึกการตั้งค่าเรียบร้อยแล้ว");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  // Reset subpage when changing tabs
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveSubPage(null);
    setActiveTopTab("ข้อมูลบริษัท");
    setActiveSubTabInCompany("ข้อมูลทั่วไป");
  };

  const sidebarTabs = [
    {
      id: "บริษัท",
      label: "บริษัท",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      flag: "4/7",
    },
    {
      id: "การลงเวลาทำงาน",
      label: "การลงเวลาทำงาน",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      flag: "1/3",
    },
    {
      id: "บทบาทสิทธิ์ผู้ใช้",
      label: "บทบาทสิทธิ์ผู้ใช้",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: "จัดการข้อมูล",
      label: "จัดการข้อมูล",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
  ];

  const companySettings = [
    {
      id: "company",
      title: "บริษัท",
      subtitle: "ระบุข้อมูลบริษัท เงื่อนไขการทำงาน และเงื่อนไขการทำโอที",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "org_struct",
      title: "องค์กร",
      subtitle: "ตั้งค่าโครงสร้างองค์กร และระดับองค์กร",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      flagged: true,
    },
    {
      id: "position_level",
      title: "ระดับตำแหน่ง",
      subtitle: "ตั้งค่าระดับตำแหน่ง และกำหนดลำดับ",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      flagged: true,
    },
    {
      id: "position",
      title: "ตำแหน่ง",
      subtitle: "ตั้งค่าตำแหน่ง และกำหนดตำแหน่ง",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      flagged: true,
    },
    {
      id: "workflow",
      title: "เวิร์กโฟลว์",
      subtitle: "ตั้งค่าเวิร์กโฟลว์สำหรับการอนุมัติเอกสารพนักงาน",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "emp_id",
      title: "รหัสพนักงาน และ เลขที่เอกสาร",
      subtitle: "ตั้งค่ารหัสพนักงานเลขที่เอกสาร",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "notifications",
      title: "แจ้งเตือน",
      subtitle: "ตั้งค่าการแจ้งเตือนผ่าน Discord หรือ Telegram หรือ LINE Official หรือ Webhook",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "app_notifications",
      title: "แจ้งเตือนแอปพลิเคชัน",
      subtitle: "ตั้งค่าการแจ้งเตือนหน้าบ้าน ผ่านแอปพลิเคชัน hrzoft",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "currency",
      title: "สกุลเงิน",
      subtitle: "ตั้งค่าสกุลเงินที่ต้องการใช้ในระบบ",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      flagged: false,
    },
  ];

  const attendanceSettings = [
    {
      id: "shifts",
      title: "กะการทำงาน",
      subtitle: "ตั้งค่ากะการทำงาน",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "calendar",
      title: "ปฏิทิน",
      subtitle: "ตั้งค่าปฏิทินวันหยุด",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      flagged: true,
    },
    {
      id: "request_types",
      title: "ประเภทคำขอ",
      subtitle: "ตั้งค่าประเภทคำขอ",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      flagged: true,
    },
    {
      id: "locations",
      title: "สถานที่ทำงาน และอุปกรณ์เข้างาน",
      subtitle: "ตั้งค่าสถานที่ทำงานสำหรับลงเวลาเข้างาน",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      flagged: false,
    },
  ];

  const roleSettings = [
    {
      id: "roles",
      title: "บทบาท",
      subtitle: "ตั้งค่าบทบาท จัดกลุ่มผู้ใช้งาน",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "login_users",
      title: "ผู้ใช้ สำหรับล็อกอิน",
      subtitle: "ตั้งค่าข้อมูลและบทบาทผู้ใช้ สำหรับล็อกอินเข้าใช้งานระบบ",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "permissions",
      title: "กำหนดสิทธิ์การใช้งาน",
      subtitle: "ตั้งค่ากำหนดสิทธิ์การใช้งาน",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      flagged: false,
    },
  ];

  const dataSettings = [
    {
      id: "import_attendance",
      title: "นำเข้าเวลาเข้างาน",
      subtitle: "นำเข้าข้อมูล การลงเวลาเข้า-ออกงาน ผ่านไฟล์ Excel",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "import_summary",
      title: "สรุปการเข้างาน",
      subtitle: "จัดการข้อมูล สรุปการเข้างาน และนำเข้าข้อมูลผ่านไฟล์ Excel",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "import_leave",
      title: "วันลาที่ใช้ไปแล้ว",
      subtitle: "นำเข้าข้อมูล วันลาที่ใช้ไปแล้ว ผ่านไฟล์ Excel",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "import_quota",
      title: "โควต้าวันลาสะสม",
      subtitle: "นำเข้าข้อมูล โควต้าวันลาที่สะสมมาจากปีก่อน ผ่านไฟล์ Excel",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "emp_docs",
      title: "เอกสารพนักงาน",
      subtitle: "ตั้งค่าเอกสารพนักงาน",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "del_payroll",
      title: "ลบข้อมูลเงินเดือน",
      subtitle: "ลบข้อมูลงวดเงินเดือน รวมถึงข้อมูลการทำเงินเดือนทั้งหมดออกจากระบบ",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "del_requests",
      title: "ลบข้อมูลคำขอ",
      subtitle: "ลบข้อมูลคำขอ",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      flagged: false,
    },
    {
      id: "reset_data",
      title: "รีเซ็ตข้อมูลบริษัท",
      subtitle: "รีเซ็ตข้อมูลทั้งหมดของบริษัท ยกเว้นข้อมูลพนักงาน",
      icon: (
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      flagged: false,
    },
  ];

  const getActiveSettingsList = () => {
    switch (activeTab) {
      case "บริษัท": return companySettings;
      case "การลงเวลาทำงาน": return attendanceSettings;
      case "บทบาทสิทธิ์ผู้ใช้": return roleSettings;
      case "จัดการข้อมูล": return dataSettings;
      default: return [];
    }
  };

  const activeList = getActiveSettingsList();

  return (
    <div className="flex-1 flex bg-white h-full overflow-hidden font-sans">
      {/* Left Sidebar (Settings Navigation) */}
      <div className="w-[180px] sm:w-[220px] flex-shrink-0 flex flex-col items-center py-8 px-4 gap-4 overflow-y-auto custom-scrollbar border-r border-slate-100">
        {sidebarTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              title={tab.label}
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-full max-w-[140px] py-6 px-4 rounded-[20px] transition-all duration-300 ${
                isActive
                  ? "bg-[#F8FAFC] text-[#1E3A8A] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.flag && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[#F97316] text-[10px] font-black bg-white/60 px-1.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                  <span className="text-[12px]">🚩</span>
                  {tab.flag}
                </div>
              )}
              <div className={`mb-3 ${isActive ? "text-[#1E3A8A]" : "text-slate-400"}`}>
                {tab.icon}
              </div>
              <span className={`text-[13px] font-bold text-center tracking-wide ${isActive ? "text-[#1E3A8A]" : "text-slate-500"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
        {activeSubPage === "company" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header / Breadcrumb */}
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">บริษัท</span>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              {/* Top Tabs */}
              <div className="px-8 flex items-center gap-8 border-b border-slate-100 bg-white sticky top-0 z-10">
                <button 
                  title="ข้อมูลบริษัท" 
                  onClick={() => setActiveTopTab("ข้อมูลบริษัท")}
                  className={`py-4 border-b-2 font-bold text-[14px] transition-all ${activeTopTab === "ข้อมูลบริษัท" ? "border-sky-500 text-sky-500" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  ข้อมูลบริษัท
                </button>
                <button 
                  title="เงื่อนไขการทำงาน" 
                  onClick={() => setActiveTopTab("เงื่อนไขการทำงาน")}
                  className={`py-4 border-b-2 font-bold text-[14px] transition-all ${activeTopTab === "เงื่อนไขการทำงาน" ? "border-sky-500 text-sky-500" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  เงื่อนไขการทำงาน
                </button>
                <button 
                  title="การทำโอที" 
                  onClick={() => setActiveTopTab("การทำโอที")}
                  className={`py-4 border-b-2 font-bold text-[14px] transition-all ${activeTopTab === "การทำโอที" ? "border-sky-500 text-sky-500" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  การทำโอที
                </button>
              </div>

              {/* Sub Tabs (Only for Company Info) */}
              {activeTopTab === "ข้อมูลบริษัท" && (
                <div className="px-8 py-4 flex items-center gap-3 bg-white">
                  <button 
                    title="ข้อมูลทั่วไป" 
                    onClick={() => setActiveSubTabInCompany("ข้อมูลทั่วไป")}
                    className={`px-5 py-1.5 rounded-lg border font-bold text-[13.5px] transition-all ${activeSubTabInCompany === "ข้อมูลทั่วไป" ? "border-sky-500 text-sky-500 bg-sky-50/30" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                  >
                    ข้อมูลทั่วไป
                  </button>
                  <button 
                    title="สาขา" 
                    onClick={() => setActiveSubTabInCompany("สาขา")}
                    className={`px-5 py-1.5 rounded-lg border font-bold text-[13.5px] transition-all ${activeSubTabInCompany === "สาขา" ? "border-sky-500 text-sky-500 bg-sky-50/30" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                  >
                    สาขา
                  </button>
                  <button 
                    title="บริษัทในเครือ" 
                    onClick={() => setActiveSubTabInCompany("บริษัทในเครือ")}
                    className={`px-5 py-1.5 rounded-lg border font-bold text-[13.5px] transition-all ${activeSubTabInCompany === "บริษัทในเครือ" ? "border-sky-500 text-sky-500 bg-sky-50/30" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                  >
                    บริษัทในเครือ
                  </button>
                </div>
              )}

              {/* Form Content */}
              <div className="p-8 max-w-3xl mx-auto w-full flex flex-col gap-10 pb-20">
                
                {activeTopTab === "ข้อมูลบริษัท" && (
                  <>
                    {activeSubTabInCompany === "ข้อมูลทั่วไป" && (
                      <div className="flex flex-col gap-10">
                        {/* Logo Upload */}
                        <div className="flex justify-center mb-2">
                          <div 
                            className="relative cursor-pointer group"
                            onClick={() => document.getElementById("logo-upload")?.click()}
                          >
                            <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm group-hover:ring-4 ring-sky-50 transition-all">
                              {logo ? (
                                <img src={logo} alt="Company Logo" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[40px]">🐻‍❄️</span>
                              )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-7 h-7 bg-sky-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <input 
                              id="logo-upload"
                              title="upload logo"
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setLogo(reader.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Section 1: ข้อมูลบริษัท */}
                        <div className="flex flex-col gap-5">
                          <h3 className="text-[18px] font-bold text-slate-800">ข้อมูลบริษัท</h3>
                          
                          <div className="grid grid-cols-2 gap-5">
                            <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                              <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ชื่อบริษัท</span>
                              <input 
                                title="ชื่อบริษัท" 
                                type="text" 
                                value={settings.company_name_th || ""} 
                                onChange={(e) => setSettings({...settings, company_name_th: e.target.value})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                            </div>
                            <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                              <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ชื่อบริษัท (EN)</span>
                              <input 
                                title="ชื่อบริษัท (EN)" 
                                type="text" 
                                value={settings.company_name_en || ""} 
                                onChange={(e) => setSettings({...settings, company_name_en: e.target.value})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                            </div>
                          </div>

                          <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                            <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">เลขประจำตัวผู้เสียภาษี</span>
                            <input 
                              title="เลขประจำตัวผู้เสียภาษี" 
                              type="text" 
                              value={settings.tax_id || ""} 
                              onChange={(e) => setSettings({...settings, tax_id: e.target.value})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                          </div>
                        </div>

                        {/* Section 2: ข้อมูลที่อยู่ */}
                        <div className="flex flex-col gap-5">
                          <h3 className="text-[18px] font-bold text-slate-800">ข้อมูลที่อยู่</h3>
                          
                          <div className="grid grid-cols-2 gap-5">
                            <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                              <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ที่อยู่</span>
                              <input 
                                title="ที่อยู่" 
                                type="text" 
                                value={settings.address || ""} 
                                onChange={(e) => setSettings({...settings, address: e.target.value})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                            </div>
                            <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                              <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ที่อยู่ (EN)</span>
                              <input 
                                title="ที่อยู่ (EN)" 
                                type="text" 
                                value={settings.address_en || ""} 
                                onChange={(e) => setSettings({...settings, address_en: e.target.value})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-4">
                            <ThaiAddressSelects 
                              province={settings.province || ""}
                              district={settings.district || ""}
                              subDistrict={settings.sub_district || ""}
                              zipCode={settings.zip_code || ""}
                              onProvinceChange={(v) => setSettings(prev => ({...prev, province: v}))}
                              onDistrictChange={(v) => setSettings(prev => ({...prev, district: v}))}
                              onSubDistrictChange={(v) => setSettings(prev => ({...prev, sub_district: v}))}
                              onZipCodeChange={(v) => setSettings(prev => ({...prev, zip_code: v}))}
                              gridClassName="grid grid-cols-2 gap-5"
                              fieldClassName="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-50 transition-all"
                              labelClassName="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium z-10"
                              selectClassName="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none cursor-pointer pr-8 appearance-none py-1.5"
                              inputClassName="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5"
                            />
                          </div>
                        </div>

                        {/* Section 3: ข้อมูลบัญชี */}
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[18px] font-bold text-slate-800">ข้อมูลบัญชี</h3>
                            <button 
                              onClick={addBankAccount}
                              title="เพิ่มบัญชี" 
                              className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 rounded-xl text-[13px] font-bold transition-colors shadow-sm"
                            >
                              <span className="text-[16px] leading-none">+</span> เพิ่มบัญชี
                            </button>
                          </div>
                          
                          {bankAccounts.map((account) => (
                            <div key={account.id} className="border border-dashed border-slate-300 rounded-2xl p-4 flex items-center gap-4 bg-white animate-in fade-in slide-in-from-top-1 duration-300">
                              <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col flex-1 focus-within:border-sky-500 transition-colors">
                                <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">บัญชีธนาคาร</span>
                                <div className="flex items-center gap-2 py-1.5">
                                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">
                                    {account.bank[account.bank.startsWith("ธนาคาร") ? 6 : 0]}
                                  </div>
                                  <select 
                                    title="บัญชีธนาคาร" 
                                    value={account.bank}
                                    onChange={(e) => updateBankAccount(account.id, "bank", e.target.value)}
                                    className="flex-1 bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none cursor-pointer appearance-none"
                                  >
                                    <option>ธนาคารกสิกรไทย</option>
                                    <option>ธนาคารไทยพาณิชย์</option>
                                    <option>ธนาคารกรุงเทพ</option>
                                    <option>ธนาคารกรุงไทย</option>
                                    <option>ธนาคารทหารไทยธนชาต</option>
                                  </select>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                              
                              <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col flex-1 focus-within:border-sky-500 transition-colors">
                                <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">เลขที่บัญชี</span>
                                <input 
                                  title="เลขที่บัญชี" 
                                  type="text" 
                                  value={account.accountNumber}
                                  onChange={(e) => updateBankAccount(account.id, "accountNumber", e.target.value)}
                                  className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                                />
                              </div>

                              <button 
                                onClick={() => removeBankAccount(account.id)}
                                title="ลบ" 
                                className="flex items-center gap-1.5 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-[13.5px] font-bold transition-colors flex-shrink-0"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                ลบ
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Section 4: ข้อมูลการติดต่อ */}
                        <div className="flex flex-col gap-5">
                          <h3 className="text-[18px] font-bold text-slate-800">ข้อมูลการติดต่อ</h3>
                          
                          <div className="grid grid-cols-2 gap-5">
                            <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                              <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">หมายเลขโทรศัพท์</span>
                              <input 
                                title="หมายเลขโทรศัพท์" 
                                type="text" 
                                value={settings.phone || ""} 
                                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                            </div>
                            <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                              <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">แฟกซ์</span>
                              <input 
                                title="แฟกซ์" 
                                type="text" 
                                value={settings.fax || ""} 
                                onChange={(e) => setSettings({...settings, fax: e.target.value})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSubTabInCompany === "สาขา" && (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[18px] font-bold text-slate-800">รายชื่อสาขา</h3>
                          <button title="เพิ่มสาขา" className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-xl text-[14px] font-bold transition-colors shadow-sm">
                            <span className="text-[18px] leading-none">+</span> เพิ่มสาขา
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {[
                            { name: "สำนักงานใหญ่", code: "HQ", address: "กรุงเทพมหานคร" },
                            { name: "สาขาชลบุรี", code: "BR01", address: "ชลบุรี" },
                          ].map((branch) => (
                            <div key={branch.code} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/30 flex items-center justify-between group hover:border-sky-100 hover:bg-sky-50/20 transition-all cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:border-sky-100 transition-all">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div>
                                  <h4 className="text-[15px] font-bold text-slate-800">{branch.name} ({branch.code})</h4>
                                  <p className="text-[13px] text-slate-400">{branch.address}</p>
                                </div>
                              </div>
                              <svg className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSubTabInCompany === "บริษัทในเครือ" && (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[18px] font-bold text-slate-800">รายชื่อบริษัทในเครือ</h3>
                          <button title="เพิ่มบริษัท" className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-xl text-[14px] font-bold transition-colors shadow-sm">
                            <span className="text-[18px] leading-none">+</span> เพิ่มบริษัท
                          </button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          </div>
                          <p className="text-[14px] font-bold text-slate-400">ยังไม่มีข้อมูลบริษัทในเครือ</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTopTab === "เงื่อนไขการทำงาน" && (
                  <div className="flex flex-col gap-10">
                    {/* Section 1: เงื่อนไขการทำงาน */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-[20px] font-bold text-[#1e293b]">เงื่อนไขการทำงาน</h3>
                      
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        {/* ชั่วโมงการทำงาน */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ชั่วโมงการทำงาน</span>
                          <div className="flex items-center">
                            <input 
                              title="ชั่วโมงการทำงาน" 
                              type="number" 
                              value={settings.work_hours_per_month || 8} 
                              onChange={(e) => setSettings({...settings, work_hours_per_month: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">ชั่วโมง</span>
                          </div>
                        </div>

                        {/* ชั่วโมงการทำงานรายวัน */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ชั่วโมงการทำงานรายวัน</span>
                          <div className="flex items-center">
                            <input 
                              title="ชั่วโมงการทำงานรายวัน" 
                              type="number" 
                              value={settings.work_hours_per_day || 8} 
                              onChange={(e) => setSettings({...settings, work_hours_per_day: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">ชั่วโมง</span>
                          </div>
                        </div>

                        {/* วันตัดรอบปีปฏิทิน */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">วันตัดรอบปีปฏิทิน *</span>
                          <div className="flex items-center justify-between">
                            <input 
                              title="วันตัดรอบปีปฏิทิน" 
                              type="text" 
                              value={settings.calendar_cutoff || "31 ธันวาคม"} 
                              onChange={(e) => setSettings({...settings, calendar_cutoff: e.target.value})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>

                        {/* นาทีที่จะเริ่มแสดงสถานะเป็น สาย */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                            <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">นาทีที่จะเริ่มแสดงสถานะเป็น สาย</span>
                            <div className="flex items-center">
                              <input 
                                title="นาทีที่สาย" 
                                type="number" 
                                value={settings.late_display_minutes || 5} 
                                onChange={(e) => setSettings({...settings, late_display_minutes: parseInt(e.target.value) || 0})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                              <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap mx-2">นาที</span>
                              <button title="Clear" onClick={() => setSettings({...settings, late_display_minutes: 0})} className="text-slate-300 hover:text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 min-w-[160px]">
                            <input 
                              title="ยกเว้นนาทีที่ใช้นับเป็น สาย"
                              type="checkbox" 
                              checked={settings.exclude_late_counting || false}
                              onChange={(e) => setSettings({...settings, exclude_late_counting: e.target.checked})}
                              className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                            />
                            <span className="text-[13px] font-bold text-slate-600">ยกเว้นนาทีที่ใช้นับเป็น สาย</span>
                          </div>
                        </div>

                        {/* นาทีที่จะเริ่มนับเป็น สายเกิน */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">นาทีที่จะเริ่มนับเป็น สายเกิน</span>
                          <div className="flex items-center">
                            <input 
                              title="นาทีที่สายเกิน" 
                              type="number" 
                              value={settings.exceed_late_minutes || 15} 
                              onChange={(e) => setSettings({...settings, exceed_late_minutes: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap mx-2">นาที</span>
                            <button title="Clear" onClick={() => setSettings({...settings, exceed_late_minutes: 0})} className="text-slate-300 hover:text-slate-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>

                        {/* นาทีที่จะเริ่มนับเป็น ขาดงาน */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">นาทีที่จะเริ่มนับเป็น ขาดงาน</span>
                          <div className="flex items-center">
                            <input 
                              title="นาทีที่ขาดงาน" 
                              type="number" 
                              value={settings.absent_minutes || 30} 
                              onChange={(e) => setSettings({...settings, absent_minutes: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap mx-2">นาที</span>
                            <button title="Clear" onClick={() => setSettings({...settings, absent_minutes: 0})} className="text-slate-300 hover:text-slate-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>

                        {/* อนุญาตให้ลงเวลาผ่าน Mobile App เท่านั้น */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">อนุญาตให้ลงเวลาผ่าน Mobile App เท่านั้น</span>
                          <select 
                            title="Mobile App เท่านั้น"
                            value={settings.mobile_app_only || "ปิดใช้งาน"}
                            onChange={(e) => setSettings({...settings, mobile_app_only: e.target.value})}
                            className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5 appearance-none cursor-pointer"
                          >
                            <option value="ปิดใช้งาน">ปิดใช้งาน</option>
                            <option value="เปิดใช้งาน">เปิดใช้งาน</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>

                        {/* การยืนยันตัวตน (Mobile App) */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">การยืนยันตัวตน (Mobile App)</span>
                          <select 
                            title="การยืนยันตัวตน"
                            value={settings.identity_verification || "ไม่ต้องยืนยัน"}
                            onChange={(e) => setSettings({...settings, identity_verification: e.target.value})}
                            className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5 appearance-none cursor-pointer"
                          >
                            <option value="ไม่ต้องยืนยัน">ไม่ต้องยืนยัน</option>
                            <option value="ใบหน้า">ใบหน้า</option>
                            <option value="ลายนิ้วมือ">ลายนิ้วมือ</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>

                        {/* OT วันหยุด แสดงสถานะลงเวลา */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">OT วันหยุด แสดงสถานะลงเวลา</span>
                          <select 
                            title="OT วันหยุด"
                            value={settings.holiday_ot_status || "ไม่แสดง"}
                            onChange={(e) => setSettings({...settings, holiday_ot_status: e.target.value})}
                            className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5 appearance-none cursor-pointer"
                          >
                            <option value="ไม่แสดง">ไม่แสดง</option>
                            <option value="แสดง">แสดง</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: ทดลองงาน */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-[20px] font-bold text-[#1e293b]">ทดลองงาน</h3>
                      <div className="grid grid-cols-2 gap-x-6">
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">จำนวนวัน</span>
                          <div className="flex items-center">
                            <input 
                              title="จำนวนวันทดลองงาน" 
                              type="number" 
                              value={settings.probation_days || 90} 
                              onChange={(e) => setSettings({...settings, probation_days: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">วัน</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: เกษียณอายุ */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-[20px] font-bold text-[#1e293b]">เกษียณอายุ</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">อายุเกษียณพนักงานชาย</span>
                          <div className="flex items-center">
                            <input 
                              title="อายุเกษียณพนักงานชาย" 
                              type="number" 
                              value={settings.retirement_age_male || 55} 
                              onChange={(e) => setSettings({...settings, retirement_age_male: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">ปี</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">อายุเกษียณพนักงานหญิง</span>
                          <div className="flex items-center">
                            <input 
                              title="อายุเกษียณพนักงานหญิง" 
                              type="number" 
                              value={settings.retirement_age_female || 55} 
                              onChange={(e) => setSettings({...settings, retirement_age_female: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">ปี</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">อายุเกษียณประกันสังคม</span>
                          <div className="flex items-center">
                            <input 
                              title="อายุเกษียณประกันสังคม" 
                              type="number" 
                              value={settings.retirement_age_social_security || 60} 
                              onChange={(e) => setSettings({...settings, retirement_age_social_security: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">ปี</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: เงื่อนไขการนับคะแนน */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-[20px] font-bold text-[#1e293b]">เงื่อนไขการนับคะแนน</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">คะแนนสาย</span>
                          <div className="flex items-center">
                            <input 
                              title="คะแนนสาย" 
                              type="number" 
                              step="0.01"
                              value={settings.score_late || -0.25} 
                              onChange={(e) => setSettings({...settings, score_late: parseFloat(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">คะแนน</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">คะแนนสายเกิน</span>
                          <div className="flex items-center">
                            <input 
                              title="คะแนนสายเกิน" 
                              type="number" 
                              step="0.01"
                              value={settings.score_exceed_late || -0.5} 
                              onChange={(e) => setSettings({...settings, score_exceed_late: parseFloat(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">คะแนน</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">คะแนนขาดงาน</span>
                          <div className="flex items-center">
                            <input 
                              title="คะแนนขาดงาน" 
                              type="number" 
                              step="0.01"
                              value={settings.score_absent || -1} 
                              onChange={(e) => setSettings({...settings, score_absent: parseFloat(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">คะแนน</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">คะแนนกลับก่อน</span>
                          <div className="flex items-center">
                            <input 
                              title="คะแนนกลับก่อน" 
                              type="number" 
                              step="0.01"
                              value={settings.score_early_leave || -0.25} 
                              onChange={(e) => setSettings({...settings, score_early_leave: parseFloat(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">คะแนน</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTopTab === "การทำโอที" && (
                  <div className="flex flex-col gap-10">
                    {/* Section 1: การทำโอที */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-[20px] font-bold text-[#1e293b]">การทำโอที</h3>
                      
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        {/* นาทีขั้นต่ำ */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">นาทีขั้นต่ำ *</span>
                          <div className="flex items-center">
                            <input 
                              title="นาทีขั้นต่ำ" 
                              type="number" 
                              value={settings.ot_min_minutes || 60} 
                              onChange={(e) => setSettings({...settings, ot_min_minutes: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">นาที</span>
                          </div>
                        </div>

                        {/* นาทีสูงสุด สำหรับนอกเวลาทำงาน */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">นาทีสูงสุด สำหรับนอกเวลาทำงาน *</span>
                          <div className="flex items-center">
                            <input 
                              title="นาทีสูงสุด นอกเวลา" 
                              type="number" 
                              value={settings.ot_max_minutes_outside || 120} 
                              onChange={(e) => setSettings({...settings, ot_max_minutes_outside: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap mx-2">นาที</span>
                            <button title="Clear" onClick={() => setSettings({...settings, ot_max_minutes_outside: 0})} className="text-slate-300 hover:text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>

                        {/* จำกัดคำขอต่อวัน */}
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">จำกัดคำขอต่อวัน</span>
                          <select 
                            title="จำกัดคำขอต่อวัน"
                            value={settings.ot_limit_per_day || "ไม่จำกัด"}
                            onChange={(e) => setSettings({...settings, ot_limit_per_day: e.target.value})}
                            className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5 appearance-none cursor-pointer"
                          >
                            <option value="ไม่จำกัด">ไม่จำกัด</option>
                            <option value="1 ครั้ง">1 ครั้ง</option>
                            <option value="2 ครั้ง">2 ครั้ง</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: เงื่อนไข */}
                    <div className="flex flex-col gap-6">
                      <h3 className="text-[20px] font-bold text-[#1e293b]">เงื่อนไข</h3>
                      
                      {/* Toggles */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input title="input" 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={settings.ot_require_attachment || false}
                              onChange={(e) => setSettings({...settings, ot_require_attachment: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          <span className="text-[14px] font-bold text-slate-700">ต้องแนบเอกสารอนุมัติ</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input title="input" 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={settings.ot_include_break || true}
                              onChange={(e) => setSettings({...settings, ot_include_break: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          <span className="text-[14px] font-bold text-slate-700">เวลาพัก</span>
                        </div>
                      </div>

                      {/* Break Grid */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ระยะเวลาพัก</span>
                          <div className="flex items-center">
                            <input 
                              title="ระยะเวลาพัก" 
                              type="number" 
                              value={settings.ot_break_duration || 60} 
                              onChange={(e) => setSettings({...settings, ot_break_duration: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">นาที</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">เมื่อทำงานไปแล้ว</span>
                          <div className="flex items-center">
                            <input 
                              title="เมื่อทำงานไปแล้ว" 
                              type="number" 
                              value={settings.ot_work_threshold || 240} 
                              onChange={(e) => setSettings({...settings, ot_work_threshold: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">นาที</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ระยะเวลาพัก สำหรับนอกเวลาทำงาน</span>
                          <div className="flex items-center">
                            <input 
                              title="ระยะเวลาพัก นอกเวลา" 
                              type="number" 
                              value={settings.ot_break_duration_outside || 60} 
                              onChange={(e) => setSettings({...settings, ot_break_duration_outside: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">นาที</span>
                          </div>
                        </div>
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">เมื่อทำงานไปแล้ว สำหรับนอกเวลาทำงาน</span>
                          <div className="flex items-center">
                            <input 
                              title="เมื่อทำงานไปแล้ว นอกเวลา" 
                              type="number" 
                              value={settings.ot_work_threshold_outside || 240} 
                              onChange={(e) => setSettings({...settings, ot_work_threshold_outside: parseInt(e.target.value) || 0})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                            />
                            <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">นาที</span>
                          </div>
                        </div>
                      </div>

                      {/* Calculation Cycle */}
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input title="input" 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={settings.ot_enable_cycle || true}
                              onChange={(e) => setSettings({...settings, ot_enable_cycle: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          <span className="text-[14px] font-bold text-slate-700">กำหนดรอบการคำนวณโอที</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6">
                          <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                            <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">การปัดเศษรอบโอที</span>
                            <select 
                              title="การปัดเศษ"
                              value={settings.ot_rounding_type || "ปัดลง"}
                              onChange={(e) => setSettings({...settings, ot_rounding_type: e.target.value})}
                              className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5 appearance-none cursor-pointer"
                            >
                              <option value="ปัดลง">ปัดลง</option>
                              <option value="ปัดขึ้น">ปัดขึ้น</option>
                              <option value="ปัดตามจริง">ปัดตามจริง</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                          <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                            <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">คำนวณโอทีให้ทุกๆ</span>
                            <div className="flex items-center">
                              <input 
                                title="คำนวณทุกๆ" 
                                type="number" 
                                value={settings.ot_calculation_interval || 30} 
                                onChange={(e) => setSettings({...settings, ot_calculation_interval: parseInt(e.target.value) || 0})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                              <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap ml-2">นาที</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Auto Calculate */}
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input title="input" 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={settings.ot_auto_calculate || true}
                              onChange={(e) => setSettings({...settings, ot_auto_calculate: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          <span className="text-[14px] font-bold text-slate-700">คำนวณโอทีให้อัตโนมัติ</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                          <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                            <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">เริ่มคำนวณให้ก่อนเข้ากะการทำงาน กี่นาที</span>
                            <div className="flex items-center">
                              <input 
                                title="เริ่มก่อนเข้ากะ" 
                                type="number" 
                                value={settings.ot_before_shift_minutes || 60} 
                                onChange={(e) => setSettings({...settings, ot_before_shift_minutes: parseInt(e.target.value) || 0})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                              <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap mx-2">นาที</span>
                              <button title="Clear" onClick={() => setSettings({...settings, ot_before_shift_minutes: 0})} className="text-slate-300 hover:text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                          <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                            <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">เริ่มคำนวณให้หลังเลิกกะการทำงาน กี่นาที</span>
                            <div className="flex items-center">
                              <input 
                                title="เริ่มหลังเลิกกะ" 
                                type="number" 
                                value={settings.ot_after_shift_minutes || 60} 
                                onChange={(e) => setSettings({...settings, ot_after_shift_minutes: parseInt(e.target.value) || 0})}
                                className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" 
                              />
                              <span className="text-[13px] text-slate-500 font-bold whitespace-nowrap mx-2">นาที</span>
                              <button title="Clear" onClick={() => setSettings({...settings, ot_after_shift_minutes: 0})} className="text-slate-300 hover:text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Save Button for Company Settings */}
                <div className="flex justify-end pt-6 border-t border-slate-100">
                  <button title="button" 
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[15px] shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
                  </button>
                </div>

              </div>

            </div>
          </div>
        ) : activeSubPage === "org_struct" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header / Breadcrumb */}
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">องค์กร</span>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[24px] font-black text-slate-800 flex items-center gap-2">
                    โครงสร้างองค์กร
                    <span className="text-sky-500">🪄</span>
                  </h2>
                </div>

                {/* Tree Structure */}
                <div className="flex flex-col gap-4 pl-2">
                  {/* Root: Company */}
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-500 rounded flex items-center justify-center text-white text-[10px] shadow-sm">
                      <div className="flex flex-col gap-[2px]">
                        <div className="w-3 h-[1.5px] bg-white"></div>
                        <div className="w-3 h-[1.5px] bg-white"></div>
                        <div className="w-3 h-[1.5px] bg-white"></div>
                      </div>
                    </div>
                    <span className="text-[15px] font-bold text-sky-500">บริษัท:</span>
                    <span className="text-[15px] font-bold text-slate-700">บริษัท เอชอาร์ ซอฟต์ จำกัด</span>
                  </div>

                  {/* Departments (Level 1) */}
                  <div className="ml-[11px] border-l border-dashed border-slate-300 pl-8 flex flex-col gap-8">
                    {/* Dept 1: บุคคล */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-3 w-8 border-t border-dashed border-slate-300"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-slate-500 rounded flex items-center justify-center text-white shadow-sm">
                          <div className="w-2.5 h-[2px] bg-white"></div>
                        </div>
                        <span className="text-[14px] font-bold text-sky-500">ฝ่าย:</span>
                        <span className="text-[14px] font-bold text-slate-700">บุคคล</span>
                      </div>

                      {/* Sections (Level 2) */}
                      <div className="ml-[10px] border-l border-dashed border-slate-300 pl-8 mt-4 flex flex-col gap-4">
                        <div className="relative flex items-center gap-3">
                          <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                          <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                          <span className="text-[13.5px] font-bold text-sky-500">แผนก:</span>
                          <span className="text-[13.5px] font-bold text-slate-700">การสรรหาและคัดเลือกทรัพยากรบุคคล</span>
                        </div>
                        <div className="relative flex items-center gap-3">
                          <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                          <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                          <span className="text-[13.5px] font-bold text-sky-500">แผนก:</span>
                          <span className="text-[13.5px] font-bold text-slate-700">การวางแผนด้านทรัพยากรบุคคล</span>
                        </div>
                        {/* Add Section Button */}
                        <button title="button" className="relative flex items-center justify-center gap-2 py-2.5 w-full max-w-[400px] border-2 border-dashed border-sky-400 rounded-2xl bg-white hover:bg-sky-50 transition-colors mt-2">
                          <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                          <span className="text-sky-500 text-[18px] font-black">+</span>
                          <span className="text-sky-500 text-[14px] font-black">เพิ่ม แผนก</span>
                        </button>
                      </div>
                    </div>

                    {/* Dept 2: การตลาด */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-3 w-8 border-t border-dashed border-slate-300"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-slate-500 rounded flex items-center justify-center text-white shadow-sm">
                          <div className="w-2.5 h-[2px] bg-white"></div>
                        </div>
                        <span className="text-[14px] font-bold text-sky-500">ฝ่าย:</span>
                        <span className="text-[14px] font-bold text-slate-700">การตลาด</span>
                      </div>

                      <div className="ml-[10px] border-l border-dashed border-slate-300 pl-8 mt-4 flex flex-col gap-4">
                        <div className="relative flex items-center gap-3">
                          <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                          <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                          <span className="text-[13.5px] font-bold text-sky-500">แผนก:</span>
                          <span className="text-[13.5px] font-bold text-slate-700">การส่งเสริมการขาย</span>
                        </div>
                        <div className="relative flex items-center gap-3">
                          <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                          <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                          <span className="text-[13.5px] font-bold text-sky-500">แผนก:</span>
                          <span className="text-[13.5px] font-bold text-slate-700">การพัฒนาผลิตภัณฑ์ใหม่</span>
                        </div>
                        <button title="button" className="relative flex items-center justify-center gap-2 py-2.5 w-full max-w-[400px] border-2 border-dashed border-sky-400 rounded-2xl bg-white hover:bg-sky-50 transition-colors mt-2">
                          <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                          <span className="text-sky-500 text-[18px] font-black">+</span>
                          <span className="text-sky-500 text-[14px] font-black">เพิ่ม แผนก</span>
                        </button>
                      </div>
                    </div>

                    {/* Dept 3: ขาย */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-3 w-8 border-t border-dashed border-slate-300"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-slate-500 rounded flex items-center justify-center text-white shadow-sm">
                          <div className="w-2.5 h-[2px] bg-white"></div>
                        </div>
                        <span className="text-[14px] font-bold text-sky-500">ฝ่าย:</span>
                        <span className="text-[14px] font-bold text-slate-700">ขาย</span>
                      </div>
                      <div className="ml-[10px] border-l border-dashed border-slate-300 pl-8 mt-4">
                        <button title="button" className="relative flex items-center justify-center gap-2 py-2.5 w-full max-w-[400px] border-2 border-dashed border-sky-400 rounded-2xl bg-white hover:bg-sky-50 transition-colors">
                          <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                          <span className="text-sky-500 text-[18px] font-black">+</span>
                          <span className="text-sky-500 text-[14px] font-black">เพิ่ม แผนก</span>
                        </button>
                      </div>
                    </div>

                    {/* Add Dept Button */}
                    <div className="relative mt-2">
                      <button title="button" className="relative flex items-center justify-center gap-2 py-2.5 w-full max-w-[500px] border-2 border-dashed border-sky-400 rounded-2xl bg-white hover:bg-sky-50 transition-colors">
                        <div className="absolute -left-[33px] top-1/2 w-8 border-t border-dashed border-slate-300"></div>
                        <span className="text-sky-500 text-[18px] font-black">+</span>
                        <span className="text-sky-500 text-[14px] font-black">เพิ่ม ฝ่าย</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubPage === "position_level" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">ระดับตำแหน่ง</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-slate-800">ระดับตำแหน่ง</h3>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="relative w-full max-w-[280px]">
                    <input title="input" 
                      type="text" 
                      placeholder="ค้นหาระดับ" 
                      className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-sky-400 transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <button title="เพิ่มระดับตำแหน่ง" className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm active:scale-95">
                    <span className="text-[18px] leading-none">+</span> เพิ่มระดับตำแหน่ง
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[13px] text-slate-500 font-medium">6 รายการ</span>
                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#f8fafc] border-b border-slate-100">
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                            ลำดับ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                              ชื่อระดับ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            </div>
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                              ชื่อระดับ (EN) <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            </div>
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                              คำอธิบาย <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          { id: 1, name: "CEO", nameEn: "CEO", desc: "ประธานเจ้าหน้าที่บริหาร" },
                          { id: 2, name: "ผู้จัดการ", nameEn: "Manager", desc: "ผู้จัดการ" },
                          { id: 3, name: "ผู้ช่วยผู้จัดการ", nameEn: "Assistant Manager", desc: "ผู้ช่วยผู้จัดการ" },
                          { id: 4, name: "หัวหน้างาน", nameEn: "Supervisor", desc: "หัวหน้างาน" },
                          { id: 5, name: "เจ้าหน้าที่อาวุโส", nameEn: "Senior Officer", desc: "เจ้าหน้าที่อาวุโส" },
                          { id: 6, name: "พนักงาน", nameEn: "Officer", desc: "พนักงาน" },
                        ].map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-600 font-medium">{item.id}</td>
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-700 font-medium">{item.name}</td>
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-700 font-medium">{item.nameEn}</td>
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-700 font-medium">{item.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubPage === "position" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">ตำแหน่ง</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-slate-800">ตำแหน่ง</h3>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="relative w-full max-w-[280px]">
                    <input title="input" 
                      type="text" 
                      placeholder="ค้นหาตำแหน่ง" 
                      className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-sky-400 transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <button title="เพิ่มตำแหน่ง" className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm active:scale-95">
                    <span className="text-[18px] leading-none">+</span> เพิ่มตำแหน่ง
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[13px] text-slate-500 font-medium">4 รายการ</span>
                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#f8fafc] border-b border-slate-100">
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                            ลำดับ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                              ชื่อตำแหน่ง <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            </div>
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                              ชื่อตำแหน่ง (EN) <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            </div>
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                              ระดับ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            </div>
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-bold text-slate-600">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                              สถานะ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          { id: 1, name: "กรรมการผู้จัดการ", nameEn: "Managing Director", level: "CEO", status: "เปิดใช้งาน" },
                          { id: 2, name: "ผู้จัดการแผนก", nameEn: "Department Manager", level: "ผู้จัดการ", status: "เปิดใช้งาน" },
                          { id: 3, name: "พนักงานทั่วไป", nameEn: "General Officer", level: "พนักงาน", status: "เปิดใช้งาน" },
                          { id: 4, name: "พนักงานชั่วคราว", nameEn: "Part-time Officer", level: "พนักงาน", status: "เปิดใช้งาน" },
                        ].map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-600 font-medium">{item.id}</td>
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-700 font-medium">{item.name}</td>
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-700 font-medium">{item.nameEn}</td>
                            <td className="px-6 py-4.5 text-[13.5px] text-slate-700 font-medium">{item.level}</td>
                            <td className="px-6 py-4.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubPage === "workflow" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-white">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">เวิร์กโฟลว์</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 w-full flex flex-col gap-10">
                {/* Header Area */}
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-black text-slate-800">เวิร์กโฟลว์</h3>
                  <button title="วิธีใช้งาน" className="flex items-center gap-2 text-sky-500 hover:text-sky-600 transition-colors text-[14px] font-bold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    วิธีใช้งาน
                  </button>
                </div>

                <div className="flex justify-end">
                  <button title="เพิ่มเงื่อนไข" className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[14px] font-black transition-all shadow-sm active:scale-95">
                    <span className="text-[18px] leading-none">+</span> เพิ่มเงื่อนไข
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>

                {/* Section 1: เงื่อนไขหลัก */}
                <div className="flex flex-col gap-6">
                  <h4 className="text-[18px] font-black text-slate-800">เงื่อนไขหลัก</h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 ml-2 uppercase tracking-wider">ลำดับ</label>
                      <input title="input" type="text" defaultValue="1" className="w-16 px-4 py-2 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 text-center bg-white shadow-sm focus:outline-none" />
                    </div>

                    <div className="flex items-center gap-0 mt-2">
                      {/* Step 1 */}
                      <div className="w-[200px] border-2 border-emerald-100 rounded-2xl overflow-hidden shadow-sm bg-emerald-50/20">
                        <div className="bg-emerald-50 px-4 py-2.5">
                          <h5 className="text-[14px] font-black text-slate-800">ผู้ขออนุมัติ</h5>
                          <p className="text-[10px] font-bold text-slate-400">เฉพาะตำแหน่ง</p>
                        </div>
                        <div className="p-3 bg-white">
                          <div className="relative">
                            <select title="select" className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 appearance-none focus:outline-none">
                              <option>พนักงานทั่วไป</option>
                            </select>
                            <svg className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-10 border-t-2 border-dashed border-slate-200"></div>
                        <button title="เพิ่มขั้นตอน" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-sky-100 hover:text-sky-500 transition-colors">
                          <span className="text-[16px] font-bold leading-none">+</span>
                        </button>
                        <div className="w-10 flex items-center">
                          <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-slate-200"></div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="w-[200px] border-2 border-emerald-100 rounded-2xl overflow-hidden shadow-sm bg-emerald-50/20">
                        <div className="bg-emerald-50 px-4 py-2.5">
                          <h5 className="text-[14px] font-black text-slate-800">อนุมัติโดยตำแหน่ง</h5>
                          <p className="text-[10px] font-bold text-slate-400">เฉพาะตำแหน่ง</p>
                        </div>
                        <div className="p-3 bg-white">
                          <div className="relative">
                            <select title="select" className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 appearance-none focus:outline-none">
                              <option>ผู้จัดการแผนก</option>
                            </select>
                            <svg className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-10 border-t-2 border-dashed border-slate-200"></div>
                        <button title="เพิ่มขั้นตอน" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-sky-100 hover:text-sky-500 transition-colors">
                          <span className="text-[16px] font-bold leading-none">+</span>
                        </button>
                        <div className="w-10 flex items-center">
                          <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-slate-200"></div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="w-[200px] border-2 border-emerald-100 rounded-2xl overflow-hidden shadow-sm bg-emerald-50/20">
                        <div className="bg-emerald-50 px-4 py-2.5">
                          <h5 className="text-[14px] font-black text-slate-800">อนุมัติโดยตำแหน่ง</h5>
                          <p className="text-[10px] font-bold text-slate-400">เฉพาะตำแหน่ง</p>
                        </div>
                        <div className="p-3 bg-white">
                          <div className="relative">
                            <select title="select" className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 appearance-none focus:outline-none">
                              <option>กรรมการผู้จัดการ</option>
                            </select>
                            <svg className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center ml-2">
                        <button title="เพิ่มขั้นตอน" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-sky-100 hover:text-sky-500 transition-colors">
                          <span className="text-[16px] font-bold leading-none">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full my-2"></div>

                {/* Section 2: เงื่อนไขพื้นฐาน */}
                <div className="flex flex-col gap-6">
                  <h4 className="text-[18px] font-black text-slate-800">เงื่อนไขพื้นฐาน</h4>
                  <div className="flex items-center gap-0">
                    {/* Step 1 */}
                    <div className="w-[200px] border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
                      <div className="bg-slate-100 px-4 py-2.5">
                        <h5 className="text-[14px] font-black text-slate-800">ผู้ขออนุมัติ</h5>
                        <p className="text-[10px] font-bold text-slate-400">ทุกคน</p>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="px-3 py-2 border border-slate-100 rounded-lg bg-slate-50/50 text-[12px] font-bold text-slate-500">
                          บริษัท เอชอาร์ ซอฟต์ จำกัด
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 border-t-2 border-dashed border-slate-200"></div>
                      <div className="w-10 flex items-center">
                        <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-slate-200"></div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="w-[200px] border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
                      <div className="bg-slate-100 px-4 py-2.5">
                        <h5 className="text-[14px] font-black text-slate-800">ตามสายบังคับบัญชา</h5>
                        <p className="text-[10px] font-bold text-slate-400">อนุมัติตามลำดับขั้น</p>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="relative">
                          <select title="select" className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 appearance-none focus:outline-none">
                            <option>เฉพาะหัวหน้าโดยตรง</option>
                          </select>
                          <svg className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubPage === "emp_id" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-[#f8fafc]">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">รหัสพนักงาน และ เลขที่เอกสาร</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 w-full flex flex-col gap-8 pb-24">
                <h3 className="text-[20px] font-black text-slate-800">รหัสพนักงาน และ เลขที่เอกสาร</h3>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { title: "รหัสพนักงาน", sample: "2600001", prefix: "", length: "5 หลัก", year: true, month: false, seq: "9", next: "2600010" },
                    { title: "คำขอ", sample: "L2600001", prefix: "L", length: "5 หลัก", year: true, month: false, seq: "7", next: "L2600008" },
                    { title: "เปลี่ยนกะ", sample: "CS2600001", prefix: "CS", length: "5 หลัก", year: true, month: false, seq: "1", next: "CS2600002" },
                    { title: "สลับกะ", sample: "SS2600001", prefix: "SS", length: "5 หลัก", year: true, month: false, seq: "0", next: "SS2600001" },
                    { title: "ค่าใช้จ่าย", sample: "EXP2600001", prefix: "EXP", length: "5 หลัก", year: true, month: false, seq: "7", next: "EXP2600008" },
                    { title: "หนังสือเตือน", sample: "WL2600001", prefix: "WL", length: "5 หลัก", year: true, month: false, seq: "2", next: "WL2600003" },
                  ].map((card, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[16px] font-black text-slate-800">{card.title}</h4>
                        <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[12px] font-bold text-slate-400">ตัวอย่าง : {card.sample}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-400 ml-1">อักษรนำ</label>
                          <input title="input" type="text" defaultValue={card.prefix} placeholder="อักษรนำ" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-400 ml-1">ยาว</label>
                          <div className="relative">
                            <select title="select" className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:border-sky-400 transition-colors">
                              <option>{card.length}</option>
                            </select>
                            <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-bold text-slate-600">แสดงปี</span>
                          <div className={`w-12 h-6 ${card.year ? 'bg-emerald-500' : 'bg-slate-200'} rounded-full relative cursor-pointer transition-colors`}>
                            <div className={`absolute ${card.year ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm`}></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-bold text-slate-600">แสดงเดือน</span>
                          <div className={`w-12 h-6 ${card.month ? 'bg-emerald-500' : 'bg-slate-200'} rounded-full relative cursor-pointer transition-colors`}>
                            <div className={`absolute ${card.month ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm`}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-400 ml-1">ลำดับปัจจุบัน</label>
                          <input title="input" type="text" defaultValue={card.seq} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors" />
                        </div>
                        <p className="text-[12px] font-bold text-slate-400 ml-1">ลำดับถัดไป : {card.next}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0 z-20">
              <button title="button" onClick={() => setActiveSubPage(null)} className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">ยกเลิก</button>
              <button title="button" className="px-8 py-2.5 bg-[#bbf7ff] hover:bg-[#a5f3fc] rounded-xl text-[14px] font-bold text-[#0891b2] transition-all shadow-sm">บันทึก</button>
            </div>
          </div>
        ) : activeSubPage === "notifications" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">แจ้งเตือน</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
              <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-10">
                <h3 className="text-[24px] font-black text-slate-800">ตั้งค่าแจ้งเตือน</h3>

                {/* Main Toggle */}
                <div className="flex items-center gap-6 py-6 border-y border-slate-100">
                  <div className="w-16 h-8 bg-slate-200 rounded-full relative cursor-pointer group transition-colors">
                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform"></div>
                  </div>
                  <span className="text-[18px] font-black text-slate-800">แจ้งเตือน</span>
                </div>

                {/* Expanded Content (Simulated as always visible for design demonstration) */}
                <div className="flex flex-col gap-12">
                  {/* Platform Settings */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="relative">
                        <select title="Platform" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:border-sky-400 transition-colors">
                          <option>Telegram</option>
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <input title="Token" type="text" placeholder="Token *" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors" />
                    </div>
                    <div className="col-span-1">
                      <input title="Chat ID" type="text" placeholder="Chat ID *" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors" />
                    </div>
                    <div className="col-span-1">
                      <input title="Thread ID" type="text" placeholder="Thread ID" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors" />
                    </div>
                  </div>

                  {/* Sections */}
                  {[
                    {
                      title: "สรุปจำนวนพนักงานมาทำงาน",
                      items: ["สรุปจำนวนพนักงานมาทำงานประจำวัน", "สรุปจำนวนพนักงานมาทำงานประจำเดือน"]
                    },
                    {
                      title: "การลงเวลาเข้า-ออกงานของพนักงานรายบุคคล",
                      items: ["ลงเวลาเข้า - ออกงาน", "ลงเวลาพักเบรค", "ส่งรูปภาพสแกนใบหน้า", "แจ้งเตือนเครื่องสแกนนิ้ว"]
                    },
                    {
                      title: "การบันทึกเอกสาร",
                      items: ["การสร้างเอกสาร", "การอนุมัติเอกสาร", "การยกเลิกเอกสาร", "สรุปคำขอประจำวัน"]
                    },
                    {
                      title: "งาน",
                      items: ["การสร้างงาน", "การแก้ไขงาน", "การลบงาน"]
                    },
                    {
                      title: "ค่าใช้จ่าย & เบิกเงิน",
                      items: ["การสร้างค่าใช้จ่าย & เบิกเงิน", "การอนุมัติค่าใช้จ่าย & เบิกเงิน", "การยกเลิกค่าใช้จ่าย & เบิกเงิน"]
                    }
                  ].map((section, idx) => (
                    <div key={idx} className="flex flex-col gap-6">
                      <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-wide">{section.title}</h4>
                      <div className="flex flex-col gap-6 ml-2">
                        {section.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-6 group">
                            <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer transition-colors group-hover:bg-slate-300">
                              <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
                            </div>
                            <span className="text-[14px] font-bold text-slate-600 transition-colors group-hover:text-slate-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between sticky bottom-0 z-20">
              <button title="button" className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[14px] font-bold text-slate-600 transition-all">
                <svg className="w-4 h-4 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                ทดสอบการแจ้งเตือน
              </button>
              <div className="flex items-center gap-4">
                <button title="button" onClick={() => setActiveSubPage(null)} className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">ยกเลิก</button>
                <button title="button" className="px-8 py-2.5 bg-[#bbf7ff] hover:bg-[#a5f3fc] rounded-xl text-[14px] font-bold text-[#0891b2] transition-all shadow-sm">บันทึก</button>
              </div>
            </div>
          </div>
        ) : activeSubPage === "app_notifications" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-white">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">แจ้งเตือนแอปพลิเคชัน</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-10">
                <h3 className="text-[24px] font-black text-slate-800">ตั้งค่าแจ้งเตือนแอปพลิเคชัน</h3>

                {/* Main Toggle */}
                <div className="flex items-center gap-6 py-6 border-y border-slate-100">
                  <div className="w-16 h-8 bg-slate-200 rounded-full relative cursor-pointer group transition-colors">
                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform"></div>
                  </div>
                  <span className="text-[18px] font-black text-slate-800">แจ้งเตือนแอปพลิเคชัน</span>
                </div>

                {/* Expanded Content */}
                <div className="flex flex-col gap-12">
                  {[
                    {
                      title: "การลงเวลาเข้า-ออกงานของพนักงานรายบุคคล",
                      items: ["ลงเวลาเข้า - ออกงาน", "ลงเวลาพักเบรค"]
                    },
                    {
                      title: "การบันทึกเอกสาร",
                      items: ["การสร้างเอกสาร", "การอนุมัติเอกสาร", "การยกเลิกเอกสาร"]
                    },
                    {
                      title: "ประกาศ",
                      items: ["การสร้างประกาศ"]
                    },
                    {
                      title: "งาน",
                      items: ["การสร้างงาน", "การแก้ไขงาน", "การลบงาน"]
                    },
                    {
                      title: "ค่าใช้จ่าย&เบิกเงิน",
                      items: ["การสร้างค่าใช้จ่าย & เบิกเงิน", "การอนุมัติค่าใช้จ่าย & เบิกเงิน", "การยกเลิกค่าใช้จ่าย & เบิกเงิน"]
                    }
                  ].map((section, idx) => (
                    <div key={idx} className="flex flex-col gap-6">
                      <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-wide">{section.title}</h4>
                      <div className="flex flex-col gap-6 ml-2">
                        {section.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-6 group">
                            <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer transition-colors group-hover:bg-slate-300">
                              <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
                            </div>
                            <span className="text-[14px] font-bold text-slate-600 transition-colors group-hover:text-slate-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0 z-20">
              <button title="button" onClick={() => setActiveSubPage(null)} className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">ยกเลิก</button>
              <button title="button" className="px-8 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-xl text-[14px] font-bold text-white transition-all shadow-sm">บันทึก</button>
            </div>
          </div>
        ) : activeSubPage === "currency" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-white">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">สกุลเงิน</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 max-w-xl mx-auto w-full flex flex-col gap-10">
                <h3 className="text-[24px] font-black text-slate-800">ตั้งค่าสกุลเงิน</h3>

                <div className="flex flex-col gap-8">
                  <p className="text-[14px] font-bold text-slate-400">ตัวอย่าง : ฿1,000.00</p>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-black text-slate-800">สกุลเงิน</label>
                      <div className="relative">
                        <select title="Currency" className="w-full pl-4 pr-10 py-3 bg-white border border-sky-400 rounded-xl text-[14px] font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                          <option>฿ | THB, Thai Baht</option>
                          <option>₭ | LAK, Lao Kip</option>
                          <option>$ | USD, US Dollar</option>
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-black text-slate-800">จำนวนทศนิยม</label>
                      <div className="relative">
                        <select title="Decimals" className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                          <option>2</option>
                          <option>0</option>
                          <option>1</option>
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-black text-slate-800">ตำแหน่งสัญลักษณ์</label>
                      <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden w-fit">
                        <button title="button" className="px-10 py-2.5 bg-sky-50 text-sky-500 text-[14px] font-bold border-r border-slate-200">฿1,000.00</button>
                        <button title="button" className="px-10 py-2.5 bg-white text-slate-400 text-[14px] font-bold">1,000.00฿</button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-white font-bold italic">i</div>
                      <span className="text-[12px] font-bold">สกุลเงินใช้เพื่อแสดงผลเท่านั้น ไม่มีผลต่อการคำนวณในระบบ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0 z-20">
              <button title="button" onClick={() => setActiveSubPage(null)} className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">ยกเลิก</button>
              <button title="button" className="px-8 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-xl text-[14px] font-bold text-white transition-all shadow-sm">บันทึก</button>
            </div>
          </div>
        ) : activeSubPage === "shifts" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-white">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">กะการทำงาน</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-black text-slate-800">กะการทำงาน</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <button 
                        title="เพิ่มกะการทำงาน" 
                        onClick={() => setShowShiftDropdown(!showShiftDropdown)}
                        className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl text-[14px] font-black transition-all shadow-sm active:scale-95"
                      >
                        <span className="text-[20px] leading-none">+</span> เพิ่มกะการทำงาน
                      </button>
                      
                      {showShiftDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button title="button" 
                            onClick={() => {
                              setShiftModal("add_shift");
                              setShowShiftDropdown(false);
                            }}
                            className="w-full px-5 py-3 text-left text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            กะการทำงาน
                          </button>
                          <button title="button" 
                            onClick={() => {
                              setShiftModal("add_holiday_shift");
                              setShowShiftDropdown(false);
                            }}
                            className="w-full px-5 py-3 text-left text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            กะวันหยุด
                          </button>
                        </div>
                      )}
                    </div>
                    <button title="วิธีใช้งาน" className="flex items-center gap-2 text-sky-500 hover:text-sky-600 transition-colors text-[14px] font-bold">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      วิธีใช้งาน
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="relative flex-1 max-w-md">
                    <input title="input" type="text" placeholder="ค้นหากะการทำงาน" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-medium outline-none focus:border-sky-400 transition-colors shadow-sm" />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      {/* Label on border */}
                      <div className="absolute -top-2 left-4 px-1 bg-white z-10">
                        <span className="text-[11px] font-black text-sky-500 uppercase tracking-wider">สถานะ</span>
                      </div>
                      
                      <button title="button" 
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className={`flex items-center justify-between w-[160px] px-4 py-2.5 bg-white border-2 rounded-2xl text-[15px] font-bold transition-all outline-none ${showStatusDropdown ? 'border-sky-500 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <span className="text-slate-700">{selectedStatus}</span>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>

                      {showStatusDropdown && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setShowStatusDropdown(false)}></div>
                          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-[20px] shadow-xl z-30 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {["ทั้งหมด", "เปิดใช้งาน", "ปิดใช้งาน"].map((status) => (
                              <button title="button"
                                key={status}
                                onClick={() => {
                                  setSelectedStatus(status);
                                  setShowStatusDropdown(false);
                                }}
                                className={`w-full px-5 py-3 text-left text-[14px] font-bold transition-colors ${selectedStatus === status ? 'bg-sky-50 text-sky-500' : 'text-slate-600 hover:bg-slate-50'}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[13px] font-bold text-slate-400 ml-1">4 รายการ</div>

                <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">
                          <div className="flex items-center gap-1.5">รหัสกะ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></div>
                        </th>
                        <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">
                          <div className="flex items-center gap-1.5">ชื่อกะ <svg className="w-3 h-3 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></div>
                        </th>
                        <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">
                          <div className="flex items-center gap-1.5">รายละเอียดกะ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></div>
                        </th>
                        <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">
                          <div className="flex items-center gap-1.5">สถานะ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></div>
                        </th>
                        <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { code: "FLEX1", name: "ทำงาน 8 ชั่วโมง", desc: "สำหรับ พนักงานที่มีเวลากำหนดงาน กะเช้า-ดึก ตลอดทั้งเดือน ให้ยับเวลาเข้างาน-ออกงาน ให้ครบ 8 ชั่วโมง", color: "bg-[#ec4899]" },
                        { code: "FREE1", name: "ฟรีแลนซ์", desc: "สำหรับ ฟรีแลนซ์ ทำงานตามจริง เข้างาน-พักเบรค ตามจริง พักเบรคได้หลายครั้ง", color: "bg-[#22c55e]" },
                        { code: "SHIFT101", name: "เวลาทำงาน 08:00 - 17:00", desc: "เวลาทำงานปกติ ทำงานแค่ จันทร์ - ศุกร์ เสาร์ - อาทิตย์ เป็นวันหยุด", color: "bg-[#0ea5e9]" },
                        { code: "OFF", name: "วันหยุด", desc: "วันหยุดของพนักงาน", color: "bg-[#1e293b]" },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                              <span className="text-[14px] font-black text-slate-700">{item.code}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[14px] font-bold text-slate-500">{item.name}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[14px] font-bold text-slate-400 line-clamp-1">{item.desc}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-500 text-[11px] font-black">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              เปิดใช้งาน
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button title="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modals */}
              {shiftModal === "add_shift" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-300">
                  <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                      <div className="flex items-center text-[13px] text-slate-500 gap-2">
                        <span className="text-slate-800 font-bold">เพิ่มกะการทำงาน</span>
                      </div>
                      <button title="button" onClick={() => setShiftModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                      <div className="w-full flex flex-col gap-10">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                          {/* Left Side: Basic Info */}
                          <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-1">
                                <input title="input" type="text" placeholder="รหัสกะ *" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors shadow-sm" />
                              </div>
                              <div className="col-span-2">
                                <input title="input" type="text" placeholder="ชื่อกะ *" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors shadow-sm" />
                              </div>
                            </div>
                            <input title="input" type="text" placeholder="ชื่อกะ (EN)" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors shadow-sm" />
                            <textarea placeholder="รายละเอียดกะ" rows={3} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-colors resize-none shadow-sm" />
                            
                            <div className="flex items-center gap-4">
                              <span className="text-[14px] font-bold text-slate-700 flex items-center gap-1.5">
                                สีประจำกะ * 
                                <div className="w-4 h-4 rounded-full bg-slate-200 text-white text-[10px] flex items-center justify-center italic font-bold">i</div>
                              </span>
                              <button title="เลือกสี" className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center overflow-hidden bg-white shadow-sm hover:border-slate-200 transition-all">
                                <div className="w-full h-full bg-slate-100 relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-[2px] bg-slate-300 transform rotate-45"></div>
                                  </div>
                                </div>
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-bold text-slate-700">เปิดใช้งานโอทีอัตโนมัตินอกกะ</span>
                                <div className="w-4 h-4 rounded-full bg-slate-200 text-white text-[10px] flex items-center justify-center italic font-bold">i</div>
                              </div>
                              <div className="relative flex-1 max-w-[180px]">
                                <select title="Auto OT" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 appearance-none outline-none cursor-pointer focus:border-sky-400 shadow-sm transition-all">
                                  <option>ตามตั้งค่าบริษัท</option>
                                </select>
                                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Advanced Settings */}
                          <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                              <span className="text-[14px] font-bold text-slate-700">ตั้งค่า ควบกะ</span>
                              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer group transition-colors hover:bg-slate-300">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[14px] font-bold text-slate-700">เงื่อนไขการเข้า-ออกงาน</span>
                              <div className="relative flex-1 max-w-[200px]">
                                <select title="Attendance Condition" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 appearance-none outline-none cursor-pointer focus:border-sky-400 shadow-sm transition-all">
                                  <option>ตามเวลาทำงานในกะ</option>
                                </select>
                                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-bold text-slate-700">ลงเวลาเข้า-ออกงานช่วงพักเบรค</span>
                                <div className="w-4 h-4 rounded-full bg-slate-200 text-white text-[10px] flex items-center justify-center italic font-bold">i</div>
                              </div>
                              <input title="Record Break" type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[14px] font-bold text-slate-700">เงื่อนไขการพักเบรค</span>
                              <div className="relative flex-1 max-w-[200px]">
                                <select title="Break Condition" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 appearance-none outline-none cursor-pointer focus:border-sky-400 shadow-sm transition-all">
                                  <option>ตามเวลาทำงานในกะ</option>
                                </select>
                                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-[14px] font-bold text-slate-700">พักเบรคหลายครั้ง</span>
                              <input title="Multi Break" type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer" />
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-[14px] font-bold text-slate-700">ลงเวลาออกงาน ต้องระบุโน้ต</span>
                              <input title="Require Note" type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer" />
                            </div>
                          </div>
                        </div>

                        {/* Shift Periods Table */}
                        <div className="flex flex-col gap-6 mt-4 pb-10">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[16px] font-black text-slate-800">ช่วงกะการทำงาน</h4>
                            <button title="เพิ่มช่วงกะ" className="flex items-center gap-2 border-2 border-dashed border-sky-300 hover:border-sky-400 text-sky-500 px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all bg-sky-50/30 active:scale-95">
                              <span className="text-[18px] leading-none">+</span> เพิ่มช่วงกะ
                            </button>
                          </div>

                          <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
                            <table className="w-full border-collapse">
                              <thead className="bg-[#f8fafc] border-b border-slate-100">
                                <tr>
                                  <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-wider text-left">สถานะ</th>
                                  <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-wider text-left">วัน</th>
                                  <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-wider text-left">สัปดาห์</th>
                                  <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-wider text-center">เวลาทำงาน</th>
                                  <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-wider text-center">เวลาพัก</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-slate-50/20">
                                  <td className="px-6 py-5">
                                    <div className="w-10 h-5 bg-[#22c55e] rounded-full relative cursor-pointer"><div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="relative min-w-[140px]">
                                      <select title="Day" className="w-full pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 appearance-none outline-none cursor-pointer focus:border-sky-400">
                                        <option>จ. - ศ.</option>
                                      </select>
                                      <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="relative min-w-[140px]">
                                      <select title="Week" className="w-full pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 appearance-none outline-none cursor-pointer focus:border-sky-400">
                                        <option>ทุกสัปดาห์</option>
                                      </select>
                                      <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="flex items-center gap-3 justify-center">
                                      <div className="relative w-[110px]">
                                        <input title="Start" type="text" defaultValue="08:00" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 outline-none focus:border-sky-400 shadow-sm" />
                                        <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      </div>
                                      <div className="relative w-[110px]">
                                        <input title="End" type="text" defaultValue="17:00" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 outline-none focus:border-sky-400 shadow-sm" />
                                        <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="flex items-center gap-3 justify-center">
                                      <div className="relative w-[110px]">
                                        <input title="Break Start" type="text" defaultValue="12:00" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 outline-none focus:border-sky-400 shadow-sm" />
                                        <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      </div>
                                      <div className="relative w-[110px]">
                                        <input title="Break End" type="text" defaultValue="13:00" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 outline-none focus:border-sky-400 shadow-sm" />
                                        <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-end sticky bottom-0 z-20">
                      <button title="button" className="px-12 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-xl text-[14px] font-bold text-white transition-all shadow-md active:scale-95">สร้าง</button>
                    </div>
                  </div>
                </div>
              )}

              {shiftModal === "add_holiday_shift" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-300">
                  <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                    <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-[20px] font-black text-slate-800">เพิ่มกะวันหยุด</h3>
                      <button title="button" onClick={() => setShiftModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="p-10 flex flex-col gap-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <input title="input" type="text" placeholder="รหัสกะ *" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" />
                        </div>
                        <div className="col-span-2">
                          <input title="input" type="text" placeholder="ชื่อกะ *" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" />
                        </div>
                      </div>
                      
                      <input title="input" type="text" placeholder="ชื่อกะ (EN)" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" />
                      
                      <textarea placeholder="รายละเอียดกะ" rows={4} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all resize-none shadow-sm" />
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[15px] font-bold text-slate-700 flex items-center gap-1.5">
                            สีประจำกะ * 
                            <div className="w-4 h-4 rounded-full bg-slate-200 text-white text-[10px] flex items-center justify-center italic font-bold">i</div>
                          </span>
                          <button title="เลือกสี" className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center overflow-hidden bg-white shadow-md hover:border-sky-200 transition-all">
                            <div className="w-full h-full bg-slate-50 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-[2px] bg-slate-200 transform rotate-45"></div>
                              </div>
                            </div>
                          </button>
                        </div>
                        
                        <button title="button" className="px-12 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-2xl text-[15px] font-extrabold text-white transition-all shadow-lg active:scale-95 shadow-sky-200">
                          สร้าง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeSubPage === "calendar" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-white overflow-hidden">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center text-[13px] text-slate-500 gap-2">
                <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
                <span>›</span>
                <span className="text-slate-800 font-bold">ปฏิทิน</span>
              </div>
              <button title="วิธีใช้งาน" className="flex items-center gap-2 text-sky-500 hover:text-sky-600 transition-colors text-[14px] font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                วิธีใช้งาน
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 w-full flex flex-col gap-8">
                {/* Top Section: Cards */}
                <div className="flex gap-6">
                  {/* Calendar Card */}
                  <div className="w-[300px] p-6 bg-sky-200/50 rounded-[28px] border border-sky-100 flex flex-col gap-6 relative group">
                    <h4 className="text-[17px] font-black text-slate-800">วันหยุดประจำปี</h4>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-500 text-[11px] font-black shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        เปิดใช้งาน
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <button title="คัดลอก" className="p-1.5 hover:bg-white rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
                        <button title="แก้ไข" className="p-1.5 hover:bg-white rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      </div>
                    </div>
                  </div>

                  {/* Add New Card */}
                  <div 
                    onClick={() => setCalendarModal("add_calendar")}
                    className="w-[300px] border-2 border-dashed border-slate-200 rounded-[28px] flex items-center justify-center p-6 cursor-pointer hover:border-sky-300 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-black text-slate-500 group-hover:text-sky-500 transition-colors">สร้างปฏิทิน</span>
                      <div className="w-8 h-8 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-sky-300 group-hover:text-sky-500 transition-all">
                        <span className="text-xl font-bold">+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-end gap-4">
                  <div className="relative">
                    <div className="absolute -top-2 left-4 px-1 bg-white z-10">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ปี</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl min-w-[120px] shadow-sm">
                      <span className="text-[14px] font-bold text-slate-700">2569</span>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  </div>

                  <button title="ดาวน์โหลด" className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    ดาวน์โหลด
                  </button>

                  <button 
                    title="เพิ่มวันหยุด" 
                    onClick={() => setCalendarModal("add_holiday")}
                    className="flex items-center gap-2 px-6 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-xl text-[14px] font-bold text-white transition-all shadow-md active:scale-95"
                  >
                    <span className="text-[18px] leading-none">+</span> เพิ่มวันหยุด
                  </button>
                </div>

                {/* Holiday List Table */}
                <div className="flex flex-col gap-4">
                  <div className="text-[13px] font-bold text-slate-400 ml-1">19 รายการ</div>
                  <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#f8fafc] border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left flex items-center gap-1.5">วันที่ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></th>
                          <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">ชื่อวันหยุด <svg className="w-3.5 h-3.5 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></th>
                          <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">ชื่อวันหยุด (EN) <svg className="w-3.5 h-3.5 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></th>
                          <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">ประเภท <svg className="w-3.5 h-3.5 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></th>
                          <th className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider text-left">สถานะ <svg className="w-3.5 h-3.5 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          { date: "พฤ. 1 ม.ค. 69", name: "วันขึ้นปีใหม่", nameEn: "New Year's Day", type: "วันหยุดตามประเพณี" },
                          { date: "ศ. 2 ม.ค. 69", name: "วันหยุดทำการเพิ่มเป็นกรณีพิเศษ", nameEn: "Additional special holiday", type: "วันหยุดตามประเพณี" },
                          { date: "อ. 3 มี.ค. 69", name: "วันมาฆบูชา", nameEn: "Makha Bucha Day", type: "วันหยุดตามประเพณี" },
                          { date: "จ. 6 เม.ย. 69", name: "วันพระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช...", nameEn: "Chakri Memorial Day", type: "วันหยุดตามประเพณี" },
                          { date: "จ. 13 เม.ย. 69", name: "วันสงกรานต์ #1", nameEn: "Songkran Festival #1", type: "วันหยุดตามประเพณี" },
                          { date: "อ. 14 เม.ย. 69", name: "วันสงกรานต์ #2", nameEn: "Songkran Festival #2", type: "วันหยุดตามประเพณี" },
                          { date: "พ. 15 เม.ย. 69", name: "วันสงกรานต์ #3", nameEn: "Songkran Festival #3", type: "วันหยุดตามประเพณี" },
                          { date: "ศ. 1 พ.ค. 69", name: "วันแรงงานแห่งชาติ", nameEn: "National Labor Day", type: "วันหยุดตามประเพณี" },
                          { date: "อ. 4 พ.ค. 69", name: "วันฉัตรมงคล", nameEn: "Coronation Day", type: "วันหยุดตามประเพณี" },
                          { date: "จ. 1 มิ.ย. 69", name: "ชดเชยวันวิสาขบูชา", nameEn: "Substitution for Visakha Bucha Day", type: "วันหยุดตามประเพณี" },
                        ].map((h, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5 text-[14px] font-bold text-slate-500 whitespace-nowrap">{h.date}</td>
                            <td className="px-6 py-5 text-[14px] font-black text-slate-700">{h.name}</td>
                            <td className="px-6 py-5 text-[14px] font-bold text-slate-500">{h.nameEn}</td>
                            <td className="px-6 py-5">
                              <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[12px] font-black whitespace-nowrap">{h.type}</span>
                            </td>
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center gap-2 text-emerald-500 text-[14px] font-black whitespace-nowrap">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                เปิดใช้งาน
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modals */}
              {calendarModal === "add_holiday" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-300">
                  <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                    <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-[20px] font-black text-slate-800">เพิ่มวันหยุด</h3>
                      <button title="button" onClick={() => setCalendarModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="p-10 flex flex-col gap-6">
                      <div className="relative">
                        <input title="input" type="text" placeholder="วันที่ *" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" />
                        <svg className="w-6 h-6 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>

                      <input title="input" type="text" placeholder="ชื่อวันหยุด *" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" />
                      <input title="input" type="text" placeholder="ชื่อวันหยุด (EN)" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" />

                      <div className="flex flex-col gap-3">
                        <span className="text-[15px] font-black text-slate-800">ประเภท</span>
                        <div className="flex items-center gap-8">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-6 h-6 rounded-full border-2 border-sky-500 flex items-center justify-center p-1">
                              <div className="w-full h-full bg-sky-500 rounded-full"></div>
                            </div>
                            <span className="text-[14px] font-bold text-slate-700">วันหยุดบริษัท</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center p-1">
                              <div className="w-full h-full bg-white rounded-full"></div>
                            </div>
                            <span className="text-[14px] font-bold text-slate-500">วันหยุดตามประเพณี</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <span className="text-[15px] font-black text-slate-800">Addon อัตราโอที</span>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="relative">
                            <div className="absolute -top-2 left-4 px-1 bg-white z-10">
                              <span className="text-[10px] font-black text-slate-400">อัตราค่าโอทีในกะ</span>
                            </div>
                            <div className="flex items-center justify-between px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                              <input title="OT In" type="number" defaultValue="0" className="w-full bg-transparent outline-none text-[15px] font-bold text-slate-700" />
                              <span className="text-[14px] font-bold text-slate-400 ml-2">เท่า</span>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute -top-2 left-4 px-1 bg-white z-10">
                              <span className="text-[10px] font-black text-slate-400">อัตราค่าโอทีนอกกะ</span>
                            </div>
                            <div className="flex items-center justify-between px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                              <input title="OT Out" type="number" defaultValue="0" className="w-full bg-transparent outline-none text-[15px] font-bold text-slate-700" />
                              <span className="text-[14px] font-bold text-slate-400 ml-2">เท่า</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button title="button" className="px-12 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-2xl text-[16px] font-extrabold text-white transition-all shadow-lg active:scale-95 shadow-sky-200">
                          สร้าง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {calendarModal === "add_calendar" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-300">
                  <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                    <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-[20px] font-black text-slate-800">สร้างปฏิทิน</h3>
                      <button title="button" onClick={() => setCalendarModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="p-10 flex flex-col gap-6">
                      <input title="input" type="text" placeholder="ชื่อปฏิทิน *" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" />
                      
                      <div className="relative">
                        <div className="absolute -top-2 left-4 px-1 bg-white z-10">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ปี</span>
                        </div>
                        <select title="ปี" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:border-sky-400 transition-all shadow-sm">
                          <option>2567 (2024)</option>
                          <option>2568 (2025)</option>
                          <option>2569 (2026)</option>
                        </select>
                        <svg className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button title="button" className="px-12 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-2xl text-[16px] font-extrabold text-white transition-all shadow-lg active:scale-95 shadow-sky-200">
                          สร้าง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeSubPage === "request_types" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-[#F8FAFC]">
            {/* Breadcrumb / Header */}
            <div className="px-8 py-4 bg-white border-b border-slate-200/60 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center text-[13px] text-slate-400 gap-2">
                <button title="ย้อนกลับไปตั้งค่า" onClick={() => { if (isAddingRequestType) setIsAddingRequestType(false); else setActiveSubPage(null); }} className="hover:text-sky-600 transition-colors cursor-pointer font-medium">ตั้งค่า</button>
                <span className="text-slate-300">/</span>
                <button onClick={() => setIsAddingRequestType(false)} className={`transition-colors ${isAddingRequestType ? "hover:text-sky-600 text-slate-400 font-medium" : "text-slate-900 font-bold"}`}>ประเภทคำขอ</button>
                {isAddingRequestType && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-bold">เพิ่มประเภทคำขอ</span>
                  </>
                )}
              </div>
              {!isAddingRequestType && (
                <button className="flex items-center gap-2 text-sky-500 hover:text-sky-600 transition-colors text-[13.5px] font-bold">
                  <div className="w-5 h-5 rounded-full border-2 border-sky-500 flex items-center justify-center text-[12px]">?</div>
                  วิธีใช้งาน
                </button>
              )}
            </div>

            {!isAddingRequestType ? (
              <div className="p-8 w-full flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[22px] font-black text-slate-800 mb-1">ประเภทคำขอ</h2>
                    <p className="text-[13px] text-slate-400 font-bold">12 รายการ</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className={`relative flex items-center justify-between bg-white border-[1.5px] rounded-xl px-4 py-2.5 min-w-[240px] cursor-pointer transition-all ${showCategoryDropdown ? "border-[#0ea5e9] shadow-[0_0_0_1px_rgba(14,165,233,0.1)]" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-black text-[#0ea5e9] z-10">หมวดหมู่คำขอ</span>
                        <span className="text-[14px] font-bold text-slate-700">{selectedCategory}</span>
                        <div className={`transition-transform duration-300 ${showCategoryDropdown ? "rotate-180" : ""}`}>
                          <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>

                      {showCategoryDropdown && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowCategoryDropdown(false)}></div>
                          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top">
                            {["ทั้งหมด", "ลาหยุด", "ปฏิบัติงานนอกสถานที่", "เปลี่ยนเวลาเข้างาน", "เปลี่ยนวันหยุด", "หนังสือรับรองเงินเดือน"].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => {
                                  setSelectedCategory(cat);
                                  setShowCategoryDropdown(false);
                                }}
                                className={`w-full text-left px-5 py-3 text-[14.5px] font-bold transition-all ${selectedCategory === cat ? "bg-sky-50/70 text-[#0ea5e9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsAddingRequestType(true);
                        setAddRequestTypeTab("ประเภทคำขอ");
                      }}
                      title="เพิ่มประเภทคำขอ" 
                      className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[14px] font-black transition-all shadow-lg shadow-sky-100 hover:scale-[1.02] active:scale-95"
                    >
                      <span className="text-[20px] leading-none">+</span> เพิ่มประเภทคำขอ
                    </button>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
                            ตัวย่อ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
                            ชื่อประเภทคำขอ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
                            ชื่อประเภทคำขอ (EN) <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
                            หมวดหมู่คำขอ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase tracking-wider text-right">
                          <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-slate-600">
                            สถานะ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { abbr: "V", th: "ลาหยุดพักร้อนประจำปี", en: "Vacational Leave", cat: "ลาหยุด" },
                        { abbr: "B", th: "ลากิจ", en: "Business Leave", cat: "ลาหยุด" },
                        { abbr: "S", th: "ลาป่วย", en: "Sick Leave", cat: "ลาหยุด" },
                        { abbr: "BO", th: "ลากิจแบบไม่รับค่าจ้าง", en: "Business Leave (without pay)", cat: "ลาหยุด" },
                        { abbr: "SO", th: "ลาป่วยแบบไม่รับค่าจ้าง", en: "Sick Leave (without pay)", cat: "ลาหยุด" },
                        { abbr: "M", th: "ลาคลอด", en: "Maternity Leave", cat: "ลาหยุด" },
                        { abbr: "ML", th: "ลาฝึกวิทยากร", en: "Military Leave", cat: "ลาหยุด" },
                        { abbr: "MO", th: "ลาคลอดไม่รับค่าจ้าง", en: "Maternity Leave (without pay)", cat: "ลาหยุด" },
                        { abbr: "O", th: "ลาบวช", en: "Ordination Leave", cat: "ลาหยุด" },
                        { abbr: "WFH", th: "ทำงานที่บ้าน", en: "Work from Home", cat: "ปฏิบัติงานนอกสถานที่" },
                        { abbr: "CH", th: "เปลี่ยนวันหยุด", en: "Change Holiday", cat: "เปลี่ยนวันหยุด" },
                        { abbr: "CT", th: "เปลี่ยนเวลาเข้างาน", en: "Change Time Attendance", cat: "เปลี่ยนเวลาเข้างาน" },
                      ].filter(item => selectedCategory === "ทั้งหมด" || item.cat === selectedCategory).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                          <td className="px-6 py-5 text-[14px] font-bold text-slate-600">{item.abbr}</td>
                          <td className="px-6 py-5 text-[14px] font-bold text-slate-700">{item.th}</td>
                          <td className="px-6 py-5 text-[14px] font-bold text-slate-500">{item.en}</td>
                          <td className="px-6 py-5 text-[14px] font-bold text-slate-500">{item.cat}</td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                              <span className="text-[13px] font-black text-emerald-500">เปิดใช้งาน</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold text-slate-400">แสดง :</span>
                      <select title="จำนวนรายการต่อหน้า" className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-bold text-slate-600 outline-none cursor-pointer">
                        <option>100</option>
                        <option>50</option>
                        <option>20</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button title="หน้าแรก" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                      </button>
                      <button title="หน้าก่อนหน้า" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button title="หน้าปัจจุบัน" className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-500 text-white text-[13px] font-black shadow-md shadow-sky-100">1</button>
                      <button title="หน้าถัดไป" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                      <button title="หน้าสุดท้าย" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs for Add View */}
                <div className="bg-white border-b border-slate-100 px-8 flex items-center gap-8">
                  {["ประเภทคำขอ", "โควต้าคำขอ"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAddRequestTypeTab(tab)}
                      className={`py-4 text-[14px] font-bold border-b-2 transition-all ${addRequestTypeTab === tab ? "border-[#0ea5e9] text-[#0ea5e9]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
                  {addRequestTypeTab === "ประเภทคำขอ" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      {/* ข้อมูลขั้นพื้นฐาน */}
                      <div className="flex flex-col gap-6">
                        <h3 className="text-[17px] font-black text-slate-800">ข้อมูลขั้นพื้นฐาน</h3>
                        
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ตัวย่อ *</span>
                          <input type="text" placeholder="ระบุตัวย่อ" className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" />
                        </div>

                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ชื่อประเภท *</span>
                          <input type="text" placeholder="ระบุชื่อประเภทคำขอ" className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" />
                        </div>

                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ชื่อประเภท (EN)</span>
                          <input type="text" placeholder="ระบุชื่อภาษาอังกฤษ" className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" />
                        </div>

                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">หมวดหมู่คำขอ *</span>
                          <select title="หมวดหมู่คำขอ" className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none cursor-pointer py-1.5 appearance-none">
                            <option>เลือกหมวดหมู่</option>
                            <option>ลาหยุด</option>
                            <option>ปฏิบัติงานนอกสถานที่</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>

                      {/* รายละเอียด */}
                      <div className="flex flex-col gap-6">
                        <h3 className="text-[17px] font-black text-slate-800">รายละเอียด</h3>
                        
                        {[
                          { label: "นาทีขั้นต่ำในการลา", value: "ไม่จำกัด" },
                          { label: "จำกัดคำขอต่อสัปดาห์", value: "ไม่จำกัด" },
                          { label: "จำกัดวันลาต่อเดือน", value: "ไม่จำกัด" },
                          { label: "เงื่อนไขการสร้างคำขอ", value: "ไม่มีเงื่อนไข" },
                          { label: "ลาติดต่อกันได้ไม่เกิน", value: "ไม่จำกัด" },
                          { label: "เพศ", value: "ชาย" },
                        ].map((field) => (
                          <div key={field.label} className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                            <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">{field.label}</span>
                            <select title={field.label} className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none cursor-pointer py-1.5 appearance-none">
                              <option>{field.value}</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* เงื่อนไข */}
                      <div className="flex flex-col gap-6">
                        <h3 className="text-[17px] font-black text-slate-800">เงื่อนไข</h3>
                        
                        {[
                          { label: "ได้เบี้ยขยัน" },
                          { label: "รายเดือน ไม่ได้รับค่าจ้าง" },
                          { label: "ต้องระบุเหตุผลการลา" },
                          { label: "ต้องแนบเอกสารอนุมัติ" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-none">
                            <span className="text-[14px] font-bold text-slate-600">{item.label}</span>
                            <button title={`สลับ ${item.label}`} className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[18px] font-black text-slate-800">เงื่อนไขการรับโควต้า</h3>
                        <button className="flex items-center gap-2 bg-white border-2 border-dashed border-sky-300 text-sky-500 hover:bg-sky-50 px-5 py-2.5 rounded-xl text-[13.5px] font-black transition-all">
                          <span className="text-[18px] leading-none">+</span> เพิ่มเงื่อนไขโควต้าคำขอ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow relative group">
                          <h4 className="text-[16px] font-black text-slate-800">เงื่อนไขที่ 1</h4>
                          
                          <div className="flex flex-col gap-4">
                            {[
                              { label: "ประเภท", value: "ระดับตำแหน่ง" },
                              { label: "ระดับสิทธิ์เริ่มต้น", value: "พนักงาน" },
                              { label: "อายุงานขั้นต่ำ", value: "ไม่จำกัด" },
                              { label: "จำนวนวันลา", value: "ไม่จำกัด" },
                              { label: "จำนวนชั่วโมง", value: "ไม่จำกัด" },
                            ].map((f) => (
                              <div key={f.label} className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col">
                                <span className="text-[10px] text-slate-400 absolute -top-2 left-3 bg-white px-1 font-bold">{f.label}</span>
                                <select title={f.label} className="w-full bg-transparent border-none text-[13px] font-black text-slate-700 outline-none cursor-pointer appearance-none">
                                  <option>{f.value}</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="bg-white border-t border-slate-100 p-6 flex items-center justify-end gap-3">
                  <button onClick={() => setIsAddingRequestType(false)} className="px-6 py-2.5 rounded-xl text-[14px] font-black text-slate-400 hover:text-slate-600 transition-colors">ยกเลิก</button>
                  <button onClick={() => setIsAddingRequestType(false)} className="px-8 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl text-[14px] font-black transition-all shadow-lg shadow-sky-100">บันทึกข้อมูล</button>
                </div>
              </div>
            )}
          </div>
        ) : activeSubPage === "locations" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300 bg-[#F8FAFC]">
            {/* Breadcrumb / Header */}
            <div className="px-8 py-4 bg-white border-b border-slate-200/60 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center text-[13px] text-slate-400 gap-2">
                <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-sky-600 transition-colors cursor-pointer font-medium">ตั้งค่า</button>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold">สถานที่ทำงาน</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="bg-white border-b border-slate-100 px-8 flex items-center gap-8">
                {["ตั้งค่าสถานที่ทำงาน", "ประวัติคำสั่งอุปกรณ์"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLocationsTab(tab)}
                    className={`py-4 text-[14px] font-bold border-b-2 transition-all ${locationsTab === tab ? "border-[#0ea5e9] text-[#0ea5e9]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                {locationsTab === "ตั้งค่าสถานที่ทำงาน" ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative group max-w-xs w-full">
                        <input 
                          type="text" 
                          placeholder="ค้นหาสถานที่ทำงาน" 
                          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" 
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      
                      <button 
                        onClick={() => setLocationModal(true)}
                        className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[14px] font-black transition-all shadow-lg shadow-sky-100"
                      >
                        <span className="text-[18px] leading-none">+</span> เพิ่มสถานที่ทำงาน
                      </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">ลำดับ</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">ชื่อสถานที่/ชื่ออุปกรณ์</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">รายละเอียด</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">ประเภทการลงเวลา</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">ประเภทสถานที่</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">สถานะ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {[
                            { name: "บริษัท เอชอาร์ ซอฟต์ จำกัด", detail: "รัศมี 100 ม.", type: "GPS", locType: "ออฟฟิศ", icon: "📍" },
                            { name: "ZKT", detail: "111111111111", type: "เครื่องสแกนนิ้ว", locType: "ออฟฟิศ", icon: "🧬", statusMsg: "ยังไม่ได้เชื่อมต่อ" },
                            { name: "WFH", detail: "รัศมี 100 ม.", type: "GPS", locType: "นอกสถานที่", icon: "🏠" },
                            { name: "QR Code", detail: "-", type: "สแกน QR Code", locType: "ออฟฟิศ", icon: "📱" },
                          ].map((loc, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-all cursor-pointer">
                              <td className="px-6 py-5 text-[14px] font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[14px] font-bold text-slate-700">{loc.name}</span>
                                  {loc.statusMsg && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full w-fit">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                      {loc.statusMsg}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-5 text-[14px] font-bold text-slate-500">{loc.detail}</td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-[14px] font-bold text-indigo-500">
                                  <span className="opacity-70">{loc.icon}</span>
                                  {loc.type}
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-[14px] font-bold text-slate-500">
                                  <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                  {loc.locType}
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                  <span className="text-[12px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">เปิดใช้งาน</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col min-w-[180px]">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">หมายเลข SN</span>
                          <select title="หมายเลข SN" className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none cursor-pointer py-1.5 appearance-none">
                            <option>ZKT</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>

                        <div className="relative flex-1 min-w-[300px]">
                          <input 
                            type="text" 
                            placeholder="ค้นหาชื่ออุปกรณ์, รหัสพนักงาน..." 
                            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all shadow-sm" 
                          />
                          <svg className="w-5 h-5 text-slate-300 absolute right-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <div className="relative min-w-[200px]">
                          <div 
                            onClick={() => setShowDeviceCommandDropdown(!showDeviceCommandDropdown)}
                            className={`relative flex items-center justify-between bg-white border-[1.5px] rounded-xl px-4 py-2.5 cursor-pointer transition-all ${showDeviceCommandDropdown ? "border-[#0ea5e9] shadow-[0_0_0_1px_rgba(14,165,233,0.1)]" : "border-slate-200 hover:border-slate-300"}`}
                          >
                            <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-black text-[#0ea5e9] z-10">คำสั่ง</span>
                            <span className="text-[14px] font-bold text-slate-700">{selectedDeviceCommand}</span>
                            <div className={`transition-transform duration-300 ${showDeviceCommandDropdown ? "rotate-180" : ""}`}>
                              <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </div>
                          </div>
                          {showDeviceCommandDropdown && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setShowDeviceCommandDropdown(false)}></div>
                              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top">
                                {["คำสั่งทั้งหมด", "ซิงค์พนักงาน", "ลบพนักงาน", "นำเข้าประวัติ"].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => { setSelectedDeviceCommand(opt); setShowDeviceCommandDropdown(false); }}
                                    className={`w-full text-left px-5 py-3 text-[14.5px] font-bold transition-all ${selectedDeviceCommand === opt ? "bg-sky-50/70 text-[#0ea5e9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="relative min-w-[180px]">
                          <div 
                            onClick={() => setShowDeviceStatusDropdown(!showDeviceStatusDropdown)}
                            className={`relative flex items-center justify-between bg-white border-[1.5px] rounded-xl px-4 py-2.5 cursor-pointer transition-all ${showDeviceStatusDropdown ? "border-[#0ea5e9] shadow-[0_0_0_1px_rgba(14,165,233,0.1)]" : "border-slate-200 hover:border-slate-300"}`}
                          >
                            <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-black text-[#0ea5e9] z-10">สถานะ</span>
                            <span className="text-[14px] font-bold text-slate-700">{selectedDeviceStatus}</span>
                            <div className={`transition-transform duration-300 ${showDeviceStatusDropdown ? "rotate-180" : ""}`}>
                              <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </div>
                          </div>
                          {showDeviceStatusDropdown && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setShowDeviceStatusDropdown(false)}></div>
                              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top">
                                {["ทุกสถานะ", "รอดำเนินการ", "สำเร็จ"].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => { setSelectedDeviceStatus(opt); setShowDeviceStatusDropdown(false); }}
                                    className={`w-full text-left px-5 py-3 text-[14.5px] font-bold transition-all ${selectedDeviceStatus === opt ? "bg-sky-50/70 text-[#0ea5e9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">ลำดับ</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">คำสั่ง</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">รายละเอียดคำสั่ง</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">สถานะ</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">วันที่ส่ง</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">วันที่ตอบกลับ</th>
                            <th className="px-6 py-4 text-[12px] font-black text-slate-400 uppercase">สร้างเมื่อ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={7} className="px-6 py-32 text-center">
                              <div className="flex flex-col items-center gap-2 opacity-20">
                                <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                <span className="text-[16px] font-bold text-slate-400 uppercase tracking-widest">ไม่พบข้อมูลคำสั่ง</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Pagination for History */}
                      <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-bold text-slate-400">แสดง :</span>
                          <select title="แสดงจำนวนรายการ" className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-bold text-slate-600 outline-none cursor-pointer">
                            <option>50</option>
                            <option>100</option>
                            <option>20</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button title="หน้าแรก" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                          </button>
                          <button title="หน้าก่อนหน้า" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                          <button title="หน้าถัดไป" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                          <button title="หน้าสุดท้าย" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add Location Modal */}
            {locationModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setLocationModal(false)}></div>
                <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[20px] font-black text-slate-800">เพิ่มสถานที่ทำงาน</h3>
                    <button title="ปิดหน้าต่าง" onClick={() => setLocationModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {/* Form Fields */}
                      <div className="relative">
                        <div 
                          onClick={() => setLocTimeTypeDropdown(!locTimeTypeDropdown)}
                          className={`relative flex items-center justify-between bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all ${locTimeTypeDropdown ? "border-[#0ea5e9] shadow-[0_0_0_1px_rgba(14,165,233,0.1)]" : "border-slate-200 hover:border-sky-500"}`}
                        >
                          <span className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium transition-colors ${locTimeTypeDropdown ? "text-[#0ea5e9]" : "text-slate-400"}`}>ประเภทการลงเวลา *</span>
                          <span className="text-[14px] font-bold text-slate-700">{selectedLocTimeType}</span>
                          <div className={`transition-transform duration-300 text-slate-400 ${locTimeTypeDropdown ? "rotate-180" : ""}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </div>
                        </div>
                        {locTimeTypeDropdown && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setLocTimeTypeDropdown(false)}></div>
                            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top">
                              {["GPS", "เครื่องสแกนนิ้ว", "เครื่องบีคอน", "กล้องวงจรปิด Hikvision", "สแกน QR Code"].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => { setSelectedLocTimeType(opt); setLocTimeTypeDropdown(false); }}
                                  className={`w-full text-left px-5 py-3 text-[14.5px] font-bold transition-all ${selectedLocTimeType === opt ? "bg-sky-50/70 text-[#0ea5e9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="relative">
                        <div 
                          onClick={() => setLocPlaceTypeDropdown(!locPlaceTypeDropdown)}
                          className={`relative flex items-center justify-between bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all ${locPlaceTypeDropdown ? "border-[#0ea5e9] shadow-[0_0_0_1px_rgba(14,165,233,0.1)]" : "border-slate-200 hover:border-sky-500"}`}
                        >
                          <span className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium transition-colors ${locPlaceTypeDropdown ? "text-[#0ea5e9]" : "text-slate-400"}`}>ประเภทสถานที่ *</span>
                          <span className="text-[14px] font-bold text-slate-700">{selectedLocPlaceType}</span>
                          <div className={`transition-transform duration-300 text-slate-400 ${locPlaceTypeDropdown ? "rotate-180" : ""}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </div>
                        </div>
                        {locPlaceTypeDropdown && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setLocPlaceTypeDropdown(false)}></div>
                            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top">
                              {["ออฟฟิศ", "นอกสถานที่"].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => { setSelectedLocPlaceType(opt); setLocPlaceTypeDropdown(false); }}
                                  className={`w-full text-left px-5 py-3 text-[14.5px] font-bold transition-all ${selectedLocPlaceType === opt ? "bg-sky-50/70 text-[#0ea5e9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex flex-col focus-within:border-sky-500 transition-colors">
                        <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ชื่อสถานที่ *</span>
                        <input type="text" placeholder="ระบุชื่อสถานที่" className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" />
                      </div>

                      <div className="relative">
                        <div 
                          onClick={() => setLocConditionDropdown(!locConditionDropdown)}
                          className={`relative flex items-center justify-between bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all ${locConditionDropdown ? "border-[#0ea5e9] shadow-[0_0_0_1px_rgba(14,165,233,0.1)]" : "border-slate-200 hover:border-sky-500"}`}
                        >
                          <span className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium transition-colors ${locConditionDropdown ? "text-[#0ea5e9]" : "text-slate-400"}`}>เงื่อนไขการสร้างคำขอเข้างาน *</span>
                          <span className="text-[14px] font-bold text-slate-700">{selectedLocCondition}</span>
                          <div className={`transition-transform duration-300 text-slate-400 ${locConditionDropdown ? "rotate-180" : ""}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </div>
                        </div>
                        {locConditionDropdown && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setLocConditionDropdown(false)}></div>
                            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top">
                              {["ไม่มีเงื่อนไข", "ต้องสร้างคำขอก่อน", "อนุญาตให้สร้างคำขอย้อนหลัง"].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => { setSelectedLocCondition(opt); setLocConditionDropdown(false); }}
                                  className={`w-full text-left px-5 py-3 text-[14.5px] font-bold transition-all ${selectedLocCondition === opt ? "bg-sky-50/70 text-[#0ea5e9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="col-span-2 relative border border-slate-200 rounded-xl px-4 py-2 bg-white flex items-center justify-between focus-within:border-sky-500 transition-colors">
                        <div className="flex flex-col flex-1">
                          <span className="text-[11px] text-slate-400 absolute -top-2.5 left-3 bg-white px-1 font-medium">ละติจูด, ลองจิจูด *</span>
                          <input type="text" placeholder="ค้นหาพิกัด หรือระบุ ละติจูด, ลองจิจูด" className="w-full bg-transparent border-none text-[14px] font-bold text-slate-700 outline-none py-1.5" />
                        </div>
                        <button title="ดูข้อมูลช่วยเหลือ" className="text-slate-300 hover:text-sky-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      </div>

                      <div className="col-span-2 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-slate-500">รัศมี</span>
                          <span className="text-[14px] font-black text-slate-400">100 เมตร</span>
                        </div>
                        <div className="relative h-6 flex items-center">
                          <div className="absolute inset-0 h-1.5 my-auto bg-sky-100 rounded-full"></div>
                          <div className="absolute inset-0 h-1.5 my-auto bg-sky-500 rounded-full w-[20%]"></div>
                          <div className="absolute left-[20%] w-5 h-5 bg-white border-2 border-sky-500 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                        </div>
                        <span className="text-[11px] font-bold text-[#0ea5e9]">*กำหนดระยะของรัศมีไม่เกิน 5,000 เมตร</span>
                      </div>

                      <div className="col-span-2 flex items-center gap-3">
                        <input title="เปิดใช้งานการจำกัดรัศมี" type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                        <span className="text-[13.5px] font-bold text-slate-600">ลงเวลาเข้า-ออกงาน ภายในรัศมีที่กำหนดเท่านั้น</span>
                      </div>

                      <div className="col-span-2 flex flex-col gap-4">
                        <span className="text-[13px] font-black text-slate-800">ใช้สำหรับ</span>
                        <div className="grid grid-cols-2 gap-4">
                          {["เข้างาน", "พักเบรก", "ออกงาน", "ออกเบรก"].map(item => (
                            <div key={item} className="flex items-center gap-3">
                              <input title={`ใช้สำหรับ ${item}`} type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                              <span className="text-[14px] font-bold text-slate-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Employee Selection Section */}
                      <div className="col-span-2 flex flex-col gap-6 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-[16px] font-black text-slate-800">เลือกพนักงาน</span>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                              <button className="px-5 py-1.5 rounded-lg text-[13px] font-bold transition-all bg-white text-slate-700 shadow-sm">พนักงานทุกคน</button>
                              <button className="px-5 py-1.5 rounded-lg text-[13px] font-bold transition-all text-slate-400 hover:text-slate-600">กำหนดเอง</button>
                            </div>
                          </div>
                          <div className="relative">
                            <span className="absolute -top-2.5 right-2 bg-white px-1.5 text-[9px] font-black text-slate-400 z-10 border border-slate-100 rounded-sm">สถานะพนักงาน</span>
                            <select title="สถานะพนักงาน" className="bg-white border border-slate-200 rounded-xl px-4 py-1.5 text-[13px] font-bold text-slate-600 outline-none pr-8 appearance-none">
                              <option>ปัจจุบัน</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <input type="text" placeholder="รหัสพนักงาน, ชื่อ" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-10 py-2.5 text-[13.5px] font-bold text-slate-600 outline-none focus:bg-white focus:border-sky-300 transition-all" />
                          <svg className="w-4.5 h-4.5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)] bg-slate-50/30">
                          <div className="flex items-center justify-between px-6 py-3 bg-slate-100/50 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                              <input title="เลือกทั้งหมด" type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300" />
                              <span className="text-[12px] font-black text-slate-400 uppercase">รหัส</span>
                              <span className="text-[12px] font-black text-slate-400 uppercase">ชื่อพนักงาน</span>
                            </div>
                            <span className="text-[11px] font-black text-slate-400">พนักงาน 9 คน</span>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {[
                              { id: "2400001", name: "กิตติมา พาณุเวช (เจ้าของบริษัท)", isVIP: true },
                              { id: "2400002", name: "(ตั้ม) เจษฎากร ผลดี" },
                              { id: "2400003", name: "(จิ๊บ) จิตนันท์ โปตานนท์" },
                              { id: "2400004", name: "(ซานิ) ภัทรนันท์ พงศ์วินิช" },
                              { id: "2400005", name: "(กิต) กิตติพงศ์ พัฒนวิจิตร" },
                            ].map((emp) => (
                              <div key={emp.id} className="flex items-center px-6 py-3 hover:bg-white transition-colors border-b border-slate-50 last:border-none">
                                <div className="flex items-center gap-4 flex-1">
                                  <input title={`เลือก ${emp.name}`} type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300" />
                                  <span className="text-[13px] font-bold text-slate-500 w-20">{emp.id}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-[18px]">
                                      {emp.isVIP ? "👸" : "👤"}
                                    </div>
                                    <span className="text-[13.5px] font-bold text-slate-700">{emp.name}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button onClick={() => setLocationModal(false)} className="w-full sm:w-auto px-12 py-3 bg-[#bae6fd] text-white rounded-xl text-[16px] font-black cursor-not-allowed">สร้าง</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeSubPage === "roles" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
              <h2 className="text-[24px] font-black text-slate-800 tracking-tight">บทบาท</h2>
            </div>

            <div className="p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
              {/* Filter Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative max-w-sm w-full group">
                    <input 
                      type="text" 
                      placeholder="ค้นหา" 
                      className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-[15px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative min-w-[160px] group">
                    <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-black text-slate-400 z-10 border border-slate-100 rounded-sm group-focus-within:text-sky-500 transition-colors">สถานะ</span>
                    <select title="สถานะ" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14.5px] font-bold text-slate-700 outline-none focus:border-sky-400 transition-all appearance-none cursor-pointer">
                      <option>ใช้งาน</option>
                      <option>ทั้งหมด</option>
                      <option>ปิดใช้งาน</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  <button 
                    onClick={() => setRoleModal(true)}
                    className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-7 py-3 rounded-xl text-[15px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95"
                  >
                    <span className="text-[20px] leading-none">+</span> เพิ่มบทบาท
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[14.5px] font-black text-slate-400 ml-1">5 รายการ</span>
                
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-wider w-24">
                          ลำดับ <span className="ml-1 text-[11px] opacity-30">↑</span>
                        </th>
                        <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-wider w-64">
                          ชื่อ <span className="ml-1 text-[11px] opacity-30">↑</span>
                        </th>
                        <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-wider">
                          คำอธิบาย <span className="ml-1 text-[11px] opacity-30">↑</span>
                        </th>
                        <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-wider w-40 text-right">
                          สถานะ <span className="ml-1 text-[11px] opacity-30">↑</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { id: 1, name: "Owner", desc: "เจ้าของบริษัท จัดการได้ทุกอย่าง", active: true },
                        { id: 2, name: "Administrator", desc: "ผู้ดูแลระบบ", active: true },
                        { id: 3, name: "Manager", desc: "เมเนเจอร์", active: true },
                        { id: 4, name: "Hr", desc: "พนักงานจัดการ ทรัพยากรมนุษย์", active: true },
                        { id: 5, name: "Staff", desc: "พนักงานทั่วไป ทุกคนจะถือสิทธิ์นี้โดยอัตโนมัติ", active: true }
                      ].map((role) => (
                        <tr key={role.id} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                          <td className="px-8 py-6 text-[15px] font-bold text-slate-400">{role.id}</td>
                          <td className="px-8 py-6">
                            <span className="text-[15.5px] font-black text-slate-700 group-hover:text-sky-600 transition-colors">{role.name}</span>
                          </td>
                          <td className="px-8 py-6 text-[15px] font-bold text-slate-500 leading-relaxed">{role.desc}</td>
                          <td className="px-8 py-6 text-right">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 text-[13px] font-black border border-emerald-100/50 shadow-sm shadow-emerald-50/50">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              เปิดใช้งาน
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>



        ) : activeSubPage === "login_users" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
              <h2 className="text-[24px] font-black text-slate-800 tracking-tight">ข้อมูลผู้ใช้</h2>
            </div>

            <div className="p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
              {/* Filter Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-4 flex-1">
                  <div className="relative max-w-sm w-full group">
                    <input 
                      type="text" 
                      placeholder="ค้นหาผู้ใช้" 
                      className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[14.5px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-black text-slate-400 ml-1">พนักงาน 9 คน</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Role Filter */}
                  <div className="relative min-w-[180px] group">
                    <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-black text-[#0ea5e9] z-10 border border-sky-100 rounded-sm">บทบาท</span>
                    <select title="บทบาท" className="w-full bg-white border-[1.5px] border-[#0ea5e9] rounded-xl px-4 py-2.5 text-[14.5px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-50 transition-all appearance-none cursor-pointer">
                      <option>ทั้งหมด</option>
                      <option>Owner</option>
                      <option>Administrator</option>
                      <option>Manager</option>
                      <option>Hr</option>
                      <option>Staff</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#0ea5e9]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  {/* Employment Status Filter */}
                  <div className="relative min-w-[180px] group">
                    <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-black text-slate-400 z-10 border border-slate-100 rounded-sm group-focus-within:text-sky-500 transition-colors">สถานะการจ้าง</span>
                    <select title="สถานะการจ้าง" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14.5px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all appearance-none cursor-pointer">
                      <option>ทั้งหมด</option>
                      <option>ใช้งาน</option>
                      <option>ไม่ได้ใช้งาน</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Table */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">
                        ชื่อ-นามสกุล <span className="ml-1 text-[11px] opacity-30">↑</span>
                      </th>
                      <th className="px-8 py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">
                        อีเมล <span className="ml-1 text-[11px] opacity-30">↑</span>
                      </th>
                      <th className="px-8 py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">
                        หมายเลขโทรศัพท์ <span className="ml-1 text-[11px] opacity-30">↑</span>
                      </th>
                      <th className="px-8 py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">
                        บทบาท
                      </th>
                      <th className="px-8 py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider text-right">
                        สถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: "กิตติมา พาณุเวช (เจ้าของบริษัท)", nickname: "", email: "titl.tana@gmail.com", phone: "015-326-1788", role: "Owner", active: true, isVIP: true },
                      { name: "เจษฎากร ผลดี", nickname: "ตั้ม", email: "krisbadinn.hr@hotmail.com", phone: "016-554-3905", role: "Staff", active: true },
                      { name: "จิตนันท์ โปตานนท์", nickname: "จิ๊บ", email: "jittanan.p.hr@gmail.com", phone: "016-748-9253", role: "Staff", active: true },
                      { name: "ภัทรนันท์ พงศ์วินิช", nickname: "ซานิ", email: "patara.p.hr@gmail.com", phone: "015-478-2987", role: "Staff", active: true },
                      { name: "กิตติพงศ์ พัฒนวิจิตร", nickname: "กิต", email: "kittipong.p.hr@gmail.com", phone: "018-765-2987", role: "Staff", active: true },
                      { name: "นฤมล พรจิต", nickname: "น้ำใส", email: "narueon.pj.hr@gmail.com", phone: "018-756-9840", role: "Staff", active: true },
                      { name: "ศิวะกร อำไพรพงษ์ (หัวหน้างาน)", nickname: "กร", email: "sivahron.hr@gmail.com", phone: "015-472-8936", role: "Administrator", active: true },
                      { name: "อิทธิพงศ์ พงศ์วินิช", nickname: "ป๊อบ", email: "aitipong.hr@hotmail.com", phone: "014-678-6453", role: "Staff", active: true },
                      { name: "นันธิดา นาร่อง", nickname: "พลอย", email: "pospos.com@gmail.com", phone: "063-747-7943", role: "Staff", active: true },
                    ].map((user, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-[20px]">
                                {user.isVIP ? "👸" : "👤"}
                              </div>
                              {user.isVIP && (
                                <div className="absolute -top-1.5 -left-1 text-[14px]">👑</div>
                              )}
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-sky-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[14.5px] font-black text-slate-700 group-hover:text-sky-600 transition-colors">{user.name}</span>
                              {user.nickname && <span className="text-[12px] font-bold text-slate-400">{user.nickname}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-[14px] font-bold text-slate-500">{user.email}</td>
                        <td className="px-8 py-5 text-[14px] font-bold text-slate-500">{user.phone}</td>
                        <td className="px-8 py-5 text-[14px] font-bold text-slate-600">{user.role}</td>
                        <td className="px-8 py-5 text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[11px] font-black border border-emerald-100/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            เปิดใช้งาน
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-black text-slate-400">แสดง :</span>
                    <div className="relative">
                      <select title="จำนวนรายการต่อหน้า" className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-black text-slate-600 outline-none cursor-pointer pr-8 appearance-none">
                        <option>50</option>
                        <option>100</option>
                        <option>20</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button title="หน้าแรก" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    </button>
                    <button title="หน้าก่อนหน้า" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-500 text-white text-[13px] font-black shadow-md shadow-sky-100">1</button>
                    <button title="หน้าถัดไป" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button title="หน้าสุดท้าย" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubPage === "permissions" ? (
          <div className="flex flex-col min-h-full animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
              <div className="flex flex-col gap-1">
                <h2 className="text-[22px] font-black text-slate-800 tracking-tight">กำหนดสิทธิ์การใช้งาน</h2>
                <div className="flex items-center gap-2 text-[12px] text-slate-400">
                  <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-sky-600 transition-colors font-bold">ตั้งค่า</button>
                  <span className="opacity-30">/</span>
                  <span className="text-slate-900 font-bold">กำหนดสิทธิ์การใช้งาน</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sky-500 font-bold text-[13px] cursor-pointer hover:text-sky-600 transition-colors">
                <div className="w-5 h-5 rounded-full border-[1.5px] border-sky-500 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                </div>
                วิธีใช้งาน
              </div>
            </div>

            <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6">
              {/* Role Selection */}
              <div className="flex flex-col gap-2">
                <div className="relative w-full max-w-[180px]">
                  <select title="เลือกบทบาท" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all appearance-none cursor-pointer">
                    <option>Administrator</option>
                    <option>Owner</option>
                    <option>Manager</option>
                    <option>Hr</option>
                    <option>Staff</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-slate-400 ml-1">ผู้ดูแลระบบ</span>
              </div>

              {/* Permissions Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f1f5f9]/80 border-b border-slate-200">
                      <th className="px-6 py-4 text-[13px] font-bold text-slate-600">กำหนดสิทธิ์การใช้งาน</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-slate-600 text-center w-24 border-l border-slate-200">ดู</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-slate-600 text-center w-24 border-l border-slate-200">แก้ไข</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-slate-600 text-center w-24 border-l border-slate-200">ลบ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Header Row with Master Checks */}
                    <tr className="bg-slate-50/50">
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-center border-l border-slate-100">
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#1e293b] text-white">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center border-l border-slate-100">
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#1e293b] text-white">
                          <div className="w-2.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center border-l border-slate-100">
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#1e293b] text-white">
                          <div className="w-2.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                      </td>
                    </tr>

                    {[
                      { id: 1, name: "โปรไฟล์ส่วนตัว", desc: "จัดการข้อมูลโปรไฟล์ส่วนตัว", v: "dash", e: "dash", d: null },
                      { id: 2, name: "ลงเวลาเข้างาน", desc: "เข้าถึงเมนู ลงเวลาเข้างาน", v: "dash", e: "dash", d: null },
                      { id: 3, name: "คิวอาร์โค้ด", desc: "เข้าถึงเมนูสร้างคิวอาร์โค้ด สำหรับการลงเวลาเข้างาน", v: "check", e: null, d: null },
                      { id: 4, name: "ประวัติการเข้างาน", desc: "เข้าถึงข้อมูลประวัติการเข้างาน", v: "dash", e: "dash", d: null },
                      { id: 5, name: "คำขอเอกสาร", desc: "จัดการคำขอเอกสาร สร้างเอกสารต่างๆ", v: "dash", e: "dash", d: "dash" },
                      { id: 6, name: "แดชบอร์ดการเข้างาน", desc: "จัดการข้อมูลการเข้างานของพนักงาน", v: "check", e: "check", d: "check" },
                      { id: 7, name: "จัดการข้อมูลพนักงาน", desc: "จัดการข้อมูลพนักงาน การจ้างงาน กะการทำงานเป็นต้น", v: "check", e: "check", d: "check" },
                      { id: 8, name: "ตารางการทำงาน", desc: "จัดการตารางการทำงาน เปลี่ยนกะการทำงานรายบุคคล", v: "check", e: "check", d: "check" },
                      { id: 9, name: "ปรับเงินเดือน", desc: "ปรับเงินเดือนพนักงาน ดูประวัติการปรับเงินเดือน", v: "check", e: "check", d: null },
                      { id: 10, name: "อนุมัติเอกสาร", desc: "จัดการอนุมัติเอกสารต่างๆ ของพนักงาน", v: "check", e: "check", d: "check" },
                      { id: 11, name: "สามารถมองเห็นพนักงานทุกคน ในหน้าต่างๆ", desc: "สามารถมองเห็นพนักงานทุกคน ในหน้าต่างๆ", v: "check", e: null, d: null },
                      { id: 12, name: "รายงาน", desc: "เข้าถึงข้อมูลรายงานต่างๆ", v: "check", e: "check", d: null },
                      { id: 13, name: "แพ็คเกจ", desc: "จัดการการเติมเงิน ประวัติการชำระเงิน", v: "check", e: "check", d: "check" },
                      { id: 14, name: "หน้าตั้งค่า", desc: "เข้าถึงหน้าเมนูการตั้งค่าได้", v: "check", e: "check", d: "check" },
                      { id: 15, name: "ตั้งค่าข้อมูลบริษัท", desc: "จัดการข้อมูลบริษัท เงื่อนไขนโยบายทำงานต่างๆ", v: "check", e: "check", d: null },
                      { id: 16, name: "ตั้งค่าโครงสร้างองค์กร", desc: "จัดการข้อมูลโครงสร้างองค์กร", v: "check", e: "check", d: "check" },
                      { id: 17, name: "ตั้งค่าระดับตำแหน่ง", desc: "จัดการข้อมูลระดับตำแหน่งของพนักงาน", v: "check", e: "check", d: "check" },
                      { id: 18, name: "ตั้งค่าตำแหน่ง", desc: "จัดการข้อมูลตำแหน่งของพนักงาน", v: "check", e: "check", d: "check" },
                      { id: 19, name: "ตั้งค่าแจ้งเตือนไลน์", desc: "จัดการการแจ้งเตือน การเข้างาน สร้างคำขอ สรุปข้อมูลการเข้างาน", v: "check", e: "check", d: null },
                      { id: 20, name: "ตั้งค่าเวิร์กโฟลว์", desc: "จัดการเวิร์กโฟลว์สำหรับการอนุมัติเอกสารพนักงาน", v: "check", e: "check", d: "check" },
                      { id: 21, name: "สามารถมองเห็นคำขอ ของพนักงานทุกลำดับการอนุมัติ", desc: "สามารถมองเห็นคำขอ ของพนักงานทุกลำดับการอนุมัติ", v: "check", e: null, d: null },
                      { id: 22, name: "ตั้งค่ากะการทำงาน", desc: "จัดการข้อมูลกะการทำงาน", v: "check", e: "check", d: "check" },
                      { id: 23, name: "ตั้งค่าปฏิทินวันหยุด", desc: "จัดการข้อมูลปฏิทินวันหยุดของพนักงาน", v: "check", e: "check", d: "check" },
                      { id: 24, name: "ตั้งค่าการลา", desc: "จัดการข้อมูลการลาของพนักงาน ประเภทการลา", v: "check", e: "check", d: "check" },
                      { id: 25, name: "ตั้งค่าสถานที่ทำงาน", desc: "จัดการสถานที่ทำงาน พิกัดการลงเวลาเข้างาน", v: "check", e: "check", d: "check" },
                      { id: 26, name: "ตำแหน่งที่ตั้งของพนักงาน", desc: "จัดการตำแหน่งที่ตั้งของพนักงาน สำหรับการลงเวลาเข้างาน WFH", v: "check", e: "check", d: "check" },
                      { id: 27, name: "ตั้งค่าบทบาท", desc: "จัดการข้อมูลบทบาทของพนักงาน ให้มีสิทธิ์การเข้าข้อมูลต่างๆ", v: "check", e: "check", d: "check" },
                      { id: 28, name: "ตั้งค่าบัญชีผู้ใช้", desc: "จัดการข้อมูลบัญชีผู้ใช้ เช่น อีเมล รีเซ็ตรหัสผ่าน", v: "check", e: "check", d: "check" },
                      { id: 29, name: "ตั้งค่ากำหนดสิทธิ์การใช้งาน", desc: "กำหนดสิทธิ์การใช้งานให้เข้าถึงเมนูต่างๆ", v: "check", e: "check", d: null },
                      { id: 30, name: "สร้างหนังสือเตือน", desc: "จัดการ หนังสือเตือน ที่พนักงานทำผิดกฎบริษัท", v: "check", e: "check", d: "check" },
                      { id: 31, name: "นำเข้าข้อมูล", desc: "นำเข้าข้อมูลต่างๆ เช่น ลงเวลางาน, โควตาวันลา", v: "check", e: "check", d: "check" },
                      { id: 32, name: "คำนวณเงินเดือน", desc: "คำนวณเงินเดือน", v: "check", e: "check", d: "check" },
                      { id: 33, name: "เงินได้/เงินหัก", desc: "จัดการข้อมูลเงินได้/เงินหัก สำหรับคำนวณเงินเดือน", v: "check", e: "check", d: "check" },
                      { id: 34, name: "นำเข้าเงินสะสม", desc: "นำเข้าเงินสะสมประจำปี กรณีใช้ระบบคำนวณเงินเดือนระหว่างปี หรือเพิ่มพนักงานใหม่", v: "check", e: "check", d: "check" },
                      { id: 35, name: "ประวัติกิจกรรม การใช้งานระบบ", desc: "ตรวจสอบประวัติกิจกรรม การใช้งานระบบ", v: "check", e: null, d: null },
                      { id: 36, name: "สร้างประกาศ", desc: "สร้าง แก้ไข และ ลบ ประกาศเพื่อแจ้งข้อมูลต่าง ๆ แก่พนักงาน", v: "check", e: "check", d: "check" },
                      { id: 37, name: "ค่าใช้จ่าย", desc: "จัดการใช้จ่ายต่าง ๆ ของพนักงาน และเบิกเงินเดือนล่วงหน้า", v: "check", e: "check", d: "check" },
                      { id: 38, name: "ตั้งค่าเลขที่เอกสาร", desc: "จัดการข้อมูลเลขที่เอกสาร", v: "check", e: "check", d: null },
                      { id: 39, name: "จัดการข้อมูลมอบหมายงาน", desc: "จัดการข้อมูลมอบหมายงานต่างๆ", v: "check", e: "check", d: null },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-black text-slate-700">{row.id}. {row.name}</span>
                            <span className="text-[12px] font-bold text-slate-400">{row.desc}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-center border-l border-slate-50">
                          {row.v && (
                            <div className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${row.v === 'check' ? 'bg-[#1e293b] text-white' : 'bg-[#e2e8f0] text-slate-400'}`}>
                              {row.v === 'check' ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg> : <div className="w-2.5 h-0.5 bg-slate-400 rounded-full"></div>}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-center border-l border-slate-50">
                          {row.e && (
                            <div className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${row.e === 'check' ? 'bg-[#1e293b] text-white' : 'bg-[#e2e8f0] text-slate-400'}`}>
                              {row.e === 'check' ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg> : <div className="w-2.5 h-0.5 bg-slate-400 rounded-full"></div>}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-center border-l border-slate-50">
                          {row.d && (
                            <div className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${row.d === 'check' ? 'bg-[#1e293b] text-white' : 'bg-[#e2e8f0] text-slate-400'}`}>
                              {row.d === 'check' ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg> : <div className="w-2.5 h-0.5 bg-slate-400 rounded-full"></div>}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 mt-auto bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-end gap-3 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => setActiveSubPage(null)}
                className="px-6 py-2 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200"
              >
                ยกเลิก
              </button>
              <button 
                className="px-8 py-2 rounded-xl text-[14px] font-bold text-white bg-sky-400 hover:bg-sky-500 transition-all shadow-md shadow-sky-100 active:scale-95"
              >
                บันทึก
              </button>
            </div>
          </div>
        ) : activeSubPage === "emp_docs" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center text-[13px] text-slate-500 gap-2 sticky top-0 z-20">
              <button title="ย้อนกลับไปตั้งค่า" onClick={() => setActiveSubPage(null)} className="hover:text-indigo-600 transition-colors cursor-pointer">ตั้งค่า</button>
              <span>›</span>
              <span className="text-slate-800 font-bold">เอกสารพนักงาน</span>
            </div>
            <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[20px] font-black text-slate-800 tracking-tight">ประเภทเอกสารพนักงาน</h3>
                  <p className="text-[13px] text-slate-400 font-bold mt-1">กำหนดรายการเอกสารที่พนักงานต้องแนบในระบบ</p>
                </div>
                <button title="เพิ่มประเภทเอกสาร" className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-2xl text-[14px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95">
                  <span className="text-[18px] leading-none">+</span> เพิ่มประเภทเอกสาร
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: "บัตรประชาชน (ID Card)", required: true, desc: "เอกสารยืนยันตัวตนหลัก" },
                  { name: "ทะเบียนบ้าน (House Registration)", required: true, desc: "สำเนาทะเบียนบ้าน" },
                  { name: "วุฒิการศึกษา (Education Certificate)", required: false, desc: "ใบปริญญาหรือประกาศนียบัตร" },
                  { name: "ใบผ่านงาน (Experience Letter)", required: false, desc: "หนังสือรับรองการทำงานจากที่เก่า" },
                  { name: "ใบรับรองแพทย์ (Medical Certificate)", required: false, desc: "เอกสารตรวจสุขภาพก่อนเริ่มงาน" },
                ].map((doc) => (
                  <div key={doc.name} className="p-6 border border-slate-100 rounded-[32px] bg-white shadow-sm flex items-center justify-between group hover:border-sky-200 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500 transition-all">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-[16px] font-black text-slate-800">{doc.name}</h4>
                          {doc.required && (
                            <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-500 text-[10px] font-black uppercase border border-rose-100">จำเป็น</span>
                          )}
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium mt-0.5">{doc.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button title="แก้ไข" className="p-2.5 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button title="ลบ" className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeSubPage === "import_summary" ? (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-8 py-5 flex items-center justify-between border-b border-slate-50">
              <h2 className="text-[22px] font-black text-slate-800 tracking-tight">สรุปการเข้างาน</h2>
              <button title="เมนู" className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-8 py-4 flex items-center justify-end gap-3 bg-white border-b border-slate-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              {/* Year Selector */}
              <div className="relative group">
                <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black text-slate-300 group-focus-within:text-sky-500 z-10">ปี</span>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-slate-300 transition-all cursor-pointer min-w-[120px]">
                  <span className="text-[14px] font-bold text-slate-700">2569</span>
                  <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Month Selector */}
              <div className="relative group">
                <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black text-slate-300 group-focus-within:text-sky-500 z-10">เดือน</span>
                <select title="เลือกเดือน" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[14px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all appearance-none pr-10 min-w-[140px] cursor-pointer">
                  <option>ทุกเดือน</option>
                  <option>มกราคม</option>
                  <option>กุมภาพันธ์</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* Import Button */}
              <button className="flex items-center gap-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[13.5px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l4-4m-4 4l-4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                นำเข้าสรุปการเข้างานผ่าน Excel
              </button>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <div className="relative w-64 h-64 mb-6 opacity-80">
                <div className="absolute inset-0 bg-sky-50 rounded-full blur-3xl opacity-30"></div>
                <svg className="w-full h-full text-slate-100" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5Z" fillOpacity="0.4" />
                   <path d="M12 10L12 14M10 12L14 12" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
                </svg>
                {/* Illustration placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-32 h-24 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                      <div className="w-12 h-1 bg-slate-50 rounded-full"></div>
                      <div className="w-8 h-1 bg-slate-50 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-100"></div>
                   </div>
                   <div className="w-24 h-18 bg-white/60 rounded-xl mt-[-40px] ml-10 shadow-lg border border-white/80 backdrop-blur-sm"></div>
                </div>
              </div>
              <h3 className="text-[20px] font-black text-slate-300">ไม่มีข้อมูล</h3>
            </div>
          </div>
        ) : activeSubPage === "import_leave" ? (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-8 py-5 flex items-center justify-between border-b border-slate-50">
              <h2 className="text-[22px] font-black text-slate-800 tracking-tight">วันลาที่ใช้ไปแล้ว</h2>
              <button title="เมนู" className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-8 py-4 flex items-center justify-end gap-3 bg-white border-b border-slate-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              {/* Year Selector */}
              <div className="relative group">
                <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black text-slate-300 group-focus-within:text-sky-500 z-10">ปี</span>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-slate-300 transition-all cursor-pointer min-w-[120px]">
                  <span className="text-[14px] font-bold text-slate-700">2569</span>
                  <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Import Button */}
              <button className="flex items-center gap-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[13.5px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l4-4m-4 4l-4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                นำเข้าวันลาที่ใช้ไปแล้วผ่าน Excel
              </button>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <div className="relative w-64 h-64 mb-6 opacity-80">
                <div className="absolute inset-0 bg-sky-50 rounded-full blur-3xl opacity-30"></div>
                <svg className="w-full h-full text-slate-100" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5Z" fillOpacity="0.4" />
                   <path d="M12 10L12 14M10 12L14 12" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-32 h-24 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                      <div className="w-12 h-1 bg-slate-50 rounded-full"></div>
                      <div className="w-8 h-1 bg-slate-50 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-100"></div>
                   </div>
                   <div className="w-24 h-18 bg-white/60 rounded-xl mt-[-40px] ml-10 shadow-lg border border-white/80 backdrop-blur-sm"></div>
                </div>
              </div>
              <h3 className="text-[20px] font-black text-slate-300">ไม่มีข้อมูล</h3>
            </div>
          </div>
        ) : activeSubPage === "import_quota" ? (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-8 py-5 flex items-center justify-between border-b border-slate-50">
              <h2 className="text-[22px] font-black text-slate-800 tracking-tight">โควต้าวันลาสะสม</h2>
              <button title="เมนู" className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-8 py-4 flex items-center justify-end gap-3 bg-white border-b border-slate-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              {/* Year Selector */}
              <div className="relative group">
                <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black text-slate-300 group-focus-within:text-sky-500 z-10">ปี</span>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-slate-300 transition-all cursor-pointer min-w-[120px]">
                  <span className="text-[14px] font-bold text-slate-700">2569</span>
                  <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Import Button */}
              <button className="flex items-center gap-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[13.5px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l4-4m-4 4l-4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                นำเข้าโควต้าวันลาสะสมผ่าน Excel
              </button>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <div className="relative w-64 h-64 mb-6 opacity-80">
                <div className="absolute inset-0 bg-sky-50 rounded-full blur-3xl opacity-30"></div>
                <svg className="w-full h-full text-slate-100" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5Z" fillOpacity="0.4" />
                   <path d="M12 10L12 14M10 12L14 12" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-32 h-24 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                      <div className="w-12 h-1 bg-slate-50 rounded-full"></div>
                      <div className="w-8 h-1 bg-slate-50 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-100"></div>
                   </div>
                   <div className="w-24 h-18 bg-white/60 rounded-xl mt-[-40px] ml-10 shadow-lg border border-white/80 backdrop-blur-sm"></div>
                </div>
              </div>
              <h3 className="text-[20px] font-black text-slate-300">ไม่มีข้อมูล</h3>
            </div>
          </div>
        ) : activeSubPage === "emp_docs" ? (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
              <div className="flex flex-col gap-1">
                <h2 className="text-[22px] font-black text-slate-800 tracking-tight">เอกสารพนักงาน</h2>
                <p className="text-[13px] text-slate-400 font-bold">จัดการและตรวจสอบสถานะเอกสารสำคัญของพนักงาน</p>
              </div>
              <div className="flex items-center gap-3">
                <button title="เมนู" className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-slate-100">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </button>
                <button className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-xl text-[14px] font-black transition-all shadow-lg shadow-sky-100 active:scale-95">
                  <span className="text-[18px] leading-none">+</span> นำเข้าเอกสาร
                </button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center gap-4">
              <div className="relative group flex-1 max-w-sm">
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อ หรือ รหัสพนักงาน..." 
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all shadow-sm"
                />
                <svg className="w-5 h-5 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="relative group min-w-[160px]">
                <span className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black text-slate-300 group-focus-within:text-sky-500 z-10 border border-slate-50 rounded">สถานะเอกสาร</span>
                <select title="สถานะเอกสาร" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] font-bold text-slate-700 outline-none hover:border-sky-300 transition-all appearance-none cursor-pointer">
                  <option>ทั้งหมด</option>
                  <option>ครบถ้วน</option>
                  <option>ยังไม่ครบ</option>
                  <option>หมดอายุ</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">พนักงาน</th>
                    <th className="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">บัตรประชาชน</th>
                    <th className="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">ทะเบียนบ้าน</th>
                    <th className="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">วุฒิการศึกษา</th>
                    <th className="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">บัญชีธนาคาร</th>
                    <th className="px-8 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "2400001", name: "กิตติมา พาณุเวช", pos: "CEO", docs: { id: true, house: true, edu: true, bank: true } },
                    { id: "2400002", name: "เจษฎากร ผลดี", pos: "Manager", docs: { id: true, house: true, edu: false, bank: true } },
                    { id: "2400003", name: "จิตนันท์ โปตานนท์", pos: "Senior Developer", docs: { id: true, house: true, edu: true, bank: false } },
                    { id: "2400004", name: "ภัทรนันท์ พงศ์วินิช", pos: "UX/UI Designer", docs: { id: true, house: false, edu: true, bank: true } },
                    { id: "2400005", name: "กิตติพงศ์ พัฒนวิจิตร", pos: "Frontend Developer", docs: { id: true, house: true, edu: true, bank: true } },
                  ].map((emp, index) => (
                    <tr key={emp.id} className={`group hover:bg-slate-50/50 transition-colors ${index !== 4 ? "border-b border-slate-50" : ""}`}>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-[18px] border border-sky-100 group-hover:scale-110 transition-transform">
                            👤
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14.5px] font-bold text-slate-800">{emp.name}</span>
                            <span className="text-[12px] font-bold text-slate-400 uppercase">{emp.id} • {emp.pos}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {emp.docs.id ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {emp.docs.house ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {emp.docs.edu ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {emp.docs.bank ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button title="จัดการ" className="p-2.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all border border-transparent hover:border-sky-100 group/btn">
                          <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeSubPage === "reset_data" ? (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
              <h2 className="text-[22px] font-black text-slate-800 tracking-tight">รีเซ็ตข้อมูลบริษัท</h2>
              <button title="เมนู" className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" strokeWidth="2.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full text-center">
              {/* Illustration */}
              <div className="w-32 h-32 mb-8 relative">
                <div className="absolute inset-0 bg-rose-50 rounded-full blur-3xl opacity-30"></div>
                <div className="relative flex flex-col items-center justify-center translate-y-4 scale-110">
                   {/* Building Icon */}
                   <div className="relative">
                      <div className="w-20 h-24 bg-[#ffcccc] rounded-t-2xl relative overflow-hidden flex flex-col items-center pt-4 gap-2 border-x-2 border-t-2 border-[#ff9999]/30">
                         <div className="grid grid-cols-2 gap-2">
                            <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                            <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                            <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                            <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                         </div>
                      </div>
                      {/* Reset Symbol Overlay */}
                      <div className="absolute bottom-[-10px] right-[-15px] w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-rose-50">
                         <svg className="w-8 h-8 text-[#ff9999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                         </svg>
                      </div>
                   </div>
                </div>
              </div>

              <h3 className="text-[24px] font-black text-slate-800 mb-2">รีเซ็ตข้อมูลบริษัท</h3>
              <p className="text-[14.5px] text-slate-500 font-bold mb-10 leading-relaxed">การดำเนินการนี้จะรีเซ็ตข้อมูลบริษัททั้งหมดออกจากระบบ</p>

              <div className="w-full max-w-[420px] flex flex-col gap-6">
                {/* Warning */}
                <div className="flex items-start gap-3 p-5 bg-rose-50/50 rounded-[20px] border border-rose-100/50">
                  <div className="w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <p className="text-[13.5px] font-bold text-rose-500 text-left leading-relaxed">
                    เมื่อลบข้อมูลแล้วจะไม่สามารถกู้คืนได้<br />กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                  <button className="flex-1 bg-white text-slate-600 border border-slate-200 py-4.5 rounded-2xl text-[15.5px] font-black transition-all hover:bg-slate-50 active:scale-95">
                    ดูข้อมูลที่ถูกลบ
                  </button>
                  <button className="flex-1 bg-rose-500 text-white py-4.5 rounded-2xl text-[15.5px] font-black transition-all hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-100 active:scale-95">
                    รีเซ็ตข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeSubPage === "del_requests" ? (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
              <h2 className="text-[22px] font-black text-slate-800 tracking-tight">ลบข้อมูลคำขอ</h2>
              <button title="เมนู" className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" strokeWidth="2.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full text-center">
              {/* Illustration */}
              <div className="w-32 h-32 mb-8 relative">
                <div className="absolute inset-0 bg-rose-50 rounded-full blur-3xl opacity-30"></div>
                <div className="relative flex flex-col items-center justify-center translate-y-4 scale-110">
                   {/* Documents inside bin */}
                   <div className="flex gap-1 mb-[-15px] z-0 opacity-80">
                      <div className="w-6 h-8 bg-white border border-rose-100 rounded-sm shadow-sm rotate-[-15deg] flex flex-col gap-1 p-1">
                         <div className="w-3 h-0.5 bg-rose-50 rounded-full"></div>
                         <div className="w-4 h-0.5 bg-rose-50 rounded-full"></div>
                      </div>
                      <div className="w-6 h-8 bg-white border border-rose-100 rounded-sm shadow-sm rotate-[10deg] flex flex-col gap-1 p-1">
                         <div className="w-4 h-0.5 bg-rose-50 rounded-full"></div>
                         <div className="w-3 h-0.5 bg-rose-50 rounded-full"></div>
                      </div>
                   </div>
                  <div className="w-20 h-24 bg-[#ffcccc] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center gap-3 border-2 border-[#ff9999]/30 shadow-inner z-10">
                    <div className="w-1.5 h-10 bg-[#ff9999]/40 rounded-full"></div>
                    <div className="w-1.5 h-10 bg-[#ff9999]/40 rounded-full"></div>
                  </div>
                </div>
              </div>

              <h3 className="text-[24px] font-black text-slate-800 mb-2">ลบข้อมูลคำขอ</h3>
              <p className="text-[14.5px] text-slate-500 font-bold mb-10 leading-relaxed">ข้อมูลเอกสารคำขอที่เลือกจะถูกลบออกจากระบบ</p>

              <div className="w-full max-w-[420px] flex flex-col gap-6">
                {/* Select Request Type */}
                <div className="relative group text-left">
                  <select title="เลือกประเภทคำขอที่ต้องการลบ" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-[15px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all appearance-none cursor-pointer pr-12 shadow-sm">
                    <option value="all">ทั้งหมด</option>
                    <option>คำขอลา โอที ปฏิบัติงานนอกสถานที่ เปลี่ยนเวลาทำงาน</option>
                    <option>คำขอเปลี่ยนกะ</option>
                    <option>คำขอสลับกะ</option>
                    <option>คำขอค่าใช้จ่าย และ เบิกเงินเดือน</option>
                    <option>หนังสือเตือน</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-5 bg-rose-50/50 rounded-[20px] border border-rose-100/50">
                  <div className="w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <p className="text-[13.5px] font-bold text-rose-500 text-left leading-relaxed">
                    เมื่อลบข้อมูลแล้วจะไม่สามารถกู้คืนได้<br />กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                  </p>
                </div>

                {/* Delete Button */}
                <button className="w-full bg-rose-500 text-white py-4.5 rounded-2xl text-[16px] font-black transition-all hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-100 active:scale-95">
                  ลบข้อมูล
                </button>
              </div>
            </div>
          </div>
        ) : activeSubPage === "del_payroll" ? (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
              <h2 className="text-[22px] font-black text-slate-800 tracking-tight">ลบข้อมูลเงินเดือน</h2>
              <button title="เมนู" className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all border border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" strokeWidth="2.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full text-center">
              {/* Illustration */}
              <div className="w-32 h-32 mb-8 relative">
                <div className="absolute inset-0 bg-rose-50 rounded-full blur-3xl opacity-30"></div>
                <div className="relative flex flex-col items-center justify-center translate-y-4 scale-110">
                  <div className="w-16 h-16 bg-[#ff9999] rounded-full mb-[-25px] z-10 flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-white font-black text-[28px]">$</span>
                  </div>
                  <div className="w-20 h-24 bg-[#ffcccc] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center gap-3 border-2 border-[#ff9999]/30 shadow-inner">
                    <div className="w-1.5 h-10 bg-[#ff9999]/40 rounded-full"></div>
                    <div className="w-1.5 h-10 bg-[#ff9999]/40 rounded-full"></div>
                  </div>
                </div>
              </div>

              <h3 className="text-[24px] font-black text-slate-800 mb-2">ลบข้อมูลเงินเดือน</h3>
              <p className="text-[14.5px] text-slate-500 font-bold mb-10 leading-relaxed">ข้อมูลเงินงวดเงินเดือนที่เลือกจะถูกลบออกจากระบบ</p>

              <div className="w-full max-w-[420px] flex flex-col gap-6">
                {/* Select Period */}
                <div className="relative group text-left">
                  <select title="เลือกงวดที่ต้องการลบ" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-[15px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 transition-all appearance-none cursor-pointer pr-12 shadow-sm">
                    <option value="" disabled selected>เลือกงวดที่ต้องการลบ</option>
                    <option>ทั้งหมด</option>
                    <option>ปี 2568 รายเดือน เริ่มงวดแรก 01/09/2568 งวดการจ่ายเงิน 1 ครั้ง</option>
                    <option>ปี 2569 รายเดือน เริ่มงวดแรก 01/11/2569 งวดการจ่ายเงิน 1 ครั้ง</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-5 bg-rose-50/50 rounded-[20px] border border-rose-100/50">
                  <div className="w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <p className="text-[13.5px] font-bold text-rose-500 text-left leading-relaxed">
                    เมื่อลบข้อมูลแล้วจะไม่สามารถกู้คืนได้<br />กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                  </p>
                </div>

                {/* Delete Button */}
                <button className="w-full bg-sky-100 text-sky-400 py-4.5 rounded-2xl text-[16px] font-black transition-all hover:bg-rose-500 hover:text-white hover:shadow-xl hover:shadow-rose-100 active:scale-95">
                  ลบข้อมูล
                </button>
              </div>
            </div>
          </div>
        ) : activeSubPage === "import_attendance" ? (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white z-20">
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">นำเข้าเวลาเข้างาน</h2>
              <button className="flex items-center gap-2 px-4 py-1.5 border-[1.5px] border-sky-400 text-sky-500 rounded-lg hover:bg-sky-50 transition-all text-[13px] font-black">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" fill="#0EA5E9" fillOpacity="0.1" stroke="#0EA5E9" strokeWidth="1.5" />
                  <path d="M8 8L16 16M16 8L8 16" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
                </svg>
                ตัวอย่างไฟล์
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center">
              <div className="w-full max-w-[640px] flex flex-col gap-10">
                
                {/* Date Format Selection */}
                <div className="flex flex-col gap-4">
                  <label className="text-[14px] font-black text-slate-800">เลือกรูปแบบวันที่ของไฟล์ Excel</label>
                  <div className="relative group">
                    <span className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-slate-300 group-focus-within:text-sky-500 transition-colors z-10">รูปแบบฟอร์แมต</span>
                    <select title="รูปแบบวันที่" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50/50 transition-all appearance-none cursor-pointer">
                      <option>วัน-เดือน-พ.ศ.</option>
                      <option>วัน/เดือน/พ.ศ.</option>
                      <option>ค.ศ.-เดือน-วัน</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Column Selection */}
                <div className="flex flex-col gap-4">
                  <label className="text-[14px] font-black text-slate-800">คอลัมน์รหัสพนักงาน</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative group">
                      <span className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-slate-300 group-focus-within:text-sky-500 transition-colors z-10">คอลัมน์รหัสพนักงาน</span>
                      <select title="คอลัมน์รหัสพนักงาน" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50/50 transition-all appearance-none cursor-pointer">
                        <option>C</option>
                        <option>A</option>
                        <option>B</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div className="relative group">
                      <span className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-slate-300 group-focus-within:text-sky-500 transition-colors z-10">คอลัมน์วันที่</span>
                      <select title="คอลัมน์วันที่" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50/50 transition-all appearance-none cursor-pointer">
                        <option>D</option>
                        <option>E</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div className="relative group">
                      <span className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-slate-300 group-focus-within:text-sky-500 transition-colors z-10">คอลัมน์เวลา</span>
                      <select title="คอลัมน์เวลา" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50/50 transition-all appearance-none cursor-pointer">
                        <option>E</option>
                        <option>F</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-[12px] font-black text-red-500 mt-1">*รูปแบบเวลาต้องเป็นแบบ 24 ชั่วโมง เช่น 07:58 หรือ 18:02</p>
                </div>

                {/* ID Type Selection */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-5 h-5">
                      <input type="radio" name="idType" defaultChecked className="peer hidden" />
                      <div className="absolute inset-0 rounded-full border-2 border-slate-200 peer-checked:border-sky-500 transition-all group-hover:border-sky-300"></div>
                      <div className="absolute inset-0 m-1 rounded-full bg-sky-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">รหัสพนักงาน</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-5 h-5">
                      <input type="radio" name="idType" className="peer hidden" />
                      <div className="absolute inset-0 rounded-full border-2 border-slate-200 peer-checked:border-sky-500 transition-all group-hover:border-sky-300"></div>
                      <div className="absolute inset-0 m-1 rounded-full bg-sky-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">รหัสเครื่องลงเวลา</span>
                  </label>
                </div>

                {/* Drag and Drop Area */}
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/30 hover:bg-slate-50 hover:border-sky-200 transition-all py-16 px-6 flex flex-col items-center justify-center cursor-pointer group">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-[14.5px] font-black text-slate-500 group-hover:text-slate-700 transition-colors">เลือกไฟล์หรือวางไฟล์ที่นี่ (.xlsx)</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-10 px-8 animate-in fade-in duration-300">
          {activeList.length > 0 ? (
            <div className="flex flex-col">
              {activeList.map((item, index) => (
                <button
                  title={item.title}
                  key={item.id}
                  onClick={() => setActiveSubPage(item.id)}
                  className={`w-full group flex items-center gap-5 p-5 transition-all hover:bg-slate-50/80 ${
                    index !== 0 ? "border-t border-slate-100/60" : ""
                  }`}
                >
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-colors">
                    {item.icon}
                  </div>
                  
                  <div className="flex flex-col text-left flex-1 min-w-0 justify-center">
                    <h3 className="text-[14.5px] font-bold text-slate-800 mb-1 group-hover:text-indigo-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-slate-400 font-medium truncate">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 pl-4">
                    {item.flagged && (
                      <span className="text-[#F97316] text-[16px] drop-shadow-sm animate-pulse">🚩</span>
                    )}
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                 <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h2 className="text-[20px] font-bold text-slate-800 mb-2">กำลังพัฒนาส่วนตั้งค่า: {activeTab}</h2>
              <p className="text-[14px] text-slate-400">เนื้อหาส่วนนี้ยังอยู่ระหว่างการออกแบบ</p>
            </div>
          )}
        </div>
        )}
        
        {/* Role Modal */}
        {roleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setRoleModal(false)}></div>
            <div className="relative bg-white w-full max-w-[480px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 bg-white relative z-10">
                <h3 className="text-[22px] font-black text-slate-800">เพิ่มบทบาท</h3>
              </div>

              <div className="p-8 flex flex-col gap-5">
                {/* Role Name */}
                <div className="relative border border-slate-200 rounded-xl px-4 py-3 bg-white flex flex-col focus-within:border-sky-400 transition-all group">
                  <span className="text-[14px] text-slate-400 absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none transition-all group-focus-within:scale-0 group-focus-within:opacity-0 origin-left">
                    {newRoleName === "" && "ชื่อ *"}
                  </span>
                  <input 
                    type="text" 
                    title="ชื่อบทบาท"
                    placeholder="ชื่อ *"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full bg-transparent border-none text-[15px] font-bold text-slate-700 outline-none" 
                  />
                </div>

                {/* Description TH */}
                <div className="relative border border-slate-200 rounded-xl px-4 py-3 bg-white flex flex-col focus-within:border-sky-400 transition-all group min-h-[100px]">
                  <span className="text-[14px] text-slate-400 absolute top-4 left-4 pointer-events-none transition-all group-focus-within:scale-0 group-focus-within:opacity-0 origin-left">
                    {newRoleDesc === "" && "คำอธิบาย *"}
                  </span>
                  <textarea 
                    title="คำอธิบาย"
                    placeholder="คำอธิบาย *"
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border-none text-[15px] font-bold text-slate-700 outline-none resize-none" 
                  />
                </div>

                {/* Description EN */}
                <div className="relative border border-slate-200 rounded-xl px-4 py-3 bg-white flex flex-col focus-within:border-sky-400 transition-all group min-h-[100px]">
                  <span className="text-[14px] text-slate-400 absolute top-4 left-4 pointer-events-none transition-all group-focus-within:scale-0 group-focus-within:opacity-0 origin-left">
                    {newRoleDescEn === "" && "คำอธิบาย (EN) *"}
                  </span>
                  <textarea 
                    title="คำอธิบาย (EN)"
                    placeholder="คำอธิบาย (EN) *"
                    value={newRoleDescEn}
                    onChange={(e) => setNewRoleDescEn(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border-none text-[15px] font-bold text-slate-700 outline-none resize-none" 
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-bold text-slate-700">ใช้งาน</span>
                  {roleActive ? (
                    <button 
                      role="switch"
                      aria-checked="true"
                      title="ปิดการใช้งาน"
                      onClick={() => setRoleActive(false)}
                      className="relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner bg-emerald-500"
                    >
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm translate-x-6"></div>
                    </button>
                  ) : (
                    <button 
                      role="switch"
                      aria-checked="false"
                      title="เปิดการใช้งาน"
                      onClick={() => setRoleActive(true)}
                      className="relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner bg-slate-200"
                    >
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm translate-x-0"></div>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white flex justify-end">
                <button 
                  onClick={() => {
                    setRoleModal(false);
                    setNewRoleName("");
                    setNewRoleDesc("");
                    setNewRoleDescEn("");
                  }} 
                  className="px-8 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl text-[16px] font-black transition-all shadow-lg shadow-sky-100"
                >
                  สร้าง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
