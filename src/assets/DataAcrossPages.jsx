// DataAcrossPages.js
import React, { createContext, useContext, useEffect, useState } from "react";

// สร้าง Context
const DataAcrossPages = createContext();

// สร้าง Provider
export const MyProvider = ({ children }) => {
  const storedData = localStorage.getItem("data");
  const initialData = storedData ? JSON.parse(storedData) : null;

  const [data, setData] = useState(initialData);

  // เมื่อคอมโพเนนต์ถูกทำลาย
  useEffect(() => {
    // บันทึกข้อมูลลงใน localStorage
    localStorage.setItem("data", JSON.stringify(data));
    // Cleanup function
    return () => {
      // ลบข้อมูลออกจาก localStorage เมื่อคอมโพเนนต์ถูกทำลาย
      localStorage.removeItem("data");
    };
  }, [data]); // อัปเดตเมื่อมีการเปลี่ยนแปลงข้อมูล

  return (
    <DataAcrossPages.Provider value={{ data, setData }}>
      {children}
    </DataAcrossPages.Provider>
  );
};

// ส่งออก Context
export { DataAcrossPages };
