/* ProviderWrapper.tsx */
"use client";

import { AppProvider } from "@/context/AppContext";
import React from "react";

const ProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppProvider>{children}</AppProvider>;
};

export default ProviderWrapper;
