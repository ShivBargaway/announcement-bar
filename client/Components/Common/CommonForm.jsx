import React, { useCallback, useContext, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  BlockStack,
  Box,
  Card,
  Collapsible,
  Divider,
  FormLayout,
  Icon,
  InlineStack,
  Link,
  Text,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronRightIcon, DragHandleIcon } from "@shopify/polaris-icons";
import { Field, FieldArray, Formik } from "formik";
import { t } from "i18next";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import { ToastContext } from "@/Context/ToastContext";
import { getValueFromNestedObject } from "@/Utils/Index";
import CreateValidationSchema from "./CreateValidationSchema";
import { Add, Delete, DynamicSection, FormField, SaveButton } from "./FormComponent";

const dependOnField = ({ field, values }) => {
  if (!field?.dependOn?.type) {
    return field;
  }
  delete field?.disabled;
  delete field?.hide;
  const dependOnType = field.dependOn.type;
  let fieldsValues = values;
  const dependencyFiledValue = getValueFromNestedObject(fieldsValues, field.dependOn.name);
  let valueMatch = false;
  if (Array.isArray(field.dependOn.value)) {
    for (let value of field.dependOn.value) {
      if (Array.isArray(dependencyFiledValue)) {
        valueMatch = dependencyFiledValue.includes(value);
        break;
      } else {
        if (dependencyFiledValue === value) {
          valueMatch = true;
          break;
        }
      }
    }
  } else {
    if (Array.isArray(dependencyFiledValue)) {
      valueMatch = dependencyFiledValue.includes(field.dependOn.value);
    } else {
      if (field.dependOn.value === "isNotEmpty") {
        valueMatch = dependencyFiledValue ? true : false;
      } else {
        valueMatch = dependencyFiledValue === field.dependOn.value;
      }
    }
  }

  if (dependOnType === "hidden") {
    if (!valueMatch) field.hide = true;
  } else if (dependOnType === "disabled") {
    field.disabled = valueMatch;
  }
  return field;
};

const dependOnFields = ({ fields, values }) => {
  fields.map((field) => {
    field = dependOnField({ field, values });
  });
  return fields;
};

const CommonRenderComponent = ({ field, commonProps, arrayElementIndex, children, values, hideArrayLabel }) => {
  field.groupSize = field.groupSize ? field.groupSize : 2;
  field.newFields = [
    ...dependOnFields({ fields: field.subfields, values: values }).filter((field) => !field.hide),
  ];

  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(!field?.hideInitially);
  const toggleCollapsible = () => setIsCollapsibleOpen(!isCollapsibleOpen);
  const hideChildren = field?.showObjectCollapsible ? !isCollapsibleOpen : false;

  return (
    <React.Fragment key={field.id}>
      <BlockStack gap="200">
        <InlineStack align="space-between" blockAlign="center">
          {field.label &&
            !hideArrayLabel &&
            (field?.showObjectCollapsible ? (
              <Link monochrome removeUnderline onClick={toggleCollapsible}>
                <Text as="p" variant={"headingMd"}>
                  {field.label}
                </Text>
              </Link>
            ) : (
              <Text as="p">{field.label}</Text>
            ))}
          {field?.showObjectCollapsible && (
            <Link monochrome removeUnderline onClick={toggleCollapsible}>
              <Icon source={isCollapsibleOpen ? ChevronDownIcon : ChevronRightIcon} />
            </Link>
          )}
        </InlineStack>

        {!hideChildren && (
          <DynamicSection field={field} key={field.name + arrayElementIndex}>
            <FormLayout>
              {[...Array(Math.ceil(field?.newFields?.length / field?.groupSize))].map((_, gIndex) => (
                <FormLayout.Group key={gIndex} condensed>
                  {field?.newFields
                    ?.slice(gIndex * field.groupSize, gIndex * field.groupSize + field.groupSize)
                    .map((subfield, index) => {
                      return React.cloneElement(children, {
                        field: subfield,
                        key: `${commonProps.id}[${arrayElementIndex}].${subfield.name}-${index}`,
                      });
                    })}
                </FormLayout.Group>
              ))}
            </FormLayout>
          </DynamicSection>
        )}
        {!hideChildren && field.helpText && (
          <Text as="p" tone="subdued" variant="bodySm">
            {field.helpText}
          </Text>
        )}
        {hideChildren && field?.showDividerInCollapsible && <Divider />}
      </BlockStack>
    </React.Fragment>
  );
};

const CollapsibleFieldArrayItem = ({
  field,
  index,
  commonProps,
  values,
  errors,
  touched,
  remove,
  openCollapsible,
  closeCollapsible,
  checkOpenCollapsible,
  showErrorWarning,
  provided,
}) => {
  return (
    <Card>
      <BlockStack gap={200}>
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap={100}>
            {field?.allowDrag && (
              <div ref={provided.innerRef} {...provided.dragHandleProps}>
                <Icon source={DragHandleIcon} color="#FFFFFF" tone="info" />
              </div>
            )}
            <Link
              monochrome
              removeUnderline
              onClick={() => (checkOpenCollapsible(index) ? closeCollapsible(index) : openCollapsible(index))}
            >
              <InlineStack gap={100}>
                {field?.staticLabel && <Text fontWeight="bold">{field?.staticLabel}</Text>}
                {eval(field.CollapsibleLabel) && <Text fontWeight="bold">{eval(field?.CollapsibleLabel)}</Text>}
              </InlineStack>
            </Link>
            {showErrorWarning(index) && <Text variant="critical">Missing required field.</Text>}
          </InlineStack>
          <InlineStack gap={100}>
            {!field.hideDeletebtn && <Delete {...field} index={index} remove={remove} />}
            <Link
              monochrome
              removeUnderline
              onClick={() => (checkOpenCollapsible(index) ? closeCollapsible(index) : openCollapsible(index))}
            >
              <Icon source={checkOpenCollapsible(index) ? ChevronDownIcon : ChevronRightIcon} />
            </Link>
          </InlineStack>
        </InlineStack>
        <Collapsible
          open={checkOpenCollapsible(index)}
          id="basic-collapsible"
          transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <CommonRenderComponent
            field={field}
            arrayElementIndex={index}
            values={values[field.name]?.[index] ? values[field.name][index] : {}}
            commonProps={commonProps}
            hideArrayLabel={true}
          >
            <MainComponent
              {...commonProps}
              name={`${commonProps.name}[${index}]`}
              id={`${commonProps.id}[${index}]`}
              values={values[field.name]?.[index] ? values[field.name][index] : {}}
              errors={errors[field.name]?.[index] ? errors[field.name][index] : {}}
              touched={touched[field.name]?.[index] ? touched[field.name][index] : {}}
              index={index}
            />
          </CommonRenderComponent>
        </Collapsible>
      </BlockStack>
    </Card>
  );
};

const NonCollapsibleFieldArrayItem = ({
  field,
  index,
  commonProps,
  values,
  errors,
  touched,
  remove,
  provided,
}) => {
  return (
    <BlockStack gap={100}>
      <InlineStack align="space-between" blockAlign="center">
        {field?.label && (
          <InlineStack gap={200}>
            {field?.allowDrag && (
              <div ref={provided.innerRef} {...provided.dragHandleProps}>
                <Icon source={DragHandleIcon} color="#FFFFFF" tone="info" />
              </div>
            )}
            <Text>
              {field?.label} - {index + 1}
            </Text>
          </InlineStack>
        )}
        {!field.hideDeletebtn && <Delete {...field} index={index} remove={remove} />}
      </InlineStack>
      <CommonRenderComponent
        field={field}
        arrayElementIndex={index}
        commonProps={commonProps}
        values={values[field.name]?.[index] ? values[field.name][index] : {}}
        hideArrayLabel={true}
      >
        <MainComponent
          {...commonProps}
          name={`${commonProps.name}[${index}]`}
          id={`${commonProps.id}[${index}]`}
          values={values[field.name]?.[index] ? values[field.name][index] : {}}
          errors={errors[field.name]?.[index] ? errors[field.name][index] : {}}
          touched={touched[field.name]?.[index] ? touched[field.name][index] : {}}
        />
      </CommonRenderComponent>
      <Text></Text>
      <Text></Text>
    </BlockStack>
  );
};

const FieldArrayItem = ({
  field,
  index,
  commonProps,
  values,
  errors,
  touched,
  remove,
  openCollapsible,
  closeCollapsible,
  checkOpenCollapsible,
  showErrorWarning,
  provided,
}) => {
  return (
    <div key={field.name + index}>
      {field?.showCollapsible ? (
        <CollapsibleFieldArrayItem
          field={field}
          index={index}
          commonProps={commonProps}
          values={values}
          errors={errors}
          touched={touched}
          remove={remove}
          openCollapsible={openCollapsible}
          closeCollapsible={closeCollapsible}
          checkOpenCollapsible={checkOpenCollapsible}
          showErrorWarning={showErrorWarning}
          provided={provided}
        />
      ) : (
        <NonCollapsibleFieldArrayItem
          field={field}
          index={index}
          commonProps={commonProps}
          values={values}
          errors={errors}
          touched={touched}
          remove={remove}
          provided={provided}
        />
      )}
    </div>
  );
};

const FieldArrayComponent = ({ field, commonProps, values, errors, touched }) => {
  field.groupSize = field.groupSize ? field.groupSize : 2;

  const [selectedIds, setSelectedIds] = useState([]);
  const [closeIndex, setCloseIndex] = useState();

  const openCollapsible = useCallback(
    (index) => {
      if (index === closeIndex) setCloseIndex(undefined);
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, index]);
    },
    [closeIndex]
  );

  const closeCollapsible = (index) => {
    setSelectedIds((prev) => prev.filter((id) => id !== index));
    setCloseIndex(index);
  };

  const checkOpenCollapsible = useCallback(
    (index) => {
      const arrayLength = values[field.name]?.length - 1;
      return (index === arrayLength || selectedIds.includes(index)) && closeIndex !== index;
    },
    [selectedIds, values, closeIndex, field.name]
  );

  const showErrorWarning = useCallback(
    (index) => {
      return !!(errors[field.name]?.[index] && touched[field.name]?.[index]);
    },
    [errors, touched, field.name]
  );

  const upDragValue = ({ values, field, source, destination }) => {
    if (values[field.name]) {
      const newItems = Array.from(values[field.name]);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      values[field.name] = newItems;
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source?.index === destination?.index) return;

    upDragValue({ values: values, field, source, destination });
    upDragValue({ values: errors, field, source, destination });
    upDragValue({ values: touched, field, source, destination });
  };

  return (
    <FieldArray key={field.id} name={commonProps.name}>
      {({ push, remove }) => (
        <React.Fragment key={field.id}>
          <BlockStack gap="200">
            {field.label && <Text fontWeight="bold">{field.label}</Text>}

            {field?.allowDrag ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="navigation">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <BlockStack gap="200">
                        {values[field.name]?.map((nestedItem, index) => (
                          <Draggable key={field.name + index} draggableId={field.name + index} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps}>
                                <Box padding={200}>
                                  <FieldArrayItem
                                    key={field.name + index}
                                    field={field}
                                    index={index}
                                    commonProps={commonProps}
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    remove={remove}
                                    openCollapsible={openCollapsible}
                                    closeCollapsible={closeCollapsible}
                                    checkOpenCollapsible={checkOpenCollapsible}
                                    showErrorWarning={showErrorWarning}
                                    provided={provided}
                                  />
                                </Box>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </BlockStack>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              values[field.name]?.map((nestedItem, index) => (
                <FieldArrayItem
                  key={field.name + index}
                  field={field}
                  index={index}
                  commonProps={commonProps}
                  values={values}
                  errors={errors}
                  touched={touched}
                  remove={remove}
                  openCollapsible={openCollapsible}
                  closeCollapsible={closeCollapsible}
                  checkOpenCollapsible={checkOpenCollapsible}
                  showErrorWarning={showErrorWarning}
                />
              ))
            )}

            {!field.hideAddbtn && <Add {...field} push={push} />}
          </BlockStack>
        </React.Fragment>
      )}
    </FieldArray>
  );
};

const MainComponent = (props) => {
  const { name, id, field, errors, values, touched, originalFormValues, index } = props;
  let commonProps = {};
  if (field.name) {
    commonProps = {
      id: name ? `${name}.${field.id}` : field.id,
      name: name ? `${name}.${field.name}` : field.name,
      key: name ? `${name}.${field.name}` : field.name,
    };
  } else {
    commonProps = { id: name, name: name, key: name };
  }
  if (!field.nested) {
    return (
      <Field
        field={{ ...field, ...commonProps, index }}
        component={FormField}
        currentObj={values}
        value={values[field.name]}
        error={errors[field.name]}
        touch={touched[field.name]}
        key={field.name}
      />
    );
  } else if (field.nested === "array") {
    return (
      <FieldArrayComponent
        field={field}
        commonProps={commonProps}
        values={values}
        errors={errors}
        touched={touched}
        index={index}
      />
    );
  } else if (field.nested === "object") {
    return (
      <CommonRenderComponent field={field} commonProps={commonProps} values={originalFormValues || values}>
        <MainComponent
          {...commonProps}
          index={index}
          originalFormValues={originalFormValues || values}
          values={values[field.name] ? values[field.name] : {}}
          errors={errors[field.name] ? errors[field.name] : {}}
          touched={touched[field.name] ? touched[field.name] : {}}
        />
      </CommonRenderComponent>
    );
  } else if (field.nested === "group") {
    return (
      <CommonRenderComponent field={field} commonProps={commonProps} values={originalFormValues || values}>
        <MainComponent
          {...commonProps}
          index={index}
          originalFormValues={originalFormValues || values}
          values={values ? values : {}}
          errors={errors ? errors : {}}
          touched={touched ? touched : {}}
        />
      </CommonRenderComponent>
    );
  }
};

const CommonForm = ({
  formFields,
  initialValues,
  onSubmit,
  onFormChange,
  formRef,
  isSave,
  isPremium,
  noValueChanged = true,
  noCompare = true,
  label,
  enableReinitialize,
  premiumFeatureName,
  buttonVariant,
}) => {
  const validationSchema = CreateValidationSchema(formFields);
  const { showToast } = useContext(ToastContext);

  return (
    <Formik
      enableReinitialize={enableReinitialize || false}
      initialValues={cloneDeep(initialValues)}
      onSubmit={(values, formikBag) => {
        if (noValueChanged && isEqual(values, initialValues)) {
          showToast(t("common.No values are changed. Try changing values."));
        } else {
          onSubmit(values);
        }
      }}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {({ values, handleSubmit, errors, touched, setFieldValue }) => {
        {
          onFormChange &&
            useEffect(() => {
              if (noCompare && isEqual(values, initialValues)) return;
              onFormChange(values);
            }, [values]);
        }
        return (
          <form onSubmit={handleSubmit}>
            <FormLayout>
              {formFields.map((field, index) => {
                field = dependOnField({ field, values });
                if (!field?.hide) {
                  return (
                    <MainComponent field={field} values={values} errors={errors} touched={touched} key={index} />
                  );
                }
              })}
              <SaveButton
                isSave={isSave}
                isPremium={isPremium}
                label={label}
                buttonVariant={buttonVariant}
                premiumFeatureName={premiumFeatureName}
              />
            </FormLayout>
          </form>
        );
      }}
    </Formik>
  );
};

export default CommonForm;
