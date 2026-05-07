
import { useState, useEffect } from "react";
import { thaiAddressData, ThaiAddress } from "@/data/thaiAddressData";

export function useThaiAddress(initialProvince = "", initialDistrict = "", initialSubDistrict = "") {
  const [province, setProvince] = useState(initialProvince);
  const [district, setDistrict] = useState(initialDistrict);
  const [subDistrict, setSubDistrict] = useState(initialSubDistrict);
  const [zipCode, setZipCode] = useState("");

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableSubDistricts, setAvailableSubDistricts] = useState<string[]>([]);

  const provinces = thaiAddressData.map((p) => p.province);

  // Update districts when province changes
  useEffect(() => {
    const provinceData = thaiAddressData.find((p) => p.province === province);
    if (provinceData) {
      const districtNames = provinceData.districts.map((d) => d.name);
      setAvailableDistricts(districtNames);
      
      // If current district is not in the new province, reset it
      if (!districtNames.includes(district)) {
        setDistrict("");
        setSubDistrict("");
        setZipCode("");
      }
    } else {
      setAvailableDistricts([]);
      setDistrict("");
      setSubDistrict("");
      setZipCode("");
    }
  }, [province]);

  // Update sub-districts when district changes
  useEffect(() => {
    const provinceData = thaiAddressData.find((p) => p.province === province);
    const districtData = provinceData?.districts.find((d) => d.name === district);
    
    if (districtData) {
      const subDistrictNames = districtData.subdistricts.map((sd) => sd.name);
      setAvailableSubDistricts(subDistrictNames);
      
      if (!subDistrictNames.includes(subDistrict)) {
        setSubDistrict("");
        setZipCode("");
      }
    } else {
      setAvailableSubDistricts([]);
      setSubDistrict("");
      setZipCode("");
    }
  }, [district, province]);

  // Update zip code when sub-district changes
  useEffect(() => {
    const provinceData = thaiAddressData.find((p) => p.province === province);
    const districtData = provinceData?.districts.find((d) => d.name === district);
    const subDistrictData = districtData?.subdistricts.find((sd) => sd.name === subDistrict);
    
    if (subDistrictData) {
      setZipCode(subDistrictData.zipcode);
    } else {
      setZipCode("");
    }
  }, [subDistrict, district, province]);

  return {
    province,
    setProvince,
    district,
    setDistrict,
    subDistrict,
    setSubDistrict,
    zipCode,
    setZipCode,
    provinces,
    availableDistricts,
    availableSubDistricts,
  };
}
