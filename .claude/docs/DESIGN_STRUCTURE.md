# Design Structure Guidelines

This document defines the mandatory folder structure and organization patterns for feature development in this Shopify app starter kit.

## Overview

When developing new features, follow these strict organizational patterns to maintain codebase consistency and scalability. Each feature must be properly organized across both client and server architectures.

## Client-Side Structure (Frontend)

### Mandatory Organization Pattern

When creating any new feature, follow this exact structure:

```
client/
├── Components/
│   └── Common/           # ✅ MANDATORY: All reusable components HERE ONLY
├── Pages/                # ✅ MANDATORY: All feature pages/screens HERE
├── Assets/
│   └── Mocks/           # ✅ MANDATORY: Feature mock data files HERE
└── Utils/               # ✅ MANDATORY: Common functions HERE
```

### Client-Side Rules

#### 1. Common Components (MANDATORY)
- **Location**: `client/Components/Common/`
- **Rule**: ALL reusable components MUST be created in the Common component folder
- **Examples**: Forms, tables, modals, buttons, cards, etc.
- **Pattern**: Always use `CommonForm`, `CommonTable`, etc.

```javascript
// ✅ CORRECT - Always create in Common folder
client/Components/Common/NewFeatureComponent.jsx
client/Components/Common/CustomModal.jsx
client/Components/Common/DataCard.jsx

// ❌ WRONG - Never create components outside Common
client/Components/NewFeature/SomeComponent.jsx
client/Pages/SomePage/LocalComponent.jsx
```

#### 2. Feature Pages (MANDATORY)
- **Location**: `client/Pages/`
- **Rule**: Every feature MUST have its dedicated page folder
- **Pattern**: One folder per feature with main page component

```javascript
// ✅ CORRECT - Feature page structure
client/Pages/ProductManagement/ProductManagement.jsx
client/Pages/UserSettings/UserSettings.jsx
client/Pages/Analytics/Analytics.jsx

// ❌ WRONG - No nested or scattered pages
client/Components/ProductPage.jsx
client/Features/ProductManagement.jsx
```

#### 3. Mock Data (MANDATORY)
- **Location**: `client/Assets/Mocks/`
- **Rule**: Each feature MUST create its own mock data file
- **Pattern**: `FeatureName.mock.js`

```javascript
// ✅ CORRECT - Feature-specific mock files
client/Assets/Mocks/ProductManagement.mock.js
client/Assets/Mocks/UserSettings.mock.js
client/Assets/Mocks/Analytics.mock.js

// ❌ WRONG - No scattered or nested mock files
client/Pages/ProductManagement/mockData.js
client/Components/Common/mockData.js
```

#### 4. Common Functions (MANDATORY)
- **Location**: `client/Utils/`
- **Rule**: ALL shared utility functions MUST be added to existing utils files
- **Pattern**: Add to appropriate existing util file or create new themed util

```javascript
// ✅ CORRECT - Add to existing utils
client/Utils/index.js           // Main utilities
client/Utils/authUtils.js       // Authentication utilities
client/Utils/formatUtils.js     // Data formatting utilities

// ❌ WRONG - Feature-specific util files
client/Pages/ProductManagement/utils.js
client/Components/productUtils.js
```

## Server-Side Structure (Backend)

### Mandatory Organization Pattern

For new features, use existing files when possible, create new files when necessary:

```
server/
├── backend/
│   ├── model/            # ✅ Database schemas and models
│   ├── routes/           # ✅ API route definitions
│   ├── controllers/      # ✅ Business logic (create feature folders)
│   └── services/         # ✅ External integrations
```

### Server-Side Rules

#### 1. Database Models (Use Existing + New Schema)
- **For Existing Features**: Use existing model files
- **For New Features**: Create proper schema in schema folder
- **Pattern**: Add model definition to `app.model` for database registration

```javascript
// ✅ CORRECT - New feature schema
server/backend/model/ProductManagement.js     // New schema file
server/backend/model/common.js                // Register in common operations

// Schema registration pattern:
export const ProductManagementModel = mongoose.model('ProductManagement', ProductManagementSchema);
```

#### 2. API Routes (Use Existing + New Routes)
- **For Existing Features**: Add to existing route files
- **For New Features**: Create new route file and register in index.js
- **Pattern**: `FeatureName.routes.js` or add to existing category routes

```javascript
// ✅ CORRECT - Route organization
server/backend/routes/ProductManagementRoutes.js  // New feature routes
server/backend/routes/UserRoutes.js               // Existing routes (add to these)
server/backend/routes/index.js                    // Register new routes

// Registration pattern in index.js:
import ProductManagementRoutes from './ProductManagementRoutes.js';
router.use(ProductManagementRoutes);
```

#### 3. Controllers (MANDATORY Feature Folders)
- **Location**: `server/backend/controllers/`
- **Rule**: MANDATORY to create feature folder for new features
- **Pattern**: Create dedicated folder with feature logic

```javascript
// ✅ CORRECT - Feature controller structure
server/backend/controllers/ProductManagement/
├── ProductManagement.js          // Main controller
├── ProductValidation.js          // Validation logic
└── ProductHelpers.js             // Feature-specific helpers

server/backend/controllers/UserSettings/
├── UserSettings.js
├── UserValidation.js
└── UserHelpers.js

// ❌ WRONG - Single file or scattered controllers
server/backend/controllers/productManagement.js
server/backend/controllers/misc/productStuff.js
```

#### 4. Business Logic Organization
- **Rule**: Write ALL business logic in the controller folder
- **Pattern**: Separate concerns within feature controllers
- **Structure**: Main controller + validation + helpers

```javascript
// ✅ CORRECT - Controller organization
// ProductManagement/ProductManagement.js - Main CRUD operations
export const createProduct = async (req, res) => { /* logic */ };
export const updateProduct = async (req, res) => { /* logic */ };

// ProductManagement/ProductValidation.js - Input validation
export const validateProductData = (data) => { /* validation */ };

// ProductManagement/ProductHelpers.js - Feature utilities
export const formatProductData = (product) => { /* formatting */ };
```

## Feature Development Workflow

### Complete Feature Creation Checklist

When developing ANY new feature, follow this exact checklist:

#### Client-Side (Frontend) - MANDATORY STEPS:

1. **✅ Create Page Component**
   ```
   client/Pages/FeatureName/FeatureName.jsx
   ```

2. **✅ Create/Update Common Components**
   ```
   client/Components/Common/FeatureSpecificComponent.jsx
   ```

3. **✅ Create Mock Data**
   ```
   client/Assets/Mocks/FeatureName.mock.js
   ```

4. **✅ Add Utility Functions**
   ```
   Add to existing client/Utils/ files
   ```

5. **✅ Register Route**
   ```
   Add to client/routes.jsx with lazy loading
   Add to client/Assets/Mocks/Navigation.mock.js
   ```

#### Server-Side (Backend) - MANDATORY STEPS:

1. **✅ Create/Update Database Schema**
   ```
   server/backend/model/FeatureName.js (if new)
   Register in server/backend/model/common.js
   ```

2. **✅ Create Controller Folder**
   ```
   server/backend/controllers/FeatureName/
   ├── FeatureName.js        # Main logic
   ├── FeatureValidation.js  # Validation
   └── FeatureHelpers.js     # Utilities
   ```

3. **✅ Create/Update Routes**
   ```
   server/backend/routes/FeatureRoutes.js (if new)
   Register in server/backend/routes/index.js
   ```

4. **✅ Add Services (if needed)**
   ```
   server/backend/services/ (for external integrations)
   ```

## Folder Structure Enforcement

### ❌ NEVER DO THIS:

```
// Wrong client structure
client/Features/ProductManagement/
├── Components/
├── Pages/
├── Utils/
└── Mocks/

// Wrong server structure
server/ProductManagement/
├── controller.js
├── routes.js
├── model.js
└── utils.js
```

### ✅ ALWAYS DO THIS:

```
// Correct client structure
client/Pages/ProductManagement/ProductManagement.jsx
client/Components/Common/ProductCard.jsx
client/Components/Common/ProductForm.jsx
client/Assets/Mocks/ProductManagement.mock.js
client/Utils/index.js (add product utilities here)

// Correct server structure
server/backend/model/ProductManagement.js
server/backend/routes/ProductManagementRoutes.js
server/backend/controllers/ProductManagement/
├── ProductManagement.js
├── ProductValidation.js
└── ProductHelpers.js
```

## Benefits of This Structure

1. **Consistency**: Every developer knows exactly where to find and place code
2. **Scalability**: Clean separation allows easy feature additions
3. **Maintainability**: Organized structure makes debugging and updates easier
4. **Reusability**: Common components and utilities are properly centralized
5. **Team Collaboration**: Clear conventions prevent merge conflicts and confusion

## Quick Reference

### When Adding a New Feature:

1. **Client**: Page folder + Common components + Mock data + Utils
2. **Server**: Controller folder + Routes + Models + Services (if needed)
3. **Never**: Create feature-specific folder structures outside these patterns
4. **Always**: Follow the mandatory organizational rules above

This structure ensures every feature is properly organized and the codebase remains maintainable as it scales.