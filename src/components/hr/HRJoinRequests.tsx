"use client";

import { useState } from "react";

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  date: string;
  status: "รอดำเนินการ" | "อนุมัติแล้ว" | "ปฏิเสธ";
}

export default function HRJoinRequests() {
  const [companyCode] = useState("7Mc6lY");
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(companyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const joinLink = `${window.location.origin}/join/${companyCode}`;
    navigator.clipboard.writeText(joinLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "อนุมัติแล้ว" } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "ปฏิเสธ" } : req
    ));
  };

  const handleCreateMockData = () => {
    setRequests([
      {
        id: "REQ001",
        name: "สมชาย ใจดี",
        email: "somchai.j@email.com",
        phone: "081-234-5678",
        position: "ฝ่ายขาย",
        date: "29/04/2569",
        status: "รอดำเนินการ"
      },
      {
        id: "REQ002",
        name: "สมหญิง รักษ์สะอาด",
        email: "somying.r@email.com",
        phone: "082-345-6789",
        position: "ฝ่ายบัญชี",
        date: "28/04/2569",
        status: "รอดำเนินการ"
      },
      {
        id: "REQ003",
        name: "วิชัย เรียนรู้",
        email: "wichai.l@email.com",
        phone: "083-456-7890",
        position: "ฝ่ายปฏิบัติการ",
        date: "27/04/2569",
        status: "รอดำเนินการ"
      }
    ]);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[14px] font-bold text-slate-600">
            <span>code ของบริษัทคือ</span>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl text-blue-600 font-black">
              <span>{companyCode}</span>
              <button 
                onClick={handleCopyCode}
                title="คัดลอกโค้ด"
                className="text-blue-400 hover:text-blue-600 transition-colors p-0.5"
              >
                {copiedCode ? (
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 10h.01M8 16h.01M8 22h.01" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {requests.length === 0 && (
            <button 
              onClick={handleCreateMockData}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[13px] font-bold transition-all shadow-sm"
            >
              <span>สร้างข้อมูลจำลอง</span>
            </button>
          )}
          
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-[13px] font-bold transition-all shadow-sm"
          >
            {copiedLink ? (
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            )}
            <span>คัดลอกลิงก์เข้าร่วม</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {requests.length === 0 ? (
        <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center p-20 min-h-[400px]">
          <div className="relative mb-6">
            {/* Custom Folder Illustration */}
            <svg className="w-32 h-32 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 14h6m-6-3h3" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center mt-2">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-[16px] font-black text-slate-400">ไม่มีข้อมูล</h3>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="pl-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">วันที่ขอเข้าร่วม</th>
                  <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ผู้ขอเข้าร่วม</th>
                  <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ตำแหน่ง</th>
                  <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ข้อมูลติดต่อ</th>
                  <th className="px-6 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">สถานะ</th>
                  <th className="pr-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((req) => (
                  <tr key={req.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="pl-8 py-5">
                      <span className="text-[14px] font-bold text-slate-600">{req.date}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[16px]">
                          {req.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">{req.name}</span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">ID: {req.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-slate-600">{req.position}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col text-[13px] font-bold text-slate-500">
                        <span>{req.email}</span>
                        <span className="text-[11px] text-slate-400">{req.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                        req.status === "อนุมัติแล้ว" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : req.status === "ปฏิเสธ"
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="pr-8 py-5 text-right">
                      {req.status === "รอดำเนินการ" && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(req.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm"
                          >
                            อนุมัติ
                          </button>
                          <button 
                            onClick={() => handleReject(req.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-bold rounded-xl transition-all"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
