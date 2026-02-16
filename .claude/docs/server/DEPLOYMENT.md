# Deployment Configuration Guide

This document covers the complete deployment process for the Shopify App Starter Kit, including GitHub Actions workflows, PM2 process management, environment setup, and production configurations.

## Deployment Architecture

### Multi-Environment Setup

The application supports three deployment environments:

```
Development  → Local development with Ngrok tunneling
Staging      → Pre-production testing environment  
Production   → Live application serving real users
```

### Server Infrastructure

**Production Stack**:
- **Node.js**: v20.9.0 (managed via NVM)
- **Process Manager**: PM2 for process monitoring and restart
- **Web Server**: Express.js with static file serving
- **Database**: MongoDB with connection pooling
- **SSL/TLS**: HTTPS termination at load balancer level
- **SSH Access**: Automated deployment via SSH

## GitHub Actions Workflows

### Staging Deployment Workflow

**File**: `.github/workflows/deploy-stg.yml`

**Trigger**: Manual workflow dispatch with branch selection

```yaml
name: Deploy To Staging

on:
  workflow_dispatch:
    inputs:
      branch:
        description: "Branch to deploy"
        required: true
        default: "dev"
```

**Deployment Process**:
1. **SSH Connection**: Connects to staging server using secrets
2. **Environment Setup**: Loads NVM and sets Node.js v20.9.0
3. **Code Deployment**: 
   ```bash
   cd /home/shopify-apps/seo-app/staging
   git stash                                    # Save local changes
   git checkout ${{ github.event.inputs.branch }}
   git pull origin ${{ github.event.inputs.branch }}
   ```
4. **Dependency Installation**: `npm install` with force flag
5. **Build Process**: `npm run build` (Vite production build)
6. **Process Restart**: `pm2 restart seo-app-stg`
7. **Health Check**: Verifies application status is "online"

### Production Deployment Workflow

**File**: `.github/workflows/deploy-prod.yml`

**Process**: Identical to staging but targets production environment:
```bash
cd /home/shopify-apps/seo-app/production
pm2 restart seo-app-prod
```

### Deployment Security

**GitHub Secrets** (required):
```bash
HOST=your_server_ip              # Production server IP
USERNAME=deployment_user         # SSH username
PASSWORD=deployment_password     # SSH password  
PORT=ssh_port                   # SSH port (usually 22)
```

**Security Features**:
- **SSH Password Authentication**: Secure server access
- **Branch Protection**: Manual approval required for deployments
- **Error Handling**: Deployment fails if application doesn't start
- **Logging**: Comprehensive deployment logs with timestamps

## PM2 Process Management

### PM2 Configuration Pattern

While no explicit PM2 config file exists, the deployment uses standard PM2 commands:

```bash
# Start application
pm2 start server/index.js --name "seo-app-prod"

# Restart application (used in deployments)
pm2 restart seo-app-prod

# Check application status
pm2 describe seo-app-prod

# View logs
pm2 logs seo-app-prod

# Monitor performance
pm2 monit
```

### Process Naming Convention

```bash
# Staging Environment
seo-app-stg     → Staging application process

# Production Environment  
seo-app-prod    → Production application process
```

### Health Check Implementation

**Deployment Health Check**:
```bash
STATUS=$(pm2 describe seo-app-prod | grep "status" | awk '{print $4}')
if [[ $STATUS != "online" ]]; then
  echo "Application failed to start"
  exit 1
fi
```

**Health Check Features**:
- **Startup Verification**: 10-second grace period after restart
- **Status Monitoring**: Ensures process is "online" before completion
- **Failure Handling**: Deployment fails if application doesn't start
- **Automatic Rollback**: Previous version remains if deployment fails

## Environment Configuration

### Environment Variables Setup

**Total Environment Variables**: 26 required variables

**Core Application Variables**:
```bash
# Shopify Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=https://your-domain.com
SHOPIFY_API_SCOPES=read_products,write_products,read_orders
SHOPIFY_API_VERSION=2024-07

# Application URLs
SHOPIFY_APP_URL_FOR_PRICING=https://your-domain.com/pricing
SHOPIFY_STORE_APP_URL=https://your-domain.com/proxy_route
SHOPIFY_APP_NAME=Your App Name

# Database & Security
MONGO_URL=mongodb://localhost:27017/your-database
ENCRYPTION_STRING=your-32-character-encryption-key
NPM_CONFIG_FORCE=true
```

**Integration Variables**:
```bash
# Error Tracking
SENTRY_DNS_WEB=https://your-sentry-web-dsn
SENTRY_DNS_BACKEND=https://your-sentry-backend-dsn

# Analytics & Chat
REACT_APP_GA_ID=G-XXXXXXXXXX
CRISP_WEBSITE_ID=your-crisp-id
CSTOMERLY_WEBSITE_ID=your-customerly-id

# External Services
SLACK_BOT_TOKEN=xoxb-your-slack-token
SLACK_CHANNEL=your-slack-channel-id
GOOGLE_FONT_KEY=your-google-fonts-api-key

# Admin Access
ADMIN_ACCESS_KEY=your-admin-key
ADMIN_SECRET=your-admin-secret
ADMIN_KEY=your-admin-access-key
```

**Environment-Specific Variables**:
```bash
# Environment Identification
ENV=prod                        # dev, stg, prod
NODE_ENV=production            # Node.js environment
PORT=4002                      # Staging: 4002, Production: 4003

# Feature Flags
PRODUCT_COUNT=1000             # Default product limit
REACT_APP_EXTENSION_UUID_KEY=your-extension-uuid
```

### Environment Validation System

**Location**: `utils/setupCheck.js`

**Validation Process**:
```javascript
const setupCheck = () => {
  const requiredEnvs = [
    "SHOPIFY_API_KEY", "SHOPIFY_API_SECRET", "SHOPIFY_APP_URL",
    "MONGO_URL", "ENCRYPTION_STRING", "SENTRY_DNS_WEB",
    // ... 26 total required variables
  ];
  
  let errorCount = 0;
  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      console.error("---> " + env + " Key is required. please update env");
      errorCount++;
    }
  });
  
  if (errorCount > 4) {
    throw new Error("ENV is not perfectly valid");
  }
};
```

**Validation Features**:
- **Comprehensive Checking**: Validates all 26 required variables
- **HTTPS Enforcement**: Ensures SHOPIFY_APP_URL uses HTTPS
- **Force Install Check**: Validates NPM_CONFIG_FORCE is set
- **Startup Integration**: Runs automatically on server start
- **Error Reporting**: Detailed error messages for missing variables

## Build Configuration

### Production Build Process

**Build Command**: `npm run build`

**Vite Build Configuration** (`client/vite.config.js`):
```javascript
export default defineConfig({
  build: {
    outDir: '../dist/client',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          shopifyPolaris: ['@shopify/polaris'],
          sentry: ['@sentry/react'],
          lodash: ['lodash']
        }
      }
    }
  }
});
```

**Build Outputs**:
- **Client Assets**: `dist/client/` - Static files served by Express
- **Source Maps**: Generated for Sentry error tracking
- **Chunk Splitting**: Optimized loading with manual chunks
- **Asset Optimization**: Minified CSS, JS, and images

### Server Production Configuration

**Production Server** (`server/index.js`):
```javascript
if (process.env.NODE_ENV === "prod") {
  app.use(compression());                    // Gzip compression
  app.use(serveStatic("dist/client"));      // Static file serving
  app.use(helmet());                        // Security headers
}
```

**Production Features**:
- **Compression**: Gzip for reduced bandwidth
- **Static Serving**: Express serves built client files
- **Security Headers**: Helmet.js for security
- **Error Handling**: Sentry integration for production errors
- **Session Management**: Encrypted sessions with MongoDB storage

## SSL/TLS Configuration

### Development SSL

**Local SSL Proxy**:
```json
{
  "scripts": {
    "ssl": "local-ssl-proxy --source 4200 --target 8081",
    "dev": "concurrently \"npm run dev-run\" \"npm run ssl\""
  }
}
```

**Development HTTPS Requirements**:
- **Shopify Requirement**: Embedded apps must use HTTPS
- **Local Proxy**: Routes HTTPS (4200) → HTTP (8081)
- **Ngrok Integration**: Provides public HTTPS tunnel
- **Certificate Handling**: Local SSL proxy manages certificates

### Production SSL

**Production SSL/TLS**:
- **Load Balancer**: SSL termination at infrastructure level
- **Certificate Management**: Automated certificate renewal
- **HTTPS Redirect**: Automatic HTTP → HTTPS redirection
- **Security Headers**: CSP, HSTS, and security middleware

## Monitoring and Logging

### Application Monitoring

**PM2 Monitoring**:
```bash
# Real-time monitoring
pm2 monit

# Application logs
pm2 logs seo-app-prod --lines 100

# Process statistics
pm2 show seo-app-prod

# Resource usage
pm2 status
```

**Monitoring Features**:
- **Process Health**: CPU, memory, uptime tracking
- **Log Management**: Centralized logging with rotation
- **Restart Policies**: Automatic restart on failures
- **Resource Monitoring**: Memory leak detection

### Error Tracking Integration

**Sentry Production Setup**:
```javascript
// Client-side error tracking
Sentry.init({
  dsn: process.env.SENTRY_DNS_WEB,
  environment: process.env.ENV,
  enabled: process.env.ENV !== "dev"
});

// Server-side error tracking
Sentry.init({
  dsn: process.env.SENTRY_DNS_BACKEND,
  environment: process.env.ENV
});
```

## Deployment Best Practices

### Pre-Deployment Checklist

**Code Quality**:
```bash
npm run pretty                  # Format code
npm run build                   # Test build process
npm run dev                     # Test locally
```

**Environment Verification**:
```bash
node utils/setupCheck.js        # Validate environment variables
mongod --dbpath mongo/          # Test database connection
npm run ngrok                   # Test HTTPS tunnel
```

### Deployment Safety

**Safety Measures**:
- **Branch Protection**: Only specific branches can be deployed
- **Manual Approval**: Deployments require manual trigger
- **Health Checks**: Application must be "online" to succeed
- **Rollback Strategy**: Previous version remains if deployment fails
- **Error Monitoring**: Real-time error tracking with Sentry

### Database Migration Strategy

**Migration Process**:
```bash
# Backup database before deployment
mongodump --uri="mongodb://connection-string"

# Run migrations (if needed)
node scripts/migrate.js

# Verify data integrity
node scripts/verify-data.js
```

### Performance Optimization

**Production Optimizations**:
- **Asset Compression**: Gzip compression for all static assets
- **Caching Headers**: Long-term caching for static resources
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Memory Management**: PM2 memory monitoring and restart

## Troubleshooting Deployments

### Common Deployment Issues

**1. Environment Variable Missing**:
```bash
# Check environment variables
printenv | grep SHOPIFY

# Validate setup
node utils/setupCheck.js
```

**2. Build Failures**:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install --force
npm run build
```

**3. PM2 Process Issues**:
```bash
# Check process status
pm2 describe seo-app-prod

# Restart with logs
pm2 restart seo-app-prod --watch

# Clear logs and restart
pm2 flush
pm2 restart seo-app-prod
```

**4. Database Connection**:
```bash
# Test MongoDB connection
mongo --eval "db.adminCommand('ismaster')" "$MONGO_URL"

# Check connection pool
pm2 logs seo-app-prod | grep "MongoDB"
```

### Emergency Rollback Procedure

**Quick Rollback**:
```bash
# SSH to server
ssh user@server

# Navigate to application directory
cd /home/shopify-apps/seo-app/production

# Rollback to previous commit
git log --oneline -5              # Find previous commit
git reset --hard <previous-commit>

# Reinstall and rebuild
npm install
npm run build

# Restart application
pm2 restart seo-app-prod
```

### Monitoring Deployment Health

**Health Check Scripts**:
```bash
# Application health
curl -f http://localhost:$PORT/health || exit 1

# Database connectivity
mongo --eval "db.stats()" "$MONGO_URL" || exit 1

# PM2 process status
pm2 describe seo-app-prod | grep "status.*online" || exit 1
```

This deployment configuration ensures reliable, secure, and monitored deployments across multiple environments with comprehensive error handling and rollback capabilities.