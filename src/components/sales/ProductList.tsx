"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";

import { useAppContext, Product, ProductionCost } from "@/context/AppContext";
import { exportProducts } from "@/lib/excel-export";

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

export default function ProductList() {
  const { 
    productionCosts, 
    addProductionCost, 
    updateProductionCost, 
    deleteProductionCost, 
    categories, 
    boatModels, 
    updateSettings, 
    showToast 
  } = useAppContext();
  
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("เรือ");
  const [filterModel, setFilterModel] = useState("ทั้งหมด");
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [activeManagerTab, setActiveManagerTab] = useState<'categories' | 'models'>('categories');
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "เรือ", 
    unitPrice: 0, 
    sellingPrice: 0,
    unit: "", 
    description: "", 
    sku: "",
    boatModel: "ทุกรุ่น"
  });

  // Master products are those without a quotationId
  const masterProducts = productionCosts.filter(p => !p.quotationId);

  const filtered = masterProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCat === "ทั้งหมด" || p.category === filterCat;
    const matchModel = filterModel === "ทั้งหมด" || p.boatModel === filterModel || p.boatModel === "ทุกรุ่น";
    return matchSearch && matchCat && matchModel;
  });

  const openAddForm = () => {
    const defaultCat = categories[0] || "เรือ";
    const defaultModel = (defaultCat === "มาตรฐาน" || defaultCat === "อุปกรณ์เสริม") ? "R52" : "ทุกรุ่น";
    
    setFormData({ 
      name: "", 
      category: defaultCat, 
      unitPrice: 0, 
      sellingPrice: 0,
      unit: "", 
      description: "", 
      sku: "",
      boatModel: defaultModel
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (p: ProductionCost) => {
    setFormData({ 
      name: p.name, 
      category: p.category, 
      unitPrice: p.unitPrice, 
      sellingPrice: p.sellingPrice || 0,
      unit: p.unit, 
      description: p.description, 
      sku: p.sku,
      boatModel: p.boatModel || "ทุกรุ่น"
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const saveProduct = async () => {
    if (!formData.name.trim()) {
      showToast("กรุณากรอกชื่อสินค้า/บริการ", "error");
      return;
    }
    try {
      if (editingId) {
        await updateProductionCost(editingId, formData);
        showToast("อัปเดตข้อมูลสินค้าสำเร็จ", "success");
      } else {
        await addProductionCost({ ...formData, inStock: true });
        showToast("เพิ่มสินค้าใหม่เรียบร้อยแล้ว", "success");
      }
      setShowForm(false);
    } catch (err) {
      // Error handled in AppContext
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      showToast("หมวดหมู่มีอยู่แล้ว", "error");
      return;
    }
    const newCategories = [...categories, newCategoryName.trim()];
    await updateSettings({ categories: newCategories });
    setNewCategoryName("");
    showToast(`เพิ่มหมวดหมู่ ${newCategoryName} เรียบร้อย`, "success");
  };

  const removeCategory = async (cat: string) => {
    const isUsed = masterProducts.some(p => p.category === cat);
    if (isUsed) {
      showToast("ไม่สามารถลบได้เนื่องจากมีสินค้าในหมวดหมู่นี้", "error");
      return;
    }
    const newCategories = categories.filter(c => c !== cat);
    await updateSettings({ categories: newCategories });
    showToast(`ลบหมวดหมู่ ${cat} เรียบร้อย`, "success");
  };

  const modelListRef = useRef<HTMLDivElement>(null);

  const addBoatModel = async () => {
    if (!newModelName.trim()) return;
    if (boatModels.includes(newModelName.trim())) {
      showToast("รุ่นเรือมีอยู่แล้ว", "error");
      return;
    }
    const newModels = [...boatModels, newModelName.trim()];
    await updateSettings({ boatModels: newModels });
    setNewModelName("");
    showToast(`เพิ่มรุ่นเรือ ${newModelName} เรียบร้อย`, "success");
    
    setTimeout(() => {
      modelListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const removeBoatModel = async (model: string) => {
    const isUsed = masterProducts.some(p => p.boatModel === model);
    if (isUsed) {
      if (!confirm(`รุ่นเรือ "${model}" ถูกใช้งานอยู่โดยสินค้าบางรายการ คุณแน่ใจหรือไม่ว่าต้องการลบ? (สินค้าจะถูกเปลี่ยนเป็น "ทุกรุ่น")`)) {
        return;
      }
    }
    const newModels = boatModels.filter(m => m !== model);
    await updateSettings({ boatModels: newModels });
    showToast(`ลบรุ่นเรือ ${model} เรียบร้อย`, "success");
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        if (data.length === 0) {
          showToast("ไฟล์ Excel ไม่มีข้อมูล", "error");
          return;
        }

        const newProducts: Omit<ProductionCost, "id">[] = [];
        const foundCategories = new Set<string>();
        const foundModels = new Set<string>();

        data.forEach((row, index) => {
          const name = row["ชื่อสินค้า"] || row["Product Name"] || row["name"];
          if (!name) return;

          const category = row["หมวดหมู่"] || row["Category"] || row["category"] || "อื่นๆ";
          const boatModel = row["รุ่นเรือ"] || row["Boat Model"] || row["model"] || "ทุกรุ่น";
          const sku = row["SKU"] || row["sku"] || `IMP-${Date.now()}-${index}`;
          
          foundCategories.add(category);
          if (boatModel !== "ทุกรุ่น") foundModels.add(boatModel);

          newProducts.push({
            name: String(name),
            category: String(category),
            boatModel: String(boatModel),
            unitPrice: Number(row["ราคาทุน"] || row["Cost"] || 0),
            sellingPrice: Number(row["ราคาขาย"] || row["Price"] || 0),
            unit: String(row["หน่วย"] || row["Unit"] || row["unit"] || "ชิ้น"),
            description: String(row["รายละเอียด"] || row["Description"] || row["description"] || ""),
            sku: String(sku),
            inStock: true
          });
        });

        if (newProducts.length === 0) {
          showToast("ไม่พบข้อมูลสินค้าที่ถูกต้องในไฟล์", "error");
          return;
        }

        const missingCats = Array.from(foundCategories).filter(c => !categories.includes(c));
        if (missingCats.length > 0) {
          await updateSettings({ categories: [...categories, ...missingCats] });
        }

        const missingModels = Array.from(foundModels).filter(m => !boatModels.includes(m));
        if (missingModels.length > 0) {
          await updateSettings({ boatModels: [...boatModels, ...missingModels] });
        }

        for (const p of newProducts) {
          await addProductionCost(p);
        }
        showToast(`นำเข้าสินค้าสำเร็จ ${newProducts.length} รายการ`, "success");
        setShowForm(false);
        
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        console.error("Excel Import Error:", err);
        showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel", "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  const formatCurrencyValue = (val: number | undefined) =>
    (val || 0).toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">สินค้า / บริการ (ข้อมูลหลัก)</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">ดึงข้อมูลต้นทุนและราคาขายจากระบบบริหารต้นทุน ({masterProducts.length} รายการ)</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleExcelImport} 
              accept=".xlsx, .xls" 
              id="excel-import"
              className="hidden" 
              aria-label="เลือกไฟล์ Excel สำหรับนำเข้าข้อมูลสินค้า"
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-teal-700 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 transition-all active:scale-[0.98] shadow-sm"
              title="นำเข้าสินค้าจากไฟล์ Excel (.xlsx)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="hidden sm:inline">นำเข้า</span> Excel
            </button>
            <button 
              onClick={() => exportProducts(masterProducts)} 
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-sm"
              title="ส่งออกสินค้าเป็นไฟล์ Excel (.xlsx)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="hidden sm:inline">ส่งออก</span> Excel
            </button>
            <button onClick={() => setShowCategoryManager(true)} className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-all active:scale-[0.98]" title="จัดการหมวดหมู่สินค้าและรุ่นเรือ">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <span className="hidden sm:inline">จัดการ</span>ระบบ
            </button>
            <button onClick={openAddForm} className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 active:scale-[0.98]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              เพิ่มสินค้า/<span className="hidden sm:inline">บริการ</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ SKU..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all" 
              aria-label="ค้นหาสินค้า"
            />
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {["ทั้งหมด", ...categories].map((cat) => (
              <button 
                key={cat} 
                onClick={() => {
                  setFilterCat(cat);
                  setFilterModel("ทั้งหมด");
                }} 
                title={`แสดงหมวดหมู่ ${cat}`}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${filterCat === cat ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Boat Model Filters (Secondary) */}
        {(filterCat === "มาตรฐาน" || filterCat === "อุปกรณ์เสริม") && (
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-xs font-bold text-gray-400 uppercase ml-2">ประเภทเรือ:</span>
            <div className="flex gap-2">
              {["ทั้งหมด", ...boatModels, "ทุกรุ่น"].map((m) => (
                <button 
                  key={m} 
                  onClick={() => setFilterModel(m)} 
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filterModel === m 
                      ? "bg-teal-700 text-white shadow-md shadow-teal-700/20" 
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {m === "ทุกรุ่น" ? "ใช้ได้ทุกรุ่น" : m === "ทั้งหมด" ? "แสดงทั้งหมด" : m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 flex-shrink-0 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{editingId ? "แก้ไขสินค้า/บริการ" : "เพิ่มสินค้า/บริการใหม่"}</h3>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="product-name" className="text-xs font-medium text-gray-500 mb-1.5 block">ชื่อสินค้า/บริการ *</label>
                      <input 
                        id="product-name"
                        type="text" 
                        value={formData.name || ""} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" 
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="product-category" className="text-xs font-medium text-gray-500 mb-1.5 block">หมวดหมู่</label>
                        <select 
                          id="product-category"
                          value={formData.category} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="product-model" className="text-xs font-medium text-gray-500 mb-1.5 block">รุ่นเรือ</label>
                        <select 
                          id="product-model"
                          value={formData.boatModel} 
                          onChange={(e) => setFormData({ ...formData, boatModel: e.target.value })} 
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                        >
                          <option value="ทุกรุ่น">ทุกรุ่น</option>
                          {boatModels.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="product-sku" className="text-xs font-medium text-gray-500 mb-1.5 block">SKU</label>
                        <input 
                          id="product-sku"
                          type="text" 
                          value={formData.sku || ""} 
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block">ราคาทุน (Cost Price ฿)</label>
                        <input 
                          type="text"
                          inputMode="decimal"
                          value={formData.unitPrice ? formData.unitPrice.toLocaleString("en-US") : ""} 
                          onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, "");
                            const num = parseFloat(raw);
                            setFormData({ ...formData, unitPrice: isNaN(num) ? 0 : num });
                          }} 
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-bold text-teal-700" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block">ราคาขาย (Selling Price ฿)</label>
                        <input 
                          type="text"
                          inputMode="decimal"
                          value={formData.sellingPrice ? formData.sellingPrice.toLocaleString("en-US") : ""} 
                          onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, "");
                            const num = parseFloat(raw);
                            setFormData({ ...formData, sellingPrice: isNaN(num) ? 0 : num });
                          }} 
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-bold text-blue-700" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block">หน่วย</label>
                        <input 
                          type="text" 
                          value={formData.unit || ""} 
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })} 
                          placeholder="ชุด, ชิ้น, ระบบ" 
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="product-description" className="text-xs font-medium text-gray-500 mb-1.5 block">รายละเอียด</label>
                      <textarea 
                        id="product-description"
                        value={formData.description || ""} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        rows={2} 
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">ยกเลิก</button>
                <button onClick={saveProduct} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 shadow-sm active:scale-95 transition-all">บันทึกสินค้า</button>
              </div>
            </div>
          </div>
        )}

        {/* Category & Boat Model Manager Modal */}
        {showCategoryManager && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowCategoryManager(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 bg-teal-700 text-white flex justify-between items-center">
                <h3 className="font-bold">จัดการระบบ</h3>
                <button 
                  onClick={() => setShowCategoryManager(false)}
                  aria-label="ปิดหน้าต่างจัดการระบบ"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="flex border-b border-gray-100">
                <button 
                  onClick={() => setActiveManagerTab('categories')}
                  className={`flex-1 py-3 text-xs font-bold uppercase transition-all ${
                    activeManagerTab === 'categories' ? "text-teal-700 border-b-2 border-teal-700 bg-teal-50/30" : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  หมวดหมู่สินค้า
                </button>
                <button 
                  onClick={() => setActiveManagerTab('models')}
                  className={`flex-1 py-3 text-xs font-bold uppercase transition-all ${
                    activeManagerTab === 'models' ? "text-teal-700 border-b-2 border-teal-700 bg-teal-50/30" : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  รุ่นเรือ
                </button>
              </div>

              <div className="p-6 space-y-4">
                {activeManagerTab === 'categories' ? (
                  <>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ชื่อหมวดหมู่ใหม่..." 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      <button onClick={addCategory} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all">เพิ่ม</button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-auto">
                      {categories.map(cat => (
                        <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                          <span className="text-sm font-medium text-gray-700">{cat}</span>
                          <button 
                            onClick={() => removeCategory(cat)} 
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            aria-label={`ลบหมวดหมู่ ${cat}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ชื่อรุ่นเรือใหม่..." 
                        value={newModelName} 
                        onChange={(e) => setNewModelName(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      <button onClick={addBoatModel} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all">เพิ่ม</button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-auto">
                      {boatModels.map(m => (
                        <div key={m} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                          <span className="text-sm font-medium text-gray-700">{m}</span>
                          <button 
                            onClick={() => removeBoatModel(m)} 
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            aria-label={`ลบรุ่นเรือ ${m}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">SKU</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">ชื่อสินค้า/บริการ</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-5 py-3">หมวดหมู่ / รุ่น</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-5 py-3">ราคาทุน</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-5 py-3">ราคาขาย</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-5 py-3">หน่วย</th>
                  <th className="w-[80px] px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="group hover:bg-teal-50/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono text-gray-500">{p.sku}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 uppercase tracking-tight">{p.category}</span>
                        {p.boatModel && (
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            p.boatModel === "ทุกรุ่น" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}>
                            MODEL: {p.boatModel}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-teal-700 text-right">{formatCurrencyValue(p.unitPrice)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-blue-700 text-right">{formatCurrencyValue(p.sellingPrice)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 text-center">{p.unit}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button 
                          onClick={() => openEditForm(p)} 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                          aria-label={`แก้ไขข้อมูล ${p.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002-2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        
                        {confirmDeleteId === p.id ? (
                          <button 
                            onClick={async () => {
                              await deleteProductionCost(p.id);
                              showToast(`ลบสินค้า ${p.name} สำเร็จ`, "success");
                              setConfirmDeleteId(null);
                            }} 
                            className="h-9 px-3 rounded-lg text-white bg-red-600 hover:bg-red-700 text-xs font-bold"
                          >
                            ลบ?
                          </button>
                        ) : (
                          <button 
                            onClick={() => setConfirmDeleteId(p.id)} 
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            aria-label={`ยืนยันเพื่อลบ ${p.name}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
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
  );
}

