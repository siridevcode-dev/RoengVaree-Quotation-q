"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

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

const frequencyColor: Record<string, string> = {
  "รายเดือน": "bg-blue-100 text-blue-700",
  "รายไตรมาส": "bg-purple-100 text-purple-700",
  "รายปี": "bg-amber-100 text-amber-700",
};

interface RepeatQueriesProps {
  onNavigate: (page: string, quotationId?: string, items?: any[]) => void;
}

export default function RepeatQueries({ onNavigate }: RepeatQueriesProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const { showToast } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("qm_templates");
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("qm_templates", JSON.stringify(templates));
    }
  }, [templates, mounted]);

  const [search, setSearch] = useState("");
  const [filterFreq, setFilterFreq] = useState("ทั้งหมด");

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

  const toggleActive = (id: number) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));
  };

  const handleCreateFromTemplate = (t: Template) => {
    // Pass the real items if they were saved in the template
    const finalItems = t.lineItems && t.lineItems.length > 0 
      ? t.lineItems.map(item => ({...item, id: Date.now() + Math.random()})) // issue new IDs for items
      : Array.from({ length: t.items }).map((_, i) => ({
          id: Date.now() + i,
          name: `${t.name} - Package ${i + 1}`,
          description: `Description for ${t.name}`,
          quantity: 1,
          unitPrice: Math.round(t.amount / t.items),
          discount: 0,
          vatEnabled: true,
          category: "บริการ"
        }));
    
    // Pass the items to the Quote Form route
    onNavigate("Quotation Form", undefined, finalItems);
  };

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 86400000);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quotation Templates</h1>
            <p className="text-sm text-gray-500 mt-1">เทมเพลตใบเสนอราคาที่ใช้ซ้ำ ({templates.length} รายการ)</p>
          </div>
          <button
            onClick={() => {
              showToast("กรุณาเลือกรายการสินค้าในหน้า 'สร้างใบเสนอราคา' แล้วกดปุ่ม 'บันทึกเป็นเทมเพลต' ที่ด้านล่างสุดของฟอร์ม", "info");
              onNavigate("Quotation Form");
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            สร้างเทมเพลตใหม่
          </button>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">เทมเพลตที่ใช้งาน</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{templates.filter((t) => t.isActive).length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">รายได้ประจำ/เดือน (ประมาณ)</p>
            <p className="text-xl font-bold text-teal-700 mt-0.5">{formatCurrency(Math.round(totalMonthly))}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500">ครบกำหนดเร็วๆ นี้</p>
            <p className="text-xl font-bold text-amber-600 mt-0.5">
              {templates.filter((t) => t.isActive && new Date(t.nextDue.split("/").reverse().join("-")) <= thirtyDaysFromNow).length} รายการ
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="ค้นหาเทมเพลต หรือ ชื่อลูกค้า..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" />
          </div>
          <div className="flex gap-2">
            {frequencies.map((f) => (
              <button key={f} onClick={() => setFilterFreq(f)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${filterFreq === f ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">เทมเพลต</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">ลูกค้า</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-5 py-3">รอบการเรียกเก็บ</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-5 py-3">จำนวนเงิน</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-5 py-3">ใช้ล่าสุด</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-5 py-3">ครบกำหนดถัดไป</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-5 py-3">สถานะ</th>
                  <th className="w-[80px] px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr key={t.id} className={`group hover:bg-teal-50/30 transition-colors ${!t.isActive ? "opacity-50" : ""}`}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.items} รายการ</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{t.customer}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${frequencyColor[t.frequency]}`}>
                        {t.frequency}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 text-right">{formatCurrency(t.amount)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 text-center">{t.lastUsed}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 text-center">{t.nextDue}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button onClick={() => toggleActive(t.id)} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${t.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {t.isActive ? "ใช้งาน" : "ปิดใช้"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleCreateFromTemplate(t)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all" title="สร้างใบเสนอราคา">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                        <button onClick={() => setTemplates((prev) => prev.filter((x) => x.id !== t.id))} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="ลบ">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p className="text-sm font-semibold text-gray-700">ไม่มีเทมเพลตในระบบ</p>
              <p className="text-xs text-gray-400 mt-1">กด &quot;สร้างเปิดใบเสนอราคา&quot; แล้วกด &quot;บันทึกเป็นเทมเพลต&quot; เพื่อสร้างเทมเพลตสำหรับใช้งาน</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
