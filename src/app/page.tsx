"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import QuotationList from "@/components/QuotationList";
import CustomerList from "@/components/CustomerList";
import QuotationForm from "@/components/QuotationForm";
import ProductList from "@/components/ProductList";
import Reports from "@/components/Reports";
import RepeatQueries from "@/components/RepeatQueries";
import Settings from "@/components/Settings";
import MemberManagement from "@/components/MemberManagement";
import ProductSelector from "@/components/ProductSelector";
import QuotationView from "@/components/QuotationView";
import ProductionCosts from "@/components/ProductionCosts";
import PurchaseOrders from "@/components/PurchaseOrders";
import ActivityLogView from "@/components/ActivityLogView";
import ActivityDrawer from "@/components/ActivityDrawer";
import AccountingPlaceholder from "@/components/AccountingPlaceholder";
import AccountingDashboard from "@/components/AccountingDashboard";
import RevenueOverview from "@/components/RevenueOverview";
import ExpenseOverview from "@/components/ExpenseOverview";
import ContactManagement from "@/components/ContactManagement";
import ProductManagement from "@/components/ProductManagement";
import FinanceManagement from "@/components/FinanceManagement";
import ChartOfAccounts from "@/components/ChartOfAccounts";
import DocumentArchive from "@/components/DocumentArchive";
import AccountingSettings from "@/components/AccountingSettings";
import { Product } from "@/context/AppContext";

import { useAppContext } from "@/context/AppContext";
import Login from "@/components/Login";

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
        return <Dashboard />;
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
        return <Settings />;
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
      <ActivityDrawer />
    </div>
  );
}
