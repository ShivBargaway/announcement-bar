import { Router } from "express";
import {
  getOnboardingData,
  postSuggestionStatus,
  putOnboardingData,
  updateEarningPoints,
} from "./../controllers/user/appUserCtrl.js";
import {
  getAppEnableStatus,
  getUserProfile,
  postUserReview,
  postWebVitals,
  sendMsgToCustomerlyUser,
  sendMsgToSlackChannel,
  syncProfile,
  updateFeatureStatus,
  updateUser,
} from "./../controllers/user/userCtrl.js";

const UserRoutes = Router();

UserRoutes.get("/profile", getUserProfile);
UserRoutes.get("/app-block-status", getAppEnableStatus);
UserRoutes.put("/user/update", updateUser);
UserRoutes.post("/user/featureStatus", updateFeatureStatus);
UserRoutes.get("/user/onboarding", getOnboardingData);
UserRoutes.put("/user/onboarding", putOnboardingData);
UserRoutes.get("/syncProfile", syncProfile);
UserRoutes.post("/onboarding/suggestionStatus", postSuggestionStatus);
UserRoutes.post("/update/review", postUserReview);
UserRoutes.post("/web-vitals", postWebVitals);
UserRoutes.put("/user/earningPoints", updateEarningPoints);
UserRoutes.post("/web-vitals", postWebVitals);
UserRoutes.post("/slack-channel-message", sendMsgToSlackChannel);
UserRoutes.post("/sendMsgToCustomerly", sendMsgToCustomerlyUser);

export default UserRoutes;
