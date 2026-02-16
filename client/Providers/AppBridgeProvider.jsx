import { useLocation } from "react-router-dom";
import { localStorage } from "@/Utils/Index";
import { AdminAccess } from "./AdminAccess";

export function AppBridgeProvider({ children }) {
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token") || localStorage()?.getItem("adminAccessToken");
  const host = new URLSearchParams(location.search).get("host") || window.__SHOPIFY_DEV_HOST;

  if (token && !host) {
    localStorage()?.setItem("adminAccessToken", token);
    return <AdminAccess token={token}>{children}</AdminAccess>;
  } else {
    localStorage()?.removeItem("adminAccessToken");
  }

  if (typeof window !== "undefined") {
    const shop = window?.shopify?.config?.shop;
    if (!shop) {
      return <p>No Shop Provided</p>;
    }
  }

  return <>{children}</>;
}
