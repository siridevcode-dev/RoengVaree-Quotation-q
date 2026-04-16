"use client";

import { useState } from "react";
import { useAppContext, Product } from "@/context/AppContext";

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

interface ProductSelectorProps {
  onConfirm: (selected: Product[]) => void;
  onCancel: () => void;
}

export default function ProductSelector({ onConfirm, onCancel }: ProductSelectorProps) {
  const { products, categories, boatModels } = useAppContext();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("เรือ");
  const [filterModel, setFilterModel] = useState("ทั้งหมด");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allCategories = ["ทั้งหมด", ...categories.filter(c => c !== "มาตรฐาน" && c !== "อุปกรณ์เสริม")];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "ทั้งหมด" || p.category === filterCat;
    const matchModel = filterModel === "ทั้งหมด" || p.boatModel === filterModel || p.boatModel === "ทุกรุ่น";
    return matchSearch && matchCat && matchModel;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = products.filter(p => selectedIds.includes(p.id));
    onConfirm(selected);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50/50">
      <div className="max-w-[1000px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">เลือกสินค้า / บริการ</h1>
            <p className="text-sm text-gray-500 mt-1">
              เลือกรายการที่ต้องการเพิ่มเข้าใบเสนอราคา ({selectedIds.length} รายการที่เลือก)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              ยกเลิก
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 disabled:opacity-50 disabled:shadow-none"
            >
              ถัดไป (สร้างใบเสนอราคา)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="relative">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อสินค้า หรือ SKU..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-white focus:border-teal-500 transition-all" 
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setFilterCat(cat)} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  filterCat === cat 
                    ? "bg-teal-600 text-white shadow-sm" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div 
              key={p.id} 
              onClick={() => toggleSelect(p.id)}
              className={`p-4 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer transition-all hover:shadow-md group relative ${
                selectedIds.includes(p.id) ? "ring-2 ring-teal-500 border-transparent bg-teal-50/10" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 uppercase tracking-tighter">{p.sku}</span>
                    <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">{p.category}</span>
                    {p.boatModel && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        p.boatModel === "ทุกรุ่น" ? "bg-gray-50 text-gray-400" : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        MODEL: {p.boatModel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-teal-700 transition-colors uppercase">{p.name}</h3>
                  <div className="mt-1">
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(p.unitPrice)}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">ต่อ {p.unit}</p>
                </div>
              </div>

              {/* Checkbox Overlay */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedIds.includes(p.id) ? "bg-teal-500 border-teal-500 text-white" : "bg-white border-gray-300"
                }`}>
                  {selectedIds.includes(p.id) && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
              </div>
              
              {selectedIds.includes(p.id) && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-sm">ไม่พบสินค้าที่คุณค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
