import { google } from "googleapis";
import request from "request-promise";
import { ApiResponse } from "./../../helpers/common.js";
import { findOne, findOneAndUpdate } from "./../../model/common.js";
import { logger } from "./../../services/logger/index.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_AUTH2_CLIENT_ID,
  process.env.GOOGLE_AUTH2_CLIENT_SECRET,
  process.env.GOOGLE_AUTH2_REDIRECT_URI
);

const getGoogleAuthUrl = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { query } = req;
    let component = query.type;
    const { shop } = req.shopify;

    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      prompt: "consent",
      state: `${shop}&${component}`,
      scope: [
        "https://www.googleapis.com/auth/webmasters",
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/indexing",
      ],
    });

    rcResponse.data = url;

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateUserGoogleAuthTokens = async (tokens, state) => {
  await findOneAndUpdate("user", { shopUrl: state }, { googleAuthTokens: tokens });
};

const checkValidAccessToken = async (user, shop) => {
  try {
    oauth2Client.setCredentials({
      refresh_token: user?.googleAuthTokens?.refresh_token,
    });

    return new Promise((resolve, reject) => {
      oauth2Client.refreshAccessToken(async (err, tokens) => {
        if (err) {
          await updateUserGoogleAuthTokens({}, shop);
          resolve(err);
        } else {
          await updateUserGoogleAuthTokens(tokens, shop);
          resolve(true);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const googleAPIRequest = async (shop, type, url, body, errorIndex = 0) => {
  try {
    const getUser = await findOne("user", { shopUrl: shop });

    if (!getUser) return;
    const isValidAccessToken = await checkValidAccessToken(getUser, shop);
    const token = oauth2Client.credentials.access_token;

    if (!isValidAccessToken) return;
    if (!token) return;
    let options = {
      method: type,
      url,
      json: true,
      resolveWithFullResponse: true,
      body,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    };
    const response = await request(options);
    return response?.body;
  } catch (err) {
    if (errorIndex == 0 && err.statusCode == 500) {
      return await googleAPIRequest(shop, type, url, body, errorIndex + 1);
    } else {
      throw err;
    }
  }
};
const getGoogleAuthCode = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    const storeUrl = state.split(".myshopify.com")[0];
    let shop = state.split("&")[0];
    let component = state.split("&")[1];

    let redirectUrl = `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}/${component}`;

    if (code) {
      oauth2Client.getToken(code, async (err, tokens) => {
        if (err) {
          logger.identifyUser({ username: shop });
          logger.error(err, { extras: { type: "Error in oauth2Client.getToken" } });
          redirectUrl = `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}/${component}?error=true`;
        } else {
          await updateUserGoogleAuthTokens(tokens, shop);
          oauth2Client.setCredentials(tokens);

          await handleGSCCodeRes(shop);
        }
      });
    }
    return res.redirect(redirectUrl);
  } catch (err) {
    logger.error(err, { extras: { type: "Error in getGoogleAuthCode" } });
    next(err);
  }
};

const getValidSite = (googleRes, user) => {
  try {
    let profileDomain = user?.domain;
    if (profileDomain.startsWith("www.")) profileDomain = profileDomain.slice(4);
    const httpsUrl = `https://${user?.domain}`;

    const validSites = googleRes?.siteEntry?.filter((site) => {
      const hasValidProfileDomain = site?.siteUrl?.includes(profileDomain);
      const hasValidPermission = site.permissionLevel === "siteFullUser" || site.permissionLevel === "siteOwner";
      const hasValidSiteUrl = site.siteUrl.startsWith("sc-domain:") || site?.siteUrl?.includes(httpsUrl);

      // Only return true for sites that fulfill all the conditions
      return hasValidProfileDomain && hasValidPermission && hasValidSiteUrl;
    });

    const sortedSites = validSites?.sort((a, b) => {
      if (a.siteUrl.startsWith("sc-domain:")) return -1;
      if (b.siteUrl.startsWith("sc-domain:")) return 1;
      if (a.siteUrl.startsWith("https://")) return -1;
      if (b.siteUrl.startsWith("https://")) return 1;
      return 0; // If none of the conditions match, maintain the original order
    });

    return sortedSites;
  } catch (error) {
    throw error;
  }
};

const handleGSCCodeRes = async (shop) => {
  try {
    const userData = await findOne("user", { shopUrl: shop }, { accessToken: 0 });
    const googleRes = await googleAPIRequest(shop, "GET", "https://www.googleapis.com/webmasters/v3/sites");
    const validSite = getValidSite(googleRes, userData);
    const siteUrl = validSite?.[0]?.siteUrl || validSite?.[1]?.siteUrl;
    await findOneAndUpdate("user", { shopUrl: shop }, { selectedSiteUrl: siteUrl });
  } catch (error) {
    throw error;
  }
};

export { getGoogleAuthUrl, getGoogleAuthCode, checkValidAccessToken, googleAPIRequest };
