"use client";
import React, { createContext, useContext, useState } from "react";

type DateUpdatedContextType = {
  dateUpdated: string | null;
  setDateUpdated: (iso: string | null) => void;
};

const DateUpdatedContext = createContext<DateUpdatedContextType | undefined>(
  undefined
);

export const DateUpdatedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dateUpdated, setDateUpdatedState] = useState<string | null>(null);

  const setDateUpdated = (iso: string | null) => {
    setDateUpdatedState(iso);
  };

  return (
    <DateUpdatedContext.Provider value={{ dateUpdated, setDateUpdated }}>
      {children}
    </DateUpdatedContext.Provider>
  );
};

export const useDateUpdated = () => {
  const ctx = useContext(DateUpdatedContext);
  if (!ctx)
    throw new Error("useDateUpdated must be used within DateUpdatedProvider");
  return ctx;
};

export default DateUpdatedContext;
