# Complete Components Reference Guide

## Overview
This comprehensive documentation covers all 82 components in the `client/Components/` directory with complete props, requirements, and real usage examples. Use this as your primary reference for creating forms, tables, and UI components.

## Quick Component Index

### Core Components
- **[CommonForm](#commonform)** - Universal dynamic form system
- **[CommonTable](#commontable)** - Advanced data table with filtering
- **[NavigationMenu](#navigationmenu)** - App navigation system

### Form Components
- **[Input Fields](#input-components)** - Text, number, email, password, etc.
- **[Advanced Fields](#advanced-input-components)** - MultiSelect, ImagePicker, ColorPicker, etc.
- **[Editors](#editor-components)** - TinyMCE, CodeMirror, MetaTinyEditor

### UI Components
- **[Banners](#banner-components)** - DismissibleBanner, StatusBanner
- **[Progress](#progress-components)** - ProgressCircle, Loading states
- **[Display](#display-components)** - TruncatedText, CommonIcon

---

## Form System

### CommonForm
**Location**: `@/Components/Common/CommonForm`
**Purpose**: Universal form component with dynamic field generation, validation, and advanced features

#### Complete Props Interface
```jsx
<CommonForm
  formFields={Array}              // REQUIRED: Array of field configurations
  initialValues={Object}         // REQUIRED: Initial form values
  onSubmit={Function}            // REQUIRED: Submit handler
  
  // Optional Props
  onFormChange={Function}        // Called on every value change
  formRef={useRef()}            // Ref for external form control
  isSave={Boolean}              // Show/hide save button (default: true)
  isPremium={Boolean}           // Premium feature flag
  noValueChanged={Boolean}      // Validate if values changed (default: true)
  noCompare={Boolean}           // Skip initial comparison (default: true)
  label={String}                // Custom save button label
  enableReinitialize={Boolean}  // Reinitialize on prop change
  premiumFeatureName={String}   // Premium feature identifier
  buttonVariant={String}        // Save button variant (default: "primary")
/>
```

#### Field Configuration Schema
```jsx
// Complete field configuration options
const fieldConfig = {
  // Basic Properties
  id: "uniqueId",                    // REQUIRED: Unique identifier
  name: "fieldName",                 // REQUIRED: Form field name
  label: "Field Label",              // Field label
  type: "text",                      // Field type (see Field Types below)
  
  // Validation
  validated: true,                   // Enable validation
  errormsg: "Error message",         // Custom error message
  
  // Layout & Display
  helpText: "Help text",             // Help text below field
  disabled: false,                   // Disable field
  hide: false,                       // Hide field
  showPremium: false,                // Show premium badge
  
  // Field-Specific Options
  options: [],                       // For select, multiSelect, customSelector
  placeholder: "Placeholder text",   // Input placeholder
  min: 1,                           // Minimum value/length
  max: 10,                          // Maximum value/length
  
  // Nested Structures
  nested: "group|array|object",      // Nested field type
  groupSize: 2,                      // Fields per row in groups
  section: true,                     // Wrap in Card component
  subfields: [],                     // Child fields for nested types
  
  // Array-specific
  allowDrag: true,                   // Enable drag-and-drop reordering
  showCollapsible: true,             // Collapsible array items
  hideAddbtn: false,                 // Hide add button
  hideDeletebtn: false,              // Hide delete buttons
  minimum: 1,                        // Minimum array length
  
  // Dependencies
  dependOn: {
    type: "hidden|disabled",         // Dependency type
    name: "dependentField",          // Field name to depend on
    value: "expectedValue"           // Expected value
  },
  
  // Premium Features
  premiumType: "featureName",        // Premium feature gate
  planName: "Premium",               // Plan name for premium badge
  
  // Dynamic Properties
  prefixDynamic: false,              // Dynamic prefix calculation
  helpTextDynamic: false,            // Dynamic help text
  connectedRightDynamic: false,      // Dynamic right connected element
}
```

#### Complete Field Types Reference

##### Basic Input Types
```jsx
// Text Input
{ type: "text", id: "name", name: "name", label: "Name" }

// Number Input
{ type: "number", id: "age", name: "age", label: "Age", min: 0, max: 120 }

// Email Input
{ type: "email", id: "email", name: "email", label: "Email" }

// Password Input
{ type: "password", id: "pass", name: "password", label: "Password" }

// URL Input
{ type: "url", id: "website", name: "website", label: "Website" }

// Date Input
{ type: "date", id: "birthday", name: "birthday", label: "Birthday" }

// Time Input
{ type: "time", id: "meetingTime", name: "meetingTime", label: "Meeting Time" }

// Textarea
{ type: "textarea", id: "description", name: "description", label: "Description" }
```

##### Advanced Input Types
```jsx
// Multi-Select with Tags
{
  type: "multiSelect",
  id: "categories",
  name: "categories", 
  label: "Categories",
  options: [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" }
  ]
}

// Image Picker with Upload
{
  type: "imagePicker",
  id: "images",
  name: "images",
  label: "Images",
  allowMultiple: true,
  min: 1,
  max: 5,
  fileType: "image",
  accept: "image/*"
}

// Color Picker
{
  type: "colorPicker",
  id: "brandColor",
  name: "brandColor",
  label: "Brand Color"
}

// Custom Dropdown Selector
{
  type: "customSelector",
  id: "businessType",
  name: "businessType",
  label: "Business Type",
  options: [
    { label: "Retail", value: "retail" },
    { label: "Service", value: "service" }
  ]
}

// Font Picker (Google Fonts)
{
  type: "fontpicker",
  id: "fontFamily",
  name: "fontFamily", 
  label: "Font Family"
}

// Code Editor
{
  type: "codeMirror",
  id: "customCSS",
  name: "customCSS",
  label: "Custom CSS",
  language: "css"
}

// Toggle Switch
{
  type: "switch",
  id: "isEnabled",
  name: "isEnabled",
  label: "Enable Feature"
}

// Checkbox
{
  type: "checkbox",
  id: "agree",
  name: "agree",
  label: "I agree to terms"
}

// Radio Button
{
  type: "radio",
  id: "plan",
  name: "plan",
  label: "Basic Plan",
  radioId: "basic"
}

// Range Slider
{
  type: "rangeSlider",
  id: "volume",
  name: "volume",
  label: "Volume",
  min: 0,
  max: 100,
  step: 1
}

// Choice List (Multiple checkboxes)
{
  type: "choiceList",
  id: "features",
  name: "features",
  label: "Features",
  options: [
    { label: "Feature 1", value: "feat1" },
    { label: "Feature 2", value: "feat2" }
  ]
}
```

##### Editor Types
```jsx
// TinyMCE Rich Text Editor
{
  type: "tiny-editor",
  id: "content",
  name: "content",
  label: "Content"
}

// Meta Description Editor (SEO focused)
{
  type: "meta-tiny-editor", 
  id: "metaDescription",
  name: "metaDescription",
  label: "Meta Description"
}

// Help Text Selector (with predefined options)
{
  type: "helpTextSelector",
  id: "helpContent",
  name: "helpContent",
  label: "Help Content"
}
```

##### Complex Nested Structures
```jsx
// Grouped Fields (2 fields per row)
{
  nested: "group",
  groupSize: 2,
  section: true,
  subfields: [
    { id: "firstName", name: "firstName", type: "text", label: "First Name" },
    { id: "lastName", name: "lastName", type: "text", label: "Last Name" }
  ]
}

// Object Field (nested object)
{
  nested: "object",
  id: "address",
  name: "address",
  label: "Address",
  subfields: [
    { id: "street", name: "street", type: "text", label: "Street" },
    { id: "city", name: "city", type: "text", label: "City" }
  ]
}

// Array Field with Drag Support
{
  nested: "array",
  id: "workingDays",
  name: "workingDays", 
  label: "Working Days",
  minimum: 1,
  allowDrag: true,
  showCollapsible: true,
  subfields: [
    {
      nested: "group",
      groupSize: 2,
      subfields: [
        { id: "opens", name: "opens", type: "time", label: "Opens" },
        { id: "closes", name: "closes", type: "time", label: "Closes" }
      ]
    }
  ]
}
```

#### Conditional Field Logic
```jsx
// Hide field based on another field's value
{
  id: "conditionalField",
  name: "conditionalField",
  type: "text",
  label: "Conditional Field",
  dependOn: {
    type: "hidden",
    name: "parentField",
    value: "showThis"
  }
}

// Disable field based on condition
{
  id: "disableField",
  name: "disableField", 
  type: "text",
  label: "Disable Field",
  dependOn: {
    type: "disabled",
    name: "parentField",
    value: "disableThis"
  }
}
```

---

## Table System

### CommonTable
**Location**: `@/Components/Common/CommonTable/CommonTable`
**Purpose**: Advanced data table with filtering, pagination, search, and bulk actions

#### Complete Props Interface
```jsx
<CommonTable
  // Core Required Props
  url={String}                          // REQUIRED: API endpoint
  rowsData={Function}                   // REQUIRED: Row rendering function
  headings={Array}                      // REQUIRED: Table column headings
  
  // Display Configuration
  title={String}                        // Table title
  resourceName={{                       // Resource naming
    singular: "User", 
    plural: "Users"
  }}
  
  // Search & Filtering
  isFilterVisible={Boolean}             // Show advanced filters
  filterFormFields={Array}              // Filter field configurations  
  pinnedFilter={Array}                  // Always visible filters
  searchKey={Array}                     // Fields to search in
  queryPlaceholder={String}             // Search input placeholder
  queryParam={Object}                   // Additional query parameters
  
  // Table Features
  selectable={Boolean}                  // Row selection (default: true)
  isAdd={Boolean}                       // Show add button (default: true)
  addButtonText={String}                // Custom add button text
  handleAddClick={Function}             // Add button handler
  
  // Pagination
  isPaginationVisible={Boolean}         // Show pagination (default: true)
  isPaginationWithCount={Boolean}       // Show count in pagination
  
  // Bulk Actions
  promotedBulkActions={Array}           // Primary bulk actions
  bulkActions={Array}                   // Secondary bulk actions
  
  // Advanced Features
  showTab={Boolean}                     // Enable tabs
  tabOption={Array}                     // Tab configurations
  showLoading={Boolean}                 // Show loading states
  verticalAlign={String}                // Row vertical alignment
  columnContentTypes={Array}            // Column data types
  
  // External Control
  ref={useRef()}                        // External table control
  handleSubmit={Function}               // Row data handler
  setParentFilters={Function}           // Filter state handler
  
  // Customization
  customizeEmptyHeading={String}        // Custom empty state text
  customizeComponent={Component}        // Custom empty state component
  hideCard={Boolean}                    // Remove card wrapper
  localStorageKey={String}              // State persistence key
/>
```

#### Table Row Data Function
```jsx
// Required rowsData function that renders table rows
const renderRows = (rows, selectedRows, pagination, extraParams) => {
  return rows.map((row, index) => (
    <IndexTable.Row id={row._id} key={row._id} position={index}>
      <IndexTable.Cell>
        <Text>{row.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={row.active ? "success" : "critical"}>
          {row.active ? "Active" : "Inactive"}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button onClick={() => handleEdit(row)}>Edit</Button>
          <Button tone="critical" onClick={() => handleDelete(row)}>Delete</Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
};
```

#### Table Configuration Examples
```jsx
// Basic Table Setup
<CommonTable
  url="admin/users"
  title="Users"
  resourceName={{ singular: "User", plural: "Users" }}
  headings={[
    { title: "Name" },
    { title: "Email" },
    { title: "Status" },
    { title: "Actions" }
  ]}
  rowsData={renderUserRows}
  searchKey={["name", "email"]}
  queryPlaceholder="Search users by name or email"
/>

// Advanced Table with Filtering
<CommonTable
  url="admin/products"
  title="Products"
  resourceName={{ singular: "Product", plural: "Products" }}
  headings={[
    { title: "Product" },
    { title: "Category" },
    { title: "Price" },
    { title: "Stock" },
    { title: "Actions" }
  ]}
  rowsData={renderProductRows}
  
  // Advanced Filtering
  isFilterVisible={true}
  filterFormFields={[
    {
      id: "category",
      name: "category",
      type: "select",
      label: "Category",
      options: categoryOptions
    },
    {
      id: "priceRange",
      name: "priceRange",
      type: "rangeSlider",
      label: "Price Range",
      min: 0,
      max: 1000
    }
  ]}
  pinnedFilter={["category", "status", "priceRange"]}
  
  // Bulk Actions
  promotedBulkActions={[
    {
      content: "Activate Products",
      onAction: (rows, selectedRows, allRowsSelected) => {
        handleBulkActivate(selectedRows);
      }
    }
  ]}
  
  // Tabs
  showTab={true}
  tabOption={[
    { content: "All Products", searchQuery: {} },
    { content: "Active", searchQuery: { status: "active" } },
    { content: "Inactive", searchQuery: { status: "inactive" } }
  ]}
  
  ref={tableRef}
/>

// Table with External Control
const tableRef = useRef();

// Refresh table data externally
const refreshTable = () => {
  tableRef.current.fetchData();
};

// Update with new filters
const updateFilters = (newFilters) => {
  tableRef.current.fetchData(
    { page: 1, pageSize: 10 },  // Reset pagination
    newFilters                   // New filter state
  );
};
```

---

## UI Enhancement Components

### ProgressCircle  
**Location**: `@/Components/Common/ProgressCircle`
```jsx
<ProgressCircle
  score={85}                    // REQUIRED: 0-100 score value
  width="50px"                  // Circle diameter
  border="4px"                  // Border thickness
  fontSize="12px"               // Text font size
  showLightColor={true}         // Use light color variant
  restartAnimation={false}      // Disable animation restart
/>
```

### TruncatedText
**Location**: `@/Components/Common/TruncatedText`
```jsx
<TruncatedText 
  text="Long text that needs truncation..." 
  maxLength={50}                // Character limit
  showReadMore={true}           // Show expand option
/>
```

### CommonIcon
**Location**: `@/Components/Common/CommonIcon`  
```jsx
<CommonIcon 
  data={{
    color: "success",           // Badge color tone
    icon: "CheckIcon"           // Icon name
  }} 
  size="24"                     // Icon size in pixels
/>
```

### DismissibleBanner
**Location**: `@/Components/Common/DismissibleBanner`
```jsx
<DismissibleBanner
  bannerName="uniqueBannerName"     // REQUIRED: Unique identifier
  bannerText={<Text>Banner content</Text>}  // Banner content
  title="Banner Title"              // Banner title
  status="critical"                 // Banner tone
  skipRemove={false}                // Prevent dismissal
  tone="warning"                    // Visual tone
  action={{                         // Action button
    content: "Action",
    onAction: handleAction
  }}
/>
```

---

## Suggested Items System

### SuggestedItems
**Location**: `@/Components/Common/SuggestedItems/SuggestedItems`
```jsx
<SuggestedItems index={0} />      // Optional index for multiple instances

// Requires OnboardingContext with suggestedItems:
const suggestedItems = [
  {
    title: "Set up SEO",
    description: "Configure meta tags and schema",
    icon: "SearchIcon", 
    status: false,              // false = shown, true = hidden
    navigate: "/seo/setup",     // Navigation path
    showBadge: true,            // Show on/off badge
    badgeStatus: false          // Badge state
  }
];
```

### SuggestedItem  
**Location**: `@/Components/Common/SuggestedItems/SuggestedItem`
```jsx
// Used internally by SuggestedItems
// Automatically cycles through badge colors: ["caution", "info", "success", "critical", "warning"]
```

---

## Service Components

### CustomizeServiceButton
**Location**: `@/Components/Common/CustomizeServiceButton/CustomizeServiceButton`
```jsx
<CustomizeServiceButton />
// No props required - handles navigation and Slack tracking automatically
// Features:
// - Store customization (10H free trial)
// - SEO services
// - Automatic Slack notifications
// - i18next localization
```

### PremiumBadge / PremiumButton
**Location**: `@/Components/Common/PremiumBadge`
```jsx
// Premium Badge
<PremiumBadge show={!isPremium} />

// Premium Button Wrapper
<PremiumButton 
  title="Unlock with Premium Plan"
  subTitle="Advanced features available"
  type="featureName"              // Feature gate identifier
>
  <Button variant="primary">
    Premium Feature
  </Button>
</PremiumButton>
```

---

## Advanced Input Components

### MultiSelect
**Location**: `@/Components/Common/MultiSelect`
```jsx
// Used within CommonForm
{
  type: "multiSelect",
  id: "categories", 
  name: "categories",
  label: "Categories",
  options: [
    { label: "Category 1", value: "cat1" },
    { label: "Category 2", value: "cat2" }
  ],
  hasRemoveIndex: false           // Track removal index
}

// Direct usage (rare)
<MultiSelect
  field={{ name: "categories", options: categoryOptions }}
  form={{ values, setFieldValue }}
  onChange={(data, form) => handleChange(data)}
/>
```

### ImagePicker
**Location**: `@/Components/Common/ImagePicker`
```jsx
// Used within CommonForm
{
  type: "imagePicker",
  id: "images",
  name: "images", 
  label: "Product Images",
  allowMultiple: true,            // Multiple image upload
  min: 1,                         // Minimum images required
  max: 5,                         // Maximum images allowed
  fileType: "image",              // File type restriction
  accept: "image/*",              // File accept attribute
  actionTitle: "Add Image"        // Upload button text
}

// API Requirements:
// POST /apps/api/upload-to-shopify (multipart/form-data)
// Response: { data: [{ url: "image_url", name: "filename" }] }
```

### CustomSelector
**Location**: `@/Components/Common/CustomSelector`  
```jsx
// Used within CommonForm
{
  type: "customSelector",
  id: "businessType",
  name: "businessType",
  label: "Business Type", 
  options: [
    { label: "Retail Store", value: "retail", disabled: false },
    { label: "Online Service", value: "service" },
    { label: "Restaurant", value: "restaurant" }
  ]
}

// Features:
// - Searchable dropdown
// - Custom styling
// - Disabled options support
// - Check mark for selected option
```

---

## Editor Components

### TinyMCE System
**Location**: `@/Components/Common/TinymceEditor/`

#### TinyEditorComponent
```jsx
{
  type: "tiny-editor",
  id: "content",
  name: "content",
  label: "Content",
  height: 400                     // Editor height
}
```

#### MetaTinyEditor (SEO Focused)
```jsx
{
  type: "meta-tiny-editor", 
  id: "metaDescription",
  name: "metaDescription",
  label: "Meta Description"
}
```

### CodeMirror
```jsx
{
  type: "codeMirror",
  id: "customCSS",
  name: "customCSS",
  label: "Custom CSS",
  language: "css"                 // Syntax highlighting language
}
```

---

## Navigation System

### NavigationMenu
**Location**: `@/Components/Common/NavigationMenu`
```jsx
// App Navigation (used in Routes.jsx)
import { AppNavigationMenu } from "@/Components/Common/NavigationMenu";
<AppNavigationMenu />

// Navigation Helper Function  
import { navigate } from "@/Components/Common/NavigationMenu";
const setNavigate = navigate();
setNavigate("/path/to/page");

// Features:
// - Shopify App Bridge integration
// - Admin vs regular mode detection  
// - Navigation history tracking
// - Mock data support for development
```

---

## API Integration Patterns

### useAuthenticatedFetch Usage
```jsx
import { useAuthenticatedFetch } from "@/Api/Axios";

const fetch = useAuthenticatedFetch();

// GET request
const data = await fetch.get("endpoint", showLoading = true);

// POST request
const result = await fetch.post("endpoint", payload, showLoading = true, customHeaders);

// PUT/DELETE requests
const updated = await fetch.put("endpoint", data);
const deleted = await fetch.delete("endpoint", data);
```

### API Endpoints Used by Components
```jsx
// File Upload (ImagePicker)
POST /apps/api/upload-to-shopify
Content-Type: multipart/form-data
Response: { data: [{ url: string, name: string }] }

// Slack Notifications (CustomizeServiceButton)  
POST /apps/api/slack-channel-message
Body: { message: string }

// Table Data (CommonTable)
POST /apps/api/{tableUrl}?page=1&pageSize=10
Body: { advanceFilter: [], ...queryParams }
Response: { data: { rows: [], count: number } }

// Form Submission (CommonForm)
POST /apps/api/{formEndpoint}  
Body: formValues
```

---

## Context Integration

### Required Contexts
```jsx
// Most components require these contexts
const { profileData } = useContext(ProfileContext);
const { showToast } = useContext(ToastContext); 
const { startLoading, stopLoading } = useContext(LoadingContext);
const { suggestedItems } = useContext(OnboardingContext);

// ProfileContext provides:
// - profileData: User profile and plan information
// - videoLinks: Help video configurations
// - dismissProperty: Dismissed UI elements
// - updateDismissProperty: Function to update dismissed items

// ToastContext provides:
// - showToast: Function to show notification messages
```

---

## Performance Patterns

### Lazy Loading Components
```jsx
// Heavy components are lazy loaded
const Support = lazy(() => import("@/Components/Common/Support"));
const ReviewPopup = lazy(() => import("@/Components/Common/ReviewPopup"));
const CustomPlanModal = lazy(() => import("@/Components/Common/CustomizeServiceButton/CustomPlanModal"));

// Usage with Suspense
<Suspense fallback={<Loading />}>
  <ReviewPopup />
  <Support />
</Suspense>
```

### Component Optimization
```jsx
// Memoization patterns
const rows = useMemo(() => {
  return props.rowsData(data.rows, selectedRows, pagination);
}, [data.rows, selectedRows, pagination]);

const handleCallback = useCallback((data) => {
  // Handle data processing
}, [dependencies]);

// Debounced operations (CommonTable filtering)
const debouncedFilter = useCallback(
  debounce((filterData) => {
    // Apply filters
  }, 500),
  [dependencies]
);
```

---

## Common Development Tasks

### Creating a New Form
```jsx
// 1. Define form fields
const formFields = [
  { id: "name", name: "name", type: "text", label: "Name", validated: true, errormsg: "Name required" },
  { id: "email", name: "email", type: "email", label: "Email", validated: true, errormsg: "Email required" },
  { 
    type: "multiSelect", 
    id: "categories", 
    name: "categories", 
    label: "Categories",
    options: [{ label: "Option 1", value: "opt1" }]
  }
];

// 2. Define initial values
const initialValues = {
  name: "",
  email: "",
  categories: []
};

// 3. Implement form
<CommonForm
  formFields={formFields}
  initialValues={initialValues}
  onSubmit={(values) => {
    console.log("Form submitted:", values);
  }}
/>
```

### Creating a Data Table
```jsx
// 1. Define row renderer
const renderRows = (rows) => {
  return rows.map((row, index) => (
    <IndexTable.Row id={row._id} key={row._id} position={index}>
      <IndexTable.Cell>{row.name}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={row.active ? "success" : "critical"}>
          {row.active ? "Active" : "Inactive"}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button onClick={() => handleEdit(row)}>Edit</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
};

// 2. Implement table
<CommonTable
  url="admin/users"
  title="Users"
  resourceName={{ singular: "User", plural: "Users" }}
  headings={[
    { title: "Name" },
    { title: "Status" }, 
    { title: "Actions" }
  ]}
  rowsData={renderRows}
  searchKey={["name", "email"]}
  isFilterVisible={true}
/>
```

### Adding Premium Features
```jsx
// Form field with premium gate
{
  id: "advancedField",
  name: "advancedField", 
  type: "text",
  label: "Advanced Field",
  showPremium: true,
  premiumType: "advancedFeatures",
  planName: "Premium"
}

// Component with premium wrapper
<PremiumButton title="Unlock Advanced Features">
  <Button variant="primary">
    Premium Feature
  </Button>
</PremiumButton>
```

---

This documentation provides everything needed to create forms, tables, and UI components using the existing component system. Reference the specific component sections for detailed implementation examples and prop configurations.