import merge from "lodash/merge.js";
import { createSentryLogger } from "./sentry.js";

function createLogger(env, loggerPayload = {}) {
  const sentryLogger = createSentryLogger(env);
  let isInitialized = false;

  function reportError(error, payload) {
    sentryLogger.error(error, {
      ...payload,
      tags: {
        ...payload.tags,
        namespace: payload.namespace,
      },
    });
  }

  function logError(error, { namespace, extras, tags }) {
    const args = [namespace, error, extras && { extras }, tags && { tags }].filter(Boolean);
    console.error("logger:", ...args);
  }

  function reportInfo(...args) {
    sentryLogger.log(...args);
  }

  function logInfo(...args) {
    console.log("logger:", ...args);
  }

  function reportWarn(message, payload) {
    sentryLogger.warn(message, {
      ...payload,
      tags: {
        ...payload.tags,
        namespace: payload.namespace,
      },
    });
  }

  function logWarn(...args) {
    console.warn("logger:", ...args);
  }

  return {
    init() {
      sentryLogger.init({});
      isInitialized = true;
    },

    spawn(payload = {}) {
      return createLogger(env, merge({}, loggerPayload, payload));
    },

    identifyUser(user) {
      if (!user || !isInitialized) return;

      sentryLogger.configureUser(user);
    },

    identifyUserScope(user) {
      if (!user || !isInitialized) return;
      sentryLogger.configureScope(user);
    },

    log(...args) {
      const logArgs = [loggerPayload.namespace, ...args].filter(Boolean);

      switch (env) {
        case "prod":
          reportInfo(...logArgs);
          break;
        case "stg":
          logInfo(...logArgs);
          break;
        case "dev":
          logInfo(...logArgs);
          break;
      }
    },

    warn(message, payload = {}) {
      const decoratedPayload = merge({}, loggerPayload, payload);

      switch (env) {
        case "prod":
          reportWarn(message, payload);
          break;
        case "stg":
          reportWarn(message, payload);
          logWarn(message, decoratedPayload);
          break;
        case "dev":
          logWarn(message, decoratedPayload);
          break;
      }
    },

    error(error, payload = {}) {
      const decoratedPayload = merge({}, loggerPayload, payload);
      switch (env) {
        case "prod":
          reportError(error, decoratedPayload);
          break;
        case "stg":
          reportError(error, decoratedPayload);
          logError(error, decoratedPayload);
          break;
        case "dev":
          logError(error, decoratedPayload);
          break;
      }
    },
  };
}

export const logger = createLogger(process.env.ENV);
