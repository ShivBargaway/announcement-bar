import React, { useState } from "react";
import { useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Navigation,
  Text,
} from "@shopify/polaris";
import { PlusCircleIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import CommonForm from "@/Components/Common/CommonForm";
import { calculateShippingPrice, convertToLocaleString, repeatedHoursChanged } from "../../../Utils/AppUtils";
import AllComponents from "../Component/AllComponents";
import {
  getAdvancFormFields,
  getBackgroundFormFields,
  getCampagionFormFields,
  getScheduleFormFields,
} from "../Mocks/AnnouncementSetting.mock";
import RenderComponent from "../RenderComponent/RenderComponent";

export default function NavigationBar(props) {
  const urlParams = new URLSearchParams(location.search);
  const getUrlParam = (param) => urlParams.get(param);
  const type = getUrlParam("type");
  const {
    navigationItems,
    setNavigationItems,
    setFormValues,
    formValues,
    onSubmit,
    activeNavigation,
    mobileView,
    setAllOnChangeValue,
    formRef,
    setCampaignError,
  } = props;
  const components = AllComponents();
  const [showCard, setShowCard] = useState(false);
  const [cardVisibilityId, setCardVisibilityId] = useState("");
  const [mobileBg, setMobileBg] = useState();
  const handleBlock = () => {
    setShowCard((prevShowCard) => !prevShowCard);
  };

  const addComponent = (component) => {
    const { type, id } = component;
    return {
      id: id,
      desktopSetting: {
        ...component.initialValues,
        id: id,
        ...(type === "Button" && { btnlength: navigationItems.length + 1 }),
      },
      ...component,
    };
  };

  const handleAddItem = (component) => {
    const { type } = component;
    setShowCard(false);
    let newItem = {};

    if (component.childComponent) {
      newItem = addComponent({
        id: `${type}_${navigationItems.length + 1}`,
        parentId: `${type}_${navigationItems.length + 1}`,
        ...component,
      });
      newItem.childComponent = [];
      component.childComponent.map((childComponent) => {
        newItem.childComponent.push(
          addComponent({
            ...childComponent,
            type: childComponent.type,
            id: `${type}${childComponent.type}_${navigationItems.length + 1}`,
          })
        );
      });
    } else {
      newItem = addComponent({
        ...component,
        id: `${type}_${navigationItems.length + 1}`,
      });
    }
    setNavigationItems((prevNavigationItems) => [...prevNavigationItems, newItem]);
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      htmlDesign: [...(prevFormValues.htmlDesign || []), newItem],
    }));
  };

  const onChange = useCallback(
    (value) => {
      if (value?.repeatedTimer?.repeatedHours) {
        value.repeatedTimer.repeatedHours = repeatedHoursChanged(value.repeatedTimer);
      }
      if (value?.progressMessage) {
        value.progressMessage.progressGoal = calculateShippingPrice(value);
      }
      if (value?.timer) value.timer = convertToLocaleString(value.timer);
      if (value.repeatedTimer) {
        value.repeatedTimer.repeatTimerCreateDate = convertToLocaleString(
          value.repeatedTimer.repeatTimerCreateDate
        );
      }

      const updatedNavigationItems = navigationItems.map((navigation) => {
        if (navigation.childComponent) {
          const index = navigation.childComponent.findIndex((item) => item.id === value.id);
          if (index === -1) return navigation;

          let { desktopSetting, mobileSetting, mobileDiff } = navigation.childComponent[index];

          if (mobileView) {
            mobileDiff = Object.keys(value).reduce((diff, key) => {
              if (desktopSetting[key] !== value[key]) {
                diff[key] = value[key];
              }
              return diff;
            }, {});

            mobileSetting = {
              ...value,
              ...mobileDiff,
            };
          } else {
            desktopSetting = {
              ...desktopSetting,
              ...value,
            };
          }

          return {
            ...navigation,
            childComponent: navigation.childComponent.map((item, i) =>
              i === index
                ? {
                    ...item,
                    mobileSetting,
                    desktopSetting,
                  }
                : item
            ),
          };
        } else {
          const index = Object.keys(navigation).findIndex((key) => navigation.id === value.id);
          if (index === -1) return navigation;

          let { desktopSetting, mobileSetting, mobileDiff } = navigation;

          if (mobileView) {
            mobileDiff = Object.keys(value).reduce((diff, key) => {
              if (desktopSetting[key] !== value[key]) {
                diff[key] = value[key];
              }
              return diff;
            }, {});

            mobileSetting = {
              ...value,
              ...mobileDiff,
            };
          } else {
            desktopSetting = {
              ...desktopSetting,
              ...value,
            };
          }

          return {
            ...navigation,
            mobileSetting,
            desktopSetting,
          };
        }
      });

      setNavigationItems(updatedNavigationItems);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        htmlDesign: updatedNavigationItems,
      }));
      setAllOnChangeValue((prevFormValues) => ({
        ...prevFormValues,
        htmlDesign: updatedNavigationItems,
      }));
    },
    [mobileView, navigationItems, setNavigationItems, setFormValues, setAllOnChangeValue]
  );

  const handleFormChange = useCallback(
    (value) => {
      const updateMobileDiff = () => {
        if (value.backgroundColor) {
          setMobileBg(value.backgroundColor);
          return {
            mobilebackgroundColor: value.backgroundColor,
          };
        }
        return {};
      };

      const updateNonMobileDiff = () => {
        if (value.backgroundColor) {
          return {
            backgroundColor: value.backgroundColor,
            mobilebackgroundColor: mobileBg || value.backgroundColor,
          };
        }
        return {};
      };
      const diff = mobileView ? updateMobileDiff() : updateNonMobileDiff();

      setFormValues((prev) => ({
        ...prev,
        ...value,
        ...diff,
      }));

      if (value.campaignTitle !== "") {
        setCampaignError(false);
      }

      setAllOnChangeValue((prev) => ({
        ...prev,
        ...value,
      }));
    },
    [mobileView, mobileBg, setMobileBg, setFormValues, setAllOnChangeValue, setCampaignError]
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(navigationItems);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = reorderedItems.map((item, index) => {
      if (item.type === "Button") {
        return {
          ...item,
          desktopSetting: {
            ...item.desktopSetting,
            btnlength: index + 1,
          },
          mobileSetting: item.mobileSetting
            ? {
                ...item.mobileSetting,
                btnlength: index + 1,
              }
            : undefined, // Optional chaining can also be used here if supported
        };
      }
      return item;
    });
    setNavigationItems(updatedItems);
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      htmlDesign: updatedItems,
    }));
  };

  const formConfigs = [
    { getFields: getCampagionFormFields, key: "Campaign Design", id: "home" },
    { getFields: getBackgroundFormFields, key: "Background Setting", id: "background" },
    { getFields: getAdvancFormFields, key: "Target Setting", id: "advance" },
    { getFields: getScheduleFormFields, key: "Scheduling", id: "schedule" },
  ];
  return (
    <div className="customNavigation">
      <Navigation location="/">
        {formConfigs.map(
          ({ getFields, key, id }) =>
            (activeNavigation === id || (activeNavigation === null && id === "home")) && (
              <div key={id} style={{ width: "100%" }}>
                <div style={{ padding: "16px" }}>
                  <Text variant="headingLg" as="h5">
                    {t(`common.${key}`)}
                  </Text>
                </div>
                <Divider />
                <div style={{ padding: "10px" }}>
                  <BlockStack gap="500">
                    <CommonForm
                      onSubmit={onSubmit}
                      initialValues={formValues}
                      formFields={getFields(type)}
                      onFormChange={handleFormChange}
                      formRef={formRef}
                      isSave={false}
                      enableReinitialize={true}
                      noValueChanged={false}
                    />
                  </BlockStack>
                </div>
              </div>
            )
        )}

        {(activeNavigation === null || activeNavigation === "home") && (
          <>
            <InlineGrid columns={1}>
              <InlineStack gap="1000">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="navigation">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {navigationItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <Box padding={200}>
                                <RenderComponent
                                  key={item.id}
                                  provided={provided}
                                  item={item}
                                  setNavigationItems={setNavigationItems}
                                  onChange={onChange}
                                  onSubmit={onSubmit}
                                  cardVisibilityId={cardVisibilityId}
                                  setCardVisibilityId={setCardVisibilityId}
                                  mobileView={mobileView}
                                />
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </InlineStack>
              <InlineStack gap={400}>
                <Navigation.Section
                  items={[
                    {
                      label: "Add Block",
                      icon: PlusCircleIcon,
                      onClick: handleBlock,
                    },
                  ]}
                />

                <InlineStack>
                  {showCard && (
                    <div style={{ width: "200px" }}>
                      <Card>
                        <BlockStack gap="500">
                          {components
                            .filter((e) => e?.showfield?.includes(type))
                            .map((component, index) => (
                              <Button key={index} onClick={() => handleAddItem(component)} variant="plain">
                                {component.label}
                              </Button>
                            ))}
                        </BlockStack>
                      </Card>
                    </div>
                  )}
                </InlineStack>
              </InlineStack>
            </InlineGrid>
          </>
        )}
      </Navigation>
    </div>
  );
}
