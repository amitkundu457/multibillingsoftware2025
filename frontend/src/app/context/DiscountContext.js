"use client";
import { createContext, useContext, useState, useEffect } from "react";

const DiscountContext = createContext();

export const DiscountProvider = ({ children }) => {
  // Get the value from localStorage if available, otherwise default to 0
  const [additionRs, setAdditionRs] = useState(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("additionRs");
      return storedValue ? JSON.parse(storedValue) : 0;
    }
    return 0;
  });

  // Reset function for additionRs
  const resetAdditionRs = () => {
    setAdditionRs(0);
    if (typeof window !== "undefined") {
      localStorage.setItem("additionRs", 0);
    }
  };

  // Store the value in localStorage whenever it changes
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("additionRs", JSON.stringify(additionRs));
  //   }
  // }, [additionRs]);

  console.log("🚀 Context loaded: ", additionRs);

  return (
    <DiscountContext.Provider value={{ additionRs, setAdditionRs, resetAdditionRs }}>
      {children}
    </DiscountContext.Provider>
  );
};

// export const useDiscount = () => useContext(DiscountContext);
