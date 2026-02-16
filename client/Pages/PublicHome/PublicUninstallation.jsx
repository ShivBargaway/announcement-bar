import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { setLocalStorageItem } from "../../Utils/Index";

export default function PublicUninstallation() {
  const fetch = useAuthenticatedFetch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shopUrl = searchParams.get("shopUrl");
  const monthlyCode = searchParams.get("monthlyCode");
  const yearlyCode = searchParams.get("yearlyCode");

  const fetchData = () => {
    // setLocalStorageItem("monthlyCode", monthlyCode);
    // setLocalStorageItem("yearlyCode", yearlyCode);
    fetch.post(`/uninstallToInstallApp`, { shopUrl, monthlyCode, yearlyCode }, false);
    window.location.href = process.env.SHOPIFY_STORE_APP_URL;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <></>;
}
