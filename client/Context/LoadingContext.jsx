import React, { useCallback, useState } from "react";
import { createContext } from "react";
import { Loading } from "@shopify/polaris";

export const LoadingContext = createContext();
export const LoadingContextProvider = ({ children }) => {
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoadingContext(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoadingContext(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, isLoadingContext }}>
      {children}
      {isLoadingContext && <Loading />}
    </LoadingContext.Provider>
  );
};
