import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppProvider, Frame } from "@shopify/polaris";
import AdminNavigationMenu from "@/Components/Common/AdminNavigationMenu.jsx";
import { AdminPublicHeader } from "@/Components/Common/AdminPublicHeader";
import { isAdminPanelAccess } from "@/Utils/Index";

function AdminPublicRoute({ children }) {
  const location = useLocation();
  const isLoginComponent = location.pathname === "/admin/login";

  if (!isAdminPanelAccess() && !isLoginComponent) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="admin-panel">
      <AppProvider>
        <AdminPublicHeader />
        <Frame>
          {!isLoginComponent ? (
            <React.Fragment>
              <AdminNavigationMenu />
              {children}
            </React.Fragment>
          ) : (
            <React.Fragment>{children}</React.Fragment>
          )}
        </Frame>
      </AppProvider>
    </div>
  );
}

export default AdminPublicRoute;
