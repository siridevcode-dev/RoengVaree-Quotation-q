"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext, BoatSpecification } from "@/context/AppContext";

export default function Settings() {
  const { settings, updateSettings, resetAllData, currentUser, updateBoatSpecification } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Initialize Profile using currentUser
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || settings.profile.name || "",
    username: currentUser?.username || settings.profile.username || "",
    email: currentUser?.email || settings.profile.email || "",
    phone: currentUser?.phone || settings.profile.phone || "",
    position: currentUser?.position || currentUser?.role || settings.profile.position || "",
    role: currentUser?.role || "Editor",
    status: currentUser?.status || "Active",
    password: "",
    confirmPassword: "",
  });

  // Local state for other settings to avoid immediate API calls on every keystroke
  const [companyData, setCompanyData] = useState(settings.companySettings);
  const [quotationData, setQuotationData] = useState(settings.quotationSettings);
  const [notificationsData, setNotificationsData] = useState(settings.notifications);

  // Sync profile data if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData(prev => ({
        ...prev,
        name: currentUser.name || "",
        username: currentUser.username || "",
        email: currentUser.email || settings.profile.email || "",
        phone: currentUser.phone || "",
        position: currentUser.position || currentUser.role || settings.profile.position || "",
        role: currentUser.role || "Editor",
        status: currentUser.status || "Active",
      }));
    }
  }, [currentUser, settings.profile]);
  
  // Sync states if settings change (e.g. from refreshData)
  useEffect(() => {
    setCompanyData(settings.companySettings);
    setQuotationData(settings.quotationSettings);
    setNotificationsData(settings.notifications);
  }, [settings.companySettings, settings.quotationSettings, settings.notifications]);

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      if (activeTab === "profile") {
        if (profileData.password && profileData.password !== profileData.confirmPassword) {
          alert("รหัสผ่านไม่ตรงกัน");
          return;
        }
      }

      const updates: any = {
        companySettings: companyData,
        quotationSettings: quotationData,
        notifications: notificationsData,
      };

      if (activeTab === "profile" && currentUser) {
        // We include EVERYTHING the API expects to avoid downgrading role/status
        updates.profile = {
          ...profileData,
          role: currentUser.role,
          status: currentUser.status
        };
      }

      await updateSettings(updates);
      
      // Clear passwords after save
      if (activeTab === "profile") {
        setProfileData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      alert(err.message || "ไม่สามารถบันทึกการตั้งค่าได้");
    }
  };

  const tabs = [
    { id: "profile", label: "โปรไฟล์", icon: "👤" },
    { id: "company", label: "ข้อมูลบริษัท", icon: "🏢" },
    { id: "quotation", label: "ตั้งค่าใบเสนอราคา", icon: "📄" },
    { id: "specifications", label: "ข้อมูลเรือ (Specs)", icon: "🚤" },
    { id: "notifications", label: "การแจ้งเตือน", icon: "🔔" },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1000px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">ตั้งค่า</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการการตั้งค่าระบบ</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 md:flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.length > 8 ? tab.label.substring(0, 6) + '...' : tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-800">ข้อมูลส่วนตัว</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : "?"}
                </div>
                <button className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-all">เปลี่ยนรูปภาพ</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ชื่อ-สกุล</label>
                  <input type="text" value={profileData.name || ""} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Username (ชื่อผู้ใช้)</label>
                  <input type="text" value={profileData.username || ""} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">อีเมล</label>
                  <input type="email" value={profileData.email || ""} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">เบอร์โทร</label>
                  <input type="tel" value={profileData.phone || ""} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ตำแหน่ง</label>
                  <input type="text" value={profileData.position || ""} onChange={(e) => setProfileData({ ...profileData, position: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <label className="text-sm font-bold text-gray-700">เปลี่ยนรหัสผ่าน</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" placeholder="รหัสผ่านใหม่" value={profileData.password} onChange={(e) => setProfileData({ ...profileData, password: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                  <input type="password" placeholder="ยืนยันรหัสผ่านใหม่" value={profileData.confirmPassword} onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <p className="text-[11px] text-gray-400 mt-2">* เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน</p>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === "company" && (
            <div className="p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-800">ข้อมูลบริษัท</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ชื่อบริษัท</label>
                  <input type="text" value={companyData.name || ""} onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">เลขประจำตัวผู้เสียภาษี</label>
                  <input type="text" value={companyData.taxId || ""} onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">เบอร์โทร</label>
                  <input type="text" value={companyData.phone || ""} onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ที่อยู่</label>
                  <textarea value={companyData.address || ""} onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })} rows={2} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">อีเมล</label>
                  <input type="email" value={companyData.email || ""} onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">เว็บไซต์</label>
                  <input type="text" value={companyData.website || ""} onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
              </div>
            </div>
          )}

          {/* Quotation Settings Tab */}
          {activeTab === "quotation" && (
            <div className="p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-800">ตั้งค่าใบเสนอราคา</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">คำนำหน้าเลขที่</label>
                  <input type="text" value={quotationData.prefix || ""} onChange={(e) => setQuotationData({ ...quotationData, prefix: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                  <p className="text-[10px] text-gray-400 mt-1">ตัวอย่าง: ใส่ "Q2026-4-" ระบบจะต่อท้ายด้วย "0001" ให้เอง (ห้ามใส่เลขรันลำดับไว้ในนี้)</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">จำนวนวันที่ใช้ได้</label>
                  <input type="number" value={quotationData.validDays} onChange={(e) => setQuotationData({ ...quotationData, validDays: Number(e.target.value) })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">สกุลเงิน</label>
                  <select value={quotationData.currency} onChange={(e) => setQuotationData({ ...quotationData, currency: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500">
                    <option value="THB">฿ บาท (THB)</option>
                    <option value="USD">$ ดอลลาร์ (USD)</option>
                    <option value="EUR">€ ยูโร (EUR)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-800">ภาษีมูลค่าเพิ่ม (VAT)</p>
                  <p className="text-xs text-gray-500">เปิดใช้งาน VAT เป็นค่าเริ่มต้น</p>
                </div>
                <div className="flex items-center gap-3">
                  <input type="number" value={quotationData.vatRate} onChange={(e) => setQuotationData({ ...quotationData, vatRate: Number(e.target.value) })} className="w-16 px-2 py-1.5 text-sm text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
                  <span className="text-sm text-gray-600">%</span>
                  <button onClick={() => setQuotationData({ ...quotationData, defaultVat: !quotationData.defaultVat })} className={`relative w-11 h-6 rounded-full transition-colors ${quotationData.defaultVat ? "bg-teal-600" : "bg-gray-300"}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${quotationData.defaultVat ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">หมายเหตุเริ่มต้น</label>
                <textarea value={quotationData.defaultNotes || ""} onChange={(e) => setQuotationData({ ...quotationData, defaultNotes: e.target.value })} rows={2} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">เงื่อนไขเริ่มต้น (Default Terms)</label>
                <div className="space-y-2.5">
                  {Array.isArray(quotationData.defaultTerms) && quotationData.defaultTerms.map((term: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 group animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="flex-none w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        {index + 1}
                      </div>
                      <input 
                        type="text" 
                        value={term || ""} 
                        onChange={(e) => {
                          const newTerms = [...quotationData.defaultTerms];
                          newTerms[index] = e.target.value;
                          setQuotationData({ ...quotationData, defaultTerms: newTerms });
                        }} 
                        className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" 
                        placeholder={`ระบุเงื่อนไขข้อที่ ${index + 1}...`}
                      />
                      <button 
                        onClick={() => {
                          const newTerms = quotationData.defaultTerms.filter((_term: string, i: number) => i !== index);
                          setQuotationData({ ...quotationData, defaultTerms: newTerms });
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="ลบเงื่อนไขนี้"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const currentTerms = Array.isArray(quotationData.defaultTerms) ? quotationData.defaultTerms : [];
                      setQuotationData({ ...quotationData, defaultTerms: [...currentTerms, ""] });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50/50 border border-teal-100 border-dashed rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-all w-full justify-center mt-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    เพิ่มเงื่อนไขใหม่
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h2>
              <div className="space-y-3">
                {[
                  { key: "emailNewQuotation" as const, label: "แจ้งเตือนเมื่อมีใบเสนอราคาใหม่", desc: "รับอีเมลเมื่อสร้างใบเสนอราคาใหม่" },
                  { key: "emailApproved" as const, label: "แจ้งเตือนเมื่ออนุมัติ", desc: "รับอีเมลเมื่อใบเสนอราคาได้รับการอนุมัติ" },
                  { key: "emailRejected" as const, label: "แจ้งเตือนเมื่อปฏิเสธ", desc: "รับอีเมลเมื่อใบเสนอราคาถูกปฏิเสธ" },
                  { key: "emailExpiring" as const, label: "แจ้งเตือนก่อนหมดอายุ", desc: "รับอีเมลเมื่อใบเสนอราคาใกล้หมดอายุ" },
                  { key: "browserNotify" as const, label: "การแจ้งเตือนเบราว์เซอร์", desc: "แสดงการแจ้งเตือนผ่านเบราว์เซอร์" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotificationsData({ ...notificationsData, [item.key]: !notificationsData[item.key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notificationsData[item.key] ? "bg-teal-600" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${notificationsData[item.key] ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Reset Data Button Zone */}
              <div className="mt-8 pt-6 border-t border-red-100 bg-red-50/50 p-5 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-red-600">Danger Zone (ตั้งค่าอันตราย)</h3>
                    <p className="text-xs text-red-500/80 mt-1">ลบข้อมูลทั้งหมดที่บันทึกไว้ในระบบ รวมถึงใบเสนอราคา ลูกค้า และสินค้า ทั้งหมด</p>
                  </div>
                  <button onClick={resetAllData} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-all shadow-sm">
                    รีเซ็ตข้อมูลทั้งหมด
                  </button>
                </div>
              </div>
              
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === "specifications" && (
            <BoatSpecificationTab />
          )}

          {/* Save Button */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              {saved && (
                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  บันทึกสำเร็จ!
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 active:scale-[0.98]"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoatSpecificationTab() {
  const { boatModels, updateSettings, boatSpecifications, updateBoatSpecification } = useAppContext();
  const [activeSubTab, setActiveSubTab] = useState<"specs" | "images">("specs");
  const [editingBoat, setEditingBoat] = useState<string | null>(null);
  const [tempModelName, setTempModelName] = useState<string>("");
  const [tempSpec, setTempSpec] = useState<BoatSpecification | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRefUpload = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ model: string, index: number } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;
        const currentSpec = boatSpecifications[uploadTarget.model] || {
          loa: "-", beam: "-", draft: "-", freshWaterCapacity: "-",
          gasTank: "-", height: "-", recEngine: "-", speedDesign: "-", passenger: "-", images: []
        };
        const currentImages = [...(currentSpec.images || [])];
        currentImages[uploadTarget.index] = imageUrl;
        
        await updateBoatSpecification(uploadTarget.model, { ...currentSpec, images: currentImages });
        
        setUploadTarget(null);
        // Clear input so same file can be selected again
        if (fileInputRefUpload.current) fileInputRefUpload.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (model: string, index: number) => {
    setUploadTarget({ model, index });
    setTimeout(() => {
      fileInputRefUpload.current?.click();
    }, 0);
  };

  const startEdit = (model: string) => {
    setEditingBoat(model);
    setTempModelName(model);
    setTempSpec(boatSpecifications[model] || {
      loa: "-", beam: "-", draft: "-", freshWaterCapacity: "-",
      gasTank: "-", height: "-", recEngine: "-", speedDesign: "-", passenger: "-"
    });
  };

  const saveEdit = async () => {
    if (editingBoat && tempSpec && tempModelName.trim()) {
      // 1. Rename logic
      if (tempModelName !== editingBoat) {
        // Update model list
        const newModels = boatModels.map(m => m === editingBoat ? tempModelName : m);
        await updateSettings({ boatModels: newModels });
        
        // Transfer specs to new name
        await updateBoatSpecification(editingBoat, { ...tempSpec, newModel: tempModelName }, false);
      } else {
        // Standard spec update
        await updateBoatSpecification(editingBoat, tempSpec, false);
      }
      setEditingBoat(null);
    }
  };

  const addNewModel = async () => {
    const defaultName = "รุ่นเรือใหม่";
    // Check if name exists, append number if it does
    let finalName = defaultName;
    let count = 1;
    while (boatModels.includes(finalName)) {
      finalName = `${defaultName} ${count++}`;
    }

    const newModels = [...boatModels, finalName];
    const newSpec = {
      loa: "-", beam: "-", draft: "-", freshWaterCapacity: "-",
      gasTank: "-", height: "-", recEngine: "-", speedDesign: "-", passenger: "-", images: []
    };

    await updateSettings({ boatModels: newModels });
    await updateBoatSpecification(finalName, newSpec, true);
    
    // Only start edit and don't scroll if in specs tab (because it switches view)
    if (activeSubTab === "specs") {
      startEdit(finalName);
    } else {
      // If in images tab, just scroll to the new item at the bottom after state update
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  };

  if (editingBoat && tempSpec && activeSubTab === "specs") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setEditingBoat(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-lg font-bold text-gray-800">แก้ไขข้อมูลทางเทคนิค</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-50 shadow-sm shadow-teal-500/5 mb-6">
          <SpecInput label="ชื่อรุ่นเรือ (Model Name)" value={tempModelName} onChange={(v) => setTempModelName(v)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpecInput label="LOA (ความยาวตลอดลำ)" value={tempSpec.loa} onChange={(v) => setTempSpec({...tempSpec, loa: v})} />
          <SpecInput label="Beam (ความกว้าง)" value={tempSpec.beam} onChange={(v) => setTempSpec({...tempSpec, beam: v})} />
          <SpecInput label="Draft (กินน้ำลึก)" value={tempSpec.draft} onChange={(v) => setTempSpec({...tempSpec, draft: v})} />
          <SpecInput label="Fresh water Capacity (ถังน้ำจืด)" value={tempSpec.freshWaterCapacity} onChange={(v) => setTempSpec({...tempSpec, freshWaterCapacity: v})} />
          <SpecInput label="Gas Tank (ถังเชื้อเพลิง)" value={tempSpec.gasTank} onChange={(v) => setTempSpec({...tempSpec, gasTank: v})} />
          <SpecInput label="Height (ความสูง)" value={tempSpec.height} onChange={(v) => setTempSpec({...tempSpec, height: v})} />
          <SpecInput label="Rec. Engine (เครื่องยนต์ที่แนะนำ)" value={tempSpec.recEngine} onChange={(v) => setTempSpec({...tempSpec, recEngine: v})} />
          <SpecInput label="Speed design (ความเร็วออกแบบ)" value={tempSpec.speedDesign} onChange={(v) => setTempSpec({...tempSpec, speedDesign: v})} />
          <SpecInput label="Passenger (จำนวนผู้โดยสาร)" value={tempSpec.passenger} onChange={(v) => setTempSpec({...tempSpec, passenger: v})} />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
           <button
            onClick={saveEdit}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-all shadow-md active:scale-[0.98]"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      {/* Sub tabs navigation */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-100 flex gap-4">
        <button
          onClick={() => setActiveSubTab("specs")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeSubTab === "specs"
              ? "text-teal-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          ข้อมูลทางเทคนิคของเรือ (Specifications)
        </button>
        <button
          onClick={() => setActiveSubTab("images")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeSubTab === "images"
              ? "text-teal-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          ข้อมูลรูปภาพ
        </button>
      </div>

      <div className="p-6">
        {activeSubTab === "specs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">ข้อมูลทางเทคนิคของเรือ (Specifications)</h2>
              <button 
                onClick={addNewModel}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 hover:border-teal-200 transition-all shadow-sm active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                + เพิ่มรุ่นเรือ
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {boatModels.map(model => (
                <div key={model} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-teal-500/5 transition-all group relative">
                  {/* Header: Model & Icon + Edit Button */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100/50 shadow-sm text-teal-600 font-bold text-2xl">
                        {model.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">เรือรุ่น {model}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold mt-1">Technical Specs</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => startEdit(model)}
                      className="p-2.5 bg-white text-teal-500 border border-teal-50 rounded-full hover:bg-teal-50 hover:border-teal-200 hover:shadow-md transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>

                  {/* Specifications Grid with Horizontal Dividers */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-10">
                      <SpecSummaryItem label="LOA:" value={boatSpecifications[model]?.loa} />
                      <SpecSummaryItem label="Beam:" value={boatSpecifications[model]?.beam} />
                    </div>
                    <div className="border-t border-gray-50"></div>
                    <div className="grid grid-cols-2 gap-10">
                      <SpecSummaryItem label="Draft:" value={boatSpecifications[model]?.draft} />
                      <SpecSummaryItem label="Pass:" value={boatSpecifications[model]?.passenger} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "images" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">ข้อมูลรูปภาพสำหรับเรือแต่ละรุ่น</h2>
                <p className="text-xs text-gray-500 mt-1">จัดการรูปภาพสูงสุด 5 รูปที่จะแสดงในใบเสนอราคาและหน้าข้อมูลสินค้า</p>
              </div>
              <button 
                onClick={addNewModel}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 hover:border-teal-200 transition-all shadow-sm active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                + เพิ่มรุ่นเรือ
              </button>
            </div>

            <div className="space-y-12">
              {boatModels.map(model => {
                const images = boatSpecifications[model]?.images || [];
                return (
                  <div key={model} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {model.charAt(0)}
                      </div>
                      <h3 className="text-md font-bold text-gray-900 border-b-2 border-teal-600/20 pb-1">เรือรุ่น {model}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {/* Image Slots */}
                      {Array.from({ length: 5 }).map((_, i) => {
                        const imageUrl = images[i];
                        return (
                          <div 
                            key={i} 
                            className={`aspect-[4/3] rounded-2xl border-2 border-dashed transition-all relative overflow-hidden group ${
                              imageUrl 
                                ? "border-solid border-gray-100 shadow-sm" 
                                : "border-gray-200 bg-gray-50/30 hover:bg-teal-50/50 hover:border-teal-300"
                            }`}
                          >
                            {imageUrl ? (
                              <>
                                <img src={imageUrl} alt={`เรือรุ่น ${model} รูปที่ ${i + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button 
                                    onClick={async () => {
                                      const newImages = [...images];
                                      newImages[i] = "";
                                      const currentSpec = boatSpecifications[model];
                                      await updateBoatSpecification(model, { ...currentSpec, images: newImages });
                                    }}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
                                    title="ลบรูปภาพ"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                </div>
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  รูปที่ {i + 1}
                                </div>
                              </>
                            ) : (
                              <button 
                                onClick={() => triggerUpload(model, i)}
                                className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-teal-600 transition-colors"
                              >
                                <svg className="w-8 h-8 opacity-40 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-wider">เพิ่มรูปภาพ</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div ref={scrollRef} className="h-2" />
            
            {/* Internal hidden file input for uploads */}
            <input 
              type="file" 
              ref={fileInputRefUpload} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-sm text-blue-700 leading-relaxed">
                <p className="font-bold mb-1">คำแนะนำการอัปโหลด</p>
                <p>คุณสามารถเพิ่มรูปภาพได้สูงสุด 5 รูปต่อรุ่นเรือ โดยรูปแรกจะถูกใช้เป็นรูปภาพหลักใบใหญ่ที่ด้านบนของ Visual Gallery รองรับไฟล์ .jpg, .png ขนาดแนะนำ 1200 x 800 พิกเซล</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecSummaryItem({ label, value }: { label: string, value?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-400 tracking-tight">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value || "-"}</span>
    </div>
  );
}

function SpecInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>
      <input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:bg-white transition-all caret-teal-600" 
      />
    </div>
  );
}
