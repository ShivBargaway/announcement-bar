# Middleware Documentation

## Overview
The middleware system provides a comprehensive request processing pipeline with authentication, security, validation, and monitoring capabilities. The middleware stack includes both Express-level middleware and backend-specific middleware for different concerns.

## Middleware Architecture

### Middleware Stack Order (Critical!)
The middleware order in `server/index.js` is crucial for proper functionality:

```javascript
app.use(cors())                           // 1. CORS handling
app.use(performBackendTask)               // 2. Sentry transaction tracking
app.use(Sentry.Handlers.requestHandler()) // 3. Sentry request handling

// 4. Webhooks BEFORE JSON parsing (needs raw body)
app.post("/webhooks/:topic", webhookHandler)

app.use(Express.json())                   // 5. JSON body parsing
app.use(csp)                             // 6. Content Security Policy
app.use(isInitialLoad)                   // 7. Initial load detection

// 8. Authenticated routes with verification
app.use("/apps", verifyRequest, userRoutes)

// 9. App proxy routes with proxy verification  
app.use("/proxy_route", verifyProxy, proxyRouter)
```

---

## Express Middleware

### 1. Content Security Policy (`server/middleware/csp.js`)

**Purpose**: Implements Shopify-specific Content Security Policy headers for embedded app security.

```javascript
// CSP Configuration
const csp = (req, res, next) => {
  // Frame ancestors for Shopify admin embedding
  res.setHeader("Content-Security-Policy", 
    `frame-ancestors https://${req.headers.host} https://admin.shopify.com https://*.myshopify.com;`
  );
  next();
};
```

**Key Features**:
- **Frame Embedding**: Allows embedding in Shopify admin
- **XSS Protection**: Prevents cross-site scripting attacks
- **Injection Prevention**: Blocks malicious code injection
- **Shopify Compliance**: Meets Shopify security requirements

**Usage Pattern**:
```javascript
// Applied globally to all routes
app.use(csp);

// Headers set on every response:
// Content-Security-Policy: frame-ancestors https://admin.shopify.com https://*.myshopify.com;
```

### 2. Request Verification (`server/middleware/verifyRequest.js`)

**Purpose**: Validates Shopify App Bridge authentication and session tokens.

```javascript
// Authentication Flow
const verifyRequest = async (req, res, next) => {
  try {
    // 1. Extract session token from headers
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");
    
    // 2. Validate JWT token
    const payload = validateJWT(token);
    
    // 3. Load session from MongoDB
    const session = await sessionHandler.loadSession(payload.sessionId);
    
    // 4. Verify session validity
    if (session && session.isActive) {
      req.session = session;
      next();
    } else {
      res.status(401).json({ error: "Invalid session" });
    }
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
```

**Authentication Methods**:
- **App Bridge Tokens**: Primary authentication method
- **JWT Validation**: Token signature verification
- **Session Lookup**: MongoDB session validation
- **Admin Tokens**: Special admin authentication
- **Fallback Handling**: Multiple authentication fallbacks

**Error Handling**:
```javascript
// Comprehensive error scenarios
if (!authHeader) return res.status(401).json({ error: "No authorization header" });
if (tokenExpired) return res.status(401).json({ error: "Token expired" });
if (invalidShop) return res.status(401).json({ error: "Invalid shop" });
if (noSession) return res.status(401).json({ error: "Session not found" });
```

### 3. Proxy Verification (`server/middleware/verifyProxy.js`)

**Purpose**: Validates requests coming through Shopify App Proxy from store frontend.

```javascript
// Proxy Request Validation
const verifyProxy = (req, res, next) => {
  try {
    // 1. Extract proxy parameters
    const { shop, signature, timestamp } = req.query;
    
    // 2. Validate HMAC signature
    const isValid = validateHmac(req.query, signature);
    
    // 3. Check timestamp freshness
    const isTimestampValid = validateTimestamp(timestamp);
    
    if (isValid && isTimestampValid) {
      req.shop = shop;
      next();
    } else {
      res.status(401).json({ error: "Invalid proxy request" });
    }
  } catch (error) {
    res.status(401).json({ error: "Proxy verification failed" });
  }
};
```

**Proxy Features**:
- **HMAC Validation**: Cryptographic signature verification
- **Timestamp Validation**: Replay attack prevention
- **Shop Context**: Store identification for proxy requests
- **Public Access**: No authentication required for store-facing content

### 4. HMAC Verification (`server/middleware/verifyHmac.js`)

**Purpose**: Validates HMAC signatures for Shopify webhook and proxy requests.

```javascript
// HMAC Signature Validation
const verifyHmac = (data, signature) => {
  const hmac = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET);
  
  // Build query string from data
  const queryString = Object.keys(data)
    .filter(key => key !== 'signature' && key !== 'hmac')
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&');
    
  hmac.update(queryString);
  const generatedHmac = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(generatedHmac)
  );
};
```

**Security Features**:
- **Timing-Safe Comparison**: Prevents timing attacks
- **Query String Normalization**: Consistent signature generation
- **Secret Key Protection**: Uses Shopify API secret
- **Replay Attack Prevention**: Combined with timestamp validation

### 5. Initial Load Detection (`server/middleware/isInitialLoad.js`)

**Purpose**: Detects and handles initial app loads from Shopify admin with special processing.

```javascript
// Initial Load Detection
const isInitialLoad = (req, res, next) => {
  // 1. Check for Shopify-specific headers
  const isShopifyFrame = req.headers['x-shopify-shop-domain'];
  const isEmbedded = req.headers['x-shopify-embedded'];
  
  // 2. Check for installation parameters
  const hasInstallParams = req.query.shop && req.query.host;
  
  // 3. Detect initial load conditions
  if (isShopifyFrame && hasInstallParams) {
    req.isInitialLoad = true;
    
    // Special handling for initial loads
    if (req.path === '/') {
      // Redirect to installation flow or main app
      return res.redirect(`/auth?shop=${req.query.shop}&host=${req.query.host}`);
    }
  }
  
  next();
};
```

**Initial Load Features**:
- **Installation Detection**: New app installations
- **Embedded Context**: Shopify admin embedding detection
- **Redirect Handling**: Proper routing for initial loads
- **Host Validation**: Shopify host parameter validation

---

## Backend Middleware

### 1. Token Validation (`server/backend/middlewares/checkToken.js`)

**Purpose**: Backend-specific token validation for API endpoints.

```javascript
// API Token Validation
const checkToken = async (req, res, next) => {
  try {
    const token = req.headers['x-api-token'];
    
    if (!token) {
      return res.status(401).json({ error: 'API token required' });
    }
    
    // Validate token format and signature
    const isValid = await validateApiToken(token);
    
    if (isValid) {
      next();
    } else {
      res.status(401).json({ error: 'Invalid API token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Token validation failed' });
  }
};
```

### 2. Cron Middleware (`server/backend/middlewares/cronMiddleware.js`)

**Purpose**: Validates and authorizes cron job execution requests.

```javascript
// Cron Job Authorization
const cronMiddleware = (req, res, next) => {
  // 1. Check for cron-specific headers
  const cronKey = req.headers['x-cron-key'];
  const expectedKey = process.env.CRON_SECRET_KEY;
  
  // 2. Validate cron execution authority
  if (!cronKey || cronKey !== expectedKey) {
    return res.status(403).json({ error: 'Unauthorized cron execution' });
  }
  
  // 3. Add cron context
  req.isCronJob = true;
  req.cronTimestamp = Date.now();
  
  next();
};
```

---

## Middleware Integration Patterns

### Route-Specific Middleware
```javascript
// Different middleware for different route types

// Authenticated app routes
app.use("/apps", verifyRequest, userRoutes);

// Public proxy routes  
app.use("/proxy_route", verifyProxy, proxyRouter);

// Admin-only routes
app.use("/admin", verifyRequest, adminCheck, adminRoutes);

// Cron job routes
app.use("/cron", cronMiddleware, cronRoutes);
```

### Conditional Middleware Application
```javascript
// Apply middleware based on conditions
const conditionalAuth = (req, res, next) => {
  if (req.path.startsWith('/public')) {
    // Skip authentication for public routes
    return next();
  }
  
  if (req.path.startsWith('/admin')) {
    // Enhanced authentication for admin routes
    return verifyRequest(req, res, () => {
      adminCheck(req, res, next);
    });
  }
  
  // Standard authentication
  verifyRequest(req, res, next);
};
```

### Error Handling in Middleware
```javascript
// Middleware with comprehensive error handling
const safeMiddleware = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (error) {
      logger.error('Middleware error', { 
        middleware: middleware.name,
        error: error.message,
        path: req.path 
      });
      
      res.status(500).json({ 
        error: 'Internal server error',
        requestId: req.id 
      });
    }
  };
};

// Usage
app.use('/api', safeMiddleware(verifyRequest));
```

---

## Development Patterns

### Creating Custom Middleware

#### Standard Middleware Pattern
```javascript
// CustomMiddleware.js
const customMiddleware = (options = {}) => {
  return (req, res, next) => {
    try {
      // 1. Pre-processing
      req.customData = processRequest(req, options);
      
      // 2. Validation
      if (!isValid(req.customData)) {
        return res.status(400).json({ error: 'Invalid request' });
      }
      
      // 3. Enhanced request object
      req.enhanced = true;
      
      next();
    } catch (error) {
      next(error); // Pass to error handler
    }
  };
};

export default customMiddleware;
```

#### Async Middleware Pattern
```javascript
// AsyncMiddleware.js
const asyncMiddleware = (asyncFunction) => {
  return (req, res, next) => {
    Promise.resolve(asyncFunction(req, res, next)).catch(next);
  };
};

// Usage
const databaseMiddleware = asyncMiddleware(async (req, res, next) => {
  req.user = await User.findById(req.session.userId);
  next();
});
```

### Middleware Composition
```javascript
// Compose multiple middleware functions
const composeMiddleware = (...middlewares) => {
  return (req, res, next) => {
    const executeMiddleware = (index) => {
      if (index >= middlewares.length) {
        return next();
      }
      
      middlewares[index](req, res, () => executeMiddleware(index + 1));
    };
    
    executeMiddleware(0);
  };
};

// Usage
const authStack = composeMiddleware(
  verifyRequest,
  loadUser,
  checkPermissions
);

app.use('/protected', authStack);
```

---

## Performance Considerations

### Middleware Optimization
- **Early Termination**: Fail fast on invalid requests
- **Caching**: Cache validation results where appropriate  
- **Async Operations**: Use async/await for database operations
- **Memory Management**: Clean up request-specific data

### Security Best Practices
- **Input Validation**: Validate all inputs in middleware
- **Rate Limiting**: Implement request rate limiting
- **CSRF Protection**: Cross-site request forgery prevention
- **Headers Security**: Set security headers consistently

### Error Handling Strategy
- **Consistent Responses**: Standardized error response format
- **Logging**: Comprehensive error logging with context
- **Recovery**: Graceful degradation on middleware failures
- **Monitoring**: Track middleware performance and errors

This middleware system provides a robust, secure, and scalable request processing pipeline that handles authentication, security, and request enhancement throughout the application.