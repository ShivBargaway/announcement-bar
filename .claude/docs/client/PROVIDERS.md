# Providers Documentation

## Overview
This app uses a sophisticated provider system for Shopify App Bridge integration, Polaris UI framework, and context state management. All providers are organized in the `client/Providers/` directory and compose together to create the complete app wrapper.

## Provider Architecture

### Provider Composition Structure
```jsx
// App.jsx provider composition
<AppBridgeProvider>
  <PolarisProvider>
    <ContextProviderList>
      {/* All app content */}
    </ContextProviderList>
  </PolarisProvider>
</AppBridgeProvider>
```

---

## AppBridgeProvider

### Purpose
Provides Shopify App Bridge integration for embedded app functionality within Shopify Admin.

### Location
`client/Providers/AppBridgeProvider.jsx`

### Key Features
- **App Bridge Client**: Initializes Shopify App Bridge for embedded app experience
- **Authentication**: Handles Shopify OAuth and session management
- **Navigation**: Provides App Bridge navigation capabilities
- **Resource Access**: Enables access to Shopify Admin APIs through App Bridge

### Configuration
```jsx
// App Bridge configuration
const config = {
  apiKey: process.env.SHOPIFY_API_KEY,
  host: new URLSearchParams(location.search).get("host"),
  forceRedirect: true
};

// App Bridge client initialization
const app = createApp(config);
```

### Context Provided
```jsx
// App Bridge context structure
const appBridgeContext = {
  app: appBridgeClient,
  loading: boolean,
  error: errorState
};
```

---

## PolarisProvider

### Purpose
Provides Shopify Polaris design system integration for consistent UI components and theming.

### Location
`client/Providers/PolarisProvider.jsx`

### Key Features
- **Polaris Components**: Access to full Polaris component library
- **Theme Management**: Polaris theme configuration and customization
- **Internationalization**: Built-in i18n support through Polaris
- **Toast Notifications**: Integrated toast messaging system

### Configuration
```jsx
// Polaris provider setup
<AppProvider
  i18n={translations}
  theme={theme}
  features={{ newDesignLanguage: true }}
>
  {children}
</AppProvider>
```

### Theme Customization
```jsx
// Custom theme configuration
const theme = {
  colorScheme: 'light', // or 'dark'
  colors: {
    primary: '#008060',
    // ... other theme colors
  }
};
```

---

## ContextProviderList

### Purpose
Composes all React Context providers in the correct order for state management throughout the app.

### Location
`client/Providers/ContextProviderList.jsx`

### Provider Stack
```jsx
// Provider composition order (outermost to innermost)
<ProfileContextProvider>
  <LoadingContextProvider>
    <ToastContextProvider>
      <OnboardingContextProvider>
        <ReviewModalContextProvider>
          {children}
        </ReviewModalContextProvider>
      </OnboardingContextProvider>
    </ToastContextProvider>
  </LoadingContextProvider>
</ProfileContextProvider>
```

### Provider Dependencies
- **ProfileContext**: Must be outermost (user data for all other contexts)
- **LoadingContext**: Global loading states
- **ToastContext**: Notification system
- **OnboardingContext**: Depends on ProfileContext for user state
- **ReviewModalContext**: Review and feedback system

---

## AdminAccess Provider

### Purpose
Handles admin-specific authentication and access control for administrative features.

### Location
`client/Providers/AdminAccess.jsx`

### Key Features
- **Admin Authentication**: Separate auth system for admin users
- **Permission Management**: Role-based access control
- **Admin Token Management**: localStorage-based admin token handling
- **Route Protection**: Admin route access control

### Usage Pattern
```jsx
// Admin access wrapper
<AdminAccess requiredPermission="admin">
  <AdminComponent />
</AdminAccess>
```

---

## Development Patterns

### Creating New Providers

#### Step 1: Provider Component Structure
```jsx
// NewProvider.jsx
import React, { createContext, useContext, useReducer } from 'react';

const NewContext = createContext();

export const useNewContext = () => {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error('useNewContext must be used within NewProvider');
  }
  return context;
};

export const NewProvider = ({ children }) => {
  // Provider logic here
  
  return (
    <NewContext.Provider value={contextValue}>
      {children}
    </NewContext.Provider>
  );
};
```

#### Step 2: Add to ContextProviderList
```jsx
// Add to ContextProviderList.jsx in correct order
<ExistingProvider>
  <NewProvider>
    {/* ... rest of providers */}
  </NewProvider>
</ExistingProvider>
```

#### Step 3: Export from Index
```jsx
// Add to Providers/Index.js
export { NewProvider } from "./NewProvider";
```

### Provider Communication Patterns

#### Context Dependencies
```jsx
// When one context depends on another
const MyProvider = ({ children }) => {
  const { profileData } = useContext(ProfileContext); // Dependency
  
  // Use profileData in provider logic
  const contextValue = useMemo(() => ({
    // ... context value based on profileData
  }), [profileData]);
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};
```

#### Cross-Provider Communication
```jsx
// Using multiple contexts in components
const MyComponent = () => {
  const { profileData } = useContext(ProfileContext);
  const { showToast } = useContext(ToastContext);
  const { setLoading } = useContext(LoadingContext);
  
  // Use multiple contexts together
};
```

---

## Authentication Integration

### App Bridge Authentication
```jsx
// App Bridge auth handling
const AppBridgeProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    if (app) {
      // Handle App Bridge authentication
      const unsubscribe = app.subscribe(Action.APP.AuthRedirect, (payload) => {
        // Handle auth redirect
      });
      
      return unsubscribe;
    }
  }, [app]);
  
  return (
    <AppBridgeContext.Provider value={{ app, authenticated }}>
      {children}
    </AppBridgeContext.Provider>
  );
};
```

### Token Management
```jsx
// Session token handling
const useSessionToken = () => {
  const app = useAppBridge();
  
  const getSessionToken = useCallback(async () => {
    if (app) {
      const token = await getSessionToken(app);
      return token;
    }
    return null;
  }, [app]);
  
  return { getSessionToken };
};
```

---

## Performance Considerations

### Provider Optimization
- **Memoization**: Use React.memo for provider components
- **Value Memoization**: Use useMemo for context values
- **Selective Updates**: Split large contexts into smaller ones
- **Lazy Loading**: Load heavy provider logic lazily

### Context Splitting Strategy
```jsx
// Split large contexts for performance
// Instead of one large context:
const AppContext = { user, settings, preferences, notifications };

// Use multiple focused contexts:
const UserContext = { user };
const SettingsContext = { settings };
const PreferencesContext = { preferences };
const NotificationsContext = { notifications };
```

### Memory Management
- **Cleanup**: Properly cleanup subscriptions and listeners
- **Unsubscribe**: Remove event listeners in useEffect cleanup
- **Reference Management**: Avoid holding references to large objects

---

## Error Handling

### Provider Error Boundaries
```jsx
// Error boundary for providers
class ProviderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to Sentry or other service
    console.error('Provider Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUIComponent />;
    }

    return this.props.children;
  }
}
```

### Context Error Handling
```jsx
// Error handling within contexts
const MyProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  const handleError = useCallback((error) => {
    setError(error);
    // Log to Sentry
    logger.error(error);
  }, []);
  
  const contextValue = useMemo(() => ({
    error,
    handleError,
    // ... other context values
  }), [error, handleError]);
  
  if (error) {
    return <ErrorComponent error={error} />;
  }
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};
```

---

## Testing Patterns

### Provider Testing
```jsx
// Testing components with providers
const renderWithProviders = (component) => {
  return render(
    <AppBridgeProvider>
      <PolarisProvider>
        <ContextProviderList>
          {component}
        </ContextProviderList>
      </PolarisProvider>
    </AppBridgeProvider>
  );
};

// Test usage
test('Component with providers', () => {
  renderWithProviders(<MyComponent />);
  // ... test assertions
});
```

### Mock Providers
```jsx
// Mock provider for testing
const MockProvider = ({ children, mockValues = {} }) => {
  const defaultValues = {
    user: null,
    loading: false,
    // ... default mock values
  };
  
  const contextValue = { ...defaultValues, ...mockValues };
  
  return (
    <MockContext.Provider value={contextValue}>
      {children}
    </MockContext.Provider>
  );
};
```

This provider system creates a robust foundation for the Shopify app with proper separation of concerns, authentication handling, and state management integration.