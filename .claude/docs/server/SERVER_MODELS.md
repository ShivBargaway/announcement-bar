# Server Models Documentation

## Overview
The server uses a comprehensive MongoDB schema system with 12 specialized schemas for different data domains including users, subscriptions, feedback, admin management, and app-specific features. The system includes a common model pattern for shared database operations and consistent data handling.

## Database Schema Architecture

### Schema File Structure
```
server/backend/schema/
├── users.js              // User profiles and store data
├── activePlan.js          // Subscription and billing data
├── admin.js               // Admin users and permissions
├── feedBack.js            // User feedback and reviews
├── onboarding.js          // User onboarding progress
├── dismissProperty.js     // Dismissed notifications/properties
├── discountcode.js        // Discount codes and promotions
├── allVideoLink.js        // Video content management
├── deletedUser.js         // Soft-deleted user records
├── webVital.js            // Performance metrics
└── [Additional schemas]
```

### Common Model Pattern (`server/backend/model/common.js`)
Provides shared database operations and utilities for all schemas.

```javascript
// Common database operations
export const findOne = async (model, query, options = {}) => {
  try {
    return await model.findOne(query, options);
  } catch (error) {
    logger.error('FindOne operation failed', { model: model.modelName, query, error });
    throw error;
  }
};

export const findMany = async (model, query, options = {}) => {
  try {
    return await model.find(query, options);
  } catch (error) {
    logger.error('FindMany operation failed', { model: model.modelName, query, error });
    throw error;
  }
};

export const createOne = async (model, data) => {
  try {
    return await model.create(data);
  } catch (error) {
    logger.error('CreateOne operation failed', { model: model.modelName, data, error });
    throw error;
  }
};

export const updateOne = async (model, query, update, options = {}) => {
  try {
    return await model.findOneAndUpdate(query, update, { new: true, ...options });
  } catch (error) {
    logger.error('UpdateOne operation failed', { model: model.modelName, query, update, error });
    throw error;
  }
};
```

---

## Core Schemas

### 1. Users Schema (`server/backend/schema/users.js`)

**Purpose**: Store user profiles, shop information, and app-specific user data.

```javascript
// User schema structure
const userSchema = new mongoose.Schema({
  // Shopify Integration
  shop: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  shopUrl: { type: String, required: true },
  storeId: { type: String },
  storeName: { type: String },
  email: { type: String, required: true },
  
  // User Profile
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  timezone: { type: String, default: 'UTC' },
  
  // App Status
  isActive: { type: Boolean, default: true },
  isOnBoardingDone: { type: Boolean, default: false },
  appInstallationDate: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  
  // Store Information
  planName: { type: String }, // Shopify plan
  planDisplayName: { type: String },
  currency: { type: String, default: 'USD' },
  countryCode: { type: String },
  
  // App-Specific Data
  appLanguage: { type: String, default: 'en' },
  recurringPlanType: { type: String, default: 'Free' },
  subscriptionStatus: { type: String, default: 'active' },
  
  // Timestamps
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' }
});

// Indexes for performance
userSchema.index({ shop: 1 });
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ created: -1 });
```

### 2. Active Plan Schema (`server/backend/schema/activePlan.js`)

**Purpose**: Track subscription plans, billing information, and usage metrics.

```javascript
// Subscription schema structure
const activePlanSchema = new mongoose.Schema({
  shop: { 
    type: String, 
    required: true, 
    ref: 'User',
    index: true 
  },
  
  // Plan Information
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  planType: { type: String, enum: ['Free', 'Basic', 'Premium', 'Enterprise'] },
  billingCycle: { type: String, enum: ['monthly', 'yearly'] },
  
  // Pricing
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  discount: { type: Number, default: 0 },
  
  // Billing Dates
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  nextBillingDate: { type: Date },
  trialEnd: { type: Date },
  
  // Usage Tracking
  currentUsage: {
    products: { type: Number, default: 0 },
    apiCalls: { type: Number, default: 0 },
    storage: { type: Number, default: 0 }
  },
  
  planLimits: {
    products: { type: Number },
    apiCalls: { type: Number },
    storage: { type: Number }
  },
  
  // Status
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'expired', 'suspended'],
    default: 'active' 
  },
  
  // Shopify Billing
  shopifyChargeId: { type: String },
  confirmationUrl: { type: String },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Compound indexes
activePlanSchema.index({ shop: 1, status: 1 });
activePlanSchema.index({ nextBillingDate: 1 });
activePlanSchema.index({ status: 1, endDate: 1 });
```

### 3. Admin Schema (`server/backend/schema/admin.js`)

**Purpose**: Administrative user management and permissions.

```javascript
// Admin schema structure
const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  name: { type: String, required: true },
  
  // Authentication
  passwordHash: { type: String, required: true },
  accessToken: { type: String },
  refreshToken: { type: String },
  lastLogin: { type: Date },
  
  // Permissions
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin' 
  },
  permissions: [{
    type: String,
    enum: ['read_users', 'write_users', 'delete_users', 'read_analytics', 'system_config']
  }],
  
  // Access Control
  isActive: { type: Boolean, default: true },
  canAccessProduction: { type: Boolean, default: false },
  restrictedIPs: [{ type: String }],
  
  // Audit Trail
  lastActivity: { type: Date },
  loginCount: { type: Number, default: 0 },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Security indexes
adminSchema.index({ email: 1 });
adminSchema.index({ accessToken: 1 });
adminSchema.index({ isActive: 1 });
```

### 4. Feedback Schema (`server/backend/schema/feedBack.js`)

**Purpose**: User feedback, reviews, and support tickets.

```javascript
// Feedback schema structure
const feedBackSchema = new mongoose.Schema({
  shop: { 
    type: String, 
    required: true, 
    ref: 'User',
    index: true 
  },
  
  // Feedback Content
  type: { 
    type: String, 
    enum: ['feedback', 'bug_report', 'feature_request', 'support'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // User Information
  userEmail: { type: String, required: true },
  userName: { type: String },
  
  // Categorization
  category: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium' 
  },
  tags: [{ type: String }],
  
  // Status Tracking
  status: { 
    type: String, 
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new' 
  },
  assignedTo: { type: String },
  
  // Attachments
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  
  // Response Tracking
  adminResponse: { type: String },
  responseDate: { type: Date },
  satisfactionRating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Query optimization indexes
feedBackSchema.index({ shop: 1, status: 1 });
feedBackSchema.index({ type: 1, priority: 1 });
feedBackSchema.index({ created: -1 });
```

---

## Specialized Schemas

### 5. Onboarding Schema (`server/backend/schema/onboarding.js`)

**Purpose**: Track user onboarding progress and suggested actions.

```javascript
// Onboarding progress tracking
const onboardingSchema = new mongoose.Schema({
  shop: { 
    type: String, 
    required: true, 
    unique: true,
    ref: 'User',
    index: true 
  },
  
  // Progress Tracking
  currentStep: { type: Number, default: 0 },
  totalSteps: { type: Number, default: 5 },
  completedSteps: [{ type: Number }],
  
  // Step-specific data
  steps: {
    welcome: { completed: Boolean, completedAt: Date },
    setup: { completed: Boolean, completedAt: Date },
    tutorial: { completed: Boolean, completedAt: Date },
    integration: { completed: Boolean, completedAt: Date },
    completion: { completed: Boolean, completedAt: Date }
  },
  
  // Suggested Items
  suggestedItems: [{
    id: String,
    type: String,
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    priority: { type: Number, default: 1 }
  }],
  
  // User Preferences
  skipTutorial: { type: Boolean, default: false },
  reminderEnabled: { type: Boolean, default: true },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});
```

### 6. Dismiss Property Schema (`server/backend/schema/dismissProperty.js`)

**Purpose**: Track dismissed notifications, banners, and promotional content.

```javascript
// Dismissed content tracking
const dismissPropertySchema = new mongoose.Schema({
  shop: { 
    type: String, 
    required: true, 
    ref: 'User',
    index: true 
  },
  
  // Dismissed Items
  dismissedItems: [{
    itemId: { type: String, required: true },
    itemType: { 
      type: String, 
      enum: ['banner', 'notification', 'promotion', 'tutorial', 'popup'],
      required: true 
    },
    dismissedAt: { type: Date, default: Date.now },
    permanent: { type: Boolean, default: false }
  }],
  
  // Global Settings
  dismissAllPromotions: { type: Boolean, default: false },
  dismissAllTutorials: { type: Boolean, default: false },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Compound index for efficient queries
dismissPropertySchema.index({ shop: 1, 'dismissedItems.itemId': 1 });
```

### 7. Discount Code Schema (`server/backend/schema/discountcode.js`)

**Purpose**: Manage promotional discount codes and usage tracking.

```javascript
// Discount code management
const discountCodeSchema = new mongoose.Schema({
  // Code Information
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    index: true 
  },
  name: { type: String, required: true },
  description: { type: String },
  
  // Discount Details
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed_amount'],
    required: true 
  },
  discountValue: { type: Number, required: true },
  
  // Validity
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Usage Limits
  usageLimit: { type: Number }, // null = unlimited
  usageCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  
  // Applicability
  applicablePlans: [{ type: String }],
  minimumAmount: { type: Number },
  
  // Restrictions
  firstTimeOnly: { type: Boolean, default: false },
  restrictedShops: [{ type: String }],
  allowedShops: [{ type: String }],
  
  // Status
  isActive: { type: Boolean, default: true },
  
  // Usage History
  usedBy: [{
    shop: String,
    usedAt: Date,
    orderAmount: Number
  }],
  
  // Metadata
  createdBy: { type: String }, // Admin who created
  notes: { type: String },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Performance indexes
discountCodeSchema.index({ code: 1 });
discountCodeSchema.index({ isActive: 1, endDate: 1 });
discountCodeSchema.index({ startDate: 1, endDate: 1 });
```

---

## Database Operations Patterns

### Using Common Model Functions

#### Create Operations
```javascript
// Using common model functions
import { createOne } from '../model/common.js';
import User from '../schema/users.js';

// Create new user
const createUser = async (userData) => {
  try {
    const user = await createOne(User, userData);
    logger.info('User created successfully', { shop: userData.shop });
    return user;
  } catch (error) {
    logger.error('User creation failed', { error, userData });
    throw error;
  }
};
```

#### Query Operations
```javascript
// Find operations with error handling
import { findOne, findMany } from '../model/common.js';

// Find user by shop
const getUserByShop = async (shop) => {
  return await findOne(User, { shop, isActive: true });
};

// Find active subscriptions
const getActiveSubscriptions = async () => {
  return await findMany(ActivePlan, { 
    status: 'active',
    endDate: { $gt: new Date() }
  });
};
```

#### Update Operations
```javascript
// Update with common pattern
import { updateOne } from '../model/common.js';

// Update user profile
const updateUserProfile = async (shop, updateData) => {
  return await updateOne(
    User, 
    { shop }, 
    { ...updateData, updated: new Date() }
  );
};
```

### Advanced Query Patterns

#### Aggregation Queries
```javascript
// Complex aggregation for analytics
const getUserAnalytics = async () => {
  return await User.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$recurringPlanType',
        count: { $sum: 1 },
        avgLoginFrequency: { $avg: '$loginFrequency' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};
```

#### Population Queries
```javascript
// Populate related data
const getUserWithPlan = async (shop) => {
  return await User.findOne({ shop })
    .populate({
      path: 'activePlan',
      model: 'ActivePlan',
      match: { status: 'active' }
    })
    .populate({
      path: 'feedback',
      model: 'FeedBack',
      match: { status: { $ne: 'closed' } }
    });
};
```

---

## Schema Development Patterns

### Creating New Schemas

#### 1. Schema Definition Template
```javascript
// NewFeatureSchema.js
import mongoose from 'mongoose';

const newFeatureSchema = new mongoose.Schema({
  shop: { 
    type: String, 
    required: true, 
    ref: 'User',
    index: true 
  },
  
  // Feature-specific fields
  featureName: { type: String, required: true },
  featureData: { type: mongoose.Schema.Types.Mixed },
  
  // Common fields
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Indexes for performance
newFeatureSchema.index({ shop: 1, isActive: 1 });
newFeatureSchema.index({ created: -1 });

// Pre-save middleware
newFeatureSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

// Methods
newFeatureSchema.methods.activate = function() {
  this.isActive = true;
  return this.save();
};

export default mongoose.model('NewFeature', newFeatureSchema);
```

#### 2. Schema Validation
```javascript
// Custom validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  
  shop: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9-]+\.myshopify\.com$/.test(v);
      },
      message: 'Invalid Shopify store URL format'
    }
  }
});
```

#### 3. Schema Middleware
```javascript
// Pre and post middleware
schema.pre('save', async function(next) {
  // Pre-save operations
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

schema.post('save', async function(doc) {
  // Post-save operations
  logger.info('Document saved', { id: doc._id });
});

schema.pre('remove', async function(next) {
  // Cleanup related data
  await RelatedModel.deleteMany({ parentId: this._id });
  next();
});
```

---

## Performance Optimization

### Index Strategies
```javascript
// Compound indexes for complex queries
schema.index({ shop: 1, status: 1, created: -1 });

// Sparse indexes for optional fields
schema.index({ email: 1 }, { sparse: true });

// TTL indexes for temporary data
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Partial indexes for filtered queries
schema.index({ status: 1 }, { partialFilterExpression: { status: 'active' } });
```

### Query Optimization
```javascript
// Efficient queries with proper field selection
const getActiveUsers = async () => {
  return await User.find({ isActive: true })
    .select('shop email storeName created') // Only needed fields
    .lean() // Skip hydration for better performance
    .limit(100)
    .sort({ created: -1 });
};

// Use explain() for query analysis
const explainQuery = async () => {
  const explanation = await User.find({ shop: 'test.myshopify.com' })
    .explain('executionStats');
  console.log('Query execution stats:', explanation);
};
```

This model system provides a comprehensive, scalable database architecture with consistent patterns, comprehensive validation, and optimized performance for complex Shopify app requirements.