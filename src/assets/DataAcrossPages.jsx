// DataAcrossPages.js
import React, { createContext, useContext, useState } from "react";

// สร้าง Context
const DataAcrossPages = createContext();

// สร้าง Provider
export const MyProvider = ({ children }) => {
  const [data, setData] = useState(null);

  return (
    <DataAcrossPages.Provider value={{ data, setData }}>
      {children}
    </DataAcrossPages.Provider>
  );
};

// ส่งออก Context
export { DataAcrossPages };
