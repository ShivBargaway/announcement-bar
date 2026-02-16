import { calculateIdealCustomerRate, getProductcount, setAppLanguage } from "../../helpers/utils.js";
import { findOne, findOneAndUpdate } from "../../model/common.js";
import { postData } from "../PrivateMetaField.js";
import { thirdPartyIntegration } from "../ThirdPartyIntegration/thirdPartyIntegration.js";
import { createShopChanges } from "./appShopifyCtrl.js";

const createOrUpdateShop = async (req, res) => {
  try {
    const { restClient, graphqlClient, session, shop } = req.shopify;
    let user = await findOne("user", { shopUrl: shop });
    if (!user) {
      let promise = [];
      promise.push(
        restClient.get({
          path: `shop.json`,
        })
      );
      if (process.env.PRODUCT_COUNT === "true") {
        promise.push(getProductcount(graphqlClient));
      }

      await Promise.all(promise)
        .then(async (res) => {
          let shop = res[0].body.shop;
          let product_count = 0;
          if (process.env.PRODUCT_COUNT === "true") {
            product_count = res[1] || 0;
          }
          await createShop(shop, session, product_count, graphqlClient);
        })
        .catch(function (err) {
          throw err;
        });
    }

    return user;
  } catch (err) {
    throw err;
  }
};

const createShop = async (shop, session, product_count, graphqlClient) => {
  try {
    let trial_days;
    let deletedUser = await findOne("deletedUser", {
      shopUrl: shop.myshopify_domain,
    });
    if (deletedUser && deletedUser?.trial_days >= 0) trial_days = deletedUser?.trial_days;

    // const markets = await getMarkets(graphqlClient);
    const initialUserData = {
      storeName: shop.name,
      shopUrl: shop.myshopify_domain,
      shop_owner: shop.shop_owner,
      domain: shop.domain,
      storeId: shop.id,
      email: shop.email,
      productCount: product_count,
      currency: shop.currency,
      userLanguage: shop.primary_locale,
      appLanguage: setAppLanguage(shop.primary_locale),
      country_code: shop.country_code,
      country_name: shop.country_name,
      plan_display_name: shop.plan_display_name,
      plan_name: shop.plan_name,
      phone: shop.phone,
      customer_email: shop.customer_email,
      accessToken: session.accessToken,
      scope: session.scope,
      recurringPlanName: "Premium",
      recurringPlanType: "Paid",
      recurringPlanId: "Premium100",
      password_enabled: shop.password_enabled,
      created_at: shop.created_at,
      trial_days: trial_days,
      onboardingFinishLater: true,
      eligible_for_payments: shop.eligible_for_payments,
      enabled_presentment_currencies: shop.enabled_presentment_currencies,
      // markets: markets,
      associated_user: session?.onlineAccessInfo?.associated_user,
      timezone: shop.timezone,
      iana_timezone: shop.iana_timezone,
    };

    let data = {
      $set: {
        ...initialUserData,
        idealCustomerRate: calculateIdealCustomerRate(initialUserData),
      },
    };

    let user = await findOneAndUpdate("user", { shopUrl: shop.myshopify_domain }, data);

    let animation = {
      shopUrl: shop.myshopify_domain,
      userId: user._id,
      animationIn: "slideInDown",
      animationOut: "slideOutDown",
      autoplayTime: 5000,
      animationTime: 1500,
      textAnimationTime: 15,
      textAnimationPadding: 15,
      slideHeight: 40,
      type: "all",
      slidePosition: "static",
      rmvBtnColor: "#ffffff",
      rmvBtnEnabled: "false",
      cssEnabled: "false",
      customCss: "",
      absolutePosition: "",
    };
    let animations = await findOneAndUpdate("animation", { shopUrl: shop.myshopify_domain }, animation);
    await postData(graphqlClient, shop.myshopify_domain, animations, "animation");

    let plan = {
      shopUrl: shop.myshopify_domain,
      userId: user._id,
      planName: "Premium",
      id: "Premium100",
      planPrice: 0,
      originalPrice: 0,
      discountedPrice: 0,
      status: "active",
      type: "monthly",
      is_recurring: true,
      intervalLable: "Month",
      billingInterval: "Month",
      currentMonthStartDate: new Date(),
      nextMonthStartDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      chargeInfo: {
        startDate: new Date(),
        planName: "Premium",
        planPrice: 0,
      },
    };
    await findOneAndUpdate("activePlan", { shopUrl: shop.myshopify_domain }, plan);

    await createShopChanges({ shop_domain: shop.myshopify_domain, shop: session.shop, session });

    thirdPartyIntegration(user);
  } catch (err) {
    throw err;
  }
};

var date_diff_indays = function (date1, date2) {
  var dt1 = new Date(date1);
  var dt2 = new Date(date2);
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  );
};

export { createOrUpdateShop };
