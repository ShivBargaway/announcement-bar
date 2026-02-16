/**
 *
 * It's relatively easy to overload this function that will result in a long first open time.
 * If something can happen in the background, don't `await FreshInstall()` and instead just
 * `FreshInstall()` in isInitialLoad function.
 *
 */
import { createOrUpdateShop } from "../server/backend/controllers/shopify/shopifyCtrl.js";
import StoreModel from "./models/StoreModel.js";

const freshInstall = async (req, res, shop) => {
  await createOrUpdateShop(req, res);

  await StoreModel.findOneAndUpdate({ shop: shop }, { isActive: true }, { upsert: true });
};

export default freshInstall;
