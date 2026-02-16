import { RequestedTokenType, Session } from "@shopify/shopify-api";
import sessionHandler from "../../utils/sessionHandler.js";
import shopify from "../../utils/shopify.js";
import validateJWT from "../../utils/validateJWT.js";
import clientProvider from "./../../utils/clientProvider.js";
import { handleMutationResponse } from "./../backend/helpers/errorUtils.js";
import { validateAcessToken } from "./../backend/middlewares/checkToken.js";
import { logger } from "./../backend/services/logger/index.js";

const verifyRequest = async (req, res, next) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    if (
      fullUrl.includes("admin") ||
      fullUrl.includes("animation-front") ||
      fullUrl.includes("dbbackup") ||
      fullUrl.includes("google/auth") ||
      fullUrl.includes("runLiveCronjob") ||
      fullUrl.includes("admin/updateUser") ||
      fullUrl.includes("submitContact") ||
      fullUrl.includes("addClick") ||
      fullUrl.includes("onShow") ||
      fullUrl.includes("feed-back") ||
      fullUrl.includes("uninstallToInstallApp")
    ) {
      return next();
    }

    if (req.headers["authorizationadmin"] && !req.headers["authorization"]) {
      return validateAcessToken(req, res, next);
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw Error("No authorization header found");
    }

    const payload = validateJWT(authHeader.split(" ")[1]);

    let shop = shopify.utils.sanitizeShop(payload.dest.replace("https://", ""));

    if (!shop) {
      throw Error("No shop found, not a valid request");
    }

    const sessionId = await clientProvider.getSessionId({ req, res, isOnline: true, showLogger: true });

    let session = await sessionHandler.loadSession(sessionId);
    if (!session) {
      session = await getSession({ shop, authHeader });
    }

    // if (new Date(session?.expires) > new Date() && shopify.config.scopes.equals(session?.scope)) {
    if (new Date(session?.expires) > new Date()) {
    } else {
      session = await getSession({ shop, authHeader });
    }
    res.locals.user_session = session;

    const { client } = await clientProvider.graphqlClient({
      req,
      res,
      isOnline: true,
    });
    const restClient = await clientProvider.restClient({
      req,
      res,
      isOnline: true,
    });

    req.shopify = {
      restClient: restClient.client,
      graphqlClient: {
        query: async (query) => {
          try {
            const { data } = query;
            const response = await client.request(data?.query, { variables: data?.variables });
            const result = { body: response };
            return handleMutationResponse(result);
          } catch (err) {
            throw err;
          }
        },
      },
      shop,
      session,
    };
    logger.identifyUser({ username: shop });

    next();
  } catch (error) {
    next(error);
    // console.error(
    //   `---> An error happened at verifyRequest middleware: ${e.message}`
    // );
    // return res.status(401).send({ error: "Unauthorized call" });
  }
};

export default verifyRequest;

/**
 * Retrieves and stores session information based on the provided authentication header and offline flag.
 * If the `offline` flag is true, it will also attempt to exchange the token for an offline session token.
 * Errors during the process are logged to the console.
 *
 * @async
 * @function getSession
 * @param {Object} params - The function parameters.
 * @param {string} params.shop - The xxx.myshopify.com url of the requesting store.
 * @param {string} params.authHeader - The authorization header containing the session token.
 * @returns {Promise<Session>} The online session object
 */

async function getSession({ shop, authHeader }) {
  try {
    const sessionToken = authHeader.split(" ")[1];

    const { session: onlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    await sessionHandler.storeSession(onlineSession);

    const { session: offlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });

    await sessionHandler.storeSession(offlineSession);

    return new Session(onlineSession);
  } catch (e) {
    console.error(`---> Error happened while pulling session from Shopify: ${e.message}`);
  }
}
