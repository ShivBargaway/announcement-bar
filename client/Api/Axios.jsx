import { useContext, useEffect, useRef } from "react";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import axios from "axios";
import { LoadingContext } from "@/Context/LoadingContext";
import { ToastContext } from "@/Context/ToastContext";
import { logger } from "@/Services/Logger/Index";
import { handleError, localStorage } from "@/Utils/Index";

const instance = axios.create({
  baseURL: "/apps/api/", // Replace with your actual Shopify app base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthHeader(accessToken) {
  try {
    instance.defaults.headers.common["authorization"] = `Bearer ${accessToken}`;
  } catch (e) {
    return undefined;
  }
}

export function setAdminAuthHeader() {
  try {
    instance.defaults.headers.common["authorizationAdmin"] = localStorage()?.getItem("adminAccessToken");
  } catch (e) {
    return undefined;
  }
}

export function setAdminPanelAuthHeader() {
  try {
    instance.defaults.headers.common["authorization"] = localStorage()?.getItem("adminPanelAccessToken");
  } catch (e) {
    return undefined;
  }
}

const getApp = () => {
  try {
    return createApp({
      apiKey: window?.shopify?.config?.apiKey,
      host: window?.shopify?.config?.host,
    });
  } catch (e) {
    return false;
  }
};

export function useAuthenticatedFetch() {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const { showToast } = useContext(ToastContext);
  const app = getApp();

  useEffect(() => {
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        showToast(handleError(error), true);
        stopLoading();
        return Promise.reject(error);
      }
    );
  }, [instance]);

  try {
    let adminAccessToken = localStorage()?.getItem("adminAccessToken");
    const isAdminRoute =
      window.location.pathname.includes("/admin") || window.location.pathname.includes("/public");
    if (isAdminRoute) {
      return {
        get: async (url, showIsLoading = true) => {
          showIsLoading && startLoading();
          setAdminPanelAuthHeader();
          const response = await instance.get(url);
          showIsLoading && stopLoading();
          return response.data;
        },
        post: async (url, data, showIsLoading = true, headers = {}) => {
          showIsLoading && startLoading();
          setAdminPanelAuthHeader();
          instance.defaults.headers = { ...instance.defaults.headers, ...headers };
          const response = await instance.post(url, data);
          showIsLoading && stopLoading();
          return response.data;
        },
        put: async (url, data, showIsLoading = true) => {
          showIsLoading && startLoading();
          setAdminPanelAuthHeader();
          const response = await instance.put(url, data);
          showIsLoading && stopLoading();
          return response.data;
        },
        delete: async (url, showIsLoading = true) => {
          showIsLoading && startLoading();
          setAdminPanelAuthHeader();
          const response = await instance.delete(url);
          showIsLoading && stopLoading();
          return response.data;
        },
      };
    } else if (!adminAccessToken) {
      return {
        get: async (url, showIsLoading = true) => {
          showIsLoading && startLoading();
          const accessToken = await getSessionToken(app);
          setAuthHeader(accessToken);
          const response = await instance.get(url);
          showIsLoading && stopLoading();
          return response.data;
        },
        post: async (url, data, showIsLoading = true, headers = { "Content-Type": "application/json" }) => {
          showIsLoading && startLoading();
          const accessToken = await getSessionToken(app);
          setAuthHeader(accessToken);
          instance.defaults.headers = { ...instance.defaults.headers, ...headers };
          const response = await instance.post(url, data);
          showIsLoading && stopLoading();
          return response.data;
        },
        put: async (url, data, showIsLoading = true) => {
          showIsLoading && startLoading();
          const accessToken = await getSessionToken(app);
          setAuthHeader(accessToken);
          const response = await instance.put(url, data);
          showIsLoading && stopLoading();
          return response.data;
        },
        delete: async (url, showIsLoading = true) => {
          showIsLoading && startLoading();
          const accessToken = await getSessionToken(app);
          setAuthHeader(accessToken);
          const response = await instance.delete(url);
          showIsLoading && stopLoading();
          return response.data;
        },
      };
    } else {
      return {
        get: async (url, showIsLoading = true) => {
          showIsLoading && startLoading();
          setAdminAuthHeader();
          const response = await instance.get(url);
          showIsLoading && stopLoading();
          return response.data;
        },
        post: async (url, data, showIsLoading = true, headers = { "Content-Type": "application/json" }) => {
          showIsLoading && startLoading();
          setAdminAuthHeader();
          instance.defaults.headers = { ...instance.defaults.headers, ...headers };
          const response = await instance.post(url, data);
          showIsLoading && stopLoading();
          return response.data;
        },
        put: async (url, data, showIsLoading = true) => {
          showIsLoading && startLoading();
          setAdminAuthHeader();
          const response = await instance.put(url, data);
          showIsLoading && stopLoading();
          return response.data;
        },
        delete: async (url, showIsLoading = true) => {
          showIsLoading && startLoading();
          setAdminAuthHeader();
          const response = await instance.delete(url);
          showIsLoading && stopLoading();
          return response.data;
        },
      };
    }
  } catch (error) {
    logger.error(error);
  }
}
