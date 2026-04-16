"use client";

import React, { forwardRef, useMemo } from "react";
import { useAppContext, Quotation } from "@/context/AppContext";

interface QuotationDocumentProps {
  quotation?: Quotation;
  // Overrides for live preview from the form
  previewData?: {
    id: string;
    date: string;
    validUntil: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerTaxId: string;
    items: any[];
    notes: string;
    terms: string;
    globalVatEnabled: boolean;
    vatRate: number;
    calculations?: { subtotal: number; discount?: number; afterDiscount?: number; totalDiscount?: number; taxBase?: number; vat: number; grandTotal: number; optionalSubtotal?: number; includeOptionalEquipment?: boolean };
    boatModel?: string;
    includeOptionalEquipment?: boolean;
    frequency?: string;
    memberName?: string;
    memberPhone?: string;
  };
}

const QuotationDocument = forwardRef<HTMLDivElement, QuotationDocumentProps>(
  ({ quotation, previewData }, ref) => {
    const { settings, boatSpecifications } = useAppContext();
    const company = settings?.companySettings || {};

    const formatCurrency = (val: number) =>
      val.toLocaleString("th-TH", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: 2,
      });

    // Resolve data sources
    const id = previewData?.id || quotation?.id || "Draft";
    const date = previewData?.date || quotation?.date || new Date().toLocaleDateString("th-TH");
    const validUntil = previewData?.validUntil || quotation?.validUntil || "-";
    const customerName = previewData?.customerName || quotation?.customer || "ลูกค้าทั่วไป";
    const customerEmail = previewData?.customerEmail || quotation?.customerEmail || "-";
    const customerPhone = previewData?.customerPhone || quotation?.customerPhone || "-";
    const customerAddress = previewData?.customerAddress || quotation?.customerAddress || "-";
    const customerTaxId = previewData?.customerTaxId || quotation?.customerTaxId || "-";
    const items = previewData?.items || quotation?.lineItems || [];
    const notes = previewData?.notes || quotation?.notes || "";
    const terms = previewData?.terms || quotation?.terms || "";
    const globalVatEnabled = previewData !== undefined ? previewData.globalVatEnabled : (quotation?.globalVatEnabled ?? true);
    const includeOptionalEquipment = previewData?.includeOptionalEquipment ?? quotation?.includeOptionalEquipment ?? true;
    const frequency = previewData?.frequency || quotation?.frequency || "ไม่ระบุ";
    const memberName = previewData?.memberName || (quotation as any)?.memberName || settings?.profile?.name || "-";
    const memberPhone = previewData?.memberPhone || (quotation as any)?.memberPhone || settings?.profile?.phone || "-";


    // Calculate if previewData isn't provided (List view)
    let calc = previewData?.calculations;
    if (!calc) {
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const lineItemDiscount = items.reduce((sum, item) => {
        const base = item.quantity * item.unitPrice;
        return sum + (base * (item.discount || 0) / 100);
      }, 0);

      const summaryDiscountAmount = quotation?.summaryDiscountAmount || 0;
      const summaryDiscountPercentage = quotation?.summaryDiscountPercentage || 0;
      const globalPercentDiscount = subtotal * (summaryDiscountPercentage / 100);

      const totalDiscount = lineItemDiscount + summaryDiscountAmount + globalPercentDiscount;
      const afterDiscount = subtotal - totalDiscount;

      const vatRate = settings?.quotationSettings?.vatRate || 7;
      const checkVat = globalVatEnabled;

      const vatableAmount = items.reduce((sum, item) => {
        if (!checkVat || item.vatEnabled === false) return sum;
        return sum + (item.quantity * item.unitPrice - (item.discount || 0));
      }, 0);

      const vat = checkVat ? vatableAmount * (vatRate / 100) : 0;
      const grandTotal = afterDiscount + vat;

      calc = { subtotal, discount: totalDiscount, afterDiscount, vat, grandTotal };
    } else {
      // Normalize if from Form
      if (calc.totalDiscount !== undefined) calc.discount = calc.totalDiscount;
      if (calc.taxBase !== undefined) calc.afterDiscount = calc.taxBase;
    }

    // Automatic boat model detection (NEW)
    const detectedBoatModel = (() => {
      const boatModelNames = Object.keys(boatSpecifications);
      for (const model of boatModelNames) {
        if (items.some(item => String(item.name).toUpperCase().includes(model.toUpperCase()))) {
          return model;
        }
      }
      return "";
    })();

    const effectiveBoatModel = previewData?.boatModel || quotation?.boatModel || detectedBoatModel;

    const groupedItems = useMemo(() => {
      const groups: Record<string, any[]> = {
        "สินค้าหลัก": [],
        "มาตรฐาน": [],
        "อุปกรณ์เสริม": [],
        "อื่นๆ": []
      };

      items.forEach(item => {
        const name = (item.name || "").trim().toUpperCase();
        const cat = (item.category || "").trim().toLowerCase();

        let finalCat = "อื่นๆ";

        // Standardized Grouping Logic
        // Priority 1: Main Product keywords
        if (
          name.startsWith("MODEL:") ||
          cat === "เรือ" ||
          cat === "เครื่องยนต์" ||
          cat === "ซ่อมเรือ" ||
          cat.includes("main product")
        ) {
          finalCat = "สินค้าหลัก";
        }
        // Priority 2: Standard Equipment keywords
        else if (
          cat === "มาตรฐาน" ||
          cat.includes("standard") ||
          cat === "มาตรฐาน r52" ||
          cat.includes("std-")
        ) {
          finalCat = "มาตรฐาน";
        }
        // Priority 3: Optional Equipment keywords
        else if (
          cat === "อุปกรณ์เสริม" ||
          cat.includes("optional") ||
          cat === "อุปกรณ์เสริม r52" ||
          cat.includes("opt-")
        ) {
          finalCat = "อุปกรณ์เสริม";
        }

        groups[finalCat].push(item);
      });

      return groups;
    }, [items]);

    let globalIndex = 0;

    // Determine Dynamic Title based on Categories and Product Names
    // Logic to pick a "significant" category for the title
    const itemCategories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
    const priorityCategories = ["เรือ", "เครื่องยนต์", "ซ่อมเรือ"];

    // Find first priority category, or fallback to the first category that isn't equipment, or finally just any category
    const mainCategory = itemCategories.find(cat => priorityCategories.includes(cat)) ||
      itemCategories.find(cat => !["มาตรฐาน", "อุปกรณ์เสริม"].includes(cat)) ||
      (itemCategories.length > 0 ? itemCategories[0] : "");

    // Only show category in title if it's not a generic equipment category or specifically "เรือ"/"หมวดเรือ"
    const displayCategory = ["มาตรฐาน", "อุปกรณ์เสริม", "เรือ", "หมวดเรือ"].some(
      cat => (mainCategory || "").trim().toLowerCase() === cat.toLowerCase()
    ) ? "" : mainCategory;

    const singleProduct = items.length === 1 ? items[0] : null;
    const mainProduct = groupedItems["สินค้าหลัก"]?.[0];
    const displayModelName = mainProduct ? mainProduct.name : (effectiveBoatModel || (singleProduct ? singleProduct.name : (displayCategory || "")));

    // Dynamic Title Logic is now handled directly in JSX for better control over line breaks


    return (
      <div
        ref={ref}
        data-pdf-safe="true"
        className="bg-white p-10 mx-auto flex flex-col shadow-2xl print:shadow-none print:p-0 print:m-0 print:w-full print:absolute print:left-0 print:top-0"
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
          position: "relative",
          WebkitPrintColorAdjust: "exact",
          fontSize: "12.5px",
          color: "#1e293b",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          @media print {
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              background: white !important;
            }
            .print\\:hidden, #sidebar, #header, button, .no-print, .modal-overlay-bg {
              display: none !important;
            }
            #quotation-document {
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
            tr {
              page-break-inside: avoid !important;
            }
            thead {
              display: table-header-group !important;
            }
            .page-break-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `}} />
        {/* Background Watermark (Logo based) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: 0.035 }}>
          <img src="/logo.png" alt="" className="w-[120mm] h-[120mm] object-contain grayscale brightness-50" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-4" style={{ borderBottom: "2px solid #283583" }}>
            <div className="flex items-center gap-6 flex-1">
              {/* Logo */}
              <div className="w-20 h-20 flex-none flex items-center justify-center">
                <img src="/logo.png" alt="Company Logo" className="w-full h-full object-contain" />
              </div>

              {/* Company Info */}
              <div className="flex-1 pr-4">
                <h1 className="text-[27px] font-extrabold tracking-tight leading-tight uppercase mb-1" style={{ color: "#283583" }}>
                  {company.name || "COMPANY NAME CO., LTD."}
                </h1>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: "#64748b" }}>{company.address || "123 Business Road, City 10100"}</p>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-[11.5px] font-bold" style={{ color: "#64748b" }}>
                  <span>Tax ID: {company.taxId || "0100000000000"}</span>
                  <span className="opacity-30">|</span>
                  <span>Tel: {company.phone || "02-XXX-XXXX"}</span>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 text-[11.5px] font-bold" style={{ color: "#64748b" }}>
                  <span>Email: {company.email || "info@example.com"}</span>
                  {company.website && (
                    <>
                      <span className="opacity-30">|</span>
                      <span>Web: {company.website}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right pl-4 max-w-[320px] ml-auto">
              <div className="flex flex-col items-end">
                <h2 className="text-[22px] font-black uppercase tracking-[0.1em]" style={{ color: "#0f172a", lineHeight: "1" }}>
                  QUOTATION
                </h2>
                {displayModelName && (
                  <div className="text-[16px] font-black uppercase mt-1 mb-2 tracking-tight text-right" style={{ color: "#283583", lineHeight: "1.2" }}>
                    {displayModelName}
                  </div>
                )}
                

              </div>

              <div className="flex flex-col gap-0.5 text-[11px] font-bold text-right uppercase tracking-wider mt-2 pt-2 border-t border-[#283583]/30">
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#475569", fontWeight: "900" }}>No:</span>
                  <span style={{ color: "#283583", fontWeight: "900" }}>{id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#475569", fontWeight: "900" }}>Date:</span>
                  <span style={{ color: "#1e293b", fontWeight: "900" }}>{date}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#475569", fontWeight: "900" }}>Valid Until:</span>
                  <span style={{ color: "#1e293b", fontWeight: "900" }}>{validUntil}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#475569", fontWeight: "900" }}>SALES NAME:</span>
                  <span style={{ color: "#283583", fontWeight: "900" }}>{memberName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#475569", fontWeight: "900" }}>Phone:</span>
                  <span style={{ color: "#1e293b", fontWeight: "900" }}>{memberPhone}</span>
                </div>
                {frequency !== "ไม่ระบุ" && (
                  <div className="flex justify-between gap-4 mt-1 pt-1 border-t border-[#283583]/10">
                    <span style={{ color: "#475569", fontWeight: "900" }}>รอบเรียกเก็บ:</span>
                    <span style={{ color: "#283583", fontWeight: "900" }}>{frequency}</span>
                  </div>
                )}
              </div>
            </div>
          </div>



          {/* Info Blocks */}
          <div className="flex justify-between mb-4 gap-10">
            {/* Customer */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest pb-1.5 mb-2" style={{ borderBottom: "1.5px solid #283583", color: "#334155" }}>เรียน (Prepared For)</h3>
                <p className="font-extrabold text-xl mb-0.5" style={{ color: "#0f172a" }}>{customerName}</p>
                <p className="leading-relaxed font-bold mb-0.5" style={{ color: "#1e293b" }}>{customerAddress}</p>
                {customerPhone && <p className="font-bold" style={{ color: "#1e293b" }}>โทร (Tel): {customerPhone}</p>}
                {customerEmail && <p className="font-bold" style={{ color: "#1e293b" }}>อีเมล (Email): {customerEmail}</p>}
                {customerTaxId && <p className="font-bold" style={{ color: "#1e293b" }}>เลขประจำตัวผู้เสียภาษี (Tax ID): {customerTaxId}</p>}
              </div>

              {/* Grand Total Quick Box */}
              <div className="mt-4 flex justify-start animate-in fade-in slide-in-from-left-6 duration-700">
                <div 
                  className="px-5 py-2.5 rounded-2xl flex items-center gap-5 shadow-sm border border-slate-100"
                  style={{ backgroundColor: "rgba(248, 250, 252, 0.9)" }}
                >
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 mb-0.5">จำนวนเงินรวมทั้งสิ้น</p>
                    <p className="text-[11px] font-black uppercase tracking-tight text-[#283583]">Grand Total</p>
                  </div>
                  <div className="h-7 w-px bg-slate-300/50"></div>
                  <p className="text-[20px] font-black text-[#283583]" style={{ borderBottom: "2px double #283583" }}>
                    {formatCurrency(calc.grandTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Terms replacing Doc Info */}
            <div className="w-[300px]">
              <h3 className="text-[11px] font-black uppercase tracking-widest pb-1.5 mb-2" style={{ borderBottom: "1.5px solid #283583", color: "#334155" }}>เงื่อนไขการชำระเงิน (Payment Terms)</h3>
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 min-h-[100px] flex flex-col justify-between">
                <div>
                  {terms ? (
                    <p className="text-[12px] font-bold leading-relaxed whitespace-pre-wrap" style={{ color: "#1e293b" }}>{terms}</p>
                  ) : (
                    <p className="text-[11px] italic font-bold text-gray-400">ไม่ได้ระบุเงื่อนไข</p>
                  )}
                </div>

                {/* Dynamic VAT Status */}
                <div className="mt-4 pt-3 border-t border-gray-200/60 space-y-3">
                  <div className={`space-y-0.5 ${(calc?.vat || 0) > 0 ? "text-indigo-600" : "text-slate-400"}`}>
                    <p className="text-[14px] font-black tracking-tight flex items-center gap-2">
                      <span>{(calc?.vat || 0) > 0 ? "●" : "○"}</span>
                      <span>{(calc?.vat || 0) > 0 ? "รวมภาษีมูลค่าเพิ่ม 7% แล้ว" : "ราคายังไม่รวมภาษีมูลค่าเพิ่ม 7%"}</span>
                    </p>
                    <p className="text-[11.5px] font-bold tracking-tight pl-5 italic opacity-80">
                      {(calc?.vat || 0) > 0 ? "(VAT Included 7%)" : "(Price excludes 7% VAT)"}
                    </p>
                  </div>

                  {/* Optional Equipment Status */}
                  {items.some(item => {
                    const c = (item.category || "").trim().toLowerCase();
                    return c === "อุปกรณ์เสริม" || c.includes("optional") || c === "อุปกรณ์เสริม r52";
                  }) && (
                      <div className={`space-y-0.5 ${includeOptionalEquipment ? "text-indigo-600" : "text-orange-500"}`}>
                        <p className="text-[14px] font-black tracking-tight flex items-center gap-2">
                          <span>{includeOptionalEquipment ? "●" : "○"}</span>
                          <span>{includeOptionalEquipment ? "ราคารวมอุปกรณ์เสริมแล้ว" : "ราคาไม่รวมอุปกรณ์เสริม"}</span>
                        </p>
                        <p className="text-[11.5px] font-bold tracking-tight pl-5 italic opacity-80">
                          {includeOptionalEquipment ? "(Includes Optional Equipment)" : "(Excludes Optional Equipment)"}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section (Unified Premium Case) */}
          {effectiveBoatModel && boatSpecifications[effectiveBoatModel] && (
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#283583] px-3 py-1 border border-[#283583]/20 rounded-full bg-blue-50/50">
                  Technical Specifications
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#283583]/30 to-transparent"></div>
              </div>

              <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm shadow-slate-200/50 flex overflow-hidden">
                <SpecGroup title="Physical Dimensions" showDivider={true}>
                  <SpecDocItem label="LOA (Length)" value={boatSpecifications[effectiveBoatModel].loa} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3L9 15M21 3H12M21 3V12M3 21L15 9M3 21H12M3 21V12" /></svg>} />
                  <SpecDocItem label="BEAM (Width)" value={boatSpecifications[effectiveBoatModel].beam} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6M6 12L10 8M6 12L10 16M18 12L14 8M18 12L14 16" /></svg>} />
                </SpecGroup>

                <SpecGroup title="Hull Details" showDivider={true}>
                  <SpecDocItem label="DRAFT" value={boatSpecifications[effectiveBoatModel].draft} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3V21M12 21L16 17M12 21L8 17" /></svg>} />
                  <SpecDocItem label="HEIGHT" value={boatSpecifications[effectiveBoatModel].height} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3V21M12 3L16 7M12 3L8 7M12 21L16 17M12 21L8 17" /></svg>} />
                </SpecGroup>

                <SpecGroup title="Load Capacity" showDivider={true}>
                  <SpecDocItem label="PASSENGERS" value={boatSpecifications[effectiveBoatModel].passenger} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-3-3.87M9 3a4 4 0 100 8 4 4 0 000-8zM2 21v-2a4 4 0 014-4h5a4 4 0 014 4v2" /></svg>} />
                  <SpecDocItem label="FRESH WATER" value={boatSpecifications[effectiveBoatModel].freshWaterCapacity} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
                </SpecGroup>

                <SpecGroup title="Performance" showDivider={false}>
                  <SpecDocItem label="FUEL TANK" value={boatSpecifications[effectiveBoatModel].gasTank} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} />
                  <SpecDocItem label="ENGINE / SPEED" value={`${boatSpecifications[effectiveBoatModel].recEngine} / ${boatSpecifications[effectiveBoatModel].speedDesign}`} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                </SpecGroup>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#283583", color: "#ffffff" }}>
                  <th className="py-1 px-4 text-center w-12 font-black text-[12px]">#</th>
                  <th className="py-1 px-4 text-left font-black text-[12px]">รายการ (Description)</th>
                  <th className="py-1 px-4 text-center w-24 font-black text-[12px]">จำนวน (Qty)</th>
                  <th className="py-1 px-4 text-right w-32 font-black text-[12px]">ราคา/หน่วย (Unit)</th>
                  <th className="py-1 px-4 text-right w-36 font-black text-[12px]">จำนวนเงิน (Amount)</th>
                </tr>
              </thead>
              <tbody style={{ borderBottom: "2px solid #283583" }}>
                {Object.entries(groupedItems).map(([category, categoryItems]) => {
                  if (categoryItems.length === 0) return null;

                  return (
                    <React.Fragment key={category}>
                      {/* Sub-header row */}
                      <tr style={{ backgroundColor: "#f8fafc" }}>
                        <td colSpan={5} className="py-0.5 px-4 text-left">
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "900",
                            color: category === "สินค้าหลัก" ? "#3730a3" :
                              category === "มาตรฐาน" ? "#0369a1" : (category === "อุปกรณ์เสริม" ? "#059669" : "#64748b"),
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                          }}>
                            {category === "สินค้าหลัก" ? "● MAIN PRODUCT (สินค้าหลัก)" :
                              category === "มาตรฐาน" ? "● STANDARD EQUIPMENT (รายการมาตรฐาน)" :
                                category === "อุปกรณ์เสริม" ? "● OPTIONAL EQUIPMENT (อุปกรณ์เสริม)" :
                                  "● OTHER ITEMS (รายการอื่นๆ)"}
                          </span>
                        </td>
                      </tr>

                      {categoryItems.map((item, idx) => {
                        globalIndex++;
                        return (
                          <tr key={item.id || `${category}-${idx}`} style={{ borderBottom: "1px solid #f1f5f9" }} className="group">
                            <td className="py-0.5 px-4 text-center font-bold" style={{ color: "#475569" }}>{globalIndex}</td>
                            <td className="py-0.5 px-4 text-left">
                              <p className="font-black text-[13px]" style={{ color: "#0f172a" }}>{item.name}</p>
                              {item.description && <p className="text-[11px] font-bold" style={{ color: "#475569" }}>{item.description}</p>}
                            </td>
                            <td className="py-0.5 px-4 text-center font-bold" style={{ color: "#1e293b" }}>{item.quantity}</td>
                            <td className="py-0.5 px-4 text-right font-bold" style={{ color: "#1e293b" }}>{formatCurrency(item.unitPrice)}</td>
                            <td className="py-0.5 px-4 text-right font-black text-[14px]" style={{ color: "#0f172a" }}>
                              {formatCurrency((item.quantity * item.unitPrice) - (item.quantity * item.unitPrice * (item.discount || 0) / 100))}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
                {/* Minimal padding empty rows if items are very few so table has substance */}
                {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-10">
                    <td></td><td></td><td></td><td></td><td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-between items-start mb-6 page-break-avoid" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <div className="flex-1 pr-16 space-y-6">
              {notes && (
                <div>
                  <h4 className="font-bold text-[12px] uppercase mb-2" style={{ color: "#1e293b" }}>หมายเหตุ (Remarks):</h4>
                  <p className="text-[13px] p-4 rounded-lg" style={{ color: "#475569", backgroundColor: "#f8fafc" }}>{notes}</p>
                </div>
              )}
            </div>

            <div
              className="w-[320px] p-5 rounded-xl border"
              style={{
                backgroundColor: "rgba(249, 250, 251, 0.8)",
                borderColor: "rgba(241, 245, 249, 0.6)"
              }}
            >
              <table className="w-full text-[13px]">
                <tbody>
                  <tr>
                    <td className="py-0.5 font-bold" style={{ color: "#334155" }}>รวมเป็นเงิน (Subtotal):</td>
                    <td className="py-0.5 font-black text-right" style={{ color: "#0f172a" }}>{formatCurrency(calc.subtotal)}</td>
                  </tr>
                  {!includeOptionalEquipment && items.some(item => {
                    const c = (item.category || "").trim().toLowerCase();
                    return c === "อุปกรณ์เสริม" || c.includes("optional") || c === "อุปกรณ์เสริม r52";
                  }) && (
                      <tr>
                        <td className="py-1.5 text-[11px] font-black" style={{ color: "#f97316" }}>
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ไม่รวมอุปกรณ์เสริม (Excl. Optional)
                          </span>
                        </td>
                        <td className="py-1.5 text-[11px] text-right font-black" style={{ color: "#f97316" }}>-</td>
                      </tr>
                    )}
                  {(calc.discount ?? 0) > 0 && (
                    <tr>
                      <td className="py-0.5 font-bold" style={{ color: "#334155" }}>ส่วนลด (Discount):</td>
                      <td className="py-0.5 font-black text-right" style={{ color: "#ef4444" }}>-{formatCurrency(calc.discount || 0)}</td>
                    </tr>
                  )}
                  {(calc.discount ?? 0) > 0 && (
                    <tr>
                      <td className="py-0.5 font-bold" style={{ color: "#334155" }}>หลังหักส่วนลด (After Discount):</td>
                      <td className="py-0.5 font-black text-right" style={{ color: "#0f172a" }}>{formatCurrency(calc.afterDiscount || 0)}</td>
                    </tr>
                  )}
                  {globalVatEnabled && (
                    <tr>
                      <td className="py-0.5 font-bold" style={{ color: "#334155" }}>ภาษีมูลค่าเพิ่ม (VAT {(settings?.quotationSettings?.vatRate || 7)}%):</td>
                      <td className="py-0.5 font-black text-right" style={{ color: "#0f172a" }}>{formatCurrency(calc.vat)}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="pt-2 pb-1 font-black text-[14px]" style={{ color: "#283583" }}>จำนวนเงินรวมทั้งสิ้น (Grand Total):</td>
                    <td className="pt-2 pb-1 font-black text-right text-[20px]" style={{ color: "#283583", borderBottom: "3px double #283583" }}>{formatCurrency(calc.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures placed strictly at the bottom using mt-auto avoiding overlaps */}
          <div className="mt-auto pt-4 pb-2 break-inside-avoid-page page-break-avoid" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <div className="flex justify-between px-8 text-center">
              <div className="w-[260px]">
                <div className="mb-3 h-20 w-full flex items-end justify-center" style={{ borderBottom: "2px solid #283583" }}></div>
                <p className="font-bold mt-3" style={{ color: "#1e293b" }}>( _________________________ )</p>
                <p className="mt-1 flex flex-col gap-0.5" style={{ color: "#475569" }}>
                  <span>ผู้อนุมัติสั่งซื้อ</span>
                  <span className="text-[11px] font-black" style={{ color: "#64748b" }}>Authorized Signature</span>
                </p>
                <p className="mt-2 text-xs" style={{ color: "#94a3b8" }}>วันที่ (Date): ____/____/_____</p>
              </div>

              <div className="w-[260px]">
                <div className="mb-3 h-20 w-full flex items-end justify-center" style={{ borderBottom: "2px solid #283583" }}></div>
                <p className="font-bold mt-3" style={{ color: "#1e293b" }}>{memberName !== "-" ? memberName : "( _________________________ )"}</p>
                <p className="mt-1 flex flex-col gap-0.5" style={{ color: "#475569" }}>
                  <span>ผู้เสนอราคา</span>
                  <span className="text-[11px] font-black" style={{ color: "#64748b" }}>Quotation by</span>
                </p>
                <p className="mt-2 text-xs" style={{ color: "#94a3b8" }}>วันที่ (Date): {date}</p>
              </div>
            </div>
          </div>


          {/* Boat Images Gallery (Compact - max 5 images in tight grid) */}
          {(() => {
            const boatSpecs = effectiveBoatModel ? boatSpecifications[effectiveBoatModel] : null;
            const boatImages = boatSpecs?.images || [];

            if (!effectiveBoatModel || boatImages.length === 0) return null;

            // Limit to max 5 images to keep PDF within 5 pages
            const displayImages = boatImages.slice(0, 5);

            return (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 text-center">Visual Gallery • {effectiveBoatModel} Series</h4>

                {/* Hero image - compact */}
                {displayImages[0] && (
                  <div className="mb-2">
                    <div className="rounded-[12px] overflow-hidden border border-slate-200 shadow-sm bg-white" style={{ aspectRatio: '16/7' }}>
                      <img src={displayImages[0]} alt={`${effectiveBoatModel} hero view`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Secondary images - compact 2x2 grid */}
                {displayImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {displayImages.slice(1, 5).map((img, i) => (
                      <div key={i}>
                        <div className="rounded-[8px] overflow-hidden border border-slate-200 shadow-sm bg-white" style={{ aspectRatio: '16/9' }}>
                          <img src={img} alt={`${effectiveBoatModel} view ${i + 2}`} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
);

function SpecGroup({ title, children, showDivider = false }: { title: string, children: React.ReactNode, showDivider?: boolean }) {
  return (
    <div className="flex-1 flex flex-col gap-3 p-4 relative group">
      <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] h-6 flex items-start leading-tight">{title}</h4>
      <div className="flex flex-col gap-4">
        {children}
      </div>
      {showDivider && (
        <div className="absolute right-0 top-4 bottom-4 w-px bg-slate-200"></div>
      )}
    </div>
  );
}

function SpecDocItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 group/item">
      <div className="flex-none w-8 h-8 rounded-[10px] bg-[#eef2ff] border border-[#e0e7ff] flex items-center justify-center text-[#3730a3] shadow-sm shadow-[#e0e7ff]/50">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.08em] leading-tight">{label}</span>
        <span className="text-[13px] font-black text-[#0f172a] tracking-tight leading-none">{value || "-"}</span>
      </div>
    </div>
  );
}

export default QuotationDocument;
QuotationDocument.displayName = "QuotationDocument";
