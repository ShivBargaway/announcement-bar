import react from "@vitejs/plugin-react";
import "dotenv/config";
import path, { dirname } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    "process.env.VITE_SHOPIFY_API_KEY": JSON.stringify(process.env.VITE_SHOPIFY_API_KEY),
    "process.env.ENV": JSON.stringify(process.env.ENV),
    "process.env.CRISP_WEBSITE_ID": JSON.stringify(process.env.CRISP_WEBSITE_ID),
    "process.env.SENTRY_DNS_WEB": JSON.stringify(process.env.SENTRY_DNS_WEB),
    "process.env.REACT_APP_EXTENSION_UUID_KEY": JSON.stringify(process.env.REACT_APP_EXTENSION_UUID_KEY),
    "process.env.SHOPIFY_APP_URL_FOR_PRICING": JSON.stringify(process.env.SHOPIFY_APP_URL_FOR_PRICING),
    "process.env.REACT_APP_SHOPIFY_APP_STORE_URL": JSON.stringify(process.env.REACT_APP_SHOPIFY_APP_STORE_URL),
    "process.env.REACT_APP_GA_ID": JSON.stringify(process.env.REACT_APP_GA_ID),
    "process.env.SHOPIFY_APP_NAME": JSON.stringify(process.env.SHOPIFY_APP_NAME),
    "process.env.SHOPIFY_STORE_APP_URL": JSON.stringify(process.env.SHOPIFY_STORE_APP_URL),
    "process.env.GOOGLE_FONT_KEY": JSON.stringify(process.env.GOOGLE_FONT_KEY),
    "process.env.SHOPIFY_APP_URL": JSON.stringify(process.env.SHOPIFY_APP_URL),
    "process.env.HOTJAR_TRACKING_ID": JSON.stringify(process.env.HOTJAR_TRACKING_ID),
    "process.env.HOTJAR_VERSION": JSON.stringify(process.env.HOTJAR_VERSION),
    "process.env.CSTOMERLY_WEBSITE_ID": JSON.stringify(process.env.CSTOMERLY_WEBSITE_ID),
    "process.env.CONNECT_LIVE_DATABASE_LOCAL": JSON.stringify(process.env.CONNECT_LIVE_DATABASE_LOCAL),
    "process.env.HIDE_CRISP_LOGO": JSON.stringify(process.env.HIDE_CRISP_LOGO),
    "process.env.PARTNER_ACCOUNT_ID": JSON.stringify(process.env.PARTNER_ACCOUNT_ID),
    appOrigin: JSON.stringify(process.env.SHOPIFY_APP_URL.replace(/https:\/\//, "")),
  },
  plugins: [react(), visualizer()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          shopifyPolaris: ["@shopify/polaris"],
          sentry: ["@sentry/react"],
          lodash: ["lodash"],
        },
      },
    },
    emptyOutDir: true,
    outDir: "../dist/client/",
  },
  root: dirname(fileURLToPath(import.meta.url)),
  resolve: {
    preserveSymlinks: true,
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./") }],
  },
});
