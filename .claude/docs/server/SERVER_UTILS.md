# Server Utils Documentation

## Overview
The server utilities provide essential infrastructure components including Shopify API integration, session management, client providers, JWT validation, and backend helper functions. These utilities form the foundation for secure, efficient server operations and external service integrations.

## Utility Architecture

### Root Utils Structure (`utils/`)
```
utils/
├── shopify.js           // Shopify API client configuration
├── clientProvider.js    // GraphQL and REST client factory
├── sessionHandler.js    // MongoDB session management
├── validateJWT.js       // JWT token validation
├── setupCheck.js        // Environment validation
├── freshInstall.js      // Installation utilities
└── models/              // Shared data models
```

### Backend Helpers Structure (`server/backend/helpers/`)
```
server/backend/helpers/
├── errorUtils.js        // Error handling utilities
├── utils.js             // General utility functions
├── slack.js             // Slack integration helpers
├── email.js             // Email service utilities
├── common.js            // Common operations
├── appUtils.js          // App-specific utilities
└── [Additional helpers]
```

---

## Core Root Utils

### 1. Shopify API Client (`utils/shopify.js`)

**Purpose**: Central Shopify API client configuration and initialization.

```javascript
// Shopify API Configuration
import { shopifyApi } from '@shopify/shopify-api';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_API_SCOPES.split(','),
  hostName: process.env.SHOPIFY_APP_URL,
  apiVersion: process.env.SHOPIFY_API_VERSION,
  isEmbeddedApp: true,
  sessionStorage: {
    storeSession: async (session) => {
      await sessionHandler.storeSession(session);
    },
    loadSession: async (sessionId) => {
      return await sessionHandler.loadSession(sessionId);
    },
    deleteSession: async (sessionId) => {
      await sessionHandler.deleteSession(sessionId);
    }
  }
});

// Unstable API version for beta features
export const unStableShopify = shopifyApi({
  // Same config with unstable API version
  apiVersion: process.env.SHOPIFY_UNSTABLE_API_VERSION || '2024-01'
});

export default shopify;
```

**Key Features**:
- **Dual API Versions**: Stable and unstable API access
- **Session Integration**: MongoDB session storage
- **Environment Configuration**: Environment-based setup
- **Embedded App Support**: Full Shopify App Bridge integration

### 2. Client Provider (`utils/clientProvider.js`)

**Purpose**: Factory for creating authenticated Shopify API clients.

```javascript
// Client Provider Utilities
import { findOne } from '../server/backend/model/common.js';
import sessionHandler from './sessionHandler.js';
import shopify, { unStableShopify } from './shopify.js';
import validateJWT from './validateJWT.js';

// GraphQL Client Factory
export const graphqlClient = async ({ req, res, isOnline = true }) => {
  try {
    const sessionId = await getSessionId({ req, res, isOnline });
    
    if (!sessionId) {
      throw new Error('No valid session found');
    }
    
    const client = new shopify.clients.Graphql({ 
      session: await sessionHandler.loadSession(sessionId) 
    });
    
    return { client, sessionId };
  } catch (error) {
    logger.error('GraphQL client creation failed', { error });
    throw error;
  }
};

// REST Client Factory  
export const restClient = async ({ req, res, isOnline = false }) => {
  try {
    const sessionId = await getSessionId({ req, res, isOnline });
    
    const client = new shopify.clients.Rest({ 
      session: await sessionHandler.loadSession(sessionId) 
    });
    
    return { client, sessionId };
  } catch (error) {
    logger.error('REST client creation failed', { error });
    throw error;
  }
};

// Session ID Resolution
export const getSessionId = async ({ req, res, isOnline, showLogger = true }) => {
  try {
    // 1. Try Shopify session resolution
    let sessionId = await shopify.session.getCurrentId({
      isOnline,
      rawRequest: req,
      rawResponse: res,
    });
    
    if (sessionId) return sessionId;
    
    // 2. Fallback to JWT token validation
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = validateJWT(token);
      
      if (payload && payload.dest) {
        const shop = payload.dest.replace('https://', '').replace('/admin', '');
        const user = await findOne(User, { shop });
        
        if (user) {
          return `offline_${shop}`;
        }
      }
    }
    
    // 3. Admin token fallback
    const adminToken = req.headers['x-admin-token'];
    if (adminToken && isValidAdminToken(adminToken)) {
      return `admin_${adminToken}`;
    }
    
    return null;
  } catch (error) {
    if (showLogger) {
      logger.error('Session ID resolution failed', { error });
    }
    return null;
  }
};
```

### 3. Session Handler (`utils/sessionHandler.js`)

**Purpose**: Encrypted MongoDB session storage and management.

```javascript
// Session Management with Encryption
import { Session } from '@shopify/shopify-api';
import Cryptr from 'cryptr';
import SessionModel from './models/SessionModel.js';

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

// Store Session with Encryption
const storeSession = async (session) => {
  try {
    await SessionModel.findOneAndUpdate(
      { id: session.id },
      {
        content: cryption.encrypt(JSON.stringify(session)),
        shop: session.shop,
        isOnline: session.isOnline,
        expiresAt: session.expires
      },
      { upsert: true }
    );
    
    logger.info('Session stored', { sessionId: session.id, shop: session.shop });
    return true;
  } catch (error) {
    logger.error('Session storage failed', { error, sessionId: session.id });
    throw error;
  }
};

// Load Session with Decryption
const loadSession = async (sessionId) => {
  try {
    const sessionRecord = await SessionModel.findOne({ id: sessionId });
    
    if (!sessionRecord) {
      return null;
    }
    
    // Check expiration
    if (sessionRecord.expiresAt && sessionRecord.expiresAt < new Date()) {
      await SessionModel.deleteOne({ id: sessionId });
      return null;
    }
    
    // Decrypt and reconstruct session
    const decryptedContent = cryption.decrypt(sessionRecord.content);
    const sessionData = JSON.parse(decryptedContent);
    
    return new Session(sessionData);
  } catch (error) {
    logger.error('Session loading failed', { error, sessionId });
    return null;
  }
};

// Delete Session
const deleteSession = async (sessionId) => {
  try {
    await SessionModel.deleteOne({ id: sessionId });
    logger.info('Session deleted', { sessionId });
    return true;
  } catch (error) {
    logger.error('Session deletion failed', { error, sessionId });
    throw error;
  }
};

// Clean Expired Sessions
const cleanExpiredSessions = async () => {
  try {
    const result = await SessionModel.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    logger.info('Expired sessions cleaned', { deletedCount: result.deletedCount });
    return result.deletedCount;
  } catch (error) {
    logger.error('Session cleanup failed', { error });
    throw error;
  }
};

export default {
  storeSession,
  loadSession,
  deleteSession,
  cleanExpiredSessions
};
```

### 4. JWT Validation (`utils/validateJWT.js`)

**Purpose**: Validate and decode Shopify session tokens.

```javascript
// JWT Token Validation
import jwt from 'jsonwebtoken';

const validateJWT = (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }
    
    // Shopify uses RS256 algorithm
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET, {
      algorithms: ['HS256'],
      audience: process.env.SHOPIFY_API_KEY
    });
    
    // Validate required claims
    if (!decoded.dest || !decoded.aud || !decoded.exp) {
      throw new Error('Invalid token claims');
    }
    
    // Check expiration
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    return decoded;
  } catch (error) {
    logger.error('JWT validation failed', { error: error.message, token: token?.substring(0, 20) });
    throw error;
  }
};

export default validateJWT;
```

### 5. Setup Validation (`utils/setupCheck.js`)

**Purpose**: Validate environment configuration on server startup.

```javascript
// Environment Setup Validation
const setupCheck = () => {
  const requiredEnvVars = [
    'SHOPIFY_API_KEY',
    'SHOPIFY_API_SECRET',
    'SHOPIFY_API_SCOPES',
    'SHOPIFY_APP_URL',
    'MONGO_URL',
    'ENCRYPTION_STRING'
  ];
  
  const missingVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    console.error('Please check your .env file configuration');
    process.exit(1);
  }
  
  // Validate Shopify URL format
  if (!process.env.SHOPIFY_APP_URL.startsWith('https://')) {
    console.error('SHOPIFY_APP_URL must use HTTPS protocol');
    process.exit(1);
  }
  
  // Validate MongoDB URL format
  if (!process.env.MONGO_URL.startsWith('mongodb://') && !process.env.MONGO_URL.startsWith('mongodb+srv://')) {
    console.error('MONGO_URL must be a valid MongoDB connection string');
    process.exit(1);
  }
  
  console.log('✅ Environment setup validation passed');
};

export default setupCheck;
```

---

## Backend Helper Functions

### 1. Error Utilities (`server/backend/helpers/errorUtils.js`)

**Purpose**: Centralized error handling and response utilities.

```javascript
// Error Handling Utilities
import { logger } from '../services/logger/index.js';

// Standardized Error Response
export const handleExpressError = (err, req, res, next) => {
  logger.error('Express error handler triggered', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: true,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Shopify API Error Handler
export const handleShopifyError = (error, res, context = 'Shopify operation') => {
  logger.error(`${context} failed`, {
    error: error.message,
    response: error.response?.body,
    status: error.response?.code
  });
  
  if (error.response) {
    const statusCode = error.response.code || 500;
    return res.status(statusCode).json({
      error: true,
      message: 'Shopify API error',
      details: error.response.body
    });
  }
  
  res.status(500).json({
    error: true,
    message: 'Internal server error'
  });
};

// Mutation Response Handler
export const handleMutationResponse = (response, successMessage = 'Operation completed') => {
  if (response.userErrors && response.userErrors.length > 0) {
    return {
      success: false,
      errors: response.userErrors,
      message: 'Validation errors occurred'
    };
  }
  
  return {
    success: true,
    data: response,
    message: successMessage
  };
};

// Async Error Wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### 2. Backend Utils (`server/backend/helpers/utils.js`)

**Purpose**: General-purpose utility functions for backend operations.

```javascript
// Backend Utility Functions
import crypto from 'crypto';

// Generate Secure Random String
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash Sensitive Data
export const hashSensitiveData = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data + process.env.ENCRYPTION_STRING);
  return hash.digest('hex');
};

// Validate Email Format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize Shop Domain
export const sanitizeShopDomain = (shop) => {
  if (!shop) return null;
  
  // Remove protocol and trailing slashes
  let cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  // Ensure .myshopify.com suffix
  if (!cleanShop.endsWith('.myshopify.com')) {
    cleanShop += '.myshopify.com';
  }
  
  return cleanShop;
};

// Rate Limiting Helper
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip + req.path;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [requestKey, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(requestKey);
      }
    }
    
    // Count requests in window
    const requestsInWindow = Array.from(requests.values())
      .filter(timestamp => timestamp > windowStart).length;
    
    if (requestsInWindow >= max) {
      return res.status(429).json({
        error: true,
        message: 'Too many requests, please try again later'
      });
    }
    
    requests.set(key, now);
    next();
  };
};

// Data Transformation Utilities
export const transformShopifyData = (data, fields = []) => {
  if (!data) return null;
  
  if (fields.length === 0) {
    return data;
  }
  
  const transformed = {};
  for (const field of fields) {
    if (data.hasOwnProperty(field)) {
      transformed[field] = data[field];
    }
  }
  
  return transformed;
};

// Pagination Helper
export const createPaginationInfo = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};
```

### 3. Slack Integration (`server/backend/helpers/slack.js`)

**Purpose**: Slack notification and webhook integration.

```javascript
// Slack Integration Utilities
import axios from 'axios';
import { logger } from '../services/logger/index.js';

// Send Slack Message
export const sendSlackMessage = async (message, channel = 'general') => {
  try {
    if (!process.env.SLACK_WEBHOOK_URL) {
      logger.warn('Slack webhook URL not configured');
      return false;
    }
    
    const payload = {
      channel: `#${channel}`,
      text: message,
      username: process.env.SHOPIFY_APP_NAME || 'Shopify App',
      icon_emoji: ':robot_face:'
    };
    
    const response = await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
    
    if (response.status === 200) {
      logger.info('Slack message sent successfully', { channel });
      return true;
    }
    
    throw new Error(`Slack API returned status ${response.status}`);
  } catch (error) {
    logger.error('Failed to send Slack message', { error, message });
    return false;
  }
};

// User Activity Notification
export const notifyUserActivity = async (activity, userData) => {
  const message = `
🔔 *${activity}*
👤 *User:* ${userData.email}
🏪 *Store:* ${userData.shop}
📅 *Time:* ${new Date().toISOString()}
🔗 *Admin Panel:* <${process.env.SHOPIFY_APP_URL}/admin/user?shop=${userData.shop}|View User>
  `;
  
  return await sendSlackMessage(message, 'user-activity');
};

// Error Alert Notification
export const notifyError = async (error, context = {}) => {
  const message = `
🚨 *Server Error Alert*
❌ *Error:* ${error.message}
📍 *Context:* ${JSON.stringify(context)}
📅 *Time:* ${new Date().toISOString()}
🔧 *Environment:* ${process.env.NODE_ENV}
  `;
  
  return await sendSlackMessage(message, 'errors');
};

// System Health Alert
export const notifyHealthIssue = async (metric, value, threshold) => {
  const message = `
⚠️ *Health Alert*
📊 *Metric:* ${metric}
📈 *Current Value:* ${value}
🚨 *Threshold:* ${threshold}
📅 *Time:* ${new Date().toISOString()}
  `;
  
  return await sendSlackMessage(message, 'system-health');
};
```

### 4. Email Utilities (`server/backend/helpers/email.js`)

**Purpose**: Email service integration and template management.

```javascript
// Email Service Utilities
import nodemailer from 'nodemailer';
import { logger } from '../services/logger/index.js';

// Email Transporter Setup
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send Email
export const sendEmail = async (to, subject, htmlContent, textContent = '') => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '')
    };
    
    const result = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', { to, subject, messageId: result.messageId });
    
    return result;
  } catch (error) {
    logger.error('Email sending failed', { error, to, subject });
    throw error;
  }
};

// Welcome Email Template
export const sendWelcomeEmail = async (userEmail, userName, shopName) => {
  const subject = `Welcome to ${process.env.APP_NAME}!`;
  
  const htmlContent = `
    <h1>Welcome to ${process.env.APP_NAME}!</h1>
    <p>Hi ${userName},</p>
    <p>Thank you for installing our app on your store: <strong>${shopName}</strong></p>
    <p>Get started by visiting your <a href="${process.env.SHOPIFY_APP_URL}">app dashboard</a>.</p>
    <p>If you have any questions, don't hesitate to reach out!</p>
  `;
  
  return await sendEmail(userEmail, subject, htmlContent);
};

// Subscription Notification
export const sendSubscriptionEmail = async (userEmail, planName, action = 'subscribed') => {
  const subject = `Subscription ${action}: ${planName}`;
  
  const htmlContent = `
    <h1>Subscription ${action}</h1>
    <p>Your subscription to the <strong>${planName}</strong> plan has been ${action}.</p>
    <p>Visit your <a href="${process.env.SHOPIFY_APP_URL}/pricing">billing dashboard</a> for more details.</p>
  `;
  
  return await sendEmail(userEmail, subject, htmlContent);
};
```

---

## Development Patterns

### Creating Custom Utilities

#### 1. Root Utility Pattern
```javascript
// CustomRootUtil.js
import { logger } from '../server/backend/services/logger/index.js';

const customRootUtil = {
  async performOperation(data) {
    try {
      // Utility logic here
      logger.info('Custom operation completed', { data });
      return result;
    } catch (error) {
      logger.error('Custom operation failed', { error });
      throw error;
    }
  }
};

export default customRootUtil;
```

#### 2. Backend Helper Pattern
```javascript
// customHelper.js
export const customHelper = (input, options = {}) => {
  try {
    // Helper logic
    return processedResult;
  } catch (error) {
    logger.error('Custom helper failed', { error, input });
    throw error;
  }
};

export const anotherHelper = async (asyncInput) => {
  try {
    const result = await performAsyncOperation(asyncInput);
    return result;
  } catch (error) {
    logger.error('Async helper failed', { error });
    throw error;
  }
};
```

#### 3. Integration Pattern
```javascript
// Using utilities in controllers
import { customHelper } from '../helpers/customHelper.js';
import customRootUtil from '../../../utils/customRootUtil.js';

const controller = {
  async handleRequest(req, res) {
    try {
      const processed = customHelper(req.body);
      const result = await customRootUtil.performOperation(processed);
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      handleControllerError(error, res);
    }
  }
};
```

This utility system provides a comprehensive foundation for server operations with consistent error handling, logging, and integration patterns across all server components.