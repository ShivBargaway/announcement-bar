import React from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import PublicRoute from "@/Components/Common/PublicRoute.jsx";
import PrivacyPolicy from "@/Pages/PrivacyPolicy/PrivacyPolicy.jsx";
import PublicHome from "@/Pages/PublicHome/PublicHome.jsx";
import PublicUninstallation from "@/Pages/PublicHome/PublicUninstallation";
import PublicVideoFeedBack from "@/Pages/PublicHome/PublicVideoFeedBack";
import TermsAndConditions from "@/Pages/TermsAndConditions/TermsAndConditions.jsx";

const PublicRouteWrapper = () => {
  const includedPaths = ["/public/feedback", "/public/uninstallation"];
  const isPublicRoute = includedPaths.some((path) => window.location.pathname.includes(path));
  return isPublicRoute ? (
    <ReactRouterRoutes>
      <Route path="/public/feedback" element={<PublicVideoFeedBack />} />
      <Route path="/public/uninstallation" element={<PublicUninstallation />} />
    </ReactRouterRoutes>
  ) : (
    <PublicRoute>
      <ReactRouterRoutes>
        <Route path="/public/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/public/terms-of-service" element={<TermsAndConditions />} />
        <Route path="/public/" element={<PublicHome />} />
        <Route path="/public/feedback" element={<PublicVideoFeedBack />} />
      </ReactRouterRoutes>
    </PublicRoute>
  );
};

export default PublicRouteWrapper;
