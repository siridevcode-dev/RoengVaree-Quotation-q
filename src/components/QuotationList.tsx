"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import { useAppContext, Quotation } from "@/context/AppContext";
import QuotationDocument from "./QuotationDocument";
import PasswordModal from "./PasswordModal";

const statusOptions = ["ทั้งหมด", "ฉบับร่าง", "ส่งแล้ว", "รอดำเนินการ", "อนุมัติแล้ว", "ปฏิเสธ"];

const statusColor: Record<string, string> = {
  "อนุมัติแล้ว": "bg-emerald-100 text-emerald-700",
  "รอดำเนินการ": "bg-amber-100 text-amber-700",
  "ส่งแล้ว": "bg-blue-100 text-blue-700",
  "ฉบับร่าง": "bg-gray-100 text-gray-600",
  "ปฏิเสธ": "bg-red-100 text-red-600",
};

const formatCurrency = (val: number) =>
  val.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

interface QuotationListProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function QuotationList({ onNavigate }: QuotationListProps) {
  const { quotations, addQuotation, updateQuotation, deleteQuotation, showToast, settings, generateNextId } = useAppContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewPdfId, setPreviewPdfId] = useState<string | null>(null);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeStatusEdit, setActiveStatusEdit] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const pdfRef = useRef<HTMLDivElement>(null);

  const filtered = quotations.filter((q) => {
    const matchSearch = q.id.toLowerCase().includes(search.toLowerCase()) || q.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ทั้งหมด" || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((q) => q.id));
    }
  };

  const handleDeleteSuccess = async () => {
    if (isBulkDeleting) {
      for (const id of selectedIds) {
        await deleteQuotation(id);
      }
      showToast(`ลบใบเสนอราคา ${selectedIds.length} รายการเรียบร้อยแล้ว`, "success");
      setSelectedIds([]);
      setIsBulkDeleting(false);
    } else if (quotationToDelete) {
      await deleteQuotation(quotationToDelete);
      showToast(`ลบใบเสนอราคา ${quotationToDelete} สำเร็จ`, "success");
      setQuotationToDelete(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (!pdfRef.current || !previewPdfId || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    
    try {
      const element = pdfRef.current;
      const renderScale = 2;

      // === 1. Capture full document as one big canvas ===
      const canvas = await html2canvas(element, { 
        scale: renderScale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const scaleFactor = canvas.width / pdfPageWidth;
      const pageHeightInCanvas = Math.floor(pdfPageHeight * scaleFactor);

      // === 2. Detect table header and rows for repetition and smart slicing ===
      const theadEl = element.querySelector("thead");
      const tbodyEl = element.querySelector("tbody");
      let headerCanvas: HTMLCanvasElement | null = null;
      let headerHeightInCanvas = 0;
      let tableHeaderEndY = 0;
      let tableBodyEndY = 0;
      const rowRects: { top: number, bottom: number }[] = [];

      const elRect = element.getBoundingClientRect();

      if (theadEl && tbodyEl) {
        const theadRect = theadEl.getBoundingClientRect();
        const tbodyRect = tbodyEl.getBoundingClientRect();

        const headerTopY = Math.round((theadRect.top - elRect.top) * renderScale);
        headerHeightInCanvas = Math.round(theadRect.height * renderScale);
        tableHeaderEndY = headerTopY + headerHeightInCanvas;
        tableBodyEndY = Math.round((tbodyRect.bottom - elRect.top) * renderScale);

        // Capture the header row as a reusable strip
        headerCanvas = document.createElement("canvas");
        headerCanvas.width = canvas.width;
        headerCanvas.height = headerHeightInCanvas;
        const hCtx = headerCanvas.getContext("2d");
        if (hCtx) {
          hCtx.drawImage(canvas, 0, headerTopY, canvas.width, headerHeightInCanvas, 0, 0, canvas.width, headerHeightInCanvas);
        }

        // Collect all table rows to prevent cutting them in half
        const rowEls = tbodyEl.querySelectorAll("tr");
        rowEls.forEach(row => {
          const rect = row.getBoundingClientRect();
          rowRects.push({
            top: Math.round((rect.top - elRect.top) * renderScale),
            bottom: Math.round((rect.bottom - elRect.top) * renderScale)
          });
        });
      }

      // === 3. Generate pages with smart header repetition and row-aware slicing ===
      const totalCanvasHeight = canvas.height;
      let contentY = 0;
      let pageNum = 0;
      const continuedBarHeight = Math.round(22 * renderScale); // space for "(ต่อ)" label

      while (contentY < totalCanvasHeight) {
        if (pageNum > 0) pdf.addPage();

        // Check if current slice is within the table body area
        const isInTableBody = headerCanvas && contentY > tableHeaderEndY && contentY < tableBodyEndY;
        const extraHeaderH = isInTableBody ? (continuedBarHeight + headerHeightInCanvas) : 0;

        // How much actual content fits on this page
        const availableForContent = pageHeightInCanvas - extraHeaderH;
        let contentSlice = Math.min(availableForContent, totalCanvasHeight - contentY);

        // Prevent cutting a row in half
        const potentialSliceEnd = contentY + contentSlice;
        if (potentialSliceEnd < totalCanvasHeight) {
          for (const row of rowRects) {
            // Find if the potential slice end cuts right through a row
            if (row.top > contentY && row.top < potentialSliceEnd && row.bottom > potentialSliceEnd) {
              // Adjust slice to end just before this row starts
              const adjustedSlice = row.top - contentY;
              if (adjustedSlice > 0) {
                contentSlice = adjustedSlice;
              }
              break;
            }
          }
        }

        const totalSliceHeight = extraHeaderH + contentSlice;

        // Create page canvas
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = totalSliceHeight;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) { contentY += contentSlice; pageNum++; continue; }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, totalSliceHeight);

        // Draw repeated header if inside table body
        if (isInTableBody && headerCanvas) {
          // Draw "(ต่อ) Continued" label bar
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(0, 0, pageCanvas.width, continuedBarHeight);
          ctx.fillStyle = "#64748b";
          ctx.font = `bold ${Math.round(10 * renderScale)}px Inter, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("(ต่อ) Continued", pageCanvas.width / 2, continuedBarHeight - Math.round(6 * renderScale));

          // Draw the repeated table header below the label
          ctx.drawImage(headerCanvas, 0, continuedBarHeight);
        }

        // Draw the main content slice
        ctx.drawImage(
          canvas,
          0, contentY, canvas.width, contentSlice,
          0, extraHeaderH, canvas.width, contentSlice
        );

        const renderHeight = totalSliceHeight / scaleFactor;
        pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pdfPageWidth, renderHeight);

        contentY += contentSlice;
        pageNum++;
      }

      // === 4. Add page numbers for multi-page PDFs ===
      const totalPages = pdf.getNumberOfPages();
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`${i} / ${totalPages}`, pdfPageWidth - 40, pdfPageHeight - 10);
        }
      }

      pdf.save(`ใบเสนอราคา_${previewPdfId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("ไม่สามารถสร้าง PDF ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  };



  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">ใบเสนอราคา</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">จัดการใบเสนอราคาทั้งหมด ({quotations.length} รายการ)</p>
          </div>
          <button
            onClick={() => onNavigate("Select Products")}
            className="inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 active:scale-[0.98] w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            สร้างใบเสนอราคาใหม่
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="ค้นหาเลขที่ หรือ ชื่อลูกค้า..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    filterStatus === s
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 flex items-center justify-between animate-in">
            <span className="text-sm font-medium text-teal-800">เลือก {selectedIds.length} รายการ</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBulkDeleting(true)}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all"
              >
                ลบที่เลือก
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-[40px] px-4 py-3">
                    <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer" />
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">เลขที่</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">ลูกค้า</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">รายการ</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">จำนวนเงิน</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">สถานะ</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">วันที่</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">หมดอายุ</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">คนสร้าง</th>
                  <th className="w-[80px] px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((q, index) => (
                  <tr key={`${q.id}-${index}`} onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "BUTTON" && !(e.target as HTMLElement).closest("button")) {
                      onNavigate("Quotation Form", q.id);
                    }
                  }} className="group hover:bg-teal-50/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.includes(q.id)} onChange={() => toggleSelect(q.id)} className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer" />
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-teal-700">{q.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{q.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-center">{q.items}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">{formatCurrency(q.amount)}</td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className={`relative inline-block text-left ${activeStatusEdit === q.id ? "z-50" : ""}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom, left: rect.left });
                            setActiveStatusEdit(activeStatusEdit === q.id ? null : q.id);
                          }}
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[q.status]} hover:ring-2 hover:ring-teal-500/20 hover:scale-105 transition-all active:scale-95`}
                        >
                          {q.status}
                        </button>
                        
                        {activeStatusEdit === q.id && (
                          <>
                            {/* Overlay to handle clicks outside */}
                            <div className="fixed inset-0 z-[100]" onClick={() => setActiveStatusEdit(null)} />
                            
                            {/* Local Dropdown - Fixed positioning to avoid clipping by table scroll */}
                            <div 
                              className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 w-48 py-3 z-[101] transition-all duration-200 overflow-hidden"
                              style={{ 
                                top: `${dropdownPos.top + 8}px`, 
                                left: `${Math.min(dropdownPos.left - 120, typeof window !== 'undefined' ? window.innerWidth - 200 : 0)}px` 
                              }}
                            >
                              <div className="px-5 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">เลือกสถานะ</p>
                              </div>
                              {["ฉบับร่าง", "ส่งแล้ว", "รอดำเนินการ", "อนุมัติแล้ว", "ปฏิเสธ"].map((status) => (
                                <button
                                  key={status}
                                  onClick={async () => {
                                    if (status !== q.status) {
                                      const updatedQ = { ...q, status: status as any };
                                      await updateQuotation(updatedQ);
                                      showToast(`เปลี่ยนสถานะเป็น "${status}" เรียบร้อย`, "success");
                                    }
                                    setActiveStatusEdit(null);
                                  }}
                                  className={`w-full text-left px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${
                                    q.status === status ? "text-teal-600 bg-teal-50/50" : "text-gray-600"
                                  }`}
                                >
                                  {status}
                                  {q.status === status && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{q.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 text-right">{q.validUntil}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-[10px] font-bold text-teal-600 border border-teal-100">
                          {(q.createdBy || "สมชาย").charAt(0)}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{q.createdBy || "สมชาย ใจดี"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button 
                          onClick={() => setPreviewPdfId(q.id)} 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" 
                          title="พรีวิว PDF"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>

                        <button 
                          onClick={() => onNavigate("Quotation Form", q.id)} 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all" 
                          title="ดูรายละเอียด/แก้ไข"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        
                        <button 
                          onClick={() => setQuotationToDelete(q.id)} 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" 
                          title="ลบ"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">ไม่พบใบเสนอราคา</p>
            </div>
          )}
        </div>
      </div>

      {/* PDF Action Modal */}
      {previewPdfId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden" onClick={() => setPreviewPdfId(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[900px] h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 text-lg">เอกสารใบเสนอราคา - {previewPdfId}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className={`px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2 ${isGeneratingPdf ? "opacity-75 cursor-wait" : ""}`}
                >
                  {isGeneratingPdf ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      กำลังสร้าง PDF...
                    </>
                  ) : "Download PDF"}
                </button>
                <button
                  onClick={() => setPreviewPdfId(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-100 pb-12 pt-8 flex relative justify-center">
              <div className="origin-top scale-[0.40] min-[420px]:scale-[0.45] sm:scale-75 md:scale-95 transition-transform duration-300">
                <QuotationDocument quotation={quotations.find(q => q.id === previewPdfId)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Document for Clean PDF Capture (high fidelity) */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", zIndex: -50, pointerEvents: "none", overflow: "visible" }}>
        <QuotationDocument ref={pdfRef} quotation={quotations.find(q => q.id === previewPdfId)} />
      </div>

      <PasswordModal 
        isOpen={!!quotationToDelete || isBulkDeleting} 
        onClose={() => {
          setQuotationToDelete(null);
          setIsBulkDeleting(false);
        }} 
        onSuccess={handleDeleteSuccess}
        title="ยืนยันการลบใบเสนอราคา"
        message={isBulkDeleting 
          ? `ต้องการลบใบเสนอราคาทั้งหมด ${selectedIds.length} รายการที่เลือกหรือไม่?` 
          : `ต้องการลบใบเสนอราคาเลขที่ "${quotationToDelete}" หรือไม่?`}
      />
    </div>
  );
}
