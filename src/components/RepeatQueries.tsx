"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { safeLocalStorageSet } from "@/lib/image-utils";

interface Template {
  id: number;
  name: string;
  customer: string;
  items: number;
  amount: number;
  frequency: string;
  lastUsed: string;
  nextDue: string;
  isActive: boolean;
  lineItems?: any[];
  customImages?: string[];
}

const initialTemplates: Template[] = [
  { id: 1, name: "บริการ Cloud Hosting รายเดือน", customer: "Acme Corporation", items: 3, amount: 15000, frequency: "รายเดือน", lastUsed: "01/03/2026", nextDue: "01/04/2026", isActive: true },
  { id: 2, name: "แพ็คเกจ SEO รายเดือน", customer: "TechStart Inc.", items: 2, amount: 25000, frequency: "รายเดือน", lastUsed: "15/03/2026", nextDue: "15/04/2026", isActive: true },
  { id: 3, name: "บำรุงรักษาระบบรายไตรมาส", customer: "Global Solutions Ltd.", items: 5, amount: 45000, frequency: "รายไตรมาส", lastUsed: "01/01/2026", nextDue: "01/04/2026", isActive: true },
  { id: 4, name: "ต่อสัญญา Domain & SSL", customer: "บริษัท สยามเทค จำกัด", items: 4, amount: 8500, frequency: "รายปี", lastUsed: "15/01/2026", nextDue: "15/01/2027", isActive: true },
  { id: 5, name: "สัญญาซัพพอร์ตรายปี", customer: "Alpha Digital Co.", items: 1, amount: 120000, frequency: "รายปี", lastUsed: "01/06/2025", nextDue: "01/06/2026", isActive: false },
  { id: 6, name: "Google Ads Management", customer: "บริษัท พีเอส กรุ๊ป จำกัด", items: 2, amount: 35000, frequency: "รายเดือน", lastUsed: "20/03/2026", nextDue: "20/04/2026", isActive: true },
];

const frequencies = ["ทั้งหมด", "รายเดือน", "รายไตรมาส", "รายปี"];

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

const frequencyStyle: Record<string, { bg: string; text: string }> = {
  "รายเดือน":   { bg: "#eff6ff", text: "#1d4ed8" },
  "รายไตรมาส": { bg: "#f5f3ff", text: "#6d28d9" },
  "รายปี":      { bg: "#fffbeb", text: "#b45309" },
};

interface RepeatQueriesProps {
  onNavigate: (page: string, quotationId?: string, items?: any[], customImages?: string[]) => void;
}

export default function RepeatQueries({ onNavigate }: RepeatQueriesProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const { showToast } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterFreq, setFilterFreq] = useState("ทั้งหมด");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("qm_templates");
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      const json = JSON.stringify(templates);
      if (!safeLocalStorageSet("qm_templates", json)) {
        const slim = templates.map(({ customImages: _imgs, ...rest }) => rest);
        safeLocalStorageSet("qm_templates", JSON.stringify(slim));
      }
    }
  }, [templates, mounted]);

  const filtered = templates.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase());
    const matchFreq = filterFreq === "ทั้งหมด" || t.frequency === filterFreq;
    return matchSearch && matchFreq;
  });

  const totalMonthly = templates.filter((t) => t.isActive).reduce((s, t) => {
    if (t.frequency === "รายเดือน") return s + t.amount;
    if (t.frequency === "รายไตรมาส") return s + t.amount / 3;
    if (t.frequency === "รายปี") return s + t.amount / 12;
    return s;
  }, 0);

  const toggleActive = (id: number) =>
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));

  const handleCreateFromTemplate = (t: Template) => {
    const finalItems = t.lineItems && t.lineItems.length > 0
      ? t.lineItems.map((item) => ({ ...item, id: Date.now() + Math.random() }))
      : Array.from({ length: t.items }).map((_, i) => ({
          id: Date.now() + i,
          name: `${t.name} - Package ${i + 1}`,
          description: `Description for ${t.name}`,
          quantity: 1,
          unitPrice: Math.round(t.amount / t.items),
          discount: 0,
          vatEnabled: true,
          category: "บริการ",
        }));
    onNavigate("Quotation Form", undefined, finalItems, t.customImages || []);
  };

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 86400000);
  const dueSoon = templates.filter((t) => t.isActive && new Date(t.nextDue.split("/").reverse().join("-")) <= thirtyDaysFromNow).length;

  return (
    <div className="flex-1 overflow-auto bg-gray-50/40">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="page-title">เทมเพลตใบเสนอราคา</h1>
            <p className="page-subtitle mt-1">ใบเสนอราคาที่ใช้ซ้ำ ({templates.length} รายการ)</p>
          </div>
          <button
            onClick={() => {
              showToast("กรุณาเลือกรายการสินค้าในหน้า 'สร้างใบเสนอราคา' แล้วกดปุ่ม 'บันทึกเป็นเทมเพลต'", "info");
              onNavigate("Quotation Form");
            }}
            className="btn-primary w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            สร้างเทมเพลตใหม่
          </button>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 stagger-children">
          {[
            { label: "เทมเพลตที่ใช้งาน", value: `${templates.filter((t) => t.isActive).length}`, color: "#283583", bg: "#eef2ff" },
            { label: "รายได้ประจำ/เดือน", value: formatCurrency(Math.round(totalMonthly)), color: "#0d9488", bg: "#f0fdf9" },
            { label: "ครบกำหนดเร็วๆ นี้", value: `${dueSoon} รายการ`, color: "#d97706", bg: "#fffbeb" },
          ].map((s) => (
            <div key={s.label} className="stat-card animate-fade-in">
              <p className="text-xs font-medium text-gray-500 mb-1.5">{s.label}</p>
              <p className="text-2xl font-black tracking-tight" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="ค้นหาเทมเพลต หรือ ชื่อลูกค้า..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10" />
          </div>
          <div className="flex gap-1.5">
            {frequencies.map((f) => (
              <button key={f} onClick={() => setFilterFreq(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterFreq === f ? "text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                style={filterFreq === f ? { background: "linear-gradient(135deg,#283583,#4f46e5)" } : {}}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">เทมเพลต</th>
                  <th className="text-left">ลูกค้า</th>
                  <th className="text-center">รอบเรียกเก็บ</th>
                  <th className="text-right">จำนวนเงิน</th>
                  <th className="text-center">ใช้ล่าสุด</th>
                  <th className="text-center">ครบกำหนดถัดไป</th>
                  <th className="text-center">สถานะ</th>
                  <th className="w-14 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const freq = frequencyStyle[t.frequency] || { bg: "#f1f5f9", text: "#475569" };
                  return (
                    <tr
                      key={t.id}
                      onClick={() => handleCreateFromTemplate(t)}
                      className={`group cursor-pointer ${!t.isActive ? "opacity-50" : ""}`}
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{t.items} รายการ</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{t.customer}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="badge text-xs font-semibold" style={{ backgroundColor: freq.bg, color: freq.text }}>{t.frequency}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">{formatCurrency(t.amount)}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 text-center">{t.lastUsed}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 text-center">{t.nextDue}</td>
                      <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleActive(t.id); }}
                          className={`badge text-xs font-semibold cursor-pointer transition-all hover:scale-105 ${t.isActive ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"}`}
                        >
                          {t.isActive ? "ใช้งาน" : "ปิดใช้"}
                        </button>
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setTemplates((prev) => prev.filter((x) => x.id !== t.id)); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all md:opacity-0 md:group-hover:opacity-100"
                          title="ลบ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-sm font-medium text-gray-500">ไม่มีเทมเพลตในระบบ</p>
                <p className="text-xs text-gray-400">สร้างใบเสนอราคาแล้วกด "บันทึกเป็นเทมเพลต"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
