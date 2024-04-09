import React, { createContext, useContext, useState } from "react";

const DataAcrossPages = createContext();

export const MyProvider = ({ children }) => {
  const [data, setData] = useState(null);

  return (
    <DataAcrossPages.Provider value={{ data, setData }}>
      {children}
    </DataAcrossPages.Provider>
  );
};
