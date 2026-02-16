import React, { useCallback, useEffect, useState } from "react";
import { Loading } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";
import NoAdminAccess from "@/Components/Common/NoAdminAccess";
import { logger } from "@/Services/Logger/Index";

export const AdminAccess = ({ children, token }) => {
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const checkToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch.get(`admin/user/checktoken?token=${token}`);
      setIsTokenVerified(true);
      setIsLoading(false);
    } catch (error) {
      // TODO: need to handle remove token from localStorage
      logger.error(error, { extras: { token: token } });
      setIsTokenVerified(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isTokenVerified) {
    return <div className="Admin-Access">{children}</div>;
  } else {
    return <NoAdminAccess />;
  }
};
