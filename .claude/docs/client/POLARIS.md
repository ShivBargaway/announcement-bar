# Polaris Design System Integration

## Overview
This documentation provides a comprehensive workflow for implementing Shopify Polaris components in the React frontend with automatic live documentation integration. The system automatically fetches current Polaris component documentation to ensure accurate props, styling, and usage patterns.

## Automatic Live Documentation Integration

### How It Works
When you request any Polaris component implementation, the system automatically:

1. **WebFetch Current Polaris Docs**: Retrieves live documentation from https://polaris-react.shopify.com
2. **Extract Component Structure**: Gets current props, variants, and usage examples
3. **Verify Component Compatibility**: Ensures component matches your current Polaris version
4. **Generate Accurate Implementation**: Creates components using real-time documentation
5. **Follow Established Patterns**: Implements using existing component architecture

### Supported Prompt Triggers
- "add Polaris component"
- "create Polaris form"
- "implement Polaris layout"
- "use Polaris button"
- "add Polaris card"
- "create Polaris modal"
- "implement Polaris table"
- "use Polaris navigation"
- "add Polaris banner"
- "create Polaris page"
- "implement Polaris [component]"
- "design with Polaris"
- "Polaris UI component"
- "Shopify design system"

## Polaris Development Workflow

### Step 0: Live Component Documentation Reference
**Automatic Process:**
- WebFetch https://polaris-react.shopify.com for target component
- Extract current props, variants, and examples
- Verify component availability and version compatibility
- Get latest usage patterns and accessibility guidelines from official documentation

### Step 1: Component Selection and Import

**🚨 CRITICAL: Component Usage Rules**
- **Forms**: Use existing `CommonForm` component (already built with Polaris)
- **Tables**: Use existing `CommonTable` component (already built with Polaris)
- **All Other UI**: Use Polaris components directly from `@shopify/polaris`
- **Layout**: ALWAYS wrap with Polaris `Page`, `Layout`, `Card` components

**Import Pattern:**
```javascript
// For forms and tables - use existing components
import CommonForm from "@/Components/Common/CommonForm";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";

// For all other UI - import Polaris directly
import {
  Page,
  Card,
  Button,
  Layout,
  Banner,
  Modal,
  // Import specific components as needed
} from '@shopify/polaris';
```

**Polaris Component Categories:**
- **Layout Components**: Page, Layout, Card, Stack, Inline (ALWAYS use these)
- **Form Components**: Use CommonForm (built with TextField, Select, Checkbox, etc.)
- **Table Components**: Use CommonTable (built with IndexTable, ResourceList)
- **Navigation**: TopBar, Navigation, Tabs, Breadcrumbs
- **Feedback**: Banner, Toast, Modal, Popover
- **Actions**: Button, ButtonGroup, ActionList

### Step 2: Component Structure Design
**Basic Component Pattern:**
```javascript
import React from 'react';
import { Page, Card, Button, TextField, Layout } from '@shopify/polaris';
import { t } from 'i18next';

const ComponentName = () => {
  return (
    <Page 
      title={t("common.Page Title")}
      primaryAction={{
        content: t("common.Primary Action"),
        onAction: handlePrimaryAction,
      }}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {/* Component content */}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ComponentName;
```

### Step 3: Props and Configuration
**Props Best Practices:**
```javascript
// Always use translation for user-facing text
<Button 
  primary 
  onClick={handleClick}
  loading={isLoading}
  disabled={isDisabled}
>
  {t("common.Button Text")}
</Button>

// Form components with validation
<TextField
  label={t("common.Field Label")}
  value={value}
  onChange={handleChange}
  error={error}
  helpText={t("common.Help text")}
  placeholder={t("common.Placeholder")}
  requiredIndicator={required}
/>

// Layout with proper spacing
<Layout>
  <Layout.Section oneHalf>
    <Card sectioned title={t("common.Card Title")}>
      {/* Content */}
    </Card>
  </Layout.Section>
  <Layout.Section oneHalf>
    <Card sectioned>
      {/* Content */}
    </Card>
  </Layout.Section>
</Layout>
```

### Step 4: State Management Integration
**State Integration Pattern:**
```javascript
import React, { useState, useContext } from 'react';
import { Page, Card, Button, Banner } from '@shopify/polaris';
import { ToastContext } from '@/Context/ToastContext';
import { ProfileContext } from '@/Context/ProfileContext';
import { useAuthenticatedFetch } from '@/Api/Axios';
import { t } from 'i18next';

const ComponentWithState = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { showToast } = useContext(ToastContext);
  const { profileData } = useContext(ProfileContext);
  const fetch = useAuthenticatedFetch();

  const handleAction = async () => {
    setLoading(true);
    try {
      const result = await fetch.post('endpoint', data);
      showToast(t("common.Success message"));
      setData(result.data);
    } catch (error) {
      showToast(t("common.Error message"), 'error');
    }
    setLoading(false);
  };

  return (
    <Page title={t("common.Page Title")}>
      <Layout>
        <Layout.Section>
          {profileData?.plan === 'Free' && (
            <Banner status="warning">
              {t("common.Upgrade message")}
            </Banner>
          )}
          
          <Card sectioned>
            <Button 
              primary 
              loading={loading} 
              onClick={handleAction}
            >
              {t("common.Action Button")}
            </Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
```

### Step 5: Form Component Patterns
**Complete Form Implementation:**
```javascript
import React, { useState } from 'react';
import { 
  Page, 
  Card, 
  FormLayout, 
  TextField, 
  Select, 
  Checkbox, 
  Button,
  Banner 
} from '@shopify/polaris';
import { t } from 'i18next';

const PolarisForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    notifications: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = t("common.Name required");
    if (!formData.email) newErrors.email = t("common.Email required");
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Submit form logic
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Form error:', error);
    }
    setLoading(false);
  };

  const categoryOptions = [
    { label: t("common.Select category"), value: '' },
    { label: t("common.Category 1"), value: 'cat1' },
    { label: t("common.Category 2"), value: 'cat2' },
  ];

  return (
    <Page title={t("common.Form Title")}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <FormLayout>
              <TextField
                label={t("common.Name")}
                value={formData.name}
                onChange={handleChange('name')}
                error={errors.name}
                requiredIndicator
              />
              
              <TextField
                label={t("common.Email")}
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={errors.email}
                requiredIndicator
              />
              
              <Select
                label={t("common.Category")}
                options={categoryOptions}
                value={formData.category}
                onChange={handleChange('category')}
              />
              
              <Checkbox
                label={t("common.Enable notifications")}
                checked={formData.notifications}
                onChange={handleChange('notifications')}
              />
              
              <Button 
                primary 
                loading={loading} 
                onClick={handleSubmit}
              >
                {t("common.Submit")}
              </Button>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
```

### Step 6: Data Display Components
**Table and List Patterns:**
```javascript
import React, { useState } from 'react';
import { 
  Page, 
  Card, 
  IndexTable, 
  Badge, 
  Button,
  useIndexResourceState 
} from '@shopify/polaris';
import { t } from 'i18next';

const DataTable = ({ data = [] }) => {
  const resourceName = {
    singular: t("common.item"),
    plural: t("common.items"),
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data);

  const headings = [
    { title: t("common.Name") },
    { title: t("common.Status") },
    { title: t("common.Date") },
    { title: t("common.Actions") },
  ];

  const rowMarkup = data.map(
    ({ id, name, status, date }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge status={status === 'active' ? 'success' : 'warning'}>
            {t(`common.${status}`)}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{new Date(date).toLocaleDateString()}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button size="slim" onClick={() => handleEdit(id)}>
            {t("common.Edit")}
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page title={t("common.Data Table")}>
      <Layout>
        <Layout.Section>
          <Card>
            <IndexTable
              resourceName={resourceName}
              itemCount={data.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={headings}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
```

### Step 7: Modal and Overlay Patterns
**Modal Implementation:**
```javascript
import React, { useState } from 'react';
import { 
  Page, 
  Card, 
  Button, 
  Modal, 
  FormLayout, 
  TextField 
} from '@shopify/polaris';
import { t } from 'i18next';

const ModalExample = () => {
  const [modalActive, setModalActive] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleModalToggle = () => setModalActive(!modalActive);

  const handleSave = () => {
    // Save logic here
    console.log('Saving:', formData);
    setModalActive(false);
  };

  return (
    <Page title={t("common.Modal Example")}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Button onClick={handleModalToggle}>
              {t("common.Open Modal")}
            </Button>
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={modalActive}
        onClose={handleModalToggle}
        title={t("common.Modal Title")}
        primaryAction={{
          content: t("common.Save"),
          onAction: handleSave,
        }}
        secondaryActions={[{
          content: t("common.Cancel"),
          onAction: handleModalToggle,
        }]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label={t("common.Name")}
              value={formData.name}
              onChange={(value) => setFormData({...formData, name: value})}
            />
            <TextField
              label={t("common.Description")}
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
              multiline={4}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
};
```

## Component Categories and Usage

### Layout Components
**Primary Layout Structure:**
- `Page` - Main page wrapper with title and actions
- `Layout` - Grid system for content organization
- `Card` - Content containers with optional sections
- `Stack` - Vertical spacing and alignment
- `Inline` - Horizontal spacing and alignment

### Form Components
**Input Elements:**
- `TextField` - Text input with validation
- `Select` - Dropdown selection
- `Checkbox` - Boolean input
- `RadioButton` - Single selection from group
- `RangeSlider` - Numeric range input
- `DatePicker` - Date selection

### Navigation Components
**Navigation Elements:**
- `Navigation` - App-wide navigation
- `Tabs` - Section switching
- `Breadcrumbs` - Hierarchy navigation
- `Pagination` - Data navigation

### Feedback Components
**User Feedback:**
- `Banner` - Important messages
- `Toast` - Temporary notifications
- `Modal` - Focused interactions
- `Popover` - Contextual information
- `ProgressBar` - Task progress

### Data Display Components
**Content Presentation:**
- `IndexTable` - Selectable data rows
- `DataTable` - Simple data display
- `ResourceList` - Rich list items
- `DescriptionList` - Key-value pairs

## Integration Best Practices

### Translation Integration
**Always use translation for user-facing text:**
```javascript
// Correct
<Button>{t("common.Save Changes")}</Button>
<TextField label={t("common.Email Address")} />
<Page title={t("common.Settings")} />

// Incorrect
<Button>Save Changes</Button>
<TextField label="Email Address" />
<Page title="Settings" />
```

### State Management Integration
**Connect with existing contexts:**
```javascript
import { ToastContext } from '@/Context/ToastContext';
import { ProfileContext } from '@/Context/ProfileContext';
import { LoadingContext } from '@/Context/LoadingContext';

const Component = () => {
  const { showToast } = useContext(ToastContext);
  const { profileData } = useContext(ProfileContext);
  const { setLoading } = useContext(LoadingContext);
  
  // Use contexts appropriately
};
```

### API Integration
**Use authenticated fetch with Polaris loading states:**
```javascript
import { useAuthenticatedFetch } from '@/Api/Axios';

const Component = () => {
  const [loading, setLoading] = useState(false);
  const fetch = useAuthenticatedFetch();

  const handleAction = async () => {
    setLoading(true);
    try {
      const result = await fetch.post('endpoint', data);
      // Handle success
    } catch (error) {
      // Handle error
    }
    setLoading(false);
  };

  return (
    <Button primary loading={loading} onClick={handleAction}>
      {t("common.Action")}
    </Button>
  );
};
```

### Responsive Design
**Use Polaris responsive utilities:**
```javascript
<Layout>
  <Layout.Section oneHalf>
    <Card sectioned>
      {/* Desktop: 50%, Mobile: 100% */}
    </Card>
  </Layout.Section>
  <Layout.Section oneThird>
    <Card sectioned>
      {/* Desktop: 33%, Mobile: 100% */}
    </Card>
  </Layout.Section>
</Layout>
```

### Accessibility
**Follow Polaris accessibility patterns:**
```javascript
<Button
  accessibilityLabel={t("common.Close modal")}
  icon={CloseMinor}
  plain
  onClick={handleClose}
/>

<TextField
  label={t("common.Search")}
  labelHidden
  placeholder={t("common.Search placeholder")}
/>
```

## Error Handling Patterns

### Form Validation
```javascript
const [errors, setErrors] = useState({});

const validateField = (field, value) => {
  if (!value) {
    return t("common.Field required");
  }
  // Additional validation
  return null;
};

<TextField
  label={t("common.Email")}
  value={email}
  onChange={handleEmailChange}
  error={errors.email}
  onBlur={() => {
    const error = validateField('email', email);
    setErrors(prev => ({...prev, email: error}));
  }}
/>
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);

return (
  <Page 
    title={t("common.Page Title")}
    primaryAction={{
      content: t("common.Save"),
      loading: loading,
      onAction: handleSave
    }}
  >
    {loading ? (
      <Card sectioned>
        <SkeletonPage />
      </Card>
    ) : (
      <Card sectioned>
        {/* Content */}
      </Card>
    )}
  </Page>
);
```

### Empty States
```javascript
import { EmptyState } from '@shopify/polaris';

const EmptyStateExample = () => (
  <EmptyState
    heading={t("common.No items found")}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    action={{
      content: t("common.Add item"),
      onAction: handleAddItem,
    }}
  >
    <p>{t("common.Empty state description")}</p>
  </EmptyState>
);
```

## Performance Optimization

### Component Lazy Loading
```javascript
import { lazy, Suspense } from 'react';
import { SkeletonPage } from '@shopify/polaris';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<SkeletonPage />}>
    <HeavyComponent />
  </Suspense>
);
```

### Memoization
```javascript
import { memo, useCallback, useMemo } from 'react';

const OptimizedComponent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString()
    }));
  }, [data]);

  const handleAction = useCallback((id) => {
    onAction(id);
  }, [onAction]);

  return (
    <IndexTable>
      {processedData.map(item => (
        <IndexTable.Row key={item.id}>
          {/* Row content */}
        </IndexTable.Row>
      ))}
    </IndexTable>
  );
});
```

This comprehensive Polaris documentation system ensures all UI components follow Shopify's design system with proper integration patterns, accessibility, and performance optimization.