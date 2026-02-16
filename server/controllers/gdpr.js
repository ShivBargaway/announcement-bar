import { deleteMany } from "./../backend/model/common.js";
import { logger } from "./../backend/services/logger/index.js";

/**
 *
 * CUSTOMER_DATA_REQUEST
 *
 */

const customerDataRequest = async (topic, shop, webhookRequestBody) => {
  // Payload
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com",
  //   "orders_requested": [
  //     123456,
  //     123456,
  //     123456,
  //   ],
  //   "customer": {
  //     "id": 123456,
  //     "email": "email@email.com",
  //     "phone": "123-123-1231"
  //   },
  //   "data_request": {
  //     "id": 1111
  //   }
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

/**
 *
 * CUSTOMER_REDACT
 *
 */

const customerRedact = async (topic, shop, webhookRequestBody) => {
  // Payload
  // {
  //   "shop_id": 123456,
  //   "shop_domain": "store.myshopify.com",
  //   "customer": {
  //     "id": 123456,
  //     "email": "email@email.com",
  //     "phone": "123-123-1234"
  //   },
  //   "orders_to_redact": [
  //     123456,
  //     123456,
  //     123456
  //   ]
  // }
  try {
    console.log(`Handle ${topic} for ${shop}`);
    console.log(webhookRequestBody);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

/**
 *
 * SHOP_REDACT
 *
 */

const shopRedact = async (topic, shop, webhookRequestBody) => {
  try {
    // pass in this array all delete many requests
    let promise = [
      deleteMany("user", { shopUrl: shop }),
      deleteMany("activePlan", { shopUrl: shop }),
      deleteMany("animation", { shopUrl: shop }),
      deleteMany("annoucement", { shopUrl: shop }),
    ];
    await Promise.all(promise)
      .then(async () => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
    return { success: true };
  } catch (err) {
    logger.identifyUser({ username: shop });
    logger.error(err);
    return { success: false };
  }
};

export { customerDataRequest, customerRedact, shopRedact };
