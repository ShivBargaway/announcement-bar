import * as Sentry from "@sentry/node";
import Tracing from "@sentry/tracing";

export function createSentryLogger(env) {
  return {
    init() {
      Sentry.init({
        dsn: process.env.SENTRY_DNS_BACKEND,
        environment: env,
        // enabled: env !== "dev",
        enabled: false,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
        ],
        tracesSampleRate: 1,
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
