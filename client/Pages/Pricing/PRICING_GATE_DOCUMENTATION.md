# PricingGate Feature Documentation

## Overview
The **PricingGate** component is a pricing enforcement mechanism that blocks Free plan users from accessing the app and forces them to upgrade to a paid plan. This feature provides a flexible way to remove the Free plan option from your pricing strategy without code modifications.

---

## Purpose

- **Monetization Control**: Easily switch between offering a free plan and forcing paid subscriptions
- **User Gating**: Block Free plan users from accessing the app until they upgrade
- **Business Flexibility**: Toggle free plan availability through simple code comments (no deployment needed for toggle)

---

## Implementation Details

### File Structure

```
client/Pages/Pricing/
├── Pricing.jsx                    # Main pricing page (with Free plan)
├── PricingGate.jsx                # Pricing gate (paid plans only)
├── SinglePlan.jsx                 # Individual plan card component
├── FreePlan.jsx                   # Free plan display component
└── PRICING_GATE_DOCUMENTATION.md  # This file
```

### Component Location
**File**: `/client/Pages/Pricing/PricingGate.jsx`

---

## How It Works

### Architecture

1. **User Check**: Component checks if `profileData.recurringPlanType === "Free"`
2. **Gate Display**: If true, shows full-screen modal with paid plans only
3. **Blocking Behavior**: User cannot close modal - must purchase to proceed
4. **Paid Users**: Users with paid plans never see this gate

### Filtering Logic

```javascript
// Filters out Free plan from all plans
const paidPlansOnly = getPlansData().filter(plan => plan.id !== "Free");
```

### Modal Behavior

- **Type**: Full-screen blocking modal
- **Closable**: No (empty `onClose` handler)
- **Dismissible**: No (user must purchase)
- **Navigation**: Blocks all app routes until purchase

---

## Usage

### Enable PricingGate (Remove Free Plan)

**In `client/Routes.jsx` (line 180):**

Uncomment this line:
```javascript
{profileData && profileData.recurringPlanType === "Free" && <PricingGate />}
```

**Result**:
- Free plan users see full-screen pricing modal
- Only paid plans displayed (Premium, Pro)
- Must purchase to access app

### Disable PricingGate (Allow Free Plan)

**In `client/Routes.jsx` (line 180):**

Keep this line commented:
```javascript
{/* {profileData && profileData.recurringPlanType === "Free" && <PricingGate />} */}
```

**Result**:
- Free plan users can access app normally
- Regular pricing page shows all plans including Free
- Standard flow continues

---

## Features Included

### All Standard Pricing Features

✅ **Monthly/Yearly Toggle**: Switch between billing frequencies
✅ **Promo Code Support**: Apply discount codes
✅ **Trial Days Display**: Shows remaining trial period
✅ **Date-wise Pricing**: Age-based promotional pricing
✅ **Plan Comparison**: Full feature comparison
✅ **Cancellation Flow**: Multi-step cancellation with retention offers
✅ **Custom Plans**: Contact support for custom pricing

### Differences from Regular Pricing Page

| Feature | Regular Pricing | PricingGate |
|---------|----------------|-------------|
| Free Plan | ✅ Shown | ❌ Hidden |
| Modal Display | No modal | Full-screen modal |
| User Can Close | N/A | ❌ No |
| Navigation Access | Full access | Blocked until purchase |
| Use Case | Normal pricing | Force upgrade |

---

## Component Props

**PricingGate** accepts no props - it's a standalone blocking component.

```javascript
<PricingGate />
```

### Context Usage

Uses the following React Contexts:
- `ProfileContext` - User profile and plan data
- `ToastContext` - Success/error notifications

---

## User Flow

### Scenario 1: Free Plan User (PricingGate Enabled)

```
User logs in
    ↓
App checks: profileData.recurringPlanType === "Free"
    ↓
[TRUE] → Show PricingGate modal
    ↓
User sees only paid plans (Premium/Pro)
    ↓
User selects plan → Redirected to Shopify checkout
    ↓
User completes purchase → Redirected back to app
    ↓
App checks: profileData.recurringPlanType !== "Free"
    ↓
[TRUE] → Grant app access
```

### Scenario 2: Paid Plan User (PricingGate Enabled)

```
User logs in
    ↓
App checks: profileData.recurringPlanType === "Free"
    ↓
[FALSE] → No gate shown, full app access
```

### Scenario 3: Any User (PricingGate Disabled)

```
User logs in
    ↓
PricingGate code commented out
    ↓
Normal app access for all users
```

---

## Translation Keys

All user-facing text uses i18next translation system.

**New keys added to `/client/Language/en.json`:**

```json
{
  "common": {
    "Upgrade to Access App": "Upgrade to Access App",
    "Free Plan No Longer Available": "Free Plan No Longer Available",
    "We've discontinued the free plan. Please select a paid plan below to continue using our app. All paid plans include a trial period!": "...",
    "Monthly": "Monthly",
    "Yearly": "Yearly",
    "Save 30%": "Save 30%",
    "Need a custom plan?": "Need a custom plan?",
    "Cancel Plan": "Cancel Plan",
    "Confirm Cancellation": "Confirm Cancellation",
    "Keep Plan": "Keep Plan",
    "Please select a recurring plan": "Please select a recurring plan",
    "Please enter a promo code": "Please enter a promo code",
    "Invalid promo code": "Invalid promo code",
    "Current": "Current"
  }
}
```

---

## API Integration

### Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/plan` | GET | Fetch current active plan |
| `/plan` | POST | Create new plan subscription |
| `/plan/cancel` | POST | Cancel existing plan |

### Data Flow

```javascript
// 1. Load active plan
GET /plan
  → Returns current plan data
  → Updates pricingData state with selected plan

// 2. User selects paid plan
POST /plan + { planData }
  → Creates Shopify subscription
  → Returns confirmationUrl
  → Redirects to Shopify checkout

// 3. User completes payment
Shopify redirects back → /plan/active
  → Activates subscription
  → Updates profileData.recurringPlanType
  → PricingGate no longer shows
```

---

## Routing Configuration

**File**: `/client/Routes.jsx`

### Import Statement
```javascript
const PricingGate = lazy(() => import("@/Pages/Pricing/PricingGate"));
```

### Rendering Location
```javascript
<AppNavigationMenu />
{profileData && !profileData.isOnBoardingDone && <OnBoarding />}

{/* PricingGate - Uncomment to enable */}
{/* {profileData && profileData.recurringPlanType === "Free" && <PricingGate />} */}

<div id="component"></div>
<AppUninstall />
```

**Position**: Rendered at top-level **before** route definitions, ensuring it blocks all routes when active.

---

## State Management

### Local State

```javascript
const [pricingData, setPricingData] = useState(paidPlansOnly);  // Filtered plans
const [selectedPlan, setSelectedPlan] = useState(false);        // Selected plan
const [promoCode, setPromoCode] = useState("");                 // Promo code input
const [isFirstButtonActive, setIsFirstButtonActive] = useState(false); // Monthly/Yearly toggle
const [trialDays, setTrialDays] = useState();                   // Trial days remaining
const [showDateWisePrice, setShowDateWisePrice] = useState(false); // Date pricing flag
```

### Key Functions

#### `getActivePlan()`
Fetches current plan and updates filtered plan list with selection state.

#### `selectPlanFunc(planData)`
Handles plan selection logic:
- Free users → Direct upgrade
- Paid users → Handle upgrades/downgrades

#### `redirectingUser(planData, code, discountData)`
Creates Shopify subscription and redirects to checkout.

#### `applyPromoCode(planData)`
Validates and applies promo codes for discounts.

---

## Plan Filtering

### Original Plans (from CommonPricing.mock.jsx)

- Free (ID: "Free")
- Premium-Monthly
- Premium-Yearly
- Pro-Monthly
- Pro-Yearly

### PricingGate Filtered Plans

```javascript
const paidPlansOnly = getPlansData().filter(plan => plan.id !== "Free");
```

**Result**:
- ❌ Free
- ✅ Premium-Monthly
- ✅ Premium-Yearly
- ✅ Pro-Monthly
- ✅ Pro-Yearly

---

## UI Components Used

### Polaris Components

- `Modal` - Full-screen blocking container
- `Page` - Page layout wrapper
- `Card` - Content sections
- `BlockStack` / `InlineStack` - Layout components
- `InlineGrid` - Responsive grid for plan cards
- `Button` / `ButtonGroup` - Monthly/Yearly toggle
- `Badge` - Success indicators
- `Text` - Typography
- `Icon` - Visual indicators

### Custom Components

- `SinglePlan` - Individual plan card (imported from `./SinglePlan`)
- `CustomizeServiceButton` - Contact support button
- `CommonForm` - Cancellation reason form

---

## Error Handling

### Try-Catch Blocks

```javascript
try {
  const response = await fetch.get("/plan");
  // Handle response
} catch (error) {
  console.error("Error fetching active plan:", error);
}
```

### Toast Notifications

```javascript
showToast(t(`common.Something went wrong`));
showToast(t(`common.Successfully Cancelled`), false);
showToast(t(`common.Invalid promo code`));
```

---

## Testing Scenarios

### Test Case 1: Enable PricingGate
**Steps:**
1. Uncomment PricingGate in Routes.jsx
2. Create test user with Free plan
3. Log in as Free plan user
4. Verify: Full-screen modal appears
5. Verify: Only paid plans visible
6. Verify: Cannot close modal
7. Verify: Cannot navigate to other routes

**Expected Result**: User blocked until purchase

### Test Case 2: Paid User with PricingGate Enabled
**Steps:**
1. PricingGate enabled (uncommented)
2. Log in as Premium plan user
3. Navigate to app

**Expected Result**: No gate shown, normal access

### Test Case 3: Plan Purchase Flow
**Steps:**
1. Free user sees PricingGate
2. Select Premium-Monthly plan
3. Apply promo code (optional)
4. Click "Upgrade" or similar action
5. Redirected to Shopify
6. Complete purchase
7. Redirected back to app

**Expected Result**: Gate disappears, app accessible

### Test Case 4: Disable PricingGate
**Steps:**
1. Comment out PricingGate in Routes.jsx
2. Log in as Free plan user

**Expected Result**: Normal app access, no gate

---

## Performance Considerations

### Lazy Loading
Component is lazy-loaded to reduce initial bundle size:
```javascript
const PricingGate = lazy(() => import("@/Pages/Pricing/PricingGate"));
```

### Conditional Rendering
Only renders when condition is met:
```javascript
{profileData && profileData.recurringPlanType === "Free" && <PricingGate />}
```

### Memo Optimization
Plan filtering uses `useMemo` for performance (in component state initialization).

---

## Maintenance Guidelines

### When to Update

1. **New Paid Plans Added**: Component automatically picks up new plans from `getPlansData()` (except Free)
2. **Pricing Changes**: Inherited from CommonPricing.mock.jsx
3. **UI Updates**: Modify PricingGate.jsx directly
4. **Translation Updates**: Update language JSON files

### Adding New Features

1. **New Promo Code Logic**: Update `applyPromoCode()` function
2. **Custom Plan Selection**: Modify `selectPlanFunc()` logic
3. **Additional Filtering**: Update `paidPlansOnly` filter logic

### Code Consistency

- Follow same patterns as Pricing.jsx
- Use Polaris design system
- Use i18next for all text
- Maintain useAuthenticatedFetch for API calls

---

## Dependencies

### Required Packages

```json
{
  "@shopify/polaris": "^12.x",
  "@shopify/polaris-icons": "^8.x",
  "i18next": "^23.x",
  "react": "^18.x",
  "react-router-dom": "^6.x"
}
```

### Internal Dependencies

- `/Api/Axios` - useAuthenticatedFetch hook
- `/Assets/Mocks/CommonPricing.mock` - Plan data
- `/Components/Common/CommonForm` - Form component
- `/Context/ProfileContext` - User context
- `/Context/ToastContext` - Notification context
- `/Utils/Index` - Utility functions

---

## Business Use Cases

### Use Case 1: Launch Phase
**Scenario**: New app launch, want early adopters
**Action**: Keep PricingGate commented (disabled)
**Result**: Free plan available, attracts users

### Use Case 2: Monetization Phase
**Scenario**: Established user base, focus on revenue
**Action**: Uncomment PricingGate (enabled)
**Result**: New users must purchase, existing free users prompted to upgrade

### Use Case 3: Promotional Period
**Scenario**: Special promotion with free tier
**Action**: Toggle PricingGate based on promotion dates
**Result**: Flexible pricing strategy

### Use Case 4: Freemium to Premium Pivot
**Scenario**: Business model change
**Action**: Enable PricingGate permanently
**Result**: All new/existing free users forced to upgrade

---

## Troubleshooting

### Issue: Gate Shows for Paid Users
**Cause**: `profileData.recurringPlanType` not updated after purchase
**Solution**: Check `/plan/active` endpoint, verify plan activation logic

### Issue: Cannot Close Modal
**Behavior**: Expected! This is by design
**Solution**: User must purchase a plan or disable PricingGate

### Issue: Plans Not Showing
**Cause**: All plans filtered out
**Solution**: Check `getPlansData()` returns non-Free plans

### Issue: Promo Code Not Working
**Cause**: Invalid code or incorrect billing cycle
**Solution**: Verify code exists in monthlyCodes/yearlyCodes arrays

---

## Future Enhancements

### Potential Features

1. **Granular Control**: Enable/disable per user segment
2. **Grace Period**: Allow X days before enforcing gate
3. **A/B Testing**: Show different messaging to user cohorts
4. **Exit Intent**: Offer discount when user tries to leave
5. **Usage Limits**: Gate after X feature uses instead of immediately
6. **Environment Variable**: Control via `.env` instead of code comments

---

## Security Considerations

### Client-Side Only
⚠️ **Important**: PricingGate is client-side enforcement only. Backend must still validate plan permissions for API endpoints.

### Backend Validation Required
```javascript
// server/backend/middleware/planCheck.js (example)
if (user.recurringPlanType === "Free" && featureRequiresPaid) {
  return res.status(403).json({ error: "Upgrade required" });
}
```

### No Bypass Risk
Even if user bypasses client-side gate, backend permissions prevent unauthorized access.

---

## Related Documentation

- **Pricing System**: `.claude/docs/client/PRICING.md` (if exists)
- **CommonPricing Mock**: `/client/Assets/Mocks/CommonPricing.mock.jsx`
- **User Schema**: `/server/backend/schema/users.js`
- **Plan Routes**: `/server/backend/routes/pricingRoutes.js`

---

## Change Log

### v1.0.0 (2025-11-26)
- ✅ Initial implementation
- ✅ Full-screen blocking modal
- ✅ Paid plans only (Free plan filtered)
- ✅ Monthly/Yearly toggle
- ✅ Promo code support
- ✅ Trial days display
- ✅ Translation support
- ✅ Routes.jsx integration with clear comments

---

## Contact & Support

For questions or issues related to PricingGate:
1. Check this documentation first
2. Review Pricing.jsx for comparison
3. Verify backend plan activation logic
4. Test with different plan types

**Maintainer Notes**: This component mirrors Pricing.jsx functionality while enforcing paid-only access. Keep both components in sync for feature parity.
