import { Router } from "express";
import { acceptPremium100Plan } from "../controllers/pricing/appPricingCtrl.js";
import {
  activeOneTimeCharge,
  getCreditInfo,
  oneTimePurchasePlan,
  saveMoreCredit,
} from "../controllers/pricing/appPricingCtrl.js";
import {
  activePlan,
  activeSyncPlan,
  cancelPlan,
  createPlan,
  getPlan,
} from "../controllers/pricing/pricingCtrl.js";

const PricingRoutes = Router();

PricingRoutes.get("/plan", getPlan);

PricingRoutes.post("/plan", createPlan);

PricingRoutes.post("/plan/active", activePlan);

PricingRoutes.post("/plan/cancel", cancelPlan);

PricingRoutes.post("/activeSyncPlan", activeSyncPlan);

PricingRoutes.post("/acceptPremium100Plan", acceptPremium100Plan);
PricingRoutes.post("/plan/oneTimePurchase", oneTimePurchasePlan);

PricingRoutes.post("/plan/saveCredit", saveMoreCredit);

PricingRoutes.post("/plan/getCreditInfo", getCreditInfo);

PricingRoutes.post("/activeOneTimeCharge", activeOneTimeCharge);

export default PricingRoutes;
