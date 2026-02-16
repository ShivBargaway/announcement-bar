# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔒 DOCUMENTATION UPDATE WORKFLOW

**MANDATORY Permission Process for ALL Documentation Files:**
Before making ANY updates to any .md files in this project:

1. **Identify needed changes** based on search results or prompt requirements
2. **Present proposed changes** to user with clear description
3. **Wait for explicit approval** ("green signal") before proceeding
4. **Only update after receiving permission** to make changes

**This applies to ALL markdown files including:**
- CLAUDE.md (this file)
- .claude/docs/**/*.md files
- README files
- Any documentation files in the project

**Process**: Always ask "I want to make these changes to [filename]: [describe changes]. Should I proceed?" and wait for approval.

## 🎯 IMPLEMENTATION APPROVAL WORKFLOW

**When to ASK FOR APPROVAL FIRST (Give Ideas, Don't Implement):**
- New features or functionality
- New implementations from scratch  
- When user says "think about", "create", "give me ideas"
- Any request involving creating something entirely new
- Adding new components, pages, or systems

**Process for New Implementations:**
1. **Present ideas and approach** instead of implementing directly
2. **Wait for user's green signal** before proceeding with implementation
3. **Only implement after receiving approval**

**When to PROCEED DIRECTLY (No Approval Needed):**
- Simple changes like "change this title" 
- Function updates or modifications
- Code updates to existing functionality
- Bug fixes and improvements to existing code
- Editing or modifying existing files/components

**Key Distinction:** 
- **NEW = Ask for approval first**
- **MODIFY/UPDATE existing = Proceed directly**

## Development Commands

### Core Development
```bash
# Install dependencies (use --force due to version incompatibilities)
npm i --force

# Development mode (starts both server and client with Vite HMR)
npm run dev

# Production build and start
npm run build && npm run start

# Build frontend only
npm run build

# Development server only (without Vite)
npm run dev:server

# Frontend development only (Vite dev server)
npm run dev:frontend
```

### Local Development Setup
```bash
# Start local MongoDB instance
mongod --dbpath mongo/

# Generate Ngrok tunnel for HTTPS (required for Shopify)
npm run ngrok

# Update Shopify Partner Dashboard URLs automatically
npm run update:url
```

### Code Quality
```bash
# Format code with Prettier
npm run pretty

# Check for package updates
npm run update:check

# Update all packages to latest versions
npm run update
```

### Shopify CLI Integration
```bash
# Run Shopify CLI commands
npm run shopify [command]

# Create new Shopify extension
npm run s:e:create

# Deploy extensions
npm run s:e:deploy

# Development with Shopify CLI (with reset)
npm run s:e:reset
```

## Architecture Overview

### Full-Stack Structure
This is a **Shopify embedded app** using a dual-server architecture:
- **Development**: Vite dev server proxied through Express
- **Production**: Express serves static built files
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Shopify OAuth with JWT sessions

### Key Architectural Patterns

#### Multi-Route System
The app handles three distinct routing contexts:
- **Main App Routes** (`/`): Embedded Shopify admin experience
- **Public Routes** (`/public/*`): Public-facing pages
- **Admin Routes** (`/admin/*`): Administrative interface
- **App Proxy Routes** (`/proxy_route/*`): Store-facing proxy endpoints

#### State Management Pattern
Uses React Context API with provider composition:
```
App.jsx → Multiple Context Providers → Routes
├── ProfileContextProvider (user data)
├── OnboardingContextProvider (setup flow)
├── ReviewModalContextProvider (feedback system)
└── LoadingContextProvider (global loading states)
```

#### Authentication Flow
1. Shopify OAuth redirect (`/auth/callback`)
2. JWT session creation and encryption
3. MongoDB session persistence
4. App Bridge integration for embedded experience

### Server Architecture

#### Middleware Stack (order matters)
```javascript
// server/index.js
app.use(cors())
app.use(performBackendTask) // Sentry transaction handling
app.use(Sentry.Handlers.requestHandler())
app.post("/webhooks/:topic", webhookHandler) // Before JSON parsing
app.use(Express.json())
app.use(csp) // Content Security Policy
app.use(isInitialLoad) // Initial load detection
app.use("/apps", verifyRequest, userRoutes) // Main app routes
app.use("/proxy_route", verifyProxy, proxyRouter) // Store proxy
```

#### Backend Organization
- **Controllers**: Business logic in `server/backend/controllers/`
- **Routes**: API endpoints in `server/backend/routes/`
- **Models**: MongoDB schemas in `server/backend/model/`
- **Services**: External integrations and utilities

### Client Architecture

#### Component Organization
- **Pages**: Feature-specific page components (36+ pages for SEO features)
- **Components/Common**: Reusable UI components using Shopify Polaris
- **Context**: Global state management contexts
- **Providers**: App Bridge, Polaris, and context composition
- **Utils**: Helper functions and utilities

#### Routing Strategy
Uses React Router with lazy loading for performance:
```javascript
// All page components are lazy-loaded
const Settings = lazy(() => import("@/Pages/Settings/Settings"));
const Pricing = lazy(() => import("@/Pages/Pricing/Pricing"));
```

#### Build Configuration
Vite with manual chunk splitting:
- **vendor**: React/React-DOM
- **shopifyPolaris**: Polaris components
- **sentry**: Error tracking
- **lodash**: Utilities

### Database Patterns

#### Session Management
- MongoDB-based session storage with encryption
- Dual database connection capability (local + live tunneling)
- Session cleanup and management utilities

#### Model Structure
Uses a common model pattern in `server/backend/model/common.js` for shared database operations.

### Environment Configuration

#### Key Environment Variables
- **SHOPIFY_API_KEY/SECRET**: Shopify app credentials
- **SHOPIFY_APP_URL**: Ngrok tunnel URL (development) or production URL
- **MONGO_URL**: Database connection string
- **ENCRYPTION_STRING**: Session encryption key
- **SHOPIFY_API_SCOPES**: Required permissions
- **SHOPIFY_API_VERSION**: API version (kept current)

#### Development vs Production
- **Development**: Vite HMR + Express middleware mode
- **Production**: Static file serving with compression
- **SSL**: Local SSL proxy for HTTPS development requirements

### Integration Points

#### Shopify Integration
- **App Bridge**: Embedded app experience
- **GraphQL Proxy**: Direct GraphQL queries to Shopify
- **Webhooks**: Event-driven updates from Shopify
- **App Proxy**: Store-facing content delivery

#### Third-party Services
- **Sentry**: Error monitoring with transaction tracking
- **Ngrok**: Development tunneling
- **MongoDB**: Session and app data storage
- **Various SEO APIs**: Google services, analytics, etc.

### Performance Considerations
- **Lazy Loading**: All page components and heavy features
- **Code Splitting**: Manual chunks for optimal loading
- **Session Optimization**: Minimal session data storage
- **Build Optimization**: Vite with rollup optimizations
- **Error Boundaries**: Comprehensive error handling with Sentry

### Development Workflow
1. Start MongoDB: `mongod --dbpath mongo/`
2. Generate Ngrok tunnel: `npm run ngrok`
3. Update .env with Ngrok URL
4. Run development: `npm run dev`
5. Install app: `https://ngrok-url/auth?shop=store.myshopify.com`

### Database Connection Patterns
The app supports both local development and live database tunneling through SSH for testing with production data while developing locally.

## MANDATORY DESIGN SYSTEM

### 🚨 CRITICAL: Polaris Design System is COMPULSORY
**ALL UI components MUST use Shopify Polaris design system. This is MANDATORY and NON-NEGOTIABLE.**

**Component Usage Rules:**
- **Forms**: Use existing `CommonForm` component (built with Polaris)
- **Tables**: Use existing `CommonTable` component (built with Polaris)  
- **New UI Components**: ALWAYS use Polaris components from `@shopify/polaris` directly
- **Layout**: ALWAYS wrap with Polaris `Page`, `Layout`, `Card` components

**NEVER create custom UI components without Polaris foundation.**

**Reference**: `.claude/docs/client/POLARIS.md` - Complete Polaris implementation guide with automatic live documentation integration from https://polaris-react.shopify.com

**Any UI development request will automatically reference live Polaris documentation and follow established patterns.**

## Dynamic Development System

This project uses an interconnected documentation system that automatically handles any development request. Each documentation file covers specific patterns and they work together seamlessly.

### Folder Structure Guidelines (`.claude/docs/DESIGN_STRUCTURE.md`)
**When to use**: Starting new features, organizing code, maintaining structure
**Prompts that trigger**: "new feature", "create feature", "folder structure", "organize code", "where to place", "code organization", "project structure"
- Mandatory folder organization patterns for client and server
- Complete feature development workflow checklist
- Client-side structure rules (Common components, Pages, Mocks, Utils)
- Server-side structure rules (Controllers, Routes, Models, Services)
- Enforcement guidelines to maintain consistency and scalability

### Build & Environment Configuration (`.claude/docs/BUILD_CONFIGURATION.md`)
**When to use**: Setting up development environment, build processes, environment variables
**Prompts that trigger**: "build", "environment", "env vars", "development setup", "vite config", "SSL setup", "ngrok", "package scripts"
- Complete environment variable setup (26+ variables)
- Development vs production configuration patterns
- Vite build optimization with manual chunking
- SSL and HTTPS setup for Shopify App Bridge
- Package scripts and development workflows

### Third-Party Integrations (`.claude/docs/INTEGRATIONS.md`)
**When to use**: Adding external services, chat systems, analytics, monitoring
**Prompts that trigger**: "integration", "third party", "chat", "analytics", "monitoring", "Sentry", "Crisp", "Hotjar", "external service"
- 8+ service integrations (Crisp, Customerly, Sentry, Hotjar, etc.)
- Environment-based loading patterns
- User profile integration for personalization
- Performance optimization for third-party scripts
- Integration troubleshooting and best practices

### Client-Side Documentation Map

#### Language & Translation System (`.claude/docs/client/LANGUAGE_TRANSLATION.md`)
**When to use**: Adding text to UI, creating translations, multi-language support
**Prompts that trigger**: "add text", "translate", "language", "new text", "UI text", "button text", "label", "message", "notification text"
**REQUIRED PATTERN**: `import { t } from "i18next"` and use `t("common.Your text here")`
- 16 supported languages with flat structure under `common.`
- i18next integration with standard `t()` function
- Dynamic key support: `t(\`common.\${dynamicKey}\`)`
- Language file management (JSON + JS modules with mergeLanguage)
- Real-world examples from existing components

#### UI & Components (`.claude/docs/client/ALL_COMPONENTS.md`)
**When to use**: Creating forms, tables, modals, UI elements
**Prompts that trigger**: "create form", "build table", "add modal", "UI component", "form fields"
- Complete component library (40+ field types)
- CommonForm and CommonTable patterns
- All UI component interfaces and usage

#### Pages & Routing (`.claude/docs/client/PAGES.md` + `.claude/docs/client/ROUTING.md`)
**When to use**: Creating new pages, routes, navigation
**Prompts that trigger**: "create page", "add route", "new screen", "build dashboard", "page component"
- Page structure and development patterns
- Step-by-step route creation process
- Navigation menu integration
- Lazy loading and performance optimization

#### State Management (`.claude/docs/client/CONTEXTS.md`)
**When to use**: Managing app state, user data, global state
**Prompts that trigger**: "user data", "global state", "context", "app state", "state management"
- React Context patterns
- ProfileContext, ToastContext, LoadingContext usage
- Context provider composition

#### API Integration (`.claude/docs/client/API.md`)
**When to use**: Making API calls, authentication, data fetching
**Prompts that trigger**: "API call", "fetch data", "authentication", "backend request"
- useAuthenticatedFetch patterns
- Authentication system (3 modes)
- Automatic loading and error handling

#### App Structure (`.claude/docs/client/PROVIDERS.md`)
**When to use**: App initialization, Shopify integration, provider setup
**Prompts that trigger**: "Shopify integration", "app setup", "providers", "App Bridge"
- Shopify App Bridge integration
- Provider composition architecture
- Polaris integration patterns

#### Development Tools (`.claude/docs/client/SERVICES.md`)
**When to use**: Client-side logging, monitoring, error tracking, client services
**Prompts that trigger**: "client logging", "client error tracking", "client Sentry", "client monitoring", "client debug", "client services"
- Client-side logging and error tracking patterns
- Client-side Sentry integration 
- Client service development patterns
- Browser-based monitoring and debugging

#### Testing & Development (`.claude/docs/client/MOCKS.md`)
**When to use**: Mock data, testing, development setup
**Prompts that trigger**: "mock data", "testing", "development data", "test setup"
- Mock data patterns
- Testing utilities
- Development workflows

#### Utilities & Helpers (`.claude/docs/client/UTILS.md`)
**When to use**: Helper functions, utilities, common operations, data formatting, form generation
**Prompts that trigger**: "utility function", "helper", "format data", "generate form", "auto-create form", "data formatting", "time formatting", "storage management", "admin access", "URL handling", "validation"
- 30+ utility functions for common operations
- Dynamic form field generation from objects
- Data visualization components
- Storage management (localStorage/sessionStorage)
- Authentication and admin access utilities
- Date/time formatting and manipulation
- URL parameter handling and navigation
- Slack integration helpers
- Error handling utilities

#### Client Database Operations (`.claude/docs/client/DATABASE.md`)
**When to use**: Client-side database connections, connection patterns
**Prompts that trigger**: "client database", "database connection", "connection patterns", "client MongoDB"
- Client-side database connection patterns
- Database configuration and setup
- Connection utilities and helpers

#### Polaris Design System (`.claude/docs/client/POLARIS.md`)
**When to use**: Creating UI components, designing interfaces, implementing Shopify design system
**Prompts that trigger**: "add Polaris component", "create Polaris form", "implement Polaris layout", "use Polaris button", "add Polaris card", "create Polaris modal", "implement Polaris table", "use Polaris navigation", "add Polaris banner", "create Polaris page", "implement Polaris [component]", "design with Polaris", "Polaris UI component", "Shopify design system", "UI design", "component design", "form design", "layout design"
- **Automatic Live Documentation Integration**: WebFetch current Polaris documentation from https://polaris-react.shopify.com for accurate props and usage patterns
- **Complete 7-Step Workflow**: Live component docs → Component selection → Structure design → Props configuration → State integration → Pattern implementation → Optimization
- **Component Categories**: Layout, Form, Navigation, Feedback, Data Display components with real-world examples
- **State Management Integration**: ToastContext, ProfileContext, LoadingContext integration patterns
- **Translation Support**: All components use t() function for user-facing text
- **API Integration**: useAuthenticatedFetch integration with Polaris loading states
- **Performance Optimization**: Lazy loading, memoization, and responsive design patterns

### How It Works

When you provide ANY prompt related to client-side development, I automatically:

1. **Identify the prompt type** (form, page, API, state, etc.)
2. **Reference the relevant documentation files**
3. **Follow established patterns** from the interconnected system
4. **Implement using documented components and practices**
5. **Ensure consistency** across all implementation aspects

## Server-Side Documentation Map

#### Server Architecture (`.claude/docs/server/SERVER.md`)
**When to use**: Server setup, environment configuration, startup sequence, database connections
**Prompts that trigger**: "server setup", "environment config", "startup", "database connection", "MongoDB setup", "server architecture", "Express setup"
- Complete server initialization and startup sequence
- Environment variable configuration and validation
- MongoDB connection patterns (local + live tunneling)
- Sentry integration and performance monitoring
- Development vs production setup patterns

#### API Development (`.claude/docs/server/SERVER_API.md`)
**When to use**: Creating controllers, API endpoints, business logic, request handling, file upload systems
**Prompts that trigger**: "create API", "add endpoint", "controller", "REST API", "file upload", "Shopify API", "CRUD operations", "API routes", "request handling", "upload files", "media management"
- Complete API controller patterns with 24+ controllers
- File upload system with Shopify Files API integration
- Multer configuration for local file handling
- Bulk file processing and progress tracking
- File validation, optimization, and metadata management
- Automatic file cleanup and monitoring systems
- Standard response formats and error handling
- Authentication and authorization patterns
- Error handling and validation patterns
- API development and testing patterns

#### Middleware & Security (`.claude/docs/server/MIDDLEWARE.md`)
**When to use**: Request processing, authentication, security, middleware development
**Prompts that trigger**: "middleware", "authentication", "security", "request processing", "authorization", "session management", "JWT validation", "CORS", "CSP", "rate limiting"
- Comprehensive middleware stack with proper ordering
- Authentication and authorization middleware
- Security headers, CORS, and CSP configuration
- Session management and JWT validation
- Rate limiting and DDoS protection
- Error handling and request logging middleware

#### Deployment & Infrastructure (`.claude/docs/server/DEPLOYMENT.md`)
**When to use**: GitHub Actions, PM2, production deployment, server infrastructure
**Prompts that trigger**: "deployment", "GitHub Actions", "PM2", "production", "server setup", "environment setup", "CI/CD", "staging", "production environment", "process management"
- Complete GitHub Actions workflows for staging and production
- PM2 process management with health checks and monitoring
- Environment configuration and validation (26+ variables)
- SSL/TLS setup and certificate management
- Production optimization and performance tuning
- Monitoring, logging, and error handling in production

#### Webhook Integration (`.claude/docs/server/WEBHOOKS.md`)
**When to use**: Shopify webhooks, event handling, real-time updates
**Prompts that trigger**: "webhook", "Shopify events", "app uninstalled", "store update", "event handler", "webhook security"
- Webhook registration and validation
- Event handler patterns
- Security and HMAC verification
- Error recovery and retry logic
- Real-time event processing

#### Server Database Models (`.claude/docs/server/SERVER_MODELS.md`)
**When to use**: Database schemas, MongoDB operations, data modeling, server-side data operations
**Prompts that trigger**: "server database", "MongoDB schema", "data model", "server model", "database schema", "user data", "subscription data", "database connection", "MongoDB operations", "aggregation", "indexing"
- 12+ MongoDB schemas for all data domains
- Database connection patterns (local + live tunneling with SSH)
- Common model patterns and CRUD operations
- Database query optimization and aggregation pipelines
- Schema development, validation, and data relationships
- Indexing strategies and performance optimization

#### Server Utilities (`.claude/docs/server/SERVER_UTILS.md`)
**When to use**: Shopify integration, session management, helper functions, utilities
**Prompts that trigger**: "Shopify client", "session", "JWT validation", "server utilities", "helper functions", "integration"
- Shopify API client configuration
- Session management with encryption
- JWT validation and authentication utilities
- Backend helper functions
- Slack and email integrations

#### Server Services (`.claude/docs/server/SERVER_SERVICES.md`)
**When to use**: Logging, monitoring, external service integration, cron jobs, background processing
**Prompts that trigger**: "logging", "Sentry", "monitoring", "external API", "third-party integration", "service integration", "cron job", "scheduled task", "background processing", "batch processing", "data migration", "automated task"
- Winston logging and Sentry monitoring
- External service integrations (Google, SendGrid, email services)
- Comprehensive cron job system with node-cron
- Background processing for data migration and bulk operations
- Plan pricing management and recurring billing automation
- File cleanup services and automated maintenance
- Performance monitoring and error tracking with retry logic
- Service development patterns and dependency injection

#### GraphQL Query Management (`.claude/docs/server/GRAPHQL.md`)
**When to use**: Creating Shopify GraphQL queries, implementing API operations, GraphQL development
**Prompts that trigger**: "add new GraphQL query", "create Shopify query", "GraphQL mutation", "implement GraphQL", "Shopify GraphQL", "new query", "query development", "GraphQL integration", "GraphQL query for [resource]", "add GraphQL for products", "create customer query", "implement order GraphQL", "billing GraphQL mutation", "subscription query", "webhook GraphQL", "metafield query", "collection GraphQL", "inventory query", "fulfillment GraphQL"
- **Automatic Live Documentation Integration**: WebFetch current Shopify GraphQL API docs from https://shopify.dev/docs/api/admin-graphql for accurate field structures
- **Complete 7-Step Workflow**: Live API docs → Domain file selection → Query design → Variables → Error handling → Controller integration → Testing
- **Domain-Based File Organization**: Smart selection between commonQuery.js, pricingQuery.js, and imageOptimizerQuery.js based on operation type
- **Real-Time API Structure**: Always current field definitions, operations, and best practices from live Shopify documentation
- **Standard Controller Integration**: ApiResponse pattern, request body extraction, graphqlClient usage, and proper error handling
- **Performance Optimization**: Fragments, query batching, and rate limit handling with retry logic

### Example Prompt Mappings

**Structure & Organization Examples:**
- **"Create new feature for product analytics"** → DESIGN_STRUCTURE.md (mandatory workflow)
- **"Where should I put this component?"** → DESIGN_STRUCTURE.md (folder organization)  
- **"How to organize new feature code?"** → DESIGN_STRUCTURE.md (complete checklist)

**Build & Environment Examples:**
- **"Setup development environment"** → BUILD_CONFIGURATION.md (complete setup guide)
- **"Configure environment variables"** → BUILD_CONFIGURATION.md (26+ env vars)
- **"Build optimization issues"** → BUILD_CONFIGURATION.md (Vite and bundle analysis)
- **"SSL setup for development"** → BUILD_CONFIGURATION.md (ngrok and local-ssl-proxy)

**Integration Examples:**
- **"Add chat support"** → INTEGRATIONS.md (Crisp or Customerly setup)
- **"Setup error monitoring"** → INTEGRATIONS.md (Sentry configuration)
- **"Add user analytics"** → INTEGRATIONS.md (Hotjar integration)
- **"Integrate external service"** → INTEGRATIONS.md (environment-based loading)

**Language & Translation Examples:**
- **"Add button text 'Save Changes'"** → LANGUAGE_TRANSLATION.md (use t("common.Save Changes"))
- **"Create notification message"** → LANGUAGE_TRANSLATION.md (use t("common.Operation completed"))
- **"Add form validation text"** → LANGUAGE_TRANSLATION.md (use t("common.This field is required"))  
- **"Translate existing text"** → LANGUAGE_TRANSLATION.md (add to common flat structure)
- **"Dynamic text from props"** → LANGUAGE_TRANSLATION.md (use t(\`common.\${title}\`))

**Client-Side Examples:**
- **"Create a user settings page"** → client/PAGES.md + client/ROUTING.md + client/ALL_COMPONENTS.md + client/CONTEXTS.md
- **"Build a product form"** → client/ALL_COMPONENTS.md + client/API.md + client/CONTEXTS.md
- **"Add navigation menu"** → client/ROUTING.md + client/MOCKS.md
- **"Add user authentication"** → client/PROVIDERS.md + client/API.md + client/CONTEXTS.md

**Polaris Design System Examples:**
- **"Create Polaris form"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (form components + validation patterns)
- **"Add Polaris button"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (button props + action handling)
- **"Implement Polaris card layout"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (layout patterns + responsive design)
- **"Create Polaris data table"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (IndexTable + ResourceList patterns)
- **"Add Polaris modal"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (modal implementation + form integration)
- **"Implement Polaris navigation"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (navigation patterns + routing)
- **"Create Polaris banner"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (feedback components + toast integration)
- **"Add Polaris page layout"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (Page component + actions)
- **"Design product listing with Polaris"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (ResourceList + filtering)
- **"Create settings form with Polaris"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (FormLayout + validation)
- **"Implement dashboard with Polaris"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (Layout + Cards + Charts)
- **"Add user profile UI with Polaris"** → **WebFetch** https://polaris-react.shopify.com → client/POLARIS.md (Avatar + DescriptionList + actions)

**Server-Side Examples:**
- **"Create user API endpoint"** → server/SERVER_API.md + server/SERVER_MODELS.md + server/MIDDLEWARE.md
- **"Handle app uninstallation"** → server/WEBHOOKS.md + server/SERVER_MODELS.md + server/SERVER_SERVICES.md
- **"Add subscription billing"** → server/SERVER_API.md + server/SERVER_MODELS.md + server/SERVER_SERVICES.md
- **"Setup authentication middleware"** → server/MIDDLEWARE.md + server/SERVER_UTILS.md + server/SERVER.md
- **"Integrate external service"** → server/SERVER_SERVICES.md + server/SERVER_UTILS.md + server/SERVER_API.md
- **"Add database schema"** → server/SERVER_MODELS.md + server/SERVER.md + server/SERVER_UTILS.md
- **"Setup logging system"** → server/SERVER_SERVICES.md + server/SERVER.md + server/MIDDLEWARE.md
- **"Deploy to production"** → server/DEPLOYMENT.md + BUILD_CONFIGURATION.md + server/SERVER.md
- **"File upload system"** → server/SERVER_API.md + server/MIDDLEWARE.md + server/SERVER_SERVICES.md
- **"Setup cron jobs"** → server/SERVER_SERVICES.md + server/SERVER_MODELS.md + server/DEPLOYMENT.md
**GraphQL Development Examples:**
- **"Add GraphQL query for products"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (live API docs + commonQuery.js)
- **"Create customer GraphQL query"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (customer fields + controller integration)
- **"Implement order GraphQL mutation"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (order operations + commonQuery.js)
- **"Add billing subscription query"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (billing operations + pricingQuery.js)
- **"Create webhook GraphQL operation"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (webhook management + commonQuery.js)
- **"Implement collection query"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (collection fields + commonQuery.js)
- **"Add metafield GraphQL query"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (metafield operations + commonQuery.js)
- **"Create inventory GraphQL mutation"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (inventory updates + commonQuery.js)
- **"Implement media query"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (media operations + imageOptimizerQuery.js)
- **"Add fulfillment GraphQL"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (fulfillment operations + commonQuery.js)
- **"GraphQL for shop settings"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (shop configuration + commonQuery.js)
- **"Create app subscription mutation"** → **WebFetch** https://shopify.dev/docs/api/admin-graphql → server/GRAPHQL.md (app billing + pricingQuery.js)

## Development Patterns Requirements

**🚨 CRITICAL REQUIREMENTS:**

1. **MANDATORY Polaris Design System**: ALL UI components MUST use Shopify Polaris (`@shopify/polaris`). No custom UI components allowed.
   - **EXCEPTION**: Use existing CommonForm and CommonTable components (built with Polaris underneath)
   - For new UI components: ALWAYS use Polaris components directly

2. **MANDATORY Translation Pattern**: ALL text in UI MUST use `import { t } from "i18next"` and `t("common.text")` pattern. No hardcoded strings allowed.

3. **MANDATORY Feature Documentation**: For EVERY new feature created, you MUST create a dedicated documentation file in the feature folder.
   - **File Format**: `[FeatureName]_DOCUMENTATION.md` in the feature's main directory
   - **Content Requirements**: 
     - Feature overview and purpose
     - Implementation details and architecture
     - Component structure and relationships
     - API endpoints and data flow
     - Usage examples and integration patterns
     - Dependencies and external integrations
   - **Location Examples**:
     - Client features: `src/Pages/[FeatureName]/[FeatureName]_DOCUMENTATION.md`
     - Server features: `server/backend/controllers/[FeatureName]/[FeatureName]_DOCUMENTATION.md`
   - **Process**: Create documentation file IMMEDIATELY after feature implementation is complete
   - **Usage**: When working on ANY existing feature, ALWAYS first read the feature's own `[FeatureName]_DOCUMENTATION.md` file from its folder to understand the feature's current implementation, patterns, and requirements before making any changes or updates
   - **Maintenance**: MANDATORY - When making ANY changes to an existing feature (code updates, new functionality, bug fixes, modifications), you MUST update the feature's `[FeatureName]_DOCUMENTATION.md` file to reflect the changes. This ensures documentation stays current with implementation.

**All implementation examples and detailed patterns are available in the dedicated documentation files referenced above.**