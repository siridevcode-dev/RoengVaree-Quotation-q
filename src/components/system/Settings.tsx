"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

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
  


  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const updates: any = {};

      if (activeTab === "profile") {
        if (profileData.password && profileData.password !== profileData.confirmPassword) {
          alert("รหัสผ่านไม่ตรงกัน");
          return;
        }
        if (currentUser) {
          updates.profile = {
            ...profileData,
            role: currentUser.role,
            status: currentUser.status
          };
        }

      }

      if (Object.keys(updates).length > 0) {
        await updateSettings(updates);
      }
      
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
              title={tab.label}
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
                <button title="เปลี่ยนรูปภาพโปรไฟล์" className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-all">เปลี่ยนรูปภาพ</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ชื่อ-สกุล</label>
                  <input type="text" title="ชื่อ-สกุล" placeholder="ระบุชื่อ-นามสกุล" value={profileData.name || ""} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Username (ชื่อผู้ใช้)</label>
                  <input type="text" title="ชื่อผู้ใช้" placeholder="ระบุชื่อผู้ใช้" value={profileData.username || ""} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">อีเมล</label>
                  <input type="email" title="อีเมล" placeholder="example@email.com" value={profileData.email || ""} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">เบอร์โทร</label>
                  <input type="tel" title="เบอร์โทรศัพท์" placeholder="08x-xxx-xxxx" value={profileData.phone || ""} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ตำแหน่ง</label>
                  <input type="text" title="ตำแหน่ง" placeholder="ระบุตำแหน่งงาน" value={profileData.position || ""} onChange={(e) => setProfileData({ ...profileData, position: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
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
                  <input type="password" title="รหัสผ่านใหม่" placeholder="รหัสผ่านใหม่" value={profileData.password} onChange={(e) => setProfileData({ ...profileData, password: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                  <input type="password" title="ยืนยันรหัสผ่านใหม่" placeholder="ยืนยันรหัสผ่านใหม่" value={profileData.confirmPassword} onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <p className="text-[11px] text-gray-400 mt-2">* เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน</p>
              </div>
            </div>
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


