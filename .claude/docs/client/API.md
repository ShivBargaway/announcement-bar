# API Patterns and Backend Structure

## Client-Side API System

### useAuthenticatedFetch Hook
**Location**: `@/Api/Axios`
**Purpose**: Primary authenticated HTTP client for all API communication

#### Complete API Interface
```jsx
import { useAuthenticatedFetch } from "@/Api/Axios";

const fetch = useAuthenticatedFetch();

// GET request
const data = await fetch.get("endpoint", showLoading = true);

// POST request with custom headers  
const result = await fetch.post("endpoint", payload, showLoading = true, customHeaders);

// PUT request
const updated = await fetch.put("endpoint", data, showLoading = true);

// DELETE request
const deleted = await fetch.delete("endpoint", showLoading = true);
```

#### Method Signatures
```jsx
// All methods return Promise<response.data>
get(url: string, showLoading?: boolean): Promise<any>
post(url: string, data: any, showLoading?: boolean, headers?: object): Promise<any>  
put(url: string, data: any, showLoading?: boolean): Promise<any>
delete(url: string, showLoading?: boolean): Promise<any>
```

### Triple Authentication System
The hook automatically handles three distinct authentication contexts:

#### 1. Admin Panel Routes (`/admin/*`, `/public/*`)
```jsx
// Uses adminPanelAccessToken from localStorage
setAdminPanelAuthHeader();
// Sets header: authorization: adminPanelAccessToken
```

#### 2. Admin Routes (with adminAccessToken)
```jsx  
// Uses adminAccessToken from localStorage
setAdminAuthHeader();
// Sets header: authorizationAdmin: adminAccessToken
```

#### 3. Regular App Routes (Shopify App Bridge)
```jsx
// Gets fresh session token from Shopify App Bridge
const accessToken = await getSessionToken(app);
setAuthHeader(accessToken);
// Sets header: authorization: Bearer {sessionToken}
```

### Axios Instance Configuration
```jsx
const instance = axios.create({
  baseURL: "/apps/api/",
  headers: {
    "Content-Type": "application/json"
  }
});
```

### Automatic Features
- **Loading States**: Integrates with `LoadingContext` to show/hide loading indicators
- **Error Handling**: Automatic toast notifications via `ToastContext` 
- **Header Management**: Automatic authentication header injection
- **Response Interceptors**: Global error handling and loading state cleanup
- **Custom Headers**: Support for request-specific headers (especially POST)

### Usage Patterns

#### Basic API Calls
```jsx
const fetch = useAuthenticatedFetch();

// Simple GET with loading
const users = await fetch.get("users");

// POST with data and loading
const newUser = await fetch.post("users", { name: "John", email: "john@example.com" });

// Silent requests (no loading indicator)
const data = await fetch.get("background-task", false);
```

#### File Upload with Custom Headers
```jsx
const formData = new FormData();
formData.append("file", file);

const result = await fetch.post("upload-to-shopify", formData, true, {
  "Content-Type": "multipart/form-data"
});
```

#### Table Data Fetching
```jsx
// CommonTable uses this pattern internally
const tableData = await fetch.post(`${tableUrl}?page=1&pageSize=10`, {
  advanceFilter: filters,
  ...queryParams
});
// Response: { data: { rows: [], count: number } }
```

### Error Handling
```jsx
// Automatic error handling via response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    showToast(handleError(error), true); // Show error toast
    stopLoading(); // Stop loading state
    return Promise.reject(error);
  }
);

// Manual error handling (if needed)
try {
  const data = await fetch.get("risky-endpoint");
} catch (error) {
  // Error already shown via toast, handle specific logic here
  console.log("Additional error handling");
}
```

### Header Management Functions
```jsx
// Manual header setting (rarely needed)
import { setAuthHeader, setAdminAuthHeader, setAdminPanelAuthHeader } from "@/Api/Axios";

setAuthHeader("custom-token");           // Bearer token
setAdminAuthHeader();                    // Admin token from localStorage
setAdminPanelAuthHeader();              // Admin panel token from localStorage
```

### Context Dependencies
```jsx
// Required contexts for useAuthenticatedFetch
const { startLoading, stopLoading } = useContext(LoadingContext);
const { showToast } = useContext(ToastContext);
```

## Backend Route Structure

### Main Route Organization
**File**: `server/routes/index.js`
Routes are organized by feature and combined in the main router:
```javascript
// Main app routes (requires verifyRequest middleware)
app.use("/apps", verifyRequest, userRoutes);

// App proxy routes (requires verifyProxy middleware)
app.use("/proxy_route", verifyProxy, proxyRouter);
```

### Backend Routes Structure
**Location**: `server/backend/routes/`
- `UserRoutes.js` - User management endpoints
- `EmailRoutes.js` - Email service endpoints
- `PricingRoutes.js` - Subscription and billing endpoints
- `AdminRoutes.js` - Admin panel endpoints
- `GoogleAuthRoute.js` - Google services integration
- `FileUploadRoute.js` - File upload endpoints
- `CronRoutes.js` - Cron job management
- `FeedBackRoutes.js` - Feedback collection
- `BackupRoutes.js` - Data backup endpoints

### Common API Endpoints

#### Test Endpoints
```javascript
// GET /apps/api - Basic API test
GET /apps/api
Response: { text: "This is coming from /apps/api route." }

// POST /apps/api - Echo endpoint
POST /apps/api
Body: { any: "data" }
Response: { any: "data" }
```

#### GraphQL Proxy
```javascript
// GET /apps/api/gql - GraphQL query example
GET /apps/api/gql
Response: { shop: { name: "Store Name" } }
```

## Middleware Stack

### Request Processing Order
1. **CORS** - Cross-origin request handling
2. **Sentry Request Handler** - Error tracking initialization
3. **Webhook Handler** - Before JSON parsing for raw webhook data
4. **JSON Parser** - Request body parsing (10mb limit)
5. **CSP** - Content Security Policy
6. **Initial Load Detection** - App initialization tracking
7. **Route-specific Middleware** - Authentication and verification

### Authentication Middleware

#### verifyRequest
**Location**: `server/middleware/verifyRequest.js`
**Purpose**: Main authentication for app routes
- JWT token validation
- Session management (online/offline tokens)
- Shopify API client setup
- Automatic token refresh
- GraphQL and REST client injection

**Skip Conditions**:
- Admin routes (`/admin`)
- Store front routes (`/store-front-brokenlink`)
- Database backup routes (`/dbbackup`)
- Google auth routes (`/google/auth`)
- Cron job routes (`/runLiveCronjob`)
- Feedback routes (`/feed-back`)
- Uninstall routes (`/uninstallToInstallApp`)

#### verifyProxy
**Location**: `server/middleware/verifyProxy.js`
**Purpose**: App proxy route authentication
- HMAC signature verification
- Store-facing content delivery

#### verifyHmac
**Location**: `server/middleware/verifyHmac.js`
**Purpose**: Webhook HMAC verification

## Request/Response Patterns

### Standard API Response Pattern
```javascript
// Success response
{
  success: true,
  data: {...},
  message: "Operation completed"
}

// Error response  
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}
```

### Error Handling
**File**: `server/backend/helpers/errorUtils.js`
- Centralized error processing
- Sentry integration
- User-friendly error messages
- GraphQL mutation response handling

### Loading States
Frontend automatically handles loading states:
```javascript
// Loading starts automatically
const data = await fetch.post("endpoint", payload);
// Loading stops automatically

// Disable loading for silent requests
const data = await fetch.post("endpoint", payload, false);
```

## GraphQL Integration

### GraphQL Client Setup
Injected into request object by verifyRequest middleware:
```javascript
req.shopify = {
  graphqlClient: {
    query: async (query) => {
      const { data } = query;
      const response = await client.request(data?.query, { 
        variables: data?.variables 
      });
      return handleMutationResponse({ body: response });
    }
  },
  restClient: restClient.client,
  shop: shop,
  session: session
};
```

### Usage in Controllers
```javascript
export const someController = async (req, res) => {
  try {
    const { graphqlClient, shop } = req.shopify;
    
    const query = {
      data: {
        query: `query { shop { name } }`,
        variables: {}
      }
    };
    
    const result = await graphqlClient.query(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Session Management

### Session Storage
- MongoDB-based session persistence
- Automatic online/offline token handling
- Session encryption with `ENCRYPTION_STRING`
- Token refresh automation

### Session Utilities
**Location**: `utils/sessionHandler.js`
```javascript
import sessionHandler from "../utils/sessionHandler.js";

// Load session
const session = await sessionHandler.loadSession(sessionId);

// Store session
await sessionHandler.storeSession(session);
```

## Environment-Based Routing

### Development vs Production
- **Development**: Vite middleware integration
- **Production**: Static file serving
- **Admin Routes**: Special handling with token validation

### Route Protection Patterns
```javascript
// Skip authentication for specific routes
const skipRoutes = [
  "/admin",
  "/store-front-brokenlink", 
  "/dbbackup",
  "/google/auth"
];

// Different auth for admin routes
if (req.headers["authorizationadmin"] && !req.headers["authorization"]) {
  return validateAcessToken(req, res, next);
}
```

## API Client Patterns

### REST Client Usage
```javascript
const { restClient } = req.shopify;
const products = await restClient.get({ path: "products" });
```

### GraphQL Client Usage  
```javascript
const { graphqlClient } = req.shopify;
const result = await graphqlClient.query({
  data: {
    query: `mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id title }
      }
    }`,
    variables: { input: productData }
  }
});
```

## Webhook Handling

### Webhook Registration
**Location**: `server/webhooks/_index.js`
- Automatic webhook registration
- GDPR compliance handlers
- App lifecycle event handling

### Webhook Endpoints
- `POST /webhooks/:topic` - General webhook handler
- `POST /gdpr/customers_data_request` - GDPR data request
- `POST /gdpr/customers_redact` - GDPR data deletion
- `POST /gdpr/shop_redact` - GDPR shop deletion

## Performance Considerations

### Request Optimization
- Connection pooling for MongoDB
- Session caching
- Automatic token refresh
- Request timeout handling

### Error Recovery
- Automatic retry for token refresh
- Graceful degradation for offline sessions
- Comprehensive error logging with Sentry