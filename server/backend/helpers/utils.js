import bcrypt from "bcrypt";
import moment from "moment";
import request from "request-promise";
import clientProvider from "../../../utils/clientProvider.js";
import { marketsQuery, productcountQuery } from "../graphql/commonQuery.js";
import { count, findOneAndUpdate } from "../model/common.js";
import { logger } from "../services/logger/index.js";

const getNextWeekDate = async (country_code) => {
  try {
    //local in need to add local time diff
    var tz_currentUtcTime = parseInt(moment().startOf("day").utc().format("X"));
    let cnTimeZone = moment.tz.zonesForCountry(country_code, { offset: true })[0].offset * 60;
    let tz_userTime = (14 + 24) * 60 * 60;
    let finalTimeStamp = (parseInt(tz_currentUtcTime) + tz_userTime + cnTimeZone) * 1000;
    return new Date(finalTimeStamp);
  } catch (err) {
    throw err;
  }
};

const handleshopifyRequest = async (type, url, token, body, headers, json = true) => {
  try {
    let options = {
      method: type,
      url,
      json,
      body,
      resolveWithFullResponse: true, //added this to view status code
      headers: {
        "X-Shopify-Access-Token": token,
        "content-type": "application/json",
        ...headers,
        simple: false, // prevents throwing on non-2xx status
      },
    };
    return request(options);
  } catch (err) {
    throw err;
  }
};

const graphQlGetShopifyRequest = async (type, url, token, query, variables) => {
  try {
    let options = {
      method: type,
      url: url,
      body: JSON.stringify({
        query,
        variables: variables,
      }),
      resolveWithFullResponse: true, //added this to view status code
      headers: {
        "X-Shopify-Access-Token": token,
        "content-type": "application/json",
      },
    };
    return request(options);
  } catch (err) {
    throw err;
  }
};

const getGraphqlClient = async (req, res, isOnline) => {
  const { client, shop, session } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline,
  });

  return { client, shop, session };
};

const RemoveJsonLDFiles = async (shopUrl, accessToken) => {
  try {
    let getThemesUrl = "https://" + shopUrl + "/admin/themes.json";
    const response = await this.handleshopifyRequest("get", getThemesUrl, accessToken);
    var newArray = response.body.themes.filter(function (el) {
      return el.role == "main";
    });
    let themeId = newArray[0].id;
    let getThemeurl =
      "https://" +
      shopUrl +
      "/admin/api/2022-10/themes/" +
      themeId +
      "/assets.json?asset[key]=layout/theme.liquid&theme_id=" +
      themeId;

    const themeResponse = await this.handleshopifyRequest("get", getThemeurl, accessToken);
    let themeFile = themeResponse.body;
    if (themeFile.asset.value.indexOf("{% include 'grss-json-ld' %}") != -1) {
      let addedJSONLD = removeRichSnippet(themeFile);
      //Adding New Liquide JSON LD File
      let newData = {
        asset: {
          key: "layout/theme.liquid",
          value: addedJSONLD.asset.value,
        },
      };
      let newUrl = "https://" + shopUrl + "/admin/api/2022-10/themes/" + themeId + "/assets.json";
      const newResponse = await this.handleshopifyRequest("put", newUrl, accessToken, newData);
    }
    let updateData = {
      asset: {
        key: "snippets/grss-json-ld.liquid",
        value: "<!-- SEO, JSON‑LD, Schema -->",
      },
    };
    let updateUrl =
      "https://" +
      shopUrl +
      "/admin/api/2022-10/themes/" +
      themeId +
      "/assets.json?asset[key]=snippets/grss-json-ld.liquid";
    const updateResponse = await this.handleshopifyRequest("delete", updateUrl, accessToken, updateData);
  } catch (err) {
    throw err;
  }
  return true;
};

const generatePasswordHash = async (password) => {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
        } else {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              reject(err);
            } else {
              resolve(hash);
            }
          });
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const comparePassword = async (originalPass, passToMatch) => {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.compare(originalPass, passToMatch, (err, isMatch) => {
        if (err) {
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const updateBarCount = async (shop) => {
  try {
    let Count = await count("annoucement", { shopUrl: shop });
    let user = {
      $set: {
        created_bars: Count,
      },
    };
    await findOneAndUpdate("user", { shopUrl: shop }, user);
  } catch (err) {
    throw err;
  }
};
function timeAgo(date) {
  return moment(date).fromNow();
}

function shouldIgnore(user) {
  const emailDomain = "webrexstudio.com";
  if (user?.email?.includes(emailDomain) || process.env.ENV !== "prod") {
    return true;
  }
  return false;
}

const sleep = async (millis) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

const setAppLanguage = (language) => {
  let data = {
    cs: "cs",
    da: "da",
    de: "de",
    en: "en",
    es: "es",
    fr: "fr",
    hi: "hi",
    it: "it",
    ja: "ja",
    ko: "ko",
    nl: "nl",
    pl: "pl",
    sv: "sv",
    tr: "tr",
    "pt-BR": "pt",
    "pt-PT": "pt",
    "zh-CN": "zh",
    "zh-TW": "zh",
  };
  return data[language] || "en";
};

const regexQuery = (key, value, type) => {
  try {
    if (type === "notregex") return { [key]: { $not: new RegExp(value, "i") } };
    return { [key]: new RegExp(value, "i") };
  } catch (error) {
    return {};
  }
};

const singleQuery = (key, value, type, originalKey, secondQuery = []) => {
  if (type === "number") {
    if (value.operators && value.number) {
      return { [key]: { [value.operators]: parseFloat(value.number) } };
    } else if (!value.operators && !value.number && value) {
      return { [key]: parseFloat(value) };
    }
  } else if (type === "date") {
    if (value.operators && value.date) {
      return { [key]: { [value.operators]: new Date(value.date) } };
    } else if (!value.operators && !value.date && value) {
      return { [key]: new Date(value.date) };
    }
  } else if (type === "string") {
    if (value.operators && value.string) {
      if (value.operators?.includes("regex")) return regexQuery(key, value.string, value.operators);
      return { [key]: { [value.operators]: value.string } };
    } else if (!value.operators && !value.string && value) {
      return { [key]: parseFloat(value) };
    }
  } else if (type === "array") {
    const firstValue = value[0];
    if (value.length === 1 && typeof firstValue === "boolean" && !firstValue) {
      return { $or: [{ [key]: { $in: value } }, { [key]: { $exists: false } }] };
    } else return { [key]: { $in: value } };
  } else if (type === "searchQuery") {
    return regexQuery(key, value);
  } else if (type === "arrayLength") {
    return { $expr: { [value.operators]: [{ $size: [{ $ifNull: [key, []] }] }, parseInt(value.number)] } };
  } else if (type === "elementMatch") {
    const dynamicKey = Object.keys(value)[0];
    return { [key]: { $elemMatch: { [dynamicKey]: value[dynamicKey] } } };
  } else if (type === "arrayElementMatch") {
    return { [key]: { $elemMatch: { [originalKey]: { $in: value } } } };
  } else if (type === "channelFilterArray") {
    return { "shopifyData.resourcePublications.nodes": { $elemMatch: { "publication.name": { $in: value } } } };
  } else if (type === "severityElementMatch") {
    return {
      [key]: {
        $elemMatch: { items: { $elemMatch: { issues: { $elemMatch: { [originalKey]: { $in: value } } } } } },
      },
    };
  } else if (type === "metaOtherImageAlt") {
    if (value[0]) {
      return {
        $and: [{ [key]: { $exists: true } }, { [key]: { $ne: null } }, { [key]: { $ne: "" } }],
      };
    } else {
      return {
        $or: [{ [key]: { $exists: false } }, { [key]: null }, { [key]: "" }],
      };
    }
  } else if (secondQuery?.length > 0) {
    return { $and: [{ [key]: value }, ...secondQuery] };
  } else if (type === "checkTrueInObject") {
    return { $and: value?.map((e) => ({ [`${key}.${e}`]: true })) };
  } else {
    if (typeof value === "boolean" && !value) {
      return { $or: [{ [key]: value }, { [key]: { $exists: false } }] };
    } else return { [key]: value };
  }
};

const commonFilterQuery = (filters = []) => {
  try {
    const queryArray = [];

    for (let filter of filters) {
      const { key, value, type, nestedKey = key, secondQuery } = filter;
      if (Array.isArray(nestedKey)) {
        const searchQueryArray = nestedKey.map((e) => singleQuery(e, value, type, key, secondQuery));
        queryArray.push({ $or: searchQueryArray });
      } else {
        if (singleQuery(nestedKey, value, type, key, secondQuery)) {
          queryArray.push(singleQuery(nestedKey, value, type, key, secondQuery));
        }
      }
    }

    return queryArray.length > 0 ? { $and: queryArray } : {};
  } catch (err) {
    throw err;
  }
};

const makePaginationQuery = (query) => {
  try {
    const limit = parseInt(query?.pageSize) || 10;
    const skip = query?.skip || (parseInt(query?.page) - 1) * limit || 0;
    const sort = query?.sort || { createdAt: -1 };
    return { limit, skip, sort };
  } catch (err) {
    throw err;
  }
};

const adminEnvCheck = (user) => {
  try {
    // if (process.env.ENV !== "prod" || user?.email?.includes("webrexstudio.com")) {
    if (process.env.ENV !== "prod") {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Function to calculate the wait time in milliseconds based on currentlyAvailable, requestedQueryCost, and restoreRate
const calculateWaitTime = async (currentlyAvailable, requestedQueryCost, restoreRate) => {
  try {
    const deficit = requestedQueryCost - currentlyAvailable;
    const waitSeconds = deficit / restoreRate;
    const waitTime = waitSeconds * 1000; // Convert to milliseconds
    return waitTime;
  } catch (err) {
    throw err;
  }
};

const canProceedWithQuery = async (response) => {
  try {
    const { requestedQueryCost } = response.body.extensions.cost;
    const { currentlyAvailable } = response.body.extensions.cost.throttleStatus;
    return currentlyAvailable >= requestedQueryCost;
  } catch (err) {
    throw err;
  }
};

const handleQueryCost = async (response) => {
  try {
    if (await canProceedWithQuery(response)) {
      // Proceed with the next query
      return true;
    } else {
      const { requestedQueryCost } = response.body.extensions.cost;
      const { currentlyAvailable, restoreRate } = response.body.extensions.cost.throttleStatus;
      const waitTime = await calculateWaitTime(currentlyAvailable, requestedQueryCost, restoreRate);

      setTimeout(() => {
        return true;
      }, waitTime + 1000);
    }
  } catch (err) {
    throw err;
  }
};

const getMarkets = async (graphqlClient) => {
  try {
    const pageSize = 2;
    let hasNextPage = true;
    let after = null;
    let finalData = [];

    while (hasNextPage) {
      const response = await graphqlClient.query({
        data: {
          query: marketsQuery,
          variables: {
            first: pageSize,
            after,
          },
        },
      });

      const { markets } = response.body.data;
      const newData = markets.nodes;

      finalData = finalData.concat(
        newData.map((row) => ({
          name: row.name,
          country: row?.regions?.nodes?.length || 0,
        }))
      );

      hasNextPage = markets.pageInfo.hasNextPage;
      after = markets.pageInfo.endCursor;

      await handleQueryCost(response);
    }

    return finalData;
  } catch (err) {
    return [];
  }
};

const getProductcount = async (graphqlClient) => {
  const shopifyRes = await graphqlClient.query({
    data: { query: productcountQuery },
  });
  return Number(shopifyRes?.body?.data?.productsCount?.count || 0);
};

const shopifyPlanPriority = {
  Cancelled: 0,
  Custom: 0,
  "Developer Preview": 0,
  Development: 0,
  "Extended Trial": 0,
  Frozen: 0,
  "Open Learning": 0,
  "Pause and Build": 0,
  Retail: 0,
  "Sales Training": 0,
  Staff: 0,
  "Staff Business": 0,
  Trial: 0,
  cancelled: 0,
  frozen: 0,
  staff: 0,
  staff_business: 0,
  trial: 0,
  "NPO Full": 0,
  "NPO Lite": 0,

  Basic: 16,
  "Basic Shopify": 16.66,

  Shopify: 33.33,
  Grow: 33.33,
  "Shopify Alumni": 33.33,
  "Shopify Starter": 33.33,

  Advanced: 66.67,
  "Advanced Shopify": 66.67,

  "Shopify Plus": 100,
  "Plus Trial": 100,
};

const calculateShopAge = (user, totalScore) => {
  let score = 0;
  if (user?.created_at) {
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

    if (daysSinceCreation > 365) score = 100;
    else if (daysSinceCreation > 180) score = 50;
    else if (daysSinceCreation > 30) score = 20;
    else if (daysSinceCreation <= 30) score = 10;
  }
  const finalScore = (totalScore * score) / 100;
  return !isNaN(finalScore) ? finalScore : 0;
};

const calculateShopifyPlan = (user, totalScore) => {
  let score = shopifyPlanPriority[user?.plan_display_name] || 0;

  const finalScore = (totalScore * score) / 100;
  return !isNaN(finalScore) ? finalScore : 0;
};

const calculateProductCount = (user, totalScore) => {
  let score = 0;

  if (user?.productCount) {
    if (user.productCount >= 1000) score += 100;
    else if (user.productCount >= 500) score += 70;
    else if (user.productCount >= 100) score += 40;
    else if (user.productCount >= 50) score += 10;
  }

  const finalScore = (totalScore * score) / 100;
  return !isNaN(finalScore) ? finalScore : 0;
};

const nativeEnglishCountry = ["US", "GB", "CA", "AU", "NZ", "IE"];

export const calculateIdealCustomerRate = (user) => {
  try {
    let score = 0;
    const totalRate = {
      createdAt: 35,
      installedByOwner: 10,
      shopifyPlan: 30,
      productCount: 20,
      countryCode: 5,
    };

    score += calculateShopAge(user, totalRate?.createdAt);

    if (user?.associated_user?.account_owner) score += totalRate?.installedByOwner;

    score += calculateShopifyPlan(user, totalRate?.shopifyPlan);

    score += calculateProductCount(user, totalRate?.productCount);

    if (nativeEnglishCountry?.includes(user?.country_code)) score += totalRate?.countryCode;

    return Math.round(score);
  } catch (error) {
    logger.error(`Error in calculateIdealCustomerRate -02/01/25`, {
      extras: { error, user },
    });
    return 0;
  }
};

export {
  shouldIgnore,
  timeAgo,
  getNextWeekDate,
  handleshopifyRequest,
  graphQlGetShopifyRequest,
  getGraphqlClient,
  RemoveJsonLDFiles,
  generatePasswordHash,
  comparePassword,
  updateBarCount,
  handleQueryCost,
  sleep,
  setAppLanguage,
  commonFilterQuery,
  makePaginationQuery,
  adminEnvCheck,
  getMarkets,
  getProductcount,
};
