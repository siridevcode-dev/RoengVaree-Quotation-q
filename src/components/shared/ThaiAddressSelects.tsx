"use client";

import React, { useMemo } from "react";
import { thaiAddressData } from "@/data/thaiAddressData";

interface ThaiAddressSelectsProps {
  province: string;
  district: string;
  subDistrict: string;
  zipCode: string;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onSubDistrictChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  gridClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  inputClassName?: string;
  showLabels?: boolean;
  variant?: "hr" | "sales" | "default";
  disabled?: boolean;
}

export default function ThaiAddressSelects({
  province,
  district,
  subDistrict,
  zipCode,
  onProvinceChange,
  onDistrictChange,
  onSubDistrictChange,
  onZipCodeChange,
  gridClassName = "grid grid-cols-2 gap-4",
  fieldClassName = "relative",
  labelClassName = "block text-[12px] font-medium text-slate-400 mb-1",
  selectClassName = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-700 outline-none focus:border-[#00B2FF] focus:ring-2 focus:ring-[#00B2FF]/20 transition-all cursor-pointer appearance-none",
  inputClassName = "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-400 outline-none cursor-not-allowed",
  showLabels = true,
  variant = "default",
  disabled = false
}: ThaiAddressSelectsProps) {

  const provinces = useMemo(() => thaiAddressData.map((p) => p.province), []);

  const districts = useMemo(() => {
    const p = thaiAddressData.find((p) => p.province === province);
    return p ? p.districts.map((d) => d.name) : [];
  }, [province]);

  const subDistricts = useMemo(() => {
    const p = thaiAddressData.find((p) => p.province === province);
    if (!p) return [];
    const d = p.districts.find((d) => d.name === district);
    return d ? d.subdistricts.map((s) => s.name) : [];
  }, [province, district]);

  const handleProvinceChange = (val: string) => {
    onProvinceChange(val);
    onDistrictChange("");
    onSubDistrictChange("");
    onZipCodeChange("");
  };

  const handleDistrictChange = (val: string) => {
    onDistrictChange(val);
    onSubDistrictChange("");
    onZipCodeChange("");
  };

  const handleSubDistrictChange = (val: string) => {
    onSubDistrictChange(val);
    const p = thaiAddressData.find((p) => p.province === province);
    if (p) {
      const d = p.districts.find((d) => d.name === district);
      if (d) {
        const s = d.subdistricts.find((s) => s.name === val);
        if (s) {
          onZipCodeChange(s.zipcode);
          return;
        }
      }
    }
    onZipCodeChange("");
  };

  const ArrowIcon = () => (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  const renderField = (label: string, value: string, options: string[], onChange: (v: string) => void, placeholder: string) => {
    const isZip = label === "รหัสไปรษณีย์";
    
    return (
      <div className={fieldClassName}>
        {showLabels && <label className={labelClassName}>{label}</label>}
        <div className="relative w-full">
          {isZip ? (
            <input
              type="text"
              title={label}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={inputClassName}
              disabled={disabled}
            />
          ) : (
            <>
              <select
                title={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={selectClassName}
                disabled={disabled}
              >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className={gridClassName}>
        {renderField("จังหวัด", province, provinces, handleProvinceChange, "เลือกจังหวัด")}
        {renderField("อำเภอ/เขต", district, districts, handleDistrictChange, "เลือกอำเภอ")}
      </div>
      <div className={gridClassName}>
        {renderField("ตำบล/แขวง", subDistrict, subDistricts, handleSubDistrictChange, "เลือกตำบล")}
        {renderField("รหัสไปรษณีย์", zipCode, [], onZipCodeChange, "รหัสไปรษณีย์")}
      </div>
    </div>
  );
}
