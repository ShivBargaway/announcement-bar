# Build Configuration Guide

This document covers the complete build and development configuration for the Shopify App Starter Kit, including environment setup, build processes, and deployment patterns.

## Environment Configuration

### Required Environment Variables (.env.example)

The application requires 26+ environment variables for proper functionality. Create a `.env` file based on `.env.example`:

#### **Core Shopify Configuration**
```bash
# Shopify App Credentials
SHOPIFY_API_KEY=your_app_api_key
SHOPIFY_API_SECRET=your_app_secret
SHOPIFY_APP_URL=https://your-app-url.com
SHOPIFY_APP_NAME=Your App Name
SHOPIFY_API_VERSION=2023-10                    # Keep current
SHOPIFY_API_SCOPES=read_products,write_products  # Your required scopes

# Pricing & Extensions
SHOPIFY_APP_URL_FOR_PRICING=https://your-pricing-url.com
SHOPIFY_STORE_APP_URL=https://your-store-url.com
REACT_APP_EXTENSION_UUID_KEY=your_extension_uuid
```

#### **Database Configuration**
```bash
# MongoDB Connection
MONGO_URL=mongodb://127.0.0.1:27017/yourAppDb
ENCRYPTION_STRING=your_32_character_encryption_key
CONNECT_LIVE_DATABASE_LOCAL=false              # Enable for live DB tunneling
```

#### **Development & Security**
```bash
# Environment
ENV=dev                                        # dev/staging/prod
NPM_CONFIG_FORCE=true                         # Required due to version conflicts

# Security
ADMIN_ACCESS_KEY=your_admin_key
ADMIN_SECRET=your_admin_secret
ADMIN_KEY=your_admin_master_key
```

#### **Third-party Integrations**
```bash
# Chat & Support
CRISP_WEBSITE_ID=your_crisp_id
CSTOMERLY_WEBSITE_ID=your_customerly_id

# Analytics & Monitoring
REACT_APP_GA_ID=your_google_analytics_id
SENTRY_DNS_WEB=your_sentry_web_dsn
SENTRY_DNS_BACKEND=your_sentry_backend_dsn
HOTJAR_TRACKING_ID=your_hotjar_id
HOTJAR_VERSION=6

# External Services
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_CHANNEL=your_slack_channel
GOOGLE_FONT_KEY=your_google_fonts_api_key

# Limits & Configuration
PRODUCT_COUNT=100                              # Default product limit
```

## Development Scripts

### Core Development Commands

```bash
# Full development mode (recommended)
npm run dev                    # Starts both server and Vite dev server with SSL proxy

# Individual development modes
npm run dev:server            # Backend only (Node.js with nodemon)
npm run dev:frontend          # Frontend only (Vite dev server)

# SSL Development (required for Shopify)
npm run ssl                   # Local SSL proxy (port 4200 -> 8081)
npm run ngrok                 # Ngrok tunnel for external HTTPS
npm run ngrok:prod           # Ngrok tunnel for production testing
```

### Build Commands

```bash
# Production build
npm run build                 # Builds optimized frontend bundle

# Production start
npm start                     # Starts production server (port 4002)
npm run start-prod           # Alternative production start (port 4003)
npm run start:local          # Local production with SSL proxy
```

### Development Workflow Commands

```bash
# Package management
npm run update:check         # Check for package updates
npm run update              # Update all packages to latest versions

# Code formatting
npm run pretty              # Format all code with Prettier

# URL management
npm run update:url          # Update Shopify Partner Dashboard URLs
```

### Shopify CLI Integration

```bash
# Shopify CLI commands
npm run shopify [command]    # Run any Shopify CLI command

# Extension development
npm run s:e:create          # Create new Shopify extension
npm run s:e:dev             # Development with Shopify CLI
npm run s:e:deploy          # Deploy extensions to Shopify
npm run s:e:reset           # Development with reset (fresh start)
```

## Vite Build Configuration

### Environment Variable Injection

The Vite config (`client/vite.config.js`) injects 17+ environment variables into the client bundle:

```javascript
// Core app configuration
"process.env.SHOPIFY_API_KEY"
"process.env.SHOPIFY_APP_URL"
"process.env.SHOPIFY_APP_NAME"
"process.env.ENV"

// Third-party integrations
"process.env.CRISP_WEBSITE_ID"
"process.env.SENTRY_DNS_WEB"
"process.env.REACT_APP_GA_ID"
"process.env.HOTJAR_TRACKING_ID"
"process.env.CSTOMERLY_WEBSITE_ID"

// Development features
"process.env.CONNECT_LIVE_DATABASE_LOCAL"
"process.env.GOOGLE_FONT_KEY"
appOrigin                               # Auto-generated from SHOPIFY_APP_URL
```

### Manual Code Splitting

Optimized bundle splitting for performance:

```javascript
manualChunks: {
  vendor: ["react", "react-dom"],           // Core React (~42KB)
  shopifyPolaris: ["@shopify/polaris"],     # Shopify UI components (~380KB)
  sentry: ["@sentry/react"],                # Error monitoring (~95KB)
  lodash: ["lodash"],                       # Utilities (~70KB)
}
```

### Build Output Structure

```
dist/client/
├── assets/
│   ├── vendor.[hash].js          # React core
│   ├── shopifyPolaris.[hash].js  # Polaris components
│   ├── sentry.[hash].js          # Sentry error tracking
│   ├── lodash.[hash].js          # Utilities
│   └── index.[hash].js           # Main application code
├── index.html                    # Entry point
└── [static assets]
```

## Development vs Production Configuration

### Development Mode (`NODE_ENV=dev`)

```bash
# Features enabled:
- Vite HMR (Hot Module Replacement)
- SSL proxy for HTTPS development
- Detailed error logging
- Source maps
- Development middleware
- Live database tunneling (if enabled)

# Servers:
- Vite dev server: Port 5173
- Express server: Port 8081
- SSL proxy: Port 4200 (public access)
```

### Production Mode (`NODE_ENV=prod`)

```bash
# Features enabled:
- Optimized static file serving
- Compression middleware
- Minified bundles
- Source map uploads to Sentry
- Production error handling

# Servers:
- Express server only: Port 4002/4003
- Serves pre-built static files from dist/client/
```

## SSL and HTTPS Configuration

### Local Development HTTPS

Required for Shopify App Bridge integration:

```bash
# Method 1: Local SSL Proxy (Recommended)
npm run dev                     # Includes SSL proxy automatically
# Accessible at: https://localhost:4200

# Method 2: Ngrok Tunnel
npm run ngrok                   # Creates public HTTPS tunnel
# Update SHOPIFY_APP_URL with ngrok URL
npm run update:url             # Sync URL to Shopify Partner Dashboard
```

### SSL Proxy Configuration

```javascript
// Uses local-ssl-proxy package
"ssl": "local-ssl-proxy --source 4200 --target 8081"

// Development: HTTPS (4200) -> HTTP (8081)
// Production: HTTPS (4200) -> HTTP (4002/4003)
```

## Bundle Analysis and Optimization

### Bundle Visualization

```bash
npm run build                   # Generates bundle analysis
# Creates: dist/stats.html       # Visualize bundle composition
```

### Performance Optimizations

1. **Manual Chunking**: Separates vendor libraries for better caching
2. **Tree Shaking**: Removes unused code automatically
3. **Minification**: Production builds are minified and compressed
4. **Lazy Loading**: All pages use React.lazy() for code splitting
5. **Asset Optimization**: Images and static assets are optimized

### Build Size Guidelines

```
Typical bundle sizes:
- vendor.js: ~150KB (React + React-DOM)
- shopifyPolaris.js: ~380KB (UI components)
- sentry.js: ~95KB (Error tracking)
- lodash.js: ~70KB (Utilities)
- main app: ~200-500KB (depending on features)
Total: ~900KB - 1.2MB (acceptable for Shopify apps)
```

## Environment-Specific Configuration

### Development Environment

```bash
ENV=dev
SHOPIFY_APP_URL=https://localhost:4200  # or ngrok URL
MONGO_URL=mongodb://127.0.0.1:27017/appDev
CONNECT_LIVE_DATABASE_LOCAL=false       # Use local MongoDB
```

### Staging Environment

```bash
ENV=staging  
SHOPIFY_APP_URL=https://staging.yourapp.com
MONGO_URL=mongodb://staging-server/appStaging
# All third-party services use staging/test configurations
```

### Production Environment

```bash
ENV=prod
SHOPIFY_APP_URL=https://yourapp.com
MONGO_URL=mongodb://production-server/appProd
# All third-party services use production configurations
```

## Common Build Issues and Solutions

### 1. Environment Variable Issues
```bash
# Problem: Variables not available in client
# Solution: Add to vite.config.js define block
"process.env.YOUR_VAR": JSON.stringify(process.env.YOUR_VAR)
```

### 2. Package Version Conflicts
```bash
# Problem: npm install fails due to conflicts
# Solution: Use --force flag (already configured)
npm i --force
```

### 3. SSL Certificate Issues
```bash
# Problem: HTTPS not working in development
# Solution: Use local-ssl-proxy or ngrok
npm run ssl              # Local proxy
npm run ngrok           # Public tunnel
```

### 4. Build Optimization Issues
```bash
# Problem: Bundle too large
# Solution: Review manual chunks and lazy loading
npm run build           # Check bundle analysis
# Optimize imports and add more code splitting
```

### 5. Shopify App Bridge Issues
```bash
# Problem: App Bridge not loading
# Solution: Ensure HTTPS and correct app origin
# Check: appOrigin in vite.config.js
# Verify: SHOPIFY_APP_URL in environment
```

## Build Performance Tips

1. **Use npm ci** instead of npm install in production
2. **Enable caching** for node_modules in CI/CD
3. **Optimize images** before including in public folder
4. **Review bundle analysis** regularly to catch size increases
5. **Use environment-specific configurations** to reduce bundle size
6. **Enable compression** in production builds
7. **Monitor build times** and optimize dependencies as needed

This configuration enables efficient development with hot reloading while producing optimized production builds for Shopify app deployment.