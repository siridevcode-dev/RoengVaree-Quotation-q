"use client";

import React, { useState, useRef, useMemo } from "react";
import * as XLSX from "xlsx";

import { useAppContext, ProductionCost, Quotation } from "@/context/AppContext";
import { exportProductionCosts } from "@/lib/excel-export";

const formatCurrency = (val: number | undefined | null) => {
  if (val === undefined || val === null) return "฿0";
  return val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });
};

const formatNumber = (num: number | string) => {
  if (num === null || num === undefined || num === "" || isNaN(Number(num))) return "";
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const parseNumber = (str: string) => {
  return str.replace(/,/g, "");
};


interface ProductionCostsProps {
  onNavigate: (page: string, quotationId?: string) => void;
  initialQuotationId?: string;
}

export default function ProductionCosts({ onNavigate, initialQuotationId }: ProductionCostsProps) {
  const { 
    productionCosts, 
    addProductionCost, 
    updateProductionCost, 
    deleteProductionCost, 
    categories, 
    boatModels, 
    updateSettings, 
    showToast,
    quotations
  } = useAppContext();
  
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("ทั้งหมด");
  const [filterModel, setFilterModel] = useState("ทั้งหมด");
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [activeManagerTab, setActiveManagerTab] = useState<'categories' | 'models'>('categories');
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'projects' | 'items'>('projects');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  // Use state to track if we are viewing a specific project
  const [viewingQuotationId, setViewingQuotationId] = useState<string | null>(initialQuotationId !== undefined ? initialQuotationId : null);
  
  // Sync state with prop when navigation occurs
  React.useEffect(() => {
    setViewingQuotationId(initialQuotationId !== undefined ? initialQuotationId : null);
  }, [initialQuotationId]);

  const [formData, setFormData] = useState({ 
    name: "", 
    category: "เรือ", 
    unitPrice: 0, 
    sellingPrice: 0,
    unit: "", 
    description: "", 
    sku: "",
    boatModel: "ทุกรุ่น",
    quotationId: ""
  });

  const activeProject = useMemo(() => {
    if (!viewingQuotationId) return null;
    return quotations.find(q => q.id === viewingQuotationId);
  }, [quotations, viewingQuotationId]);

  const projectCosts = useMemo(() => {
    if (!viewingQuotationId) return [];
    const costs = productionCosts.filter(cp => cp.quotationId === viewingQuotationId);
    
    if (!activeProject?.lineItems) return costs;
    
    const merged = [...costs];
    activeProject.lineItems.forEach((li, idx) => {
      if (!li.name) return;
      const exists = costs.some(cp => cp.name === li.name);
      if (!exists) {
        // Try to find a standard cost (starting value) for this item
        const standardCost = productionCosts.find(pc => !pc.quotationId && pc.name === li.name);
        
        merged.push({
          id: `placeholder-${idx}-${li.id || Math.random()}`,
          name: li.name,
          category: li.category || "อื่นๆ",
          unitPrice: standardCost ? standardCost.unitPrice : 0,
          sellingPrice: li.unitPrice,
          unit: "ชุด",
          description: li.description || "รายการจากใบเสนอราคา (ยังไม่กำหนดต้นทุน)",
          sku: standardCost ? standardCost.sku : "-",
          inStock: true,
          quotationId: viewingQuotationId,
          isPlaceholder: true
        } as any);
      }
    });
    return merged;
  }, [productionCosts, activeProject, viewingQuotationId]);

  const allCategories = ["ทั้งหมด", ...categories];

  const filteredProjects = useMemo(() => {
    return quotations.filter((q: Quotation) => {
      const matchesSearch = q.id.toLowerCase().includes(search.toLowerCase()) || 
                           q.customer.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // If category or model filter is active
      if (filterCat === "ทั้งหมด" && filterModel === "ทั้งหมด") return true;
      
      const pCosts = productionCosts.filter(cp => cp.quotationId === q.id);
      
      // Category match
      const matchesCat = filterCat === "ทั้งหมด" || pCosts.some(cp => cp.category === filterCat);
      if (!matchesCat) return false;

      // Model match (either project model matches OR it has items matching the model filter)
      const matchesModel = filterModel === "ทั้งหมด" || 
                           q.boatModel === filterModel || 
                           pCosts.some(cp => cp.boatModel === filterModel || cp.boatModel === "ทุกรุ่น");
      
      return matchesModel;
    }).map((q: Quotation) => {
      const pCosts = productionCosts.filter(cp => cp.quotationId === q.id);
      const costTotal = pCosts.reduce((sum, cp) => sum + cp.unitPrice, 0);
      const profit = q.amount - costTotal;
      const margin = q.amount > 0 ? (profit / q.amount) * 100 : 0;
      
      return {
        ...q,
        costTotal,
        profit,
        margin,
        itemsCount: pCosts.length
      };
    });
  }, [quotations, productionCosts, search, filterCat, filterModel]);

  const filteredItems = useMemo(() => {
    return productionCosts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      const matchesCat = filterCat === "ทั้งหมด" || p.category === filterCat;
      if (!matchesCat) return false;

      // Only apply model filter for Standard and Optional categories, or if viewing all
      const matchesModel = filterModel === "ทั้งหมด" || p.boatModel === filterModel || p.boatModel === "ทุกรุ่น";
      return matchesModel;
    });
  }, [productionCosts, search, filterCat, filterModel]);

  const totals = useMemo(() => {
    const approvedQuotations = quotations.filter(q => q.status === "อนุมัติแล้ว");
    const approvedIds = new Set(approvedQuotations.map(q => q.id));
    
    const totalSelling = approvedQuotations.reduce((sum, q) => sum + q.amount, 0);
    
    // Sum production costs only for items that belong to an approved quotation
    const totalCost = productionCosts
      .filter(p => p.quotationId && approvedIds.has(p.quotationId))
      .reduce((sum, p) => sum + p.unitPrice, 0);
      
    const totalProfit = totalSelling - totalCost;
    const avgMargin = totalSelling > 0 ? (totalProfit / totalSelling) * 100 : 0;
    
    return { 
      totalSelling, 
      totalCost, 
      totalProfit, 
      avgMargin, 
      projectCount: approvedQuotations.length 
    };
  }, [quotations, productionCosts]);

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
      boatModel: defaultModel,
      quotationId: viewingQuotationId || ""
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openProjectDetails = (qId: string) => {
    onNavigate("Production Cost Detail", qId);
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
      boatModel: p.boatModel || "ทุกรุ่น",
      quotationId: p.quotationId || ""
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const saveCost = async () => {
    if (!formData.name.trim()) {
      showToast("กรุณากรอกชื่อรายการต้นทุน", "error");
      return;
    }
    try {
      if (editingId && typeof editingId === 'number') {
        await updateProductionCost(editingId, {
          name: formData.name,
          category: formData.category,
          unitPrice: formData.unitPrice,
          sellingPrice: formData.sellingPrice,
          unit: formData.unit,
          description: formData.description,
          sku: formData.sku,
          boatModel: formData.boatModel,
          quotationId: formData.quotationId
        });
        showToast("อัปเดตข้อมูลต้นทุนสำเร็จ", "success");
      } else {
        await addProductionCost({
          name: formData.name,
          category: formData.category,
          unitPrice: formData.unitPrice,
          sellingPrice: formData.sellingPrice,
          unit: formData.unit,
          description: formData.description,
          sku: formData.sku,
          boatModel: formData.boatModel,
          quotationId: formData.quotationId,
          inStock: true
        });
        showToast("เพิ่มรายการต้นทุนใหม่เรียบร้อยแล้ว", "success");
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
    const isUsed = productionCosts.some(p => p.category === cat);
    if (isUsed) {
      showToast("ไม่สามารถลบได้เนื่องจากมีรายการในหมวดหมู่นี้", "error");
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
    const isUsed = productionCosts.some(p => p.boatModel === model);
    if (isUsed) {
      if (confirm(`รุ่นเรือ "${model}" ถูกใช้งานอยู่โดยรายการบางรายการ คุณแน่ใจหรือไม่ว่าต้องการลบ? (รายการจะถูกเปลี่ยนเป็น "ทุกรุ่น")`)) {
      } else {
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

        const newCosts: Omit<ProductionCost, "id">[] = [];
        const foundCategories = new Set<string>();
        const foundModels = new Set<string>();

        data.forEach((row, index) => {
          const name = row["ชื่อรายการ"] || row["ชื่อสินค้า"] || row["name"];
          if (!name) return;

          const category = row["หมวดหมู่"] || row["category"] || "อื่นๆ";
          const boatModel = row["รุ่นเรือ"] || row["model"] || "ทุกรุ่น";
          const sku = row["SKU"] || row["sku"] || `CST-${Date.now()}-${index}`;
          
          foundCategories.add(category);
          if (boatModel !== "ทุกรุ่น") foundModels.add(boatModel);

          newCosts.push({
            name: String(name),
            category: String(category),
            boatModel: String(boatModel),
            unitPrice: Number(row["ราคาต้นทุน"] || row["ราคา"] || row["price"] || 0),
            unit: String(row["หน่วย"] || row["unit"] || "ชุด"),
            description: String(row["รายละเอียด"] || row["description"] || ""),
            sku: String(sku),
            inStock: true
          });
        });

        if (newCosts.length === 0) {
          showToast("ไม่พบข้อมูลที่ถูกต้องในไฟล์", "error");
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

        for (const p of newCosts) {
          await addProductionCost(p);
        }
        showToast(`นำเข้าข้อมูลต้นทุนสำเร็จ ${newCosts.length} รายการ`, "success");
        setShowForm(false);
        
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        console.error("Excel Import Error:", err);
        showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel", "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- DETAIL VIEW RENDERING ---
  if (viewingQuotationId !== null) {
    const q = activeProject;
    const totalCost = projectCosts.reduce((sum, cp) => sum + cp.unitPrice, 0);
    const totalSelling = projectCosts.reduce((sum, cp) => sum + (cp.sellingPrice || 0), 0);
    const profit = totalSelling - totalCost;

    return (
      <div className="flex-1 overflow-auto bg-gray-50/50">
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate("Production costs")}
                aria-label="กลับไปยังหน้ารายการต้นทุนทั้งหมด"
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#283583] hover:border-[#283583] hover:bg-blue-50 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  โครงการ: <span className="text-[#283583]">{viewingQuotationId || "(ไม่มีเลขที่โครงการ)"}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">
                  ลูกค้า: <span className="text-gray-700">{q?.customer || "ไม่พบข้อมูลลูกค้า"}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate("Quotation Form", viewingQuotationId)}
                className="px-5 py-2.5 bg-white text-[#283583] border border-blue-100 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                เปิดใบเสนอราคา
              </button>
              <button 
                onClick={openAddForm}
                className="px-5 py-2.5 bg-[#283583] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#1a2357] transition-all shadow-md shadow-blue-900/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                เพิ่มรายการต้นทุน
              </button>
            </div>
          </div>

          {/* Project Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-blue-500 transition-all hover:shadow-md">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> ราคาขายรวม (Total Selling)
              </p>
              <p className="text-3xl font-black text-gray-900">{formatCurrency(totalSelling)}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-teal-500 transition-all hover:shadow-md">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> ต้นทุนรวม (Total Cost)
              </p>
              <p className="text-3xl font-black text-teal-700">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500 transition-all hover:shadow-md">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> กำไรสุทธิ (Net Profit)
              </p>
              <p className={`text-3xl font-black ${profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatCurrency(profit)}</p>
            </div>
          </div>

          {/* Items Table (Quotation Form Style) */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl mb-12">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="sticky top-0 z-10 bg-gray-50 text-left text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest">Item Description (รายละเอียดรายการ)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[180px]">SKU / Model (รหัส / รุ่น)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[150px]">Selling (ราคาขาย)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[150px]">Cost Price (ราคาทุน)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[150px]">Profit (กำไร)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 w-[100px] px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {["เรือ", "ซ่อมเรือ", "เครื่องยนต์", "มาตรฐาน", "อุปกรณ์เสริม", "อื่นๆ"].map(catKey => {
                    const items = projectCosts.filter(cp => {
                      if (catKey === "เรือ") return cp.category === "เรือ" || cp.category === "สินค้าหลัก";
                      if (catKey === "อื่นๆ") {
                        return !["เรือ", "ซ่อมเรือ", "เครื่องยนต์", "มาตรฐาน", "อุปกรณ์เสริม"].includes(cp.category);
                      }
                      return cp.category === catKey;
                    });

                    if (items.length === 0) return null;

                    const title = catKey === "เรือ" ? "IN PRODUCT (สินค้าหลัก)" :
                                  catKey === "มาตรฐาน" ? "STANDARD EQUIPMENT (รายการมาตรฐาน)" :
                                  catKey === "อุปกรณ์เสริม" ? "OPTIONAL EQUIPMENT (อุปกรณ์เสริม)" : 
                                  catKey === "เครื่องยนต์" ? "ENGINE (เครื่องยนต์)" :
                                  catKey === "ซ่อมเรือ" ? "BOAT REPAIR (ซ่อมเรือ)" : `${catKey.toUpperCase()} ITEMS (รายการ${catKey})`;
                    
                    const colorClass = (catKey === "เรือ") ? "bg-[#283583] shadow-[0_0_8px_rgba(40,53,131,0.5)]" :
                                      catKey === "มาตรฐาน" ? "bg-blue-500" : 
                                      catKey === "อุปกรณ์เสริม" ? "bg-emerald-500" : 
                                      catKey === "เครื่องยนต์" ? "bg-amber-500" :
                                      catKey === "ซ่อมเรือ" ? "bg-rose-500" : "bg-gray-400";

                    const textClass = (catKey === "เรือ") ? "text-[#283583]" :
                                      catKey === "มาตรฐาน" ? "text-blue-700" : 
                                      catKey === "อุปกรณ์เสริม" ? "text-emerald-700" :
                                      catKey === "เครื่องยนต์" ? "text-amber-700" :
                                      catKey === "ซ่อมเรือ" ? "text-rose-700" : "text-gray-500";

                    return (
                      <React.Fragment key={catKey}>
                        <tr className="bg-gray-50/50">
                          <td colSpan={6} className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
                              <span className={`text-[11px] font-black uppercase tracking-widest ${textClass}`}>
                                {title}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {items.map((cp) => (
                          <tr key={cp.id} className="group hover:bg-gray-50 transition-all">
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#283583] transition-colors">{cp.name}</span>
                                  {(cp as any).isPlaceholder && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-black uppercase tracking-tighter animate-pulse">
                                      ยังไม่ระบุต้นทุน
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400 mt-1">{cp.description || "ไม่มีรายละเอียด"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-mono font-bold text-gray-400">{cp.sku}</span>
                                {cp.boatModel && (
                                  <span className={`w-fit px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${cp.boatModel === "ทุกรุ่น" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                                    {cp.boatModel}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-gray-900">{formatCurrency(cp.sellingPrice || 0)}</td>
                            <td className="px-6 py-5 text-right font-black text-teal-700">
                              {(cp as any).isPlaceholder ? (
                                <button 
                                  onClick={() => openEditForm(cp)}
                                  className="text-[10px] text-amber-600 hover:text-amber-700 font-bold underline decoration-dotted"
                                >
                                  ตั้งต้นทุน
                                </button>
                              ) : (
                                formatCurrency(cp.unitPrice)
                              )}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className={`font-black ${(cp.sellingPrice || 0) - cp.unitPrice >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                {(cp as any).isPlaceholder ? "-" : formatCurrency((cp.sellingPrice || 0) - cp.unitPrice)}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all justify-end">
                                <button 
                                  onClick={() => openEditForm(cp)} 
                                  aria-label={`แก้ไข ${cp.name}`}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#283583] hover:bg-white border border-transparent hover:border-blue-100"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button 
                                  onClick={() => { setConfirmDeleteId(cp.id); setTimeout(() => setConfirmDeleteId(null), 3000); }} 
                                  aria-label={`ลบ ${cp.name}`}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-red-100"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {projectCosts.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No production costs linked to this project (ไม่มีรายการต้นทุนในโครงการนี้)</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Overlay (Scoped to Detail View too) */}
        {showForm && renderForm()}
      </div>
    );
  }

  // --- MAIN LIST VIEW RENDERING ---
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-2xl w-fit border border-gray-200/50 shadow-sm">
          <button
            onClick={() => setViewMode('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
              viewMode === 'projects' 
                ? 'bg-white text-[#283583] shadow-md shadow-blue-900/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            ดูโครงการ
          </button>
          <button
            onClick={() => setViewMode('items')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
              viewMode === 'items' 
                ? 'bg-white text-[#283583] shadow-md shadow-blue-900/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            ตั้งค่าต้นทุน
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {viewMode === 'projects' ? 'การบริหารต้นทุนรายโครงการ' : 'การตั้งค่าต้นทุน'}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
              {viewMode === 'projects' 
                ? `วิเคราะห์และจัดการต้นทุนแยกตามใบเสนอราคา (${quotations.length} โครงการ)` 
                : `จัดการข้อมูลต้นทุนทั้งหมด (${productionCosts.length} รายการ)`}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <input 
              id="excel-import-input"
              type="file" 
              ref={fileInputRef} 
              onChange={handleExcelImport} 
              accept=".xlsx, .xls" 
              className="hidden" 
              aria-label="เลือกไฟล์ Excel สำหรับนำเข้าข้อมูลต้นทุน"
              title="เลือกไฟล์ Excel สำหรับนำเข้าข้อมูลต้นทุน"
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-teal-700 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 transition-all active:scale-[0.98] shadow-sm"
              title="นำเข้าจากไฟล์ Excel (.xlsx)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="hidden sm:inline">นำเข้า</span> Excel
            </button>
            <button 
              onClick={() => exportProductionCosts(productionCosts)} 
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-sm"
              title="ส่งออกข้อมูลต้นทุนเป็นไฟล์ Excel (.xlsx)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="hidden sm:inline">ส่งออก</span> Excel
            </button>
            


            <button onClick={() => setShowCategoryManager(true)} className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-all active:scale-[0.98]" title="จัดการหมวดหมู่และรุ่นเรือ">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <span className="hidden sm:inline">จัดการ</span>ระบบ
            </button>



            <button 
              onClick={openAddForm} 
              className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 active:scale-[0.98]"
              aria-label="เพิ่มรายการต้นทุนใหม่"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              เพิ่มรายการต้นทุน
            </button>
          </div>
        </div>

        {/* Summary Cards - Only show in Projects view */}
        {viewMode === 'projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md border-l-4 border-l-blue-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> มูลค่าโครงการรวม (Total Revenue)
              </p>
              <p className="text-2xl font-black text-gray-900">
                {formatCurrency(totals.totalSelling)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 font-bold">{totals.projectCount} โครงการทั้งหมด</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md border-l-4 border-l-teal-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> ต้นทุนการผลิตรวม (Total Production Cost)
              </p>
              <p className="text-2xl font-black text-teal-700">
                {formatCurrency(totals.totalCost)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 font-bold">ต้นทุนสะสมทุกโครงการ</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md border-l-4 border-l-emerald-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> กำไรสุทธิคาดการณ์ (Est. Net Profit)
              </p>
              <p className={`text-2xl font-black ${totals.totalProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatCurrency(totals.totalProfit)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 font-bold">กำไรเฉลี่ย {totals.avgMargin.toFixed(1)}%</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md border-l-4 border-l-indigo-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> อัตรากำไรเฉลี่ย (Avg. Margin)
              </p>
              <p className="text-2xl font-black text-indigo-700">
                {totals.avgMargin.toFixed(1)}%
              </p>
              <p className="text-[10px] text-gray-400 mt-1 font-bold">จากมูลค่าขายทั้งหมด</p>
            </div>
          </div>
        )}

        {/* Category Filters (ตั้งค่าต้นทุน) */}
        <div id="category-filter-section" className="flex flex-col gap-3 scroll-mt-20">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>
            ตัวกรองหมวดหมู่ต้นทุน
          </p>
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit border border-gray-200/50">
            {["ทั้งหมด", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilterCat(cat);
                  setFilterModel("ทั้งหมด");
                }}
                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95 ${
                  filterCat === cat
                    ? "bg-[#14b8a6] text-white shadow-lg shadow-teal-600/20"
                    : "text-gray-600 hover:bg-gray-200/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Boat Model Filters (Secondary) - Added to match Product List */}
        {(filterCat === "มาตรฐาน" || filterCat === "อุปกรณ์เสริม") && (
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">ประเภทเรือ:</span>
            <div className="flex gap-2">
              {["ทั้งหมด", ...boatModels, "ทุกรุ่น"].map((m) => (
                <button 
                  key={m} 
                  onClick={() => setFilterModel(m)} 
                  className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                    filterModel === m 
                      ? "bg-[#283583] text-white shadow-md shadow-blue-900/20" 
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {m === "ทุกรุ่น" ? "ใช้ได้ทุกรุ่น" : m === "ทั้งหมด" ? "แสดงทั้งหมด" : m}
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative flex-1 min-w-[280px]">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              id="project-search-input"
              type="text" 
              placeholder="ค้นหาเลขที่โครงการ หรือ ชื่อลูกค้า..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283583]/30 focus:border-[#283583] transition-all" 
              aria-label="ค้นหาเลขที่โครงการ หรือ ชื่อลูกค้า"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="project-sort-select" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">เรียงตาม:</label>
            <select id="project-sort-select" aria-label="เรียงลำดับโครงการ" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 focus:outline-none">
              <option value="latest">โครงการล่าสุด</option>
              <option value="high-value">มูลค่าสูงสุด</option>
              <option value="high-profit">กำไรสูงสุด</option>
            </select>
          </div>
        </div>

        {/* Grouped Table View */}
        {/* Main Content Area */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl mb-12">
          {viewMode === 'projects' ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="sticky top-0 z-10 bg-gray-50 text-left text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest">ID / Project (เลขที่โครงการ)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[160px]">Selling Price (ราคาขายรวม)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[160px]">Production Cost (ต้นทุนรวม)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[160px]">Est. Profit (กำไรคาดการณ์)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[100px]">Margin (กำไร %)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[120px]">Status (สถานะ)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 w-[80px] px-4 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProjects.map((q: any) => (
                    <tr 
                      key={q.id} 
                      className="group hover:bg-blue-50/30 transition-all cursor-pointer"
                      onClick={() => openProjectDetails(q.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#283583]">{q.id || "(ไม่มีเลขที่)"}</span>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{q.date}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-700 mt-0.5">{q.customer}</span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Items: {q.itemsCount}</span>
                            {q.boatModel && <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-50 px-1 rounded">{q.boatModel}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-gray-900">{formatCurrency(q.amount)}</td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-black text-teal-700 bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100">{formatCurrency(q.costTotal)}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`text-sm font-black ${q.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {formatCurrency(q.profit)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 text-[11px] font-black ${
                          q.margin >= 30 ? "text-emerald-600 border-emerald-100 bg-emerald-50" : 
                          q.margin >= 15 ? "text-blue-600 border-blue-100 bg-blue-50" : 
                          "text-red-600 border-red-100 bg-red-50"
                        }`}>
                          {q.margin.toFixed(0)}%
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm border ${
                          q.status === "อนุมัติแล้ว" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          q.status === "ฉบับร่าง" ? "bg-gray-50 text-gray-500 border-gray-200" :
                          "bg-blue-50 text-blue-600 border-blue-100"
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <button 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#283583] group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-blue-100"
                          onClick={() => openProjectDetails(q.id)}
                          aria-label={`ดูรายละเอียดต้นทุนโครงการ ${q.id}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest">ไม่พบโครงการที่ตรงกับเงื่อนไข</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="sticky top-0 z-10 bg-gray-50 text-left text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest">Item Description (รายละเอียดรายการ)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[180px]">SKU / Model (รหัส / รุ่น)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[150px]">Cost Price (ราคาทุน)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-right text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[150px]">Selling Price (ราคาขาย)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center text-[11px] font-black text-gray-500 px-6 py-5 uppercase tracking-widest w-[150px]">Source (ที่มา)</th>
                    <th className="sticky top-0 z-10 bg-gray-50 w-[100px] px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((p: ProductionCost) => (
                    <tr key={p.id} className="group hover:bg-gray-50 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 group-hover:text-[#283583] transition-colors">{p.name}</span>
                          <span className="text-xs text-gray-400 mt-1">{p.description || "ไม่มีรายละเอียด"}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[9px] font-black uppercase">{p.category}</span>
                            <span className="text-[9px] text-gray-400 font-bold">หน่วย: {p.unit || "-"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-mono font-bold text-gray-400">{p.sku}</span>
                          {p.boatModel && (
                            <span className={`w-fit px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${p.boatModel === "ทุกรุ่น" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                              {p.boatModel}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-teal-700">{formatCurrency(p.unitPrice)}</td>
                      <td className="px-6 py-5 text-right font-bold text-gray-900">{formatCurrency(p.sellingPrice || 0)}</td>
                      <td className="px-6 py-5 text-center">
                        {p.quotationId ? (
                          <button 
                            onClick={() => openProjectDetails(p.quotationId!)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#283583] text-[10px] font-black uppercase tracking-tight border border-blue-100 hover:bg-blue-100 transition-all shadow-sm"
                            title={`คลิกเพื่อไปที่การจัดการต้นทุนของโครงการ ${p.quotationId}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            ปรับแก้รายโครงการ: {p.quotationId}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                            ต้นทุนมาตรฐาน
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all justify-end">
                          <button 
                            onClick={() => openEditForm(p)} 
                            aria-label={`แก้ไข ${p.name}`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#283583] hover:bg-white border border-transparent hover:border-blue-100"
                          >
                            <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button 
                            onClick={() => { setConfirmDeleteId(p.id); setTimeout(() => setConfirmDeleteId(null), 3000); }} 
                            aria-label={`ลบ ${p.name}`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-red-100"
                          >
                            <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest">ไม่พบรายการต้นทุนที่ตรงกับเงื่อนไข</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form & Managers */}
      {showForm && renderForm()}
      {showCategoryManager && renderManager()}
    </div>
  );

  // --- SUB-RENDERERS ---
  function renderForm() {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 bg-gradient-to-r from-[#283583] to-[#4f46e5] flex-shrink-0 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{editingId ? "แก้ไขรายการต้นทุน" : "เพิ่มรายการต้นทุนใหม่"}</h3>
            <button onClick={() => setShowForm(false)} aria-label="ปิดหน้าต่าง" className="text-white/70 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="form-name" className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-widest">ชื่อรายการต้นทุน *</label>
                  <input id="form-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-modern w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-category" className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-widest">หมวดหมู่</label>
                    <select id="form-category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-modern w-full">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="form-boat-model" className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-widest">รุ่นเรือ</label>
                    <select id="form-boat-model" value={formData.boatModel} onChange={(e) => setFormData({ ...formData, boatModel: e.target.value })} className="input-modern w-full">
                      <option value="ทุกรุ่น">ทุกรุ่น</option>
                      {boatModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="form-quotation-id" className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-widest">โครงการ (Quotation ID)</label>
                  <input id="form-quotation-id" type="text" value={formData.quotationId} onChange={(e) => setFormData({ ...formData, quotationId: e.target.value })} placeholder="เช่น QT-2024-001" className="input-modern w-full font-mono text-xs" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-unit-price" className="text-xs font-bold text-teal-600 mb-1.5 block uppercase tracking-widest">ราคาต้นทุน (฿)</label>
                    <input 
                      id="form-unit-price" 
                      type="text" 
                      value={formatNumber(formData.unitPrice)} 
                      onChange={(e) => {
                        const val = parseNumber(e.target.value);
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          setFormData({ ...formData, unitPrice: val === "" ? 0 : Number(val) });
                        }
                      }} 
                      className="input-modern w-full border-teal-200 focus:ring-teal-500/20" 
                    />
                  </div>
                  <div>
                    <label htmlFor="form-selling-price" className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-widest">ราคาขาย (฿)</label>
                    <input 
                      id="form-selling-price" 
                      type="text" 
                      value={formatNumber(formData.sellingPrice)} 
                      onChange={(e) => {
                        const val = parseNumber(e.target.value);
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          setFormData({ ...formData, sellingPrice: val === "" ? 0 : Number(val) });
                        }
                      }} 
                      className="input-modern w-full" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="form-unit" className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-widest">หน่วย</label>
                  <input id="form-unit" type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="ชุด, ชิ้น, บริการ" className="input-modern w-full" />
                </div>
                <div>
                  <label htmlFor="form-description" className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-widest">รายละเอียด</label>
                  <textarea id="form-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="input-modern w-full resize-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">ยกเลิก</button>
            <button onClick={saveCost} className="px-8 py-2.5 bg-gradient-to-r from-[#283583] to-[#4f46e5] text-white rounded-xl text-sm font-black shadow-lg shadow-blue-900/20 active:scale-95 transition-all">บันทึกข้อมูล</button>
          </div>
        </div>
      </div>
    );
  }

  function renderManager() {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowCategoryManager(false)}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 bg-[#283583] text-white flex justify-between items-center">
            <h3 className="font-bold uppercase tracking-widest text-sm">จัดการระบบ</h3>
            <button onClick={() => setShowCategoryManager(false)} aria-label="ปิดหน้าต่าง"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex border-b border-gray-100">
            <button onClick={() => setActiveManagerTab('categories')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeManagerTab === 'categories' ? "text-[#283583] border-b-2 border-[#283583] bg-blue-50/50" : "text-gray-400"}`}>หมวดหมู่</button>
            <button onClick={() => setActiveManagerTab('models')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeManagerTab === 'models' ? "text-[#283583] border-b-2 border-[#283583] bg-blue-50/50" : "text-gray-400"}`}>รุ่นเรือ</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-2">
              <input id="manager-add-input" type="text" placeholder="เพิ่มใหม่..." value={activeManagerTab === 'categories' ? newCategoryName : newModelName} onChange={(e) => activeManagerTab === 'categories' ? setNewCategoryName(e.target.value) : setNewModelName(e.target.value)} className="input-modern flex-1" aria-label={activeManagerTab === 'categories' ? "เพิ่มหมวดหมู่ใหม่" : "เพิ่มรุ่นเรือใหม่"} />
              <button onClick={activeManagerTab === 'categories' ? addCategory : addBoatModel} className="px-5 py-2 bg-[#283583] text-white rounded-xl font-bold text-xs uppercase shadow-md active:scale-95 transition-all">เพิ่ม</button>
            </div>
            <div className="space-y-1 max-h-[300px] overflow-auto pr-2">
              {(activeManagerTab === 'categories' ? categories : boatModels).map(item => (
                <div key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl group transition-all">
                  <span className="text-sm font-bold text-gray-700">{item}</span>
                  <button onClick={() => activeManagerTab === 'categories' ? removeCategory(item) : removeBoatModel(item)} aria-label={`ลบ ${item}`} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
