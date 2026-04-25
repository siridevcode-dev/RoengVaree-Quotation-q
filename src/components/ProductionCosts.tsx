"use client";

import React from "react";

export default function ProductionCosts() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Production Costs</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
              ระบบจัดการต้นทุนการผลิต
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 text-center text-gray-500">
          <p>อยู่ระหว่างการพัฒนา...</p>
        </div>
      </div>
    </div>
  );
}
