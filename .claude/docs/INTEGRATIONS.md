# Third-Party Integrations Guide

This document covers all external service integrations in the Shopify App Starter Kit, including chat systems, analytics, monitoring, and feedback tools.

## Integration Architecture

### Environment-Based Configuration

All integrations are controlled via environment variables and conditional loading:

```javascript
// Environment-based enabling
if (process.env.CRISP_WEBSITE_ID) {
  // Load Crisp integration
}

if (process.env.SENTRY_DNS_WEB && env !== "dev") {
  // Initialize Sentry in non-dev environments
}
```

### User Profile Integration

Most integrations automatically sync with user profile data:

```javascript
// Common pattern for user data passing
const userProfileData = {
  shopUrl: profileData.shopUrl,
  plan: profileData.recurringPlanName,
  email: profileData.email,
  storeName: profileData.storeName,
  // ... additional profile fields
};
```

## Chat and Support Systems

### 1. Crisp Chat Integration

**Location**: `/client/Components/Common/Crisp.jsx`

**Purpose**: Live chat support with automatic user identification

#### Environment Variables
```bash
CRISP_WEBSITE_ID=your_crisp_website_id
HIDE_CRISP_LOGO=true                    # Optional: Hide Crisp branding
```

#### Implementation Pattern
```javascript
import { Crisp } from "crisp-sdk-web";
import { ProfileContext } from "@/Context/ProfileContext";

const CrispChat = () => {
  const { profileData } = useContext(ProfileContext);
  
  useEffect(() => {
    // Configure Crisp with website ID
    Crisp.configure(process.env.CRISP_WEBSITE_ID);
    
    // Set user identification
    profileData?.email && Crisp.user.setEmail(profileData.email);
    profileData?.phone && Crisp.user.setPhone(profileData.phone.replace(/\D/g, ""));
    profileData?.storeName && Crisp.user.setNickname(profileData.storeName);
    
    // Set user segments for targeting
    let planSegmentText = profileData.recurringPlanType.toLowerCase() == "paid" ? "New_Paid" : "New_Free";
    Crisp.session.setSegments([planSegmentText, profileData.plan_display_name, profileData.country_name], true);
    
    // Pass custom data
    Crisp.session.setData({
      shopUrl: profileData.shopUrl,
      plan: profileData.recurringPlanName,
      recurringPlanType: profileData.recurringPlanType,
      country_name: profileData.country_name,
      createdOn: new Date(profileData.created).toLocaleDateString("en-GB")
    });
    
    // Optional: Hide chat widget
    process.env.HIDE_CRISP_LOGO && Crisp.chat.hide();
  }, [profileData]);
  
  return <React.Fragment></React.Fragment>;
};
```

#### Key Features
- **Automatic User Identification**: Email, phone, store name
- **Segmentation**: Paid vs Free users, plan types, countries
- **Custom Data**: Store details, plan information, creation date
- **Conditional Display**: Can be hidden based on environment

### 2. Customerly Live Chat

**Location**: `/client/Components/Common/CustomerlyUpdate.jsx`

**Purpose**: Alternative live chat with advanced user tracking

#### Environment Variables
```bash
CSTOMERLY_WEBSITE_ID=your_customerly_website_id
```

#### Implementation Pattern
```javascript
import { useCustomerly } from "react-live-chat-customerly";

const CustomerlyWrapper = ({ profileData }) => {
  const { load, update } = useCustomerly();
  
  useEffect(() => {
    // Convert dates to Unix timestamps
    const converDateToUnixTimestamp = (date) => {
      return Math.floor(new Date(date).getTime() / 1000);
    };
    
    // Prepare comprehensive user data
    const userData = {
      user_id: profileData?._id,
      email: profileData?.email,
      name: profileData?.storeName,
      singleConversation: true,
      attributes: {
        country_code: profileData?.country_code,
        created: converDateToUnixTimestamp(profileData?.created),
        domain: profileData?.domain,
        recurringplantype: profileData?.recurringPlanType,
        shopurl: profileData?.shopUrl,
        productcount: profileData?.productCount,
        // ... extensive profile mapping
      }
    };
    
    load(userData);
  }, [profileData]);
  
  // Dynamic iframe resizing logic
  useEffect(() => {
    const setHeightWidth = () => {
      const iframe = document.querySelector(".cly-ms__sc-1w7m24j-0 iframe");
      // ... iframe dimension management
    };
    
    const interval = setInterval(() => {
      const isSet = setHeightWidth();
      if (isSet) clearInterval(interval);
    }, 1000);
  }, []);
  
  return <React.Fragment></React.Fragment>;
};
```

#### Key Features
- **Comprehensive User Tracking**: 25+ profile attributes
- **Unix Timestamp Conversion**: Proper date handling
- **Dynamic UI Management**: Automatic iframe resizing
- **Single Conversation Mode**: Unified chat experience

## Analytics and Monitoring

### 3. Sentry Error Tracking

**Location**: `/client/Services/Logger/Sentry.js`

**Purpose**: Error monitoring and performance tracking

#### Environment Variables
```bash
SENTRY_DNS_WEB=your_sentry_web_dsn
SENTRY_DNS_BACKEND=your_sentry_backend_dsn
```

#### Client-Side Implementation
```javascript
import * as Sentry from "@sentry/react";

export function createSentryLogger(env) {
  return {
    init() {
      Sentry.init({
        dsn: process.env.SENTRY_DNS_WEB,
        environment: env,
        enabled: env !== "dev",                    // Disabled in development
        tracesSampleRate: 1,
        release: "1.0.0",
        
        // Filter out short-duration transactions
        beforeSendTransaction(transaction) {
          const duration = transaction.timestamp * 1000 - transaction.start_timestamp * 1000;
          if (duration < 10000) return null;       // Ignore < 10s transactions
          return transaction;
        },
        
        // Ignore specific errors
        ignoreErrors: [
          /Request failed with status code (403)/,
        ],
        
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0.05,
      });
    },
    
    configureUser(user) {
      Sentry.configureScope((scope) => {
        scope.setUser(user);
        scope.setTag("shopUrl", user.shopUrl);
        scope.setTag("storeId", user.storeId);
      });
    },
    
    error(error, { tags, extras } = {}) {
      Sentry.withScope((scope) => {
        if (tags) scope.setTags(tags);
        if (extras) scope.setExtras(extras);
        const capture = typeof error === "string" ? Sentry.captureMessage : Sentry.captureException;
        capture(error);
      });
    }
  };
}
```

#### Server-Side Implementation
```javascript
// server/backend/services/logger/sentry.js
import * as Sentry from "@sentry/node";

export const createSentryServerLogger = (env) => ({
  init() {
    Sentry.init({
      dsn: process.env.SENTRY_DNS_BACKEND,
      environment: env,
      enabled: env === "prod",
    });
  }
});
```

#### Key Features
- **Environment-Specific**: Disabled in development
- **Performance Filtering**: Ignores short transactions
- **User Context**: Automatic user identification
- **Error Filtering**: Ignores known/expected errors

### 4. Hotjar User Analytics

**Environment Variables**
```bash
HOTJAR_TRACKING_ID=your_hotjar_tracking_id
HOTJAR_VERSION=6
```

#### Implementation Pattern
```javascript
import Hotjar from '@hotjar/browser';

// Initialize in routing component
useEffect(() => {
  if (profileData && !adminEnvAndTeamCheck(profileData)) {
    if (process.env.HOTJAR_TRACKING_ID) {
      Hotjar.init(process.env.HOTJAR_TRACKING_ID, process.env.HOTJAR_VERSION);
    }
  }
}, [profileData]);
```

#### Key Features
- **User Behavior Tracking**: Heatmaps, recordings, surveys
- **Conditional Loading**: Only for regular users (not admin/team)
- **Environment-Based**: Controlled via environment variables

### 5. Google Analytics 4

**Environment Variables**
```bash
REACT_APP_GA_ID=your_ga4_measurement_id
```

#### Implementation Pattern
```javascript
import ReactGA from 'react-ga4';

// Initialize GA4
useEffect(() => {
  if (process.env.REACT_APP_GA_ID) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
    
    // Track page views
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }
}, []);
```

## Feedback and User Research

### 6. Frill Feedback Widget

**Location**: `/client/Components/Common/FrillEmbeddedWidget.jsx`

**Purpose**: Feature requests and feedback collection

#### Implementation Pattern
```javascript
const FrillWidget = memo(({ widgetKey, label, selector, frame, buttonProps }) => {
  const { profileData } = useContext(ProfileContext);
  
  useEffect(() => {
    if (!profileData?.frillSSOToken) return;
    
    // Frill widget initialization
    (function (t, r) {
      function s() {
        var a = r.getElementsByTagName("script")[0],
            e = r.createElement("script");
        e.type = "text/javascript";
        e.async = true;
        e.src = "https://widget.frill.co/v2/container.js";
        e.onload = function () {
          window.Frill("container", {
            key: widgetKey,
            ssoToken: profileData?.frillSSOToken,    // SSO authentication
          });
        };
        a.parentNode.insertBefore(e, a);
      }
      
      // Initialize when DOM ready
      r.readyState === "complete" || r.readyState === "interactive" 
        ? s() 
        : r.addEventListener("DOMContentLoaded", s);
    })(window, document);
  }, [profileData]);
  
  return (
    <ButtonGroup>
      <div className={selector}>
        <Button {...buttonProps}>{label}</Button>
      </div>
    </ButtonGroup>
  );
});
```

#### Key Features
- **SSO Integration**: Secure user authentication
- **Dynamic Loading**: Script injection with async loading
- **Customizable UI**: Button styling and positioning
- **Widget Variants**: Frame vs button display modes

## External APIs and Services

### 7. Google Services Integration

**Environment Variables**
```bash
GOOGLE_FONT_KEY=your_google_fonts_api_key
```

#### Font Picker Integration
```javascript
// Font picker with Google Fonts API
import FontPicker from '@techstack/font-picker-react';

<FontPicker
  apiKey={process.env.GOOGLE_FONT_KEY}
  activeFontFamily={selectedFont}
  onChange={(nextFont) => setSelectedFont(nextFont.family)}
  limit={300}                                    // Limit font options
  sort="popularity"
/>
```

### 8. Slack Integration

**Environment Variables**
```bash
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_CHANNEL=your_slack_channel_id
```

#### Server-Side Slack Notifications
```javascript
// server/backend/helpers/slack.js
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export const sendSlackNotification = async (message, channel = process.env.SLACK_CHANNEL) => {
  try {
    await slack.chat.postMessage({
      channel: channel,
      text: message,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message
          }
        }
      ]
    });
  } catch (error) {
    console.error('Slack notification failed:', error);
  }
};
```

## Integration Management Best Practices

### 1. Environment-Based Loading

```javascript
// Conditional integration loading
const IntegrationManager = () => {
  return (
    <>
      {process.env.CRISP_WEBSITE_ID && <CrispChat />}
      {process.env.CSTOMERLY_WEBSITE_ID && <CustomerlyUpdate />}
      {process.env.HOTJAR_TRACKING_ID && profileData && <HotjarInit />}
    </>
  );
};
```

### 2. Profile-Based Integration

```javascript
// User context-aware integrations
useEffect(() => {
  if (!profileData || profileData.error) return;
  
  // Only load for non-admin users
  if (!adminEnvCheck(profileData)) {
    loadExternalIntegrations();
  }
}, [profileData]);
```

### 3. Error Handling and Fallbacks

```javascript
// Integration error handling
const initializeIntegration = async (service) => {
  try {
    await service.init();
  } catch (error) {
    console.warn(`${service.name} integration failed:`, error);
    // Continue without this integration
  }
};
```

### 4. Performance Optimization

```javascript
// Lazy loading of integrations
const ChatIntegration = lazy(() => import('./ChatIntegration'));

// Load only when user interacts
const [shouldLoadChat, setShouldLoadChat] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShouldLoadChat(true), 5000);  // Delay 5s
  return () => clearTimeout(timer);
}, []);
```

## Integration Monitoring

### Performance Impact Tracking

```javascript
// Monitor integration load times
const trackIntegrationPerformance = (integrationName, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  Sentry.addBreadcrumb({
    category: 'integration',
    message: `${integrationName} loaded in ${duration}ms`,
    level: 'info'
  });
};
```

### Health Checks

```javascript
// Integration health monitoring
const checkIntegrationHealth = () => {
  const health = {
    crisp: !!window.CRISP,
    customerly: !!window.Customerly,
    sentry: !!window.__SENTRY__,
    hotjar: !!window.hj,
  };
  
  return health;
};
```

## Integration Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   ```bash
   # Ensure variables are defined in Vite config
   "process.env.INTEGRATION_KEY": JSON.stringify(process.env.INTEGRATION_KEY)
   ```

2. **CSP Blocking External Scripts**
   ```javascript
   // Update CSP headers to allow integration domains
   Content-Security-Policy: script-src 'self' widget.frill.co crisp.chat
   ```

3. **Integration Conflicts**
   ```javascript
   // Namespace integrations to avoid conflicts
   window.AppIntegrations = {
     crisp: window.CRISP,
     customerly: window.Customerly
   };
   ```

4. **Performance Issues**
   ```javascript
   // Load integrations after critical path
   requestIdleCallback(() => {
     loadNonCriticalIntegrations();
   });
   ```

This integration system provides comprehensive third-party service support while maintaining performance and reliability through proper error handling and conditional loading.