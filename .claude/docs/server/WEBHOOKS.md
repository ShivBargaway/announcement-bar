# Webhooks Documentation

## Overview
The webhook system provides real-time event handling for Shopify store events including app installation, uninstallation, store updates, and other critical events. The system includes automatic webhook registration, validation, and comprehensive event handling with error recovery and monitoring.

## Webhook Architecture

### Webhook File Structure
```
server/webhooks/
├── _index.js           // Webhook registration and routing
├── webhook.js          // Event handlers implementation
```

### Main Webhook Handler (`server/webhooks/_index.js`)

#### Webhook Registration System
```javascript
// Automatic webhook registration on server startup
export const webhookRegistrar = async () => {
  try {
    const webhooks = [
      {
        topic: 'app/uninstalled',
        address: `${process.env.SHOPIFY_APP_URL}/webhooks/app_uninstalled`,
        deliveryMethod: DeliveryMethod.Http
      },
      {
        topic: 'shop/update',
        address: `${process.env.SHOPIFY_APP_URL}/webhooks/shop_update`,
        deliveryMethod: DeliveryMethod.Http
      }
    ];

    for (const webhook of webhooks) {
      await shopify.webhooks.addHandlers(webhook);
      logger.info('Webhook registered', { topic: webhook.topic });
    }
  } catch (error) {
    logger.error('Webhook registration failed', { error });
  }
};
```

#### Webhook Request Handler
```javascript
// Main webhook processing pipeline
const webhookHandler = async (req, res) => {
  const topic = req.headers["x-shopify-topic"] || "";
  const shop = req.headers["x-shopify-shop-domain"] || "";
  const apiVersion = req.headers["x-shopify-api-version"] || "";
  const webhookId = req.headers["x-shopify-webhook-id"] || "";

  try {
    // 1. Validate webhook authenticity
    const validateWebhook = await shopify.webhooks.validate({
      rawBody: req.body,
      rawRequest: req,
      rawResponse: res,
    });

    if (!validateWebhook.valid) {
      logger.warn('Invalid webhook received', { topic, shop });
      return res.status(400).send({ error: true });
    }

    // 2. Route to appropriate handler
    await routeWebhook(topic, req.body, { shop, apiVersion, webhookId });
    
    res.status(200).send({ success: true });
  } catch (error) {
    logger.error('Webhook processing failed', { 
      error, topic, shop, webhookId 
    });
    res.status(500).send({ error: true });
  }
};
```

---

## Webhook Event Handlers

### App Uninstalled Handler (`server/webhooks/webhook.js`)

```javascript
// Handle app uninstallation
export const appUninstallHandler = async (payload, metadata) => {
  try {
    const { shop } = metadata;
    logger.info('App uninstallation initiated', { shop });

    // 1. Update user status
    await User.findOneAndUpdate(
      { shop },
      { 
        isActive: false,
        uninstalledAt: new Date(),
        appStatus: 'uninstalled'
      }
    );

    // 2. Cancel active subscriptions
    await cancelActiveSubscriptions(shop);

    // 3. Clean up user sessions
    await SessionModel.deleteMany({ shop });

    // 4. Archive user data
    await archiveUserData(shop);

    // 5. Send notification to admin team
    const message = slackChannelMsg('App Uninstalled', { shop });
    if (message) {
      await sendSlackMessage(message);
    }

    // 6. Log uninstallation
    await logUninstallation(shop, payload);

    logger.info('App uninstallation completed', { shop });
  } catch (error) {
    logger.error('App uninstallation handler failed', { 
      error, 
      shop: metadata.shop 
    });
    throw error;
  }
};
```

### Shop Update Handler
```javascript
// Handle store information updates
export const shopUpdateHandler = async (payload, metadata) => {
  try {
    const { shop } = metadata;
    logger.info('Shop update received', { shop });

    // 1. Update store information
    await User.findOneAndUpdate(
      { shop },
      {
        storeName: payload.name,
        storeEmail: payload.email,
        storePhone: payload.phone,
        storeCurrency: payload.currency,
        storeTimezone: payload.iana_timezone,
        planDisplayName: payload.plan_display_name,
        planName: payload.plan_name,
        updatedAt: new Date()
      }
    );

    // 2. Sync subscription status if plan changed
    if (payload.plan_name) {
      await syncShopifyPlan(shop, payload.plan_name);
    }

    // 3. Update app configuration based on new store settings
    await updateAppConfiguration(shop, payload);

    logger.info('Shop update processed', { shop });
  } catch (error) {
    logger.error('Shop update handler failed', { 
      error, 
      shop: metadata.shop 
    });
    throw error;
  }
};
```

---

## Webhook Security & Validation

### HMAC Verification
```javascript
// Webhook authenticity validation
const validateWebhookHmac = (body, signature) => {
  const hmac = crypto.createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET);
  hmac.update(body, 'utf8');
  const hash = hmac.digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature), 
    Buffer.from(hash)
  );
};
```

### Headers Validation
```javascript
// Validate required Shopify headers
const validateWebhookHeaders = (headers) => {
  const required = [
    'x-shopify-topic',
    'x-shopify-shop-domain',
    'x-shopify-webhook-id',
    'x-shopify-hmac-sha256'
  ];
  
  for (const header of required) {
    if (!headers[header]) {
      throw new Error(`Missing required header: ${header}`);
    }
  }
  
  return true;
};
```

### Replay Attack Prevention
```javascript
// Prevent webhook replay attacks
const preventReplayAttack = async (webhookId) => {
  // Check if webhook ID already processed
  const existing = await ProcessedWebhook.findOne({ webhookId });
  
  if (existing) {
    throw new Error('Webhook already processed');
  }
  
  // Store webhook ID
  await ProcessedWebhook.create({ 
    webhookId, 
    processedAt: new Date() 
  });
};
```

---

## Webhook Event Types

### Core Shopify Events

#### App Lifecycle Events
```javascript
// App installation
'app/installed' => handleAppInstallation

// App uninstallation
'app/uninstalled' => handleAppUninstallation

// App subscription changes
'app_subscriptions/approaching_capped_amount' => handleCapApproaching
'app_subscriptions/capped_amount_updated' => handleCapUpdated
```

#### Store Events
```javascript
// Store information updates
'shop/update' => handleShopUpdate

// Store plan changes
'shop/plan_changed' => handlePlanChange

// Store domain changes
'shop/domain_changed' => handleDomainChange
```

#### Product Events
```javascript
// Product lifecycle
'products/create' => handleProductCreated
'products/update' => handleProductUpdated
'products/delete' => handleProductDeleted

// Inventory changes
'inventory_levels/update' => handleInventoryUpdate
'inventory_levels/connect' => handleInventoryConnect
```

#### Order Events
```javascript
// Order lifecycle
'orders/create' => handleOrderCreated
'orders/updated' => handleOrderUpdated
'orders/cancelled' => handleOrderCancelled
'orders/fulfilled' => handleOrderFulfilled
'orders/paid' => handleOrderPaid
```

### Custom Event Handlers

#### Subscription Management
```javascript
const handleSubscriptionChange = async (payload, metadata) => {
  try {
    const { shop } = metadata;
    const { status, plan_id } = payload;
    
    await User.findOneAndUpdate(
      { shop },
      {
        subscriptionStatus: status,
        subscriptionPlan: plan_id,
        subscriptionUpdatedAt: new Date()
      }
    );
    
    // Trigger plan-specific features
    await enablePlanFeatures(shop, plan_id);
    
  } catch (error) {
    logger.error('Subscription change handler failed', { error, shop });
  }
};
```

#### Data Sync Handler
```javascript
const handleDataSync = async (payload, metadata) => {
  try {
    const { shop } = metadata;
    
    // Queue data synchronization job
    await queueSyncJob(shop, payload);
    
    logger.info('Data sync queued', { shop });
  } catch (error) {
    logger.error('Data sync handler failed', { error, shop });
  }
};
```

---

## Error Handling & Recovery

### Webhook Processing Errors
```javascript
// Comprehensive error handling
const processWebhook = async (topic, payload, metadata) => {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      await executeWebhookHandler(topic, payload, metadata);
      return; // Success
    } catch (error) {
      retryCount++;
      
      if (retryCount >= maxRetries) {
        // Log final failure
        logger.error('Webhook processing failed after retries', {
          error,
          topic,
          retryCount,
          shop: metadata.shop
        });
        
        // Queue for manual review
        await queueForManualReview(topic, payload, metadata, error);
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
};
```

### Dead Letter Queue
```javascript
// Queue failed webhooks for manual processing
const queueForManualReview = async (topic, payload, metadata, error) => {
  await FailedWebhook.create({
    topic,
    payload,
    metadata,
    error: error.message,
    failedAt: new Date(),
    status: 'pending_review'
  });
  
  // Send alert to admin team
  await sendFailedWebhookAlert(topic, metadata.shop, error);
};
```

---

## Development Patterns

### Adding New Webhook Handlers

#### 1. Define Webhook Configuration
```javascript
// Add to webhook registration
const newWebhook = {
  topic: 'custom/event',
  address: `${process.env.SHOPIFY_APP_URL}/webhooks/custom_event`,
  deliveryMethod: DeliveryMethod.Http
};
```

#### 2. Create Event Handler
```javascript
// webhook.js
export const customEventHandler = async (payload, metadata) => {
  try {
    const { shop } = metadata;
    
    // Process the event
    await processCustomEvent(payload, shop);
    
    logger.info('Custom event processed', { shop });
  } catch (error) {
    logger.error('Custom event handler failed', { error, shop });
    throw error;
  }
};
```

#### 3. Register Handler in Router
```javascript
// _index.js
const routeWebhook = async (topic, payload, metadata) => {
  switch (topic) {
    case 'app/uninstalled':
      return appUninstallHandler(payload, metadata);
    case 'shop/update':
      return shopUpdateHandler(payload, metadata);
    case 'custom/event':
      return customEventHandler(payload, metadata);
    default:
      logger.warn('Unhandled webhook topic', { topic });
  }
};
```

### Testing Webhook Handlers

#### Local Testing
```javascript
// Test webhook handler locally
const testWebhook = async () => {
  const mockPayload = {
    id: 123,
    name: "Test Store"
  };
  
  const mockMetadata = {
    shop: "test-store.myshopify.com",
    apiVersion: "2023-10",
    webhookId: "test-webhook-id"
  };
  
  try {
    await shopUpdateHandler(mockPayload, mockMetadata);
    console.log('Webhook test passed');
  } catch (error) {
    console.error('Webhook test failed', error);
  }
};
```

#### Webhook Simulation
```javascript
// Simulate webhook for development
app.post('/dev/simulate-webhook/:topic', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }
  
  const { topic } = req.params;
  const payload = req.body;
  
  try {
    await routeWebhook(topic, payload, {
      shop: 'dev-store.myshopify.com',
      apiVersion: '2023-10',
      webhookId: `dev-${Date.now()}`
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Monitoring & Analytics

### Webhook Metrics
```javascript
// Track webhook processing metrics
const trackWebhookMetrics = async (topic, shop, duration, success) => {
  await WebhookMetrics.create({
    topic,
    shop,
    duration,
    success,
    processedAt: new Date()
  });
};
```

### Performance Monitoring
```javascript
// Monitor webhook processing performance
const processWebhookWithMetrics = async (topic, payload, metadata) => {
  const startTime = Date.now();
  let success = false;
  
  try {
    await routeWebhook(topic, payload, metadata);
    success = true;
  } catch (error) {
    success = false;
    throw error;
  } finally {
    const duration = Date.now() - startTime;
    await trackWebhookMetrics(topic, metadata.shop, duration, success);
  }
};
```

### Health Monitoring
```javascript
// Webhook system health check
app.get('/health/webhooks', async (req, res) => {
  try {
    const recentWebhooks = await WebhookMetrics.find({
      processedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    const totalProcessed = recentWebhooks.length;
    const successfulProcessed = recentWebhooks.filter(w => w.success).length;
    const successRate = totalProcessed > 0 ? (successfulProcessed / totalProcessed) * 100 : 0;
    
    res.json({
      healthy: successRate > 95,
      metrics: {
        totalProcessed,
        successfulProcessed,
        successRate: `${successRate.toFixed(2)}%`
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});
```

This webhook system provides a robust, reliable, and scalable foundation for handling real-time Shopify events with comprehensive error handling, security validation, and monitoring capabilities.