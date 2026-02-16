const setupCheck = () => {
  const {
    SHOPIFY_API_KEY: apiKey,
    SHOPIFY_API_SECRET: apiSecret,
    SHOPIFY_API_SCOPES: apiScopes,
    SHOPIFY_APP_URL: appUrl,
    SHOPIFY_API_VERSION: apiVersion,
    ENCRYPTION_STRING: encString,
    PORT: port,
    NPM_CONFIG_FORCE: forceInstall,
    MONGO_URL: databaseURL,
  } = process.env;

  const envs = [
    "SHOPIFY_API_KEY",
    "SHOPIFY_API_SECRET",
    "SHOPIFY_APP_URL_FOR_PRICING",
    "SHOPIFY_APP_NAME",
    "SHOPIFY_STORE_APP_URL",
    "SHOPIFY_API_SCOPES",
    "SHOPIFY_APP_URL",
    "SHOPIFY_API_VERSION",
    "MONGO_URL",
    "ENCRYPTION_STRING",
    "NPM_CONFIG_FORCE",
    "CRISP_WEBSITE_ID",
    "SENTRY_DNS_WEB",
    "SENTRY_DNS_BACKEND",
    "ENV",
    "ADMIN_ACCESS_KEY",
    "ADMIN_SECRET",
    "ADMIN_KEY",
    "REACT_APP_GA_ID",
    "PRODUCT_COUNT",
    "SLACK_BOT_TOKEN",
    "SLACK_CHANNEL",
    "GOOGLE_FONT_KEY",
  ];

  let errorCount = 0;
  envs.forEach((env) => {
    if (!process.env[env] || process.env[env] === null || process.env[env] === "") {
      console.error("---> " + env + " Key is required. please update env");
      errorCount++;
    }
  });

  if (errorCount) {
    throw new Error("ENV is not perfectly valid");
  }
  if (typeof apiKey === "undefined") {
    console.error("---> API Key is undefined.");
    errorCount++;
  }
  if (typeof apiSecret === "undefined") {
    console.error("---> API Secret is undefined.");
    errorCount++;
  }
  if (typeof apiScopes === "undefined") {
    console.error("---> API Scopes are undefined.");
    errorCount++;
  }
  if (typeof appUrl === "undefined") {
    console.error("---> App URL is undefined.");
    errorCount++;
  } else if (!appUrl.includes("https://")) {
    console.error("---> Please use HTTPS for SHOPIFY_APP_URL.");
  }
  if (typeof apiVersion === "undefined") {
    console.error("---> API Version is undefined.");
    errorCount++;
  }
  if (typeof encString === "undefined") {
    console.error("---> Encryption String is undefined.");
    errorCount++;
  }
  if (typeof port === "undefined") {
    if (process.env.NODE_ENV !== "dev") {
      console.warn("--> Port is undefined. Using 8081");
      errorCount++;
    }
  }

  if (typeof databaseURL === "undefined") {
    console.error("---> Database string is undefined.");
    errorCount++;
  }

  if (!forceInstall) {
    console.error(
      `--> Set NPM_CONFIG_FORCE to true so server uses "npm i --force" and install dependencies successfully`
    );
    errorCount++;
  }

  if (errorCount > 4) {
    console.error(
      "\n\n\n\n--> .env file is either not reachable or not setup properly. Please refer to .env.example file for the setup.\n\n\n\n"
    );
  }

  if (errorCount == 0) {
    console.log("--> Setup checks passed successfully.");
  }
};

export default setupCheck;
