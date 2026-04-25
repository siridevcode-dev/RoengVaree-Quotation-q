"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function Login() {
  const { login, showToast } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(username, password);

    if (result.success) {
      showToast("เข้าสู่ระบบสำเร็จ!", "success");
    } else {
      setError(result.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      showToast("เข้าสู่ระบบไม่สำเร็จ", "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background Orbs (Light Version) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      
      <div className="w-full max-w-[440px] relative z-10 transition-all duration-700 animate-in fade-in zoom-in-95">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-[32px] bg-white p-4 shadow-xl shadow-teal-500/10 mb-6 group transition-transform duration-500 hover:scale-105 border border-slate-100">
             <img src="/logo.png" alt="RoengVaree Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-[#283583]">
            ROENGVAREE
          </h1>
          <p className="text-slate-500 font-medium tracking-wide">Quotation Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] ml-1 text-[#283583]">Username / Phone</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-[#283583] group-focus-within:transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  title="ชื่อผู้ใช้หรือเบอร์โทรศัพท์"
                  placeholder="กรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[18px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] ml-1 text-[#283583]">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  title="รหัสผ่าน"
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[18px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-bold text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              title="เข้าสู่ระบบ"
              className="w-full py-4 px-6 text-white font-black uppercase tracking-widest rounded-[18px] shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative bg-gradient-to-r from-[#283583] to-[#3b4ba4] shadow-[0_10px_15px_-3px_rgba(40,53,131,0.2)]"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </div>
              
              {/* Shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine"></div>
            </button>
          </form>

          {/* Helper info */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Edition</span>
               <div className="h-1.5 w-1.5 rounded-full shadow-[0_0_12px_rgba(40,53,131,0.8)] bg-[#283583]"></div>
            </div>
            <p className="text-[11px] text-center text-slate-400 font-medium">
               Authorized personal only. All activity is logged and monitored.
            </p>
          </div>
        </div>

        {/* Footer credits */}
        <p className="mt-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">
          © 2026 RoengVaree Marine Engineering
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .animate-shine {
          animation: shine 0.75s;
        }
      `}} />
    </div>
  );
}
