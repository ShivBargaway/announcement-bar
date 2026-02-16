# Services Documentation

## Overview
The Services layer provides essential functionality for logging, error tracking, monitoring, and external service integrations. All services are organized in the `client/Services/` directory with a focus on reliability and observability.

## Service Architecture

### Service Structure
```
client/Services/
├── Logger/
│   ├── Index.js          // Main logger interface
│   └── Sentry.js         // Sentry error tracking
└── [Additional Services]
```

---

## Logger Service

### Purpose
Centralized logging system with multiple output targets and error tracking integration.

### Location
`client/Services/Logger/Index.js`

### Key Features
- **Console Logging**: Development-friendly console output
- **Sentry Integration**: Automatic error reporting to Sentry
- **Log Levels**: Support for different log levels (error, warn, info, debug)
- **Context Preservation**: Maintains context across async operations
- **Environment Awareness**: Different behavior for dev/prod environments

### Basic Usage
```jsx
import { logger } from "@/Services/Logger/Index";

// Error logging (automatically sent to Sentry)
logger.error("API request failed", { 
  endpoint: "/api/users", 
  statusCode: 500 
});

// Warning logging
logger.warn("Deprecated function used", { 
  function: "oldFunction", 
  replacement: "newFunction" 
});

// Info logging
logger.info("User action completed", { 
  action: "profile_update", 
  userId: "123" 
});

// Debug logging (only in development)
logger.debug("API response", { 
  data: responseData 
});
```

### Advanced Logging Patterns
```jsx
// Contextual logging
logger.withContext({ userId: "123", sessionId: "abc" }).info("User login");

// Error with stack trace
try {
  // risky operation
} catch (error) {
  logger.error("Operation failed", { error, context: additionalData });
}

// Performance logging
const startTime = Date.now();
// ... operation
logger.info("Operation completed", { 
  duration: Date.now() - startTime 
});
```

---

## Sentry Integration

### Purpose
Comprehensive error tracking, performance monitoring, and user session recording.

### Location
`client/Services/Logger/Sentry.js`

### Configuration
```jsx
// Sentry initialization
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  // Additional configuration
});
```

### Key Features
- **Error Tracking**: Automatic error capture and reporting
- **Performance Monitoring**: Transaction and span tracking
- **User Context**: User session and context tracking
- **Release Tracking**: Deploy and version tracking
- **Custom Tags**: Custom categorization and filtering

### Sentry Usage Patterns

#### Error Tracking
```jsx
// Manual error reporting
Sentry.captureException(new Error("Custom error"), {
  tags: {
    section: "checkout",
    feature: "payment"
  },
  extra: {
    orderId: "12345",
    paymentMethod: "stripe"
  }
});

// Message reporting
Sentry.captureMessage("Important event occurred", "info");
```

#### Performance Monitoring
```jsx
// Transaction tracking
const transaction = Sentry.startTransaction({
  name: "API Request",
  op: "http.client"
});

try {
  const result = await fetch("/api/data");
  transaction.setStatus("ok");
  return result;
} catch (error) {
  transaction.setStatus("internal_error");
  throw error;
} finally {
  transaction.finish();
}
```

#### User Context
```jsx
// Set user context
Sentry.setUser({
  id: user.id,
  email: user.email,
  shop: user.shop,
  plan: user.planType
});

// Set custom context
Sentry.setContext("business_context", {
  feature: "seo_audit",
  plan_type: "premium",
  shop_size: "large"
});
```

#### Custom Tags and Filters
```jsx
// Add custom tags
Sentry.setTag("component", "checkout");
Sentry.setTag("user_type", "premium");

// Set extra context
Sentry.setExtra("api_response", apiResponse);
Sentry.setExtra("user_preferences", userPrefs);
```

---

## Service Integration Patterns

### API Integration with Logging
```jsx
// API service with comprehensive logging
import { logger } from "@/Services/Logger/Index";

const apiService = {
  async makeRequest(endpoint, options = {}) {
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    logger.info("API request started", {
      endpoint,
      requestId,
      method: options.method || "GET"
    });

    try {
      const response = await fetch(endpoint, options);
      
      const duration = Date.now() - startTime;
      
      if (!response.ok) {
        logger.error("API request failed", {
          endpoint,
          requestId,
          statusCode: response.status,
          duration
        });
        throw new Error(`API Error: ${response.status}`);
      }

      logger.info("API request successful", {
        endpoint,
        requestId,
        statusCode: response.status,
        duration
      });

      return await response.json();
    } catch (error) {
      logger.error("API request error", {
        endpoint,
        requestId,
        error: error.message,
        duration: Date.now() - startTime
      });
      throw error;
    }
  }
};
```

### Component-Level Error Boundaries
```jsx
// Error boundary with Sentry integration
import { logger } from "@/Services/Logger/Index";

class ServiceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("Component error boundary triggered", {
      error: error.message,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name
    });
  }

  render() {
    if (this.state.hasError) {
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}
```

---

## Performance Monitoring

### Transaction Tracking
```jsx
// Custom transaction wrapper
export const withTransaction = (name, operation) => {
  return async (fn) => {
    const transaction = Sentry.startTransaction({ name, op: operation });
    
    try {
      const result = await fn();
      transaction.setStatus("ok");
      return result;
    } catch (error) {
      transaction.setStatus("internal_error");
      logger.error(`Transaction failed: ${name}`, { error });
      throw error;
    } finally {
      transaction.finish();
    }
  };
};

// Usage
const fetchUserData = withTransaction("fetch_user_data", "db.query")(async () => {
  return await getUserFromApi();
});
```

### Span Tracking
```jsx
// Detailed span tracking
const processData = async (data) => {
  const span = Sentry.getCurrentHub().getScope()?.getTransaction()?.startChild({
    op: "data.processing",
    description: "Process user data"
  });

  try {
    // Processing logic
    const processed = await heavyProcessingFunction(data);
    span?.setStatus("ok");
    return processed;
  } catch (error) {
    span?.setStatus("internal_error");
    throw error;
  } finally {
    span?.finish();
  }
};
```

---

## Development vs Production

### Environment-Specific Configuration
```jsx
// Development configuration
const developmentConfig = {
  logLevel: "debug",
  consoleOutput: true,
  sentryEnabled: false,
  verboseErrors: true
};

// Production configuration
const productionConfig = {
  logLevel: "error",
  consoleOutput: false,
  sentryEnabled: true,
  verboseErrors: false
};

// Service initialization
const logger = new Logger(
  process.env.NODE_ENV === "production" 
    ? productionConfig 
    : developmentConfig
);
```

### Debug Mode
```jsx
// Debug utilities
const debugService = {
  isEnabled: process.env.NODE_ENV === "development",
  
  log: (message, data) => {
    if (debugService.isEnabled) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  
  time: (label) => {
    if (debugService.isEnabled) {
      console.time(label);
    }
  },
  
  timeEnd: (label) => {
    if (debugService.isEnabled) {
      console.timeEnd(label);
    }
  }
};
```

---

## Custom Service Development

### Service Template
```jsx
// CustomService.js
class CustomService {
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
    this.logger = logger.withContext({ service: 'CustomService' });
  }

  async initialize() {
    try {
      // Initialization logic
      this.logger.info("Service initialized successfully");
    } catch (error) {
      this.logger.error("Service initialization failed", { error });
      throw error;
    }
  }

  async performOperation(data) {
    const operationId = generateId();
    
    this.logger.info("Operation started", { operationId, dataSize: data.length });

    try {
      // Service logic here
      const result = await this.processData(data);
      
      this.logger.info("Operation completed successfully", {
        operationId,
        resultSize: result.length
      });

      return result;
    } catch (error) {
      this.logger.error("Operation failed", {
        operationId,
        error: error.message
      });
      throw error;
    }
  }

  async cleanup() {
    this.logger.info("Service cleanup initiated");
    // Cleanup logic
  }
}

export default CustomService;
```

### Service Registration
```jsx
// Services registry
const services = {
  logger,
  customService: new CustomService(),
  // Add more services
};

// Service provider
export const useServices = () => services;

// Individual service hooks
export const useLogger = () => services.logger;
export const useCustomService = () => services.customService;
```

---

## Best Practices

### Logging Best Practices
1. **Structured Logging**: Always use objects for log data
2. **Consistent Context**: Include relevant context in every log
3. **Log Levels**: Use appropriate log levels
4. **Sensitive Data**: Never log sensitive information
5. **Performance**: Log performance metrics for critical operations

### Error Handling Best Practices
1. **Error Context**: Include enough context to debug issues
2. **User-Friendly Messages**: Don't expose internal errors to users
3. **Recovery Strategies**: Implement fallback mechanisms
4. **Rate Limiting**: Avoid spam in error reporting
5. **Error Grouping**: Use consistent error messages for grouping

### Performance Monitoring Best Practices
1. **Transaction Names**: Use consistent, meaningful transaction names
2. **Span Hierarchy**: Create logical span hierarchies
3. **Custom Metrics**: Track business-relevant metrics
4. **Sampling**: Use appropriate sampling rates
5. **Context Tags**: Add relevant tags for filtering and grouping

This service layer provides a robust foundation for observability, error tracking, and service integration throughout the application.