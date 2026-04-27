"use client";

import React, { forwardRef, useMemo } from "react";
import { useAppContext, Quotation, LineItem } from "@/context/AppContext";

interface QuotationDocumentProps {
  quotation?: Quotation;
  isClassic?: boolean;
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
    items: LineItem[];
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
    customImages?: string[];
  };
}

const QuotationDocument = forwardRef<HTMLDivElement, QuotationDocumentProps>(
  ({ quotation, previewData, isClassic }, ref) => {
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
    
    // Memoize items to fix hook dependency warning
    const items = useMemo(() => 
      previewData?.items || quotation?.lineItems || []
    , [previewData?.items, quotation?.lineItems]);

    const notes = previewData?.notes || quotation?.notes || "";
    const terms = previewData?.terms || quotation?.terms || "";
    const globalVatEnabled = previewData !== undefined ? previewData.globalVatEnabled : (quotation?.globalVatEnabled ?? true);
    const includeOptionalEquipment = previewData?.includeOptionalEquipment ?? quotation?.includeOptionalEquipment ?? true;
    const frequency = previewData?.frequency || quotation?.frequency || "ไม่ระบุ";
    const memberName = previewData?.memberName || quotation?.memberName || settings?.profile?.name || "-";
    const memberPhone = previewData?.memberPhone || quotation?.memberPhone || settings?.profile?.phone || "-";


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
        const base = item.quantity * item.unitPrice;
        const discountAmount = base * ((item.discount || 0) / 100);
        return sum + (base - discountAmount);
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
      const groups: Record<string, LineItem[]> = {
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
    const itemCategories = Array.from(new Set(items.map(item => item.category).filter((cat): cat is string => Boolean(cat))));
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
        lang="th"
        className="bg-white p-10 mx-auto flex flex-col shadow-2xl print:block print:shadow-none print:p-8 print:m-0 w-[210mm] min-h-[296mm] relative [print-color-adjust:exact] text-[12.5px] text-[#1e293b] font-sans"
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
        {!isClassic && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.035]">
            <img src="/logo.png" alt="" className="w-[120mm] h-[120mm] object-contain grayscale brightness-50" />
          </div>
        )}

        <div className="relative z-10 flex-1 flex flex-col print:block">
          {/* Top Header (Logo & Title) */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="w-32 h-16 flex-none flex items-center justify-start">
                <img src="/logo.png" alt="Company Logo" className="w-full h-full object-contain object-left" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-bold text-[#1e293b] mb-1">(ต้นฉบับ)</p>
              <h2 className={`text-[38px] font-medium leading-none tracking-tight ${isClassic ? "text-gray-800" : "text-[#7a73e6]"}`}>
                ใบเสนอราคา
              </h2>
            </div>
          </div>

          {/* Seller and Document Info */}
          <div className="flex justify-between mb-4 border-b pb-4 border-gray-300 gap-6 items-start">
            {/* Left: Seller Info (Grid Layout) */}
            <div className="flex-1 grid grid-cols-[75px_15px_1fr_150px] gap-y-2 text-[13px] text-[#1e293b] pr-2">
              {/* Row 1 */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">ผู้ขาย</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="font-bold min-w-0 break-words">{company.name || "COMPANY NAME CO., LTD."}</div>
              <div className="flex items-center gap-2 min-w-0"><svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg> <span className="truncate">{company.phone || "02-XXX-XXXX"}</span></div>

              {/* Row 2 */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">ที่อยู่</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="leading-snug whitespace-pre-wrap min-w-0 break-words [word-break:normal]">{company.address || "123 Business Road, City 10100"}</div>
              <div className="space-y-1 min-w-0">
                 <div className="flex items-center gap-2 text-[12px]"><svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg> <span className="truncate">{company.email || "info@example.com"}</span></div>
                 {company.website && <div className="flex items-center gap-2 text-[12px]"><svg className="w-4 h-4 text-gray-700 shrink-0 relative -top-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg> <span className="truncate">{company.website}</span></div>}
              </div>

              {/* Row 3 */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">เลขที่ภาษี</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="col-span-2 min-w-0 break-words">
                {company.taxId || "0100000000000"} <span className="text-gray-600">(สำนักงานใหญ่)</span>
              </div>
            </div>

            {/* Right: Document Info Box (Extra Compact) */}
            <div className="w-fit min-w-[180px] bg-[#f0f1ff] rounded-md p-3 text-[12.5px] shrink-0 self-start">
              <div className="grid grid-cols-[88px_1fr] gap-y-1">
                <div className="text-gray-600">เลขที่เอกสาร :</div>
                <div className="font-semibold text-[#1e293b]">{id}</div>

                <div className="text-gray-600">วันที่ออก :</div>
                <div className="font-semibold text-[#1e293b]">{date}</div>

                <div className="text-gray-600">วันที่ตอบรับ :</div>
                <div className="font-semibold text-[#1e293b]">-</div>

                <div className="text-gray-600">ใช้ได้ถึง :</div>
                <div className="font-semibold text-[#1e293b]">{validUntil}</div>

                <div className="text-gray-600">อ้างอิง :</div>
                <div className="font-semibold text-[#1e293b]">-</div>
              </div>
            </div>
          </div>

          {/* Customer and Contact Info */}
          <div className="flex justify-between mb-8 gap-6 items-start">
            {/* Left: Customer Info (Grid Layout) */}
            {/* Left: Customer Info (Grid Layout) */}
            <div className="flex-1 grid grid-cols-[75px_15px_1fr_150px] gap-y-2 text-[13px] text-[#1e293b] pr-2">
              {/* Row 1: Attention (เรียน) */}
              <div className="font-bold text-gray-500 whitespace-nowrap text-right">เรียน</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="col-span-2 min-w-0 break-words">-</div>

              {/* Row 2: Customer (ลูกค้า) */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">ลูกค้า</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="font-bold min-w-0 break-words">{customerName}</div>
              <div className="flex items-center gap-2 min-w-0"><svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg> <span className="truncate">{customerPhone && customerPhone !== "-" ? customerPhone : "-"}</span></div>

              {/* Row 3: Address (ที่อยู่) */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">ที่อยู่</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="leading-snug whitespace-pre-wrap min-w-0 break-words [word-break:normal]">{customerAddress}</div>
              <div className="flex items-start gap-2 pt-0.5 min-w-0"><svg className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg> <span className="break-words [word-break:normal] text-[12.5px]">{customerEmail && customerEmail !== "-" ? customerEmail : "-"}</span></div>

              {/* Row 4: Tax ID (เลขที่ภาษี) */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">เลขที่ภาษี</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="min-w-0 break-words">
                {customerTaxId && customerTaxId !== "-" ? customerTaxId : "-"} <span className="text-gray-600">(สำนักงานใหญ่)</span>
              </div>

            </div>

            {/* Right: Contact Back (Aligned with Left Grid) */}
            <div className="w-[230px] shrink-0 text-[12.5px] self-start">
              <div className="grid grid-cols-1 gap-y-2">
                {/* Row 1: Header aligned with "เรียน :" */}
                <div className="font-bold text-[#1e293b] h-[19.5px] flex items-center">ติดต่อกลับที่ :</div>
                
                {/* Row 2: Member Name aligned with "ลูกค้า :" */}
                <div className="flex items-center gap-3 text-[#1e293b] h-[19.5px]">
                  <svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  <span className="truncate">{memberName}</span>
                </div>

                {/* Row 3: Member Phone aligned with "ที่อยู่ :" */}
                <div className="flex items-center gap-3 text-[#1e293b] h-[19.5px]">
                  <svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                  <span className="truncate">{memberPhone}</span>
                </div>

                {/* Row 4: Member Email aligned with "เลขที่ภาษี :" */}
                <div className="flex items-center gap-3 text-[#1e293b] h-[19.5px]">
                  <svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  <span className="truncate text-[12px]">{settings?.profile?.email || company.email || "info@example.com"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section (Unified Premium Case) */}
          {effectiveBoatModel && boatSpecifications[effectiveBoatModel] && !isClassic && (
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
                <tr className={`${isClassic ? "bg-gray-800" : "bg-[#283583]"} text-white`}>
                  <th className="py-1 px-4 text-center w-12 font-black text-[12px]">#</th>
                  <th className="py-1 px-4 text-left font-black text-[12px]">รายการ (Description)</th>
                  <th className="py-1 px-4 text-center w-24 font-black text-[12px]">จำนวน (Qty)</th>
                  <th className="py-1 px-4 text-right w-32 font-black text-[12px]">ราคา/หน่วย (Unit)</th>
                  <th className="py-1 px-4 text-right w-36 font-black text-[12px]">จำนวนเงิน (Amount)</th>
                </tr>
              </thead>
              <tbody className={`border-b-2 ${isClassic ? "border-gray-800" : "border-[#283583]"}`}>
                {Object.entries(groupedItems).map(([category, categoryItems]) => {
                  if (categoryItems.length === 0) return null;

                  return (
                    <React.Fragment key={category}>
                      {/* Sub-header row */}
                      <tr className="bg-[#f8fafc]">
                        <td colSpan={5} className="py-0.5 px-4 text-left">
                          <span className={`text-[11px] font-black uppercase tracking-wider ${
                            isClassic ? "text-gray-600" :
                            (category === "สินค้าหลัก" ? "text-indigo-800" :
                            category === "มาตรฐาน" ? "text-sky-700" : (category === "อุปกรณ์เสริม" ? "text-emerald-600" : "text-slate-500"))
                          }`}>
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
                          <tr key={item.id || `${category}-${idx}`} className="border-b border-[#f1f5f9] group">
                            <td className="py-0.5 px-4 text-center font-bold text-[#475569]">{globalIndex}</td>
                            <td className="py-0.5 px-4 text-left">
                              <p className="font-black text-[13px] text-[#0f172a]">{item.name}</p>
                              {item.description && <p className="text-[11px] font-bold text-[#475569]">{item.description}</p>}
                            </td>
                            <td className="py-0.5 px-4 text-center font-bold text-[#1e293b]">{item.quantity}</td>
                            <td className="py-0.5 px-4 text-right font-bold text-[#1e293b]">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-0.5 px-4 text-right font-black text-[14px] text-[#0f172a]">
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
          <div className="flex justify-between items-start mb-6 page-break-avoid break-inside-avoid">
            <div className="flex-1 pr-16 space-y-6">
              {/* Payment Terms replacing Doc Info */}
              <div>
                <h3 className={`text-[11px] font-black uppercase tracking-widest pb-1.5 mb-2 border-b-[1.5px] ${isClassic ? "border-gray-800 text-gray-800" : "border-[#283583] text-[#334155]"} `}>เงื่อนไขการชำระเงิน (Payment Terms)</h3>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    {terms ? (
                      <p className="text-[12px] font-bold leading-relaxed whitespace-pre-wrap text-[#1e293b]">{terms}</p>
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

              {notes && (
                <div>
                  <h4 className="font-bold text-[12px] uppercase mb-2 text-[#1e293b]">หมายเหตุ (Remarks):</h4>
                  <p className="text-[13px] p-4 rounded-lg text-[#475569] bg-[#f8fafc]">{notes}</p>
                </div>
              )}
            </div>

              <div
                className="w-[320px] p-5 rounded-xl border bg-[#f9fafb]/80 border-[#f1f5f9]/60"
              >
              <table className="w-full text-[13px]">
                <tbody>
                  <tr>
                    <td className="py-0.5 font-bold text-[#334155]">รวมเป็นเงิน (Subtotal):</td>
                    <td className="py-0.5 font-black text-right text-[#0f172a]">{formatCurrency(calc.subtotal)}</td>
                  </tr>
                  {!includeOptionalEquipment && items.some(item => {
                    const c = (item.category || "").trim().toLowerCase();
                    return c === "อุปกรณ์เสริม" || c.includes("optional") || c === "อุปกรณ์เสริม r52";
                  }) && (
                      <tr>
                        <td className="py-1.5 text-[11px] font-black text-[#f97316]">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ไม่รวมอุปกรณ์เสริม (Excl. Optional)
                          </span>
                        </td>
                        <td className="py-1.5 text-[11px] text-right font-black text-[#f97316]">-</td>
                      </tr>
                    )}
                  {(calc.discount ?? 0) > 0 && (
                    <tr>
                      <td className="py-0.5 font-bold text-[#334155]">ส่วนลด (Discount):</td>
                      <td className="py-0.5 font-black text-right text-[#ef4444]">-{formatCurrency(calc.discount || 0)}</td>
                    </tr>
                  )}
                  {(calc.discount ?? 0) > 0 && (
                    <tr>
                      <td className="py-0.5 font-bold text-[#334155]">หลังหักส่วนลด (After Discount):</td>
                      <td className="py-0.5 font-black text-right text-[#0f172a]">{formatCurrency(calc.afterDiscount || 0)}</td>
                    </tr>
                  )}
                  {globalVatEnabled && (
                    <tr>
                      <td className="py-0.5 font-bold text-[#334155]">ภาษีมูลค่าเพิ่ม (VAT {(settings?.quotationSettings?.vatRate || 7)}%):</td>
                      <td className="py-0.5 font-black text-right text-[#0f172a]">{formatCurrency(calc.vat)}</td>
                    </tr>
                  )}
                  <tr>
                    <td className={`pt-2 pb-1 font-black text-[14px] ${isClassic ? "text-gray-900" : "text-[#283583]"}`}>จำนวนเงินรวมทั้งสิ้น (Grand Total):</td>
                    <td className={`pt-2 pb-1 font-black text-right text-[20px] ${isClassic ? "text-gray-900 border-gray-900" : "text-[#283583] border-[#283583]"} border-b-[3px] border-double`}>{formatCurrency(calc.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures placed strictly at the bottom using mt-auto avoiding overlaps */}
          <div className="mt-auto print:mt-10 pt-4 pb-10 break-inside-avoid-page page-break-avoid break-inside-avoid">
            <div className="flex justify-between px-8 text-center">
              <div className="w-[260px]">
                <div className={`mb-3 h-20 w-full flex items-end justify-center border-b-2 ${isClassic ? "border-gray-800" : "border-[#283583]"}`}></div>
                <p className="font-bold mt-3 text-[#1e293b]">( _________________________ )</p>
                <p className="mt-1 flex flex-col gap-0.5 text-[#475569]">
                  <span>ผู้อนุมัติสั่งซื้อ</span>
                  <span className="text-[11px] font-black text-[#64748b]">Authorized Signature</span>
                </p>
                <p className="mt-2 text-xs text-[#94a3b8]">วันที่ (Date): ____/____/_____</p>
              </div>

              <div className="w-[260px]">
                <div className={`mb-3 h-20 w-full flex items-end justify-center border-b-2 ${isClassic ? "border-gray-800" : "border-[#283583]"}`}></div>
                <p className="font-bold mt-3 text-[#1e293b]">{memberName !== "-" ? memberName : "( _________________________ )"}</p>
                <p className="mt-1 flex flex-col gap-0.5 text-[#475569]">
                  <span>ผู้เสนอราคา</span>
                  <span className="text-[11px] font-black text-[#64748b]">Quotation by</span>
                </p>
                <p className="mt-2 text-xs text-[#94a3b8]">วันที่ (Date): {date}</p>
              </div>
            </div>
          </div>


          {/* Boat Images Gallery - shows ALL images in groups of 5 (1 hero + 4 grid) */}
          {(() => {
            if (isClassic) return null;
            const boatSpecs = effectiveBoatModel ? boatSpecifications[effectiveBoatModel] : null;
            const boatImages = boatSpecs?.images || [];
            const customImgs = previewData?.customImages || quotation?.customImages || [];

            // Merge: custom images first, then boat spec images
            const allImages = [...customImgs, ...boatImages];

            if (allImages.length === 0) return null;

            const galleryTitle = effectiveBoatModel ? `Visual Gallery • ${effectiveBoatModel} Series` : "Visual Gallery";

            // Split images into groups of 5: [hero, grid1, grid2, grid3, grid4]
            const groups: string[][] = [];
            for (let i = 0; i < allImages.length; i += 5) {
              groups.push(allImages.slice(i, i + 5));
            }

            return (
              <>
                {groups.map((group, groupIdx) => (
                  <div key={groupIdx} className="mt-4 pt-4 border-t border-slate-100" data-page-break-before="always">
                    {groupIdx === 0 && (
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 text-center">{galleryTitle}</h4>
                    )}

                    {/* Hero image (first in each group) */}
                    <div className="mb-2 page-break-avoid">
                      <div className="rounded-[12px] overflow-hidden border border-slate-200 shadow-sm bg-white aspect-[16/10]">
                        <img src={group[0]} alt={`gallery hero ${groupIdx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {/* Remaining images in 2x2 grid */}
                    {group.length > 1 && (
                      <div className="grid grid-cols-2 gap-2 w-full page-break-avoid">
                        {group.slice(1).map((img, i) => (
                          <div key={i}>
                            <div className="rounded-[8px] overflow-hidden border border-slate-200 shadow-sm bg-white aspect-[16/9]">
                              <img src={img} alt={`gallery view ${groupIdx * 5 + i + 2}`} className="w-full h-full object-cover" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
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
