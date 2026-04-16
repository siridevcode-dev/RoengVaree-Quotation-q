"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  message?: string;
}

export default function PasswordModal({ isOpen, onClose, onSuccess, title = "ยืนยันการลบ", message = "กรุณากรอกรหัสผ่าน Admin เพื่อยืนยันการทำรายการ" }: PasswordModalProps) {
  const { showToast } = useAppContext();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("qm_token");
      const res = await fetch("/api/auth/verify-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(true);
        showToast("รหัสผ่านไม่ถูกต้อง หรือคุณไม่มีสิทธิ์ Admin", "error");
      }
    } catch {
      setError(true);
      showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 leading-relaxed px-4">{message}</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                autoFocus
                placeholder="Admin Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className={`w-full px-4 py-3 text-center text-lg bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 transition-all tracking-widest font-mono ${
                  error 
                    ? "border-red-300 focus:ring-red-500/20 text-red-600" 
                    : "border-gray-200 focus:ring-teal-500/20 text-teal-800"
                }`}
              />
              {error && <p className="text-[11px] text-red-500 font-bold mt-2 text-center animate-bounce">รหัสผ่านไม่ถูกต้อง!</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all border border-transparent"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
