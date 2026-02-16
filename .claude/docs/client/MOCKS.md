# Mocks Documentation

## Overview
The mock system provides centralized data management for testing, development, and default configurations. All mock files are organized in the `client/Assets/Mocks/` directory and follow consistent patterns for data structure and usage.

## Mock Architecture

### Mock File Structure
```
client/Assets/Mocks/
├── Navigation.mock.js        // Navigation menu configuration
├── User.mock.js             // User data and profile mocks
├── ActivePlan.mock.js       // Subscription and plan data
├── Settings.mock.js         // App settings and preferences
├── Login.mock.js           // Authentication flows
├── Home.mock.js            // Dashboard and home data
├── SuggestedItems.mock.jsx // Onboarding suggestions
├── CommonPricing.mock.jsx  // Pricing plans and features
├── Language.mock.js        // Internationalization data
├── GetData.mock.js         // API response mocks
├── App.mock.jsx           // App-wide configuration
├── Review.mock.jsx        // Review and feedback data
├── Support.mock.js        // Support and help data
└── CustomSEO.mock.jsx     // SEO feature configurations
```

---

## Navigation Mocks

### Location
`client/Assets/Mocks/Navigation.mock.js`

### Purpose
Centralized navigation menu configuration with internationalization support.

### Structure
```jsx
// Navigation menu structure
export const getNavigationLinks = () => [
  {
    label: t("mocks.navigation.Dashboard") || "Dashboard",
    destination: "/",
    key: "dashboard",
    icon: "home",
    subNavigationItems: [
      {
        label: t("mocks.navigation.Overview") || "Overview",
        destination: "/overview"
      }
    ]
  },
  {
    label: t("mocks.navigation.Settings") || "Settings",
    destination: "/settings",
    key: "settings",
    icon: "settings"
  }
];
```

### Usage Pattern
```jsx
// Using navigation mocks
import { getNavigationLinks } from "@/Assets/Mocks/Navigation.mock";

const NavigationComponent = () => {
  const navigationLinks = getNavigationLinks();
  
  return (
    <Navigation>
      {navigationLinks.map(link => (
        <Navigation.Item
          key={link.key}
          url={link.destination}
          label={link.label}
        />
      ))}
    </Navigation>
  );
};
```

### Adding New Navigation Items
```jsx
// Step 1: Add to Navigation.mock.js
{
  label: t("mocks.navigation.New Feature") || "New Feature",
  destination: "/new-feature",
  key: "new_feature",
  icon: "star"
}

// Step 2: Add translation key to language files
// LanguageJS/en.js
"mocks": {
  "navigation": {
    "New Feature": "New Feature"
  }
}
```

---

## User Data Mocks

### Location
`client/Assets/Mocks/User.mock.js`

### Purpose
User profile, authentication state, and permission data for development and testing.

### Structure
```jsx
// User mock data structure
export const mockUser = {
  id: "user_123",
  email: "test@example.com",
  shop: "test-shop.myshopify.com",
  planType: "premium",
  isOnBoardingDone: true,
  permissions: ["read", "write", "admin"],
  preferences: {
    language: "en",
    theme: "light",
    notifications: true
  },
  subscription: {
    status: "active",
    renewalDate: "2024-12-31",
    features: ["seo_audit", "meta_tags", "schema_markup"]
  }
};

// Authentication states
export const authStates = {
  loading: { user: null, loading: true, error: null },
  authenticated: { user: mockUser, loading: false, error: null },
  unauthenticated: { user: null, loading: false, error: null },
  error: { user: null, loading: false, error: "Authentication failed" }
};
```

### Usage in Testing
```jsx
// Using user mocks in tests
import { mockUser, authStates } from "@/Assets/Mocks/User.mock";

describe("UserComponent", () => {
  it("renders authenticated user", () => {
    render(
      <MockProvider authState={authStates.authenticated}>
        <UserComponent />
      </MockProvider>
    );
  });
});
```

---

## Pricing Mocks

### Location
`client/Assets/Mocks/CommonPricing.mock.jsx`

### Purpose
Pricing plans, features, and subscription data for consistent pricing displays.

### Structure
```jsx
// Pricing plan structure
export const pricingPlans = [
  {
    id: "free",
    name: "Free Plan",
    price: 0,
    interval: "month",
    features: [
      { name: "Basic SEO Audit", included: true },
      { name: "Meta Tags", included: true },
      { name: "Advanced Features", included: false }
    ],
    limitations: {
      products: 100,
      auditsPerMonth: 5
    }
  },
  {
    id: "premium",
    name: "Premium Plan", 
    price: 29.99,
    interval: "month",
    features: [
      { name: "Basic SEO Audit", included: true },
      { name: "Meta Tags", included: true },
      { name: "Advanced Features", included: true }
    ],
    limitations: {
      products: -1, // unlimited
      auditsPerMonth: -1
    }
  }
];

// Feature comparison data
export const featureComparison = {
  "SEO Audit": {
    free: "Basic",
    premium: "Advanced",
    enterprise: "Full Suite"
  },
  "Support": {
    free: "Community",
    premium: "Email",
    enterprise: "Priority"
  }
};
```

---

## Settings Mocks

### Location
`client/Assets/Mocks/Settings.mock.js`

### Purpose
Application settings, preferences, and configuration options.

### Structure
```jsx
// Settings structure
export const defaultSettings = {
  general: {
    appLanguage: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY"
  },
  seo: {
    enableAutoMetaTags: true,
    enableSchemaMarkup: true,
    enableSitemap: false
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true
  },
  advanced: {
    debugMode: false,
    apiVersion: "2023-10",
    cacheEnabled: true
  }
};

// Settings categories for UI
export const settingsCategories = [
  {
    id: "general",
    name: "General Settings",
    icon: "settings",
    description: "Basic app configuration"
  },
  {
    id: "seo",
    name: "SEO Settings",
    icon: "search",
    description: "Search optimization settings"
  }
];
```

---

## API Response Mocks

### Location
`client/Assets/Mocks/GetData.mock.js`

### Purpose
Mock API responses for development and testing without backend dependencies.

### Structure
```jsx
// API response mocks
export const apiMocks = {
  // GET /api/users
  users: {
    success: {
      data: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
      ],
      meta: { total: 2, page: 1, perPage: 10 }
    },
    error: {
      error: "Internal server error",
      code: 500
    }
  },
  
  // GET /api/settings
  settings: {
    success: {
      data: defaultSettings
    }
  },
  
  // POST /api/audit
  audit: {
    success: {
      data: {
        id: "audit_123",
        status: "completed",
        score: 85,
        issues: [
          { type: "warning", message: "Missing meta description" },
          { type: "error", message: "Broken internal link" }
        ]
      }
    }
  }
};

// Mock API client
export const createMockApiClient = (delayMs = 500) => {
  return {
    get: async (endpoint) => {
      await delay(delayMs);
      const mockData = apiMocks[endpoint.replace('/api/', '')];
      return mockData?.success || { error: "Not found" };
    },
    
    post: async (endpoint, data) => {
      await delay(delayMs);
      const mockData = apiMocks[endpoint.replace('/api/', '')];
      return mockData?.success || { error: "Not found" };
    }
  };
};
```

---

## Language/Localization Mocks

### Location
`client/Assets/Mocks/Language.mock.js`

### Purpose
Internationalization support with language options and translations.

### Structure
```jsx
// Available languages
export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" }
];

// Translation mock structure
export const translationMocks = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit"
    },
    navigation: {
      dashboard: "Dashboard",
      settings: "Settings",
      pricing: "Pricing"
    }
  },
  es: {
    common: {
      save: "Guardar",
      cancel: "Cancelar", 
      delete: "Eliminar",
      edit: "Editar"
    }
  }
};
```

---

## Development Patterns

### Creating New Mocks

#### Step 1: Create Mock File
```jsx
// NewFeature.mock.js
export const mockNewFeatureData = {
  id: "feature_123",
  name: "New Feature",
  enabled: true,
  settings: {
    option1: true,
    option2: "default_value"
  }
};

export const newFeatureStates = {
  loading: { data: null, loading: true, error: null },
  success: { data: mockNewFeatureData, loading: false, error: null },
  error: { data: null, loading: false, error: "Failed to load" }
};
```

#### Step 2: Use in Components
```jsx
// Using mocks in development
import { mockNewFeatureData } from "@/Assets/Mocks/NewFeature.mock";

const NewFeatureComponent = () => {
  // Use mock data during development
  const [data, setData] = useState(
    process.env.NODE_ENV === 'development' 
      ? mockNewFeatureData 
      : null
  );
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      // Load real data in production
      loadRealData();
    }
  }, []);
  
  return <div>{/* Component content */}</div>;
};
```

#### Step 3: Testing Integration
```jsx
// Using mocks in tests
import { newFeatureStates } from "@/Assets/Mocks/NewFeature.mock";

describe("NewFeatureComponent", () => {
  it("handles loading state", () => {
    render(<NewFeatureComponent initialState={newFeatureStates.loading} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  
  it("displays data when loaded", () => {
    render(<NewFeatureComponent initialState={newFeatureStates.success} />);
    expect(screen.getByText("New Feature")).toBeInTheDocument();
  });
});
```

---

## Best Practices

### Mock Data Design
1. **Realistic Data**: Use realistic data that matches production scenarios
2. **Complete Objects**: Include all properties that components expect
3. **Edge Cases**: Create mocks for edge cases and error states
4. **Consistent IDs**: Use consistent ID patterns across mocks
5. **Relationship Data**: Maintain relationships between related mock objects

### Mock File Organization
1. **Single Responsibility**: One mock file per feature or data domain
2. **Export Patterns**: Use consistent export patterns
3. **Documentation**: Comment complex mock structures
4. **Versioning**: Version mock data for API changes
5. **Environment Specific**: Create environment-specific variants when needed

### Development Workflow
1. **Mock First**: Create mocks before implementing real API calls
2. **Progressive Enhancement**: Start with mocks, then integrate real data
3. **Feature Flags**: Use feature flags to toggle between mocks and real data
4. **Test Coverage**: Ensure all mock states are tested
5. **Mock Validation**: Validate mock data against real API schemas

This mock system provides a robust foundation for consistent data handling, testing, and development workflow across the application.