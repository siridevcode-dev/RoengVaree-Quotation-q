"use client";

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { api } from "@/lib/api-client";

interface ActivityLog {
  id: number;
  userId: string;
  userName: string;
  action: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}

export default function ActivityDrawer() {
  const { isActivityDrawerOpen, setActivityDrawerOpen } = useAppContext();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActivityDrawerOpen) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 30000); // Auto refresh every 30s
      return () => clearInterval(interval);
    }
  }, [isActivityDrawerOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivityDrawerOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setActivityDrawerOpen]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.activityLogs.list(undefined, 30);
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    const map: Record<string, string> = {
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ",
      create_quotation: "สร้างใบเสนอราคา",
      update_quotation: "แก้ไขใบเสนอราคา",
      delete_quotation: "ลบใบเสนอราคา",
      create_customer: "เพิ่มลูกค้า",
      update_customer: "แก้ไขลูกค้า",
      delete_customer: "ลบลูกค้า",
      create_product: "เพิ่มสินค้า",
      update_product: "แก้ไขสินค้า",
      delete_product: "ลบสินค้า",
      create_po: "สร้าง PR/PO",
      update_po: "แก้ไข PR/PO",
      delete_po: "ลบ PR/PO",
      create_user: "เพิ่มสมาชิก",
      update_user: "แก้ไขสมาชิก",
      delete_user: "ลบสมาชิก",
      update_settings: "ตั้งค่าระบบ",
    };
    return map[action] || action;
  };

  const getActionColor = (action: string) => {
    if (action.startsWith("create")) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (action.startsWith("update")) return "text-amber-600 bg-amber-50 border-amber-100";
    if (action.startsWith("delete")) return "text-red-600 bg-red-50 border-red-100";
    if (action === "login") return "text-indigo-600 bg-indigo-50 border-indigo-100";
    return "text-slate-600 bg-slate-50 border-slate-100";
  };

  if (!isActivityDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] pointer-events-auto animate-in fade-in duration-300"
        onClick={() => setActivityDrawerOpen(false)}
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="absolute inset-y-0 right-0 w-full max-w-[400px] bg-white shadow-2xl pointer-events-auto animate-in slide-in-from-right duration-500 ease-out border-l border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 h-[68px] flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[15px] font-black text-slate-800 tracking-tight">ประวัติการใช้งาน</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Recent Activity</p>
            </div>
          </div>
          <button 
            onClick={() => setActivityDrawerOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="ปิด"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {loading && logs.length === 0 ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-slate-800 font-bold">ไม่พบประวัติการใช้งาน</h3>
              <p className="text-slate-400 text-sm mt-1">ยังไม่มีข้อมูลกิจกรรมที่บันทึกไว้ในระบบขณะนี้</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100" />
              
              <div className="space-y-8">
                {logs.map((log) => (
                  <div key={log.id} className="relative flex gap-4 group">
                    {/* Icon/Avatar */}
                    <div className="relative z-10 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 font-bold text-xs ring-4 ring-white">
                        {log.userName?.charAt(0) || '?'}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-800">{log.userName}</span>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                          {formatRelativeTime(log.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getActionColor(log.action)}`}>
                          {getActionLabel(log.action)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center shrink-0">
          <button 
            onClick={() => {
              setActivityDrawerOpen(false);
              // We need a way to navigate to the full page.
              // For now, we'll just close and let the user use the sidebar link.
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest py-2 px-4"
          >
            ดูทั้งหมดในหน้าประวัติ
          </button>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSec < 60) return "เมื่อครู่";
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)} นาทีที่แล้ว`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)} ชั่วโมงที่แล้ว`;
  
  return date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' });
}
