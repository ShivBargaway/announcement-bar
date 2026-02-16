# GraphQL Query Management System

## Overview
This documentation provides a comprehensive reference for implementing specific GraphQL queries and mutations in the Shopify app. Each operation includes direct links to official Shopify documentation, use cases, trigger patterns, and WebFetch workflows to ensure accurate implementation with current API structures.

## How It Works
When you request any specific GraphQL operation, the system:
1. **Identifies the operation** from trigger patterns
2. **WebFetches live documentation** from the specific Shopify API page
3. **Extracts current structure** and field definitions
4. **Implements using established patterns** with proper error handling
5. **Tests and validates** the implementation


## 🚨 CRITICAL IMPLEMENTATION RULES - NO BUGS ALLOWED

### MANDATORY Field Verification Process
**NEVER write GraphQL queries from memory or assumptions. ALWAYS follow this exact process:**

1. **WebFetch Official Documentation**: Get the exact page for the specific operation
2. **Extract ONLY Documented Fields**: Use only fields shown in official examples
3. **Copy Exact Structure**: Match the exact nested field structure from examples
4. **Verify Parameter Types**: Use only documented parameter types and enums
5. **Remove All Assumptions**: If a field is not explicitly shown in examples, DO NOT include it

### Field Validation Rules
- ✅ **DO**: Use fields shown in official documentation examples
- ✅ **DO**: Copy exact field structure from Shopify docs
- ✅ **DO**: Use documented parameter types (e.g., `ProductSortKeys`, not `String`)
- ❌ **DON'T**: Add fields based on logical assumptions
- ❌ **DON'T**: Use fields from other similar objects
- ❌ **DON'T**: Assume pricing/address fields are always available
- ❌ **DON'T**: Use generic `String` types for specialized enums

### Quality Assurance - Every Query Must Pass
Before implementing any GraphQL operation:
- [ ] WebFetched official documentation page
- [ ] Extracted exact field structure from examples
- [ ] Verified all field names match documentation exactly
- [ ] Confirmed parameter types are correct (enums vs strings)
- [ ] Removed any assumed or unverified fields
- [ ] Query structure matches official examples 100%

## 📋 UNIVERSAL IMPLEMENTATION PROCESS

**All operations in this document follow this standard 4-step process:**

1. **WebFetch**: Access the official Shopify documentation page for current API structure
2. **Extract**: Identify documented fields, parameters, and data structures
3. **Implement**: Create query/mutation in appropriate domain file with validation
4. **Controller**: Build API endpoint with error handling and response formatting

## 🗂️ DOMAIN FILE ORGANIZATION

**All GraphQL operations are organized into three domain files:**

- **`commonQuery.js`**: General operations (products, customers, orders, inventory, etc.)
- **`pricingQuery.js`**: Billing, subscriptions, and app-specific operations
- **`imageOptimizerQuery.js`**: Media, file uploads, and image processing operations

## 🎯 TRIGGER PATTERN SYSTEM

**Each operation includes 6+ trigger patterns for automatic recognition:**
- Natural language patterns for user requests
- Technical terminology variations
- Business context phrases
- API-specific terminology
- Common use case descriptions
- Alternative naming conventions

### Example Process for any Operation:
```
User Request: "get [resource]"
1. WebFetch: https://shopify.dev/docs/api/admin-graphql/latest/[operations]/[resource]
2. Extract documented fields only
3. Implement in appropriate domain file
4. Create controller with validation
Result: Bug-free, working query
```

# APP MANAGEMENT OPERATIONS

## App Access Scope Management

### appRevokeAccessScopes Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/apprevokeaccessscopes

**Domain File**: `pricingQuery.js`

**Use Cases**:
- Remove specific app permissions during security compliance
- Downgrade app access when features are disabled
- Revoke unused scopes to minimize app footprint
- Comply with data protection regulations

**Trigger Patterns**:
- "revoke app permissions"
- "remove access scopes"
- "downgrade app permissions" 
- "revoke GraphQL scopes"
- "remove app access"
- "security compliance scopes"

---

### appSubscriptionCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/appsubscriptioncreate

**Domain File**: `pricingQuery.js` (billing and subscription operations)

**Use Cases**:
- Create new app subscription plans
- Implement recurring billing for app features
- Set up usage-based pricing models
- Handle subscription upgrades and plan changes

**Trigger Patterns**:
- "create app subscription"
- "setup billing subscription"
- "implement app pricing"
- "create subscription plan"
- "billing setup"
- "recurring payment setup"


---

### appSubscriptionCancel Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/appsubscriptioncancel

**Domain File**: `pricingQuery.js` (billing and subscription operations)

**Use Cases**:
- Cancel active app subscriptions
- Handle subscription downgrades
- Process subscription termination requests
- Manage end-of-billing-cycle cancellations

**Trigger Patterns**:
- "cancel app subscription"
- "terminate subscription"
- "end billing subscription"
- "subscription cancellation"
- "stop recurring billing"


---

### appUsageRecordCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/appusagerecordcreate

**Domain File**: `pricingQuery.js` (usage tracking and billing)

**Use Cases**:
- Track usage-based billing events
- Record API call consumption
- Log feature usage for billing purposes
- Implement pay-per-use pricing models

**Trigger Patterns**:
- "create usage record"
- "track app usage"
- "log billing usage"
- "record feature usage"
- "usage-based billing"
- "track API consumption"


# PRODUCT MANAGEMENT OPERATIONS

## Product Information & Management

### product Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/product

**Domain File**: `commonQuery.js` (general product operations)

**Use Cases**:
- Retrieve detailed product information
- Get product variants and pricing
- Access product media and descriptions
- Fetch product SEO and metadata

**Trigger Patterns**:
- "get product details"
- "fetch product information"
- "product data query"
- "single product query"
- "product by ID"
- "product details API"


---

### products Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/products

**Domain File**: `commonQuery.js` (general product operations)

**Use Cases**:
- List products with pagination
- Search products by title, vendor, or type
- Filter products by status or collection
- Bulk product operations and analytics

**Trigger Patterns**:
- "get products list"
- "fetch all products"
- "product listing query"
- "search products"
- "product catalog"
- "bulk product data"


---

### productCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productcreate

**Domain File**: `commonQuery.js` (product management operations)

**Use Cases**:
- Create new products programmatically
- Bulk product import operations
- Product creation from external sources
- Automated product generation

**Trigger Patterns**:
- "create new product"
- "add product"
- "product creation"
- "create product mutation"
- "add new product"
- "product import"


---

### productUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productupdate

**Domain File**: `commonQuery.js` (product management operations)

**Use Cases**:
- Update existing product information
- Modify product pricing and inventory
- Update product SEO and metadata
- Bulk product updates and synchronization

**Trigger Patterns**:
- "update product"
- "modify product"
- "edit product details"
- "product update mutation"
- "change product information"
- "bulk product update"


---

### productDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productdelete

**Domain File**: `commonQuery.js` (product management operations)

**Use Cases**:
- Remove products from catalog
- Cleanup discontinued products
- Bulk product deletion operations
- Product lifecycle management

**Trigger Patterns**:
- "delete product"
- "remove product"
- "product deletion"
- "delete product mutation"
- "remove from catalog"
- "product cleanup"


# CUSTOMER MANAGEMENT OPERATIONS

## Customer Information & Management

### customer Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/customer

**Domain File**: `commonQuery.js` (general customer operations)

**Use Cases**:
- Retrieve detailed customer profiles
- Get customer order history and analytics
- Access customer addresses and contact information
- Fetch customer tags and segmentation data

**Trigger Patterns**:
- "get customer details"
- "fetch customer information"
- "customer data query"
- "single customer query"
- "customer profile"
- "customer by ID"


---

### customers Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/customers

**Domain File**: `commonQuery.js` (general customer operations)

**Use Cases**:
- List customers with pagination and search
- Customer segmentation and analytics
- Bulk customer operations and exports
- Customer lifetime value analysis

**Trigger Patterns**:
- "get customers list"
- "fetch all customers"
- "customer listing query"
- "search customers"
- "customer database"
- "customer analytics"


---

### customerCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/customercreate

**Domain File**: `commonQuery.js` (customer management operations)

**Use Cases**:
- Create new customer accounts programmatically
- Import customers from external systems
- Customer registration automation
- Bulk customer creation

**Trigger Patterns**:
- "create new customer"
- "add customer"
- "customer creation"
- "create customer account"
- "customer registration"
- "import customers"


---

### customerUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerupdate

**Domain File**: `commonQuery.js` (customer management operations)

**Use Cases**:
- Update customer profile information
- Modify customer addresses and contact details
- Update customer tags and segmentation
- Customer data synchronization

**Trigger Patterns**:
- "update customer"
- "modify customer"
- "edit customer details"
- "customer update mutation"
- "change customer information"
- "sync customer data"


# ORDER MANAGEMENT OPERATIONS

## Order Information & Processing

### order Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/order

**Domain File**: `commonQuery.js` (general order operations)

**Use Cases**:
- Retrieve detailed order information
- Get order line items and fulfillment status
- Access order financial and shipping details
- Fetch order tags and custom attributes

**Trigger Patterns**:
- "get order details"
- "fetch order information"
- "order data query"
- "single order query"
- "order by ID"
- "order status check"


---

### orders Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/orders

**Domain File**: `commonQuery.js` (general order operations)

**Use Cases**:
- List orders with filtering and pagination
- Order analytics and reporting
- Bulk order processing and exports
- Order fulfillment management

**Trigger Patterns**:
- "get orders list"
- "fetch all orders"
- "order listing query"
- "search orders"
- "order analytics"
- "order reporting"


---

### orderUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderupdate

**Domain File**: `commonQuery.js` (order management operations)

**Use Cases**:
- Update order tags and notes
- Modify order attributes and metadata
- Update order processing status
- Order data enrichment

**Trigger Patterns**:
- "update order"
- "modify order"
- "edit order details"
- "order update mutation"
- "change order information"
- "order tagging"


# INVENTORY MANAGEMENT OPERATIONS

## Inventory Tracking & Management

### inventoryLevel Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/inventorylevel

**Domain File**: `commonQuery.js` (inventory operations)

**Use Cases**:
- Check inventory levels by location
- Monitor stock availability
- Inventory reporting and analytics
- Stock threshold monitoring

**Trigger Patterns**:
- "get inventory level"
- "check stock levels"
- "inventory query"
- "stock availability"
- "inventory tracking"
- "location inventory"


---

### inventoryAdjust Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventoryadjust

**Domain File**: `commonQuery.js` (inventory management operations)

**Use Cases**:
- Adjust inventory quantities
- Correct inventory discrepancies
- Inventory reconciliation processes
- Stock movement tracking

**Trigger Patterns**:
- "adjust inventory"
- "update stock levels"
- "inventory adjustment"
- "stock correction"
- "inventory reconciliation"
- "modify inventory"


---

### inventoryBulkAdjustQuantityAtLocation Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventorybulkadjustquantityatlocation

**Domain File**: `commonQuery.js` (bulk inventory operations)

**Use Cases**:
- Bulk inventory adjustments
- Mass inventory corrections
- Inventory import operations
- Location-based bulk updates

**Trigger Patterns**:
- "bulk inventory adjustment"
- "mass inventory update"
- "bulk stock correction"
- "inventory bulk operation"
- "mass inventory reconciliation"
- "bulk inventory import"


---

### inventorySetQuantities Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventorysetquantities

**Domain File**: `commonQuery.js` (inventory management operations)

**Use Cases**:
- Set absolute inventory quantities across locations
- Implement compare-and-swap inventory updates
- System-of-record inventory synchronization
- Prevent concurrent inventory update conflicts

**Trigger Patterns**:
- "set inventory quantities"
- "absolute inventory update"
- "inventory quantity sync"
- "compare and swap inventory"
- "system inventory update"
- "master inventory sync"


---

### inventoryActivate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventoryactivate

**Domain File**: `commonQuery.js` (inventory management operations)

**Use Cases**:
- Activate inventory items at specific locations
- Connect products to new fulfillment locations
- Set initial inventory quantities for new locations
- Enable inventory tracking at locations

**Trigger Patterns**:
- "activate inventory"
- "enable inventory tracking"
- "connect product to location"
- "inventory location setup"
- "activate product at location"
- "inventory item activation"


---

### inventoryItems Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/inventoryitems

**Domain File**: `commonQuery.js` (inventory management operations)

**Use Cases**:
- List inventory items with filtering and pagination
- Monitor inventory tracking status
- Analyze SKU-based inventory data
- Bulk inventory item operations

**Trigger Patterns**:
- "get inventory items"
- "list inventory items"
- "inventory items query"
- "inventory tracking list"
- "SKU inventory data"
- "inventory item management"


---

### inventoryItemUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventoryitemupdate

**Domain File**: `commonQuery.js` (inventory management operations)

**Use Cases**:
- Update inventory item cost and tracking information
- Modify country of origin and harmonized system codes
- Manage inventory item metadata
- Update customs and shipping information

**Trigger Patterns**:
- "update inventory item"
- "modify inventory cost"
- "update inventory tracking"
- "inventory item update"
- "change inventory metadata"
- "update customs information"


# MEDIA & FILE OPERATIONS

## File & Media Management

### files Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/files

**Domain File**: `imageOptimizerQuery.js` (media and file operations)

**Use Cases**:
- List uploaded files and media
- File management and organization
- Media asset browsing
- File metadata retrieval

**Trigger Patterns**:
- "get files list"
- "fetch uploaded files"
- "media files query"
- "file management"
- "media assets"
- "file browser"


---

### fileCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/filecreate

**Domain File**: `imageOptimizerQuery.js` (file upload operations)

**Use Cases**:
- Upload files to Shopify Files API
- Create media assets programmatically
- Bulk file upload operations
- File import from external sources

**Trigger Patterns**:
- "upload file"
- "create file"
- "file upload"
- "media upload"
- "file creation"
- "upload media asset"


---

### fileUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/fileupdate

**Domain File**: `imageOptimizerQuery.js` (file management operations)

**Use Cases**:
- Update file metadata and alt text
- Modify file attributes
- File SEO optimization
- Bulk file metadata updates

**Trigger Patterns**:
- "update file"
- "modify file metadata"
- "file update mutation"
- "change file attributes"
- "file SEO update"
- "update alt text"


---

### fileDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/filedelete

**Domain File**: `imageOptimizerQuery.js` (file management operations)

**Use Cases**:
- Remove unused files and media
- File cleanup operations
- Media library maintenance
- Bulk file deletion

**Trigger Patterns**:
- "delete file"
- "remove file"
- "file deletion"
- "media cleanup"
- "file removal"
- "cleanup unused files"


# COLLECTION MANAGEMENT OPERATIONS

## Collection Information & Management

### collection Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/collection

**Domain File**: `commonQuery.js` (general collection operations)

**Use Cases**:
- Retrieve collection details and products
- Get collection rules and conditions
- Access collection SEO and metadata
- Collection performance analytics

**Trigger Patterns**:
- "get collection details"
- "fetch collection information"
- "collection data query"
- "single collection query"
- "collection by ID"
- "collection products"


---

### collections Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/collections

**Domain File**: `commonQuery.js` (general collection operations)

**Use Cases**:
- List collections with pagination
- Collection management and organization
- Collection analytics and reporting
- Bulk collection operations

**Trigger Patterns**:
- "get collections list"
- "fetch all collections"
- "collection listing query"
- "search collections"
- "collection management"
- "collection analytics"


---

### collectionCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectioncreate

**Domain File**: `commonQuery.js` (collection management operations)

**Use Cases**:
- Create new collections programmatically
- Automated collection generation
- Collection import operations
- Dynamic collection creation

**Trigger Patterns**:
- "create new collection"
- "add collection"
- "collection creation"
- "create collection mutation"
- "new collection"
- "generate collection"


---

### collectionUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectionupdate

**Domain File**: `commonQuery.js` (collection management operations)

**Use Cases**:
- Update collection information and rules
- Modify collection SEO and metadata
- Collection reorganization
- Bulk collection updates

**Trigger Patterns**:
- "update collection"
- "modify collection"
- "edit collection details"
- "collection update mutation"
- "change collection rules"
- "collection optimization"


# WEBHOOK MANAGEMENT OPERATIONS

## Webhook Configuration & Management

### webhookSubscription Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/webhooksubscription

**Domain File**: `commonQuery.js` (general webhook operations)

**Use Cases**:
- Retrieve webhook subscription details
- Check webhook configuration and status
- Monitor webhook delivery and failures
- Webhook debugging and troubleshooting

**Trigger Patterns**:
- "get webhook details"
- "fetch webhook subscription"
- "webhook configuration query"
- "webhook status check"
- "webhook debugging"
- "webhook monitoring"


---

### webhookSubscriptions Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/webhooksubscriptions

**Domain File**: `commonQuery.js` (general webhook operations)

**Use Cases**:
- List all webhook subscriptions
- Webhook management and organization
- Bulk webhook operations
- Webhook audit and compliance

**Trigger Patterns**:
- "get webhooks list"
- "fetch all webhooks"
- "webhook subscriptions query"
- "webhook management"
- "webhook audit"
- "list webhook subscriptions"


---

### webhookSubscriptionCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/webhooksubscriptioncreate

**Domain File**: `commonQuery.js` (webhook management operations)

**Use Cases**:
- Create new webhook subscriptions
- Set up event monitoring and notifications
- Configure webhook endpoints and topics
- Automated webhook registration

**Trigger Patterns**:
- "create webhook subscription"
- "setup webhook"
- "webhook registration"
- "configure webhook"
- "add webhook endpoint"
- "webhook setup"


---

### webhookSubscriptionUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/webhooksubscriptionupdate

**Domain File**: `commonQuery.js` (webhook management operations)

**Use Cases**:
- Update webhook configuration and endpoints
- Modify webhook delivery settings
- Change webhook authentication
- Webhook maintenance and optimization

**Trigger Patterns**:
- "update webhook"
- "modify webhook subscription"
- "webhook configuration update"
- "change webhook endpoint"
- "webhook maintenance"
- "update webhook settings"


---

### webhookSubscriptionDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/webhooksubscriptiondelete

**Domain File**: `commonQuery.js` (webhook management operations)

**Use Cases**:
- Remove unused webhook subscriptions
- Webhook cleanup and maintenance
- Decommission webhook endpoints
- Webhook lifecycle management

**Trigger Patterns**:
- "delete webhook"
- "remove webhook subscription"
- "webhook cleanup"
- "decommission webhook"
- "webhook removal"
- "cleanup webhook endpoints"


# METAFIELD OPERATIONS

## Metafield Information & Management

### metafield Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/metafield

**Domain File**: `commonQuery.js` (general metafield operations)

**Use Cases**:
- Retrieve specific metafield values
- Access custom data and metadata
- Get metafield definitions and types
- Metafield validation and verification

**Trigger Patterns**:
- "get metafield"
- "fetch metafield value"
- "metafield query"
- "custom field data"
- "metadata query"
- "metafield by ID"


---

### metafields Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/metafields

**Domain File**: `commonQuery.js` (general metafield operations)

**Use Cases**:
- List metafields by owner and namespace
- Bulk metafield operations and exports
- Metafield analytics and reporting
- Custom data management

**Trigger Patterns**:
- "get metafields list"
- "fetch all metafields"
- "metafields query"
- "custom fields list"
- "metadata listing"
- "bulk metafield data"


---

### metafieldSet Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldset

**Domain File**: `commonQuery.js` (metafield management operations)

**Use Cases**:
- Create or update metafield values
- Set custom data and metadata
- Bulk metafield operations
- Dynamic data management

**Trigger Patterns**:
- "set metafield"
- "update metafield"
- "create metafield"
- "metafield mutation"
- "custom field update"
- "metadata update"


---

### metafieldDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafielddelete

**Domain File**: `commonQuery.js` (metafield management operations)

**Use Cases**:
- Remove unwanted metafield values
- Metafield cleanup and maintenance
- Data privacy and compliance
- Bulk metafield deletion

**Trigger Patterns**:
- "delete metafield"
- "remove metafield"
- "metafield cleanup"
- "remove custom field"
- "metadata cleanup"
- "metafield removal"


---

### metafieldDefinition Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/metafielddefinition

**Domain File**: `commonQuery.js` (metafield management operations)

**Use Cases**:
- Retrieve specific metafield definition details by ID
- Access metafield schema and validation rules
- Get metafield type information and constraints
- Validate metafield structure and configuration

**Trigger Patterns**:
- "get metafield definition"
- "fetch metafield schema"
- "metafield definition query"
- "metafield type info"
- "custom field definition"
- "metafield validation rules"


---

### metafieldDefinitions Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/metafielddefinitions

**Domain File**: `commonQuery.js` (metafield management operations)

**Use Cases**:
- List metafield definitions by owner type (Product, Customer, etc.)
- Get available metafield schemas for specific resources
- Metafield definition management and analytics
- Custom field structure discovery

**Trigger Patterns**:
- "get metafield definitions"
- "list metafield schemas"
- "metafield definitions query"
- "available custom fields"
- "metafield types list"
- "schema definitions"


# METAOBJECT OPERATIONS

## Metaobject Information & Management

### metaobject Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobject

**Domain File**: `commonQuery.js` (general metaobject operations)

**Use Cases**:
- Retrieve specific metaobject details by ID
- Access custom object data and definitions
- Get metaobject field values and capabilities
- Validate metaobject structure and content

**Trigger Patterns**:
- "get metaobject"
- "fetch metaobject details"
- "metaobject query"
- "custom object data"
- "metaobject by ID"
- "object definition query"


---

### metaobjects Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobjects

**Domain File**: `commonQuery.js` (general metaobject operations)

**Use Cases**:
- List metaobjects by type with filtering
- Search metaobjects by display name and handle
- Bulk metaobject operations and analytics
- Custom object management and reporting

**Trigger Patterns**:
- "get metaobjects list"
- "fetch all metaobjects"
- "metaobjects query"
- "custom objects list"
- "object type filtering"
- "metaobject management"


---

### metaobjectCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectcreate

**Domain File**: `commonQuery.js` (metaobject management operations)

**Use Cases**:
- Create new custom metaobjects
- Implement custom data structures
- Set up object-based content management
- Create structured custom fields and data

**Trigger Patterns**:
- "create metaobject"
- "new custom object"
- "metaobject creation"
- "custom object setup"
- "structured data creation"
- "object definition instantiation"


---

### metaobjectUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectupdate

**Domain File**: `commonQuery.js` (metaobject management operations)

**Use Cases**:
- Update existing metaobject field values
- Modify custom object data and properties
- Maintain structured content and data
- Batch update object fields

**Trigger Patterns**:
- "update metaobject"
- "modify custom object"
- "metaobject field update"
- "custom object modification"
- "structured data update"
- "object content update"


---

### metaobjectDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectdelete

**Domain File**: `commonQuery.js` (metaobject management operations)

**Use Cases**:
- Delete custom metaobjects and associated data
- Clean up unused object instances
- Remove structured data and metafields
- Manage object lifecycle and data retention

**Trigger Patterns**:
- "delete metaobject"
- "remove custom object"
- "metaobject deletion"
- "custom object cleanup"
- "structured data removal"
- "object lifecycle management"


# SHOP CONFIGURATION OPERATIONS

## Shop Information & Settings

### shop Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/shop

**Domain File**: `commonQuery.js` (general shop operations)

**Use Cases**:
- Retrieve shop configuration and settings
- Get shop branding and contact information
- Access shop policies and legal information
- Shop analytics and performance data

**Trigger Patterns**:
- "get shop details"
- "fetch shop information"
- "shop configuration query"
- "shop settings"
- "store information"
- "shop data"


---

### shopUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/shopupdate

**Domain File**: `commonQuery.js` (shop management operations)

**Use Cases**:
- Update shop configuration and settings
- Modify shop branding and information
- Configure shop policies and legal data
- Shop optimization and maintenance

**Trigger Patterns**:
- "update shop"
- "modify shop settings"
- "shop configuration update"
- "change shop information"
- "shop settings update"
- "configure shop"


# BULK OPERATIONS

## Bulk Data Processing

### bulkOperationRunQuery Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/bulkoperationrunquery

**Domain File**: `commonQuery.js` (bulk processing operations)

**Use Cases**:
- Execute large-scale data queries
- Bulk data export and analysis
- Performance-optimized data retrieval
- Background data processing

**Trigger Patterns**:
- "bulk operation"
- "bulk query execution"
- "large data export"
- "bulk data processing"
- "background query"
- "mass data retrieval"


---

### currentBulkOperation Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/currentbulkoperation

**Domain File**: `commonQuery.js` (bulk processing operations)

**Use Cases**:
- Monitor bulk operation progress
- Check bulk operation status and results
- Handle bulk operation completion
- Bulk operation error handling

**Trigger Patterns**:
- "check bulk operation"
- "bulk operation status"
- "monitor bulk progress"
- "bulk operation results"
- "bulk processing status"
- "bulk operation monitoring"


# ADDITIONAL SHOPIFY QUERIES

## Abandoned Checkout Operations

### abandonedCheckouts Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/abandonedcheckouts

**Domain File**: `commonQuery.js` (general checkout operations)

**Use Cases**:
- Retrieve abandoned checkout information for recovery
- Analyze checkout abandonment patterns
- Implement abandoned cart email campaigns
- Track conversion optimization opportunities

**Trigger Patterns**:
- "get abandoned checkouts"
- "fetch abandoned carts"
- "checkout abandonment query"
- "abandoned checkout recovery"
- "cart abandonment data"


---

### abandonedCheckoutsCount Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/abandonedcheckoutscount

**Domain File**: `commonQuery.js` (general checkout operations)

**Use Cases**:
- Count total abandoned checkouts for reporting
- Monitor abandonment rate metrics
- Dashboard analytics and KPIs
- Performance tracking and optimization

**Trigger Patterns**:
- "count abandoned checkouts"
- "abandoned checkout metrics"
- "checkout abandonment count"
- "cart abandonment stats"
- "abandonment analytics"


---

### abandonment Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/abandonment

**Domain File**: `commonQuery.js` (general abandonment operations)

**Use Cases**:
- Get detailed abandonment tracking data
- Analyze specific abandonment events
- Customer journey analysis
- Conversion funnel optimization

**Trigger Patterns**:
- "get abandonment details"
- "fetch abandonment data"
- "abandonment tracking query"
- "abandonment analysis"
- "checkout funnel data"


## Blog & Article Operations

### blog Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/blog

**Domain File**: `commonQuery.js` (general blog operations)

**Use Cases**:
- Retrieve blog information and settings
- Get blog posts and article data
- Blog SEO and metadata management
- Content management operations

**Trigger Patterns**:
- "get blog details"
- "fetch blog information"
- "blog data query"
- "blog content"
- "blog management"


---

### blogs Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/blogs

**Domain File**: `commonQuery.js` (general blog operations)

**Use Cases**:
- List all blogs with pagination
- Blog management and organization
- Content analytics and reporting
- Bulk blog operations

**Trigger Patterns**:
- "get blogs list"
- "fetch all blogs"
- "blog listing query"
- "blog management"
- "content management"


---

### article Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/article

**Domain File**: `commonQuery.js` (general article operations)

**Use Cases**:
- Retrieve article content and metadata
- Get article SEO and publication data
- Article performance analytics
- Content optimization

**Trigger Patterns**:
- "get article details"
- "fetch article content"
- "article data query"
- "blog post content"
- "article management"


---

### articles Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/articles

**Domain File**: `commonQuery.js` (general article operations)

**Use Cases**:
- List articles with filtering and search
- Content management and organization
- Article analytics and reporting
- Bulk article operations

**Trigger Patterns**:
- "get articles list"
- "fetch all articles"
- "article listing query"
- "content listing"
- "blog posts management"


## App Management Operations

### app Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/app

**Domain File**: `pricingQuery.js` (app operations)

**Use Cases**:
- Retrieve app installation details
- Get app configuration and settings
- App performance and usage data
- App management operations

**Trigger Patterns**:
- "get app details"
- "fetch app information"
- "app data query"
- "app configuration"
- "app management"


---

### appInstallation Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/appinstallation

**Domain File**: `pricingQuery.js` (app installation operations)

**Use Cases**:
- Get app installation status and details
- Monitor app installation health
- App dependency management
- Installation troubleshooting

**Trigger Patterns**:
- "get app installation"
- "check app status"
- "app installation query"
- "app health check"
- "installation details"


---

### currentAppInstallation Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/currentappinstallation

**Domain File**: `pricingQuery.js` (current app operations)

**Use Cases**:
- Get current app installation context
- Access app permissions and scopes
- App authentication validation
- Current session app data

**Trigger Patterns**:
- "get current app"
- "current app installation"
- "app context query"
- "current app details"
- "app session data"


# ACCESS TOKEN OPERATIONS

## Access Token Management

### storefrontAccessTokenCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/storefrontaccesstokencreate

**Domain File**: `pricingQuery.js` (access and authentication operations)

**Use Cases**:
- Create storefront access tokens for Storefront API access
- Generate tokens for headless commerce implementations
- Set up access tokens for custom storefronts
- Enable third-party storefront integrations

**Trigger Patterns**:
- "create storefront token"
- "generate storefront access"
- "storefront API token"
- "headless commerce token"
- "storefront authentication"
- "custom storefront access"


---

### storefrontAccessTokenDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/storefrontaccesstokendelete

**Domain File**: `pricingQuery.js` (access and authentication operations)

**Use Cases**:
- Delete unused storefront access tokens
- Revoke access for discontinued integrations
- Manage token lifecycle and security
- Clean up expired or compromised tokens

**Trigger Patterns**:
- "delete storefront token"
- "revoke storefront access"
- "remove storefront token"
- "storefront token cleanup"
- "revoke API access"
- "token security management"


---

### delegateAccessTokenCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/delegateaccesstokencreate

**Domain File**: `pricingQuery.js` (access and authentication operations)

**Use Cases**:
- Create delegate access tokens for app subsystems
- Enable controlled access delegation within apps
- Set up time-limited access for specific scopes
- Implement secure subsystem authentication

**Trigger Patterns**:
- "create delegate token"
- "delegate access creation"
- "subsystem authentication"
- "controlled access delegation"
- "temporary access token"
- "scoped access delegation"


## Carrier Service Operations

### carrierService Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/carrierservice

**Domain File**: `commonQuery.js` (shipping operations)

**Use Cases**:
- Retrieve carrier service configuration
- Get shipping rate calculations
- Carrier service management
- Shipping method optimization

**Trigger Patterns**:
- "get carrier service"
- "fetch shipping carrier"
- "carrier service query"
- "shipping service details"
- "carrier configuration"


---

### carrierServices Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/carrierservices

**Domain File**: `commonQuery.js` (shipping operations)

**Use Cases**:
- List all carrier services
- Shipping method management
- Carrier service analytics
- Bulk shipping operations

**Trigger Patterns**:
- "get carrier services"
- "list shipping carriers"
- "carrier services query"
- "shipping methods list"
- "carrier management"


## Company & Business Operations

### company Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/company

**Domain File**: `commonQuery.js` (B2B operations)

**Use Cases**:
- Retrieve B2B company information
- Get company contact and location data
- B2B customer management
- Company hierarchy tracking

**Trigger Patterns**:
- "get company details"
- "fetch company information"
- "B2B company query"
- "business account data"
- "company management"


---

### companies Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/companies

**Domain File**: `commonQuery.js` (B2B operations)

**Use Cases**:
- List B2B companies with filtering
- Company management and analytics
- B2B customer segmentation
- Bulk company operations

**Trigger Patterns**:
- "get companies list"
- "fetch all companies"
- "B2B companies query"
- "business accounts list"
- "company directory"


---

### companyCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/companycreate

**Domain File**: `commonQuery.js` (B2B management operations)

**Use Cases**:
- Create new B2B companies in Shopify Plus stores
- Set up company locations and shipping addresses
- Create company contacts and main contacts
- Establish B2B customer hierarchies

**Trigger Patterns**:
- "create company"
- "setup B2B company"
- "B2B company creation"
- "business account setup"
- "company registration"
- "B2B customer setup"


---

### companyContactCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/companycontactcreate

**Domain File**: `commonQuery.js` (B2B management operations)

**Use Cases**:
- Create company contacts and associated customers
- Add new contacts to existing B2B companies
- Manage B2B user relationships
- Set up company contact hierarchies

**Trigger Patterns**:
- "create company contact"
- "add company contact"
- "B2B contact creation"
- "company user setup"
- "business contact creation"
- "company member addition"


## Discount Operations

### codeDiscountNode Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/codediscountnode

**Domain File**: `commonQuery.js` (discount operations)

**Use Cases**:
- Retrieve discount code details and configuration
- Get discount usage analytics and performance
- Discount validation and verification
- Promotional campaign management

**Trigger Patterns**:
- "get discount code"
- "fetch discount details"
- "discount code query"
- "promotional code data"
- "discount management"


---

### codeDiscountNodes Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/codediscountnodes

**Domain File**: `commonQuery.js` (discount operations)

**Use Cases**:
- List all discount codes with filtering
- Discount campaign management
- Promotional analytics and reporting
- Bulk discount operations

**Trigger Patterns**:
- "get discount codes"
- "list all discounts"
- "discount codes query"
- "promotional codes list"
- "discount management"


---

### automaticDiscountNode Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/automaticdiscountnode

**Domain File**: `commonQuery.js` (discount operations)

**Use Cases**:
- Retrieve automatic discount configuration
- Get automatic discount performance data
- Discount rule validation
- Promotional automation management

**Trigger Patterns**:
- "get automatic discount"
- "fetch auto discount"
- "automatic discount query"
- "discount automation"
- "auto promotional rules"


---

### automaticDiscountNodes Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/automaticdiscountnodes

**Domain File**: `commonQuery.js` (discount operations)

**Use Cases**:
- List all automatic discounts
- Discount automation management
- Promotional rule analytics
- Bulk automatic discount operations

**Trigger Patterns**:
- "get automatic discounts"
- "list auto discounts"
- "automatic discounts query"
- "discount automation list"
- "promotional rules"


## Fulfillment Operations

### fulfillmentOrder Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/fulfillmentorder

**Domain File**: `commonQuery.js` (fulfillment operations)

**Use Cases**:
- Retrieve fulfillment order details
- Get fulfillment status and tracking
- Fulfillment workflow management
- Shipping and delivery tracking

**Trigger Patterns**:
- "get fulfillment order"
- "fetch fulfillment details"
- "fulfillment order query"
- "shipping order data"
- "fulfillment tracking"


---

### fulfillmentOrders Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/fulfillmentorders

**Domain File**: `commonQuery.js` (fulfillment operations)

**Use Cases**:
- List fulfillment orders with filtering
- Fulfillment workflow management
- Shipping analytics and reporting
- Bulk fulfillment operations

**Trigger Patterns**:
- "get fulfillment orders"
- "list fulfillment orders"
- "fulfillment orders query"
- "shipping orders list"
- "fulfillment management"


## Gift Card Operations

### giftCard Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/giftcard

**Domain File**: `commonQuery.js` (gift card operations)

**Use Cases**:
- Retrieve gift card details and balance
- Get gift card transaction history
- Gift card validation and verification
- Customer service and support

**Trigger Patterns**:
- "get gift card"
- "fetch gift card details"
- "gift card query"
- "gift card balance"
- "gift card validation"


---

### giftCards Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/giftcards

**Domain File**: `commonQuery.js` (gift card operations)

**Use Cases**:
- List gift cards with filtering and search
- Gift card management and analytics
- Customer gift card tracking
- Bulk gift card operations

**Trigger Patterns**:
- "get gift cards"
- "list gift cards"
- "gift cards query"
- "gift card management"
- "gift card analytics"


## Location Operations

### location Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/location

**Domain File**: `commonQuery.js` (location operations)

**Use Cases**:
- Retrieve location details and configuration
- Get location inventory and capacity data
- Location management and optimization
- Multi-location analytics

**Trigger Patterns**:
- "get location details"
- "fetch location information"
- "location query"
- "store location data"
- "location management"


---

### locations Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/locations

**Domain File**: `commonQuery.js` (location operations)

**Use Cases**:
- List all locations with filtering
- Multi-location management
- Location analytics and reporting
- Inventory distribution planning

**Trigger Patterns**:
- "get locations list"
- "fetch all locations"
- "locations query"
- "store locations"
- "location directory"


---

### locationEdit Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/locationedit

**Domain File**: `commonQuery.js` (location management operations)

**Use Cases**:
- Update location name and address information
- Modify location fulfillment settings
- Edit location metadata and properties
- Manage warehouse and store details

**Trigger Patterns**:
- "edit location"
- "update location"
- "modify location details"
- "location update"
- "location configuration"
- "location maintenance"


## Market Operations

### market Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/market

**Domain File**: `commonQuery.js` (market operations)

**Use Cases**:
- Retrieve market configuration and settings
- Get market-specific pricing and currency
- International selling management
- Market analytics and performance

**Trigger Patterns**:
- "get market details"
- "fetch market information"
- "market query"
- "international market"
- "market configuration"


---

### markets Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/markets

**Domain File**: `commonQuery.js` (market operations)

**Use Cases**:
- List all markets with configuration
- International selling management
- Market analytics and reporting
- Global expansion planning

**Trigger Patterns**:
- "get markets list"
- "fetch all markets"
- "markets query"
- "international markets"
- "global selling"


---

### marketCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/marketcreate

**Domain File**: `commonQuery.js` (market management operations)

**Use Cases**:
- Create new markets for international expansion
- Set up B2B markets for specific regions
- Configure regional markets with currency settings
- Establish geographic market conditions

**Trigger Patterns**:
- "create market"
- "setup new market"
- "international market creation"
- "B2B market setup"
- "regional market configuration"
- "market expansion"


---

### marketUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/marketupdate

**Domain File**: `commonQuery.js` (market management operations)

**Use Cases**:
- Update market configuration and settings
- Modify market status and availability
- Change market conditions and regions
- Update currency and catalog assignments

**Trigger Patterns**:
- "update market"
- "modify market settings"
- "market configuration update"
- "change market region"
- "market status update"
- "market optimization"


---

### marketDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/marketdelete

**Domain File**: `commonQuery.js` (market management operations)

**Use Cases**:
- Remove discontinued markets
- Market cleanup and consolidation
- Geographic market decommissioning
- Market lifecycle management

**Trigger Patterns**:
- "delete market"
- "remove market"
- "market deletion"
- "decommission market"
- "market cleanup"
- "market consolidation"


## Page Operations

### page Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/page

**Domain File**: `commonQuery.js` (page operations)

**Use Cases**:
- Retrieve page content and metadata
- Get page SEO and publication data
- Content management and optimization
- Page performance analytics

**Trigger Patterns**:
- "get page details"
- "fetch page content"
- "page query"
- "page content"
- "page management"


---

### pages Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/pages

**Domain File**: `commonQuery.js` (page operations)

**Use Cases**:
- List pages with filtering and search
- Content management and organization
- Page analytics and reporting
- Bulk page operations

**Trigger Patterns**:
- "get pages list"
- "fetch all pages"
- "pages query"
- "content pages"
- "page directory"


## Returns Operations

### return Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/return

**Domain File**: `commonQuery.js` (returns operations)

**Use Cases**:
- Retrieve return request details
- Get return status and processing data
- Return workflow management
- Customer service operations

**Trigger Patterns**:
- "get return details"
- "fetch return information"
- "return query"
- "return request"
- "return management"


---

### returns Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/returns

**Domain File**: `commonQuery.js` (returns operations)

**Use Cases**:
- List returns with filtering and search
- Return analytics and reporting
- Bulk return processing
- Customer service management

**Trigger Patterns**:
- "get returns list"
- "fetch all returns"
- "returns query"
- "return requests"
- "returns management"


# PRODUCT VARIANT OPERATIONS

## Product Variant Information & Management

### productVariant Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/productvariant

**Domain File**: `commonQuery.js` (general product operations)

**Use Cases**:
- Retrieve specific product variant details by ID
- Access variant pricing and inventory information
- Get variant-specific metadata and options
- Build product detail pages with variant data

**Trigger Patterns**:
- "get product variant"
- "fetch variant details"
- "product variant query"
- "variant by ID"
- "single variant data"
- "variant information"


---

### productVariants Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/productvariants

**Domain File**: `commonQuery.js` (general product operations)

**Use Cases**:
- List product variants with filtering and search
- Filter variants by SKU, barcode, or inventory quantity
- Product variant management and analytics
- Bulk variant operations and reporting

**Trigger Patterns**:
- "get product variants"
- "list variants"
- "product variants query"
- "search variants"
- "variant listing"
- "variant management"


---

### productVariantsBulkCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productvariantsbulkcreate

**Domain File**: `commonQuery.js` (product management operations)

**Use Cases**:
- Create multiple product variants in one operation
- Bulk import of variant configurations
- Add multiple color/size combinations simultaneously
- Efficient product catalog expansion

**Trigger Patterns**:
- "bulk create variants"
- "create multiple variants"
- "bulk variant creation"
- "mass variant import"
- "variant bulk operation"
- "multiple variant setup"


---

### productVariantsBulkUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productvariantsbulkupdate

**Domain File**: `commonQuery.js` (product management operations)

**Use Cases**:
- Update multiple product variants simultaneously
- Bulk pricing updates and inventory adjustments
- Mass variant configuration changes
- Synchronize variant data from external systems

**Trigger Patterns**:
- "bulk update variants"
- "update multiple variants"
- "bulk variant update"
- "mass variant modification"
- "variant bulk operation"
- "bulk variant sync"


---

### productVariantsBulkDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productvariantsbulkdelete

**Domain File**: `commonQuery.js` (product management operations)

**Use Cases**:
- Delete multiple product variants in one operation
- Bulk cleanup of discontinued variants
- Mass variant removal operations
- Product catalog maintenance

**Trigger Patterns**:
- "bulk delete variants"
- "delete multiple variants"
- "bulk variant deletion"
- "mass variant removal"
- "variant bulk cleanup"
- "remove multiple variants"


# DRAFT ORDER OPERATIONS

## Draft Order Management

### draftOrder Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/draftorder

**Domain File**: `commonQuery.js` (general order operations)

**Use Cases**:
- Retrieve draft order details for manual order creation
- Access draft orders for phone, in-person, or chat sales
- Get draft order information for invoice sending
- Manage custom items and pre-orders

**Trigger Patterns**:
- "get draft order"
- "fetch draft order details"
- "draft order query"
- "manual order data"
- "draft order information"
- "pending order details"


---

### draftOrders Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/draftorders

**Domain File**: `commonQuery.js` (general order operations)

**Use Cases**:
- List draft orders with filtering and pagination
- Draft order management and analytics
- Track pending manual orders
- Monitor draft order conversion rates

**Trigger Patterns**:
- "get draft orders"
- "list draft orders"
- "draft orders query"
- "pending orders list"
- "manual orders management"
- "draft order analytics"


---

### draftOrderCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/draftordercreate

**Domain File**: `commonQuery.js` (order management operations)

**Use Cases**:
- Create draft orders for manual sales processing
- Generate orders for phone, in-person, or chat sales
- Create custom orders with special pricing
- Support B2B and wholesale order creation

**Trigger Patterns**:
- "create draft order"
- "manual order creation"
- "draft order setup"
- "phone order creation"
- "custom order creation"
- "wholesale order setup"


---

### draftOrderUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/draftorderupdate

**Domain File**: `commonQuery.js` (order management operations)

**Use Cases**:
- Update existing draft order details
- Modify draft order line items and pricing
- Update shipping and billing addresses
- Manage draft order lifecycle changes

**Trigger Patterns**:
- "update draft order"
- "modify draft order"
- "edit draft order"
- "draft order modification"
- "change draft order"
- "draft order maintenance"


---

### draftOrderComplete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/draftordercomplete

**Domain File**: `commonQuery.js` (order processing operations)

**Use Cases**:
- Convert draft orders to completed orders
- Process payment and inventory reservation
- Complete manual sales transactions
- Finalize custom order processing

**Trigger Patterns**:
- "complete draft order"
- "finalize draft order"
- "convert draft order"
- "process draft order"
- "draft order completion"
- "manual order processing"


# REFUND OPERATIONS

## Refund Management

### refundCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/refundcreate

**Domain File**: `commonQuery.js` (order processing operations)

**Use Cases**:
- Process partial and full refunds for orders
- Refund line items, shipping costs, duties, and taxes
- Issue store credit refunds
- Handle customer returns and exchanges

**Trigger Patterns**:
- "create refund"
- "process refund"
- "refund order"
- "customer refund"
- "return processing"
- "refund creation"


# TRANSLATION OPERATIONS

## Translation Management

### translationsRegister Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/translationsregister

**Domain File**: `commonQuery.js` (general translation operations)

**Use Cases**:
- Create or update translations for store resources
- Implement multi-language content management
- Manage market-specific translations
- Localize product and content data

**Trigger Patterns**:
- "register translations"
- "create translations"
- "update translations"
- "translate content"
- "localization setup"
- "multi-language content"


# PUBLICATION OPERATIONS

## Publication Management

### publishableUnpublish Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/publishableunpublish

**Domain File**: `commonQuery.js` (general publication operations)

**Use Cases**:
- Unpublish products or collections from channels
- Remove resources from specific publications
- Control resource visibility across platforms
- Manage channel-specific product availability

**Trigger Patterns**:
- "unpublish product"
- "remove from channel"
- "unpublish resource"
- "publication removal"
- "channel unpublish"
- "visibility control"


---

### publication Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/publication

**Domain File**: `commonQuery.js` (general publication operations)

**Use Cases**:
- Retrieve specific publication details by ID
- Get publication collections and products
- Access publication configuration and settings
- Monitor publication performance and analytics

**Trigger Patterns**:
- "get publication details"
- "fetch publication information"
- "publication query"
- "publication by ID"
- "single publication data"
- "publication configuration"


---

### publications Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/publications

**Domain File**: `commonQuery.js` (general publication operations)

**Use Cases**:
- List all publications with filtering and pagination
- Publication management and analytics
- Channel configuration and monitoring
- Bulk publication operations

**Trigger Patterns**:
- "get publications list"
- "fetch all publications"
- "publications query"
- "channel publications"
- "publication directory"
- "publication management"


# CHECKOUT OPERATIONS

## Checkout Profile Management

### checkoutProfiles Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/checkoutprofiles

**Domain File**: `commonQuery.js` (checkout operations)

**Use Cases**:
- List checkout profiles for shop configuration
- Manage checkout and accounts editor settings
- Monitor checkout profile configurations
- Checkout customization management

**Trigger Patterns**:
- "get checkout profiles"
- "fetch checkout profiles"
- "checkout profiles query"
- "checkout configuration"
- "checkout settings"
- "checkout profile management"


# SHIPPING OPERATIONS

## Delivery Profile Management

### deliveryProfiles Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/deliveryprofiles

**Domain File**: `commonQuery.js` (shipping operations)

**Use Cases**:
- List saved delivery profiles for shipping configuration
- Manage merchant-owned delivery settings
- Configure location-based shipping groups
- Setup shipping zones and methods

**Trigger Patterns**:
- "get delivery profiles"
- "fetch shipping profiles"
- "delivery profiles query"
- "shipping configuration"
- "delivery settings"
- "shipping zones management"


# PRODUCT FEED OPERATIONS

## Product Feed Management

### productFeed Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/productfeed

**Domain File**: `commonQuery.js` (product feed operations)

**Use Cases**:
- Retrieve specific product feed information by ID
- Access product feed status and configuration
- Manage product listing feeds
- Monitor feed performance and status

**Trigger Patterns**:
- "get product feed"
- "fetch product feed"
- "product feed query"
- "product feed by ID"
- "feed configuration"
- "product listing feed"


# TRANSACTION OPERATIONS

## Tender Transaction Management

### tenderTransactions Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/tendertransactions

**Domain File**: `commonQuery.js` (transaction operations)

**Use Cases**:
- List tender transactions associated with the shop
- Monitor financial transaction activity
- Track payment methods and processing
- Analyze transaction patterns and history

**Trigger Patterns**:
- "get tender transactions"
- "fetch financial transactions"
- "tender transactions query"
- "payment transactions"
- "transaction history"
- "financial activity"


# TAG MANAGEMENT OPERATIONS

## Tag Manipulation

### tagsAdd Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/tagsadd

**Domain File**: `commonQuery.js` (general tag operations)

**Use Cases**:
- Add tags to orders, draft orders, customers, products, or articles
- Bulk tag addition for organization
- Resource categorization and labeling
- Implement tagging workflows

**Trigger Patterns**:
- "add tags"
- "tag resources"
- "add tags to product"
- "tag customer"
- "bulk tag addition"
- "resource tagging"


---

### tagsRemove Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/tagsremove

**Domain File**: `commonQuery.js` (general tag operations)

**Use Cases**:
- Remove tags from orders, draft orders, customers, products, or articles
- Tag cleanup and maintenance
- Resource tag management
- Bulk tag removal operations

**Trigger Patterns**:
- "remove tags"
- "delete tags"
- "remove tags from product"
- "untag customer"
- "bulk tag removal"
- "tag cleanup"


# CUSTOMER MARKETING OPERATIONS

## Email Marketing Consent Management

### customerEmailMarketingConsentUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/customeremailmarketingconsentupdate

**Domain File**: `commonQuery.js` (customer marketing operations)

**Use Cases**:
- Update customer email marketing consent information
- Manage marketing opt-in levels and preferences
- Handle GDPR and privacy compliance
- Track consent updates and source locations

**Trigger Patterns**:
- "update email marketing consent"
- "customer marketing consent"
- "email marketing preferences"
- "marketing opt-in update"
- "consent management"
- "privacy consent update"


# SHOPIFY FUNCTIONS OPERATIONS

## Function Management

### shopifyFunctions Query
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/queries/shopifyfunctions

**Domain File**: `commonQuery.js` (function management operations)

**Use Cases**:
- List Shopify Functions owned by the querying API client
- Monitor function deployment and status
- Manage function configurations and API types
- Analyze function usage and performance

**Trigger Patterns**:
- "get shopify functions"
- "list functions"
- "shopify functions query"
- "function management"
- "API client functions"
- "function deployment status"


# ADDITIONAL SHOPIFY MUTATIONS

## Customer Management Mutations

### customerCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/customercreate

**Domain File**: `commonQuery.js` (customer management operations)

**Use Cases**:
- Create new customer accounts programmatically
- Import customers from external systems
- Customer registration automation
- Bulk customer creation

**Trigger Patterns**:
- "create new customer"
- "add customer"
- "customer creation"
- "create customer account"
- "customer registration"
- "import customers"


---

### customerUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerupdate

**Domain File**: `commonQuery.js` (customer management operations)

**Use Cases**:
- Update customer profile information
- Modify customer addresses and contact details
- Update customer tags and segmentation
- Customer data synchronization

**Trigger Patterns**:
- "update customer"
- "modify customer"
- "edit customer details"
- "customer update mutation"
- "change customer information"
- "sync customer data"


---

### customerDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerdelete

**Domain File**: `commonQuery.js` (customer management operations)

**Use Cases**:
- Remove customer accounts (GDPR compliance)
- Customer data cleanup and maintenance
- Account deactivation and removal
- Data privacy and compliance

**Trigger Patterns**:
- "delete customer"
- "remove customer"
- "customer deletion"
- "deactivate customer"
- "customer cleanup"
- "GDPR customer removal"


## Discount Management Mutations

### discountCodeCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/discountcodecreate

**Domain File**: `commonQuery.js` (discount operations)

**Use Cases**:
- Create discount codes for promotional campaigns
- Generate coupon codes for marketing
- Set up seasonal and event-based discounts
- Automated discount code generation

**Trigger Patterns**:
- "create discount code"
- "generate coupon code"
- "discount code creation"
- "promotional code setup"
- "coupon generation"
- "discount campaign"


---

### discountAutomaticCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/discountautomaticcreate

**Domain File**: `commonQuery.js` (discount operations)

**Use Cases**:
- Create automatic discounts for cart rules
- Set up quantity-based discounts
- Implement buy-one-get-one promotions
- Automated promotional rules

**Trigger Patterns**:
- "create automatic discount"
- "setup auto discount"
- "automatic discount creation"
- "cart rule discount"
- "promotional automation"
- "discount rule setup"


## Collection Management Mutations

### collectionCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectioncreate

**Domain File**: `commonQuery.js` (collection management operations)

**Use Cases**:
- Create new collections programmatically
- Automated collection generation
- Collection import operations
- Dynamic collection creation

**Trigger Patterns**:
- "create new collection"
- "add collection"
- "collection creation"
- "create collection mutation"
- "new collection"
- "generate collection"


---

### collectionUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectionupdate

**Domain File**: `commonQuery.js` (collection management operations)

**Use Cases**:
- Update collection information and rules
- Modify collection SEO and metadata
- Collection reorganization
- Bulk collection updates

**Trigger Patterns**:
- "update collection"
- "modify collection"
- "edit collection details"
- "collection update mutation"
- "change collection rules"
- "collection optimization"


---

### collectionDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectiondelete

**Domain File**: `commonQuery.js` (collection management operations)

**Use Cases**:
- Remove unused collections
- Collection cleanup and maintenance
- Collection lifecycle management
- Bulk collection deletion

**Trigger Patterns**:
- "delete collection"
- "remove collection"
- "collection deletion"
- "cleanup collections"
- "collection removal"
- "collection maintenance"


## Order Processing Mutations

### orderCapture Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/ordercapture

**Domain File**: `commonQuery.js` (order processing operations)

**Use Cases**:
- Capture payment for authorized orders
- Complete payment processing workflow
- Handle partial payment captures
- Payment reconciliation

**Trigger Patterns**:
- "capture order payment"
- "process order payment"
- "payment capture"
- "complete payment"
- "capture authorization"
- "finalize payment"


---

### orderCancel Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/ordercancel

**Domain File**: `commonQuery.js` (order processing operations)

**Use Cases**:
- Cancel orders before fulfillment
- Handle order cancellation requests
- Inventory restoration after cancellation
- Customer service operations

**Trigger Patterns**:
- "cancel order"
- "order cancellation"
- "cancel order request"
- "order cancellation mutation"
- "void order"
- "order cancellation"


---

### orderClose Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderclose

**Domain File**: `commonQuery.js` (order processing operations)

**Use Cases**:
- Close completed orders
- Finalize order processing workflow
- Mark orders as complete
- Order lifecycle management

**Trigger Patterns**:
- "close order"
- "complete order"
- "finalize order"
- "order completion"
- "mark order complete"
- "order closure"


## Fulfillment Processing Mutations

### fulfillmentCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentcreate

**Domain File**: `commonQuery.js` (fulfillment operations)

**Use Cases**:
- Create fulfillment records for shipped orders
- Track shipping and delivery information
- Update fulfillment status and tracking
- Shipping workflow automation

**Trigger Patterns**:
- "create fulfillment"
- "ship order"
- "fulfillment creation"
- "shipping fulfillment"
- "order fulfillment"
- "shipping tracking"


---

### fulfillmentCancel Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentcancel

**Domain File**: `commonQuery.js` (fulfillment operations)

**Use Cases**:
- Cancel fulfillment before shipping
- Handle fulfillment cancellation requests
- Inventory restoration after cancellation
- Shipping workflow management

**Trigger Patterns**:
- "cancel fulfillment"
- "fulfillment cancellation"
- "cancel shipping"
- "fulfillment cancellation mutation"
- "void fulfillment"
- "shipping cancellation"


## Blog & Content Mutations

### blogCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/blogcreate

**Domain File**: `commonQuery.js` (blog operations)

**Use Cases**:
- Create new blogs for content management
- Set up blog structure and configuration
- Content organization and categorization
- SEO and content strategy implementation

**Trigger Patterns**:
- "create blog"
- "add blog"
- "blog creation"
- "setup blog"
- "new blog"
- "blog setup"


---

### blogUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/blogupdate

**Domain File**: `commonQuery.js` (blog operations)

**Use Cases**:
- Update blog settings and configuration
- Modify blog SEO and metadata
- Blog optimization and maintenance
- Content strategy updates

**Trigger Patterns**:
- "update blog"
- "modify blog"
- "blog update"
- "edit blog settings"
- "blog configuration"
- "blog optimization"


---

### blogDelete Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/blogdelete

**Domain File**: `commonQuery.js` (blog operations)

**Use Cases**:
- Remove unused blogs
- Blog cleanup and maintenance
- Content reorganization
- Blog lifecycle management

**Trigger Patterns**:
- "delete blog"
- "remove blog"
- "blog deletion"
- "cleanup blog"
- "blog removal"
- "blog maintenance"


## Gift Card Mutations

### giftCardCreate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/giftcardcreate

**Domain File**: `commonQuery.js` (gift card operations)

**Use Cases**:
- Create gift cards for promotions
- Generate gift card codes for campaigns
- Customer service gift card issuance
- Promotional gift card creation

**Trigger Patterns**:
- "create gift card"
- "generate gift card"
- "gift card creation"
- "issue gift card"
- "promotional gift card"
- "gift card generation"


---

### giftCardUpdate Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/giftcardupdate

**Domain File**: `commonQuery.js` (gift card operations)

**Use Cases**:
- Update gift card information and status
- Modify gift card balance and expiration
- Gift card maintenance and management
- Customer service operations

**Trigger Patterns**:
- "update gift card"
- "modify gift card"
- "gift card update"
- "edit gift card"
- "gift card maintenance"
- "adjust gift card"


---

### giftCardDisable Mutation
**Official Documentation**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/giftcarddisable

**Domain File**: `commonQuery.js` (gift card operations)

**Use Cases**:
- Disable lost or stolen gift cards
- Gift card security and fraud prevention
- Customer service operations
- Gift card lifecycle management

**Trigger Patterns**:
- "disable gift card"
- "deactivate gift card"
- "gift card disable"
- "suspend gift card"
- "gift card security"
- "gift card deactivation"


## Implementation Guidelines

### Domain File Selection Rules

**Use `commonQuery.js` for:**
- Product operations (CRUD, search, variants, collections)
- Customer management (profiles, addresses, orders)
- Order processing and fulfillment
- Shop configuration and settings
- Metafield operations
- Webhook management
- Inventory tracking and management
- Bulk operations and data processing
- General Shopify admin operations

**Use `pricingQuery.js` for:**
- App subscriptions and billing (appSubscriptionCreate, appSubscriptionCancel)
- One-time charges and purchases
- Usage records and metered billing (appUsageRecordCreate)
- Plan management and upgrades
- Payment processing and financial operations
- Subscription cancellations and modifications
- Billing history and invoices
- App access scope management (appRevokeAccessScopes)

**Use `imageOptimizerQuery.js` for:**
- Product media and images (fileCreate, fileUpdate, fileDelete)
- File uploads and management (files query)
- Image optimization operations
- Media galleries and collections
- Alt text and SEO for images
- File metadata and properties
- Media asset organization and cleanup

### WebFetch Workflow Pattern

For every GraphQL operation request:

1. **Pattern Recognition**: Match user request to trigger patterns
2. **Documentation Fetch**: WebFetch specific Shopify API page
3. **Structure Extraction**: Get current fields, types, and requirements
4. **Domain Selection**: Choose appropriate query file based on operation
5. **Implementation**: Create query/mutation with proper error handling
6. **Controller Integration**: Build endpoint with validation and logging
7. **Testing**: Validate functionality and error scenarios

### Example Implementation Workflow

```markdown
User Request: "create customer subscription billing"

1. **Pattern Match**: "subscription billing" → appSubscriptionCreate
2. **WebFetch**: https://shopify.dev/docs/api/admin-graphql/latest/mutations/appsubscriptioncreate
3. **Extract**: Subscription input structure, pricing models, return URLs
4. **Domain**: pricingQuery.js (billing operations)
5. **Implement**: Mutation with userErrors handling
6. **Controller**: Include confirmation URL and payment validation
7. **Test**: Verify subscription creation and billing flow
```

This ensures every GraphQL implementation:
- Uses current API structure from live documentation
- Follows established domain organization
- Includes proper error handling and validation
- Maintains consistency across all operations
- Leverages real-time Shopify API documentation

## GraphQL Development Workflow

### Step 0: Live API Documentation Reference & Cost Optimization
**Automatic Process:**
- WebFetch https://shopify.dev/docs/api/admin-graphql/latest for target resource
- Extract current field structure and available operations
- Verify API version compatibility (2025-07) and required permissions
- Get latest query patterns, cost calculations, and best practices from official documentation
- Analyze query cost limits and optimization strategies

**Query Cost Management (2025-07 API):**
```javascript
// Cost calculation considerations for efficient queries
const optimizedProductQuery = `
  query getOptimizedProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) { # Cost: 1 point per product
      edges {
        node {
          id                    # Cost: 0 (scalar field)
          title                 # Cost: 0 (scalar field)
          handle                # Cost: 0 (scalar field)
          status                # Cost: 0 (scalar field)
          
          # Expensive nested fields - use sparingly
          variants(first: 5) {  # Cost: 1 point per variant (limit to 5)
            edges {
              node {
                id
                price
                inventoryQuantity
              }
            }
          }
          
          # Very expensive - only when necessary
          media(first: 3) {     # Cost: 1 point per media item (limit to 3)
            edges {
              node {
                id
                alt
                ... on MediaImage {
                  image {
                    url
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Cost estimation: ~10-15 points per product (depending on variants/media)
// For 50 products: ~500-750 points (within rate limits)
```

### Step 1: Choose Domain File
**File Selection Logic:**
- **`commonQuery.js`**: General Shopify operations (products, shop info, metafields, webhooks, markets, customers, orders)
- **`pricingQuery.js`**: Billing, subscriptions, charges, app pricing, and payment operations  
- **`imageOptimizerQuery.js`**: Media, images, files, product media, and visual content operations

### Step 2: Design Query Structure
**Pattern Requirements:**
```javascript
// Follow naming convention: operationTypeResource
export const getCustomerDetails = `
  query getCustomerDetails($id: ID!) {
    customer(id: $id) {
      id
      displayName
      email
      // Add required fields based on live API docs
    }
  }
`;
```

**Key Guidelines:**
- Use descriptive, consistent naming patterns
- Include proper GraphQL syntax with required fields
- Reference live API documentation for accurate field structure
- Follow existing query organization in target file

### Step 3: Add Variable Handling
**Variable Patterns:**
```javascript
// Include pagination for list queries
export const getCustomersList = `
  query getCustomersList($first: Int!, $after: String, $query: String) {
    customers(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          displayName
          email
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
```

**Variable Best Practices:**
- Use proper GraphQL variable types (Int!, String, ID!, etc.)
- Include pagination variables for list operations
- Add optional search/filter parameters where applicable
- Handle required vs optional parameters correctly

### Step 4: Include Error Management
**For Mutations - Always Include userErrors:**
```javascript
export const updateCustomerMutation = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        displayName
        email
      }
      userErrors {
        field
        message
      }
    }
  }
`;
```

**Error Handling Requirements:**
- Include userErrors field in all mutations
- Plan for GraphQL-specific error scenarios
- Handle validation errors and API constraints
- Provide meaningful error messages for debugging

### Step 5: Controller Integration

**Standard Implementation Pattern:**
```javascript
// Import query from domain file
import { getCustomerDetails } from '../../graphql/commonQuery.js';
import { ApiResponse } from '../../helpers/common.js';

export const getCustomer = async (req, res, next) => {
  try {
    // Initialize response object
    let rcResponse = new ApiResponse();
    let { body } = req;
    const { graphqlClient } = req.shopify;

    // Execute GraphQL query with variables from request body
    let response = await graphqlClient.query({
      data: {
        query: getCustomerDetails,
        variables: {
          id: body.customerId,
          first: body.first || 10,
          // Add other variables as needed from body
        },
      },
    });

    // Set response data directly from GraphQL response
    rcResponse.data = response.body.data;

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
```

**Key Integration Points:**
- **Extract from request**: Use `let { body } = req` to get request data
- **GraphQL client**: Access via `const { graphqlClient } = req.shopify`
- **Variables mapping**: Map `body` properties to GraphQL variables
- **Response handling**: Set `rcResponse.data = response.body.data`
- **Error handling**: Use `next(err)` for error propagation
- **Response format**: Return with `res.status(rcResponse.code).send(rcResponse)`

### Step 6: Testing & Validation

**Basic Validation Requirements:**
- Verify query syntax and field availability
- Test with valid and invalid variables
- Ensure proper error handling in controllers
- Validate required OAuth scopes

### Step 7: Performance Optimization

**Key Optimization Strategies:**
- Use GraphQL fragments for repeated field patterns
- Implement query batching for multiple operations
- Handle rate limits with exponential backoff
- Monitor query costs and optimize expensive operations

## Current GraphQL File Structure

### Domain Organization
```
server/backend/graphql/
├── commonQuery.js       # General operations (products, customers, orders, shop, metafields)
├── pricingQuery.js      # Billing and subscription operations
└── imageOptimizerQuery.js # Media and file operations
```

### File Selection Guidelines

**commonQuery.js - Use for:**
- Product operations (CRUD, search, variants)
- Customer management (profiles, addresses, orders)
- Order processing and fulfillment
- Shop configuration and settings
- Metafield operations
- Webhook management
- Market and location data
- General Shopify admin operations

**pricingQuery.js - Use for:**
- App subscriptions and billing
- One-time charges and purchases
- Usage records and metered billing
- Plan management and upgrades
- Payment processing
- Subscription cancellations
- Billing history and invoices

**imageOptimizerQuery.js - Use for:**
- Product media and images
- File uploads and management
- Image optimization operations
- Media galleries and collections
- Alt text and SEO for images
- File metadata and properties

## Error Handling & Retry Patterns

**Basic Error Handling Requirements:**
- Check for GraphQL errors in response.body.errors
- Handle userErrors in mutations for validation feedback
- Implement retry logic for rate limiting and network issues
- Use exponential backoff for retry delays
- Log errors with appropriate context for debugging

## Best Practices

### Query Development
- Always reference live Shopify API documentation first
- Use consistent naming conventions across files
- Include proper error handling for all operations
- Implement pagination for list queries
- Add appropriate fragments for complex queries

### Performance
- Minimize query depth and complexity
- Use fragments to avoid field duplication
- Implement proper rate limit handling
- Cache frequently used queries when appropriate
- Monitor query performance and optimize as needed

### Security
- Validate all input parameters
- Handle sensitive data appropriately
- Implement proper authorization checks
- Log security-relevant operations
- Follow Shopify's API usage guidelines

### Maintenance
- Keep queries organized by domain
- Document complex query logic
- Regular review and optimization
- Update queries when API versions change
- Monitor for deprecated fields and operations

## Integration with Existing Systems

### Authentication
All GraphQL queries automatically use the app's Shopify authentication through:
- `req.shopify.graphqlClient` - Pre-configured GraphQL client
- OAuth scopes validation
- Session management and token refresh

### Logging and Monitoring
GraphQL operations integrate with:
- Winston logging system
- Sentry error tracking
- Performance monitoring
- Rate limit tracking

### Development Workflow
1. Request GraphQL query implementation
2. System automatically fetches live API docs
3. Generate query using current API structure
4. Implement in appropriate domain file
5. Create controller integration
6. Test and validate functionality
7. Deploy with proper error handling

## Integration Examples

**Basic Implementation Pattern:**
```javascript
// Query implementation in domain file
export const getProductDetails = `
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      status
    }
  }
`;

// Controller implementation
export const getProduct = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    let { body } = req;
    const { graphqlClient } = req.shopify;

    let response = await graphqlClient.query({
      data: {
        query: getProductDetails,
        variables: { id: body.productId }
      }
    });

    rcResponse.data = response.body.data;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
```

## API Version Information

**Current API Version**: 2025-07

**Key Features:**
- Enhanced product fields for combined listings and selling plans
- Improved customer consent management for GDPR compliance
- Real-time fulfillment tracking with delivery estimates
- Enhanced media support including 3D models and external videos
- Advanced bulk operation progress tracking
- Improved error context with request IDs and cost information

## Recent Additions Summary

**Total Operations Documented**: 300+ GraphQL queries and mutations

**New Operations Added in Latest Update:**
- **Product Variant Operations**: productVariant, productVariants, productVariantsBulkCreate, productVariantsBulkUpdate, productVariantsBulkDelete
- **Draft Order Operations**: draftOrder, draftOrders, draftOrderCreate, draftOrderUpdate, draftOrderComplete
- **Advanced Inventory Operations**: inventorySetQuantities, inventoryActivate  
- **Location Management**: locationEdit
- **Market Management**: marketCreate, marketUpdate, marketDelete
- **Refund Operations**: refundCreate
- **Translation Operations**: translationsRegister
- **Publication Operations**: publishableUnpublish, publication, publications
- **Access Token Management**: storefrontAccessTokenCreate, storefrontAccessTokenDelete, delegateAccessTokenCreate
- **B2B Company Operations**: companyCreate, companyContactCreate
- **Metaobject Operations**: metaobject, metaobjects, metaobjectCreate, metaobjectUpdate, metaobjectDelete

**Complete Coverage Areas:**
- **App Management & Billing** (8+ operations)
- **Access Token Management** (3+ operations) - NEW
- **Product Management** (20+ operations) - EXPANDED
- **Customer Management** (12+ operations) - EXPANDED
- **Order Processing** (20+ operations) - EXPANDED
- **Inventory Management** (13+ operations) - EXPANDED
- **Media & File Operations** (8+ operations)
- **Collection Management** (8+ operations)
- **Webhook Management** (6+ operations)
- **Metafield Operations** (8+ operations) - EXPANDED
- **Metaobject Operations** (5+ operations) - NEW
- **Shop Configuration** (4+ operations)
- **Bulk Operations** (4+ operations)
- **Blog & Content Management** (15+ operations)
- **Gift Card Operations** (8+ operations)
- **Location Operations** (5+ operations) - EXPANDED
- **Market Operations** (8+ operations) - EXPANDED
- **Discount Operations** (16+ operations) - EXPANDED
- **Fulfillment Operations** (8+ operations)
- **Returns Management** (4+ operations)
- **Draft Order Management** (5+ operations) - NEW
- **Refund Management** (1+ operations) - NEW
- **Translation Management** (1+ operations) - NEW
- **Publication Management** (3+ operations) - NEW
- **B2B Company Management** (2+ operations) - NEW
- **Checkout Operations** (1+ operations) - NEW
- **Shipping Operations** (1+ operations) - NEW
- **Product Feed Operations** (1+ operations) - NEW
- **Transaction Operations** (1+ operations) - NEW
- **Tag Management Operations** (2+ operations) - NEW
- **Customer Marketing Operations** (1+ operations) - NEW
- **Shopify Functions Operations** (1+ operations) - NEW

**Comprehensive API Coverage:**
- **Total Categories**: 25+ operation domains
- **B2B Commerce**: Complete company and contact management
- **Headless Commerce**: Full access token and publication management
- **Custom Data**: Complete metaobject and metafield operations
- **Advanced Inventory**: Sophisticated multi-location inventory control
- **Draft Orders**: Full manual order creation and management workflow
- **International Commerce**: Market creation, translation, and localization

All operations include:
- Direct official Shopify documentation links verified for 2025-07 API
- Specific use case descriptions and business scenarios  
- Comprehensive trigger patterns for automatic operation recognition
- Domain file organization (commonQuery.js, pricingQuery.js, imageOptimizerQuery.js)
- WebFetch workflow for live API documentation integration
- Implementation guidelines and controller patterns
- Error handling and validation requirements
- Security considerations and access scope requirements

