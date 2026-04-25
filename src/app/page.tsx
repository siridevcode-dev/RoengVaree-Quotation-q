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
import { Product } from "@/context/AppContext";

import { useAppContext } from "@/context/AppContext";
import Login from "@/components/Login";

export default function Home() {
  const { currentUser, isReady } = useAppContext();
  const [activePage, setActivePage] = useState("Quotations");
  const [activeQuotationId, setActiveQuotationId] = useState<string | undefined>(undefined);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNavigate = (page: string, quotationId?: string, items?: Product[], customImages?: string[]) => {
    setActiveQuotationId(quotationId);
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
        return <Dashboard />;
      case "Quotations":
        return <QuotationList onNavigate={handleNavigate} />;
      case "Customers":
        return <CustomerList />;
      case "Quotation View":
        return activeQuotationId ? (
          <QuotationView 
            quotationId={activeQuotationId} 
            onNavigate={handleNavigate} 
          />
        ) : <QuotationList onNavigate={handleNavigate} />;
      case "Quotation Form":
        return <QuotationForm onNavigate={handleNavigate} quotationId={activeQuotationId} initialItems={selectedProducts} initialImages={initialImages} />;
      case "Select Products":
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
        return <ProductionCosts />;
      case "Reports":
        return <Reports />;
      case "Quotation Templates":
        return <RepeatQueries onNavigate={handleNavigate} />;
      case "Settings":
        return <Settings />;
      case "Members":
        return <MemberManagement />;
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
    </div>
  );
}
