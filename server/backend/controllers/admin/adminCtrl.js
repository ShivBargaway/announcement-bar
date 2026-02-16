import jwt from "jsonwebtoken";
import clientProvider from "../../../../utils/clientProvider.js";
import { deleteWebhookQuery, fetchAllWebhookQuery } from "../../graphql/commonQuery.js";
import { ApiResponse, SetError } from "../../helpers/common.js";
import {
  RemoveJsonLDFiles,
  commonFilterQuery,
  comparePassword,
  generatePasswordHash,
  makePaginationQuery,
} from "../../helpers/utils.js";
import {
  count,
  create,
  distinct,
  find,
  findOne,
  findOneAndUpdate,
  findWithCount,
  findWithFields,
  getAllCollectionNames,
  getDirectDataFromDb,
  update,
} from "../../model/common.js";
import { postData } from "../PrivateMetaField.js";
import { thirdPartyIntegration } from "../ThirdPartyIntegration/thirdPartyIntegration.js";
import { metafield } from "../announcementCtrl.js";

const getUsers = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query, body } = req;
    const sort = { created: -1 };
    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);
    const urlParamQuery = body?.shopUrl ? { shopUrl: body?.shopUrl } : {};
    rcResponse.data = (await findWithCount("user", urlParamQuery, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getPremiumTrialUser = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query, body } = req;
    const sort = { trial_start: -1 };
    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);
    const today = new Date();
    const lastSevenDaysDate = new Date(today);
    lastSevenDaysDate.setDate(today.getDate() - Math.max(0, req?.params?.days));
    const dateQuery = {
      trial_start: { $gte: lastSevenDaysDate },
      trial_days: { $gt: 0 },
      recurringPlanId: { $ne: "Free" },
    };
    rcResponse.data = (await findWithCount("user", dateQuery, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};
const recentActiveUser = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query, body } = req;
    const sort = { lastLogin: -1 };
    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);
    const today = new Date();
    const lastSevenDaysDate = new Date(today);
    lastSevenDaysDate.setDate(today.getDate() - Math.max(0, req?.params?.days));
    rcResponse.data = (
      await findWithCount("user", { lastLogin: { $gte: lastSevenDaysDate } }, searchQuery, skip, limit, sort)
    )[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

const getPremiumRenewalUser = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query, body } = req;
    const sort = { created: -1 };

    const today = new Date();
    const nextSevenDaysDate = new Date(today);
    nextSevenDaysDate.setDate(today.getDate() + Math.max(0, req?.params?.days));

    const planQuery = {
      planName: { $nin: ["Free", "Premium100", "Pro100"] },
      $or: [
        { nextYearStartDate: { $gte: today, $lte: nextSevenDaysDate } },
        { nextMonthStartDate: { $gte: today, $lte: nextSevenDaysDate } },
      ],
    };
    let plans = await findWithFields({
      collection: "activePlan",
      query: planQuery,
      fields: ["shopUrl", "nextMonthStartDate", "nextYearStartDate"],
    });

    let plansUrl = plans?.map((plan) => plan?.shopUrl).filter(Boolean);

    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);

    const userData = (
      await findWithCount(
        "user",
        { shopUrl: { $in: plansUrl }, recurringPlanId: { $nin: ["Free", "Premium100", "Pro100"] } },
        searchQuery,
        skip,
        limit,
        sort
      )
    )[0];

    const filteredPlanLookup = plans?.reduce((acc, plan) => {
      acc[plan?.shopUrl] = { nextRenewalDate: plan?.nextMonthStartDate || plan?.nextYearStartDate };
      return acc;
    }, {});

    const rowData = userData?.rows?.map((user) => {
      return { ...user, ...(filteredPlanLookup[user?.shopUrl] || {}) };
    });

    rcResponse.data = { rows: rowData, count: userData?.count || 0 };
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

const getTrialCancelUser = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query, body } = req;
    const sort = { created: -1 };

    const today = new Date();
    const lastSevenDaysDate = new Date(today);
    lastSevenDaysDate.setDate(today.getDate() - Math.max(0, req?.params?.days));

    const planQuery = {
      $and: [
        { chargeInfo: { $elemMatch: { planName: "Free", startDate: { $gte: lastSevenDaysDate } } } },
        { chargeInfo: { $elemMatch: { planName: { $ne: "Free" } } } },
        { planName: "Free" },
      ],
    };

    let plans = await findWithFields({
      collection: "activePlan",
      query: planQuery,
      fields: ["shopUrl", "chargeInfo"],
    });

    const filteredPlanLookup = plans.reduce((acc, plan) => {
      const lastCharge = plan?.chargeInfo?.[plan?.chargeInfo?.length - 1];
      const lastSecond = plan?.chargeInfo?.[plan?.chargeInfo?.length - 2];
      const planCondition = lastCharge?.planName === "Free" && lastSecond && lastSecond?.planName !== "Free";
      if (lastCharge?.startDate >= lastSevenDaysDate && planCondition) {
        acc[plan.shopUrl] = { planCancelDate: lastCharge?.startDate, lastActivePlan: lastSecond?.planName };
      }
      return acc;
    }, {});

    const shopUrls = Object.keys(filteredPlanLookup);
    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);

    const userData = (
      await findWithCount(
        "user",
        { shopUrl: { $in: shopUrls }, recurringPlanId: "Free" },
        searchQuery,
        skip,
        limit,
        sort
      )
    )[0];

    const rowData = userData?.rows?.map((user) => {
      return { ...user, ...(filteredPlanLookup[user?.shopUrl] || {}) };
    });

    rcResponse.data = { rows: rowData, count: userData?.count || 0 };
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

const premiumUninstall = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query, body } = req;
    const sort = { deleted: -1 };
    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);
    const today = new Date();
    const lastSevenDaysDate = new Date(today);
    lastSevenDaysDate.setDate(today.getDate() - Math.max(0, req?.params?.days));
    const dateQuery = { deleted: { $gte: lastSevenDaysDate }, recurringPlanId: { $ne: "Free" } };
    rcResponse.data = (await findWithCount("deletedUser", dateQuery, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

const postAdvanceFilter = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { query } = req;
    const { howToSearch, searchQuery } = req.body;
    let limit = query.pageSize ? parseInt(query.pageSize) : 10;
    let skip = query.page ? (parseInt(query.page) - 1) * limit : 0;
    let sort = { created: -1 };

    const comparisonOperators = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    let filterConditions;
    if (howToSearch === "Or") {
      const orConditions = searchQuery.map(({ name, text, compareOption, date }) => {
        const filter = {};
        filter[name] = {};

        if (date && !text) {
          filter[name][comparisonOperators[compareOption]] = new Date(date);
        } else {
          if (text === "true" || text === "false") {
            filter[name][comparisonOperators[compareOption]] = text === "true";
          } else if (!isNaN(text)) {
            filter[name][comparisonOperators[compareOption]] = parseFloat(text);
          } else if (new Date(text) !== "Invalid Date" && !isNaN(new Date(text))) {
            filter[name][comparisonOperators[compareOption]] = new Date(text);
          } else {
            filter[name][comparisonOperators[compareOption]] = text;
          }
        }
        return filter;
      });
      filterConditions = { $or: orConditions };
    } else {
      filterConditions = {};
      searchQuery.forEach(({ name, text, compareOption, date }) => {
        const filter = {};
        filter[name] = {};

        if (date && !text) {
          filter[name][comparisonOperators[compareOption]] = new Date(date);
        } else {
          if (text === "true" || text === "false") {
            filter[name][comparisonOperators[compareOption]] = text === "true";
          } else if (!isNaN(text)) {
            filter[name][comparisonOperators[compareOption]] = parseFloat(text);
          } else if (new Date(text) !== "Invalid Date" && !isNaN(new Date(text))) {
            filter[name][comparisonOperators[compareOption]] = new Date(text);
          } else {
            filter[name][comparisonOperators[compareOption]] = text;
          }
        }

        Object.assign(filterConditions, filter);
      });

      rcResponse.data = (await findWithCount("user", {}, filterConditions, skip, limit, sort))[0];
      return res.status(rcResponse.code).send(rcResponse);
    }
  } catch (error) {
    next(error);
  }
};

const postAdvanceFilterDeleteeUser = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { query } = req;
    const { howToSearch, searchQuery } = req.body;
    let limit = query.pageSize ? parseInt(query.pageSize) : 10;
    let skip = query.page ? (parseInt(query.page) - 1) * limit : 0;
    let sort = { created: -1 };
    const comparisonOperators = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    let filterConditions;

    if (howToSearch === "Or") {
      const orConditions = searchQuery.map(({ name, text, compareOption, date }) => {
        const filter = {};
        filter[name] = {};

        if (date && !text) {
          filter[name][comparisonOperators[compareOption]] = new Date(date);
        } else {
          if (text === "true" || text === "false") {
            filter[name][comparisonOperators[compareOption]] = text === "true";
          } else if (!isNaN(text)) {
            filter[name][comparisonOperators[compareOption]] = parseFloat(text);
          } else if (new Date(text) !== "Invalid Date" && !isNaN(new Date(text))) {
            filter[name][comparisonOperators[compareOption]] = new Date(text);
          } else {
            filter[name][comparisonOperators[compareOption]] = text;
          }
        }
        return filter;
      });
      filterConditions = { $or: orConditions };
    } else {
      filterConditions = {};
      searchQuery.forEach(({ name, text, compareOption, date }) => {
        const filter = {};
        filter[name] = {};

        if (date && !text) {
          filter[name][comparisonOperators[compareOption]] = new Date(date);
        } else {
          if (text === "true" || text === "false") {
            filter[name][comparisonOperators[compareOption]] = text === "true";
          } else if (!isNaN(text)) {
            filter[name][comparisonOperators[compareOption]] = parseFloat(text);
          } else if (new Date(text) !== "Invalid Date" && !isNaN(new Date(text))) {
            filter[name][comparisonOperators[compareOption]] = new Date(text);
          } else {
            filter[name][comparisonOperators[compareOption]] = text;
          }
        }

        Object.assign(filterConditions, filter);
      });

      rcResponse.data = (await findWithCount("deletedUser", {}, filterConditions, skip, limit, sort))[0];
      return res.status(rcResponse.code).send(rcResponse);
    }
  } catch (error) {
    next(error);
  }
};
const postdistinctData = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const fieldName = req.body.name;
    const distinctValues = await distinct("user", fieldName);
    rcResponse.data = distinctValues;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

const generateAccessToken = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { query, decoded } = req;
    const encodedData = {
      shopUrl: query.shopUrl,
      adminId: decoded.id,
      role: req.decoded.role,
    };
    const token = await jwt.sign(encodedData, process.env["ADMIN_ACCESS_KEY"]);
    rcResponse.data = { token: token };
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const syncMetafield = async (req, res, next) => {
  let { body } = req;
  try {
    let rcResponse = new ApiResponse();
    const graphqlClient = await clientProvider?.offline?.graphqlClient({
      shop: body.shopUrl,
    });
    await metafield(graphqlClient.client, body.shopUrl);

    let field = await findOne("animation", { shopUrl: body.shopUrl });
    await postData(graphqlClient.client, body.shopUrl, field, "animation");

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getDeletedUsers = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query, body } = req;
    const sort = { deleted: -1 };
    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);
    const urlParamQuery = body?.shopUrl ? { shopUrl: body?.shopUrl } : {};
    rcResponse.data = (await findWithCount("deletedUser", urlParamQuery, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const removePlan = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { body } = req;
    //remove Files
    let findUser = await findOne("user", { storeId: body.storeId });
    if (findUser) {
      await RemoveJsonLDFiles(findUser.shopUrl, findUser.accessToken);
      await update("richSnippet", { shopUrl: findUser.shopUrl }, { status: "deactivated" });

      let planData = {
        recurringPlanName: "Free",
        recurringPlanId: "Free",
        recurringPlanType: "Free",
      };
      await update("user", { shopUrl: findUser.shopUrl }, planData);
      await findOneAndUpdate("activePlan", { shopUrl: findUser.shopUrl }, { planName: "Free", planPrice: 0 });
    }

    rcResponse.data = true;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const addPlan = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();

    let { body } = req;
    let findUser = await findOne("user", { storeId: body.storeId });
    if (findUser) {
      let userData = {
        recurringPlanName: body.addPlanName,
        recurringPlanType: "Paid",
        recurringPlanId: body.addPlanName,
      };
      await findOneAndUpdate("user", { shopUrl: findUser.shopUrl }, userData);

      let activePlanData = {
        planName: body.addPlanName,
        planPrice: body.addPlanPrice,
      };
      await findOneAndUpdate("activePlan", { shopUrl: findUser.shopUrl }, activePlanData);
    }

    rcResponse.data = true;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updatePopupView = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { body } = req;
    rcResponse.data = await findOneAndUpdate("user", { shopUrl: body.shopUrl }, body);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getUsersToExport = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query } = req;
    rcResponse.data = await find("user", {});
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getDeletedUsersToExport = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { query } = req;
    rcResponse.data = await find("deletedUser", {});
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    let admin;
    let rcResponse = new ApiResponse();
    const { decoded } = req;
    if (decoded.role === 1) {
      admin = await findOne("admin", { _id: decoded.adminId });
    }

    const userData = await findOne("user", { _id: decoded.id }, { accessToken: 0 });
    if (admin) {
      rcResponse.data = { ...userData, admin: true };
    } else {
      rcResponse.data = { ...userData };
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const checkToken = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { decoded } = req;
    const user = await findOne(
      "user",
      {
        shopUrl: decoded.shopUrl,
      },
      { accessToken: 0 }
    );
    if (!user) {
      throw SetError({}, 403, "ShopNotExists");
    }
    rcResponse.data = user;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { data, _id } = req?.body;
    if (_id) rcResponse.data = await findOneAndUpdate("user", { _id }, data, { accessToken: 0 });
    !req?.decoded?.adminId && thirdPartyIntegration(rcResponse.data);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const adminRegister = async (req) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.phone || !req.body.type) {
      throw SetError({}, 400, "InvalidParams");
    }

    if (req.body.type === 1 && req.body.adminKey !== process.env["ADMIN_KEY"]) {
      throw SetError({}, 400, "InvalidParams");
    }

    const passHash = await generatePasswordHash(req.body.password);
    let user = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: passHash,
      role: parseInt(req.body.type),
    };

    user = await create("admin", user);
    return true;
  } catch (err) {
    if (err.code === 11000) {
      throw SetError({}, 400, "EmailExists");
    } else {
      throw err;
    }
  }
};

const adminLogin = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    // await adminRegister({
    //   body: {
    //     name: "Sanjay Makasana",
    //     password: "sanjay.143",
    //     email: "makasanas@yahoo.in",
    //     phone: 9724690996,
    //     type: 1,
    //     adminKey:
    //       "OxxGyAfT8UXG4NJbvTqOftCyeGBxH5GvoinSKkvPxSwT5KYrB27OHuNyyWRKljgnvQGLPwD01jRXYPPJoK52YSJ2N4SZD37SY1Gc",
    //   },
    // });

    if (!req.body.email || !req.body.password) {
      throw SetError({}, 403, "InvalidParams");
    }

    if (req.body.adminKey !== process.env["ADMIN_KEY"]) {
      throw SetError({}, 403, "InvalidAdminKey");
    }

    /* Check if email exists */
    const user = await findOne("admin", { email: req.body.email });

    if (user) {
      /* Compare password */
      const comparePasswordResult = await comparePassword(req.body.password, user.password);

      if (comparePasswordResult) {
        /* Password matched */
        const encodedData = {
          id: user._id,
          role: user.role,
        };

        // generate accessToken using JWT
        const token = jwt.sign(encodedData, process.env.ADMIN_SECRET);

        rcResponse.data = { ...user, ...{ token: token } };
      } else {
        throw SetError({}, 403, "InvalidPassword");
      }
    } else {
      throw SetError({}, 403, "UserNotFound");
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { decoded } = req;
    rcResponse.data = await findOne("admin", { _id: decoded.id });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const activePlan = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { body } = req;
    let planData = await findOne("activePlan", {
      shopUrl: body.shopUrl,
    });

    rcResponse.data = updateActivePlan(planData, body);

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateActivePlan = async (plan, body) => {
  try {
    const rcResponse = new ApiResponse();
    var utc = new Date().toJSON().slice(0, 10);
    let data = {
      $set: {
        planName: body.planName,
        planId: plan.planId ? plan.planId : "",
        planPrice: body.planPrice,
        status: plan.status ? plan.status : "active",
        activated_on: new Date(utc),
        currentMonthStartDate: new Date(utc),
        nextMonthStartDate: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
        type: plan.type ? plan.type : "fixed",
        // recurringPlanType: plan.recurringPlanType ? plan.recurringPlanType : "",
        // planMeta:plan.planMeta ? plan.planMeta : "",
        originalPrice: body.planPrice,
        discountedPrice: body.planPrice,
        code: plan.code ? plan.code : null,
        discountValue: plan.discountValue ? plan.discountValue : null,
        interval: plan.interval ? plan.interval : 0,
      },
      $push: {
        chargeInfo: {
          startDate: new Date(utc),
          planName: body.planName,
          planPrice: body.planPrice,
          id: plan.planId ? plan.planId : "",
          originalPrice: body.planPrice,
          discountedPrice: body.planPrice,
          code: plan.code ? plan.code : null,
          discountValue: plan.discountValue ? plan.discountValue : null,
          interval: plan.interval ? plan.interval : 0,
        },
      },
    };

    //update active plan
    let planActive = await findOneAndUpdate("activePlan", { shopUrl: body.shopUrl }, data);
    let user = {
      $set: {
        recurringPlanName: planActive.planName,
        recurringPlanType: "Paid",
        recurringPlanId: planActive.planName,
      },
    };

    rcResponse.data = await findOneAndUpdate("user", { shopUrl: body.shopUrl }, user, { accessToken: 0 });
  } catch (err) {
    throw err;
  }
};

const cancelPlan = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { body } = req;

    let user = await findOne("user", {
      shopUrl: body.shopUrl,
    });

    rcResponse.data = updateFreePlan(user);

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateFreePlan = async (user) => {
  try {
    const rcResponse = new ApiResponse();
    var utc = new Date().toJSON().slice(0, 10);
    let data = {
      $set: {
        planName: "Free",
        planPrice: 0,
        type: "monthly",
        originalPrice: 0,
        discountedPrice: 0,
        code: null,
        discountValue: null,
        interval: 0,
      },
      $push: {
        chargeInfo: {
          startDate: new Date(utc),
          planName: "Free",
          planPrice: 0,
        },
      },
    };

    //update active plan
    await findOneAndUpdate("activePlan", { userId: user._id }, data, {
      accessToken: 0,
    });
    let userPayload = {
      recurringPlanName: "Free",
      recurringPlanType: "Free",
      recurringPlanId: "Free",
    };

    rcResponse.data = await findOneAndUpdate("user", { _id: user._id }, userPayload, { accessToken: 0 });
  } catch (err) {
    throw err;
  }
};

const getDynamicFields = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    rcResponse.data = await getDirectDataFromDb({ ...req?.body });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getAllCollectionName = (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    rcResponse.data = getAllCollectionNames();
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

const syncPlanFromAdmin = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    let { body } = req;

    const restClient = await clientProvider.offline.restClient({ shop: body?.shopUrl });
    const shopifyResponse = await restClient.client.get({ path: `recurring_application_charges.json` });
    rcResponse.data = shopifyResponse?.body?.recurring_application_charges?.find((e) => e?.status === "active");

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const removeWebhook = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { shopUrl } = req.body;
    const graphqlClient = await clientProvider.offline.graphqlClient({ shop: shopUrl });
    let message;

    const getAllWebhook = await graphqlClient.client.query({ data: { query: fetchAllWebhookQuery } });

    const productsCreateWebhook = getAllWebhook?.body?.data?.webhookSubscriptions?.nodes?.find(
      (e) => e?.topic === "PRODUCTS_CREATE"
    );

    if (productsCreateWebhook?.id) {
      await graphqlClient.client.query({
        data: { query: deleteWebhookQuery, variables: { id: productsCreateWebhook?.id } },
      });
      message = "Webhook removed successfully";
    } else {
      message = "Webhook not found or not created so no need to remove";
    }

    rcResponse.data = message;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export {
  generateAccessToken,
  removePlan,
  addPlan,
  updatePopupView,
  getUsersToExport,
  getDeletedUsersToExport,
  checkToken,
  updateUser,
  getUserProfile,
  adminLogin,
  getAdminProfile,
  activePlan,
  cancelPlan,
  syncMetafield,
  postAdvanceFilter,
  postdistinctData,
  postAdvanceFilterDeleteeUser,
  getUsers,
  getDeletedUsers,
  getDynamicFields,
  getAllCollectionName,
  getPremiumTrialUser,
  getTrialCancelUser,
  premiumUninstall,
  getPremiumRenewalUser,
  recentActiveUser,
  syncPlanFromAdmin,
  removeWebhook,
};
