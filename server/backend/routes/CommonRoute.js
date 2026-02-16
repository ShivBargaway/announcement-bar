import { Router } from "express";
import { createCustomizeAi, getShopifyImage } from "../controllers/Common/CommonCtrl.js";

const commonRoute = Router();

commonRoute.post("/create/customize/ai", createCustomizeAi);
commonRoute.post("/get/shopify/image", getShopifyImage);

export default commonRoute;
