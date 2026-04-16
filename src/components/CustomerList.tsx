"use client";

import { useState } from "react";
import { useAppContext, Customer } from "@/context/AppContext";
import PasswordModal from "./PasswordModal";

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

export default function CustomerList() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, showToast, currentUser } = useAppContext();
  const canEditOrDelete = currentUser?.role === "Admin" || currentUser?.role === "Manager";
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", taxId: "" });

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const openAddForm = () => {
    setFormData({ name: "", email: "", phone: "", address: "", taxId: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (c: Customer) => {
    setFormData({ name: c.name, email: c.email, phone: c.phone, address: c.address, taxId: c.taxId });
    setEditingId(c.id);
    setShowForm(true);
  };

  const saveCustomer = async () => {
    if (!formData.name.trim()) {
      showToast("กรุณากรอกชื่อลูกค้า", "error");
      return;
    }

    try {
      if (editingId) {
        await updateCustomer(editingId, formData);
        showToast("อัปเดตข้อมูลลูกค้าสำเร็จ", "success");
      } else {
        await addCustomer(formData);
        showToast("เพิ่มลูกค้าใหม่เรียบร้อยแล้ว", "success");
      }
      setShowForm(false);
      setEditingId(null);
    } catch {
      // Error handled in AppContext
    }
  };

  const handleDeleteSuccess = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete.id);
      showToast(`ลบข้อมูลลูกค้า ${customerToDelete.name} เรียบร้อยแล้ว`, "success");
    } catch {
      // Error handled in AppContext
    }
    setCustomerToDelete(null);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ลูกค้า</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการข้อมูลลูกค้า ({customers.length} ราย)</p>
          </div>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มลูกค้าใหม่
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700">
                <h3 className="text-lg font-bold text-white">{editingId ? "แก้ไขลูกค้า" : "เพิ่มลูกค้าใหม่"}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ชื่อบริษัท / ลูกค้า *</label>
                  <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="ชื่อบริษัท" className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">อีเมล</label>
                    <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">เบอร์โทร</label>
                    <input type="tel" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="02-XXX-XXXX" className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">ที่อยู่</label>
                  <input type="text" value={formData.address || ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="ที่อยู่" className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">เลขประจำตัวผู้เสียภาษี</label>
                  <input type="text" value={formData.taxId || ""} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} placeholder="0105-XXX-XXXX" className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">ยกเลิก</button>
                <button onClick={saveCustomer} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-sm">บันทึก</button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{c.name}</h3>
                      <p className="text-xs text-gray-400 truncate">{c.email}</p>
                    </div>
                  </div>
                  {canEditOrDelete && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditForm(c)} 
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all" 
                        title="แก้ไข"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      
                      <button 
                        onClick={() => setCustomerToDelete(c)} 
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" 
                        title="ลบ"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {c.phone}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="truncate">{c.address}</span>
                  </p>
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-400">ใบเสนอราคา: </span>
                  <span className="font-semibold text-gray-700">{c.totalQuotations}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-400">รายได้: </span>
                  <span className="font-bold text-teal-700">{formatCurrency(c.totalRevenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">ไม่พบลูกค้า</p>
          </div>
        )}
      </div>

      <PasswordModal 
        isOpen={!!customerToDelete} 
        onClose={() => setCustomerToDelete(null)} 
        onSuccess={handleDeleteSuccess}
        title="ยืนยันการลบข้อมูลลูกค้า"
        message={`ต้องการลบข้อมูลลูกค้า "${customerToDelete?.name}" หรือไม่? กรุณากรอกรหัสผ่าน Admin เพื่อยืนยัน`}
      />
    </div>
  );
}
