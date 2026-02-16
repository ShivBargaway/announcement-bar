import { handleMutationResponse } from "../server/backend/helpers/errorUtils.js";
import { findOne } from "./../server/backend/model/common.js";
import { logger } from "./../server/backend/services/logger/index.js";
import sessionHandler from "./sessionHandler.js";
import shopify, { unStableShopify } from "./shopify.js";
import validateJWT from "./validateJWT.js";

const currentApiVersion = process.env.SHOPIFY_API_VERSION;

const getSessionId = async ({ req, res, isOnline, showLogger }) => {
  let sessionId;
  try {
    sessionId = await shopify.session.getCurrentId({
      isOnline: isOnline,
      rawRequest: req,
      rawResponse: res,
    });
  } catch (error) {
    try {
      if (error?.message?.includes("Failed to parse session token")) {
        const authBearer = req?.headers?.authorization?.match(/Bearer (.*)/);
        const payload = validateJWT(authBearer[1]);
        const shopUrl = payload?.dest?.split("https://")[1];
        sessionId = `${shopUrl}_${payload?.sub}`;
        if (!payload || !payload?.sub || !payload?.dest) {
          throw error;
        }
        const expiryTime = new Date(payload?.exp * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const currentTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        if (showLogger) {
          logger.identifyUser({ username: shopUrl });
          logger.error(error, { extras: { payload, expiryTime, currentTime } });
        }
      } else {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
  return sessionId;
};

const fetchSession = async ({ req, res, isOnline }) => {
  //false for offline session, true for online session
  const sessionId = await getSessionId({ req, res, isOnline, showLogger: false });
  const session = await sessionHandler.loadSession(sessionId);
  return session;
};

const graphqlClient = async ({ req, res, isOnline }) => {
  try {
    if (req.headers["authorizationadmin"] && req.decoded.shopUrl) {
      return offline.graphqlClient({ shop: req.decoded.shopUrl });
    }
    const session = await fetchSession({ req, res, isOnline });
    const client = new shopify.clients.Graphql({ session });
    const { shop } = session;
    return { client, shop, session };
  } catch (err) {
    logger.error(err, {
      extras: {
        type: "online.clients.Graphql",
      },
    });
    throw err;
  }
};

const restClient = async ({ req, res, isOnline }) => {
  try {
    if (req.headers["authorizationadmin"] && req.decoded.shopUrl) {
      return offline.restClient({ shop: req.decoded.shopUrl });
    }
    const session = await fetchSession({ req, res, isOnline });
    const client = new shopify.clients.Rest({
      session,
      apiVersion: currentApiVersion,
    });
    const { shop } = session;
    return { client, shop, session };
  } catch (err) {
    logger.error(err, {
      extras: {
        type: "online.clients.Rest",
      },
    });
    throw err;
  }
};

const fetchOfflineSession = async (shop) => {
  try {
    const sessionID = shopify.session.getOfflineId(shop);
    let session = await sessionHandler.loadSession(sessionID);
    if (!session) {
      console.log("fetchOfflineSession get faild shop", shop);
      const user = await findOne("user", { shopUrl: shop });
      session = {
        id: sessionID,
        shop: shop,
        isOnline: false,
        accessToken: user.accessToken,
        scope: user.scope,
      };
      await sessionHandler.storeSession(session);
    }
    return session;
  } catch (error) {
    throw error;
  }
};

const fetchOnlineSession = async (shop) => {
  let session = await sessionHandler.loadOnlineSession(shop);
  return session;
};

const offline = {
  graphqlClient: async ({ shop, byPass = false, type }) => {
    try {
      const session = await fetchOfflineSession(shop);
      let clientGraphql = new shopify.clients.Graphql({ session });
      if (type === "unstable") clientGraphql = new unStableShopify.clients.Graphql({ session });
      const client = {
        query: async (query) => {
          try {
            const { data } = query;
            const response = await clientGraphql.request(data?.query, { variables: data?.variables });
            const result = { body: response };
            if (byPass) {
              return result;
            } else {
              return handleMutationResponse(result);
            }
          } catch (err) {
            throw err;
          }
        },
      };
      return { client, shop, session };
    } catch (err) {
      logger.identifyUser({ username: shop });
      logger.error(err, {
        extras: {
          type: "offline.clients.Graphql",
        },
      });
      throw err;
    }
  },
  restClient: async ({ shop }) => {
    try {
      const session = await fetchOfflineSession(shop);
      const client = new shopify.clients.Rest({
        session,
        apiVersion: currentApiVersion,
      });
      return { client, shop, session };
    } catch (err) {
      logger.identifyUser({ username: shop });
      logger.error(err, {
        extras: {
          type: "offline.clients.Rest",
        },
      });
      throw err;
    }
  },
};

const online = {
  graphqlClient: async ({ shop }) => {
    try {
      const session = await fetchOnlineSession(shop);
      const client = new shopify.clients.Graphql({ session });
      return { client, shop, session };
    } catch (err) {
      logger.identifyUser({ username: shop });
      logger.error(err, {
        extras: {
          type: "online.clients.Graphql",
        },
      });
      throw err;
    }
  },
  restClient: async ({ shop }) => {
    try {
      const session = await fetchOnlineSession(shop);
      const client = new shopify.clients.Rest({
        session,
        apiVersion: currentApiVersion,
      });
      return { client, shop, session };
    } catch (err) {
      logger.identifyUser({ username: shop });
      logger.error(err, {
        extras: {
          type: "online.clients.Rest",
        },
      });
      throw err;
    }
  },
};

const clientProvider = { graphqlClient, restClient, offline, online, getSessionId };

export default clientProvider;
