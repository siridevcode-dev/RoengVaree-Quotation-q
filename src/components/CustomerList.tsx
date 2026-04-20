"use client";

import { useState } from "react";
import { useAppContext, Customer } from "@/context/AppContext";
import PasswordModal from "./PasswordModal";

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

const avatarGradients = [
  "linear-gradient(135deg,#283583,#6366f1)",
  "linear-gradient(135deg,#0d9488,#14b8a6)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#dc2626,#ef4444)",
  "linear-gradient(135deg,#7c3aed,#8b5cf6)",
  "linear-gradient(135deg,#0284c7,#38bdf8)",
];

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
    if (!formData.name.trim()) { showToast("กรุณากรอกชื่อลูกค้า", "error"); return; }
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
    } catch { /* handled in context */ }
  };

  const handleDeleteSuccess = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete.id);
      showToast(`ลบข้อมูลลูกค้า ${customerToDelete.name} เรียบร้อยแล้ว`, "success");
    } catch { /* handled */ }
    setCustomerToDelete(null);
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all";
  const labelClass = "text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide";

  return (
    <div className="flex-1 overflow-auto bg-gray-50/40">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="page-title">ลูกค้า</h1>
            <p className="page-subtitle mt-1">จัดการข้อมูลลูกค้า ({customers.length} ราย)</p>
          </div>
          {canEditOrDelete && (
            <button onClick={openAddForm} className="btn-primary w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มลูกค้าใหม่
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-modern pl-10"
          />
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">{editingId ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}</h3>
                <p className="text-sm text-gray-400 mt-0.5">กรอกข้อมูลลูกค้าด้านล่าง</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={labelClass}>ชื่อบริษัท / ลูกค้า *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="ชื่อบริษัทหรือชื่อลูกค้า" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>อีเมล</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>เบอร์โทร</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="02-XXX-XXXX" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>ที่อยู่</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="ที่อยู่" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>เลขประจำตัวผู้เสียภาษี</label>
                  <input type="text" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} placeholder="0105-XXX-XXXX" className={inputClass} />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="btn-secondary py-2 px-4 text-sm">ยกเลิก</button>
                <button onClick={saveCustomer} className="btn-primary py-2 px-5 text-sm">บันทึก</button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c, idx) => (
            <div key={c.id} className="card overflow-hidden group">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm"
                      style={{ background: avatarGradients[idx % avatarGradients.length] }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{c.name}</h3>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{c.email || "—"}</p>
                    </div>
                  </div>
                  {canEditOrDelete && (
                    <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditForm(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="แก้ไข">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setCustomerToDelete(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="ลบ">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>{c.phone || "—"}</span>
                  </div>
                  {c.address && (
                    <div className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="truncate">{c.address}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-xs text-gray-500">{c.totalQuotations} ใบเสนอราคา</span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#283583' }}>{formatCurrency(c.totalRevenue)}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p className="text-sm font-medium text-gray-500">ไม่พบลูกค้า</p>
            <p className="text-xs text-gray-400">ลองเปลี่ยนคำค้นหา</p>
          </div>
        )}
      </div>

      <PasswordModal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onSuccess={handleDeleteSuccess}
        title="ยืนยันการลบข้อมูลลูกค้า"
        message={`ต้องการลบข้อมูลลูกค้า "${customerToDelete?.name}" หรือไม่?`}
      />
    </div>
  );
}
