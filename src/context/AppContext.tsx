"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setToken, clearToken } from "@/lib/api-client";

// ---------------------------------------------------------
// Interfaces (unchanged from original)
// ---------------------------------------------------------
export interface Quotation {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
  items: number;
  validUntil: string;
  
  // Full details
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerTaxId?: string;
  lineItems?: any[]; 
  notes?: string;
  terms?: string;
  globalVatEnabled?: boolean;
  boatModel?: string;
  summaryDiscountAmount?: number;
  summaryDiscountPercentage?: number;
  includeOptionalEquipment?: boolean;
  frequency?: string;
  createdBy?: string;
  memberName?: string;
  memberPhone?: string;
  customImages?: string[];
}

export interface BoatSpecification {
  loa: string;
  beam: string;
  draft: string;
  freshWaterCapacity: string;
  gasTank: string;
  height: string;
  recEngine: string;
  speedDesign: string;
  passenger: string;
  images?: string[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  totalQuotations: number;
  totalRevenue: number;
  lastActivity: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  price: number;
  isSelected: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  description: string;
  sku: string;
  inStock: boolean;
  boatModel?: string;
  standardEquipment?: EquipmentItem[];
  optionalEquipment?: EquipmentItem[];
}

export interface SettingsType {
  profile: any;
  companySettings: any;
  quotationSettings: any;
  notifications: any;
}

export type UserRole = "Admin" | "Manager" | "Editor" | "Viewer";

export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  role: UserRole;
  status: "Active" | "Inactive";
  lastActive: string;
  password?: string;
  email?: string;
  position?: string;
}

// ---------------------------------------------------------
// Context Definition
// ---------------------------------------------------------
interface AppContextProps {
  // State
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  boatModels: string[];
  setBoatModels: React.Dispatch<React.SetStateAction<string[]>>;
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  boatSpecifications: Record<string, BoatSpecification>;
  setBoatSpecifications: React.Dispatch<React.SetStateAction<Record<string, BoatSpecification>>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  
  // Helpers
  addQuotation: (q: Quotation) => void;
  updateQuotation: (q: Quotation) => void;
  deleteQuotation: (id: string) => void;
  
  // Products
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Customers
  addCustomer: (c: Omit<Customer, "id" | "totalQuotations" | "totalRevenue" | "lastActivity">) => Promise<void>;
  updateCustomer: (id: number, c: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  
  // Users
  addUser: (u: Omit<User, "id" | "lastActive">) => Promise<void>;
  updateUser: (id: string, u: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Settings
  updateSettings: (newSettings: Partial<SettingsType> & { categories?: string[], boatModels?: string[] }) => Promise<void>;
  
  // Boat Specs
  updateBoatSpecification: (model: string, spec: BoatSpecification, isNew?: boolean) => Promise<void>;

  logout: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetAllData: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  generateNextId: (type: "Q") => string;
  refreshData: () => Promise<void>;
  isReady: boolean;
}

const defaultSettings: SettingsType = {
  profile: { name: "", username: "", email: "", phone: "", company: "", position: "" },
  companySettings: { name: "COMPANY NAME CO., LTD.", taxId: "", address: "", phone: "", email: "", website: "", logo: "" },
  quotationSettings: { prefix: "Q", validDays: 30, defaultVat: true, vatRate: 7, currency: "THB", defaultNotes: "", defaultTerms: [] },
  notifications: { emailNewQuotation: true, emailApproved: true, emailRejected: true, emailExpiring: true, browserNotify: true },
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["เรือ", "ซ่อมเรือ", "เครื่องยนต์", "มาตรฐาน", "อุปกรณ์เสริม"]);
  const [boatModels, setBoatModels] = useState<string[]>(["R52", "R33"]);
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [boatSpecifications, setBoatSpecifications] = useState<Record<string, BoatSpecification>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // ----- Load all data from API -----
  const refreshData = useCallback(async () => {
    try {
      const [quotationsData, customersData, productsData, usersData, settingsData, boatSpecsData] = await Promise.all([
        api.quotations.list(),
        api.customers.list(),
        api.products.list(),
        api.users.list(),
        api.settings.get(),
        api.boatSpecs.list(),
      ]);

      setQuotations(quotationsData);
      setCustomers(customersData);
      setProducts(productsData);
      setUsers(usersData.map((u: any) => ({ ...u, lastActive: u.lastActive || u.last_active })));
      
      // Merge settings
      if (settingsData) {
        setSettings({
          profile: settingsData.profile || defaultSettings.profile,
          companySettings: settingsData.companySettings || defaultSettings.companySettings,
          quotationSettings: settingsData.quotationSettings || defaultSettings.quotationSettings,
          notifications: settingsData.notifications || defaultSettings.notifications,
        });
        if (settingsData.categories) setCategories(settingsData.categories);
        if (settingsData.boatModels) setBoatModels(settingsData.boatModels);
      }
      
      setBoatSpecifications(boatSpecsData);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  }, []);

  // ----- Initialize: Check token and load data -----
  useEffect(() => {
    const init = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("qm_token") : null;
      
      if (token) {
        try {
          const { user } = await api.auth.me();
          setCurrentUser({
            id: user.id,
            name: user.name,
            username: user.username,
            phone: user.phone || "",
            role: user.role as UserRole,
            status: user.status as "Active" | "Inactive",
            lastActive: user.last_active || user.lastActive || "",
            email: user.email || "",
            position: user.position || "",
          });
          await refreshData();
        } catch {
          // Token invalid, clear it
          clearToken();
          setCurrentUser(null);
        }
      }
      
      setIsReady(true);
    };

    init();
  }, [refreshData]);

  // ----- Login -----
  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await api.auth.login(username, password);
      setToken(result.token);
      
      const user = result.user;
      setCurrentUser({
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone || "",
        role: user.role as UserRole,
        status: user.status as "Active" | "Inactive",
        lastActive: user.lastActive || "",
        email: user.email || "",
        position: user.position || "",
      });
      
      await refreshData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "เข้าสู่ระบบไม่สำเร็จ" };
    }
  }, [refreshData]);

  // ----- Logout -----
  const logout = useCallback(() => {
    clearToken();
    setCurrentUser(null);
    setQuotations([]);
    setCustomers([]);
    setProducts([]);
    setUsers([]);
  }, []);

  // ----- Quotation CRUD -----
  const addQuotation = useCallback((q: Quotation) => {
    // Optimistic update
    setQuotations((prev) => [q, ...prev]);
    
    // Save to API
    api.quotations.create(q).catch((err) => {
      console.error("Failed to save quotation:", err);
      showToast("บันทึกใบเสนอราคาไม่สำเร็จ กรุณาลองใหม่", "error");
    });
  }, [showToast]);

  const updateQuotation = useCallback((updatedQ: Quotation) => {
    // Optimistic update
    setQuotations((prev) => prev.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
    
    // Save to API
    api.quotations.update(updatedQ.id, updatedQ).catch((err) => {
      console.error("Failed to update quotation:", err);
      showToast("อัปเดตใบเสนอราคาไม่สำเร็จ", "error");
    });
  }, [showToast]);

  const deleteQuotation = useCallback((id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    api.quotations.delete(id).catch(console.error);
  }, []);

  // ----- Product Actions -----
  const addProduct = useCallback(async (p: Omit<Product, "id">) => {
    try {
      const res = await api.products.create(p);
      const newProduct = { ...p, id: res.id, inStock: p.inStock ?? true };
      setProducts(prev => [newProduct as Product, ...prev]);
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast("เพิ่มสินค้าไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  const updateProduct = useCallback(async (id: number, p: Partial<Product>) => {
    try {
      await api.products.update(id, p);
      setProducts(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("อัปเดตข้อมูลสินค้าไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await api.products.delete(id);
      setProducts(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("ลบสินค้าไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  // ----- Customer Actions -----
  const addCustomer = useCallback(async (c: Omit<Customer, "id" | "totalQuotations" | "totalRevenue" | "lastActivity">) => {
    try {
      const res = await api.customers.create(c);
      const newCustomer = { 
        ...c, 
        id: res.id, 
        totalQuotations: 0, 
        totalRevenue: 0, 
        lastActivity: new Date().toLocaleDateString("th-TH") 
      };
      setCustomers(prev => [newCustomer as Customer, ...prev]);
    } catch (err) {
      console.error("Failed to add customer:", err);
      showToast("เพิ่มข้อมูลลูกค้าไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  const updateCustomer = useCallback(async (id: number, c: Partial<Customer>) => {
    try {
      await api.customers.update(id, c);
      setCustomers(prev => prev.map(item => item.id === id ? { ...item, ...c } : item));
    } catch (err) {
      console.error("Failed to update customer:", err);
      showToast("อัปเดตข้อมูลลูกค้าไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  const deleteCustomer = useCallback(async (id: number) => {
    try {
      await api.customers.delete(id);
      setCustomers(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete customer:", err);
      showToast("ลบข้อมูลลูกค้าไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  // ----- User Actions -----
  const addUser = useCallback(async (u: Omit<User, "id" | "lastActive">) => {
    try {
        // Handle password hashing or other transformations if needed
      const res = await api.users.create(u);
      const newUser: User = { 
        ...u, 
        id: res.id, 
        lastActive: "ไม่เคยเข้าใช้งาน",
        status: u.status || "Active"
      };
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      console.error("Failed to add user:", err);
      showToast("เพิ่มสมาชิกไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  const updateUser = useCallback(async (id: string, u: Partial<User>) => {
    try {
      await api.users.update(id, u);
      setUsers(prev => prev.map(item => item.id === id ? { ...item, ...u } as User : item));
      if (currentUser?.id === id) {
        setCurrentUser(prev => prev ? { ...prev, ...u } as User : null);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      showToast("อัปเดตข้อมูลสมาชิกไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast, currentUser]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await api.users.delete(id);
      setUsers(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      showToast("ลบสมาชิกไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  // ----- Settings Action -----
  const updateSettings = useCallback(async (newSettings: Partial<SettingsType> & { categories?: string[], boatModels?: string[] }) => {
    try {
      // Create the state to save by merging current values with updates
      const stateToSave = {
        profile: newSettings.profile || settings.profile,
        companySettings: newSettings.companySettings || settings.companySettings,
        quotationSettings: newSettings.quotationSettings || settings.quotationSettings,
        notifications: newSettings.notifications || settings.notifications,
        categories: newSettings.categories || categories,
        boatModels: newSettings.boatModels || boatModels,
      };

      await api.settings.update(stateToSave);
      
      // Update local state
      if (newSettings.profile) {
        setSettings(prev => ({ ...prev, profile: { ...prev.profile, ...newSettings.profile } }));
        // Also update currentUser if this is a profile update
        if (currentUser) {
          await updateUser(currentUser.id, newSettings.profile);
        }
      }
      
      if (newSettings.companySettings) setSettings(prev => ({ ...prev, companySettings: { ...prev.companySettings, ...newSettings.companySettings } }));
      if (newSettings.quotationSettings) setSettings(prev => ({ ...prev, quotationSettings: { ...prev.quotationSettings, ...newSettings.quotationSettings } }));
      if (newSettings.notifications) setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, ...newSettings.notifications } }));
      
      if (newSettings.categories) setCategories(newSettings.categories);
      if (newSettings.boatModels) setBoatModels(newSettings.boatModels);
    } catch (err) {
      console.error("Failed to update settings:", err);
      showToast("บันทึกการตั้งค่าไม่สำเร็จ", "error");
      throw err;
    }
  }, [settings, categories, boatModels, currentUser, updateUser, showToast]);

  // ----- Boat Specs Action -----
  const updateBoatSpecification = useCallback(async (model: string, spec: BoatSpecification & { newModel?: string }, isNew: boolean = false) => {
    try {
      if (isNew) {
        // New model
        await api.boatSpecs.create({ ...spec, model });
        setBoatSpecifications(prev => ({ ...prev, [model]: spec }));
      } else {
        // Existing model (update or rename)
        await api.boatSpecs.update(model, spec);
        
        // Handle local state update
        if (spec.newModel) {
          // Rename logic
          setBoatSpecifications(prev => {
            const { [model]: oldSpec, ...rest } = prev;
            return { ...rest, [spec.newModel!]: spec };
          });
        } else {
          setBoatSpecifications(prev => ({ ...prev, [model]: spec }));
        }
      }
    } catch (err) {
      console.error("Failed to update boat specs:", err);
      showToast("บันทึกข้อมูลเรือไม่สำเร็จ", "error");
      throw err;
    }
  }, [showToast]);

  // ----- Reset All Data -----
  const resetAllData = useCallback(() => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมด? ข้อมูลที่บันทึกไว้จะหายไป (ไม่สามารถกู้คืนได้)")) {
      clearToken();
      window.location.reload();
    }
  }, []);

  // ----- Generate Next ID -----
  const generateNextId = useCallback((type: "Q") => {
    const prefix = settings?.quotationSettings?.prefix || "Q";
    const today = new Date();
    const yyyy = String(today.getFullYear());
    const yy = yyyy.slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    
    // If prefix already seems to contain a full year or month pattern,
    // we might want to skip adding our own date string.
    // However, to keep it consistent, we'll check if the prefix already includes the current year.
    const hasYear = prefix.includes(yyyy) || prefix.includes(yy);
    
    let dateStr = "";
    if (!hasYear) {
      dateStr = `${yy}${mm}`;
    }
    
    // Pattern to find the last index. 
    // We try to match the prefix followed by the dateStr, then a dash or just the sequence.
    const pattern = new RegExp(`^${prefix}${dateStr}-?(\\d{4})$`);
    let maxIndex = 0;
    
    quotations.forEach(q => {
      const match = q.id.match(pattern);
      if (match) {
        const index = parseInt(match[1], 10);
        if (index > maxIndex) maxIndex = index;
      }
    });
    
    const nextIndex = String(maxIndex + 1).padStart(4, '0');
    
    // Build the final ID. If prefix ends with a dash or numbers, be smart about separators.
    const separator = (prefix.endsWith("-") || dateStr === "") ? "" : "-";
    return `${prefix}${dateStr}${separator}${nextIndex}`;
  }, [settings, quotations]);

  // ----- Loading State -----
  if (!isReady) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f0f4f8]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">กำลังโหลดข้อมูลระบบ...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        quotations,
        setQuotations,
        customers,
        setCustomers,
        products,
        setProducts,
        categories,
        setCategories,
        boatModels,
        setBoatModels,
        settings,
        setSettings,
        boatSpecifications,
        setBoatSpecifications,
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addUser,
        updateUser,
        deleteUser,
        updateSettings,
        updateBoatSpecification,
        logout,
        login,
        generateNextId,
        resetAllData,
        showToast,
        refreshData,
        isReady,
      }}
    >
      {children}
      
      {/* Toast UI Overlay */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right duration-300 pointer-events-auto ${
              t.type === "success" 
                ? "bg-white border-emerald-100 text-emerald-800"
                : t.type === "error"
                ? "bg-white border-red-100 text-red-800"
                : "bg-white border-blue-100 text-blue-800"
            }`}
          >
            {t.type === "success" && (
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
            )}
            {t.type === "error" && (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">✕</div>
            )}
            <span className="text-sm font-semibold">{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
