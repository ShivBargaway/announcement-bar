import { Router } from "express";
import { duplicateSlide } from "../controllers/admin/adminPreviewCtrl.js";
import {
  deleteSingleVideoLink,
  getAllVideoLink,
  getAllVideoLinkForTable,
  postSingleVideoLink,
} from "../controllers/admin/allvideoLink.js";
import { getAllFeedbackVideo, postFeedbackDescription } from "../controllers/feedBack/feedBack.js";
import { isAdminUser, validateAcessToken, validateToken } from "../middlewares/checkToken.js";
import {
  activePlan,
  adminLogin,
  cancelPlan,
  checkToken,
  generateAccessToken,
  getAdminProfile,
  getAllCollectionName,
  getDeletedUsers,
  getDeletedUsersToExport,
  getDynamicFields,
  getPremiumRenewalUser,
  getPremiumTrialUser,
  getTrialCancelUser,
  getUsers,
  getUsersToExport,
  postAdvanceFilter,
  postAdvanceFilterDeleteeUser,
  postdistinctData,
  premiumUninstall,
  recentActiveUser,
  removeWebhook,
  syncMetafield,
  syncPlanFromAdmin,
  updatePopupView,
  updateUser,
} from "./../controllers/admin/adminCtrl.js";

const AdminRoutes = Router();

AdminRoutes.post("/admin/login", adminLogin);
AdminRoutes.post("/admin/distinctData", postdistinctData);

AdminRoutes.post("/admin/advanceFilter", postAdvanceFilter);
AdminRoutes.post("/admin/advanceFilterdeleteUser", postAdvanceFilterDeleteeUser);

AdminRoutes.get("/admin/profile", validateToken, isAdminUser, getAdminProfile);

AdminRoutes.post("/admin/user", validateToken, isAdminUser, getUsers);

AdminRoutes.get("/admin/access_token", validateToken, isAdminUser, generateAccessToken);

AdminRoutes.post("/admin/deleteduser", validateToken, isAdminUser, getDeletedUsers);

AdminRoutes.get("/admin/exportUser", validateToken, isAdminUser, getUsersToExport);

AdminRoutes.get("/admin/exportDeleteduser", validateToken, isAdminUser, getDeletedUsersToExport);

AdminRoutes.get("/admin/user/checktoken", validateAcessToken, checkToken);

AdminRoutes.put("/admin/addPlan", activePlan);
AdminRoutes.put("/admin/syncPlanFromAdmin", syncPlanFromAdmin);

AdminRoutes.put("/admin/removePlan", cancelPlan);

AdminRoutes.put("/admin/syncMetafield", syncMetafield);
AdminRoutes.put("/admin/updatePopupView", updatePopupView);

AdminRoutes.put("/admin/updateUser", updateUser);

AdminRoutes.post("/admin/add-annoucement", duplicateSlide);
AdminRoutes.post("/admin/getDynamicFields", getDynamicFields);
AdminRoutes.get("/admin/getAllCollectionNames", getAllCollectionName);
AdminRoutes.post("/admin/premiumTrial/:days", getPremiumTrialUser);
AdminRoutes.post("/admin/recentCancelPlan/:days", getTrialCancelUser);
AdminRoutes.post("/admin/recentActiveUser/:days", recentActiveUser);

AdminRoutes.post("/admin/premiumUninstall/:days", premiumUninstall);
AdminRoutes.post("/admin/getPremiumRenewalUser/:days", getPremiumRenewalUser);

AdminRoutes.post("/admin/addSingleVideoLink", postSingleVideoLink);
AdminRoutes.post("/admin/getAllVideoLink", getAllVideoLinkForTable);
AdminRoutes.get("/admin/getAllVideoLink", getAllVideoLink);
AdminRoutes.delete("/admin/deleteSingleVideoLink/:_id", deleteSingleVideoLink);
AdminRoutes.post("/admin/getAllFeedbackVideo", getAllFeedbackVideo);
AdminRoutes.post("/admin/feedback-description", postFeedbackDescription);
AdminRoutes.post("/admin/removeWebhook", removeWebhook);

export default AdminRoutes;
