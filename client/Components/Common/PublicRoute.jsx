import React from "react";
import { AppProvider } from "@shopify/polaris";
import { PublicFooter } from "@/Components/Common/PublicFooter";
import { PublicHeader } from "@/Components/Common/PublicHeader";

export default function PublicRoute({ children }) {
  return (
    <AppProvider>
      <PublicHeader />
      {children}
      <PublicFooter />
    </AppProvider>
  );
}
