import React from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import AdminPublicRoute from "@/Components/Common/AdminPublicRoute.jsx";
import AddVideoLink from "@/Pages/Admin/AddVideoLink";
import DeletedUser from "@/Pages/Admin/DeletedUser.jsx";
import DiscountCode from "@/Pages/Admin/DiscountCode";
import FeedbackVideo from "@/Pages/Admin/FeedbackVideo";
import GetData from "@/Pages/Admin/GetData.jsx";
import Login from "@/Pages/Admin/Login.jsx";
import User from "@/Pages/Admin/User.jsx";
import AnnouncementsPreview from "../client/Pages/Admin/AnnouncementsPreview";

function AdminRouteWrapper() {
  return (
    <AdminPublicRoute>
      <ReactRouterRoutes>
        <Route path="/admin/user" element={<User />} />
        <Route path="/admin/deleteuser" element={<DeletedUser />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/getdata" element={<GetData />} />
        <Route
          path="/admin/premiumTrial"
          element={<User apiRoute={"`admin/premiumTrial/${premiumTrialDays?.days}`"} showCustomDays={true} />}
        />
        <Route
          path="/admin/trialCancel"
          element={<User apiRoute={"`admin/recentCancelPlan/${premiumTrialDays?.days}`"} showCustomDays={true} />}
        />
        <Route
          path="/admin/premiumUninstallation"
          element={
            <DeletedUser apiRoute={"`admin/premiumUninstall/${premiumTrialDays?.days}`"} showCustomDays={true} />
          }
        />
        <Route
          path="/admin/getPremiumRenewalUser"
          element={
            <User apiRoute={"`admin/getPremiumRenewalUser/${premiumTrialDays?.days}`"} showCustomDays={true} />
          }
        />
        <Route
          path="/admin/recentActiveUser"
          element={<User apiRoute={"`admin/recentActiveUser/${premiumTrialDays?.days}`"} showCustomDays={true} />}
        />
        <Route path="/admin/preview" element={<AnnouncementsPreview />} />
        <Route path="/admin/addVideoLink" element={<AddVideoLink />} />
        <Route path="/admin/feedbackVideo" element={<FeedbackVideo />} />
        <Route path="/admin/discountCode" element={<DiscountCode />} />
      </ReactRouterRoutes>
    </AdminPublicRoute>
  );
}

export default AdminRouteWrapper;
