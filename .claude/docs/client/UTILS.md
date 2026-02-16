# Utility Functions and Helpers

## Client-Side Utilities

### Core Utilities
**Location**: `@/Utils/Index`

#### Data Validation and Processing
```javascript
import { 
  isEmptyArray, 
  isObject, 
  getValueFromNestedObject,
  getTrimmedLowercaseValue,
  parseJSONData
} from "@/Utils/Index";

// Array validation
const isEmpty = isEmptyArray([[], [[]], []]); // true

// Object validation
const isValidObj = isObject({ key: "value" }); // true (excludes arrays and null)

// Nested object access
const value = getValueFromNestedObject(user, "profile.settings.theme");

// String processing
const clean = getTrimmedLowercaseValue("  EXAMPLE TEXT  "); // "example text"

// Safe JSON parsing
const data = parseJSONData(jsonString); // Returns parsed object or original string
```

#### Storage Management
```javascript
import { 
  localStorage,
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  sessionStorage,
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem
} from "@/Utils/Index";

// localStorage helpers (with error handling)
const storage = localStorage(); // Returns window.localStorage or undefined
setLocalStorageItem("key", "value");
const value = getLocalStorageItem("key");
removeLocalStorageItem("key");

// sessionStorage helpers (with JSON parsing)
setSessionStorageItem("data", { complex: "object" }); // Auto-stringified
const data = getSessionStorageItem("data"); // Auto-parsed
removeSessionStorageItem("data");
```

#### Date and Time Utilities
```javascript
import { formatDateTime, formatTimeAgo } from "@/Utils/Index";

// Format date and time
const formatted = formatDateTime("2024-01-01T10:30:00Z");
// Returns: "1/1/2024 at 10:30 AM"

// Relative time formatting (uses date-fns)
const relative = formatTimeAgo("2024-01-01T10:30:00Z");
// Returns: "5 days ago"
```

#### URL and Query Processing
```javascript
import { objectToQueryParams, removeBasePriceURL } from "@/Utils/Index";

// Convert object to query string
const params = objectToQueryParams({
  search: "hello world",
  page: 1,
  active: true
});
// Returns: "?search=hello%20world&page=1&active=true"

// Clean Shopify URLs
const cleanPath = removeBasePriceURL("https://shop.myshopify.com/admin/apps/settings");
// Returns: "/settings"
```

#### Error Handling
```javascript
import { handleError } from "@/Utils/Index";

// Standardized error message extraction
const message = handleError(error);
// Returns user-friendly error message from various error types
```

### Authentication Utilities
```javascript
import { 
  isAdmin, 
  isAdminPanelAccess,
  adminEnvCheck,
  adminEnvAndTeamCheck,
  checkPartenerAcc
} from "@/Utils/Index";

// Admin access checks
const isAdminUser = isAdmin(); // Checks adminAccessToken in localStorage
const hasAdminPanel = isAdminPanelAccess(); // Checks adminPanelAccessToken

// Environment-based admin checks
const canAccessAdmin = adminEnvCheck(); // Admin OR dev environment OR token param
const isTeamMember = adminEnvAndTeamCheck(profileData); // Above + team email check

// Partner account detection
const isPartnerAccount = checkPartenerAcc(profileData); // Partner test account
```

### Dynamic Table Utilities
```javascript
import { getValue } from "@/Utils/Index";

// Dynamic value extraction for table rendering
const cellValue = getValue(rowData, {
  type: "key",        // "key", "boolean", "element", "date", "nestedKey"
  value: "shopUrl"    // Field name or nested path
});

// Nested key access
const nestedValue = getValue(rowData, {
  type: "nestedKey",
  value: "profile.settings.theme" // Dot notation
});

// Date formatting in tables
const dateValue = getValue(rowData, {
  type: "date",
  value: "created" // Auto-formats with formatDateTime
});
```

### Language and Localization
```javascript
import { mergeLanguage } from "@/Utils/Index";

// Deep merge language objects
const finalLanguage = mergeLanguage(modifyData, baseLanguageData);
// Recursively merges language modifications into base language
```

## Slack Integration Utilities

### Notification Helpers
```javascript
import { 
  slackChannelMsg,
  slackChannelMsgForCustomServices,
  slackMessageForPricing
} from "@/Utils/Index";

// Standard slack notification
const message = slackChannelMsg("User Signed Up", profileData);

// Custom services notification
const serviceMsg = slackChannelMsgForCustomServices("Service Requested", profileData);

// Pricing-related notification
const pricingMsg = slackMessageForPricing("Plan Cancelled", profileData);

// All return formatted Slack messages or false for team members
```

### Review Modal Integration
```javascript
import { openReviewModal } from "@/Utils/Index";

// Open review modal and send Slack notification
openReviewModal(profileData, "Review Requested", fetch);
// Opens Shopify App Store review modal + sends Slack message
```

## Advanced Component Utilities

### Form Generation Utilities
**Location**: `client/Utils/Utils.jsx`

#### Dynamic Form Field Creation
```javascript
import { makeCommonFormField } from "@/Utils/Utils";

// Auto-generate form fields from object structure
const user = {
  name: "John",
  email: "john@example.com",
  settings: {
    theme: "dark",
    notifications: true
  },
  tags: ["admin", "premium"]
};

const formFields = makeCommonFormField(user, ["id", "created"]); // Exclude certain fields
// Returns array of CommonForm compatible field configurations
```

#### Data Visualization Components
```javascript
import { ViewCommonField } from "@/Utils/Utils";

// Render complex nested data structures
const DataViewer = ({ userData }) => {
  return (
    <Card>
      <ViewCommonField user={userData} />
    </Card>
  );
};
// Automatically handles arrays, objects, booleans with proper formatting
```

### URL and Navigation Utilities
```javascript
import { handleTab, handleBackPageUrl } from "@/Utils/Utils";

// Auto-handle tab parameter from URL
const MyTabComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Automatically set tab from URL parameter 'tab=1'
  handleTab("tab", setSelectedTab);
  
  return <Tabs tabs={tabs} selected={selectedTab} />;
};

// Handle back page URL parameters
const MyComponent = () => {
  const [backUrl, setBackUrl] = useState("");
  
  // Get back URL from parameter 'back=settings'
  handleBackPageUrl("back", setBackUrl);
  
  return <Button onClick={() => navigate(backUrl)}>Back</Button>;
};
```

### Data Formatting Utilities
```javascript
import { 
  capitalName, 
  extractAMPMTime, 
  formatAIToken,
  makeAdvanceFilterLabel 
} from "@/Utils/Utils";

// Capitalize first letter
const formatted = capitalName("hello world"); // "Hello world"

// Extract AM/PM time from date
const time = extractAMPMTime("2024-01-01T14:30:00Z"); // "2:30 PM"

// Format large numbers for AI tokens
const tokens = formatAIToken(1500000); // "1.5M"
const smallTokens = formatAIToken(1500); // "1.5k"

// Create readable filter labels
const filterLabel = makeAdvanceFilterLabel(
  { operators: "$gt", value: 100 }, 
  "Price"
); // "Price: > 100"
```

## Server-Side Utilities

### Session Management
**Location**: `utils/sessionHandler.js`
```javascript
import sessionHandler from "../utils/sessionHandler.js";

// Load session from MongoDB
const session = await sessionHandler.loadSession(sessionId);

// Store session in MongoDB
await sessionHandler.storeSession(session);
```

### Shopify Integration
**Location**: `utils/shopify.js`
```javascript
import shopify, { unStableShopify } from "../utils/shopify.js";

// Standard Shopify API instance
const shop = await shopify.rest.Shop.all({ session });

// Unstable API version for beta features
const betaData = await unStableShopify.rest.Product.all({ session });
```

### Client Provider
**Location**: `utils/clientProvider.js`
```javascript
import clientProvider from "../../utils/clientProvider.js";

// GraphQL client
const { client } = await clientProvider.graphqlClient({
  req, res, isOnline: true
});

// REST client
const { client: restClient } = await clientProvider.restClient({
  req, res, isOnline: false
});

// Session ID generation
const sessionId = await clientProvider.getSessionId({
  req, res, isOnline: true
});
```

### JWT Validation
**Location**: `utils/validateJWT.js`
```javascript
import validateJWT from "../../utils/validateJWT.js";

// Validate Shopify session token
const payload = validateJWT(token);
// Returns decoded JWT payload or throws error
```

### Setup Validation
**Location**: `utils/setupCheck.js`
```javascript
import setupCheck from "../utils/setupCheck.js";

// Validate environment configuration
setupCheck(); // Runs on server startup
// Checks required environment variables and configurations
```

## Common Usage Patterns

### Form Validation with Table Display
```javascript
// In table configuration
const columns = [
  {
    heading: "Store",
    value: { type: "key", value: "shopUrl" }
  },
  {
    heading: "Created",
    value: { type: "date", value: "created" }
  },
  {
    heading: "Active",
    value: { type: "boolean", value: "isActive" }
  },
  {
    heading: "Settings",
    value: { type: "nestedKey", value: "profile.settings.theme" }
  }
];
```

### Storage Pattern
```javascript
// Component state persistence
useEffect(() => {
  const saved = getSessionStorageItem("componentState");
  if (saved) setState(saved);
}, []);

useEffect(() => {
  setSessionStorageItem("componentState", state);
}, [state]);
```

### Admin Access Control
```javascript
// Conditional rendering based on admin status
{adminEnvAndTeamCheck(profileData) && (
  <AdminOnlyComponent />
)}

// Route protection
if (!adminEnvCheck()) {
  return <NoAccessComponent />;
}
```

### Error Handling Pattern
```javascript
try {
  const result = await fetch.post("endpoint", data);
  setData(result);
} catch (error) {
  const message = handleError(error);
  showToast(message, true); // Error toast
}
```

### Query Parameter Management
```javascript
// Build query parameters
const queryString = objectToQueryParams({
  search: searchTerm,
  page: currentPage,
  limit: pageSize
});

// Navigate with parameters
navigate(`/products${queryString}`);
```

### Time Display Patterns
```javascript
// In table or card components
<Text>Created: {formatDateTime(item.created)}</Text>
<Text>Last seen: {formatTimeAgo(item.lastLogin)}</Text>
```

## Performance Considerations

### Utility Function Optimization
- Most utilities include try-catch for safe execution
- localStorage/sessionStorage helpers handle environments without storage
- JSON parsing utilities safely handle malformed data
- Error handlers provide consistent user experience

### Memory Management
- Utilities are stateless and don't retain references
- Safe object access prevents memory leaks from undefined references
- Proper cleanup in storage removal functions