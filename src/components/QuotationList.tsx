"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useAppContext, Quotation } from "@/context/AppContext";
import QuotationDocument from "./QuotationDocument";
import PasswordModal from "./PasswordModal";

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

interface QuotationListProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function QuotationList({ onNavigate }: QuotationListProps) {
  const { quotations, updateQuotation, deleteQuotation, showToast } = useAppContext();
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

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () =>
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((q) => q.id));

  const handleDeleteSuccess = async () => {
    if (isBulkDeleting) {
      for (const id of selectedIds) await deleteQuotation(id);
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
      const canvas = await html2canvas(element, { scale: renderScale, useCORS: true, allowTaint: true, backgroundColor: "#ffffff", logging: false });
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const scaleFactor = canvas.width / pdfPageWidth;
      const pageHeightInCanvas = Math.floor(pdfPageHeight * scaleFactor);
      const theadEl = element.querySelector("thead");
      const tbodyEl = element.querySelector("tbody");
      let headerCanvas: HTMLCanvasElement | null = null;
      let headerHeightInCanvas = 0;
      let tableHeaderEndY = 0;
      let tableBodyEndY = 0;
      const rowRects: { top: number; bottom: number }[] = [];
      const elRect = element.getBoundingClientRect();
      if (theadEl && tbodyEl) {
        const theadRect = theadEl.getBoundingClientRect();
        const tbodyRect = tbodyEl.getBoundingClientRect();
        const headerTopY = Math.round((theadRect.top - elRect.top) * renderScale);
        headerHeightInCanvas = Math.round(theadRect.height * renderScale);
        tableHeaderEndY = headerTopY + headerHeightInCanvas;
        tableBodyEndY = Math.round((tbodyRect.bottom - elRect.top) * renderScale);
        headerCanvas = document.createElement("canvas");
        headerCanvas.width = canvas.width;
        headerCanvas.height = headerHeightInCanvas;
        const hCtx = headerCanvas.getContext("2d");
        if (hCtx) hCtx.drawImage(canvas, 0, headerTopY, canvas.width, headerHeightInCanvas, 0, 0, canvas.width, headerHeightInCanvas);
        tbodyEl.querySelectorAll("tr").forEach((row) => {
          const rect = row.getBoundingClientRect();
          rowRects.push({ top: Math.round((rect.top - elRect.top) * renderScale), bottom: Math.round((rect.bottom - elRect.top) * renderScale) });
        });
      }
      const totalCanvasHeight = canvas.height;
      let contentY = 0;
      let pageNum = 0;
      const continuedBarHeight = Math.round(22 * renderScale);
      while (contentY < totalCanvasHeight) {
        if (pageNum > 0) pdf.addPage();
        const isInTableBody = headerCanvas && contentY > tableHeaderEndY && contentY < tableBodyEndY;
        const extraHeaderH = isInTableBody ? continuedBarHeight + headerHeightInCanvas : 0;
        const availableForContent = pageHeightInCanvas - extraHeaderH;
        let contentSlice = Math.min(availableForContent, totalCanvasHeight - contentY);
        const potentialSliceEnd = contentY + contentSlice;
        if (potentialSliceEnd < totalCanvasHeight) {
          for (const row of rowRects) {
            if (row.top > contentY && row.top < potentialSliceEnd && row.bottom > potentialSliceEnd) {
              const adjustedSlice = row.top - contentY;
              if (adjustedSlice > 0) { contentSlice = adjustedSlice; }
              break;
            }
          }
        }
        const totalSliceHeight = extraHeaderH + contentSlice;
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = totalSliceHeight;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) { contentY += contentSlice; pageNum++; continue; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, totalSliceHeight);
        if (isInTableBody && headerCanvas) {
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(0, 0, pageCanvas.width, continuedBarHeight);
          ctx.fillStyle = "#64748b";
          ctx.font = `bold ${Math.round(10 * renderScale)}px Inter, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("(ต่อ) Continued", pageCanvas.width / 2, continuedBarHeight - Math.round(6 * renderScale));
          ctx.drawImage(headerCanvas, 0, continuedBarHeight);
        }
        ctx.drawImage(canvas, 0, contentY, canvas.width, contentSlice, 0, extraHeaderH, canvas.width, contentSlice);
        const renderHeight = totalSliceHeight / scaleFactor;
        pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pdfPageWidth, renderHeight);
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
      pdf.save(`ใบเสนอราคา_${previewPdfId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("ไม่สามารถสร้าง PDF ได้ในขณะนี้", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50/40">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-5 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="page-title">ใบเสนอราคา</h1>
            <p className="page-subtitle mt-1">จัดการใบเสนอราคาทั้งหมด ({quotations.length} รายการ)</p>
          </div>
          <button
            onClick={() => onNavigate("Select Products")}
            className="btn-primary w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            สร้างใบเสนอราคาใหม่
          </button>
        </div>

        {/* Filter Bar */}
        <div className="card p-3 md:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="ค้นหาเลขที่ หรือ ชื่อลูกค้า..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-modern pl-9"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-wrap">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    filterStatus === s
                      ? "text-white shadow-sm bg-gradient-to-br from-[#283583] to-[#4f46e5]"
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
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center justify-between animate-fade-in">
            <span className="text-sm font-semibold text-indigo-800">เลือก {selectedIds.length} รายการ</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsBulkDeleting(true)} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all">
                ลบที่เลือก
              </button>
              <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="w-10 px-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filtered.length && filtered.length > 0} 
                      onChange={toggleAll} 
                      title="เลือกทั้งหมด"
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-indigo-600" 
                    />
                  </th>
                  <th className="text-left">เลขที่</th>
                  <th className="text-left">ลูกค้า</th>
                  <th className="text-center">รายการ</th>
                  <th className="text-right">จำนวนเงิน</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-right">วันที่</th>
                  <th className="text-right">หมดอายุ</th>
                  <th className="text-center">ผู้สร้าง</th>
                  <th className="w-20 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, index) => (
                  <tr
                    key={`${q.id}-${index}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== "INPUT" && !(e.target as HTMLElement).closest("button")) {
                        onNavigate("Quotation View", q.id);
                      }
                    }}
                    className="group cursor-pointer"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(q.id)} 
                        onChange={() => toggleSelect(q.id)} 
                        title="เลือกรายการนี้"
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-indigo-600" 
                      />
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-[#283583]">{q.id}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-700">{q.customer}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 text-center">{q.items}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">{formatCurrency(q.amount)}</td>
                    <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className={`relative inline-block ${activeStatusEdit === q.id ? "z-50" : ""}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom, left: rect.left });
                            setActiveStatusEdit(activeStatusEdit === q.id ? null : q.id);
                          }}
                          className={`badge ${statusColor[q.status] || "bg-gray-100 text-gray-600"} cursor-pointer hover:scale-105 transition-transform`}
                        >
                          {q.status}
                        </button>
                        {activeStatusEdit === q.id && (
                          <>
                            <div className="fixed inset-0 z-[100]" onClick={() => setActiveStatusEdit(null)} />
                            <DynamicBox 
                              className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 w-48 py-2 z-[101] animate-scale-in overflow-hidden"
                              top={`${dropdownPos.top + 6}px`}
                              left={`${Math.min(dropdownPos.left - 100, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 200)}px`}
                            >
                              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">เลือกสถานะ</p>
                              </div>
                              {["ฉบับร่าง", "ส่งแล้ว", "รอดำเนินการ", "อนุมัติแล้ว", "ปฏิเสธ"].map((status) => (
                                <button key={status}
                                  onClick={async () => {
                                    if (status !== q.status) { await updateQuotation({ ...q, status: status as any }); showToast(`เปลี่ยนสถานะเป็น "${status}" เรียบร้อย`, "success"); }
                                    setActiveStatusEdit(null);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${q.status === status ? "text-indigo-600" : "text-gray-600"}`}>
                                  {status}
                                  {q.status === status && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                </button>
                              ))}
                            </DynamicBox>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 text-right">{q.date}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-400 text-right">{q.validUntil}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-[#283583] to-[#6366f1]">
                          {(q.memberName || q.createdBy || "ส").charAt(0)}
                        </div>
                        <span className="text-xs text-gray-600 font-medium hidden lg:block">{q.memberName || q.createdBy || "สมชาย ใจดี"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button onClick={() => setPreviewPdfId(q.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="พรีวิว PDF">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>
                        <button onClick={() => onNavigate("Quotation Form", q.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all" title="แก้ไข">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => setQuotationToDelete(q.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="ลบ">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-sm font-medium text-gray-500">ไม่พบใบเสนอราคา</p>
                <p className="text-xs text-gray-400">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewPdfId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 print:hidden" onClick={() => setPreviewPdfId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] h-[90vh] flex flex-col overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">ใบเสนอราคา — {previewPdfId}</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadPdf} disabled={isGeneratingPdf}
                  className="btn-primary py-2 px-4 text-sm disabled:opacity-60 disabled:cursor-wait">
                  {isGeneratingPdf ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>กำลังสร้าง...</>
                  ) : "Download PDF"}
                </button>
                <button onClick={() => setPreviewPdfId(null)} title="ปิดหน้าต่างตัวอย่าง" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 pb-12 pt-8 flex justify-center">
              <div className="origin-top scale-[0.40] min-[420px]:scale-[0.45] sm:scale-75 md:scale-95 transition-transform duration-300">
                <QuotationDocument quotation={quotations.find((q) => q.id === previewPdfId)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF capture */}
      <div className="absolute -top-[9999px] -left-[9999px] -z-50 pointer-events-none overflow-visible">
        <QuotationDocument ref={pdfRef} quotation={quotations.find((q) => q.id === previewPdfId)} />
      </div>

      <PasswordModal
        isOpen={!!quotationToDelete || isBulkDeleting}
        onClose={() => { setQuotationToDelete(null); setIsBulkDeleting(false); }}
        onSuccess={handleDeleteSuccess}
        title="ยืนยันการลบใบเสนอราคา"
        message={isBulkDeleting ? `ต้องการลบใบเสนอราคาทั้งหมด ${selectedIds.length} รายการที่เลือกหรือไม่?` : `ต้องการลบใบเสนอราคาเลขที่ "${quotationToDelete}" หรือไม่?`}
      />
    </div>
  );
}

function DynamicBox({ height, width, backgroundColor, color, className, title, children, top, left }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (height) ref.current.style.height = height;
      if (width) ref.current.style.width = width;
      if (backgroundColor) ref.current.style.backgroundColor = backgroundColor;
      if (color) ref.current.style.color = color;
      if (top) ref.current.style.top = top;
      if (left) ref.current.style.left = left;
    }
  }, [height, width, backgroundColor, color, top, left]);
  return <div ref={ref} className={className} title={title}>{children}</div>;
}
