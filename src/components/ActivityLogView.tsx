"use client";

import { useState, useEffect } from "react";
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

export default function ActivityLogView() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    fetchLogs();
  }, [limit]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.activityLogs.list(undefined, limit);
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
      create_po: "สร้าง PR/PO",
      delete_quotation: "ลบใบเสนอราคา",
      other: "อื่นๆ",
    };
    return map[action] || action;
  };

  const getActionColor = (action: string) => {
    const map: Record<string, string> = {
      login: "bg-emerald-100 text-emerald-700 border-emerald-200",
      logout: "bg-orange-100 text-orange-700 border-orange-200",
      create_quotation: "bg-blue-100 text-blue-700 border-blue-200",
      update_quotation: "bg-amber-100 text-amber-700 border-amber-200",
      delete_quotation: "bg-red-100 text-red-700 border-red-200",
      create_customer: "bg-purple-100 text-purple-700 border-purple-200",
      create_product: "bg-teal-100 text-teal-700 border-teal-200",
      create_po: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return map[action] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">ประวัติการใช้งานระบบ</h1>
            <p className="text-slate-500 text-sm mt-1">ตรวจสอบกิจกรรมการใช้งานทั้งหมดของสมาชิกในระบบ</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={limit} 
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-label="จำนวนรายการที่จะแสดง"
            >
              <option value={50}>50 รายการล่าสุด</option>
              <option value={100}>100 รายการล่าสุด</option>
              <option value={200}>200 รายการล่าสุด</option>
              <option value={500}>500 รายการล่าสุด</option>
            </select>
            <button 
              onClick={fetchLogs}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              title="รีเฟรชข้อมูล"
              aria-label="รีเฟรชข้อมูล"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">วัน-เวลา</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สมาชิก</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">กิจกรรม</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">รายละเอียด</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && logs.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      ไม่พบข้อมูลประวัติการใช้งาน
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">
                            {new Date(log.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(log.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                            {log.userName?.charAt(0) || '?'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{log.userName || log.userId || 'Unknown User'}</span>
                            <span className="text-[11px] text-slate-400">ID: {log.userId || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getActionColor(log.action)}`}>
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 line-clamp-1 group-hover:line-clamp-none transition-all duration-200">
                          {log.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <code className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          {log.ipAddress || '-'}
                        </code>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              แสดง {logs.length} รายการล่าสุด
            </span>
            {logs.length >= limit && (
              <button 
                onClick={() => setLimit(limit + 100)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                โหลดเพิ่มเติม...
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
