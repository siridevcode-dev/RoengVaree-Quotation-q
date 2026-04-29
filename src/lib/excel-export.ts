import * as XLSX from "xlsx";

/**
 * Utility to export data to Excel
 * @param data Array of objects to export
 * @param fileName Name of the file (without extension)
 * @param sheetName Name of the sheet
 */
export const exportToExcel = (data: any[], fileName: string, sheetName: string = "Data") => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Export the file
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Specifically format and export Quotations
 */
export const exportQuotations = (quotations: any[]) => {
  const formatted = quotations.map(q => ({
    "เลขที่ใบเสนอราคา": q.id,
    "ลูกค้า": q.customer,
    "จำนวนเงิน": q.amount,
    "สถานะ": q.status,
    "วันที่": q.date,
    "รุ่นเรือ": q.boatModel || "-",
    "เบอร์โทรศัพท์": q.customerPhone || "-",
    "อีเมล": q.customerEmail || "-",
    "ที่อยู่": q.customerAddress || "-",
    "จำนวนรายการ": q.items || 0,
    "ยืนยันราคาถึง": q.validUntil || "-"
  }));
  
  exportToExcel(formatted, `Quotations_Export_${new Date().toLocaleDateString("th-TH")}`, "Quotations");
};

/**
 * Specifically format and export Products
 */
export const exportProducts = (products: any[]) => {
  const formatted = products.map(p => ({
    "SKU": p.sku,
    "ชื่อสินค้า/บริการ": p.name,
    "หมวดหมู่": p.category,
    "รุ่นเรือ": p.boatModel || "ทุกรุ่น",
    "ราคาทุน": p.unitPrice,
    "ราคาขาย": p.sellingPrice || 0,
    "หน่วย": p.unit,
    "รายละเอียด": p.description || ""
  }));
  
  exportToExcel(formatted, `Products_Export_${new Date().toLocaleDateString("th-TH")}`, "Products");
};

/**
 * Specifically format and export Production Costs
 */
export const exportProductionCosts = (costs: any[]) => {
  const formatted = costs.map(c => ({
    "เลขที่โครงการ": c.quotationId || "Master",
    "SKU": c.sku,
    "รายการ": c.name,
    "หมวดหมู่": c.category,
    "รุ่นเรือ": c.boatModel || "ทุกรุ่น",
    "ราคาทุน": c.unitPrice,
    "ราคาขาย (ถ้ามี)": c.sellingPrice || 0,
    "หน่วย": c.unit,
    "รายละเอียด": c.description || ""
  }));
  
  exportToExcel(formatted, `ProductionCosts_Export_${new Date().toLocaleDateString("th-TH")}`, "ProductionCosts");
};

/**
 * Specifically format and export Purchase Orders
 */
export const exportPurchaseOrders = (orders: any[]) => {
  const formatted = orders.map(po => ({
    "เลขที่เอกสาร": po.id,
    "ประเภท": po.type,
    "หัวข้อ": po.title,
    "ผู้จัดจำหน่าย": po.supplierName,
    "ยอดรวม": po.totalAmount,
    "สถานะ": po.status,
    "วันที่": po.date,
    "อ้างอิงใบเสนอราคา": po.quotationId || "-",
    "ผู้ขอซื้อ": po.requestedBy || "-"
  }));
  
  exportToExcel(formatted, `PurchaseOrders_Export_${new Date().toLocaleDateString("th-TH")}`, "PurchaseOrders");
};

/**
 * Specifically format and export Customers
 */
export const exportCustomers = (customers: any[]) => {
  const formatted = customers.map(c => ({
    "ชื่อบริษัท/ลูกค้า": c.name,
    "อีเมล": c.email || "-",
    "เบอร์โทร": c.phone || "-",
    "ที่อยู่": c.address || "-",
    "เลขผู้เสียภาษี": c.taxId || "-",
    "จำนวนใบเสนอราคา": c.totalQuotations || 0,
    "ยอดรวมรายได้": c.totalRevenue || 0,
    "กิจกรรมล่าสุด": c.lastActivity || "-"
  }));
  
  exportToExcel(formatted, `Customers_Export_${new Date().toLocaleDateString("th-TH")}`, "Customers");
};
