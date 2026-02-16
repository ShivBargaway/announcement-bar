import React, { lazy, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  ChoiceList,
  FormLayout,
  Icon,
  Image,
  InlineError,
  InlineStack,
  Popover,
  RadioButton,
  RangeSlider,
  Select,
  Text,
  TextField,
  Thumbnail,
  Tooltip,
} from "@shopify/polaris";
import { DeleteIcon, PlusIcon, ProductIcon } from "@shopify/polaris-icons";
import { Field, FieldArray, useFormikContext } from "formik";
import { t } from "i18next";
import { PremiumSvg } from "@/Assets/Index";
import { navigate } from "@/Components/Common/NavigationMenu";
import { ProfileContext } from "@/Context/ProfileContext";
import { isObject } from "@/Utils/Index";
import MetaTinyEditor from "./MetaTinyEditor/MetaTinyEditor";
import { PremiumButton } from "./PremiumBadge";
import VideoPopup from "./VideoPopup";

const Codemirror = lazy(() => import("./CodeMirror"));
const ColorPickerCircle = lazy(() => import("./ColorPicker"));
const CustomSelector = lazy(() => import("./CustomSelector"));
const EditorComponent = lazy(() => import("./EditorComponent"));
const Fontpicker = lazy(() => import("./FontPicker"));
const HelpTextSelector = lazy(() => import("./HelpTextSelector"));
const ImagePicker = lazy(() => import("./ImagePicker"));
const LoctionPostion = lazy(() => import("./LoctionPostion"));
const MultiSelect = lazy(() => import("./MultiSelect"));
// const { PremiumButton } = lazy(() => import("./PremiumBadge"));
const SearchAutocomplete = lazy(() => import("./SearchAutocomplete"));
const SearchableSelect = lazy(() => import("./SearchableSelect"));
const Switch = lazy(() => import("./Switch"));
const TinyEditorComponent = lazy(() => import("./TinymceEditor/TinyEditorComponent"));

const timeRegex = /^(([0-1]?[0-9]|2[0-3]):)?([0-5]?[0-9]:)?([0-5]?[0-9])?$/;

const Delete = (props) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

  const activator = (
    <InlineStack align="end">
      <Button icon={DeleteIcon} accessibilityLabel="Add theme" onClick={togglePopoverActive} />
    </InlineStack>
  );

  const yes = (e) => {
    props.remove(props.index);
    setPopoverActive(false);
  };
  const no = (e) => setPopoverActive(false);

  if (props.minimum > props.index) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <Box padding={200}>
        <BlockStack gap={200}>
          <div>Are you sure you want to delete?</div>
          <InlineStack align="center">
            <ButtonGroup>
              <Button onClick={yes}>Yes</Button>
              <Button onClick={no}>No</Button>
            </ButtonGroup>
          </InlineStack>
        </BlockStack>
      </Box>
    </Popover>
  );
};

const Rephrase = (props) => {
  const handleRephrase = () => {
    // If section is collapsed, expand it first
    if (props.openCollapsible && props.checkOpenCollapsible && !props.checkOpenCollapsible(props.index)) {
      props.openCollapsible(props.index);
    }

    if (props.onRephrase) {
      props.onRephrase(props.index, props.fieldName);
    }
  };

  // Only show rephrase button for specific field types that have content
  if (!props.showRephrase || !props.onRephrase) {
    return null;
  }

  return (
    <InlineStack align="end">
      <Tooltip content={t("common.Rephrase content using AI")}>
        <Button
          icon={CursorFilledIcon}
          accessibilityLabel="Rephrase with AI"
          onClick={handleRephrase}
          variant="primary"
        />
      </Tooltip>
    </InlineStack>
  );
};

const Add = (props) => {
  const { t } = useTranslation();
  return props.type !== "single" ? (
    <Button
      variant=""
      onClick={() =>
        props.push(
          Object.fromEntries(
            props.subfields.map((subfield) => {
              if (subfield.type == "array") {
                return [subfield.name, subfield.initialValue ?? []];
              } else {
                return [subfield.name, ""];
              }
            })
          )
        )
      }
    >
      <div style={{ display: "flex" }}>
        <Icon source={PlusIcon} />
        &nbsp;{t("common.Add ")}
        {props.label}
      </div>
    </Button>
  ) : (
    <Button variant="" onClick={() => props.push("")}>
      <div style={{ display: "flex" }}>
        <Icon source={PlusIcon} />
        &nbsp;{t("common.Add ")}
        {props.label}
      </div>
    </Button>
  );
};

export const prefixFn = (prefix) => {
  const { profileData } = useContext(ProfileContext);
  const [prefixVal, setPrefixVal] = useState();

  useEffect(() => {
    if (profileData) {
      setPrefixVal(eval(prefix));
    }
  }, [profileData]);

  return prefixVal;
};

export const PremiumIcon = (props) => {
  const { t } = useTranslation();

  const { label, premiumType, planName } = props;
  const setNavigate = navigate();
  const { profileData } = useContext(ProfileContext);
  const [popoverActive, setPopoverActive] = useState(false);

  const gotoPrice = () => {
    setNavigate("/pricing");
  };

  const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

  const activator = (
    <Button variant="plain" onClick={togglePopoverActive}>
      <Badge tone="info">
        <InlineStack gap={200} blockAlign="center">
          <Image source={PremiumSvg} width={15} /> <Text variant="bodyXs">{planName || "Premium"}</Text>
        </InlineStack>
      </Badge>
    </Button>
  );

  const Icon = (
    <div className="premium_icon">
      <InlineStack gap="200">
        <div>{label}</div>
        <Popover
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
          preferredPosition="above"
        >
          <Box padding={200}>
            <BlockStack gap={200}>
              <Text fontWeight="medium">{t(`common.Included in the ${planName || "Premium"} plan`)}</Text>
              <Button variant="plain" onClick={gotoPrice}>
                {t("common.Go to pricing")}
              </Button>
            </BlockStack>
          </Box>
        </Popover>
      </InlineStack>
    </div>
  );

  // Improved logic for showing the icon or label
  if (premiumType && profileData?.featureData) {
    if (profileData?.featureData?.[premiumType] === "false" || !profileData?.featureData?.[premiumType])
      return Icon;
    return <div>{label}</div>;
  } else if (profileData?.recurringPlanType === "Free") return Icon;
  else return <div>{label}</div>;
};

const DisableFields = (value, premiumType) => {
  const { profileData } = useContext(ProfileContext);
  const [disable, setDisable] = useState(value);

  useEffect(() => {
    if (profileData?.recurringPlanType !== "Free") {
      if (
        premiumType &&
        profileData?.featureData &&
        (profileData?.featureData?.[premiumType] === "false" || !profileData.featureData[premiumType])
      ) {
        setDisable(true);
      } else setDisable(false);
    } else {
      setDisable(true);
    }
  }, [profileData]);

  return disable;
};

const getVideoLink = (label, id, linkData, positionName) => {
  const position = linkData?.linkPosition?.filter((e) => e.position === positionName);
  const hasBefore = position?.find((e) => e.beforeOrAfter === "before") ? true : false;
  const hasAfter = position?.find((e) => e.beforeOrAfter === "after") ? true : false;

  if (position?.length > 0) {
    return (
      <InlineStack blockAlign="center" gap={100}>
        {hasBefore && <VideoPopup linkData={linkData} buttonName={`${id}Before${positionName}`} />}
        {label}
        {(hasAfter || !hasBefore) && <VideoPopup linkData={linkData} buttonName={`${id}After${positionName}`} />}
      </InlineStack>
    );
  }
  return label;
};

const FormField = (props) => {
  const {
    field: {
      helpTextDynamic,
      helpText,
      helpTextFn,
      requiredIndicator,
      validated,
      pattern,
      type,
      onChange,
      name,
      key,
      showPremium,
      label,
      prefix,
      prefixDynamic,
      premiumType,
      disabled,
      planName,
      connectedRight,
      connectedRightDynamic,
      connectedRightFn,
      connectedLeft,
      connectedLeftDynamic,
      connectedLeftFn,
      sufix,
      id,
      index,
      labelAction = {},
    },
    form: { handleChange, handleBlur, submitCount },
    error,
    value,
    touch,
    field,
  } = props;
  let location = useLocation();
  let linkData;
  if (!location?.pathname?.includes("admin") && !location?.pathname?.includes("public")) {
    const { videoLinks } = useContext(ProfileContext);
    linkData = useMemo(() => videoLinks?.find((e) => e.selector === id)?.linkValue, [videoLinks, id]);
  }

  const defaultLabel = showPremium ? (
    <PremiumIcon label={label} premiumType={premiumType} planName={planName} />
  ) : (
    label
  );
  const defaultHelpText = helpTextDynamic ? helpTextFn(props) : helpText;
  const defaultConnectedRight = connectedRightDynamic ? connectedRightFn(props) : connectedRight;
  const defaultConnectedLeft = connectedLeftDynamic ? connectedLeftFn(props) : connectedLeft;
  const defaultPrefix = prefixDynamic ? prefixFn(prefix) : prefix;
  const fieldProps = {
    ...props.field,
    ...props,
    name,
    disabled: showPremium ? DisableFields(disabled, premiumType) : disabled,
    value: value,
    label: getVideoLink(defaultLabel, id, linkData, "label"),
    helpText: getVideoLink(defaultHelpText, id, linkData, "helpText"),
    prefix: getVideoLink(defaultPrefix, id, linkData, "prefix"),
    sufix: getVideoLink(sufix, id, linkData, "sufix"),
    connectedRight: getVideoLink(defaultConnectedRight, id, linkData, "connectedRight"),
    connectedLeft: getVideoLink(defaultConnectedLeft, id, linkData, "connectedLeft"),
    requiredIndicator: JSON.stringify(requiredIndicator) ? requiredIndicator : validated,
    validate: props.field.customValidate,
    onChange: onChange
      ? (value) => {
          onChange(value, props.form, index);
        }
      : (value) => {
          if (!pattern || timeRegex.test(value) || value === "") {
            handleChange({ target: { name, value } });
          }
        },
    onBlur: () => handleBlur({ target: { name } }),
    error: error && (touch || submitCount > 0) && error,
    // error: error && touch && error,
    labelAction: labelAction && {
      ...labelAction,
      onAction: () => labelAction.onAction(props.form, index),
    },
  };

  if (type === "SearchAutocomplete") {
    return (
      <React.Fragment key={key}>
        <Field
          {...fieldProps}
          component={SearchAutocomplete}
          validate={(value) => {
            if (!value) {
              return `${label} is required`;
            }
          }}
        />
      </React.Fragment>
    );
  }

  if (type === "colorPicker") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={ColorPickerCircle} />
      </React.Fragment>
    );
  }

  if (type === "editor") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={EditorComponent} />
      </React.Fragment>
    );
  }

  if (type === "tiny-editor") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={TinyEditorComponent} />
      </React.Fragment>
    );
  }

  if (type === "meta-tiny-editor") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={MetaTinyEditor} />
      </React.Fragment>
    );
  }

  if (type === "multiSelect") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={MultiSelect} />
      </React.Fragment>
    );
  }
  if (type === "component") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={field.component} />
      </React.Fragment>
    );
  }

  if (type === "searchableSelect") {
    return (
      <React.Fragment key={key}>
        <Field
          {...fieldProps}
          validate={(value) => {
            return searchableSelectValidation(value, props.field.options);
          }}
          component={SearchableSelect}
        />
      </React.Fragment>
    );
  }

  if (type === "rangeSlider") {
    const { showOutput = true, defaultSuffix = true } = fieldProps;
    if (defaultSuffix) {
      fieldProps.suffix = (
        <p
          style={{
            minWidth: "24px",
            textAlign: "right",
          }}
        >
          {fieldProps.beforeValue ? (
            <>
              {fieldProps.suffix}
              {value}
            </>
          ) : (
            <>
              {value}
              {fieldProps.suffix}
            </>
          )}
        </p>
      );
    }

    return <RangeSlider {...fieldProps} output={showOutput} />;
  }

  if (type === "img") {
    return <Thumbnail source={props.value || ProductIcon} size={props.field.size} alt={props.name} />;
  }

  if (type === "switch") {
    return <Switch {...fieldProps} checked={props.value} />;
  }

  if (type === "tiny-editor") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={TinyEditorComponent} />
      </React.Fragment>
    );
  }

  if (type === "meta-tiny-editor") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={MetaTinyEditor} />
      </React.Fragment>
    );
  }

  if (type === "checkbox") {
    return <Checkbox {...fieldProps} checked={props.value} />;
  }
  if (type === "array") {
    field.groupSize = field.groupSize ? field.groupSize : 2;
    return (
      <FieldArray key={field.id} name={name}>
        {({ push, remove }) => (
          <React.Fragment key={field.id}>
            <BlockStack gap="400">
              <Text as="p">{field.label}</Text>
              <FormLayout>
                {[...Array(Math.ceil(value?.length / field?.groupSize))].map((_, gIndex) => (
                  <FormLayout.Group key={gIndex} condensed>
                    {value
                      ?.slice(gIndex * field.groupSize, gIndex * field.groupSize + field.groupSize)
                      .map((value, index) => {
                        const finalIndex = gIndex * field.groupSize + index;
                        return (
                          <Field
                            key={finalIndex}
                            name={`${name}.[${finalIndex}]`}
                            field={{
                              ...props.field,
                              type: props.field.arrayType,
                              name: `${name}.[${finalIndex}]`,
                              ...(!field.hideDeletebtn &&
                                (props.field.minimum > finalIndex ? (
                                  <></>
                                ) : (
                                  {
                                    labelAction: {
                                      content: "Delete",
                                      onAction: () => remove(finalIndex),
                                    },
                                  }
                                ))),
                            }}
                            component={FormField}
                            value={value}
                            error={error?.[finalIndex] ? error?.[finalIndex] : false}
                            touch={touch?.[finalIndex] ? touch?.[finalIndex] : false}
                          />
                        );
                      })}
                  </FormLayout.Group>
                ))}
              </FormLayout>
              {!field.hideAddbtn && <Add {...field} push={push} type="single" />}
            </BlockStack>
          </React.Fragment>
        )}
      </FieldArray>
    );
  }

  if (type === "radio") {
    return (
      <RadioButton
        {...fieldProps}
        id={props.field.radioId}
        checked={value === props.field.radioId}
        onChange={(booleanType, value) => {
          onChange && onChange(value, props.form, index);
          if (!pattern || timeRegex.test(value) || value === "") {
            handleChange({ target: { name, value } });
          }
        }}
      />
    );
  }

  if (type === "select") {
    return <Select {...fieldProps} />;
  }
  if (type === "helpTextSelector") {
    return (
      <React.Fragment key={key}>
        <Field
          {...fieldProps}
          component={HelpTextSelector}
          validate={(value) => {
            if (props.field.validated) {
              if (value.replace(/(<([^>]+)>)/gi, "").trim()) {
                return false;
              } else {
                return props.field.errormsg;
              }
            } else {
              return false;
            }
          }}
        />
      </React.Fragment>
    );
  }

  if (type === "imagePicker") {
    // Override error display logic for imagePicker to show errors on form submission
    const imagePickerProps = {
      ...fieldProps,
      error: error && (touch || submitCount > 0) && error,
    };

    return (
      <React.Fragment key={key}>
        <Field
          {...imagePickerProps}
          validate={(value) => {
            if (!value) {
              value = [];
            }
            if (isObject(value)) {
              value = [value];
            }
            if (props.field.min && props.field.max) {
              if (props.field.min > value.length || value.length > props.field.max) {
                return `Minimum ${props.field.min} and Maximum ${props.field.max} ${props.field.label}s are required`;
              }
            } else if (props.field.min) {
              if (props.field.min > value.length) {
                return `Minimum ${props.field.min} ${props.field.label}s are required`;
              }
            } else if (props.field.max) {
              if (value.length > props.field.max) {
                return `Maximum ${props.field.max} ${props.field.label}s are allowed`;
              }
            }
            return false;
          }}
          component={ImagePicker}
        />
      </React.Fragment>
    );
  }

  if (type === "codeMirror") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={Codemirror} />
      </React.Fragment>
    );
  }

  if (type === "fontpicker") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={Fontpicker} />
      </React.Fragment>
    );
  }

  if (type === "locationPosition") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={LoctionPostion} />
      </React.Fragment>
    );
  }
  if (type === "choiceList") {
    return <ChoiceList {...fieldProps} selected={props.value} title={fieldProps.label} />;
  }

  if (type === "customSelector") {
    return (
      <React.Fragment key={key}>
        <Field {...fieldProps} component={CustomSelector} />
      </React.Fragment>
    );
  }

  return fieldProps.isScrollable ? (
    <div className="textField">
      <TextField {...fieldProps} />
    </div>
  ) : (
    <TextField {...fieldProps} />
  );
};

const Error = ({ name }) => {
  const { errors, touched } = useFormikContext();
  const error = errors[name];
  const touch = touched[name];
  return touch && error ? <InlineError message={error} fieldID={name} /> : null;
};

const SaveButton = ({
  isSave = true,
  isPremium = false,
  label = t("common.Save"),
  premiumFeatureName,
  buttonVariant = "primary",
}) => {
  if (isSave) {
    if (isPremium) {
      return (
        <PremiumButton type={premiumFeatureName}>
          <Button variant="primary" submit>
            {label}
          </Button>
        </PremiumButton>
      );
    } else {
      return (
        <Button variant="primary" submit>
          {label}
        </Button>
      );
    }
  }
};

const searchableSelectValidation = (value, options) => {
  if (options.findIndex((option) => option.value === value) === -1) {
    return "Select valid option.";
  }
  return false;
};

const DynamicSection = ({ children, field }) => {
  if (field.section !== undefined && !field.section) {
    return <React.Fragment>{children}</React.Fragment>;
  } else {
    return <Card padding="400">{children}</Card>;
  }
};

export { Delete, Rephrase, Add, FormField, Error, SaveButton, DynamicSection };
