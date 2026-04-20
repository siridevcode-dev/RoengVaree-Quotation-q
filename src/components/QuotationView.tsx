"use client";

import { useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import QuotationDocument from "./QuotationDocument";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

interface QuotationViewProps {
  quotationId: string;
  onNavigate: (page: string, id?: string) => void;
}

export default function QuotationView({ quotationId, onNavigate }: QuotationViewProps) {
  const { quotations, showToast } = useAppContext();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const quotation = quotations.find((q) => q.id === quotationId);

  if (!quotation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">ไม่พบใบเสนอราคา</h2>
          <button
            onClick={() => onNavigate("Quotations")}
            className="mt-4 btn-primary"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

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
        logging: false 
      });
      
      const pdf = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
        compress: true
      });

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
        
        const avoidEls = element.querySelectorAll("tr, .page-break-avoid");
        avoidEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
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
        
        const finalSliceEnd = contentY + contentSlice;
        if (finalSliceEnd < totalCanvasHeight) {
          for (const row of rowRects) {
            if (row.top > contentY && row.top < finalSliceEnd && row.bottom > finalSliceEnd) {
              const adjustedSlice = row.top - contentY;
              if (adjustedSlice > 0) contentSlice = adjustedSlice;
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
      pdf.save(`ใบเสนอราคา_${quotationId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("ไม่สามารถสร้าง PDF ได้ในขณะนี้", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100 pb-20">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate("Quotations")}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ใบเสนอราคา — {quotationId}</h1>
              <p className="text-sm text-gray-500">{quotation.customer}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              {isGeneratingPdf ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              Download PDF
            </button>
            <button
              onClick={() => onNavigate("Quotation Form", quotationId)}
              className="btn-primary py-2 px-6 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #283583, #4f46e5)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Quotation
            </button>
          </div>
        </div>

        {/* Document View */}
        <div className="flex justify-center">
          <div className="origin-top scale-[0.5] min-[420px]:scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-300 shadow-2xl">
            <QuotationDocument quotation={quotation} />
          </div>
        </div>
      </div>

      {/* Hidden for PDF */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", zIndex: -50, pointerEvents: "none" }}>
        <QuotationDocument ref={pdfRef} quotation={quotation} />
      </div>
    </div>
  );
}
