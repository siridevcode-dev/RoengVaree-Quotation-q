"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useAppContext } from "@/context/AppContext";
import QuotationDocument from "./QuotationDocument";
import { compressImage, safeLocalStorageSet } from "@/lib/image-utils";

interface LineItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  vatEnabled: boolean;
  category?: string;
}

const defaultItem = (): LineItem => ({
  id: Date.now(),
  name: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  vatEnabled: true,
});

export default function QuotationForm({ onNavigate, quotationId, initialItems, initialImages }: { onNavigate?: (page: string, id?: string) => void, quotationId?: string, initialItems?: any[], initialImages?: string[] }) {
  const { addQuotation, updateQuotation, quotations, settings, customers, setCustomers, showToast, products, boatModels, currentUser, generateNextId, users, addCustomer, updateCustomer } = useAppContext();
  const formRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const hasHydrated = useRef(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [currentId, setCurrentId] = useState(() => quotationId || generateNextId("Q"));
  
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 1,
      name: "Item/Service 1",
      description: "Description item 1",
      quantity: 1,
      unitPrice: 50.0,
      discount: 50,
      vatEnabled: false,
    },
  ]);

  const [status, setStatus] = useState("ฉบับร่าง");
  const [frequency, setFrequency] = useState("ไม่ระบุ");
  const [searchProduct, setSearchProduct] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(() => {
    const dt = settings?.quotationSettings?.defaultTerms;
    if (Array.isArray(dt)) return dt.join("\n");
    return dt || "";
  });
  const [globalVatEnabled, setGlobalVatEnabled] = useState(settings?.quotationSettings?.defaultVat ?? true);
  const vatRate = settings?.quotationSettings?.vatRate || 7;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerTaxId, setCustomerTaxId] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [summaryDiscountAmount, setSummaryDiscountAmount] = useState(0);
  const [summaryDiscountPercentage, setSummaryDiscountPercentage] = useState(0);
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const [boatModel, setBoatModel] = useState<string>("");
  const [templateName, setTemplateName] = useState("");
  const [templateFrequency, setTemplateFrequency] = useState("รายเดือน");
  const [includeOptionalEquipment, setIncludeOptionalEquipment] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState(currentUser?.id || "");
  const [customImages, setCustomImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);


  // Automatic boat model detection (NEW)
  const detectedBoatModel = useMemo(() => {
    // If no boat model is manually selected, check items for known models
    for (const model of boatModels) {
      if (items.some(item => item.name.toUpperCase().includes(model.toUpperCase()))) {
        return model;
      }
    }
    return "";
  }, [items, boatModels]);

  const effectiveBoatModel = boatModel || detectedBoatModel;

  const filteredCustomers = useMemo(() => {
    if (!customerName.trim() || !showSuggestions) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerName.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(customerName.toLowerCase()))
    ).slice(0, 5);
  }, [customerName, customers, showSuggestions]);

  const handleSelectCustomer = (c: any) => {
    setCustomerName(c.name);
    setCustomerEmail(c.email || "");
    setCustomerPhone(c.phone || "");
    setCustomerAddress(c.address || "");
    setCustomerTaxId(c.taxId || "");
    setShowSuggestions(false);
  };

  // Hydrate data if editing an existing quotation or starting with selected items
  useEffect(() => {
    // Only hydrate once on mount or when quotationId changes
    if (hasHydrated.current && !quotationId) return;
    
    if (quotationId) {
      const existing = quotations.find((q) => q.id === quotationId);
      if (existing) {
        setCustomerName(existing.customer);
        setCustomerEmail(existing.customerEmail || "");
        setCustomerPhone(existing.customerPhone || "");
        setCustomerAddress(existing.customerAddress || "");
        setCustomerTaxId(existing.customerTaxId || "");
        if (existing.lineItems && existing.lineItems.length > 0) {
          setItems(existing.lineItems);
        }
        setNotes(existing.notes || "");
        setTerms(existing.terms || "");
        setStatus(existing.status);
        if (existing.globalVatEnabled !== undefined) {
          setGlobalVatEnabled(existing.globalVatEnabled);
        }
        setSummaryDiscountAmount(existing.summaryDiscountAmount || 0);
        setSummaryDiscountPercentage(existing.summaryDiscountPercentage || 0);
        setBoatModel(existing.boatModel || "");
        if (existing.includeOptionalEquipment !== undefined) {
          setIncludeOptionalEquipment(existing.includeOptionalEquipment);
        }
        if (existing.frequency !== undefined) {
          setFrequency(existing.frequency);
        }
        if (existing.customImages) {
          setCustomImages(existing.customImages);
        }
        if (existing.memberName) {
          const found = users.find(u => u.name === existing.memberName);
          if (found) setSelectedMemberId(found.id);
        }
        hasHydrated.current = true;
      }
    } else if (initialItems && initialItems.length > 0) {
      // New quotation started with selected products
      const mappedItems: LineItem[] = initialItems.map((p, index) => ({
        id: Date.now() + index,
        name: p.name,
        description: p.description,
        quantity: 1,
        unitPrice: p.unitPrice,
        discount: 0,
        vatEnabled: true,
        category: p.category,
      }));
      setItems(mappedItems);

      // Auto-detect boat model from selected products
      const productWithModel = initialItems.find((p: any) => p.boatModel && p.boatModel !== "ทุกรุ่น" && p.boatModel !== "");
      if (productWithModel) {
        setBoatModel(productWithModel.boatModel);
      } else {
        // Fallback: detect from product names
        for (const model of boatModels) {
          if (initialItems.some((p: any) => (p.name || "").toUpperCase().includes(model.toUpperCase()))) {
            setBoatModel(model);
            break;
          }
        }
      }
      // Restore custom images from template
      if (initialImages && initialImages.length > 0) {
        setCustomImages(initialImages);
      }
      hasHydrated.current = true;
    }
  }, [quotationId, initialItems, initialImages, quotations, boatModels, setCustomerName, setCustomerEmail, setCustomerPhone, setCustomerAddress, setCustomerTaxId, setItems, setNotes, setTerms, setStatus, setGlobalVatEnabled, setSummaryDiscountAmount, setSummaryDiscountPercentage, setBoatModel, setIncludeOptionalEquipment, setFrequency, setCustomImages, users]);

  const updateItem = (id: number, field: keyof LineItem, value: string | number | boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, defaultItem()]);
  };

  const addCategorizedItem = (category: string) => {
    setItems((prev) => [...prev, { ...defaultItem(), category }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const getRowTotal = (item: LineItem) => {
    const base = item.quantity * item.unitPrice;
    const discountAmount = base * (item.discount / 100);
    return base - discountAmount;
  };

  const calculations = useMemo(() => {
    // Separate optional equipment items
    const isOptional = (cat: string) => {
      const c = (cat || "").trim().toLowerCase();
      return c === "อุปกรณ์เสริม" || c.includes("optional") || c === "อุปกรณ์เสริม r52";
    };
    const optionalItems = items.filter(item => isOptional(item.category || ""));
    const nonOptionalItems = items.filter(item => !isOptional(item.category || ""));
    
    // Calculate optional equipment subtotal
    const optionalSubtotal = optionalItems.reduce((sum, item) => {
      const base = item.quantity * item.unitPrice;
      const disc = base * (item.discount / 100);
      return sum + (base - disc);
    }, 0);
    
    // Calculate non-optional subtotal  
    const nonOptionalSubtotal = nonOptionalItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const nonOptionalLineDiscount = nonOptionalItems.reduce((sum, item) => {
      const base = item.quantity * item.unitPrice;
      return sum + base * (item.discount / 100);
    }, 0);
    
    // Full subtotal (all items)
    const fullSubtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const fullLineItemDiscount = items.reduce((sum, item) => {
      const base = item.quantity * item.unitPrice;
      return sum + base * (item.discount / 100);
    }, 0);
    
    // Effective subtotal based on toggle
    const effectiveSubtotal = includeOptionalEquipment ? fullSubtotal : nonOptionalSubtotal;
    const effectiveLineDiscount = includeOptionalEquipment ? fullLineItemDiscount : nonOptionalLineDiscount;
    
    const globalAmountDiscount = summaryDiscountAmount || 0;
    const globalPercentDiscount = effectiveSubtotal * (summaryDiscountPercentage / 100);
    
    const totalDiscount = effectiveLineDiscount + globalAmountDiscount + globalPercentDiscount;
    const taxBase = effectiveSubtotal - totalDiscount;
    // Calculate VAT globally based on toggle
    const vat = globalVatEnabled ? taxBase * (vatRate / 100) : 0;
    const grandTotal = taxBase + vat;

    return { subtotal: effectiveSubtotal, totalDiscount, taxBase, vat, grandTotal, lineItemDiscount: effectiveLineDiscount, globalAmountDiscount, globalPercentDiscount, optionalSubtotal, includeOptionalEquipment };
  }, [items, globalVatEnabled, summaryDiscountAmount, summaryDiscountPercentage, vatRate, includeOptionalEquipment]);

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

  const formatCurrency = (val: number) =>
    val.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    });

  const handleSave = (saveStatus: string, skipNavigate = false) => {
    if (!customerName.trim()) {
      showToast("กรุณากรอกชื่อบริษัท / ลูกค้า", "error");
      return null;
    }

    if (items.length === 0 || items.every(item => !item.name.trim())) {
      showToast("กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ", "error");
      return null;
    }

    if (items.some(item => item.quantity <= 0 || item.unitPrice < 0)) {
      showToast("จำนวนสินค้าและราคาต้องไม่เป็นค่าว่างหรือติดลบ", "error");
      return null;
    }

    // Save to customers context
    // Save/Update to customers context using centralized actions
    const existingCust = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    if (!existingCust) {
      const newCustomerData = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        taxId: customerTaxId,
      };
      addCustomer(newCustomerData);
    } else {
      updateCustomer(existingCust.id, {
        totalQuotations: existingCust.totalQuotations + 1,
        totalRevenue: existingCust.totalRevenue + calculations.grandTotal,
        lastActivity: new Date().toLocaleDateString("th-TH")
      });
    }

    const savedQuotation = {
      id: currentId,
      customer: customerName,
      amount: calculations.grandTotal,
      status: saveStatus,
      date: new Date().toLocaleDateString("th-TH"),
      items: items.length,
      validUntil: new Date(Date.now() + (settings?.quotationSettings?.validDays || 30) * 86400000).toLocaleDateString("th-TH"),
      customerEmail,
      customerPhone,
      customerAddress,
      customerTaxId,
      lineItems: items,
      notes,
      terms,
      globalVatEnabled,
      summaryDiscountAmount,
      summaryDiscountPercentage,
      boatModel: effectiveBoatModel,
      includeOptionalEquipment,
      frequency,
      createdBy: currentUser?.name || "System",
      memberName: users.find(u => u.id === selectedMemberId)?.name || currentUser?.name || "System",
      memberPhone: users.find(u => u.id === selectedMemberId)?.phone || currentUser?.phone || "-",
      customImages: customImages.length > 0 ? customImages : undefined
    };

    if (quotationId) {
      updateQuotation(savedQuotation);
      showToast(`อัปเดต ${savedQuotation.id} สำเร็จ!`);
    } else {
      addQuotation(savedQuotation);
      showToast(`สร้าง ${savedQuotation.id} สำเร็จ!`);
    }

    if (onNavigate && !skipNavigate) {
      setTimeout(() => onNavigate("Quotations"), 500);
    }
    
    return savedQuotation;
  };



  const handleSaveAsTemplate = () => {
    try {
      const finalName = templateName.trim() || (customerName ? `เทมเพลต - ${customerName}` : `เทมเพลตใหม่ ${new Date().toLocaleDateString("th-TH")}`);
      
      const saved = localStorage.getItem("qm_templates");
      let templates = [];
      try {
        templates = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(templates)) templates = [];
      } catch (e) {
        templates = [];
      }
      
      const newTemplate = {
        id: Date.now(),
        name: finalName,
        customer: customerName || "เทมเพลตมาตรฐาน",
        items: items.length,
        amount: calculations.grandTotal,
        frequency: templateFrequency,
        lastUsed: "-",
        nextDue: "-",
        isActive: true,
        lineItems: [...items], // Deep copy items
        customImages: customImages.length > 0 ? [...customImages] : undefined
      };
      
      templates.push(newTemplate);
      const jsonStr = JSON.stringify(templates);
      
      // Try saving with images first
      if (!safeLocalStorageSet("qm_templates", jsonStr)) {
        // Quota exceeded — retry without images on ALL templates
        const templatesWithoutImages = templates.map((t: any) => {
          const { customImages: _imgs, ...rest } = t;
          return rest;
        });
        const fallbackJson = JSON.stringify(templatesWithoutImages);
        if (!safeLocalStorageSet("qm_templates", fallbackJson)) {
          showToast("พื้นที่จัดเก็บเต็ม กรุณาลบเทมเพลตเก่าที่ไม่ใช้แล้วลองใหม่", "error");
          return;
        }
        showToast(`บันทึกเทมเพลต '${finalName}' สำเร็จ! (ไม่รวมรูปภาพเนื่องจากพื้นที่จัดเก็บจำกัด)`, "info");
      } else {
        showToast(`บันทึกเทมเพลต '${finalName}' สำเร็จ!`, "success");
      }
      
      if (onNavigate) {
        setTimeout(() => onNavigate("Quotation Templates"), 300);
      }
    } catch (err: any) {
      console.error("Save template error:", err);
      showToast("ไม่สามารถบันทึกเทมเพลตได้: " + (err?.message || String(err)), "error");
    }
  };

  const handleSaveAndPDF = async (saveStatus: string) => {
    const saved = handleSave(saveStatus, true);
    if (!saved) return;

    setCurrentId(saved.id);
    setShowDownloadBtn(true);
    setIsPreviewOpen(true);
  };

  const getPreviewData = () => ({
    id: currentId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerTaxId,
    date: new Date().toLocaleDateString("th-TH"),
    validUntil: new Date(Date.now() + (settings?.quotationSettings?.validDays || 30) * 86400000).toLocaleDateString("th-TH"),
    items,
    notes,
    terms,
    globalVatEnabled,
    vatRate,
    calculations,
    summaryDiscountAmount,
    summaryDiscountPercentage,
    includeOptionalEquipment,
    frequency,
    boatModel: effectiveBoatModel,
    memberName: users.find(u => u.id === selectedMemberId)?.name || currentUser?.name || "System",
    memberPhone: users.find(u => u.id === selectedMemberId)?.phone || currentUser?.phone || "-",
    customImages: customImages.length > 0 ? customImages : undefined
  });

  const generatePDF = async () => {
    if (!pdfRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    
    try {
      const element = pdfRef.current;
      // Optimized scale: 1.6 provides good balance between print quality and file size
      const renderScale = 1.6;

      const canvas = await html2canvas(element, { 
        scale: renderScale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        // Optimization: Reduce image quality if needed directly in canvas can be tricky, 
        // better to handle it during toDataURL conversion.
      });

      // Enable compression in jsPDF initialization
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

      // Detect table header and rows for repetition and smart slicing
      const theadEl = element.querySelector("thead");
      const tbodyEl = element.querySelector("tbody");
      let headerCanvas: HTMLCanvasElement | null = null;
      let headerHeightInCanvas = 0;
      let tableHeaderEndY = 0;
      let tableBodyEndY = 0;
      const rowRects: { top: number, bottom: number }[] = [];
      // Track forced page break positions (elements with data-page-break-before="always")
      const forceBreakYPositions: number[] = [];

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
        if (hCtx) {
          hCtx.drawImage(canvas, 0, headerTopY, canvas.width, headerHeightInCanvas, 0, 0, canvas.width, headerHeightInCanvas);
        }

        // Collect all table rows and page-break-avoid elements to prevent cutting them in half
        const avoidEls = element.querySelectorAll("tr, .page-break-avoid");
        avoidEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          rowRects.push({
            top: Math.round((rect.top - elRect.top) * renderScale),
            bottom: Math.round((rect.bottom - elRect.top) * renderScale)
          });
        });
      }

      // Detect elements that force a page break before them
      const forceBreakEls = element.querySelectorAll('[data-page-break-before="always"]');
      forceBreakEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        forceBreakYPositions.push(Math.round((rect.top - elRect.top) * renderScale));
      });

      // Generate pages with smart header repetition and row-aware slicing
      const totalCanvasHeight = canvas.height;
      let contentY = 0;
      let pageNum = 0;
      const continuedBarHeight = Math.round(22 * renderScale);

      while (contentY < totalCanvasHeight) {
        if (pageNum > 0) pdf.addPage();

        const isInTableBody = headerCanvas && contentY > tableHeaderEndY && contentY < tableBodyEndY;
        const extraHeaderH = isInTableBody ? (continuedBarHeight + headerHeightInCanvas) : 0;

        const availableForContent = pageHeightInCanvas - extraHeaderH;
        let contentSlice = Math.min(availableForContent, totalCanvasHeight - contentY);

        // Check for forced page breaks within this slice
        const potentialSliceEnd = contentY + contentSlice;
        for (const breakY of forceBreakYPositions) {
          // If a forced break point falls within the current slice (but not at the very start)
          if (breakY > contentY + 10 && breakY < potentialSliceEnd) {
            contentSlice = breakY - contentY;
            break;
          }
        }

        // Prevent cutting a row/avoid-element in half
        const finalSliceEnd = contentY + contentSlice;
        if (finalSliceEnd < totalCanvasHeight) {
          for (const row of rowRects) {
            // Find if the potential slice end cuts right through a row
            if (row.top > contentY && row.top < finalSliceEnd && row.bottom > finalSliceEnd) {
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

        ctx.drawImage(
          canvas,
          0, contentY, canvas.width, contentSlice,
          0, extraHeaderH, canvas.width, contentSlice
        );

        const renderHeight = totalSliceHeight / scaleFactor;
        // Optimization: Use JPEG instead of PNG and set quality to 0.75-0.85
        // "FAST" compression in addImage helps with processing speed
        pdf.addImage(
          pageCanvas.toDataURL("image/jpeg", 0.8), 
          "JPEG", 
          0, 0, 
          pdfPageWidth, renderHeight,
          undefined,
          "FAST"
        );

        contentY += contentSlice;
        pageNum++;
      }

      // Add page numbers
      const totalPages = pdf.getNumberOfPages();
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`${i} / ${totalPages}`, pdfPageWidth - 40, pdfPageHeight - 10);
        }
      }

      pdf.save(`ใบเสนอราคา_${currentId || "ฉบับร่าง"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("ไม่สามารถสร้าง PDF ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePreview = () => {
    setShowDownloadBtn(false);
    setIsPreviewOpen(true);
  };

  const addBoatEquipment = (category: string) => {
    // 1. Identify boat model from current items
    const detectedModel = boatModels.find(model => 
      items.some(item => item.name.toUpperCase().includes(model.toUpperCase()))
    );

    if (!detectedModel && !boatModel) {
      showToast("กรุณาเลือกรุ่นเรือเพื่อเลือกชนิดของอุปกรณ์", "error");
      return;
    }

    const finalModel = boatModel || detectedModel;

    // 2. Filter products by model and category
    const targetCat = category.trim().toLowerCase();
    const finalModelUpper = (finalModel || "").trim().toUpperCase();
    
    const equipment = products.filter(p => {
      const pCat = (p.category || "").trim().toLowerCase();
      const pModel = (p.boatModel || "").trim().toUpperCase();
      
      const isCatMatch = pCat === targetCat || pCat.includes(targetCat) || targetCat.includes(pCat);
      const isModelMatch = pModel === finalModelUpper || pModel === "ทุกรุ่น" || pModel === "";
      
      return isCatMatch && isModelMatch;
    });
    
    if (equipment.length === 0) {
      showToast(`ไม่พบรายการ${category}สำหรับเรือรุ่น ${finalModel || "ไม่ระบุ"} (ตรวจสอบในหน้าตั้งค่าสินค้า)`, "info");
      return;
    }

    // 3. Map to LineItems
    const newItems = equipment.map((p, index) => ({
      id: Date.now() + index + Math.random(),
      name: p.name,
      description: p.description,
      quantity: 1,
      unitPrice: p.unitPrice,
      discount: 0,
      vatEnabled: true,
      category: p.category,
    }));

    setItems(prev => {
      // Clean up empty default rows if they exist
      const filteredPrev = prev.filter(item => item.name.trim() !== "" || item.unitPrice > 0);
      return [...filteredPrev, ...newItems];
    });
    
    showToast(`เพิ่มรายการ${category}สำหรับรุ่น ${finalModel} จำนวน ${equipment.length} รายการ`, "success");
  };

  return (
    <div className="flex-1 overflow-auto" ref={formRef}>
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Form Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 print:mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate && onNavigate(quotationId ? "Quotation View" : "Quotations", quotationId)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quotationId ? "Edit Quotation" : "Create New Quotation"}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">Quotation number:</span>
                <input
                  type="text"
                  value={currentId}
                  onChange={(e) => setCurrentId(e.target.value)}
                  className="font-semibold text-teal-700 bg-transparent border-b border-dashed border-teal-200 focus:border-teal-500 focus:outline-none px-1 py-0"
                  title="คลิกเพื่อแก้ไขเลขที่ใบเสนอราคา"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">Date</label>
              <input
                type="date"
                defaultValue="2026-03-29"
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all w-[130px]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">Status (สถานะ)</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all appearance-none pr-8 cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                }}
              >
                <option value="ฉบับร่าง">ฉบับร่าง (Draft)</option>
                <option value="รอดำเนินการ">รอดำเนินการ (Pending)</option>
                <option value="ส่งแล้ว">ส่งแล้ว (Sent)</option>
                <option value="อนุมัติแล้ว">อนุมัติแล้ว (Approved)</option>
                <option value="ปฏิเสธ">ปฏิเสธ (Rejected)</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">รอบการเรียกเก็บ</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all appearance-none pr-8 cursor-pointer min-w-[120px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                }}
              >
                <option value="ไม่ระบุ">ไม่ระบุ</option>
                <option value="รายเดือน">รายเดือน</option>
                <option value="รายไตรมาส">รายไตรมาส</option>
                <option value="รายปี">รายปี</option>
              </select>
            </div>
            


          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">ชื่อบริษัท / ลูกค้า *</label>
                    <input
                      type="text"
                      value={customerName || ""}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="พิมพ์เพื่อค้นหาชื่อลูกค้า..."
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-400"
                    />
                    
                    {filteredCustomers.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                        {filteredCustomers.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectCustomer(c)}
                            className="w-full text-left px-4 py-3 hover:bg-teal-50 border-b border-gray-50 last:border-none transition-colors group"
                          >
                            <div className="font-bold text-gray-800 group-hover:text-teal-700">{c.name}</div>
                            {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">อีเมล</label>
                      <input
                        type="email"
                        value={customerEmail || ""}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">เบอร์โทร</label>
                      <input
                        type="text"
                        value={customerPhone || ""}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="02-XXX-XXXX"
                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">ที่อยู่</label>
                    <input
                      type="text"
                      value={customerAddress || ""}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="ที่อยู่"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">เลขประจำตัวผู้เสียภาษี</label>
                    <input
                      type="text"
                      value={customerTaxId || ""}
                      onChange={(e) => setCustomerTaxId(e.target.value)}
                      placeholder="0105-XXX-XXXX"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <BoatSpecsPreview model={effectiveBoatModel} />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Line Items
                </h2>
                <div className="relative">
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchProduct || ""}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all w-56 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3 min-w-[160px]">Item/Service</th>
                      <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3 min-w-[160px]">Description</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 w-[90px]">Quantity</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 w-[110px]">Unit Price</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 w-[100px]">Discount (%)</th>

                      <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3 w-[100px]">Total</th>
                      <th className="w-[50px] px-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(groupedItems).map(([category, categoryItems]) => {
                      if (categoryItems.length === 0) return null;
                      
                      return (
                        <React.Fragment key={category}>
                          {/* Category Header Row */}
                          <tr className="bg-gray-50/80">
                            <td colSpan={7} className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  category === "สินค้าหลัก" ? "bg-teal-600 shadow-[0_0_8px_rgba(13,148,136,0.6)]" :
                                  category === "มาตรฐาน" ? "bg-blue-500" : (category === "อุปกรณ์เสริม" ? "bg-emerald-500" : "bg-gray-400")
                                }`}></div>
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                  category === "สินค้าหลัก" ? "text-teal-800" :
                                  category === "มาตรฐาน" ? "text-blue-700" : (category === "อุปกรณ์เสริม" ? "text-emerald-700" : "text-gray-500")
                                }`}>
                                  {category === "สินค้าหลัก" ? "MAIN PRODUCT (สินค้าหลัก)" :
                                   category === "มาตรฐาน" ? "STANDARD EQUIPMENT (รายการมาตรฐาน)" : 
                                   category === "อุปกรณ์เสริม" ? "OPTIONAL EQUIPMENT (อุปกรณ์เสริม)" : 
                                   "OTHER ITEMS (รายการอื่นๆ)"}
                                </span>
                              </div>
                            </td>
                          </tr>
                          
                          {categoryItems.map((item) => (
                            <tr key={item.id} className="group hover:bg-teal-50/30 transition-colors">
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={item.name || ""}
                                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                  placeholder="Item name"
                                  className="w-full px-2.5 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-400"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={item.description || ""}
                                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                  placeholder="Description"
                                  className="w-full px-2.5 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-400"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 0)}
                                  min="0"
                                  className="w-full px-2.5 py-2 text-sm text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">฿</span>
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    value={item.unitPrice ? item.unitPrice.toLocaleString("en-US") : ""}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/,/g, "");
                                      const num = parseFloat(raw);
                                      updateItem(item.id, "unitPrice", isNaN(num) ? 0 : num);
                                    }}
                                    placeholder="0"
                                    className="w-full pl-6 pr-2.5 py-2 text-sm text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  value={item.discount}
                                  onChange={(e) => updateItem(item.id, "discount", Number(e.target.value) || 0)}
                                  min="0"
                                  max="100"
                                  className="w-full px-2.5 py-2 text-sm text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                                />
                              </td>

                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-semibold text-gray-800">
                                  {formatCurrency(getRowTotal(item))}
                                </span>
                              </td>
                              <td className="px-2 py-2">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-2">
                  <button
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add row
                  </button>
                  
                  {groupedItems["มาตรฐาน"].length === 0 ? (
                    <button
                      onClick={() => addBoatEquipment("มาตรฐาน")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      มาตรฐาน
                    </button>
                  ) : (
                    <button
                      onClick={() => addCategorizedItem("มาตรฐาน")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add row มาตรฐาน
                    </button>
                  )}
                  
                  {groupedItems["อุปกรณ์เสริม"].length === 0 ? (
                    <button
                      onClick={() => addBoatEquipment("อุปกรณ์เสริม")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      อุปกรณ์เสริม
                    </button>
                  ) : (
                    <button
                      onClick={() => addCategorizedItem("อุปกรณ์เสริม")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add row อุปกรณ์เสริม
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Items total:{" "}
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(calculations.taxBase)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-sm font-semibold text-gray-800">Notes</h2>
                </div>
                <div className="p-4">
                  <textarea
                    value={notes || ""}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your terms & conditions"
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-sm font-semibold text-gray-800">Terms & Conditions</h2>
                </div>
                <div className="p-4">
                  <textarea
                    value={terms || ""}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Terms & Conditions"
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 print:hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  รูปภาพประกอบใบเสนอราคา ({customImages.length} รูป)
                </h2>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    
                    showToast(`กำลังประมวลผล ${files.length} รูปภาพ...`, "info");
                    
                    for (const file of Array.from(files)) {
                      if (file.size > 10 * 1024 * 1024) {
                        showToast(`รูป ${file.name} ขนาดเกิน 10MB`, "error");
                        continue;
                      }
                      
                      try {
                        const base64 = await new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = (ev) => resolve(ev.target?.result as string);
                          reader.onerror = reject;
                          reader.readAsDataURL(file);
                        });

                        if (base64) {
                          const compressed = await compressImage(base64, 1200, 1200, 0.7);
                          setCustomImages(prev => [...prev, compressed]);
                        }
                      } catch (err) {
                        console.error("Image process error:", err);
                        showToast(`ไม่สามารถประมวลผลรูป ${file.name}`, "error");
                      }
                    }
                    
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-all active:scale-[0.98]"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  เพิ่มรูป
                </button>
              </div>
              <div className="p-4">
                {customImages.length === 0 ? (
                  <div 
                    onClick={() => imageInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.add('border-teal-500', 'bg-teal-50/50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('border-teal-500', 'bg-teal-50/50');
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('border-teal-500', 'bg-teal-50/50');
                      
                      const files = e.dataTransfer.files;
                      if (!files || files.length === 0) return;
                      
                      showToast(`กำลังประมวลผล ${files.length} รูปภาพ...`, "info");
                      
                      for (const file of Array.from(files)) {
                        if (!file.type.startsWith('image/')) continue;
                        if (file.size > 10 * 1024 * 1024) {
                          showToast(`รูป ${file.name} ขนาดเกิน 10MB`, "error");
                          continue;
                        }
                        
                        try {
                          const base64 = await new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (ev) => resolve(ev.target?.result as string);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                          });
                          const compressed = await compressImage(base64, 1200, 1200, 0.7);
                          setCustomImages(prev => [...prev, compressed]);
                        } catch (err) {
                          showToast(`ไม่สามารถประมวลผลรูป ${file.name}`, "error");
                        }
                      }
                    }}
                    className="border-2 border-dashed border-gray-200 rounded-xl py-10 flex flex-col items-center gap-3 cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-teal-700">คลิกหรือลากรูปภาพมาวางที่นี่</p>
                      <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ภาพหลายรูปพร้อมกัน (สูงสุด 10MB/รูป)</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {customImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                        <img src={img} alt={`uploaded-${idx}`} className="w-full aspect-[4/3] object-cover" />
                        <button
                          onClick={() => setCustomImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          title="ลบรูปนี้"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                          <span className="text-[10px] text-white font-bold">รูปที่ {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                    <div 
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-lg aspect-[4/3] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all"
                    >
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[10px] text-gray-400">เพิ่มรูป</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-teal-50/50 rounded-xl border border-teal-100 p-4 mb-6 space-y-3 print:hidden">
              <div className="flex items-center gap-2 text-teal-800 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                <span className="text-xs font-bold uppercase tracking-wider">บันทึกเป็นชุดเทมเพลต (Template Collection)</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={templateName || ""}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="ตั้งชื่อเทมเพลต (เช่น ชุดอุปกรณ์ R52, แพ็กเกจมาตรฐาน...)"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <select
                  value={templateFrequency}
                  onChange={(e) => setTemplateFrequency(e.target.value)}
                  className="px-3 py-2 text-sm bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
                >
                  <option value="รายเดือน">รายเดือน</option>
                  <option value="รายไตรมาส">รายไตรมาส</option>
                  <option value="รายปี">รายปี</option>
                  <option value="ไม่ระบุ">ไม่ระบุ</option>
                </select>
                <button 
                  onClick={handleSaveAsTemplate}
                  className="px-5 py-2 text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  บันทึกเทมเพลตใหม่
                </button>
              </div>
              <p className="text-[11px] text-teal-600/70 italic">
                * คุณสามารถสร้างกี่เทมเพลตก็ได้ ระบบจะจำรายการสินค้าและราคาไว้เรียกใช้ง่ายๆ ที่เมนู Quotation Templates
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 print:hidden">
              <button onClick={() => handleSaveAndPDF("ฉบับร่าง")} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 active:scale-[0.98]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {quotationId ? "Update & Save PDF" : "Save as PDF"}
              </button>
              <button onClick={handlePreview} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-[0.98]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
            </div>
          </div>

          <div className="xl:sticky xl:top-6 self-start">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-600 to-teal-700">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Quotation Summary
                </h2>
              </div>
              <div className="p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrency(calculations.subtotal)}
                  </span>
                </div>
                <div className="border-b border-dashed border-gray-200"></div>

                {/* Optional Equipment Toggle */}
                {calculations.optionalSubtotal > 0 && (
                  <>
                    <div className={`p-3 -mx-1 rounded-lg border-2 transition-all ${
                      includeOptionalEquipment 
                        ? "border-emerald-300 bg-emerald-50/50" 
                        : "border-orange-200 bg-orange-50/30"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${includeOptionalEquipment ? "bg-emerald-500" : "bg-orange-400"}`}></div>
                          <span className={`text-xs font-bold ${includeOptionalEquipment ? "text-emerald-700" : "text-orange-600"}`}>
                            อุปกรณ์เสริม (Optional)
                          </span>
                        </div>
                        <button
                          onClick={() => setIncludeOptionalEquipment(!includeOptionalEquipment)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${includeOptionalEquipment ? "bg-emerald-500" : "bg-orange-400"}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${includeOptionalEquipment ? "left-6" : "left-1"}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed ${includeOptionalEquipment ? 'border-emerald-200' : 'border-orange-200'}">
                        <span className={`text-xs font-medium ${includeOptionalEquipment ? "text-emerald-600" : "text-orange-500"}`}>
                          {includeOptionalEquipment ? "รวมในยอดรวม" : "ไม่รวมในยอดรวม"}
                        </span>
                        <span className={`text-sm font-bold ${includeOptionalEquipment ? "text-emerald-700" : "text-orange-500 line-through"}`}>
                          {formatCurrency(calculations.optionalSubtotal)}
                        </span>
                      </div>
                    </div>
                    <div className="border-b border-dashed border-gray-200"></div>
                  </>
                )}

                {calculations.lineItemDiscount > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 italic">Line Items Discount:</span>
                      <span className="text-xs font-medium text-red-400">
                        -{formatCurrency(calculations.lineItemDiscount)}
                      </span>
                    </div>
                    <div className="border-b border-dashed border-gray-100"></div>
                  </>
                )}

                <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">ส่วนลดเพิ่ม</label>
                    <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                      <button 
                        onClick={() => setDiscountType("amount")}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${discountType === "amount" ? "bg-teal-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                      >
                        ฿
                      </button>
                      <button 
                        onClick={() => setDiscountType("percent")}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${discountType === "percent" ? "bg-teal-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                      >
                        %
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    {discountType === "amount" ? (
                      <>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-teal-600">฿</span>
                        <input
                          type="number"
                          value={summaryDiscountAmount || ""}
                          onChange={(e) => {
                            setSummaryDiscountAmount(Number(e.target.value) || 0);
                            setSummaryDiscountPercentage(0);
                          }}
                          placeholder="0.00"
                          className="w-full pl-7 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-bold text-gray-800"
                        />
                      </>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={summaryDiscountPercentage || ""}
                          onChange={(e) => {
                            setSummaryDiscountPercentage(Number(e.target.value) || 0);
                            setSummaryDiscountAmount(0);
                          }}
                          placeholder="0"
                          className="w-full pr-8 pl-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-bold text-gray-800"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-teal-600">%</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Discount:</span>
                  <span className="text-sm font-bold text-red-500">
                    -{formatCurrency(calculations.totalDiscount)}
                  </span>
                </div>
                <div className="border-b border-dashed border-gray-200"></div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Tax Base (After Discount):</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrency(calculations.taxBase)}
                  </span>
                </div>
                <div className="border-b border-dashed border-gray-200"></div>

                <div className={`p-3 -mx-1 rounded-lg border-2 transition-all ${globalVatEnabled ? "border-red-300 bg-red-50/50" : "border-transparent bg-gray-50/50"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${globalVatEnabled ? "text-red-600" : "text-gray-500"}`}>VAT {vatRate}%:</span>
                    <button
                      onClick={() => setGlobalVatEnabled(!globalVatEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${globalVatEnabled ? "bg-red-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${globalVatEnabled ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
                  {globalVatEnabled && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-red-200">
                      <span className="text-xs text-red-500 font-medium">Amount</span>
                      <span className="text-sm font-bold text-red-600">{formatCurrency(calculations.vat)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-bold text-gray-900">Grand Total:</span>
                  <span className="text-xl font-extrabold text-teal-700">
                    {formatCurrency(calculations.grandTotal)}
                  </span>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", zIndex: -50, pointerEvents: "none", overflow: "visible" }}>
        <QuotationDocument ref={pdfRef} previewData={getPreviewData()} />
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden" onClick={() => setIsPreviewOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[900px] h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 text-lg">ตัวอย่างเอกสารใบเสนอราคา (PDF Preview)</h3>
              <div className="flex items-center gap-3">
                {showDownloadBtn ? (
                  <button 
                    onClick={generatePDF} 
                    disabled={isGeneratingPdf}
                    className={`px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2 ${isGeneratingPdf ? "opacity-75 cursor-wait" : ""}`}
                  >
                    {isGeneratingPdf ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        กำลังสร้าง...
                      </>
                    ) : "Download PDF"}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSaveAndPDF("ฉบับร่าง")} 
                    disabled={isGeneratingPdf}
                    className={`px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2 ${isGeneratingPdf ? "opacity-75 cursor-wait" : ""}`}
                  >
                    {isGeneratingPdf ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        กำลังเซฟ...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Save as PDF
                      </>
                    )}
                  </button>
                )}
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 pb-12 pt-8 flex relative justify-center">
              <div className="origin-top scale-[0.40] min-[420px]:scale-[0.45] sm:scale-75 md:scale-95 transition-transform duration-300">
                <QuotationDocument previewData={getPreviewData()} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BoatSpecsPreview({ model }: { model: string }) {
  const { boatSpecifications, updateBoatSpecification, showToast } = useAppContext();
  const specs = boatSpecifications[model];
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedSpecs, setEditedSpecs] = React.useState<any>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Sync editedSpecs with global specs when model or specs change, but only if not editing
  React.useEffect(() => {
    if (specs) {
      setEditedSpecs({ ...specs });
    }
  }, [specs, model]);

  if (!model || !specs || !editedSpecs) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBoatSpecification(model, editedSpecs);
      showToast(`อัปเดตสเปคของรุ่น ${model} สำเร็จ`, "success");
      setIsEditing(false);
    } catch (err) {
      showToast("ไม่สามารถบันทึกข้อมูลสเปคได้", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedSpecs({ ...specs });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-teal-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
      <div className="px-5 py-3.5 border-b border-teal-50 bg-teal-50/30 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-teal-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Technical Specifications: {model}
        </h2>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-[10px] font-bold text-teal-600 bg-white px-3 py-1 rounded-lg border border-teal-100 uppercase tracking-wider hover:bg-teal-50 transition-colors"
            >
              Edit Specs
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCancel}
                className="text-[10px] font-bold text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-100 uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="text-[10px] font-bold text-white bg-teal-600 px-3 py-1 rounded-lg border border-teal-600 uppercase tracking-wider hover:bg-teal-700 transition-colors flex items-center gap-1"
              >
                {isSaving && <svg className="animate-spin h-2.5 w-2.5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                Save Specs
              </button>
            </div>
          )}
          <span className="text-[10px] font-bold text-teal-600 bg-white/50 px-2 py-0.5 rounded-full border border-teal-100/50 uppercase tracking-wider">Auto-Sync</span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <SpecEditItem label="LOA" field="loa" value={editedSpecs.loa} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
          <SpecEditItem label="Beam" field="beam" value={editedSpecs.beam} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
          <SpecEditItem label="Draft" field="draft" value={editedSpecs.draft} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
          <SpecEditItem label="Passenger" field="passenger" value={editedSpecs.passenger} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
          <SpecEditItem label="Fuel Tank" field="gasTank" value={editedSpecs.gasTank} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
          <SpecEditItem label="Water Tank" field="freshWaterCapacity" value={editedSpecs.freshWaterCapacity} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
          <SpecEditItem label="Height" field="height" value={editedSpecs.height} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
          <SpecEditItem label="Engine" field="recEngine" value={editedSpecs.recEngine} isEditing={isEditing} onChange={(f, v) => setEditedSpecs((prev: any) => ({ ...prev, [f]: v }))} />
        </div>
      </div>
    </div>
  );
}

function SpecEditItem({ label, field, value, isEditing, onChange }: { label: string, field: string, value: string, isEditing: boolean, onChange: (f: string, v: string) => void }) {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{label}</label>
        <input 
          type="text"
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="text-sm font-semibold text-gray-800 bg-teal-50/50 border border-teal-100 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-gray-700">{value || "-"}</span>
    </div>
  );
}
