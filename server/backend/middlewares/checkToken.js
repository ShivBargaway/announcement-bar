import jwt from "jsonwebtoken";
import { SetError, UserRoles } from "../helpers/common.js";
import clientProvider from "./../../../utils/clientProvider.js";
import { handleMutationResponse } from "./../helpers/errorUtils.js";
import { logger } from "./../services/logger/index.js";

const validateToken = function (req, res, next) {
  try {
    // next();
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];

    if (token) {
      jwt.verify(token, process.env["ADMIN_SECRET"], function (err, decoded) {
        if (err) {
          throw SetError({}, 403, "InvalidToken");
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      throw SetError({}, 403, "InvalidToken");
    }
  } catch (err) {
    next(err);
  }
};

const validateAcessToken = function async(req, res, next) {
  try {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers["authorizationadmin"];
    if (token) {
      jwt.verify(token, process.env["ADMIN_ACCESS_KEY"], async function (err, decoded) {
        if (err) {
          throw SetError({}, 403, "InvalidAdminAccessToken");
        } else {
          req.decoded = decoded;
          const { client, shop, session } = await clientProvider.graphqlClient({
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
                  const result = await client.query(query);
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
        }
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

// check if the requesting user is Admin user
const isAdminUser = async (req, res, next) => {
  try {
    next();
    // const roles = new UserRoles();
    // if (req.decoded.role !== roles.admin) {
    //   throw SetError({}, 403, "NotAdmin");
    // } else {
    //   next();
    // }
  } catch (err) {
    next(err);
  }
};

export { validateToken, validateAcessToken, isAdminUser };
