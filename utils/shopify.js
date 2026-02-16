import { LogSeverity, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import "dotenv/config";

const isDev = process.env.NODE_ENV === "dev";

// Setup Shopify configuration
let shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_API_SCOPES,
  hostName: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  hostScheme: "https",
  apiVersion: process.env.SHOPIFY_API_VERSION,
  isEmbeddedApp: true,
  logger: { level: isDev ? LogSeverity.Info : LogSeverity.Error },
});

export const unStableShopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_API_SCOPES,
  hostName: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  hostScheme: "https",
  apiVersion: "unstable",
  isEmbeddedApp: true,
  logger: { level: isDev ? 3 : 0 }, //Error = 0,Warning = 1,Info = 2,Debug = 3
});

export default shopify;
