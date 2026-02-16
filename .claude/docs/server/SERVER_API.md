# Server API Documentation

## Overview
The server API system provides a comprehensive REST API architecture with 24 controllers organized across multiple domains including user management, pricing, admin functions, SEO features, and third-party integrations. The API follows consistent patterns for authentication, error handling, and response formatting.

## API Architecture

### Route Organization Structure
```
server/backend/routes/
├── index.js              // Main route aggregator
├── userRoutes.js         // User management APIs  
├── adminRoutes.js        // Admin panel APIs
├── pricingRoutes.js      // Subscription & billing APIs
├── feedBackRoute.js      // User feedback APIs
├── emailRoutes.js        // Email service APIs
├── fileUploadRoute.js    // File handling APIs
├── googleAuthRoute.js    // Google integration APIs
├── commonRoute.js        // Common utilities APIs
├── cronRoutes.js         // Scheduled task APIs
├── dismissProperty.js    // Property management APIs
├── uninstallRoutes.js    // App uninstallation APIs
├── BackupRoutes.js       // Data backup APIs
└── CommonRoute.js        // Cross-cutting APIs
```

### Controller Organization Structure
```
server/backend/controllers/
├── user/                 // User management (2 controllers)
├── admin/               // Admin functionality (2 controllers)
├── pricing/             // Billing & subscriptions (2 controllers)
├── shopify/             // Shopify API integration (2 controllers)
├── emails/              // Email services (1 controller + templates)
├── feedBack/            // User feedback (1 controller)
├── google/              // Google services (1 controller)
├── Reviews/             // Review system (1 controller)
├── cronCtrl/            // Cron jobs (4 controllers)
├── file/                // File operations (1 controller)
├── backup/              // Data backup (1 controller)
├── Common/              // Common utilities (1 controller)
├── Customerly/          // Customer support (1 controller)
├── ThirdPartyIntegration/ // External APIs (1 controller)
├── uninstallApp/        // Uninstallation (1 controller)
└── dismissProperty/     // Property management (1 controller)
```

---

## Core API Controllers

### 1. User Management APIs

#### User Controller (`server/backend/controllers/user/userCtrl.js`)
**Purpose**: Core user operations, profile management, and user data handling.

```javascript
// Key Endpoints
GET    /users              // Get user list (admin)
GET    /users/:id          // Get user profile
PUT    /users/:id          // Update user profile
POST   /users/sync         // Sync user data with Shopify
DELETE /users/:id          // Delete user (admin)

// Profile management
GET    /profile            // Get current user profile
PUT    /profile            // Update current user profile
POST   /profile/settings   // Update user settings
```

**Controller Patterns**:
```javascript
// Standard user controller pattern
const userController = {
  async getProfile(req, res) {
    try {
      const { session } = req;
      const user = await User.findOne({ shop: session.shop });
      
      if (!user) {
        return res.status(404).json({ 
          error: true, 
          message: "User not found" 
        });
      }
      
      res.status(200).json({ 
        error: false, 
        data: user 
      });
    } catch (error) {
      logger.error('Get profile failed', { error, shop: req.session?.shop });
      res.status(500).json({ 
        error: true, 
        message: "Internal server error" 
      });
    }
  }
};
```

#### App User Controller (`server/backend/controllers/user/appUserCtrl.js`)
**Purpose**: App-specific user operations and Shopify app integration.

```javascript
// App user management
POST   /app-user/install      // Handle app installation
PUT    /app-user/upgrade      // Handle plan upgrades
POST   /app-user/sync-shopify // Sync with Shopify store data
DELETE /app-user/uninstall    // Handle app uninstallation
```

### 2. Admin Management APIs

#### Admin Controller (`server/backend/controllers/admin/adminCtrl.js`)
**Purpose**: Administrative functions, user management, and system operations.

```javascript
// Admin operations
GET    /admin/users           // List all users
GET    /admin/analytics       // System analytics
POST   /admin/users/:id/ban   // Ban user
DELETE /admin/users/:id       // Delete user
PUT    /admin/settings        // Update system settings

// System monitoring
GET    /admin/logs            // System logs
GET    /admin/performance     // Performance metrics
POST   /admin/maintenance     // Maintenance operations
```

**Admin Authorization Pattern**:
```javascript
// Admin-only controller pattern
const adminController = {
  async getUsers(req, res) {
    try {
      // Verify admin access
      if (!isAdmin(req.session)) {
        return res.status(403).json({ 
          error: true, 
          message: "Admin access required" 
        });
      }
      
      const users = await User.find({})
        .select('-sensitive_data')
        .sort({ created: -1 });
        
      res.status(200).json({ 
        error: false, 
        data: users 
      });
    } catch (error) {
      handleControllerError(error, res, 'Get users failed');
    }
  }
};
```

### 3. Pricing & Billing APIs

#### Pricing Controller (`server/backend/controllers/pricing/pricingCtrl.js`)
**Purpose**: Subscription management, plan changes, and billing operations.

```javascript
// Subscription management
GET    /pricing/plans         // Available plans
POST   /pricing/subscribe     // Subscribe to plan
PUT    /pricing/change-plan   // Change subscription plan
DELETE /pricing/cancel        // Cancel subscription
GET    /pricing/usage         // Current usage metrics

// Billing operations
GET    /billing/history       // Billing history
POST   /billing/payment       // Process payment
GET    /billing/invoice/:id   // Get invoice
```

#### App Pricing Controller (`server/backend/controllers/pricing/appPricingCtrl.js`)
**Purpose**: Shopify-specific billing integration and App Store billing.

```javascript
// Shopify billing integration
POST   /shopify/create-charge    // Create Shopify charge
GET    /shopify/charges          // List charges
POST   /shopify/activate-charge  // Activate charge
DELETE /shopify/cancel-charge    // Cancel charge
```

### 4. Shopify Integration APIs

#### Shopify Controller (`server/backend/controllers/shopify/shopifyCtrl.js`)
**Purpose**: Core Shopify API integration and store data management.

```javascript
// Store operations
GET    /shopify/store          // Get store information
GET    /shopify/products       // Get products
PUT    /shopify/products/:id   // Update product
POST   /shopify/products       // Create product

// App integration
POST   /shopify/app/install    // App installation
GET    /shopify/app/status     // Installation status
PUT    /shopify/app/settings   // Update app settings
```

**Shopify API Pattern**:
```javascript
// Shopify API integration pattern
const shopifyController = {
  async getProducts(req, res) {
    try {
      const { session } = req;
      const { client } = await clientProvider.restClient({ 
        req, res, isOnline: true 
      });
      
      const products = await client.get({
        path: 'products',
        query: req.query
      });
      
      res.status(200).json({ 
        error: false, 
        data: products.body 
      });
    } catch (error) {
      handleShopifyError(error, res, 'Get products failed');
    }
  }
};
```

---

## Common API Patterns

### 1. Standard Response Format
```javascript
// Success response
{
  "error": false,
  "data": { /* response data */ },
  "message": "Operation successful"
}

// Error response
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { /* error details */ }
}

// Paginated response
{
  "error": false,
  "data": [/* items */],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### 2. Authentication Integration
```javascript
// Controller with authentication
const authenticatedController = async (req, res) => {
  try {
    // Session available from middleware
    const { session } = req;
    const userId = session.userId;
    
    // Perform operations with user context
    const result = await performUserOperation(userId);
    
    res.status(200).json({ 
      error: false, 
      data: result 
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};
```

### 3. Error Handling Patterns
```javascript
// Centralized error handling
const handleControllerError = (error, res, context = 'Operation') => {
  logger.error(`${context} failed`, { 
    error: error.message, 
    stack: error.stack 
  });
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: "Validation failed",
      details: error.details
    });
  }
  
  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      error: true,
      message: "Resource not found"
    });
  }
  
  res.status(500).json({
    error: true,
    message: "Internal server error"
  });
};
```

### 4. Validation Patterns
```javascript
// Input validation in controllers
const validateInput = (data, schema) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new ValidationError(error.details);
  }
  return value;
};

// Usage in controller
const createUser = async (req, res) => {
  try {
    const validatedData = validateInput(req.body, userSchema);
    const user = await User.create(validatedData);
    
    res.status(201).json({ 
      error: false, 
      data: user 
    });
  } catch (error) {
    handleControllerError(error, res, 'Create user');
  }
};
```

---

## Specialized Controllers

### 1. Email Services (`server/backend/controllers/emails/emailCtrl.js`)
```javascript
// Email operations
POST   /emails/send           // Send email
GET    /emails/templates      // List email templates
POST   /emails/template       // Create email template
GET    /emails/logs           // Email sending logs
```

### 2. File Upload (`server/backend/controllers/file/fileUploadCtrl.js`)
```javascript
// File operations
POST   /files/upload          // Upload file
GET    /files/:id             // Get file
DELETE /files/:id             // Delete file
GET    /files/list            // List user files
```

### 3. Feedback System (`server/backend/controllers/feedBack/feedBack.js`)
```javascript
// Feedback operations
POST   /feedback/submit       // Submit feedback
GET    /feedback/list         // List feedback (admin)
PUT    /feedback/:id/status   // Update feedback status
DELETE /feedback/:id          // Delete feedback
```

### 4. Cron Jobs (`server/backend/controllers/cronCtrl/`)
```javascript
// Scheduled task management
GET    /cron/jobs             // List scheduled jobs
POST   /cron/schedule         // Schedule new job
DELETE /cron/:id              // Delete scheduled job
POST   /cron/execute/:id      // Manually execute job
```

### 5. Third-Party Integration (`server/backend/controllers/ThirdPartyIntegration/`)
```javascript
// External service integration
POST   /integrations/connect    // Connect service
GET    /integrations/status     // Integration status
PUT    /integrations/:id/sync   // Sync data
DELETE /integrations/:id        // Disconnect service
```

---

## API Development Patterns

### Creating New Controllers

#### 1. Controller File Structure
```javascript
// NewFeatureController.js
import { logger } from '../../services/logger/index.js';
import { handleControllerError } from '../../helpers/errorUtils.js';

const newFeatureController = {
  async create(req, res) {
    try {
      const { session } = req;
      const data = req.body;
      
      // Validation
      if (!data.name) {
        return res.status(400).json({
          error: true,
          message: "Name is required"
        });
      }
      
      // Business logic
      const result = await createFeature(data, session.shop);
      
      res.status(201).json({
        error: false,
        data: result
      });
    } catch (error) {
      handleControllerError(error, res, 'Create feature');
    }
  },
  
  async get(req, res) {
    // Implementation
  },
  
  async update(req, res) {
    // Implementation
  },
  
  async delete(req, res) {
    // Implementation
  }
};

export default newFeatureController;
```

#### 2. Route Integration
```javascript
// newFeatureRoutes.js
import { Router } from 'express';
import newFeatureController from '../controllers/newFeature/newFeatureController.js';

const router = Router();

router.post('/new-feature', newFeatureController.create);
router.get('/new-feature/:id', newFeatureController.get);
router.put('/new-feature/:id', newFeatureController.update);
router.delete('/new-feature/:id', newFeatureController.delete);

export default router;
```

#### 3. Main Route Registration
```javascript
// server/backend/routes/index.js
import newFeatureRoutes from './newFeatureRoutes.js';

router.use(newFeatureRoutes);
```

---

## Performance & Best Practices

### Controller Optimization
- **Async/Await**: Use async/await for all asynchronous operations
- **Error Boundaries**: Comprehensive error handling in all controllers
- **Validation**: Input validation before processing
- **Logging**: Structured logging with context
- **Response Caching**: Cache frequently requested data

### Security Practices
- **Input Sanitization**: Clean all user inputs
- **Authorization Checks**: Verify user permissions
- **Rate Limiting**: Implement API rate limiting
- **CORS Configuration**: Proper CORS setup
- **SQL Injection Prevention**: Use parameterized queries

### API Documentation
- **Consistent Naming**: RESTful naming conventions
- **Response Standards**: Standardized response formats
- **Error Codes**: Consistent error code system
- **Versioning**: API versioning strategy
- **Documentation**: Complete API documentation

---

## File Upload and Media Management

### File Upload Architecture

The application implements a comprehensive file upload system with Shopify Files API integration, local file management, and automatic cleanup processes.

#### File Upload Controller (`server/backend/controllers/file/fileUploadCtrl.js`)

**Purpose**: Handle file uploads to Shopify Files API with local temporary storage.

```javascript
import fs from "fs";
import { ApiResponse } from "../../helpers/common.js";

// Shopify File Creation GraphQL Mutation
const fileCreateMutation = `
mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      id
      alt
      createdAt
      fileErrors {
        details
        message
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

// File Retrieval GraphQL Query
const filesQuery = `
query ($id: ID!) {
  node(id: $id) {
    ... on MediaImage {
      image {
        id
        url
        altText
        height
        width
      }
    }
  }
}`;

// Core file upload to Shopify
const postFileToShopify = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { shop, graphqlClient } = req.shopify;
    const files = req.files;  // Multer file array

    let promises = [];

    files.forEach((file, index) => {
      const fileCreateVariables = { files: [] };
      let fileData = {};

      // Environment-specific file handling
      if (process.env.ENV !== "dev") {
        // Production: Use actual uploaded file
        fileData = {
          originalSource: `${process.env.SHOPIFY_APP_URL}/uploads/${file.filename}`,
          filename: file.filename,
          alt: file.filename,
        };
      } else {
        // Development: Use placeholder image
        fileData = {
          originalSource: `https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg`,
          filename: `what_is_image_Processing-${index}.jpg`,
          alt: `what_is_image_Processing-${index}.jpg`,
        };
      }

      fileCreateVariables.files.push(fileData);
      promises.push(imageFileCreate(graphqlClient, fileCreateVariables));
    });

    // Process all files in parallel
    await Promise.all(promises)
      .then((values) => {
        // Clean up local files after successful upload
        removeLocalFile(files);
        rcResponse.data = values;
      })
      .catch((error) => {
        throw error;
      });

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

// File creation with retry mechanism
const imageFileCreate = async (graphqlClient, fileCreateVariables) => {
  try {
    const response = await makeGraphqlRequest(graphqlClient, {
      data: {
        query: fileCreateMutation,
        variables: fileCreateVariables,
      },
    });

    const id = response?.body?.data?.fileCreate?.files[0].id;
    await sleep(1000); // Allow Shopify processing time
    return await fetchImageById(graphqlClient, id);
  } catch (error) {
    throw error;
  }
};

// Fetch uploaded file details with retry logic
const fetchImageById = async (graphqlClient, id) => {
  try {
    const response = await makeGraphqlRequest(graphqlClient, {
      data: {
        query: filesQuery,
        variables: { id: id },
      },
    });

    const image = response.body?.data?.node?.image;

    // Retry if image not ready
    if (!image) {
      await sleep(500);
      return fetchImageById(graphqlClient, id);
    }

    return image;
  } catch (err) {
    throw err;
  }
};

// File deletion from Shopify
const removeFileFromShopify = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { graphqlClient } = req.shopify;
    const { id } = req.body;

    const fileDeleteMutation = `
      mutation fileDelete($fileIds: [ID!]!) {
        fileDelete(fileIds: $fileIds) {
          deletedFileIds
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await graphqlClient.query({
      data: {
        query: fileDeleteMutation,
        variables: { fileIds: [id] },
      },
    });

    rcResponse.data = response.body.data.fileDelete;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

// Local file cleanup
const removeLocalFile = async (files) => {
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fs.unlink(`./server/backend/uploads/${file.filename}`, (err) => {
        if (err) {
          console.error('File deletion error:', err);
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

export { postFileToShopify, removeFileFromShopify };
```

#### File Upload Routes (`server/backend/routes/fileUploadRoute.js`)

**Purpose**: Configure multer storage and file upload endpoints.

```javascript
import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { postFileToShopify, removeFileFromShopify } from "../controllers/file/fileUploadCtrl.js";

// Storage configuration
const destinationDirectory = "./server/backend/uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure upload directory exists
    if (!fs.existsSync(destinationDirectory)) {
      fs.mkdirSync(destinationDirectory, { recursive: true });
    }
    cb(null, destinationDirectory);
  },
  
  filename: function (req, file, cb) {
    // Extract file extension
    const ext = path.extname(file.originalname);

    // Create sanitized filename
    const baseFilename = file.originalname
      .replace(ext, "") // Remove extension
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, ""); // Remove non-alphanumeric chars

    // Add timestamp for uniqueness
    const newFilename = `${Date.now()}-${baseFilename}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per request
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const FileUploadRoute = Router();

// File upload endpoints
FileUploadRoute.post("/upload-to-shopify", upload.array("files"), postFileToShopify);
FileUploadRoute.delete("/remove-file", removeFileFromShopify);

export default FileUploadRoute;
```

### Advanced File Upload Patterns

#### Bulk File Processing
```javascript
// Bulk file upload with progress tracking
const bulkFileUpload = async (req, res) => {
  try {
    const { files } = req;
    const { graphqlClient } = req.shopify;
    
    const uploadResults = [];
    const batchSize = 5; // Process 5 files at a time
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (file, index) => {
        try {
          const fileData = {
            originalSource: `${process.env.SHOPIFY_APP_URL}/uploads/${file.filename}`,
            filename: file.filename,
            alt: file.originalname
          };
          
          const result = await imageFileCreate(graphqlClient, { files: [fileData] });
          
          return {
            success: true,
            filename: file.filename,
            shopifyId: result.id,
            url: result.url
          };
        } catch (error) {
          return {
            success: false,
            filename: file.filename,
            error: error.message
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      uploadResults.push(...batchResults);
      
      // Progress callback
      const progress = Math.round(((i + batch.length) / files.length) * 100);
      logger.info(`Upload progress: ${progress}%`, { 
        processed: i + batch.length, 
        total: files.length 
      });
    }
    
    // Clean up local files
    await cleanupLocalFiles(files);
    
    res.status(200).json({
      error: false,
      data: uploadResults,
      summary: {
        total: files.length,
        successful: uploadResults.filter(r => r.success).length,
        failed: uploadResults.filter(r => !r.success).length
      }
    });
  } catch (error) {
    handleControllerError(error, res, 'Bulk file upload');
  }
};
```

#### File Type Validation
```javascript
// Enhanced file validation
const validateFileUpload = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': { ext: ['.jpg', '.jpeg'], maxSize: 5 * 1024 * 1024 },
    'image/png': { ext: ['.png'], maxSize: 5 * 1024 * 1024 },
    'image/webp': { ext: ['.webp'], maxSize: 3 * 1024 * 1024 },
    'image/gif': { ext: ['.gif'], maxSize: 2 * 1024 * 1024 }
  };
  
  const fileType = allowedTypes[file.mimetype];
  
  if (!fileType) {
    return cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (!fileType.ext.includes(ext)) {
    return cb(new Error(`File extension ${ext} not allowed for ${file.mimetype}`), false);
  }
  
  cb(null, true);
};

// Image optimization before upload
const optimizeImage = async (filePath, options = {}) => {
  try {
    const sharp = require('sharp');
    
    const optimized = sharp(filePath)
      .resize(options.width || 1200, options.height || null, { 
        withoutEnlargement: true 
      })
      .jpeg({ quality: options.quality || 80 });
    
    const optimizedPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '-optimized.jpg');
    await optimized.toFile(optimizedPath);
    
    return optimizedPath;
  } catch (error) {
    logger.error('Image optimization failed', { error, filePath });
    return filePath; // Return original if optimization fails
  }
};
```

#### File Upload with Metadata
```javascript
// File upload with custom metadata
const uploadWithMetadata = async (req, res) => {
  try {
    const { files } = req;
    const { metadata = {} } = req.body;
    const { graphqlClient } = req.shopify;
    
    const uploadPromises = files.map(async (file) => {
      // Generate file metadata
      const fileMetadata = {
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.session.shop,
        ...metadata
      };
      
      const fileData = {
        originalSource: `${process.env.SHOPIFY_APP_URL}/uploads/${file.filename}`,
        filename: file.filename,
        alt: fileMetadata.alt || file.originalname
      };
      
      const shopifyFile = await imageFileCreate(graphqlClient, { files: [fileData] });
      
      // Store metadata in database
      await FileMetadata.create({
        shopifyFileId: shopifyFile.id,
        localPath: file.path,
        metadata: fileMetadata
      });
      
      return {
        shopifyFile,
        metadata: fileMetadata
      };
    });
    
    const results = await Promise.all(uploadPromises);
    
    // Cleanup local files
    await cleanupLocalFiles(files);
    
    res.status(200).json({
      error: false,
      data: results
    });
  } catch (error) {
    handleControllerError(error, res, 'Upload with metadata');
  }
};
```

### File Management Utilities

#### File Cleanup Service
```javascript
// Automated file cleanup service
class FileCleanupService {
  constructor() {
    this.uploadDir = './server/backend/uploads/';
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }
  
  async cleanupOldFiles() {
    try {
      const files = await fs.promises.readdir(this.uploadDir);
      const now = Date.now();
      
      for (const file of files) {
        const filePath = path.join(this.uploadDir, file);
        const stats = await fs.promises.stat(filePath);
        
        if (now - stats.mtime.getTime() > this.maxAge) {
          await fs.promises.unlink(filePath);
          logger.info('Cleaned up old file', { file });
        }
      }
    } catch (error) {
      logger.error('File cleanup failed', { error });
    }
  }
  
  async getDiskUsage() {
    try {
      const files = await fs.promises.readdir(this.uploadDir);
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(this.uploadDir, file);
        const stats = await fs.promises.stat(filePath);
        totalSize += stats.size;
      }
      
      return {
        files: files.length,
        totalSize,
        totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
      };
    } catch (error) {
      logger.error('Disk usage calculation failed', { error });
      return null;
    }
  }
}

// Schedule cleanup job
const fileCleanupService = new FileCleanupService();

// Run cleanup every hour
setInterval(async () => {
  await fileCleanupService.cleanupOldFiles();
}, 60 * 60 * 1000);
```

#### File Upload Monitoring
```javascript
// File upload monitoring and analytics
const fileUploadAnalytics = {
  async trackUpload(fileData) {
    try {
      await UploadLog.create({
        filename: fileData.filename,
        size: fileData.size,
        type: fileData.mimetype,
        shop: fileData.shop,
        uploadedAt: new Date(),
        success: true
      });
    } catch (error) {
      logger.error('Upload tracking failed', { error });
    }
  },
  
  async getUploadStats(shop, timeframe = '24h') {
    try {
      const since = new Date(Date.now() - this.parseTimeframe(timeframe));
      
      const stats = await UploadLog.aggregate([
        { $match: { shop, uploadedAt: { $gte: since } } },
        {
          $group: {
            _id: null,
            totalUploads: { $sum: 1 },
            totalSize: { $sum: '$size' },
            successfulUploads: {
              $sum: { $cond: ['$success', 1, 0] }
            },
            fileTypes: { $push: '$type' }
          }
        }
      ]);
      
      return stats[0] || null;
    } catch (error) {
      logger.error('Upload stats retrieval failed', { error });
      return null;
    }
  },
  
  parseTimeframe(timeframe) {
    const units = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    return units[timeframe] || units['24h'];
  }
};
```

### File Upload API Endpoints

#### Complete File Upload API
```javascript
// File upload routes with comprehensive functionality
const setupFileUploadRoutes = (router) => {
  // Basic file upload
  router.post('/files/upload', 
    upload.array('files'), 
    postFileToShopify
  );
  
  // Bulk file upload with progress
  router.post('/files/bulk-upload', 
    upload.array('files'), 
    bulkFileUpload
  );
  
  // Upload with metadata
  router.post('/files/upload-with-metadata', 
    upload.array('files'), 
    uploadWithMetadata
  );
  
  // File deletion
  router.delete('/files/:id', removeFileFromShopify);
  
  // File listing
  router.get('/files', getFileList);
  
  // Upload statistics
  router.get('/files/stats', getUploadStats);
  
  // File cleanup (admin only)
  router.post('/files/cleanup', 
    requireAdmin, 
    cleanupFiles
  );
  
  // Disk usage info
  router.get('/files/usage', getDiskUsage);
};

// File listing controller
const getFileList = async (req, res) => {
  try {
    const { shop } = req.session;
    const { page = 1, limit = 20, type } = req.query;
    
    const query = { shop };
    if (type) query.type = new RegExp(type, 'i');
    
    const files = await FileMetadata.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ uploadedAt: -1 });
    
    const total = await FileMetadata.countDocuments(query);
    
    res.status(200).json({
      error: false,
      data: files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleControllerError(error, res, 'Get file list');
  }
};
```

This comprehensive file upload system provides robust file handling with Shopify integration, automatic cleanup, monitoring, and extensive error handling capabilities.

This API system provides a robust, scalable backend architecture for comprehensive Shopify app functionality with consistent patterns, comprehensive error handling, and extensive feature coverage.