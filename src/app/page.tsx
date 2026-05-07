"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Dashboard from "@/components/layout/Dashboard";
import QuotationList from "@/components/sales/QuotationList";
import CustomerList from "@/components/sales/CustomerList";
import QuotationForm from "@/components/sales/QuotationForm";
import ProductList from "@/components/sales/ProductList";
import Reports from "@/components/shared/Reports";
import RepeatQueries from "@/components/shared/RepeatQueries";
import Settings from "@/components/system/Settings";
import MemberManagement from "@/components/system/MemberManagement";
import ProductSelector from "@/components/sales/ProductSelector";
import QuotationView from "@/components/sales/QuotationView";
import ProductionCosts from "@/components/sales/ProductionCosts";
import PurchaseOrders from "@/components/accounting/PurchaseOrders";
import ActivityLogView from "@/components/system/ActivityLogView";
import ActivityDrawer from "@/components/system/ActivityDrawer";
import AccountingPlaceholder from "@/components/accounting/AccountingPlaceholder";
import AccountingDashboard from "@/components/accounting/AccountingDashboard";
import RevenueOverview from "@/components/accounting/RevenueOverview";
import ExpenseOverview from "@/components/accounting/ExpenseOverview";
import ContactManagement from "@/components/system/ContactManagement";
import ProductManagement from "@/components/sales/ProductManagement";
import FinanceManagement from "@/components/accounting/FinanceManagement";
import ChartOfAccounts from "@/components/accounting/ChartOfAccounts";
import DocumentArchive from "@/components/system/DocumentArchive";
import AccountingSettings from "@/components/accounting/AccountingSettings";
import SalesSettings from "@/components/sales/SalesSettings";
import HRManagement from "@/components/hr/HRManagement";
import HRDashboard from "@/components/hr/HRDashboard";
import HRAttendance from "@/components/hr/HRAttendance";
import HRApproval from "@/components/hr/HRApproval";
import HRExpenses from "@/components/hr/HRExpenses";
import HRMyRequests from "@/components/hr/HRMyRequests";
import HRProfile from "@/components/hr/HRProfile";
import { Product } from "@/context/AppContext";

import { useAppContext } from "@/context/AppContext";
import Login from "@/components/layout/Login";

export default function Home() {
  const { currentUser, isReady } = useAppContext();
  const [activePage, setActivePage] = useState("Dashboard");
  const [activeQuotationId, setActiveQuotationId] = useState<string | undefined>(undefined);
  const [activePurchaseType, setActivePurchaseType] = useState<"PO" | "PR" | undefined>(undefined);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNavigate = (page: string, quotationId?: string, items?: Product[], customImages?: string[], purchaseType?: "PO" | "PR") => {
    setActiveQuotationId(quotationId);
    setActivePurchaseType(purchaseType);
    if (page !== "Quotation Form" && page !== "Quotation View") {
      setSelectedProducts([]);
      setInitialImages([]);
    } else if (items && items.length > 0) {
      setSelectedProducts(items);
      setInitialImages(customImages || []);
    }
    setActivePage(page);
  };

  // ฟังก์ชันสลับการแสดงผลตาม activePage
  const renderActivePage = () => {
    switch (activePage) {
      case "Dashboard":
      case "แดชบอร์ด":
      case "แดชบอร์ดฝ่ายขาย":
        return <HRDashboard />;
      case "Quotations":
      case "รายการใบเสนอราคา":
        return <QuotationList onNavigate={handleNavigate} />;
      case "Customers":
      case "ลูกค้า":
        return <CustomerList />;
      case "Quotation View":
        return activeQuotationId !== undefined ? (
          <QuotationView 
            quotationId={activeQuotationId} 
            onNavigate={handleNavigate} 
          />
        ) : <QuotationList onNavigate={handleNavigate} />;
      case "Quotation Form":
        return <QuotationForm onNavigate={handleNavigate} quotationId={activeQuotationId} initialItems={selectedProducts} initialImages={initialImages} />;
      case "Select Products":
      case "สร้างใบเสนอราคา":
        return (
          <ProductSelector 
            onConfirm={(products) => {
              setSelectedProducts(products);
              handleNavigate("Quotation Form");
            }}
            onCancel={() => handleNavigate("Dashboard")}
          />
        );
      case "Products":
        return <ProductList />;
      case "Production costs":
      case "ต้นทุนการผลิต":
        return <ProductionCosts onNavigate={handleNavigate} />;
      case "Production Cost Detail":
        return activeQuotationId !== undefined ? (
          <ProductionCosts 
            onNavigate={handleNavigate} 
            initialQuotationId={activeQuotationId} 
          />
        ) : <ProductionCosts onNavigate={handleNavigate} />;
      case "แผนการผลิต":
      case "บันทึกการผลิต":
      case "รายงานการผลิต":
        return <ProductionCosts onNavigate={handleNavigate} />;
      case "Purchase Requisition (PR)":
        return <PurchaseOrders onNavigate={handleNavigate} initialQuotationId={activeQuotationId} initialType="PR" />;
      case "Purchase Order (PO)":
        return <PurchaseOrders onNavigate={handleNavigate} initialQuotationId={activeQuotationId} initialType="PO" />;
      case "Reports":
      case "รายงาน":
        return <Reports />;
      case "รายงาน ผู้ติดต่อ":
        return <ContactManagement />;
      case "Quotation Templates":
      case "รูปแบบใบเสนอราคา":
      case "รูปแบบใบเสนอราคา รูปแบบเก่า":
        return <RepeatQueries onNavigate={handleNavigate} />;
      case "Settings (System)":
        return <Settings />;
      case "ประวัติการใช้งาน":
      case "ประวัติใช้งาน":
        return <ActivityLogView />;
      case "Members":
      case "สมาชิก":
        return <MemberManagement />;
      case "หน้าหลัก (บัญชี)":
        return <AccountingDashboard />;
      case "Revenue Overview":
        return <RevenueOverview />;
      case "Expense Overview":
        return <ExpenseOverview />;
      case "ใบเสนอราคา":
        return <QuotationList onNavigate={handleNavigate} />;
      case "ใบสั่งซื้อ":
        return <PurchaseOrders onNavigate={handleNavigate} initialType="PO" />;
      case "ใบขอซื้อ":
        return <PurchaseOrders onNavigate={handleNavigate} initialType="PR" />;
      case "แดชบอร์ดฝ่ายบุคคล":
        return <HRDashboard />;
      case "อนุมัติ":
        return <HRApproval />;
      case "ค่าใช้จ่าย & เบิกเงิน":
        return <HRExpenses />;
      case "พนักงาน":
      case "เงินเดือน":
      case "มอบหมายงาน":
      case "รายงานฝ่ายบุคคล":
      case "ประกาศ":
      case "กิจกรรม":
      case "ขอเข้าร่วมบริษัท":
        return <HRManagement activeTab={activePage} />;
      case "เข้างาน":
        return <HRAttendance />;
      case "คำขอ":
        return <HRMyRequests />;
      case "โปรไฟล์":
        return <HRProfile />;
      case "งานของฉัน":
      case "รายชื่อพนักงาน":
      case "โครงสร้างองค์กร":
      case "สัญญาจ้าง":
      case "สรุปเงินเดือน":
      case "รายการจ่ายเงิน":
      case "ประกันสังคม/ภาษี":
      case "บันทึกเวลาเข้างาน":
      case "จัดการวันลา":
      case "ตารางเวร/กะ":
      case "จัดการพนักงาน":
      case "บันทึกเวลา":
      case "ตั้งค่าฝ่ายบุคคล":
        return <HRManagement activeTab={activePage} />;

      case "รายรับ":
      case "รายจ่าย":
      case "ดูภาพรวม":
      case "บันทึกซื้อสินค้า":
      case "บันทึกค่าใช้จ่าย":
      case "ใบสั่งซื้อสินทรัพย์":
      case "ซื้อสินทรัพย์":
      case "ใบกำกับภาษีซื้อ":
      case "ใบจ่ายเงินมัดจำ":
      case "รับใบลดหนี้":
      case "รับใบเพิ่มหนี้":
      case "ใบรวมจ่าย":
      case "นำเข้าเอกสาร":
        return <AccountingPlaceholder title={activePage} />;
      case "ผู้ติดต่อ":
        return <ContactManagement />;
      case "สินค้า":
      case "สินค้า & บริการ":
      case "รายการสินค้า":
        return <ProductList />;
      case "จัดการสินค้า":
        return <ProductManagement />;
      case "การเงิน":
        return <FinanceManagement />;
      case "บัญชี":
      case "Chart of Accounts":
        return <ChartOfAccounts />;
      case "คลังเอกสาร":
        return <DocumentArchive />;
      case "ตั้งค่า":
      case "ตั้งค่าโปรไฟล์":
        return <Settings />;
      case "ตั้งค่าการขาย":
        return <SalesSettings />;
      case "ตั้งค่า (บัญชี)":
        return <AccountingSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isReady) return null;

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-[#f0f4f8] animate-in fade-in duration-700">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={(p) => handleNavigate(p)} 
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header 
          activePage={activePage} 
          onNavigate={handleNavigate}
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* Content */}
        {renderActivePage()}
      </div>

      {/* Activity Drawer */}
      {!["แดชบอร์ดฝ่ายบุคคล", "พนักงาน", "อนุมัติ", "ค่าใช้จ่าย & เบิกเงิน", "เงินเดือน", "มอบหมายงาน", "รายงาน", "รายงานฝ่ายบุคคล", "ตั้งค่าฝ่ายบุคคล", "ประกาศ", "กิจกรรม", "รายชื่อพนักงาน", "โครงสร้างองค์กร", "สัญญาจ้าง", "สรุปเงินเดือน", "รายการจ่ายเงิน", "ประกันสังคม/ภาษี", "บันทึกเวลาเข้างาน", "จัดการวันลา", "ตารางเวร/กะ", "จัดการพนักงาน", "บันทึกเวลา", "เข้างาน", "คำขอ", "งานของฉัน", "โปรไฟล์"].includes(activePage) && (
        <ActivityDrawer />
      )}
    </div>
  );
}
