import { logger } from "./../services/logger/index.js";
import { ApiResponse, SetResponse } from "./common.js";

const ErrMessages = {
  ISE: "Internal server error",
  InvalidToken: "Token is not valid",
  InvalidAdminAccessToken: "admin access Token is not valid",
  RequestNotFromShopify: "Request not from shopify",
  ShopNotExists: "Shop not found",
  InvalidParams: "Invalid Params",
  InvalidAdminKey: "Invalid admin key",
  UserNotFound: "User not found",
  InvalidPassword: "Invalid Password",
  EmailExists: "Email already exists",
  NotAdmin: "You are not admin",
  NoImage: "Image not found",
  UpgradePlan: "You need to upgrade plan.",
};

export const handleMutationResponse = (response) => {
  try {
    const data = response?.body?.data;
    let errors = [];

    if (data) {
      for (const mutationResultKey in data) {
        const mutationResult = data[mutationResultKey];
        if (mutationResult?.userErrors && mutationResult?.userErrors?.length > 0) {
          for (const error of mutationResult.userErrors) {
            const field = error.field;
            const message = error.message;
            errors.push(`${message}`);
          }
        }
        if (mutationResult?.mediaUserErrors && mutationResult?.mediaUserErrors?.length > 0) {
          for (const error of mutationResult.mediaUserErrors) {
            const field = error.field;
            const message = error.message;
            errors.push(`${message}`);
          }
        }
      }
      if (errors.length > 0) {
        let error = new Error(errors.join(" | "));
        error.code = 401;
        error.type = "custom";
        throw error;
      } else {
        return response;
      }
    } else {
      throw response;
    }
  } catch (err) {
    throw err;
  }
};

const handleShopifyGraphQLErrors = (errors) => {
  if (!errors || errors.length === 0) {
    return "";
  }
  if (typeof errors === "string") {
    return errors;
  }
  return errors
    .map((error) => {
      if (error.message) {
        return error.message;
      }
      if (error.extensions && error.extensions.cost) {
        return "Query cost exceeds the maximum allowed";
      }
      return "An unknown error occurred";
    })
    .join(", ");
};

const handleDuplicateKeyError = (err, rcResponse) => {
  const field = Object.keys(err.keyValue);
  SetResponse(rcResponse, 409, `An account with that ${field} already exists.`, false);
};

//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, rcResponse) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  if (errors.length > 1) {
    const formattedErrors = errors.join(" ");
    SetResponse(rcResponse, code, formattedErrors, false);
  } else {
    SetResponse(rcResponse, code, errors, false);
  }
};

const handleError = async (req, res, error, rcResponse) => {
  try {
    if (process.env.ENV === "dev") {
      console.log(error);
    }

    // common bulk operation error
    if (error?.type === "commonBulkOperationError") {
      SetResponse(rcResponse, 200, error.message, false);
      return;
    }

    // Store front error
    if (error?.error?.errors) {
      SetResponse(rcResponse, error.statusCode, handleShopifyGraphQLErrors(error?.error?.errors), false);
      return;
    }

    // Google search console error
    if (error?.error?.error) {
      SetResponse(rcResponse, error?.error?.error?.code, error?.error?.error?.message, false);
      return;
    }

    // GraphQLErrors user errrors
    if (error?.userErrors) {
      SetResponse(rcResponse, 400, handleShopifyGraphQLErrors(error?.userErrors), false);
      return;
    }

    // GraphQLErrors
    if (error?.response?.errors) {
      SetResponse(rcResponse, 400, handleShopifyGraphQLErrors(error?.response?.errors), false);
      return;
    }

    // Custom error
    if (error.type && error.type === "custom") {
      if (error.message) {
        SetResponse(rcResponse, error.code, error.message, false);
      } else {
        SetResponse(rcResponse, error.code, ErrMessages[error.message], false);
      }
      return;
    }

    // open ai error
    if (error?.response?.data?.error?.message) {
      SetResponse(rcResponse, error?.response?.status, error?.response?.data?.error?.message, false);
      return;
    }

    // Shopify api error
    if (error.response && error.response.headers && error.response.headers["x-shopify-stage"]) {
      SetResponse(rcResponse, error.statusCode, error.message, false);
      return;
    }

    // mongodb validation error
    if (error.name === "ValidationError") {
      return handleValidationError(error, rcResponse);
    }

    // mongodb duplicate error
    if (error?.message && !(error instanceof Error)) {
      SetResponse(rcResponse, error?.code, error?.message, false);
      return;
    }

    // mongodb duplicate error
    if (error.code && error.code === 11000) {
      return handleDuplicateKeyError(error, rcResponse);
    }

    // other errors
    if (process.env.ENV !== "dev") {
      logger.error(error, {
        extras: {
          body: req.body,
        },
      });
    }

    // Shopify api error
    if (error?.response?.headers?.get("shopify-edge-ip") && error?.message) {
      SetResponse(rcResponse, error?.statusCode || error?.code || 500, error?.message, false);
      return;
    }

    SetResponse(rcResponse, 500, "Something went wrong, please try again", false);
  } catch (error) {
    console.log(error);
    SetResponse(rcResponse, 500, "Something went wrong, please try again", false);
  }
};

export const handleExpressError = async (err, req, res) => {
  try {
    let rcResponse = new ApiResponse();
    await handleError(req, res, err, rcResponse);
    console.log("next response: ");
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    let rcResponse = new ApiResponse();
    await handleError(req, res, err, rcResponse);
    return res.status(rcResponse.code).send(rcResponse);
  }
};
