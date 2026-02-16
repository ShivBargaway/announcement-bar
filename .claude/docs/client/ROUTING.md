# Routing and Navigation Documentation

## Overview
This app uses React Router v6 with a sophisticated navigation system that includes lazy loading, navigation history tracking, access control, and dual navigation modes for different user contexts.

## Core Routing Architecture

### Route Structure
**Main Router**: `client/Routes.jsx`
**Navigation**: `@/Components/Common/NavigationMenu`

```jsx
// Basic route structure
<ReactRouterRoutes>
  <Route path="/" element={<Index />} />
  <Route path="/pricing" element={<Pricing />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="*" element={<NotFound />} />
</ReactRouterRoutes>
```

---

## Navigation System

### Dual Navigation Modes
The app supports two navigation modes based on user context:

#### 1. App Bridge Navigation (Default)
**Used for**: Regular Shopify embedded app users
```jsx
// Uses Shopify App Bridge NavMenu
<NavMenu>
  <Link to="/" rel="home" />
  {NavigationLinks.map(path => (
    <Link to={path.destination}>{path.label}</Link>
  ))}
</NavMenu>
```

#### 2. Polaris Navigation (Admin Mode)  
**Used for**: Admin users with `adminAccessToken`
```jsx
// Uses Shopify Polaris Navigation
<Navigation location={location.pathname}>
  <Navigation.Section items={navigationItems} />
</Navigation>
```

### Navigation Menu Component
**Location**: `@/Components/Common/NavigationMenu`

#### Exports
```jsx
// Navigation component
import { AppNavigationMenu } from "@/Components/Common/NavigationMenu";

// Navigation function
import { navigate } from "@/Components/Common/NavigationMenu";
const setNavigate = navigate();
setNavigate("/path/to/page");
```

#### Navigation Links Structure
```jsx
// From Navigation.mock.js
NavigationLinks = [
  {
    label: "Dashboard",
    destination: "/",
    key: "dashboard",
    subNavigationItems: [
      {
        label: "Overview", 
        destination: "/overview"
      },
      {
        label: "Analytics",
        destination: "/analytics"
      }
    ]
  }
];
```

---

## Navigation History System

### Visited Paths Tracking
**Purpose**: Enables intelligent back button functionality and navigation history

```jsx
// Routes.jsx - Navigation history management
const [visitedPaths, setVisitedPaths] = useState(
  getSessionStorageItem("wsvisitedPaths") || []
);

// visitedPaths structure
visitedPaths = [
  {
    pathname: "/settings",
    queryString: "?tab=general"
  },
  {
    pathname: "/pricing", 
    queryString: ""
  }
];
```

### Back Button Implementation
```jsx
// Automatic back button generation
const backbutton = useMemo(
  () => (visitedPaths?.length > 1 ? 
    { content: "Back", onAction: handleBackClick } : 
    null
  ),
  [visitedPaths]
);

// Back navigation logic
const handleBackClick = useCallback(() => {
  if (visitedPaths.length > 1) {
    const lastPath = visitedPaths.at(-2);
    const updatedPaths = visitedPaths.slice(0, -1);
    setVisitedPaths(updatedPaths);
    navigate(`${lastPath.pathname}${lastPath.queryString}`);
  }
}, [visitedPaths]);
```

### Path Tracking Configuration
```jsx
// Paths to skip from history tracking
const skipPaths = [
  // Add paths that shouldn't be tracked
];

// Paths that include query string tracking
const addQueryStringPath = [
  // Add paths where query params matter for history
];
```

---

## Lazy Loading System

### Component Lazy Loading
**Pattern**: All page components are lazy loaded for performance
```jsx
// Lazy loading imports
const Settings = lazy(() => import("@/Pages/Settings/Settings"));
const Pricing = lazy(() => import("@/Pages/Pricing/Pricing"));
const FormPreview = lazy(() => import("@/Pages/FormPreview/FormPreview"));
const NotFound = lazy(() => import("@/Pages/NotFound/NotFound"));

// Heavy components also lazy loaded
const ReviewPopup = lazy(() => import("@/Components/Common/ReviewPopup"));
const Support = lazy(() => import("@/Components/Common/Support"));
const AppUninstall = lazy(() => import("@/Components/Common/AppUninstall"));
const CustomPlanModal = lazy(() => import("@/Components/Common/CustomizeServiceButton/CustomPlanModal"));
```

### Suspense Wrapper
```jsx
<Suspense fallback={<Loading />}>
  <ReviewPopup />
  <Support />
  <AppNavigationMenu />
  
  <ReactRouterRoutes>
    {/* All routes wrapped in Suspense */}
  </ReactRouterRoutes>
</Suspense>
```

---

## Access Control System

### Profile-Based Route Protection
```jsx
// Routes.jsx access control logic
const { profileData } = useContext(ProfileContext);

// Error state handling
if (profileData && profileData.error) {
  return <FallbackUIComponent />;
}

// Partner account restriction
if (checkPartenerAcc(profileData)) {
  return <NoAccessStoreDesign />;
}

// Loading state
if (!profileData) {
  return <div className="loading-overlay"></div>;
}
```

### Onboarding Flow Control
```jsx
// Conditional onboarding display
{profileData && !profileData.isOnBoardingDone && <OnBoarding />}
```

### Admin Route Handling
Different authentication modes are handled automatically:
- **Regular users**: Shopify App Bridge authentication
- **Admin users**: localStorage admin token authentication
- **Admin panel**: Special admin panel token handling

---

## Internationalization Integration

### Dynamic Language Loading
```jsx
// Routes.jsx i18n initialization
useEffect(() => {
  const initializeI18n = async () => {
    let languageToLoad = "en"; // Default
    if (!isAdmin() && profileData?.appLanguage) {
      languageToLoad = profileData.appLanguage;
    }
    
    // Dynamic language import
    const languageResource = await import(`@/LanguageJS/${languageToLoad}.js`);
    i18n.addResourceBundle(languageToLoad, "translation", languageResource.default);
    await i18n.changeLanguage(languageToLoad);
    setSessionStorageItem("appLanguage", languageToLoad);
  };

  initializeI18n();
}, [profileData?.appLanguage]);
```

---

## Route Definitions

### Core Application Routes
```jsx
// Main application routes with back button support
<Route path="/" element={<Index backbutton={backbutton} />} />
<Route path="/pricing" element={<Pricing hasBillingButton={true} backbutton={backbutton} />} />
<Route path="/settings" element={<Settings backbutton={backbutton} />} />
<Route path="/form-preview" element={<FormPreview backbutton={backbutton} />} />
<Route path="/feedback" element={<Feedback backbutton={backbutton} />} />
<Route path="/review" element={<Review />} />
<Route path="*" element={<NotFound />} />
```

### Extended Routes
```jsx
// Additional specialized routes
<Route path="/pricing/one-time-plan" element={<OneTimeServicePrice backbutton={backbutton} />} />
<Route path="/pricing/custom-plan/:type" element={<CustomPlanModal backbutton={backbutton} />} />
```

### Route Parameters
```jsx
// Dynamic route with parameters
"/pricing/custom-plan/:type"

// Usage in component
import { useParams } from "react-router-dom";
const { type } = useParams(); // Gets the :type parameter
```

---

## Navigation Patterns

### Programmatic Navigation
```jsx
// Using the navigation helper
import { navigate } from "@/Components/Common/NavigationMenu";

const setNavigate = navigate();

// Basic navigation
setNavigate("/pricing");

// Navigation with query parameters
setNavigate("/settings?tab=advanced");

// Navigation with state
setNavigate("/pricing", { replace: true });
```

### Component Navigation Integration
```jsx
// Common pattern in components
import { navigate } from "@/Components/Common/NavigationMenu";

const MyComponent = () => {
  const setNavigate = navigate();
  
  const handleAction = () => {
    // Perform action then navigate
    setNavigate("/success-page");
  };

  return (
    <Button onClick={handleAction}>
      Complete Action
    </Button>
  );
};
```

### Link Components
```jsx
// Using React Router Link
import { Link } from "react-router-dom";

<Link to="/pricing">Go to Pricing</Link>

// With query parameters
<Link to="/settings?tab=general">Settings</Link>

// With state
<Link to="/pricing" state={{ from: "dashboard" }}>Pricing</Link>
```

---

## Advanced Features

### Chat Integration Routing
```jsx
// Conditional chat widget loading based on routing context
const showChat = !location?.pathname?.includes("admin") && 
                !location?.pathname?.includes("public");

{showChat && process.env.CUSTOMERLY_WEBSITE_ID && <CustomerlyUpdate />}
{showChat && <CrispChat />}
```

### Analytics Integration
```jsx
// Hotjar tracking conditional on routing
useEffect(() => {
  if (profileData && !adminEnvAndTeamCheck(profileData)) {
    if (process.env.HOTJAR_TRACKING_ID) {
      Hotjar.init(process.env.HOTJAR_TRACKING_ID, process.env.HOTJAR_VERSION);
    }
  }
}, [profileData]);
```

### Session Storage Integration
```jsx
// Persist navigation history
useEffect(() => {
  setSessionStorageItem("wsvisitedPaths", visitedPaths);
}, [visitedPaths]);

// Restore navigation history
const [visitedPaths, setVisitedPaths] = useState(
  getSessionStorageItem("wsvisitedPaths") || []
);
```

---

## Development Patterns

### Creating New Routes

**CRITICAL: Route Creation Process (ALWAYS follow these steps when creating new routes/pages):**

#### Step 1: Route Registration in `client/Routes.jsx`
```jsx
// 1. Import with lazy at top of file
const NewPage = lazy(() => import("@/Pages/NewPage/NewPage"));

// 2. Add route in ReactRouterRoutes section
<Route path="/new-page" element={<NewPage backbutton={backbutton} />} />
```

#### Step 2: Navigation Menu in `client/Assets/Mocks/Navigation.mock.js`
```jsx
{
  label: t("mocks.navigation.New Page") || "New Page",
  destination: "/new-page",
}
```

#### Step 3: Page Component Creation
Create in `client/Pages/NewPage/NewPage.jsx` following existing patterns:
```jsx
import React from "react";
import { Card, Page } from "@shopify/polaris";

const NewPage = ({ backbutton }) => {
  return (
    <Page 
      title="New Page"
      backAction={backbutton}
    >
      <Card>
        {/* Page content */}
      </Card>
    </Page>
  );
};

export default NewPage;
```

#### Step 4: Navigation Integration (if needed)
```jsx
// Programmatic navigation to new route
import { navigate } from "@/Components/Common/NavigationMenu";

const setNavigate = navigate();
setNavigate("/new-page");
```

### Route Guard Patterns
```jsx
// Component-level route guarding
const ProtectedComponent = () => {
  const { profileData } = useContext(ProfileContext);
  
  if (!profileData) {
    return <Loading />;
  }
  
  if (profileData.error) {
    return <FallbackUIComponent />;
  }
  
  if (!hasRequiredPermission(profileData)) {
    return <NoAccessComponent />;
  }
  
  return <ActualComponent />;
};
```

### Navigation State Management
```jsx
// Component receiving navigation state
import { useLocation } from "react-router-dom";

const Component = () => {
  const location = useLocation();
  const navigationState = location.state;
  
  // Use navigation state
  const fromPage = navigationState?.from;
  
  return (
    <div>
      {fromPage && <Text>Came from: {fromPage}</Text>}
    </div>
  );
};
```

### Back Button Integration
```jsx
// Standard page component with back button
const MyPage = ({ backbutton }) => {
  return (
    <Page 
      title="My Page"
      backAction={backbutton}
    >
      {/* Page content */}
    </Page>
  );
};
```

---

## Performance Considerations

### Code Splitting
- All page components are lazy loaded
- Heavy components (modals, support) are lazy loaded
- Dynamic language imports for i18n

### Navigation Optimization
- Navigation history stored in sessionStorage
- Minimal re-renders with useMemo and useCallback
- Intelligent back button generation

### Memory Management
- Navigation history limited to prevent memory leaks
- Session storage cleanup on page unload
- Proper cleanup of navigation listeners

This routing system provides a comprehensive navigation experience with intelligent back button functionality, access control, performance optimization, and seamless integration with the Shopify app environment.