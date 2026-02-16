# Server Architecture Documentation

## Overview
This server provides a comprehensive Express.js backend for a Shopify embedded app with MongoDB persistence, Shopify API integration, webhook handling, and advanced monitoring. The architecture supports both development and production environments with comprehensive error tracking and performance monitoring.

## Server Entry Point

### Main Server (`server/index.js`)
The central server file that orchestrates all components and middleware in the correct order.

#### Server Initialization Sequence
```javascript
// 1. Environment & Setup Validation
setupCheck(); // Validates required environment variables

// 2. Database Connection
if (process.env.CONNECT_LIVE_DATABASE_LOCAL && process.env.ENV === "dev") {
  connectLiveDatabase(); // Live DB tunneling for development
} else {
  mongoose.connect(process.env.MONGO_URL); // Standard connection
}

// 3. Webhook Registration
webhookRegistrar(); // Register all Shopify webhooks

// 4. Express Server Setup with Middleware Stack
```

#### Critical Middleware Stack (Order Matters!)
```javascript
app.use(cors())
app.use(performBackendTask) // Sentry transaction handling
app.use(Sentry.Handlers.requestHandler())

// Webhooks BEFORE JSON parsing (raw body needed)
app.post("/webhooks/:topic", webhookHandler)

app.use(Express.json())
app.use(csp) // Content Security Policy
app.use(isInitialLoad) // Initial load detection

// Main application routes with authentication
app.use("/apps", verifyRequest, userRoutes)

// App proxy routes (store-facing)
app.use("/proxy_route", verifyProxy, proxyRouter)

// GDPR compliance routes
app.use("/api/webhooks", customerDataRequest)
app.use("/api/webhooks", customerRedact)
app.use("/api/webhooks", shopRedact)
```

---

## Database Architecture

### MongoDB Connection Patterns

#### Development Database Options
```javascript
// Option 1: Live database tunneling (for testing with prod data)
if (process.env.CONNECT_LIVE_DATABASE_LOCAL && process.env.ENV === "dev") {
  connectLiveDatabase(); // SSH tunnel to production DB
}

// Option 2: Local development database
else {
  const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/richSnippetDbProd";
  mongoose.connect(mongoUrl);
}
```

#### Database Configuration (`server/config/dbConnection.js`)
```javascript
// Live database connection with SSH tunneling
export const connectLiveDatabase = () => {
  // SSH tunnel setup for secure production DB access during development
  // Enables testing with real production data locally
};
```

### Session Management Integration
```javascript
// MongoDB-based session storage with encryption
import sessionHandler from "../utils/sessionHandler.js";

// Sessions stored in MongoDB with Cryptr encryption
// Supports both online and offline session types
// Automatic cleanup and validation
```

---

## Environment Configuration

### Required Environment Variables
```bash
# Core Shopify Configuration
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_API_SCOPES=read_products,write_products,read_orders
SHOPIFY_API_VERSION=2023-10
SHOPIFY_APP_URL=https://your-app-url.com

# Database
MONGO_URL=mongodb://127.0.0.1:27017/your_db_name

# Security
ENCRYPTION_STRING=your_encryption_key_for_sessions

# Monitoring & Analytics
SENTRY_DSN=your_sentry_dsn
HOTJAR_TRACKING_ID=your_hotjar_id

# Development
NODE_ENV=development|production
ENV=dev|prod
PORT=8081
```

### Environment Validation (`utils/setupCheck.js`)
```javascript
// Validates all required environment variables on startup
// Provides clear error messages for missing configuration
// Ensures app doesn't start with incomplete setup
```

---

## Development vs Production Setup

### Development Mode Features
```javascript
const isDev = process.env.NODE_ENV === "dev";

if (isDev) {
  // Vite development server integration
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  
  app.use(vite.ssrFixStacktrace);
  app.use("*", vite.middlewares);
}
```

### Production Mode Features
```javascript
// Static file serving
app.use(Express.static(path.resolve("dist/client")));

// Compression and optimization
app.use(compression());

// Production error handling
app.use(Sentry.Handlers.errorHandler());
```

### Dual Environment Database Support
```javascript
// Development: Option to connect to live database via SSH tunnel
if (process.env.CONNECT_LIVE_DATABASE_LOCAL && process.env.ENV === "dev") {
  connectLiveDatabase(); // Test with production data locally
}

// Production: Direct MongoDB connection
else {
  mongoose.connect(process.env.MONGO_URL);
}
```

---

## Performance Monitoring & Observability

### Sentry Integration
```javascript
// Transaction tracking for slow requests
const performBackendTask = async (req, res, next) => {
  const transaction = Sentry.getCurrentHub().getScope().getTransaction();
  
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    
    // Track slow requests (>10 seconds)
    if (duration > 10000) {
      transaction.finish();
    }
  });
  
  next();
};
```

### Logger Integration
```javascript
import { logger } from "./backend/services/logger/index.js";

// Comprehensive logging throughout server lifecycle
// Integration with Sentry for error tracking
// Request/response logging with context
```

### Error Handling Pipeline
```javascript
// Centralized error handling
import { handleExpressError } from "./backend/helpers/errorUtils.js";

// Error middleware stack
app.use(Sentry.Handlers.requestHandler());
// ... application routes
app.use(Sentry.Handlers.errorHandler());
app.use(handleExpressError); // Custom error handling
```

---

## Shopify Integration Architecture

### App Bridge Integration
```javascript
import shopify from "../utils/shopify.js";

// Main Shopify API client
// Handles authentication and session management
// REST and GraphQL API access
// Webhook registration and validation
```

### Session Management
```javascript
import sessionHandler from "../utils/sessionHandler.js";

// Encrypted session storage in MongoDB
// Online/offline session support
// Automatic session cleanup
// JWT validation integration
```

### Client Provider Utilities
```javascript
import clientProvider from "../utils/clientProvider.js";

// GraphQL and REST client factory
// Session-based client creation
// Authentication handling
// Error management
```

---

## Route Organization

### Main Route Structure
```javascript
// Primary app routes (authenticated)
app.use("/apps", verifyRequest, userRoutes);

// App proxy routes (public store access)
app.use("/proxy_route", verifyProxy, proxyRouter);

// Webhook routes (Shopify callbacks)
app.post("/webhooks/:topic", webhookHandler);

// GDPR compliance routes
app.use("/api/webhooks", gdprRoutes);
```

### Backend Route System
```javascript
// Located in server/backend/routes/
import userRoutes from "./routes/index.js";

// Includes 14 organized route files:
// - adminRoutes.js
// - pricingRoutes.js  
// - userRoutes.js
// - feedBackRoute.js
// - emailRoutes.js
// - fileUploadRoute.js
// - googleAuthRoute.js
// - etc.
```

---

## Security Implementation

### Content Security Policy
```javascript
import csp from "./middleware/csp.js";

// Shopify-specific CSP headers
// Frame integration security
// XSS and injection protection
```

### HMAC Verification
```javascript
import verifyHmac from "./middleware/verifyHmac.js";

// Shopify webhook HMAC validation
// Request authenticity verification
// Replay attack prevention
```

### Request Verification
```javascript
import verifyRequest from "./middleware/verifyRequest.js";

// Shopify App Bridge authentication
// Session validation
// JWT token verification
```

---

## Server Startup Sequence

### Complete Initialization Flow
```javascript
// 1. Environment validation
setupCheck();

// 2. Database connection
connectDatabase();

// 3. Webhook registration
webhookRegistrar();

// 4. Middleware setup
setupMiddleware();

// 5. Route registration
setupRoutes();

// 6. Error handling
setupErrorHandlers();

// 7. Server start
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
```

### Health Check Endpoints
```javascript
// Basic health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Database health check
app.get("/health/db", async (req, res) => {
  // MongoDB connection status
  // Session storage validation
  // Return detailed health information
});
```

---

## Development Workflow

### Local Development Setup
```bash
# 1. Start MongoDB
mongod --dbpath mongo/

# 2. Install dependencies
npm install --force

# 3. Set environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start development server
npm run dev
```

### Development with Live Database
```bash
# Enable live database connection
CONNECT_LIVE_DATABASE_LOCAL=true npm run dev

# SSH tunnel automatically established
# Test with production data locally
# All changes isolated to local environment
```

### Production Deployment
```bash
# 1. Build client
npm run build

# 2. Set production environment variables
# 3. Start production server
npm run start
```

---

## Performance Considerations

### Server Optimization
- **Middleware Order**: Critical for performance and security
- **Database Connection Pooling**: MongoDB connection optimization
- **Session Management**: Encrypted storage with cleanup
- **Static File Serving**: Optimized for production
- **Compression**: Gzip compression for responses

### Monitoring & Alerting
- **Sentry Performance Tracking**: Request duration monitoring
- **Database Query Monitoring**: Slow query detection
- **Memory Usage Tracking**: Server resource monitoring
- **Error Rate Monitoring**: Real-time error tracking

### Scalability Patterns
- **Session Cleanup**: Automatic session expiration
- **Database Indexing**: Optimized queries
- **Caching Strategies**: Response caching where appropriate
- **Load Balancing Ready**: Stateless session management

This server architecture provides a robust, scalable foundation for Shopify app development with comprehensive monitoring, security, and development workflow support.