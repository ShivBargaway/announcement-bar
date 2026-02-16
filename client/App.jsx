import React, { Suspense, lazy, useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";
import { CustomerlyProvider } from "react-live-chat-customerly";
import { BrowserRouter } from "react-router-dom";
import { Loading } from "@shopify/polaris";
import i18n from "i18next";
import "@/AppStyle.scss";
import FallbackUIComponent from "@/Components/Common/FallbackUIComponent";
import { OnboardingContextProvider } from "@/Context/OnboardingContext";
import { ProfileContextProvider } from "@/Context/ProfileContext";
import { ReviewModalContextProvider } from "@/Context/ReviewContext";
import "@/LanguageJS/en.js";
import { AppBridgeProvider, ContextProviderList, PolarisProvider } from "@/Providers/Index";
import { ErrorBoundary } from "@/Services/Logger/Sentry";
import "@/Style.scss";
import { getSessionStorageItem } from "@/Utils/Index";
import Routes from "./Routes";

const CrispChat = lazy(() => import("@/Components/Common/Crisp"));
const CustomerlyUpdate = lazy(() => import("@/Components/Common/CustomerlyUpdate"));
const PublicRouteWrapper = lazy(() => import("./PublicRouteWrapper"));
const AdminRouteWrapper = lazy(() => import("./AdminRouteWrapper"));
const initialLanguage = getSessionStorageItem("appLanguage") || "en";

export default function App() {
  const isPublicRoute = window.location.pathname.includes("/public");
  const isAdminRoute = window.location.pathname.includes("/admin");
  // const RouteComponents = useRoutes(Routes);
  const [showChat, setShowChat] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    import(`@/LanguageJS/${initialLanguage}.js`)
      .then((data) => {
        i18n.use(initReactI18next).init({
          lng: initialLanguage,
          fallbackLng: "en",
          interpolation: {
            escapeValue: false,
          },
          resources: {
            [initialLanguage]: {
              translation: data.default,
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error loading initial language file:", error);
        i18n.use(initReactI18next).init({
          lng: "en",
          fallbackLng: "en",
          interpolation: {
            escapeValue: false,
          },
        });
      });
  }, []);

  return (
    <ErrorBoundary fallback={<FallbackUIComponent />}>
      {document.getElementById("loading") && document.getElementById("loading").remove()}
      <PolarisProvider>
        <ContextProviderList>
          <BrowserRouter>
            {isPublicRoute && !isAdminRoute ? (
              <Suspense fallback={<Loading />}>
                <PublicRouteWrapper />
              </Suspense>
            ) : isAdminRoute ? (
              <Suspense fallback={<Loading />}>
                <AdminRouteWrapper />
              </Suspense>
            ) : (
              <AppBridgeProvider>
                <ProfileContextProvider>
                  <CustomerlyProvider appId={process.env.CSTOMERLY_WEBSITE_ID}>
                    <OnboardingContextProvider>
                      <ReviewModalContextProvider>
                        <Routes />
                        <Suspense>
                          {showChat && process.env.CSTOMERLY_WEBSITE_ID && <CustomerlyUpdate />}
                          {showChat && <CrispChat />}
                        </Suspense>
                      </ReviewModalContextProvider>
                    </OnboardingContextProvider>
                  </CustomerlyProvider>
                </ProfileContextProvider>
              </AppBridgeProvider>
            )}
          </BrowserRouter>
        </ContextProviderList>
      </PolarisProvider>
    </ErrorBoundary>
  );
}
