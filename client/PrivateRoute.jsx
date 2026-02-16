import { Outlet } from "react-router-dom";
import { t } from "i18next";
import AppUninstall from "@/Components/Common/AppUninstall.jsx";
import LearnMore from "./Pages/LearnMore/LearnMore";

export const AppRoute = ({ type }) => {
  if (type === "private") {
    return (
      <>
        <AppUninstall />
        <Outlet />
        <div style={{ margin: "30px" }}>{/* <LearnMore title= {t("common.Announcement Bar")} /> */}</div>
      </>
    );
  }
};
