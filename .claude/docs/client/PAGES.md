# Pages Documentation

## Overview
The Pages system provides a structured approach to building consistent, accessible, and feature-rich pages throughout the Shopify app. All pages are organized in the `client/Pages/` directory and follow established patterns for routing, state management, and user experience.

## Page Architecture

### Page Structure
```
client/Pages/
├── Index/                    // Main dashboard/home page
├── Settings/                 // App settings and configuration
├── Pricing/                  // Subscription plans and billing
├── Feedback/                 // User feedback and reviews
├── FormPreview/             // Form preview functionality
├── OnBoarding/              // User onboarding flow
├── Review/                  // Review and rating system
├── Admin/                   // Administrative pages
├── PublicHome/              // Public-facing pages
├── NotFound/                // 404 error page
├── PrivacyPolicy/           // Privacy policy page
└── TermsAndConditions/      // Terms and conditions
```

---

## Page Development Patterns

### Standard Page Structure
```jsx
// StandardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Card, Page, Layout } from '@shopify/polaris';
import { useAuthenticatedFetch } from '@/Api/Axios';
import { ProfileContext } from '@/Context/ProfileContext';
import { logger } from '@/Services/Logger/Index';

const StandardPage = ({ backbutton }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { profileData } = useContext(ProfileContext);
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      const response = await fetch.get('page-endpoint');
      setData(response.data);
      logger.info('Page data loaded successfully');
    } catch (error) {
      logger.error('Failed to load page data', { error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page 
      title="Page Title"
      backAction={backbutton}
      loading={loading}
    >
      <Layout>
        <Layout.Section>
          <Card>
            {/* Page content */}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default StandardPage;
```

### Page Component Requirements
1. **Accept `backbutton` prop** - For navigation history support
2. **Use Page component** - Shopify Polaris Page wrapper
3. **Handle loading states** - Show loading indicators
4. **Error handling** - Graceful error states
5. **Responsive design** - Works on all screen sizes
6. **Accessibility** - Proper ARIA labels and keyboard navigation

---

## Core Pages

### Index Page (Dashboard)
**Location**: `client/Pages/Index/Index.jsx`

**Purpose**: Main dashboard and landing page for authenticated users

**Key Features**:
- User welcome and overview
- Quick actions and shortcuts  
- Recent activity summary
- Navigation to key features
- Onboarding prompts for new users

```jsx
// Index page pattern
const Index = ({ backbutton }) => {
  const { profileData } = useContext(ProfileContext);
  const { suggestedItems } = useContext(OnboardingContext);

  return (
    <Page title="Dashboard" backAction={backbutton}>
      <Layout>
        {!profileData.isOnBoardingDone && (
          <Layout.Section>
            <SuggestedItems items={suggestedItems} />
          </Layout.Section>
        )}
        
        <Layout.Section>
          <DashboardCards />
        </Layout.Section>
      </Layout>
    </Page>
  );
};
```

### Settings Page
**Location**: `client/Pages/Settings/Settings.jsx`

**Purpose**: App configuration and user preferences

**Key Features**:
- Tab-based organization
- Form-based settings management
- Real-time save functionality
- Settings validation
- Reset to defaults option

```jsx
// Settings page with tabs
const Settings = ({ backbutton }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  const tabs = [
    { id: 'general', content: 'General', panel: <GeneralSettings /> },
    { id: 'advanced', content: 'Advanced', panel: <AdvancedSettings /> }
  ];

  return (
    <Page title="Settings" backAction={backbutton}>
      <Card>
        <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
          {tabs[selectedTab].panel}
        </Tabs>
      </Card>
    </Page>
  );
};
```

### Pricing Page
**Location**: `client/Pages/Pricing/Pricing.jsx`

**Purpose**: Subscription plans and billing management

**Key Features**:
- Plan comparison tables
- Current plan status
- Upgrade/downgrade functionality
- Billing history
- Custom plan options

### Admin Pages
**Location**: `client/Pages/Admin/`

**Purpose**: Administrative functionality for app management

**Pages Include**:
- `User.jsx` - User management
- `GetData.jsx` - Data analytics
- `Login.jsx` - Admin authentication
- `RemoveWebhook.jsx` - Webhook management

---

## Specialized Page Types

### Modal Pages
Pages that display as modals or overlays

```jsx
// Modal page pattern
const ModalPage = ({ open, onClose, data }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modal Page Title"
      primaryAction={{
        content: 'Save',
        onAction: handleSave
      }}
      secondaryActions={[{
        content: 'Cancel',
        onAction: onClose
      }]}
    >
      <Modal.Section>
        {/* Modal content */}
      </Modal.Section>
    </Modal>
  );
};
```

### Public Pages
Pages accessible without authentication

```jsx
// Public page pattern
const PublicPage = () => {
  return (
    <PublicRoute>
      <PublicHeader />
      <div className="public-content">
        {/* Public page content */}
      </div>
      <PublicFooter />
    </PublicRoute>
  );
};
```

### Form-Heavy Pages
Pages focused on form interactions

```jsx
// Form-centric page
const FormPage = ({ backbutton }) => {
  const formFields = [
    { id: 'name', type: 'text', label: 'Name', validated: true },
    { id: 'email', type: 'email', label: 'Email', validated: true }
  ];

  const handleSubmit = async (values) => {
    // Form submission logic
  };

  return (
    <Page title="Form Page" backAction={backbutton}>
      <Card>
        <CommonForm
          formFields={formFields}
          onSubmit={handleSubmit}
          initialValues={{}}
        />
      </Card>
    </Page>
  );
};
```

---

## Page State Management

### Loading States
```jsx
const PageWithLoading = ({ backbutton }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Page title="Loading..." backAction={backbutton}>
        <Card>
          <SkeletonPage />
        </Card>
      </Page>
    );
  }

  return (
    <Page title="Loaded Page" backAction={backbutton}>
      {/* Page content */}
    </Page>
  );
};
```

### Error States
```jsx
const PageWithErrorHandling = ({ backbutton }) => {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <Page title="Error" backAction={backbutton}>
        <Card>
          <EmptyState
            heading="Something went wrong"
            action={{
              content: 'Try again',
              onAction: () => setError(null)
            }}
          >
            {error.message}
          </EmptyState>
        </Card>
      </Page>
    );
  }

  return (
    <Page title="Normal Page" backAction={backbutton}>
      {/* Page content */}
    </Page>
  );
};
```

### Data Fetching Patterns
```jsx
const DataDrivenPage = ({ backbutton }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [userData, settingsData] = await Promise.all([
          fetch.get('users'),
          fetch.get('settings')
        ]);
        
        setData({ users: userData, settings: settingsData });
      } catch (error) {
        logger.error('Failed to load page data', { error });
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  return (
    <Page title="Data Page" loading={loading} backAction={backbutton}>
      {data && (
        <Layout>
          <Layout.Section>
            <UserTable users={data.users} />
          </Layout.Section>
          <Layout.Section secondary>
            <SettingsCard settings={data.settings} />
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
};
```

---

## Page Creation Process

### Step 1: Create Page Directory and Component
```bash
# Create page directory
mkdir client/Pages/NewPage

# Create page component
touch client/Pages/NewPage/NewPage.jsx
```

### Step 2: Implement Page Component
```jsx
// client/Pages/NewPage/NewPage.jsx
import React from 'react';
import { Card, Page } from '@shopify/polaris';

const NewPage = ({ backbutton }) => {
  return (
    <Page title="New Page" backAction={backbutton}>
      <Card>
        <Card.Section>
          <p>New page content goes here</p>
        </Card.Section>
      </Card>
    </Page>
  );
};

export default NewPage;
```

### Step 3: Add Route (Reference ROUTING.md)
```jsx
// client/Routes.jsx
const NewPage = lazy(() => import("@/Pages/NewPage/NewPage"));

// Add route
<Route path="/new-page" element={<NewPage backbutton={backbutton} />} />
```

### Step 4: Add Navigation (Reference ROUTING.md)
```jsx
// client/Assets/Mocks/Navigation.mock.js
{
  label: t("mocks.navigation.New Page") || "New Page",
  destination: "/new-page"
}
```

---

## Page Performance Optimization

### Lazy Loading Implementation
```jsx
// All pages are lazy loaded for performance
const Settings = lazy(() => import("@/Pages/Settings/Settings"));
const Pricing = lazy(() => import("@/Pages/Pricing/Pricing"));

// Usage with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/settings" element={<Settings backbutton={backbutton} />} />
  </Routes>
</Suspense>
```

### Code Splitting Strategies
```jsx
// Split heavy components within pages
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const OptimizedPage = ({ backbutton }) => {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <Page title="Optimized" backAction={backbutton}>
      <Card>
        <Button onClick={() => setShowHeavy(true)}>
          Load Heavy Component
        </Button>
        
        {showHeavy && (
          <Suspense fallback={<Spinner />}>
            <HeavyComponent />
          </Suspense>
        )}
      </Card>
    </Page>
  );
};
```

### Memoization for Performance
```jsx
// Memoized page components
const ExpensivePage = React.memo(({ backbutton, data }) => {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data);
  }, [data]);

  return (
    <Page title="Expensive" backAction={backbutton}>
      <Card>
        {expensiveValue}
      </Card>
    </Page>
  );
});
```

---

## Accessibility Best Practices

### Semantic HTML Structure
```jsx
const AccessiblePage = ({ backbutton }) => {
  return (
    <Page title="Accessible Page" backAction={backbutton}>
      <main>
        <section aria-labelledby="main-heading">
          <Card>
            <h2 id="main-heading">Main Content</h2>
            <p>Content description</p>
          </Card>
        </section>
        
        <aside aria-labelledby="sidebar-heading">
          <Card>
            <h3 id="sidebar-heading">Sidebar</h3>
            <p>Additional information</p>
          </Card>
        </aside>
      </main>
    </Page>
  );
};
```

### Keyboard Navigation
```jsx
const KeyboardFriendlyPage = ({ backbutton }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Handle keyboard activation
      handleAction();
    }
  };

  return (
    <Page title="Keyboard Friendly" backAction={backbutton}>
      <Card>
        <div 
          tabIndex="0"
          onKeyDown={handleKeyDown}
          role="button"
          aria-label="Clickable area"
        >
          Interactive content
        </div>
      </Card>
    </Page>
  );
};
```

---

## Testing Patterns

### Page Component Testing
```jsx
// Page testing utilities
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';

describe('NewPage', () => {
  const defaultProps = {
    backbutton: { content: 'Back', onAction: jest.fn() }
  };

  it('renders page title', () => {
    renderWithProviders(<NewPage {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'New Page' })).toBeInTheDocument();
  });

  it('handles back button', () => {
    renderWithProviders(<NewPage {...defaultProps} />);
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    expect(defaultProps.backbutton.onAction).toHaveBeenCalled();
  });
});
```

### Integration Testing
```jsx
// Full page integration tests
describe('NewPage Integration', () => {
  it('loads data and displays content', async () => {
    const mockApiResponse = { data: 'test data' };
    jest.spyOn(apiClient, 'get').mockResolvedValue(mockApiResponse);

    renderWithProviders(<NewPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('test data')).toBeInTheDocument();
    });
  });
});
```

This page system provides a comprehensive foundation for building consistent, performant, and accessible pages throughout the Shopify application.