import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

export { ErrorBoundary } from "@sentry/react";

export function createSentryLogger(env) {
  return {
    init() {
      Sentry.init({
        dsn: process.env.SENTRY_DNS_WEB,
        ignoreErrors: [
          /Request failed with status code (403)/, // Ignore specified status codes
          // Add more patterns if needed
        ],
        tracesSampleRate: 1,
        beforeSendTransaction(transaction) {
          const duration = transaction.timestamp * 1000 - transaction.start_timestamp * 1000;
          if (duration < 10000) {
            return null;
          }
          return transaction;
        },
        environment: env,
        enabled: env !== "dev",
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0.05,
        release: "1.0.0",
      });
    },

    configureUser(user) {
      Sentry.configureScope((scope) => {
        scope.setUser(user);
      });
    },

    configureScope(user) {
      Sentry.configureScope((scope) => {
        scope.setTag("shopUrl", user.shopUrl);
        scope.setTag("storeId", user.storeId);
        scope.setTag("storeName", user.storeName);
      });
    },

    log(...args) {
      Sentry.addBreadcrumb({
        level: "log",
        message: args.join(" "),
        data: {
          arguments: args,
        },
      });
    },

    warn(message, { tags, extras } = {}) {
      Sentry.withScope((scope) => {
        if (tags) {
          scope.setTags(tags);
        }

        if (extras) {
          scope.setExtras(extras);
        }
        scope.setLevel("error");

        Sentry.captureMessage(message);
      });
    },

    error(error, { tags, extras } = {}) {
      Sentry.withScope((scope) => {
        if (tags) {
          scope.setTags(tags);
        }

        if (extras) {
          scope.setExtras(extras);
        }
        scope.setLevel("error");
        const capture = typeof error === "string" ? Sentry.captureMessage : Sentry.captureException;

        capture(error);
      });
    },
  };
}
