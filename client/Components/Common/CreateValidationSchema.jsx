import * as Yup from "yup";

const flattenFields = (arr) => {
  // This will hold all the flattened fields
  const result = [];

  // Safety check - if arr is null/undefined or not an array, return empty
  if (!arr || !Array.isArray(arr)) return result;

  // Inner function to recursively process fields
  function traverse(fields) {
    // Safety check for the fields array
    if (!fields || !Array.isArray(fields)) return;

    fields.forEach((field) => {
      // Check if this is a "group" type field
      if (field.nested === "group" && field.subfields) {
        // GROUP FOUND: Don't add the group itself, just process its children
        // This "flattens" the group - children become siblings at parent level
        traverse(field.subfields);
      } else {
        // NOT A GROUP: Add this field to results as-is
        // (could be regular field, nested object, or nested array)
        result.push(field);
      }
    });
  }

  // Start traversing from the top-level array
  traverse(arr);
  return result;
};

const validateField = (field, required = true) => {
  let fieldSchema;

  switch (field.type) {
    // -------------------------------------------------------------------------
    // ARRAY TYPE: For fields that accept multiple string values
    // Example: Tags input where user adds multiple items
    // -------------------------------------------------------------------------
    case "array":
      fieldSchema = required
        ? Yup.array().of(Yup.string().required(field.errormsg)) // Each item must be non-empty string
        : Yup.array().of(Yup.string().nullable().notRequired()); // Items can be empty
      break;

    // -------------------------------------------------------------------------
    // CHOICE LIST TYPE: For checkbox groups or multi-option selections
    // Supports min/max selection limits
    // Example: "Select at least 2 categories"
    // -------------------------------------------------------------------------
    case "choiceList":
      fieldSchema = Yup.array().of(Yup.string());
      // Add minimum selection requirement if specified
      if (required && field.min !== undefined) {
        fieldSchema = fieldSchema.min(field.min, "Select minimum " + field.min);
      }
      // Add maximum selection limit if specified
      if (field.max !== undefined) {
        fieldSchema = fieldSchema.max(field.max, "Select maximum " + field.max);
      }
      // Make optional if not required
      if (!required) {
        fieldSchema = fieldSchema.nullable().notRequired();
      }
      break;

    // -------------------------------------------------------------------------
    // MULTI-SELECT TYPE: For dropdown with multiple selections
    // Must have at least 1 selection when required
    // -------------------------------------------------------------------------
    case "multiSelect":
      fieldSchema = required
        ? Yup.array().min(1, field.errormsg).required(field.errormsg) // At least 1 item
        : Yup.array().nullable().notRequired();
      break;

    // -------------------------------------------------------------------------
    // EMAIL TYPE: String with email format validation
    // Validates format like "user@example.com"
    // -------------------------------------------------------------------------
    case "email":
      fieldSchema = required
        ? Yup.string().email("Invalid email").required(field.errormsg)
        : Yup.string().email("Invalid email").nullable();
      break;

    // -------------------------------------------------------------------------
    // NUMBER TYPE: Numeric values only
    // Shows custom error if user enters non-numeric text
    // -------------------------------------------------------------------------
    case "number":
      fieldSchema = required
        ? Yup.number()
            .typeError(field.errormsg || "Must be a number") // Error for "abc" in number field
            .required(field.errormsg)
        : Yup.number().typeError("Must be a number").nullable();
      break;

    // -------------------------------------------------------------------------
    // VIDEO & FILE UPLOAD TYPES: Always optional
    // These fields use separate upload mechanisms, not form validation
    // -------------------------------------------------------------------------
    case "video":
    case "fileUpload":
      fieldSchema = Yup.mixed().nullable().notRequired();
      break;

    // -------------------------------------------------------------------------
    // DEFAULT: Treat as text/string field
    // Covers: text, select, searchableSelect, textarea, date, time, etc.
    // -------------------------------------------------------------------------
    default:
      fieldSchema = required ? Yup.string().required(field.errormsg) : Yup.string().nullable();
  }

  return fieldSchema;
};

// =============================================================================
// HELPER: getNestedValue
// Gets value from object using dot-notation path
// =============================================================================
//
// PURPOSE:
// When we have a dependOn like { name: "returnPolicy.fees", value: "paid" },
// we need to get the value at "returnPolicy.fees" from the form values object.
// This function navigates through nested objects using the dot-separated path.
//
// HOW IT WORKS:
// 1. Split the path by "." → ["returnPolicy", "fees"]
// 2. Start with the full object
// 3. For each part, go one level deeper: obj → obj.returnPolicy → obj.returnPolicy.fees
//
// EXAMPLES:
// getNestedValue({a: {b: 1}}, "a.b")           → 1
// getNestedValue({x: {y: {z: "hello"}}}, "x.y.z") → "hello"
// getNestedValue({foo: "bar"}, "foo")          → "bar"
// getNestedValue({}, "missing.path")           → undefined
//
// =============================================================================
const getNestedValue = (obj, path) => {
  // Safety check - return undefined if obj or path is missing
  if (!obj || !path) return undefined;

  try {
    // Split path into parts and navigate through object
    // "returnPolicy.fees" → ["returnPolicy", "fees"]
    // Then: obj["returnPolicy"]["fees"]
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
    // The ?. (optional chaining) prevents errors if intermediate path is undefined
  } catch {
    // If anything goes wrong, return undefined instead of crashing
    return undefined;
  }
};

// =============================================================================
// HELPER: checkDependOnCondition
// Checks if the dependOn condition is satisfied
// =============================================================================
//
// PURPOSE:
// Determines if a field's dependOn condition is met. The condition can be:
// 1. Simple equality: sourceValue === dependOnValue
// 2. Array OR condition: sourceValue matches ANY value in dependOnValue array
// 3. MultiSelect check: dependOnValue exists in sourceValue array
// 4. Function-based: custom function that returns true/false
//
// PARAMETERS:
// - sourceValue: The current value of the field we're depending on
// - dependOnValue: The value(s) that trigger the condition (from dependOn.value)
//
// RETURNS: Boolean - true if condition is met, false otherwise
//
// EXAMPLES:
// checkDependOnCondition("paid", "paid")                    → true  (equality)
// checkDependOnCondition("free", "paid")                    → false (not equal)
// checkDependOnCondition("paid", ["paid", "partial"])       → true  (in array)
// checkDependOnCondition("free", ["paid", "partial"])       → false (not in array)
// checkDependOnCondition(["a", "b"], "a")                   → true  (multiSelect)
// checkDependOnCondition(["c", "d"], "a")                   → false (not in multiSelect)
//
// =============================================================================
const checkDependOnCondition = (sourceValue, dependOnValue) => {
  // -------------------------------------------------------------------------
  // CASE 1: Function-based condition
  // Allows custom logic like: (value) => value > 10
  // -------------------------------------------------------------------------
  if (typeof dependOnValue === "function") {
    return dependOnValue(sourceValue);
  }

  // -------------------------------------------------------------------------
  // CASE 2: dependOnValue is an array (OR condition)
  // Field is required if sourceValue matches ANY value in the array
  // Example: dependOn: { name: "type", value: ["A", "B", "C"] }
  //          → Field required if type is "A" OR "B" OR "C"
  // -------------------------------------------------------------------------
  if (Array.isArray(dependOnValue)) {
    if (Array.isArray(sourceValue)) {
      // Both are arrays - check if ANY dependOnValue exists in sourceValue
      // Example: sourceValue = ["red", "blue"], dependOnValue = ["blue", "green"]
      //          → true because "blue" is in both
      return dependOnValue.some((v) => sourceValue.includes(v));
    }
    // sourceValue is single value - check if it's in the dependOnValue array
    // Example: sourceValue = "paid", dependOnValue = ["paid", "partial"]
    //          → true because "paid" is in array
    return dependOnValue.includes(sourceValue);
  }

  // -------------------------------------------------------------------------
  // CASE 3: sourceValue is an array (multiSelect field)
  // Check if dependOnValue exists in the selected options
  // Example: User selected ["option1", "option2"], dependOnValue = "option1"
  //          → true because "option1" is selected
  // -------------------------------------------------------------------------
  if (Array.isArray(sourceValue)) {
    return sourceValue.includes(dependOnValue);
  }

  // -------------------------------------------------------------------------
  // CASE 4: Simple equality check (most common)
  // Example: sourceValue = "paid", dependOnValue = "paid" → true
  // -------------------------------------------------------------------------
  return sourceValue === dependOnValue;
};

// =============================================================================
// HELPER: getRootFormValues
// Attempts to get root form values from Yup test context
// =============================================================================
//
// PURPOSE:
// When validating a deeply nested field, we need access to the ENTIRE form's values
// to check cross-nested dependencies. Yup provides this through test context.
//
// THE PROBLEM:
// - We're validating: returnPolicy.returnShippingFeesAmount.value
// - We need to check: returnPolicy.fees
// - But inside the nested validation, we only have access to {value, currency}
// - We need to "climb up" to get the full form values
//
// HOW YUP's this.from WORKS:
// When validating a nested field, Yup creates a chain of parent contexts:
//
// For field: returnPolicy.returnShippingFeesAmount.value
// this.from = [
//   { value: { value: "", currency: "" } },      ← returnShippingFeesAmount object
//   { value: { fees: "paid", returnShippingFeesAmount: {...} } }, ← returnPolicy object
//   { value: { returnPolicy: {...}, shippingInfo: {...} } }       ← ROOT FORM! ✓
// ]
//
// The LAST item in the array is always the root form values!
//
// =============================================================================
const getRootFormValues = (testContext) => {
  try {
    // -------------------------------------------------------------------------
    // METHOD 1 (PRIMARY): this.from - Yup v1.x parent context chain
    // This is the MOST RELIABLE method for cross-nested dependencies
    // -------------------------------------------------------------------------
    if (testContext.from && Array.isArray(testContext.from) && testContext.from.length > 0) {
      // Get the LAST item - it's the root form
      const rootContext = testContext.from[testContext.from.length - 1];

      // Verify it's a valid object with actual data (not empty {})
      if (
        rootContext?.value &&
        typeof rootContext.value === "object" &&
        Object.keys(rootContext.value).length > 0
      ) {
        return rootContext.value;
      }
    }

    // -------------------------------------------------------------------------
    // METHOD 2: this.options.context - Formik context (if passed)
    // Only use if it has actual data (not an empty object)
    // Note: Formik doesn't pass context by default, so this is often empty
    // -------------------------------------------------------------------------
    if (
      testContext.options?.context &&
      typeof testContext.options.context === "object" &&
      Object.keys(testContext.options.context).length > 0
    ) {
      return testContext.options.context;
    }

    // -------------------------------------------------------------------------
    // METHOD 3: Walk up this.from from bottom to top
    // Fallback if the last item didn't work - find first valid context
    // -------------------------------------------------------------------------
    if (testContext.from && Array.isArray(testContext.from)) {
      for (let i = testContext.from.length - 1; i >= 0; i--) {
        const ctx = testContext.from[i];
        if (ctx?.value && typeof ctx.value === "object" && Object.keys(ctx.value).length > 0) {
          return ctx.value;
        }
      }
    }

    // -------------------------------------------------------------------------
    // METHOD 4: Use this.parent as last resort
    // Only works for same-level dependencies (sibling fields)
    // Won't work for cross-nested deps but better than nothing
    // -------------------------------------------------------------------------
    if (testContext.parent && typeof testContext.parent === "object") {
      return testContext.parent;
    }

    // No valid context found
    return null;
  } catch {
    // If anything throws, return null to avoid crashing validation
    return null;
  }
};

// =============================================================================
// SCHEMA: createDependOnSchema
// Creates validation schema for fields with dependOn (conditional validation)
// =============================================================================
//
// PURPOSE:
// Creates a Yup schema for fields that are only required when another field
// has a specific value. This is the CORE of conditional validation.
//
// WHY WE USE Yup.test() INSTEAD OF Yup.when():
// - Yup.when() only works for SIBLING fields (same nesting level)
// - Yup.test() gives us access to `this.from` which has ALL parent contexts
// - This allows us to check fields at ANY level of nesting
//
// EXAMPLE:
// Field: returnPolicy.returnShippingFeesAmount.value (deeply nested)
// DependsOn: returnPolicy.fees = "paid" (one level up)
//
// With Yup.when() - ❌ DOESN'T WORK (can't access parent's sibling)
// With Yup.test() - ✅ WORKS (we climb up to root and navigate down to fees)
//
// =============================================================================
const createDependOnSchema = (field) => {
  return Yup.mixed().test({
    // Test name for debugging purposes
    name: "conditional-required",
    // Default error message if validation fails
    message: field.errormsg || "This field is required",

    // The actual validation function
    // IMPORTANT: Must use `function()` not arrow function to access `this`
    test: function (value) {
      try {
        // -----------------------------------------------------------------------
        // STEP 1: Get the root form values
        // This gives us access to ALL form fields regardless of nesting
        // -----------------------------------------------------------------------
        const rootValues = getRootFormValues(this);

        // -----------------------------------------------------------------------
        // STEP 2: Handle case where we can't get root values
        // Try to fall back to parent for same-level dependencies
        // -----------------------------------------------------------------------
        if (!rootValues) {
          if (this.parent) {
            // Try to find the source field in parent
            // First try full path, then try just the field name
            const sourceValue =
              getNestedValue(this.parent, field.dependOn.name) ??
              getNestedValue(this.parent, field.dependOn.name.split(".").pop());

            if (sourceValue !== undefined) {
              // Check if condition is met
              const conditionMet = checkDependOnCondition(sourceValue, field.dependOn.value);

              // Condition NOT met → field is optional → pass validation
              if (!conditionMet) return true;

              // Condition IS met → check if field has value
              const isEmpty =
                value === undefined ||
                value === null ||
                value === "" ||
                (Array.isArray(value) && value.length === 0);

              // Return true if has value (valid), false if empty (invalid)
              return !isEmpty;
            }
          }
          // Can't determine condition → allow the value (fail-safe)
          return true;
        }

        // -----------------------------------------------------------------------
        // STEP 3: Get the value of the field we depend on
        // Uses the full path like "returnPolicy.fees" from root form values
        // -----------------------------------------------------------------------
        const sourceValue = getNestedValue(rootValues, field.dependOn.name);

        // -----------------------------------------------------------------------
        // STEP 4: Check if the dependency condition is met
        // Example: Is fees === "paid"?
        // -----------------------------------------------------------------------
        const conditionMet = checkDependOnCondition(sourceValue, field.dependOn.value);

        // -----------------------------------------------------------------------
        // STEP 5: If condition NOT met, field is OPTIONAL
        // User doesn't need to fill it → validation passes
        // Example: fees = "free" → returnShippingFeesAmount is optional
        // -----------------------------------------------------------------------
        if (!conditionMet) {
          return true;
        }

        // -----------------------------------------------------------------------
        // STEP 6: Condition IS MET - field is REQUIRED
        // Check if the field has a value
        // -----------------------------------------------------------------------
        const isEmpty =
          value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

        // If empty, create an error with the field's error message
        if (isEmpty) {
          return this.createError({
            message: field.errormsg || "This field is required",
          });
        }

        // -----------------------------------------------------------------------
        // STEP 7: Additional type-specific validation
        // Even if field has value, check format for special types
        // -----------------------------------------------------------------------

        // Email format validation
        if (field.type === "email" && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(value))) {
            return this.createError({ message: "Invalid email" });
          }
        }

        // Number format validation
        if (field.type === "number" && value != null && value !== "") {
          if (isNaN(Number(value))) {
            return this.createError({ message: "Must be a number" });
          }
        }

        // -----------------------------------------------------------------------
        // STEP 8: All checks passed - validation successful!
        // -----------------------------------------------------------------------
        return true;
      } catch (error) {
        // If anything fails, allow the value to prevent form from crashing
        // Log warning for debugging but don't block the user
        return true;
      }
    },
  });
};

// =============================================================================
// MAIN FUNCTION: CreateValidationSchema
// Creates complete Yup validation schema from form field definitions
// =============================================================================
//
// PURPOSE:
// This is the main entry point. It takes an array of field definitions (from
// schema mock files like ProductMerchantSchema.mock.jsx) and converts them into
// a Yup validation schema that Formik can use.
//
// PARAMETERS:
// - formFields: Array of field definitions from schema mock files
// - parentPath: Current path in nested structure (used internally for recursion)
//
// RETURNS: Yup.object().shape({...}) - A complete validation schema
//
// WHAT IT HANDLES:
// 1. Regular fields (validated: true) → Required validation
// 2. Fields with dependOn → Conditional validation (createDependOnSchema)
// 3. Nested arrays → Recursive validation of array items
// 4. Nested objects → Recursive validation of object properties
// 5. Groups → Flattens UI groups, merges their fields into current level
//
// EXAMPLE INPUT (simplified):
// [
//   { name: "email", type: "email", validated: true },
//   { name: "address", nested: "object", subfields: [
//       { name: "city", validated: true },
//       { name: "zip", validated: true }
//   ]},
//   { name: "fees", validated: true, dependOn: { name: "type", value: "paid" }}
// ]
//
// EXAMPLE OUTPUT (Yup schema structure):
// Yup.object().shape({
//   email: Yup.string().email().required(),
//   address: Yup.object().shape({
//     city: Yup.string().required(),
//     zip: Yup.string().required()
//   }),
//   fees: Yup.mixed().test(...) // Conditional validation
// })
//
// =============================================================================
const CreateValidationSchema = (formFields, parentPath = "") => {
  // Safety check - return empty schema if no fields provided
  if (!formFields || !Array.isArray(formFields)) {
    return Yup.object().shape({});
  }

  // -------------------------------------------------------------------------
  // STEP 1: Flatten group fields
  // Groups are UI-only containers (for layout) - they don't affect data structure
  // Their children should be validated at the same level as the group
  // -------------------------------------------------------------------------
  const flattenedFields = flattenFields(formFields);

  // -------------------------------------------------------------------------
  // STEP 2: Build the schema object by processing each field
  // Uses reduce to accumulate field schemas into a single object
  // -------------------------------------------------------------------------
  const schema = flattenedFields.reduce((acc, field) => {
    let fieldSchema;

    try {
      // =====================================================================
      // CASE 1: Regular validated field (not nested)
      // These are simple input fields like text, email, number, select, etc.
      // Skip checkboxes - they don't need validation (always boolean true/false)
      // =====================================================================
      if (
        !field.nested &&
        field.validated &&
        field.type !== "video" &&
        field.type !== "fileUpload" &&
        field.type !== "checkbox"
      ) {
        if (field.dependOn && field.dependOn.name) {
          // HAS DEPENDENCY: Use custom test-based validation
          // This allows checking fields at any nesting level
          fieldSchema = createDependOnSchema(field);
        } else {
          // NO DEPENDENCY: Simple required validation based on field type
          fieldSchema = validateField(field, true);
        }
      }

      // =====================================================================
      // CASE 2: Nested array field
      // Example: workingDays: [{ opens: "9:00", closes: "17:00" }, ...]
      // Each item in the array must match the subfield schema
      // =====================================================================
      if (field.nested === "array" && field.subfields) {
        // Build the path for nested fields (for debugging/tracking)
        const nestedPath = parentPath ? `${parentPath}.${field.name}` : field.name;

        // RECURSIVELY create schema for array items
        const subSchema = CreateValidationSchema(field.subfields, nestedPath);

        // Wrap in Yup.array().of() - each item must match subSchema
        fieldSchema = Yup.array().of(subSchema);
      }

      // =====================================================================
      // CASE 3: Nested object field
      // Example: returnPolicy: { fees: "paid", method: "mail" }
      // Object's properties are validated according to subfields
      // =====================================================================
      else if (field.nested === "object" && field.subfields) {
        // Build the path for nested fields
        const nestedPath = parentPath ? `${parentPath}.${field.name}` : field.name;

        // RECURSIVELY create schema for the nested object
        // This returns a Yup.object().shape({...})
        fieldSchema = CreateValidationSchema(field.subfields, nestedPath);
      }

      // =====================================================================
      // CASE 4: Group field (UI-only container)
      // Groups are for layout only - their fields merge into parent level
      // This is handled by flattenFields, but we double-check here
      // =====================================================================
      else if (field.nested === "group" && field.subfields) {
        // Create schema for group's subfields
        const groupSchema = CreateValidationSchema(field.subfields, parentPath);

        // Merge group's fields into current accumulator (same level)
        if (groupSchema?.fields) {
          return { ...acc, ...groupSchema.fields };
        }
        return acc;
      }

      // =====================================================================
      // FINAL: Add field schema to accumulator
      // Only add if we created a schema and field has a name
      // =====================================================================
      if (fieldSchema && field.name) {
        return { ...acc, [field.name]: fieldSchema };
      }

      return acc;
    } catch (error) {
      // Log error but don't crash - continue processing other fields
      return acc;
    }
  }, {});

  // -------------------------------------------------------------------------
  // STEP 3: Wrap the accumulated schema object in Yup.object().shape()
  // This creates the final Yup schema that Formik will use
  // -------------------------------------------------------------------------
  return Yup.object().shape(schema);
};

export default CreateValidationSchema;

// =============================================================================
// TESTING SECTION - Validation Schema Test Suite
// =============================================================================
//
// PURPOSE:
// Test the CreateValidationSchema function with various field configurations
// to ensure validation works correctly for all scenarios
//
// HOW TO RUN TESTS:
// 1. Uncomment the test section below
// 2. Open browser console
// 3. Check console.log outputs for test results
// 4. All tests should show "✅ PASS" for successful validation
//
// =============================================================================

/* UNCOMMENT TO RUN TESTS

// =============================================================================
// TEST 1: Simple Field Validation (No dependOn)
// =============================================================================
const testSimpleValidation = () => {
  console.log("\n🧪 TEST 1: Simple Field Validation");

  const fields = [
    {
      id: "title",
      name: "title",
      label: "Title",
      validated: true,
      type: "text",
      errormsg: "Title is required",
    },
    {
      id: "email",
      name: "email",
      label: "Email",
      validated: true,
      type: "email",
      errormsg: "Email is required",
    },
  ];

  const schema = CreateValidationSchema(fields);

  // Test Case 1.1: Valid data
  schema
    .validate({ title: "My Title", email: "test@example.com" })
    .then(() => console.log("✅ PASS: Valid data accepted"))
    .catch(() => console.log("❌ FAIL: Valid data rejected"));

  // Test Case 1.2: Missing required field
  schema
    .validate({ title: "" })
    .then(() => console.log("❌ FAIL: Missing field accepted"))
    .catch((err) => console.log("✅ PASS: Missing field rejected -", err.message));

  // Test Case 1.3: Invalid email format
  schema
    .validate({ title: "My Title", email: "invalid-email" })
    .then(() => console.log("❌ FAIL: Invalid email accepted"))
    .catch((err) => console.log("✅ PASS: Invalid email rejected -", err.message));
};

// =============================================================================
// TEST 2: Simple dependOn Validation (Same Level)
// =============================================================================
const testSimpleDependOn = () => {
  console.log("\n🧪 TEST 2: Simple dependOn Validation");

  const fields = [
    {
      id: "metaTagsType",
      name: "metaTagsType",
      label: "Meta Tags Type",
      validated: true,
      type: "select",
      errormsg: "Select a type",
      options: [
        { label: "Manual", value: "manualMeta" },
        { label: "AI", value: "aiMeta" },
      ],
    },
    {
      id: "language",
      name: "language",
      label: "Language",
      validated: true,
      type: "select",
      dependOn: {
        name: "metaTagsType",
        value: "aiMeta",
      },
      errormsg: "Language is required",
    },
  ];

  const schema = CreateValidationSchema(fields);

  // Test Case 2.1: Condition NOT met - field should be optional
  schema
    .validate({ metaTagsType: "manualMeta", language: "" })
    .then(() => console.log("✅ PASS: Field optional when condition not met"))
    .catch((err) => console.log("❌ FAIL: Field required when should be optional -", err.message));

  // Test Case 2.2: Condition met + field filled - should pass
  schema
    .validate({ metaTagsType: "aiMeta", language: "English" })
    .then(() => console.log("✅ PASS: Field validated when condition met and filled"))
    .catch(() => console.log("❌ FAIL: Valid data rejected"));

  // Test Case 2.3: Condition met + field empty - should fail
  schema
    .validate({ metaTagsType: "aiMeta", language: "" })
    .then(() => console.log("❌ FAIL: Empty field accepted when condition met"))
    .catch((err) => console.log("✅ PASS: Empty field rejected when condition met -", err.message));
};

// =============================================================================
// TEST 3: Nested Object with dependOn
// =============================================================================
const testNestedObjectDependOn = () => {
  console.log("\n🧪 TEST 3: Nested Object with dependOn");

  const fields = [
    {
      id: "rule",
      name: "rule",
      nested: "object",
      subfields: [
        {
          id: "metaTagsSettings",
          name: "metaTagsSettings",
          nested: "object",
          subfields: [
            {
              id: "metaTagsType",
              name: "metaTagsType",
              validated: true,
              type: "select",
              errormsg: "Select a type",
            },
            {
              id: "input",
              name: "input",
              nested: "object",
              subfields: [
                {
                  id: "language",
                  name: "language",
                  validated: true,
                  type: "select",
                  dependOn: {
                    name: "rule.metaTagsSettings.metaTagsType",
                    value: "aiMeta",
                  },
                  errormsg: "Language is required",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const schema = CreateValidationSchema(fields);

  // Test Case 3.1: Cross-nested dependency - condition NOT met
  schema
    .validate({
      rule: {
        metaTagsSettings: {
          metaTagsType: "manualMeta",
          input: { language: "" },
        },
      },
    })
    .then(() => console.log("✅ PASS: Nested field optional when condition not met"))
    .catch((err) => console.log("❌ FAIL: Nested field required when should be optional -", err.message));

  // Test Case 3.2: Cross-nested dependency - condition met + filled
  schema
    .validate({
      rule: {
        metaTagsSettings: {
          metaTagsType: "aiMeta",
          input: { language: "English" },
        },
      },
    })
    .then(() => console.log("✅ PASS: Nested field validated correctly"))
    .catch(() => console.log("❌ FAIL: Valid nested data rejected"));

  // Test Case 3.3: Cross-nested dependency - condition met + empty
  schema
    .validate({
      rule: {
        metaTagsSettings: {
          metaTagsType: "aiMeta",
          input: { language: "" },
        },
      },
    })
    .then(() => console.log("❌ FAIL: Empty nested field accepted"))
    .catch((err) => console.log("✅ PASS: Empty nested field rejected -", err.message));
};

// =============================================================================
// TEST 4: Array dependOn Value (OR condition)
// =============================================================================
const testArrayDependOnValue = () => {
  console.log("\n🧪 TEST 4: Array dependOn Value (OR condition)");

  const fields = [
    {
      id: "paymentType",
      name: "paymentType",
      validated: true,
      type: "select",
      errormsg: "Select payment type",
    },
    {
      id: "amount",
      name: "amount",
      validated: true,
      type: "number",
      dependOn: {
        name: "paymentType",
        value: ["paid", "partial", "installment"], // OR condition
      },
      errormsg: "Amount is required",
    },
  ];

  const schema = CreateValidationSchema(fields);

  // Test Case 4.1: Matches first value in array
  schema
    .validate({ paymentType: "paid", amount: 100 })
    .then(() => console.log("✅ PASS: Array dependOn - first value match"))
    .catch(() => console.log("❌ FAIL: Valid data rejected"));

  // Test Case 4.2: Matches middle value in array
  schema
    .validate({ paymentType: "partial", amount: 50 })
    .then(() => console.log("✅ PASS: Array dependOn - middle value match"))
    .catch(() => console.log("❌ FAIL: Valid data rejected"));

  // Test Case 4.3: Doesn't match any value - should be optional
  schema
    .validate({ paymentType: "free", amount: "" })
    .then(() => console.log("✅ PASS: Array dependOn - no match, field optional"))
    .catch((err) => console.log("❌ FAIL: Field required when no match -", err.message));

  // Test Case 4.4: Matches but empty - should fail
  schema
    .validate({ paymentType: "installment", amount: "" })
    .then(() => console.log("❌ FAIL: Empty field accepted"))
    .catch((err) => console.log("✅ PASS: Array dependOn - match with empty value rejected -", err.message));
};

// =============================================================================
// TEST 5: MultiSelect Field dependOn
// =============================================================================
const testMultiSelectDependOn = () => {
  console.log("\n🧪 TEST 5: MultiSelect Field dependOn");

  const fields = [
    {
      id: "features",
      name: "features",
      validated: true,
      type: "multiSelect",
      errormsg: "Select at least one feature",
    },
    {
      id: "customMessage",
      name: "customMessage",
      validated: true,
      type: "text",
      dependOn: {
        name: "features",
        value: "customBranding", // Check if "customBranding" is selected
      },
      errormsg: "Custom message is required",
    },
  ];

  const schema = CreateValidationSchema(fields);

  // Test Case 5.1: MultiSelect contains dependOn value
  schema
    .validate({ features: ["basicFeatures", "customBranding"], customMessage: "My Brand" })
    .then(() => console.log("✅ PASS: MultiSelect dependOn - value found"))
    .catch(() => console.log("❌ FAIL: Valid data rejected"));

  // Test Case 5.2: MultiSelect doesn't contain dependOn value
  schema
    .validate({ features: ["basicFeatures", "analytics"], customMessage: "" })
    .then(() => console.log("✅ PASS: MultiSelect dependOn - value not found, field optional"))
    .catch((err) => console.log("❌ FAIL: Field required when value not in array -", err.message));

  // Test Case 5.3: MultiSelect contains value but field empty
  schema
    .validate({ features: ["customBranding"], customMessage: "" })
    .then(() => console.log("❌ FAIL: Empty field accepted"))
    .catch((err) => console.log("✅ PASS: MultiSelect dependOn - value found but field empty -", err.message));
};

// =============================================================================
// TEST 6: Group Flattening
// =============================================================================
const testGroupFlattening = () => {
  console.log("\n🧪 TEST 6: Group Flattening");

  const fields = [
    {
      nested: "group",
      groupSize: 2,
      subfields: [
        {
          id: "firstName",
          name: "firstName",
          validated: true,
          type: "text",
          errormsg: "First name is required",
        },
        {
          id: "lastName",
          name: "lastName",
          validated: true,
          type: "text",
          errormsg: "Last name is required",
        },
      ],
    },
    {
      id: "email",
      name: "email",
      validated: true,
      type: "email",
      errormsg: "Email is required",
    },
  ];

  const schema = CreateValidationSchema(fields);

  // Test Case 6.1: All fields at same level (group flattened)
  schema
    .validate({ firstName: "John", lastName: "Doe", email: "john@example.com" })
    .then(() => console.log("✅ PASS: Group fields flattened correctly"))
    .catch(() => console.log("❌ FAIL: Group fields not flattened"));

  // Test Case 6.2: Missing field in group
  schema
    .validate({ firstName: "John", lastName: "", email: "john@example.com" })
    .then(() => console.log("❌ FAIL: Missing group field accepted"))
    .catch((err) => console.log("✅ PASS: Missing group field rejected -", err.message));
};

// =============================================================================
// TEST 7: Real MetaAutomation Scenario
// =============================================================================
const testMetaAutomationScenario = () => {
  console.log("\n🧪 TEST 7: Real MetaAutomation Scenario");

  const fields = [
    {
      id: "rule",
      name: "rule",
      nested: "object",
      subfields: [
        {
          id: "metaTagsSettings",
          name: "metaTagsSettings",
          nested: "object",
          subfields: [
            {
              id: "metaTagsGeneration",
              name: "metaTagsGeneration",
              type: "checkbox",
            },
            {
              id: "metaTagsType",
              name: "metaTagsType",
              validated: true,
              type: "select",
              errormsg: "Select meta tags type",
            },
            // Manual Meta fields
            {
              id: "title",
              name: "title",
              validated: true,
              type: "text",
              dependOn: {
                name: "rule.metaTagsSettings.metaTagsType",
                value: "manualMeta",
              },
              errormsg: "Title is required",
            },
            // AI Meta fields
            {
              id: "input",
              name: "input",
              nested: "object",
              subfields: [
                {
                  id: "language",
                  name: "language",
                  validated: true,
                  type: "select",
                  dependOn: {
                    name: "rule.metaTagsSettings.metaTagsType",
                    value: "aiMeta",
                  },
                  errormsg: "Language is required",
                },
              ],
            },
          ],
        },
        {
          id: "aiDescriptionSettings",
          name: "aiDescriptionSettings",
          nested: "object",
          subfields: [
            {
              id: "aiDescription",
              name: "aiDescription",
              type: "checkbox",
            },
            {
              id: "language",
              name: "language",
              validated: true,
              type: "select",
              dependOn: {
                name: "rule.aiDescriptionSettings.aiDescription",
                value: true,
              },
              errormsg: "Language is required",
            },
          ],
        },
      ],
    },
  ];

  const schema = CreateValidationSchema(fields);

  // Test Case 7.1: Manual Meta selected, AI Description unchecked
  schema
    .validate({
      rule: {
        metaTagsSettings: {
          metaTagsGeneration: true,
          metaTagsType: "manualMeta",
          title: "My Title",
          input: { language: "" }, // AI field - should be ignored
        },
        aiDescriptionSettings: {
          aiDescription: false,
          language: "", // Unchecked - should be ignored
        },
      },
    })
    .then(() => console.log("✅ PASS: Manual Meta validates, AI fields ignored"))
    .catch((err) => console.log("❌ FAIL: Hidden fields validated -", err.message));

  // Test Case 7.2: AI Meta selected, AI Description checked, both empty
  schema
    .validate({
      rule: {
        metaTagsSettings: {
          metaTagsGeneration: true,
          metaTagsType: "aiMeta",
          title: "", // Manual field - should be ignored
          input: { language: "" }, // AI field - should validate
        },
        aiDescriptionSettings: {
          aiDescription: true,
          language: "", // Checked - should validate
        },
      },
    })
    .then(() => console.log("❌ FAIL: Empty required fields accepted"))
    .catch((err) => console.log("✅ PASS: Multiple dependOn fields validated -", err.message));

  // Test Case 7.3: Switching from AI to Manual (real edit scenario)
  schema
    .validate({
      rule: {
        metaTagsSettings: {
          metaTagsGeneration: true,
          metaTagsType: "manualMeta",
          title: "My Manual Title",
          input: undefined, // Old AI fields cleared
        },
        aiDescriptionSettings: {
          aiDescription: false,
          language: "",
        },
      },
    })
    .then(() => console.log("✅ PASS: Switch from AI to Manual works"))
    .catch((err) => console.log("❌ FAIL: Old AI fields still validated -", err.message));
};

// =============================================================================
// RUN ALL TESTS
// =============================================================================
console.log("========================================");
console.log("🧪 VALIDATION SCHEMA TEST SUITE");
console.log("========================================");

testSimpleValidation();
testSimpleDependOn();
testNestedObjectDependOn();
testArrayDependOnValue();
testMultiSelectDependOn();
testGroupFlattening();
testMetaAutomationScenario();

console.log("\n========================================");
console.log("✅ ALL TESTS COMPLETED");
console.log("========================================");
console.log("Check results above for PASS/FAIL status");

END OF TESTING SECTION */
