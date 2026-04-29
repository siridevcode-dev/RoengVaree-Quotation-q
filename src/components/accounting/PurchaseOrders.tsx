"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useAppContext, PurchaseOrder, PurchaseOrderItem } from "@/context/AppContext";
import PurchaseOrderDocument from "./PurchaseOrderDocument";
import { exportPurchaseOrders } from "@/lib/excel-export";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

interface PurchaseOrdersProps {
  onNavigate?: (page: string) => void;
  initialQuotationId?: string;
  initialType?: "PO" | "PR";
}

const statusOptions = ["ทั้งหมด", "ฉบับร่าง", "ส่งแล้ว", "รอดำเนินการ", "อนุมัติแล้ว", "ปฏิเสธ"];
const statusColor: Record<string, string> = {
  "อนุมัติแล้ว": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "รอดำเนินการ": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "ส่งแล้ว": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  "ฉบับร่าง": "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  "ปฏิเสธ": "bg-red-50 text-red-600 ring-1 ring-red-200",
};

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

export default function PurchaseOrders({ onNavigate, initialQuotationId, initialType }: PurchaseOrdersProps) {
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, currentUser, quotations, showToast } = useAppContext();
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PO" | "PR">(initialType || "ALL");
  
  useEffect(() => {
    if (initialType) {
      setFilterType(initialType);
    }
  }, [initialType]);
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewOrder, setPreviewOrder] = useState<PurchaseOrder | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initializedRef = useRef<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    type: "PR",
    status: "ฉบับร่าง",
    priority: "ปกติ",
    date: new Date().toLocaleDateString("th-TH"),
    lineItems: [],
    totalAmount: 0,
  });

  useEffect(() => {
    if (initialQuotationId && initializedRef.current !== initialQuotationId) {
      const quotation = quotations.find(q => q.id === initialQuotationId);
      if (!quotation) return;

      const mappedItems = quotation.lineItems?.map(item => ({
        name: item.name,
        description: item.description || "",
        quantity: item.quantity,
        unit: item.unit || "ชิ้น",
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice
      })) || [];

      const total = mappedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      setFormData({
        type: initialType || "PR",
        status: "ฉบับร่าง",
        priority: "ปกติ",
        date: new Date().toLocaleDateString("th-TH"),
        lineItems: mappedItems,
        totalAmount: total,
        supplierName: "",
        title: `เอกสารสำหรับใบเสนอราคา ${initialQuotationId}`,
        quotationId: initialQuotationId,
      });
      setEditingId(null);
      setIsFormOpen(true);
      initializedRef.current = initialQuotationId;
    }
  }, [initialQuotationId, initialType, quotations]);

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchSearch = po.id.toLowerCase().includes(search.toLowerCase()) || 
                          po.title.toLowerCase().includes(search.toLowerCase()) ||
                          po.supplierName.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "ALL" || po.type === filterType;
      const matchStatus = filterStatus === "ทั้งหมด" || po.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [purchaseOrders, search, filterType, filterStatus]);

  const handleOpenForm = (po?: PurchaseOrder) => {
    if (po) {
      setFormData(po);
      setEditingId(po.id);
    } else {
      setFormData({
        type: filterType === "PO" ? "PO" : "PR",
        status: "ฉบับร่าง",
        priority: "ปกติ",
        date: new Date().toLocaleDateString("th-TH"),
        lineItems: [],
        totalAmount: 0,
        supplierName: "",
        title: "",
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.supplierName) {
      showToast("กรุณากรอกหัวข้อและชื่อผู้จัดจำหน่าย", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      // Recalculate total
      const total = formData.lineItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
      
      if (editingId && editingId.trim() !== "") {
        await updatePurchaseOrder(editingId, { ...formData, totalAmount: total });
      } else {
        const prefix = formData.type === "PO" ? "PO" : "PR";
        const dateStr = new Date().getFullYear() + (new Date().getMonth() + 1).toString().padStart(2, '0');
        const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
        const id = `${prefix}-${dateStr}-${randomPart}`;
        
        await addPurchaseOrder({ 
          ...formData, 
          id, 
          type: prefix as any,
          status: "ฉบับร่าง",
          date: new Date().toLocaleDateString("th-TH"),
          requestedBy: currentUser?.name || "System",
        } as PurchaseOrder);
        setEditingId(id);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Save PR/PO failed:", err);
      // AppContext already shows toast for API errors
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบเอกสารนี้ใช่หรือไม่?")) {
      await deletePurchaseOrder(id);
    }
  };

  const handlePreview = (po: PurchaseOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewOrder(po);
  };

  const handleDownloadPdf = async () => {
    if (!pdfRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const element = pdfRef.current;
      const renderScale = 1.6;
      const canvas = await html2canvas(element, {
        scale: renderScale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4", compress: true });
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const scaleFactor = canvas.width / pdfPageWidth;
      const pageHeightInCanvas = Math.floor(pdfPageHeight * scaleFactor);
      const rowRects: { top: number; bottom: number }[] = [];
      const elRect = element.getBoundingClientRect();
      const avoidEls = element.querySelectorAll("tr, .page-break-avoid");
      avoidEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        rowRects.push({ top: Math.round((rect.top - elRect.top) * renderScale), bottom: Math.round((rect.bottom - elRect.top) * renderScale) });
      });
      const totalCanvasHeight = canvas.height;
      let contentY = 0;
      let pageNum = 0;
      while (contentY < totalCanvasHeight) {
        if (pageNum > 0) pdf.addPage();
        let contentSlice = Math.min(pageHeightInCanvas, totalCanvasHeight - contentY);
        const finalSliceEnd = contentY + contentSlice;
        if (finalSliceEnd < totalCanvasHeight) {
          for (const row of rowRects) {
            if (row.top > contentY && row.top < finalSliceEnd && row.bottom > finalSliceEnd) {
              const adj = row.top - contentY;
              if (adj > 0) contentSlice = adj;
              break;
            }
          }
        }
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = contentSlice;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) { contentY += contentSlice; pageNum++; continue; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, contentSlice);
        ctx.drawImage(canvas, 0, contentY, canvas.width, contentSlice, 0, 0, canvas.width, contentSlice);
        const renderHeight = contentSlice / scaleFactor;
        pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.8), "JPEG", 0, 0, pdfPageWidth, renderHeight, undefined, "FAST");
        contentY += contentSlice;
        pageNum++;
      }
      const totalPages = pdf.getNumberOfPages();
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`${i} / ${totalPages}`, pdfPageWidth - 40, pdfPageHeight - 10);
        }
      }
      pdf.save(`${previewOrder?.type}_${previewOrder?.id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleConvertToPO = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!previewOrder || previewOrder.type !== "PR") return;
    
    const dateStr = new Date().getFullYear() + (new Date().getMonth() + 1).toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    const newId = `PO-${dateStr}-${randomPart}`;
    
    const newPO = {
      ...previewOrder,
      id: newId,
      type: "PO" as const,
      status: "ฉบับร่าง",
      date: new Date().toLocaleDateString("th-TH"),
      quotationId: previewOrder.quotationId || previewOrder.id,
      requestedBy: currentUser?.name || previewOrder.requestedBy,
    };
    
    await addPurchaseOrder(newPO);
    setPreviewOrder(newPO);
    showToast(`แปลงเป็นใบสั่งซื้อ ${newId} สำเร็จ!`, "success");
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...(prev.lineItems || []), { name: "", quantity: 1, unit: "ชิ้น", unitPrice: 0, totalPrice: 0 }]
    }));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setFormData(prev => {
      const newItems = [...(prev.lineItems || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = Number(newItems[index].quantity) || 0;
        const price = Number(newItems[index].unitPrice) || 0;
        newItems[index].totalPrice = qty * price;
      }
      
      const newTotal = newItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      return { ...prev, lineItems: newItems, totalAmount: newTotal };
    });
  };

  const removeItem = (index: number) => {
    setFormData(prev => {
      const newItems = (prev.lineItems || []).filter((_, i) => i !== index);
      const newTotal = newItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      return { ...prev, lineItems: newItems, totalAmount: newTotal };
    });
  };

  if (isFormOpen) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50/40 p-4 md:p-6 animate-fade-in">
        <div className="max-w-[1000px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">{editingId ? "แก้ไขเอกสาร" : "สร้างเอกสารใหม่"}</h1>
              <p className="page-subtitle mt-1">กรอกข้อมูลให้ครบถ้วน</p>
            </div>
            <button onClick={() => setIsFormOpen(false)} className="btn-secondary">ยกเลิก</button>
          </div>

          <div className="card p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">ประเภทเอกสาร</label>
                <select 
                  title="ประเภทเอกสาร"
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value as "PO" | "PR"})}
                  className="input-modern"
                  disabled={!!editingId}
                  aria-label="ประเภทเอกสาร"
                >

                  <option value="PR">Purchase Requisition (ใบขอซื้อ)</option>
                  <option value="PO">Purchase Order (ใบสั่งซื้อ)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">สถานะ</label>
                <select 
                  title="สถานะ"
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="input-modern"
                  aria-label="สถานะ"
                >

                  {statusOptions.filter(s => s !== "ทั้งหมด").map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">หัวข้อเอกสาร *</label>
                <input 
                  type="text" 
                  value={formData.title || ""} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-modern"
                  placeholder="เช่น สั่งซื้ออะไหล่เครื่องยนต์"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ผู้จัดจำหน่าย (Supplier) *</label>
                <input 
                  type="text" 
                  value={formData.supplierName || ""} 
                  onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                  className="input-modern"
                  placeholder="ชื่อบริษัท/ร้านค้า"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">อ้างอิงใบเสนอราคา (ถ้ามี)</label>
                <input 
                  type="text" 
                  value={formData.quotationId || ""} 
                  onChange={(e) => setFormData({...formData, quotationId: e.target.value})}
                  className="input-modern"
                  placeholder="เลขที่ใบเสนอราคาอ้างอิง"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">รายการสินค้า</h3>
                <button onClick={addItem} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">+ เพิ่มรายการ</button>
              </div>
              
              <div className="space-y-3">
                {formData.lineItems?.map((item, index) => (
                  <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="w-full md:flex-1">
                      <input type="text" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} className="input-modern w-full" placeholder="ชื่อสินค้า/บริการ" />
                    </div>
                    <div className="w-24">
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="input-modern w-full" placeholder="จำนวน" min="1" />
                    </div>
                    <div className="w-24">
                      <input type="text" value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)} className="input-modern w-full" placeholder="หน่วย" />
                    </div>
                    <div className="w-32">
                      <input type="number" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', e.target.value)} className="input-modern w-full" placeholder="ราคาต่อหน่วย" min="0" />
                    </div>
                    <div className="w-32 text-right font-bold text-gray-800">
                      {formatCurrency(item.totalPrice || 0)}
                    </div>
                    <button onClick={() => removeItem(index)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg" aria-label="ลบรายการ">
                      ✕
                    </button>
                  </div>
                ))}
                {(!formData.lineItems || formData.lineItems.length === 0) && (
                  <p className="text-center text-gray-400 py-4 text-sm">ยังไม่มีรายการ</p>
                )}
              </div>
              
              <div className="mt-4 flex justify-end">
                <div className="bg-indigo-50 px-6 py-3 rounded-xl inline-flex items-center gap-4">
                  <span className="font-semibold text-indigo-900">ยอดรวมทั้งสิ้น</span>
                  <span className="text-xl font-bold text-indigo-600">{formatCurrency(formData.totalAmount || 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
              <button onClick={() => setIsFormOpen(false)} className="btn-secondary">ยกเลิก</button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary min-w-[120px]">
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : "บันทึกข้อมูล"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="flex-1 overflow-auto bg-gray-50/40">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-5 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="page-title">Purchase Requisition / Order</h1>
            <p className="page-subtitle mt-1">จัดการใบขอซื้อและใบสั่งซื้อ</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => exportPurchaseOrders(purchaseOrders)}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-sm"
              title="ส่งออกเป็นไฟล์ Excel (.xlsx)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Excel
            </button>
            <button onClick={() => handleOpenForm()} className="btn-primary flex-1 sm:flex-none">
              + สร้างเอกสารใหม่
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="ค้นหาเลขที่, หัวข้อ หรือ ชื่อผู้จัดจำหน่าย..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-modern pl-9" />
            </div>
            
            <div className="flex gap-2">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="input-modern w-32" aria-label="กรองตามประเภท">
                <option value="ALL">ทุกประเภท</option>
                <option value="PR">PR (ขอซื้อ)</option>
                <option value="PO">PO (สั่งซื้อ)</option>
              </select>
              
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-modern w-36" aria-label="กรองตามสถานะ">
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">เลขที่</th>
                  <th className="text-center">ประเภท</th>
                  <th className="text-left">หัวข้อเอกสาร</th>
                  <th className="text-left">ผู้จัดจำหน่าย</th>
                  <th className="text-right">จำนวนเงิน</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-right">วันที่</th>
                  <th className="w-20 px-4" />
                </tr>
              </thead>
            <tbody>
              {filteredOrders.map((po) => (
                <tr key={po.id} className="group cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleOpenForm(po)}>
                  <td className="px-4 py-3.5 text-sm font-bold text-[#283583]">{po.id}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${po.type === 'PO' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                      {po.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{po.title}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{po.supplierName}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">{formatCurrency(po.totalAmount || 0)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`badge ${statusColor[po.status] || "bg-gray-100 text-gray-600"}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 text-right">{po.date}</td>
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handlePreview(po, e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" aria-label={`ดูตัวอย่าง ${po.id}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(po.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all" aria-label={`ลบเอกสาร ${po.id}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="empty-state">
                <p className="text-gray-500">ไม่พบเอกสาร PR/PO</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* ===== PDF Preview Modal ===== */}
    {previewOrder && (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 py-8 modal-overlay-bg">
        <div className="relative w-full max-w-[900px]">
          {/* Modal Header */}
          <div className="bg-white rounded-2xl shadow-2xl mb-4 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                ตัวอย่างเอกสาร{previewOrder.type === "PO" ? "ใบสั่งซื้อ" : "ใบขอซื้อ"} (PDF Preview)
              </h2>
              <p className="text-sm text-gray-500">{previewOrder.id} — {previewOrder.title}</p>
            </div>
            <div className="flex items-center gap-3">


              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#283583] text-white font-bold text-sm rounded-xl hover:bg-[#1e2a6e] transition-all shadow-md disabled:opacity-60"
              >
                {isGeneratingPdf ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                )}
                Save as PDF
              </button>
              <button
                onClick={() => setPreviewOrder(null)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="ปิด"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex justify-center">
            <div className="origin-top scale-[0.5] min-[420px]:scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-300 shadow-2xl">
              <PurchaseOrderDocument purchaseOrder={previewOrder} />
            </div>
          </div>
        </div>

        {/* Hidden PDF render target */}
        <div className="absolute -top-[9999px] -left-[9999px] -z-50 pointer-events-none">
          <PurchaseOrderDocument ref={pdfRef} purchaseOrder={previewOrder} />
        </div>
      </div>
    )}
    </>
  );
}
