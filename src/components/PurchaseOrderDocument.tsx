"use client";

import React, { forwardRef } from "react";
import { useAppContext, PurchaseOrder } from "@/context/AppContext";

interface PurchaseOrderDocumentProps {
  purchaseOrder: PurchaseOrder;
}

const PurchaseOrderDocument = forwardRef<HTMLDivElement, PurchaseOrderDocumentProps>(
  ({ purchaseOrder }, ref) => {
    const { settings } = useAppContext();
    const company = settings?.companySettings || {};

    const formatCurrency = (val: number) =>
      val.toLocaleString("th-TH", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: 2,
      });

    const isPO = purchaseOrder.type === "PO";
    const docTypeLabel = isPO ? "ใบสั่งซื้อ" : "ใบขอซื้อ";
    const docTypeEn = isPO ? "PURCHASE ORDER" : "PURCHASE REQUISITION";
    const docAccentText = isPO ? "text-[#283583]" : "text-[#7a73e6]";
    
    const lineItems = purchaseOrder.lineItems || [];
    const totalAmount = purchaseOrder.totalAmount || 0;

    return (
      <div
        ref={ref}
        id="po-document"
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
            #po-document {
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.035]">
          <img src="/logo.png" alt="" className="w-[120mm] h-[120mm] object-contain grayscale brightness-50" />
        </div>

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
              <h2 className={`text-[38px] font-medium ${docAccentText} leading-none tracking-tight`}>
                {docTypeLabel}
              </h2>
              <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{docTypeEn}</p>
            </div>
          </div>

          {/* Requester (Company) and Document Info */}
          <div className="flex justify-between mb-4 border-b pb-4 border-gray-300 gap-6 items-start">
            {/* Left: Requester Info (Grid Layout) */}
            <div className="flex-1 grid grid-cols-[85px_15px_1fr_150px] gap-y-2 text-[13px] text-[#1e293b] pr-2">
              {/* Row 1 */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">{isPO ? "ผู้สั่งซื้อ" : "ผู้ขอซื้อ"}</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="font-bold min-w-0 break-words">{company.name || "COMPANY NAME CO., LTD."}</div>
              <div className="flex items-center gap-2 min-w-0"><svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg> <span className="truncate">{company.phone || "02-XXX-XXXX"}</span></div>

              {/* Row 2 */}
              <div className="text-gray-500 font-bold whitespace-nowrap text-right">ที่อยู่</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="leading-snug whitespace-pre-wrap min-w-0 break-words [word-break:normal] text-[12px]">{company.address || "123 Business Road, City 10100"}</div>
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

            {/* Right: Document Info Box */}
            <div className="w-fit min-w-[200px] bg-[#f0f1ff] rounded-md p-3 text-[12.5px] shrink-0 self-start">
              <div className="grid grid-cols-[95px_1fr] gap-y-1">
                <div className="text-gray-600">เลขที่เอกสาร :</div>
                <div className="font-semibold text-[#1e293b]">{purchaseOrder.id}</div>

                <div className="text-gray-600">วันที่ออก :</div>
                <div className="font-semibold text-[#1e293b]">{purchaseOrder.date}</div>

                {purchaseOrder.deliveryDate && (
                  <>
                    <div className="text-gray-600">วันที่ส่งของ :</div>
                    <div className="font-semibold text-[#1e293b]">{purchaseOrder.deliveryDate}</div>
                  </>
                )}

                <div className="text-gray-600">ความสำคัญ :</div>
                <div className="font-semibold text-[#1e293b]">{purchaseOrder.priority || "ปกติ"}</div>

                <div className="text-gray-600">อ้างอิง :</div>
                <div className="font-semibold text-[#1e293b]">{purchaseOrder.quotationId || "-"}</div>
              </div>
            </div>
          </div>

          {/* Supplier and Contact Info */}
          <div className="flex justify-between mb-8 gap-6 items-start">
            {/* Left: Supplier Info (Grid Layout) */}
            <div className="flex-1 grid grid-cols-[85px_15px_1fr_150px] gap-y-2 text-[13px] text-[#1e293b] pr-2">
              <div className="font-bold text-gray-500 whitespace-nowrap text-right">หัวข้อ</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="col-span-2 min-w-0 break-words font-bold">{purchaseOrder.title || "-"}</div>

              <div className="text-gray-500 font-bold whitespace-nowrap text-right">ผู้ขาย</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="font-bold min-w-0 break-words">{purchaseOrder.supplierName || "-"}</div>
              <div className="flex items-center gap-2 min-w-0"><svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg> <span className="truncate">{purchaseOrder.supplierPhone || "-"}</span></div>

              <div className="text-gray-500 font-bold whitespace-nowrap text-right">ที่อยู่</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="leading-snug whitespace-pre-wrap min-w-0 break-words [word-break:normal] text-[12px]">{purchaseOrder.supplierAddress || "-"}</div>
              <div className="flex items-start gap-2 pt-0.5 min-w-0"><svg className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg> <span className="break-words [word-break:normal] text-[12px]">{purchaseOrder.supplierEmail || "-"}</span></div>

              <div className="text-gray-500 font-bold whitespace-nowrap text-right">เลขที่ภาษี</div>
              <div className="text-gray-500 font-bold text-center">:</div>
              <div className="min-w-0 break-words">
                {purchaseOrder.supplierTaxId || "-"}
              </div>

            </div>

            {/* Right: Internal Contact (Requestor) */}
            <div className="w-[230px] shrink-0 text-[12.5px] self-start">
              <div className="grid grid-cols-1 gap-y-2">
                <div className="font-bold text-[#1e293b] h-[19.5px] flex items-center">ผู้ขอซื้อ / ผู้ติดต่อ :</div>
                
                <div className="flex items-center gap-3 text-[#1e293b] h-[19.5px]">
                  <svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  <span className="truncate">{purchaseOrder.requestedBy || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-[#1e293b] h-[19.5px]">
                  <svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                  <span className="truncate">{settings?.profile?.phone || company.phone || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-[#1e293b] h-[19.5px]">
                  <svg className="w-4 h-4 text-gray-700 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  <span className="truncate text-[12px]">{settings?.profile?.email || company.email || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#283583] text-white">
                  <th className="py-1 px-4 text-center w-12 font-black text-[12px]">#</th>
                  <th className="py-1 px-4 text-left font-black text-[12px]">รายการ (Description)</th>
                  <th className="py-1 px-4 text-center w-24 font-black text-[12px]">จำนวน (Qty)</th>
                  <th className="py-1 px-4 text-center w-24 font-black text-[12px]">หน่วย (Unit)</th>
                  {isPO && (
                    <>
                      <th className="py-1 px-4 text-right w-32 font-black text-[12px]">ราคา/หน่วย (Unit)</th>
                      <th className="py-1 px-4 text-right w-36 font-black text-[12px]">จำนวนเงิน (Amount)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="border-b-2 border-[#283583]">
                {lineItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#f1f5f9] group">
                    <td className="py-1 px-4 text-center font-bold text-[#475569]">{idx + 1}</td>
                    <td className="py-1 px-4 text-left">
                      <p className="font-black text-[13px] text-[#0f172a]">{item.name}</p>
                      {item.description && <p className="text-[11px] font-bold text-[#475569]">{item.description}</p>}
                    </td>
                    <td className="py-1 px-4 text-center font-bold text-[#1e293b]">{item.quantity}</td>
                    <td className="py-1 px-4 text-center font-bold text-[#1e293b]">{item.unit || "-"}</td>
                    {isPO && (
                      <>
                        <td className="py-1 px-4 text-right font-bold text-[#1e293b]">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-1 px-4 text-right font-black text-[14px] text-[#0f172a]">
                          {formatCurrency(item.totalPrice || item.quantity * item.unitPrice)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {/* Minimal padding empty rows if items are very few so table has substance */}
                {lineItems.length < 3 && Array.from({ length: 3 - lineItems.length }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-10">
                    <td></td><td></td><td></td><td></td>{isPO && <><td></td><td></td></>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="flex justify-between items-start mb-6 page-break-avoid break-inside-avoid">
            <div className="flex-1 pr-16 space-y-6">
              {/* Payment Terms & Notes */}
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest pb-1.5 mb-2 border-b-[1.5px] border-[#283583] text-[#334155]">เงื่อนไขและหมายเหตุ (Terms & Notes)</h3>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
                  {purchaseOrder.paymentTerms && (
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase mb-1">เงื่อนไขการชำระเงิน:</p>
                      <p className="text-[12px] font-bold leading-relaxed whitespace-pre-wrap text-[#1e293b]">{purchaseOrder.paymentTerms}</p>
                    </div>
                  )}
                  {purchaseOrder.notes && (
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase mb-1">หมายเหตุเพิ่มเติม:</p>
                      <p className="text-[12px] font-bold leading-relaxed whitespace-pre-wrap text-[#1e293b]">{purchaseOrder.notes}</p>
                    </div>
                  )}
                  {!purchaseOrder.paymentTerms && !purchaseOrder.notes && (
                    <p className="text-[11px] italic font-bold text-gray-400">ไม่ได้ระบุเงื่อนไขหรือหมายเหตุ</p>
                  )}
                </div>
              </div>
            </div>

            {isPO && (
              <div className="w-[320px] p-5 rounded-xl border bg-[#f9fafb]/80 border-[#f1f5f9]/60">
                <table className="w-full text-[13px]">
                  <tbody>
                    <tr>
                      <td className="py-0.5 font-bold text-[#334155]">รวมเป็นเงิน (Subtotal):</td>
                      <td className="py-0.5 font-black text-right text-[#0f172a]">{formatCurrency(totalAmount)}</td>
                    </tr>
                    <tr>
                      <td className="pt-2 pb-1 font-black text-[14px] text-[#283583]">จำนวนเงินรวมทั้งสิ้น (Grand Total):</td>
                      <td className="pt-2 pb-1 font-black text-right text-[20px] text-[#283583] border-b-[3px] border-double border-[#283583]">{formatCurrency(totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="mt-auto print:mt-10 pt-4 pb-10 break-inside-avoid-page page-break-avoid break-inside-avoid">
            <div className="flex justify-between px-8 text-center">
              <div className="w-[220px]">
                <div className="mb-3 h-20 w-full flex items-end justify-center border-b-2 border-[#283583]"></div>
                <p className="font-bold mt-3 text-[#1e293b]">( _________________________ )</p>
                <p className="mt-1 flex flex-col gap-0.5 text-[#475569]">
                  <span>{isPO ? "ผู้อนุมัติสั่งซื้อ" : "ผู้อนุมัติ"}</span>
                  <span className="text-[11px] font-black text-[#64748b]">Authorized Signature</span>
                </p>
                <p className="mt-2 text-xs text-[#94a3b8]">วันที่ (Date): ____/____/_____</p>
              </div>

              <div className="w-[220px]">
                <div className="mb-3 h-20 w-full flex items-end justify-center border-b-2 border-[#283583]"></div>
                <p className="font-bold mt-3 text-[#1e293b]">{purchaseOrder.requestedBy || "( _________________________ )"}</p>
                <p className="mt-1 flex flex-col gap-0.5 text-[#475569]">
                  <span>{isPO ? "ผู้จัดทำ" : "ผู้ขอซื้อ"}</span>
                  <span className="text-[11px] font-black text-[#64748b]">{isPO ? "Prepared by" : "Requested by"}</span>
                </p>
                <p className="mt-2 text-xs text-[#94a3b8]">วันที่ (Date): {purchaseOrder.date}</p>
              </div>

              {isPO && (
                <div className="w-[220px]">
                  <div className="mb-3 h-20 w-full flex items-end justify-center border-b-2 border-[#283583]"></div>
                  <p className="font-bold mt-3 text-[#1e293b]">( _________________________ )</p>
                  <p className="mt-1 flex flex-col gap-0.5 text-[#475569]">
                    <span>ผู้จัดจำหน่าย</span>
                    <span className="text-[11px] font-black text-[#64748b]">Supplier Signature</span>
                  </p>
                  <p className="mt-2 text-xs text-[#94a3b8]">วันที่ (Date): ____/____/_____</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PurchaseOrderDocument.displayName = "PurchaseOrderDocument";
export default PurchaseOrderDocument;
