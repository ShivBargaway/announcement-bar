# Language Translation System

This document covers the language translation system for the Shopify App Starter Kit using **ONLY** `common.` prefix for ALL translations. No other prefixes are allowed.

## Supported Languages

The application supports **16 languages** with complete translation coverage:

- **en** - English (base language)
- **cs** - Czech
- **da** - Danish  
- **de** - German
- **es** - Spanish
- **fr** - French
- **hi** - Hindi
- **it** - Italian
- **ja** - Japanese
- **ko** - Korean
- **nl** - Dutch
- **pl** - Polish
- **pt** - Portuguese
- **sv** - Swedish
- **tr** - Turkish
- **zh** - Chinese

## Translation File Architecture

### 🚨 CRITICAL: Translation File Usage Rules

**MANDATORY**: All new translations MUST be added to **en.json file ONLY**. DO NOT update en.js file.

```
client/
├── Language/                    # 🎯 ADD TRANSLATIONS HERE
│   ├── en.json                 # ✅ MAIN translation file - ADD ALL NEW TRANSLATIONS HERE
│   ├── es.json                 # Other language translations
│   └── [other languages].json
└── LanguageJS/                 # ❌ DO NOT MODIFY THESE FILES
    ├── en.js                   # ❌ Legacy file - DO NOT ADD NEW TRANSLATIONS
    ├── es.js                   # ❌ Legacy file - DO NOT ADD NEW TRANSLATIONS
    └── [other languages].js   # ❌ Legacy files - DO NOT ADD NEW TRANSLATIONS
```

## 🚨 MANDATORY: Common-Only Structure

### Translation File: `/client/Language/en.json` 

**STRICT RULE**: ALL translations MUST use ONLY `common.` prefix. No other prefixes allowed (no `onboarding.`, `pricing.`, `mocks.`, `settings.`, etc.)

```json
{
  "common": {
    "Store customization services": "Store customization services",
    "free": "free", 
    "trial": "trial",
    "Affordable SEO services": "Affordable SEO services",
    "Basic Plan": "Basic Plan",
    "Premium Plan": "Premium Plan",
    "Enterprise Plan": "Enterprise Plan",
    "Welcome to our app": "Welcome to our app",
    "Getting started is easy": "Getting started is easy",
    "Save": "Save",
    "Cancel": "Cancel",
    "Delete": "Delete",
    "Edit": "Edit",
    "Loading...": "Loading...",
    "Operation completed successfully": "Operation completed successfully",
    "An error occurred": "An error occurred",
    "This field is required": "This field is required",
    "Please enter a valid email address": "Please enter a valid email address"
  }
}
```

### ❌ LEGACY: JavaScript Language Modules (`/client/LanguageJS/`)

**IMPORTANT**: These files are LEGACY and should NOT be modified for new translations.

```javascript
// ❌ DO NOT ADD NEW TRANSLATIONS TO en.js
// ❌ DO NOT MODIFY THESE FILES
// ❌ ALL NEW TRANSLATIONS MUST GO TO en.json

// This file exists only for backward compatibility
// and merges existing translations with en.json
```

## Language Merge System

### mergeLanguage Function

**Location**: `/client/Utils/Index.js`

**Purpose**: Deep merges base JSON translations with extended JavaScript translations

```javascript
export const mergeLanguage = (modifyData, data) => {
  const finalData = { ...data };
  for (const key in modifyData) {
    if (typeof modifyData[key] === "object" && data.hasOwnProperty(key)) {
      // Recursive merge for nested objects
      finalData[key] = mergeLanguage(data[key], modifyData[key]);
    } else {
      // Direct assignment for primitive values
      finalData[key] = modifyData[key];
    }
  }
  return finalData;
};
```

### Merge Process

1. **Base Layer**: `/client/Language/[lang].json` - Static translations in `common.`
2. **Extended Layer**: `/client/LanguageJS/[lang].js` - Component-specific translations in `common.`
3. **Final Output**: Merged object with all translations under `common.`

```javascript
// Example merge result
{
  common: {
    // From JSON file
    "Save": "Save",
    "Cancel": "Cancel",
    
    // From JS module  
    "Enable App": "Enable App",
    "Enabled": "Enabled",
    "Done": "Done"
  }
}
```

## Translation Organization Under Common

### Flat Structure Only

```javascript
common: {
  // Direct translations - all flat keys
  "Welcome": "Welcome",
  "Getting Started": "Getting Started",
  "Done": "Done",
  "Reset": "Reset", 
  "Apply": "Apply",
  "No": "No",
  "Found": "Found",
  "Add": "Add",
  "Search": "Search",
  "Items per page": "Items per page",
  "Showing results": "Showing {{start}} to {{end}} of {{total}} results",
  "Home": "Home",
  "Settings": "Settings",
  "Pricing": "Pricing",
  "Help": "Help",
  "Save": "Save",
  "Cancel": "Cancel",
  "Required field": "This field is required",
  "Invalid email": "Please enter a valid email"
}
```

## Adding New Languages

### Step 1: Create Base Translation File

Create `/client/Language/[lang-code].json`:

```json
{
  "common": {
    "Store customization services": "[Translated text]",
    "free": "[Translated text]",
    "trial": "[Translated text]",
    "Basic Plan": "[Translated text]",
    "Save": "[Translated text]",
    "Cancel": "[Translated text]"
  }
}
```

### Step 2: Create Extended Language Module

Create `/client/LanguageJS/[lang-code].js`:

```javascript
import modifyData from "../Language/[lang-code].json";
import { mergeLanguage } from "../Utils/Index";

const data = {
  common: {
    "Enabled": "[Translated text]",
    "Disabled": "[Translated text]",
    "Done": "[Translated text]",
    "Home": "[Translated text]",
    "Settings": "[Translated text]",
    "Loading...": "[Translated text]",
    "Success": "[Translated text]",
    "Error": "[Translated text]"
  }
};

export default mergeLanguage(modifyData, data);
```

## Using Translations in Components

### Standard i18next Pattern (REQUIRED)

```javascript
// Import i18next translation function
import { t } from "i18next";

const MyComponent = () => {
  return (
    <div>
      <h1>{t("common.Welcome")}</h1>
      <button>{t("common.Save")}</button>
      <span>{t("common.Done")}</span>
    </div>
  );
};
```

### Real-World Example (OneTimeFixCommon.jsx)

```javascript
import React from "react";
import { BlockStack, Card, InlineGrid, InlineStack, Link, List, Page, Text } from "@shopify/polaris";
import { t } from "i18next";

export default function OneTimeFixCommon({
  title,
  backbutton,
  planName,
  price,
  implementationList,
  supportList,
  purchasePlanInfo,
  timelineBanner = false,
}) {
  return (
    <Page
      title={t(`common.${title}`)}                           // Dynamic title
      backAction={backbutton}
      primaryAction={{
        content: purchasePlanInfo
          ? `🎉 ${t("common.Purchased")} - $${price}`        // Conditional text
          : `💰 ${t("common.Purchase one time")} - $${price}`
      }}
    >
      <BlockStack gap={200}>
        <Card>
          <BlockStack gap={400}>
            {timelineBanner && (
              <Text>
                {t("common.Core Web Vitals optimization requires")}{" "}
                <strong>{t("common.diagnostics, code analysis, and testing")}</strong>.{" "}
                {t("common.Changes are implemented safely to maintain store performance.")}
                <br />⏱ <strong>{t("common.Timeline")}</strong> : {t("common.2-3 weeks for complete optimization.")}
              </Text>
            )}
            
            <Text variant="headingMd">{t("common.What's included")}</Text>
            <List type="bullet">
              <InlineGrid columns={{ sm: 1, md: 2 }} gap="100">
                {implementationList?.map((item, index) => (
                  <List.Item key={index}>
                    <Text>{t(`common.${item?.label}`)}</Text>           {/* Dynamic from array */}
                    <Text tone="subdued">{t(`common.${item?.description}`)}</Text>  {/* Dynamic from array */}
                  </List.Item>
                ))}
              </InlineGrid>
            </List>
            
            <Text variant="headingMd">{t("common.Support details")}</Text>
            <List type="number">
              {supportList?.map((item, index) => (
                <List.Item key={index}>
                  <InlineStack gap={100} blockAlign="center">
                    <span>
                      <strong>{t(`common.${item?.label}`)}</strong> - {t(`common.${item?.description}`)}
                    </span>
                  </InlineStack>
                </List.Item>
              ))}
            </List>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
```

## Translation Key Naming Convention

### Simple Flat Keys
```javascript
common: {
  "Welcome": "Welcome",
  "Save": "Save",
  "Delete": "Delete",
  "Loading...": "Loading..."
}
```

### Component-Grouped Keys
```javascript
common: {
  ComponentName: {
    "Action1": "Action 1",
    "Action2": "Action 2",
    "Status": "Status message"
  }
}
```

### Usage Examples
```javascript
// i18next pattern - all keys with common prefix
t("common.Welcome")
t("common.Save")
t("common.Done")
t("common.Enabled")
t("common.Home")

// Dynamic keys
t(`common.${dynamicKey}`)
t(`common.${item.label}`)
t(`common.${item.description}`)
```

## 🚨 CRITICAL RULES

### ✅ ALWAYS DO: Add All Translations to en.json

**Step 1**: Add translation to `/client/Language/en.json`
```json
{
  "common": {
    "Your new text": "Your new text",
    "Another translation": "Another translation"
  }
}
```

**Step 2**: Use in component with `common.` prefix
```javascript
import { t } from "i18next";

// Use the translation
{t("common.Your new text")}
{t("common.Another translation")}
```

### ❌ NEVER DO: Wrong Patterns

```javascript
// ❌ FORBIDDEN - No nested structures
{
  "common": {
    "features": {
      "Some text": "Some text"  // ❌ Wrong!
    }
  }
}

// ❌ FORBIDDEN - No other prefixes
{
  "onboarding": {            // ❌ Wrong!
    "Mark as done": "Mark as done"
  },
  "pricing": {               // ❌ Wrong!
    "Current": "Current"
  }
}

// ❌ FORBIDDEN - Don't add to en.js
// Do NOT modify /client/LanguageJS/en.js

// ❌ FORBIDDEN - Wrong usage patterns
t("onboarding.Mark as done")     // ❌ Wrong!
t("pricing.Current")              // ❌ Wrong!
t("mocks.navigation.Price")      // ❌ Wrong!
t(`common.features.${text}`)      // ❌ Wrong!
```

### 2. Descriptive Key Names
```javascript
// ✅ Good - Clear and descriptive flat keys
common: {
  "Color Picker Done": "Done",
  "Data Table Search": "Search", 
  "Pricing Card Select Plan": "Select Plan"
}
```

### 3. Simple Key Organization
```javascript
// ✅ Good - All translations as flat keys
common: {
  "Welcome": "Welcome",
  "Loading...": "Loading...",
  "Save": "Save",
  "Cancel": "Cancel", 
  "Delete": "Delete",
  "This field is required": "This field is required",
  "Invalid email format": "Invalid email format"
}
```

### 4. Dynamic Content Support
```javascript
common: {
  "Welcome user": "Welcome back, {{username}}!",
  "Items count": "You have {{count}} items"
}

// Usage with dynamic values
const message = t("common.Welcome user")?.replace('{{username}}', user.name);
const itemsText = t("common.Items count")?.replace('{{count}}', itemCount);
```

## Language File Management

### File Size Optimization

1. **Flat Structure**: All translations under `common.` as flat keys keeps files simple
2. **Descriptive Keys**: Use descriptive key names for easy identification
3. **Lazy Loading**: Load only needed language module

```javascript
// Dynamic language loading
const loadLanguage = async (lang) => {
  const translations = await import(`../LanguageJS/${lang}.js`);
  return translations.default;
};
```

### Translation Validation

```javascript
// Validate all languages have same structure
const validateTranslations = (languages) => {
  const baseKeys = getAllKeys(languages.en.common);
  
  Object.keys(languages).forEach(langCode => {
    const langKeys = getAllKeys(languages[langCode].common);
    const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missingKeys.length > 0) {
      console.warn(`Missing keys in ${langCode}:`, missingKeys);
    }
  });
};

// Helper to get all nested keys
const getAllKeys = (obj, prefix = '') => {
  let keys = [];
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  });
  return keys;
};
```

## 🚨 SUMMARY: Translation Rules

### ✅ MANDATORY REQUIREMENTS:

1. **File Location**: ALL new translations MUST go to `/client/Language/en.json`
2. **Structure**: ALL translations MUST be flat under `"common"` key
3. **Usage**: ALL components MUST use `t("common.Your text")` pattern
4. **Dynamic Keys**: Use `t(\`common.\${variable}\`)` pattern
5. **Forbidden**: NO nested structures, NO other prefixes, NO en.js modifications

### ❌ STRICTLY FORBIDDEN:

1. Adding translations to `/client/LanguageJS/en.js`
2. Using prefixes like `onboarding.`, `pricing.`, `mocks.`, `settings.`
3. Creating nested structures under `common`
4. Using patterns like `t("common.features.${text}")`

### ✅ CORRECT EXAMPLES:

```javascript
// Add to en.json
{
  "common": {
    "Save": "Save",
    "Mark as done": "Mark as done",
    "Current": "Current",
    "Price": "Price"
  }
}

// Use in components
t("common.Save")
t("common.Mark as done")
t("common.Current")
t(`common.${feature.text}`)
```

This flat structure under `common.` makes translation management simple and maintainable. **ALL** translations must follow this pattern without exceptions.