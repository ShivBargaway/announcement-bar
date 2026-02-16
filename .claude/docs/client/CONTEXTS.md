# Context System Documentation

## Overview
This app uses React Context API for global state management with 5 core contexts that handle different aspects of the application state. All contexts are composed together in the provider hierarchy.

## Context Hierarchy
```jsx
// App.jsx provider composition
<ProfileContextProvider>
  <LoadingContextProvider>
    <ToastContextProvider>
      <OnboardingContextProvider>
        <ReviewModalContextProvider>
          {/* App components */}
        </ReviewModalContextProvider>
      </OnboardingContextProvider>
    </ToastContextProvider>
  </LoadingContextProvider>
</ProfileContextProvider>
```

---

## Core Contexts

### ProfileContext
**Location**: `@/Context/ProfileContext`
**Purpose**: Central user data, app status, and settings management

#### State Properties
```jsx
const {
  profileData,          // User profile object with shop data
  appStatus,            // App installation/status info
  isProfileLoading,     // Profile fetch loading state
  dismissProperty,      // Dismissed UI elements tracking
  videoLinks,           // Help video configurations
  fetchProfileData,     // Function to refetch profile
  updateDismissProperty // Function to update dismissed items
} = useContext(ProfileContext);
```

#### ProfileData Structure
```jsx
profileData: {
  _id: "user_id",
  email: "user@example.com", 
  shopUrl: "store.myshopify.com",
  storeName: "Store Name",
  accessToken: "encrypted_token",
  
  // Plan Information
  recurringPlanType: "Free|Premium|Basic",
  recurringPlanName: "plan_name",
  recurringPlanId: "plan_id",
  
  // Feature Gates
  featureData: {
    advancedFeatures: "true|false",
    premiumFeatures: "true|false"
  },
  
  // App Configuration
  appLanguage: "en|es|fr|de...",
  userLanguage: "en",
  country_code: "US",
  currency: "USD",
  timezone: "America/New_York",
  
  // Usage Tracking
  lastLogin: Date,
  lastLoginArray: [...],
  
  // Credits & Limits
  aiCredits: { metaTags: 5 },
  imageCredit: 50,
  
  // Onboarding
  isOnBoardingDone: true|false,
  stepCount: 1,
  
  // Review System
  reviewRequest: {
    isReviewPosted: false,
    lastRequested: Date,
    request: 0,
    reviewMeta: {}
  }
}
```

#### Common Usage Patterns
```jsx
import { useContext } from "react";
import { ProfileContext } from "@/Context/ProfileContext";

// Basic profile access
const { profileData } = useContext(ProfileContext);

// Check user plan
const isPremium = profileData?.recurringPlanType !== "Free";

// Check feature access
const hasAdvancedFeatures = profileData?.featureData?.advancedFeatures === "true";

// Update dismissed banners/cards
const { updateDismissProperty, dismissProperty } = useContext(ProfileContext);
const dismissBanner = () => {
  updateDismissProperty({
    ...dismissProperty,
    banner: { ...dismissProperty?.banner, uniqueBannerName: true }
  });
};
```

---

### LoadingContext
**Location**: `@/Context/LoadingContext`  
**Purpose**: Global loading state management with automatic UI overlay

#### State Properties
```jsx
const {
  startLoading,       // Function to show loading overlay
  stopLoading,        // Function to hide loading overlay  
  isLoadingContext    // Boolean loading state
} = useContext(LoadingContext);
```

#### Features
- **Automatic UI**: Renders `<Loading />` component when active
- **API Integration**: Used by `useAuthenticatedFetch` automatically
- **Manual Control**: Can be controlled manually for custom operations

#### Usage Patterns
```jsx
import { useContext } from "react";
import { LoadingContext } from "@/Context/LoadingContext";

// Manual loading control
const { startLoading, stopLoading } = useContext(LoadingContext);

const handleLongOperation = async () => {
  startLoading();
  try {
    await longRunningOperation();
  } finally {
    stopLoading(); // Always stop loading
  }
};

// Check loading state
const { isLoadingContext } = useContext(LoadingContext);
const showCustomUI = !isLoadingContext;
```

**Note**: Most components don't need to use LoadingContext directly as `useAuthenticatedFetch` handles it automatically.

---

### ToastContext
**Location**: `@/Context/ToastContext`
**Purpose**: Global notification system with customizable styling

#### State Properties
```jsx
const {
  showToast,    // Function to display toast notification
  hideToast     // Function to hide toast notification
} = useContext(ToastContext);
```

#### Toast Function Signature
```jsx
showToast(message, isError, customOptions);

// Parameters:
// message (string): Toast message content
// isError (boolean): Show as error (red) or success (default)
// customOptions (object): Custom styling and duration
```

#### Usage Patterns
```jsx
import { useContext } from "react";
import { ToastContext } from "@/Context/ToastContext";

const { showToast } = useContext(ToastContext);

// Success toast
showToast("Settings saved successfully!");

// Error toast
showToast("Failed to save settings", true);

// Custom styled toast
showToast("Custom message", false, {
  duration: 8000,
  backColor: "#4CAF50",
  textColor: "#FFFFFF"
});
```

#### Custom Styling Options
```jsx
const customOptions = {
  duration: 5000,           // Toast duration in ms
  backColor: "#FF5722",     // Background color
  textColor: "#FFFFFF"      // Text color
};
```

**Note**: API errors are automatically shown as toasts via `useAuthenticatedFetch` error interceptor.

---

### OnboardingContext
**Location**: `@/Context/OnboardingContext`
**Purpose**: Onboarding flow and suggested items management

#### State Properties
```jsx
const {
  onboardingData,       // Onboarding progress data
  isOnboardingLoading,  // Onboarding fetch loading state
  suggestedItems,       // Array of suggested tasks/items
  updateOnboardingData, // Function to update onboarding data
  fetchOnboardingData,  // Function to refetch onboarding data
  updateSuggestedItem   // Function to update suggested item status
} = useContext(OnboardingContext);
```

#### Suggested Items Structure
```jsx
suggestedItems: [
  {
    id: "setup-seo",
    title: "Set up SEO",
    description: "Configure meta tags and schema",
    icon: "SearchIcon",
    status: false,          // false = incomplete, true = completed
    navigate: "/seo/setup", // Navigation path
    showBadge: true,        // Show status badge
    badgeStatus: false      // Badge on/off state
  }
]
```

#### Usage Patterns
```jsx
import { useContext } from "react";
import { OnboardingContext } from "@/Context/OnboardingContext";

// Access suggested items (used by SuggestedItems component)
const { suggestedItems } = useContext(OnboardingContext);
const incompleteItems = suggestedItems.filter(item => !item.status);

// Update item status
const { updateSuggestedItem } = useContext(OnboardingContext);
const markItemComplete = (itemId) => {
  updateSuggestedItem(itemId, true);
};

// Check onboarding completion
const { onboardingData } = useContext(OnboardingContext);
const isOnboardingComplete = onboardingData?.isComplete;
```

---

### ReviewModalContext
**Location**: `@/Context/ReviewContext`
**Purpose**: Review popup modal state management

#### State Properties
```jsx
const {
  reviewModalData,     // Modal data and configuration
  setReviewModalData   // Function to show/hide modal
} = useContext(ReviewModalContext);
```

#### Usage Patterns
```jsx
import { useContext } from "react";
import { ReviewModalContext } from "@/Context/ReviewContext";

// Show review modal
const { setReviewModalData } = useContext(ReviewModalContext);
const showReviewModal = () => {
  setReviewModalData({
    isOpen: true,
    type: "feedback-request",
    title: "How was your experience?"
  });
};

// Hide modal
const hideReviewModal = () => {
  setReviewModalData({ isOpen: false });
};
```

---

## Context Integration Patterns

### Component Context Usage
```jsx
// Standard pattern for components using multiple contexts
import { useContext } from "react";
import { ProfileContext } from "@/Context/ProfileContext";
import { ToastContext } from "@/Context/ToastContext";
import { LoadingContext } from "@/Context/LoadingContext";

const MyComponent = () => {
  const { profileData } = useContext(ProfileContext);
  const { showToast } = useContext(ToastContext);
  const { startLoading, stopLoading } = useContext(LoadingContext);
  
  // Component logic using contexts
  const handleAction = async () => {
    if (!profileData) {
      showToast("Profile not loaded", true);
      return;
    }
    
    startLoading();
    try {
      // Perform action
      showToast("Action completed successfully!");
    } catch (error) {
      showToast("Action failed", true);
    } finally {
      stopLoading();
    }
  };

  return (
    // Component JSX
  );
};
```

### Form Integration Pattern
```jsx
// CommonForm automatically integrates with contexts
const MyFormPage = () => {
  const { profileData } = useContext(ProfileContext);
  const { showToast } = useContext(ToastContext);
  
  const handleSubmit = async (values) => {
    // useAuthenticatedFetch automatically uses LoadingContext
    try {
      const response = await fetch.post("endpoint", values);
      showToast("Form submitted successfully!");
    } catch (error) {
      // Error toast shown automatically by API interceptor
      console.error("Form submission failed");
    }
  };

  return (
    <CommonForm
      formFields={formFields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
};
```

### Premium Feature Gating
```jsx
// Common pattern for premium feature access
const PremiumFeatureComponent = () => {
  const { profileData } = useContext(ProfileContext);
  const { showToast } = useContext(ToastContext);
  
  const isPremium = profileData?.recurringPlanType !== "Free";
  const hasFeatureAccess = profileData?.featureData?.premiumFeatures === "true";
  
  const handlePremiumFeature = () => {
    if (!isPremium || !hasFeatureAccess) {
      showToast("This feature requires a premium plan", true);
      return;
    }
    
    // Execute premium feature
  };
  
  return (
    <PremiumButton title="Unlock Premium Features">
      <Button onClick={handlePremiumFeature}>
        Premium Feature
      </Button>
    </PremiumButton>
  );
};
```

---

## Context Provider Setup

### Provider Composition
**Location**: `client/App.jsx`
```jsx
import { ProfileContextProvider } from "@/Context/ProfileContext";
import { LoadingContextProvider } from "@/Context/LoadingContext";
import { ToastContextProvider } from "@/Context/ToastContext";
import { OnboardingContextProvider } from "@/Context/OnboardingContext";
import { ReviewModalContextProvider } from "@/Context/ReviewContext";

function App() {
  return (
    <ProfileContextProvider>
      <LoadingContextProvider>
        <ToastContextProvider>
          <OnboardingContextProvider>
            <ReviewModalContextProvider>
              <Routes />
            </ReviewModalContextProvider>
          </OnboardingContextProvider>
        </ToastContextProvider>
      </LoadingContextProvider>
    </ProfileContextProvider>
  );
}
```

### Context Dependencies
- **ProfileContext**: Independent, loads first
- **LoadingContext**: Used by API calls and manual operations
- **ToastContext**: Used by API errors and user notifications
- **OnboardingContext**: Depends on ProfileContext for user data
- **ReviewModalContext**: Independent modal state

---

## Common Development Patterns

### Error Handling with Contexts
```jsx
// Standard error handling pattern
try {
  const result = await fetch.post("endpoint", data);
  showToast("Operation successful!");
  return result;
} catch (error) {
  // Error toast shown automatically by useAuthenticatedFetch
  // Additional error handling if needed
  console.error("Operation failed:", error);
  throw error;
}
```

### Conditional Rendering Based on Profile
```jsx
// Common conditional rendering patterns
const { profileData, isProfileLoading } = useContext(ProfileContext);

if (isProfileLoading) {
  return <CommonSkeletonPage />;
}

if (!profileData) {
  return <FallbackUIComponent />;
}

if (profileData.error) {
  return <ErrorComponent />;
}

// Render main content
return <MainContent />;
```

### Dismissible UI Elements
```jsx
// Pattern for dismissible banners/cards
const { dismissProperty, updateDismissProperty } = useContext(ProfileContext);
const [showBanner, setShowBanner] = useState(false);

useEffect(() => {
  const isDismissed = dismissProperty?.banner?.myBanner;
  setShowBanner(!isDismissed);
}, [dismissProperty]);

const handleDismiss = () => {
  updateDismissProperty({
    ...dismissProperty,
    banner: { ...dismissProperty?.banner, myBanner: true }
  });
  setShowBanner(false);
};
```

This context system provides a robust foundation for state management across the entire application, with automatic integration into components, API calls, and user interactions.