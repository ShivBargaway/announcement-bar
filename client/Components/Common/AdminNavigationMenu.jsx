import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BlockStack, Navigation } from "@shopify/polaris";
import {
  CameraIcon,
  DatabaseIcon,
  DeleteIcon,
  ExitIcon,
  ProfileIcon,
  SlideshowIcon,
} from "@shopify/polaris-icons";
import { removeLocalStorageItem } from "@/Utils/Index";

function AdminNavigationMenu() {
  const navigate = useNavigate();

  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  const handleLogout = () => {
    removeLocalStorageItem("adminPanelAccessToken");
    navigate("/admin/login");
  };
  const menu = [
    { label: "7 Day Premium", icon: DatabaseIcon, destination: "/admin/premiumTrial" },
    { label: "Recent Trial Cancel", icon: DatabaseIcon, destination: "/admin/trialCancel" },
    { label: "Plan Renewal", icon: DatabaseIcon, destination: "/admin/getPremiumRenewalUser" },
    { label: "Recent Active User", icon: DatabaseIcon, destination: "/admin/recentActiveUser" },
    { label: "User", icon: ProfileIcon, destination: "/admin/user" },
    { label: "Premium Uninstallation", icon: DatabaseIcon, destination: "/admin/premiumUninstallation" },
    { label: "DeleteUser", icon: DeleteIcon, destination: "/admin/deleteuser" },
    { label: "GetData", icon: DatabaseIcon, destination: "/admin/getdata" },
    { label: "Preview", icon: SlideshowIcon, destination: "/admin/preview" },
    { label: "Add Video Link", icon: DatabaseIcon, destination: "/admin/addVideoLink" },
    { label: "Feedback Videos", icon: CameraIcon, destination: "/admin/feedbackVideo" },
    { label: "Discount Codes", icon: CameraIcon, destination: "/admin/discountCode" },
  ];

  const handleClick = useCallback((item) => {
    navigate(item.destination);
    setSelected(item.destination);
  }, []);

  return (
    <Navigation location={location.pathname}>
      <BlockStack>
        <Navigation.Section
          items={menu.map((item) => ({
            ...item,
            onClick: () => handleClick(item),
            selected: selected === item.destination,
          }))}
        />
        <Navigation.Section
          title="Others"
          items={[
            {
              label: "Logout",
              icon: ExitIcon,
              onClick: handleLogout,
            },
          ]}
          rollup={{
            after: 0,
            view: "view",
            hide: "hide",
            activePath: "#",
          }}
        />
      </BlockStack>
    </Navigation>
  );
}

export default AdminNavigationMenu;
