# CrispAutomation Component Documentation

## Overview

The **WebrexCrispAutomation** component is a centralized system that listens for custom browser events and automatically handles Crisp chat interactions. It provides a clean way to trigger Crisp messages from anywhere in the application without directly importing or managing Crisp SDK in every component.

**Currently supports 2 automation types:**
1. **activateSchema** - Show premium schema activation confirmation message
2. **reviewReq** - Request app review from user with 60-day cooldown mechanism

## Purpose

- **Centralized Crisp Management**: Single source of truth for automated Crisp interactions
- **Event-Driven Architecture**: Uses browser's native CustomEvent API for loose coupling
- **Reusable**: Trigger Crisp messages from any component without repeating code
- **Simple**: Only handles essential automation cases
- **Maintainable**: All Crisp automation logic in one place

## Architecture

### Location
- **File Path**: `/client/Components/Common/CrispAutomation.jsx`
- **Rendered In**: `Routes.jsx` (main route wrapper) - always active across all main app routes

### Integration Pattern
```jsx
// In Routes.jsx
const CrispAutomation = lazy(() => import("@/Components/Common/CrispAutomation"));

<Suspense fallback={<Loading />}>
  <CrispAutomation />
  {/* other components */}
</Suspense>
```

### Event Listener
The component listens for `crispAutomation` custom events on the window object:
```javascript
window.addEventListener("crispAutomation", handleCrispEvent);
```

## Usage Examples

### 1. Activate Schema Confirmation

Send confirmation message after activating premium schema features:

```javascript
// From any component
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: {
    type: 'activateSchema'
  }
}));
```

**What happens:**
- Sends activation confirmation message to Crisp chat
- Message includes store name from profile data
- Message: "Hello {StoreName}! 🎉 I've activated all premium schema free for your account😇. Please check"

### 2. Request App Review

Ask user to submit app review:

```javascript
// From any component
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: {
    type: 'reviewReq'
  }
}));

// Alternative (also supported)
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: {
    type: 'requestReview'
  }
}));
```

**What happens:**
- First, tries to open Shopify native review modal via App Bridge
- If native review fails or not available:
  - Sends Crisp message with review link
  - Includes promotional text about free features
  - Shows 5-star rating encouragement
  - Provides direct review URL

## Supported Event Types

| Event Type | Description | Required Fields | What It Does |
|------------|-------------|-----------------|--------------|
| `activateSchema` | Confirm schema activation | None | Shows activation success message in Crisp |
| `reviewReq` or `requestReview` | Request app review | None | Opens Shopify review or sends Crisp message with review link |

## Real-World Use Cases

### Use Case 1: After Successful Schema Activation

Trigger schema activation message after enabling premium features:

```jsx
import { useEffect } from "react";
import { useAuthenticatedFetch } from "@/Api/Axios";

function SchemaActivationHandler() {
  const fetch = useAuthenticatedFetch();

  const activatePremiumSchemas = async () => {
    // Activate schemas in backend
    const res = await fetch.post("/activate-premium-schemas");

    if (res?.data?.success) {
      // Show Crisp confirmation message
      window.dispatchEvent(new CustomEvent('crispAutomation', {
        detail: { type: 'activateSchema' }
      }));
    }
  };

  return (
    <Button onClick={activatePremiumSchemas}>
      Activate Premium Schemas
    </Button>
  );
}
```

### Use Case 2: Request Review After Positive Interaction

Ask for review after user completes important action:

```jsx
import { Button } from "@shopify/polaris";

function SuccessScreen() {
  const handleRequestReview = () => {
    // Trigger review request
    window.dispatchEvent(new CustomEvent('crispAutomation', {
      detail: { type: 'reviewReq' }
    }));
  };

  return (
    <div>
      <Text>Your setup is complete! 🎉</Text>
      <Button onClick={handleRequestReview}>
        Rate Your Experience
      </Button>
    </div>
  );
}
```

### Use Case 3: Automated Flow After Support Request

Chain both automations together:

```jsx
import { useCallback } from "react";

function SupportRequestComplete() {
  const handleSupportComplete = useCallback(async () => {
    // First, activate schemas
    window.dispatchEvent(new CustomEvent('crispAutomation', {
      detail: { type: 'activateSchema' }
    }));

    // Wait 5 seconds, then ask for review
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('crispAutomation', {
        detail: { type: 'reviewReq' }
      }));
    }, 5000);
  }, []);

  return (
    <Button onClick={handleSupportComplete}>
      Complete Request
    </Button>
  );
}
```

### Use Case 4: Trigger from API Response

Automatically trigger after backend operation:

```jsx
function FeatureUnlockPage() {
  const fetch = useAuthenticatedFetch();

  const unlockFeature = async () => {
    const res = await fetch.post("/unlock-feature", { feature: "premium" });

    if (res?.data?.unlocked) {
      // Backend unlocked, show Crisp confirmation
      window.dispatchEvent(new CustomEvent('crispAutomation', {
        detail: { type: 'activateSchema' }
      }));
    }
  };

  return <Button onClick={unlockFeature}>Unlock</Button>;
}
```

## Implementation Details

### Dependencies
- `crisp-sdk-web`: Crisp chat SDK
- `@shopify/app-bridge-react`: Shopify App Bridge for review requests
- `i18next`: Translation support for review messages
- `@/Context/ProfileContext`: User profile data (store name)
- `@/Utils/Index`: Admin check utility

### State Management
- Uses `ProfileContext` for user data (store name for personalized messages)
- No database updates in this simplified version

### Translation Support
Review messages use `t()` function from i18next for multi-language support:
```javascript
const reviewMessage = `${t("common.Enjoying our free app?")}\n...`;
```

### Error Handling
- Logs warnings for unknown event types
- Logs errors for missing event type
- Gracefully handles Shopify review request failures with try-catch

## Best Practices

### 1. Don't Spam Events
```javascript
// ✅ Good - only trigger on user action
<Button onClick={() => {
  window.dispatchEvent(new CustomEvent('crispAutomation', {
    detail: { type: 'reviewReq' }
  }));
}}>
  Request Review
</Button>

// ❌ Avoid - don't trigger on every render
useEffect(() => {
  window.dispatchEvent(new CustomEvent('crispAutomation', {
    detail: { type: 'reviewReq' }
  })); // This will spam on every render!
}, []);
```

### 2. Use Appropriate Timing
```javascript
// ✅ Good - trigger after successful operation
const activateSchemas = async () => {
  const res = await fetch.post("/activate-schemas");
  if (res?.data?.success) {
    window.dispatchEvent(new CustomEvent('crispAutomation', {
      detail: { type: 'activateSchema' }
    }));
  }
};

// ❌ Avoid - triggering before operation completes
const activateSchemas = async () => {
  window.dispatchEvent(new CustomEvent('crispAutomation', {
    detail: { type: 'activateSchema' }
  }));
  await fetch.post("/activate-schemas"); // Message sent before schema activated!
};
```

### 3. Chain Events with Delays
```javascript
// ✅ Good - natural flow with delay
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: { type: 'activateSchema' }
}));

setTimeout(() => {
  window.dispatchEvent(new CustomEvent('crispAutomation', {
    detail: { type: 'reviewReq' }
  }));
}, 5000); // Wait 5 seconds before asking for review
```

### 4. Ensure Crisp is Loaded
The component assumes Crisp is already initialized (via `Crisp.jsx` component). Ensure Crisp loads before triggering events.

## Debugging

### Console Logging
The component logs warnings and errors to console:
- Unknown event types: `Unknown crispAutomation event type: xyz`
- Missing event type: `crispAutomation event requires a type in event.detail`
- Review request failures: `Review request failed: [error details]`

### Test Events in Browser Console
```javascript
// Test schema activation
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: { type: 'activateSchema' }
}));

// Test review request
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: { type: 'reviewReq' }
}));

// Test invalid type (should log warning)
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: { type: 'invalidType' }
}));
```

### Check Event Listener
```javascript
// In browser console (Chrome DevTools)
getEventListeners(window).crispAutomation
```

## Maintenance

### Adding New Event Types

If you need to add more automation types in the future:

1. **Add handler function:**
```javascript
const handleNewAutomation = useCallback(async () => {
  // Your Crisp automation logic
  Crisp.message.showText("Your message here");
}, [profileData]);
```

2. **Add to switch statement:**
```javascript
switch (type) {
  case "activateSchema":
    await handleActivateSchema();
    break;

  case "reviewReq":
  case "requestReview":
    await handleRequestReview();
    break;

  case "newAutomation": // Add new case
    await handleNewAutomation();
    break;
}
```

3. **Add to dependencies:**
```javascript
const handleCrispEvent = useCallback(
  async (event) => {
    // ... event handling logic
  },
  [handleActivateSchema, handleRequestReview, handleNewAutomation] // Add here
);
```

4. **Update this documentation file**

### Modifying Messages

Message templates are in the handler functions:

**Schema Activation Message** (line ~40):
```javascript
const activateSchemaMessage = `Hello ${profileData?.storeName}! 🎉\n
I've activated **all premium schema free** for your account😇.\n
Please check\n`;
```

**Review Request Message** (line ~58):
```javascript
const reviewMessage = `🛍️ ${t("common.Enjoying our free app?")}\n...`;
```

**Crisp Methods Used:**
- `Crisp.message.showText()` - Shows message from bot/support
- `Crisp.chat.open()` - Opens Crisp chat window (not used currently)

## Future Enhancements

Potential improvements for this component:
- [ ] Add more automation types as needed (e.g., feature unlock, custom support)
- [ ] Analytics tracking for triggered events
- [ ] TypeScript definitions for better type safety
- [ ] Event validation with schema
- [ ] Success/failure callbacks
- [ ] Queue system to prevent spam

## Related Files

- `/client/Components/Common/Crisp.jsx` - Main Crisp initialization and configuration
- `/client/Routes.jsx` - Where CrispAutomation is integrated and rendered
- `/client/Context/ProfileContext.jsx` - User profile data (provides store name)
- Original reference: `/Users/urvisharupapara/Desktop/urvisha/seo-schema/client/Components/Common/UnlockUsingSupport.jsx`

## Technical Notes

- **Active in**: Main app routes only (not public or admin routes)
- **Dependencies**: Requires Crisp SDK to be loaded first via `Crisp.jsx`
- **Event System**: Uses browser's native CustomEvent API (no external libraries)
- **Loading**: Lazy-loaded via Suspense in Routes.jsx
- **Lifecycle**: Always rendered to maintain active event listener
- **Admin Mode**: Skips Shopify App Bridge operations when in admin mode

## Quick Reference

```javascript
// ✅ Schema Activation
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: { type: 'activateSchema' }
}));

// ✅ Review Request
window.dispatchEvent(new CustomEvent('crispAutomation', {
  detail: { type: 'reviewReq' }
}));
```

---

**Last Updated**: 2025-11-26
**Component Version**: 1.0.0 (Simplified)
**Supported Automations**: 2 (activateSchema, reviewReq)
