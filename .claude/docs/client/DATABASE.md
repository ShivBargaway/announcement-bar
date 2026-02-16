# Database Patterns and Models

## Database Architecture

### Technology Stack
- **MongoDB** with **Mongoose ODM**
- **Connection Management**: Auto-reconnection and pooling
- **Environment Support**: Local development + live database tunneling
- **Encryption**: Session data encryption with `ENCRYPTION_STRING`

### Connection Patterns

#### Standard Connection
```javascript
// Local development
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/richSnippetDbProd";
mongoose.connect(mongoUrl);
```

#### Live Database Tunneling
**Location**: `server/config/dbConnection.js`
For accessing production data during development:
```javascript
import { connectLiveDatabase } from "./config/dbConnection.js";

// Connects via SSH tunnel to production database
if (process.env.CONNECT_LIVE_DATABASE_LOCAL && process.env.ENV === "dev") {
  connectLiveDatabase();
}
```

## Common Model Interface

### Central Model Management
**Location**: `server/backend/model/common.js`
All database operations go through a unified interface:

```javascript
import { findOne, create, find, findOneAndUpdate } from "../model/common.js";

// Find single document
const user = await findOne("user", { shopUrl: "store.myshopify.com" });

// Create new document
const newUser = await create("user", userData);

// Find multiple with pagination
const users = await find("user", query, sort, limit, skip);

// Upsert operation
const updatedUser = await findOneAndUpdate("user", query, updateData);
```

### Available Models
```javascript
const models = {
  user,           // Main user/store data
  deletedUser,    // Deleted user archive
  activePlan,     // Subscription plans
  admin,          // Admin users
  onboarding,     // Onboarding progress
  dismissProperty,// Dismissible UI elements
  webVital,       // Performance metrics
  allVideoLink,   // Video resources
  feedBack,       // User feedback
  discountCode    // Discount codes
};
```

## Core Database Operations

### Basic CRUD Operations
```javascript
// CREATE
const result = await create("user", {
  shopUrl: "store.myshopify.com",
  email: "admin@store.com",
  accessToken: "token"
});

// READ - Single document
const user = await findOne("user", { shopUrl: "store.myshopify.com" });

// READ - Multiple documents with filters
const users = await find("user", 
  { role: 2 },        // query
  { created: -1 },    // sort
  10,                 // limit
  0                   // skip
);

// UPDATE - Upsert pattern
const updated = await findOneAndUpdate("user", 
  { shopUrl: "store.myshopify.com" },  // query
  { $set: { lastLogin: new Date() } }, // update
  { new: true, upsert: true }          // options
);

// DELETE
await deleteOne("user", { shopUrl: "store.myshopify.com" });
await deleteMany("user", { role: 3 });
```

### Advanced Query Operations
```javascript
// Aggregation with pagination and count
const result = await findWithCount(
  "user",                           // collection
  { role: 2 },                     // user query
  { created: { $gte: startDate } }, // additional query
  0,                               // skip
  20,                              // limit
  { created: -1 }                  // sort
);
// Returns: { rows: [...], count: total }

// Field-specific queries
const users = await findWithFields({
  collection: "user",
  query: { role: 2 },
  sort: { created: -1 },
  limit: 10,
  skip: 0,
  fields: "shopUrl email created" // selected fields only
});

// Distinct values
const shopUrls = await distinct("user", "shopUrl", { role: 2 });

// Bulk operations
await bulkWrite("user", [
  { updateOne: { filter: { shopUrl: "store1.myshopify.com" }, update: { $set: { active: true } } } },
  { updateOne: { filter: { shopUrl: "store2.myshopify.com" }, update: { $set: { active: false } } } }
]);
```

## User Schema Structure

### Main User Model
**Location**: `server/backend/schema/users.js`

#### Core Fields
```javascript
{
  // Store identification
  shopUrl: { type: String, unique: true, required: true },
  storeId: { type: Number, unique: true, required: true },
  storeName: { type: String },
  
  // Authentication
  accessToken: { type: String, unique: true, required: true },
  
  // User information
  email: { type: String, required: true, validate: validator.isEmail },
  phone: { type: String },
  shop_owner: { type: String },
  role: { type: Number, default: 2 },
  
  // Timestamps
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  
  // Shopify plan information
  plan_display_name: { type: String },
  plan_name: { type: String },
  trial_days: { type: Number },
  trial_start: { type: Date }
}
```

#### App-Specific Fields
```javascript
{
  // Onboarding
  isOnBoardingDone: { type: Boolean, default: false },
  onboardingFinishLater: { type: Boolean, default: false },
  stepCount: { type: Number, default: 1 },
  
  // Subscription
  recurringPlanType: { type: String },
  recurringPlanName: { type: String },
  recurringPlanId: { type: String },
  
  // Reviews and feedback
  reviewRequest: {
    isReviewPosted: { type: Boolean, default: false },
    lastRequested: { type: Date },
    request: { type: Number, default: 0 },
    reviewMeta: { type: Object }
  },
  
  // Credits and features
  aiCredits: { 
    metaTags: { type: Number, default: 5 } 
  },
  imageCredit: { type: Number, default: 50 },
  
  // Integration tokens
  googleAuthTokens: { type: Object },
  
  // Localization
  country_name: { type: String },
  country_code: { type: String },
  currency: { type: String },
  timezone: { type: String },
  iana_timezone: { type: String },
  userLanguage: { type: String },
  appLanguage: { type: String }
}
```

### Other Schema Models

#### Active Plan Schema
**Location**: `server/backend/schema/activePlan.js`
```javascript
{
  shopUrl: { type: String },
  planId: { type: String },
  planName: { type: String },
  status: { type: String },
  trial_start: { type: Date },
  trial_end: { type: Date }
}
```

#### Feedback Schema
**Location**: `server/backend/schema/feedBack.js`
```javascript
{
  shopUrl: { type: String },
  feedbackType: { type: String },
  rating: { type: Number },
  message: { type: String },
  created: { type: Date, default: Date.now }
}
```

## Database Indexes

### User Collection Indexes
```javascript
// Compound index for common queries
userSchema.index({ shopUrl: 1, storeId: 1, storeName: 1 });

// Text index for search
userSchema.index({ storeName: "text" }, { name: "storeName" });
```

## Direct Database Access

### Raw Collection Access
For complex operations bypassing Mongoose:
```javascript
const result = await getDirectDataFromDb({
  collectionName: "users",
  query: { role: 2 },
  searchType: "find", // "find", "count", "distinct"
  limit: 10,
  skip: 0,
  fields: { shopUrl: 1, email: 1 },
  sort: { created: -1 },
  distinctField: "shopUrl" // for distinct queries
});
```

## Query Patterns

### Common Query Examples

#### User Management
```javascript
// Find user by shop
const user = await findOne("user", { shopUrl: "store.myshopify.com" });

// Update user last login
await findOneAndUpdate("user", 
  { shopUrl: "store.myshopify.com" }, 
  { $set: { lastLogin: new Date() } }
);

// Get users with active subscriptions
const activeUsers = await find("user", 
  { recurringPlanName: { $ne: null } },
  { created: -1 }
);
```

#### Subscription Management
```javascript
// Find users by plan
const premiumUsers = await find("user", 
  { recurringPlanName: "premium" },
  { trial_start: -1 }
);

// Users in trial period
const trialUsers = await find("user", {
  trial_start: { $lte: new Date() },
  trial_days: { $gt: 0 }
});
```

#### Analytics Queries
```javascript
// Count users by plan
const planCounts = await models.user.aggregate([
  { $group: { _id: "$recurringPlanName", count: { $sum: 1 } } }
]);

// Monthly user registrations
const monthlyUsers = await models.user.aggregate([
  {
    $group: {
      _id: { 
        year: { $year: "$created" },
        month: { $month: "$created" }
      },
      count: { $sum: 1 }
    }
  }
]);
```

## Performance Optimization

### Query Optimization
- Use indexes for frequently queried fields
- Limit fields with `select()` or `fields` parameter
- Use lean queries for read-only operations
- Implement proper pagination with `skip` and `limit`

### Connection Management
- Connection pooling automatically handled by Mongoose
- Graceful connection recovery
- Environment-specific connection strings

### Memory Management
```javascript
// Use lean queries for better performance
const users = await find("user", query, sort, limit, skip);
// Returns plain JavaScript objects instead of Mongoose documents

// Use field selection to reduce data transfer
const users = await findWithFields({
  collection: "user",
  fields: "shopUrl email created" // Only fetch needed fields
});
```

## Migration and Backup Patterns

### Data Migration
```javascript
// Example migration pattern
const migrateUserData = async () => {
  const users = await find("user", {});
  for (const user of users) {
    await findOneAndUpdate("user", 
      { _id: user._id },
      { $set: { newField: defaultValue } }
    );
  }
};
```

### Backup Operations
Backup routes available in `BackupRoutes.js` for data export and restore operations.