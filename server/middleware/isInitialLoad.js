import { RequestedTokenType } from "@shopify/shopify-api";
import freshInstall from "../../utils/freshInstall.js";
import StoreModel from "../../utils/models/StoreModel.js";
import sessionHandler from "../../utils/sessionHandler.js";
import shopify from "../../utils/shopify.js";
import { handleMutationResponse } from "../backend/helpers/errorUtils.js";
import { logger } from "../backend/services/logger/index.js";

const sessionHandlerProcess = async (idToken, shop) => {
  try {
    const [offlineSession, onlineSession] = await Promise.all([
      shopify.auth
        .tokenExchange({
          sessionToken: idToken,
          shop,
          requestedTokenType: RequestedTokenType.OfflineAccessToken,
        })
        .then((response) => response.session),
      shopify.auth
        .tokenExchange({
          sessionToken: idToken,
          shop,
          requestedTokenType: RequestedTokenType.OnlineAccessToken,
        })
        .then((response) => response.session),
    ]);
    await Promise.all([sessionHandler.storeSession(offlineSession), sessionHandler.storeSession(onlineSession)]);
    shopify.webhooks.register({ session: offlineSession });

    return { offlineSession, onlineSession };
  } catch (error) {
    logger.identifyUser({ username: shop });
    logger.error(`Error in sessionHandlerProcess`, { extras: { error } });
    return {};
  }
};

const isInitialLoad = async (req, res, next) => {
  try {
    const shop = req.query.shop;
    const idToken = req.query.id_token;
    const isFreshInstall = await StoreModel.findOne({ shop });

    if (shop && idToken) {
      if (!isFreshInstall || isFreshInstall?.isActive === false) {
        const { onlineSession } = await sessionHandlerProcess(idToken, shop);
        // !isFreshInstall -> New Install
        let client = new shopify.clients.Graphql({ session: onlineSession });
        let restClient = new shopify.clients.Rest({ session: onlineSession });

        req.shopify = {
          restClient: restClient,
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
          session: onlineSession,
        };
        await freshInstall(req, res, onlineSession.shop);
      } else {
        sessionHandlerProcess(idToken, shop);
      }

      // console.dir(webhookRegistrar, { depth: null });
    }
    next();
  } catch (e) {
    next(e);
  }
};

export default isInitialLoad;
