import React from "react";
import { LoadingContextProvider } from "../Context/LoadingContext";
import { ToastContextProvider } from "../Context/ToastContext";

export function ContextProviderList({ children }) {
  return (
    <LoadingContextProvider>
      <ToastContextProvider>{children}</ToastContextProvider>
    </LoadingContextProvider>
  );
}
