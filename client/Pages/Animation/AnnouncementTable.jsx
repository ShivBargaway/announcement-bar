import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Card,
  EmptyState,
  Icon,
  IndexTable,
  InlineGrid,
  InlineStack,
  Modal,
  Text,
} from "@shopify/polaris";
import { DeleteIcon, DragHandleIcon, DuplicateIcon, EditIcon, PlusIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import * as Images from "@/Assets/Index";
import { PremiumIcon } from "@/Components/Common/FormComponent";
import { ProfileContext } from "@/Context/ProfileContext";
import { ToastContext } from "@/Context/ToastContext";
import { isAdmin } from "@/Utils/Index";
import { navigate } from "../../Components/Common/NavigationMenu";
import Switch from "../../Components/Common/Switch";
import Pricing from "../Pricing/Pricing.jsx";
import SlideHideReason from "./SlideHideReason";
import Templates from "./Templates";
import VideoAnnouncement from "./VideoAnnouncement";

function AnnouncementTable({ reorderStatus, addBarStatus }) {
  const { profileData } = useContext(ProfileContext);
  const fetch = useAuthenticatedFetch();
  const [rowsData, setRowsData] = useState([]);
  const { showToast } = useContext(ToastContext);
  const [draggable, setDraggable] = useState(false);
  // const [formModalStatus, setformModalStatus] = useState(false);
  // const [pricingModalStatus, setPricingModalStatus] = useState(false);
  // const [videoModalStatus, setVideoModalStatus] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);
  const [initialAnnouncementList, setInitialAnnouncementList] = useState([]);
  const setNavigate = navigate();
  // const requestDay = [0, 0.5, 1, 2, 3, 4, 5, 10, 20, 30, 60, 90, 120, 150, 180, 210, 240];
  // const currentRequestDay = useMemo(() => {
  //   return requestDay[profileData?.pricingRequest?.request ?? 0];
  // }, [profileData, requestDay]);

  // const lastRequestTime = useMemo(() => {
  //   return profileData?.pricingRequest?.lastRequested ?? profileData?.created;
  // }, [profileData]);

  // const canRequest = useMemo(() => {
  //   const nextRequestTime = new Date(lastRequestTime).getTime() + currentRequestDay * 24 * 60 * 60 * 1000;
  //   const currentTime = new Date();
  //   if (currentTime > nextRequestTime) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }, [currentRequestDay, lastRequestTime]);

  const fetchData = useCallback(async () => {
    const type = "all";
    const res = await fetch.get(`animation-backend?type=${type}`);
    setRowsData(res.data.annoucements);
    setInitialAnnouncementList(res.data.annoucements);
  }, [rowsData, initialAnnouncementList]);

  useEffect(() => {
    if (profileData && profileData.isOnBoardingDone) {
      fetchData();
    }
  }, [profileData]);

  // const pricingConfig = {
  //   hideHeader: true,
  //   plans: ["Free", "Premium"],
  // };

  // const closePricingPopUp = useCallback(
  //   async (isSkip) => {
  //     setPricingModalStatus(!pricingModalStatus);
  //     setformModalStatus(isSkip ? true : false);
  //     // const pricingRequest = {
  //     //   lastRequested: new Date(),
  //     //   request: profileData?.pricingRequest?.request ? profileData?.pricingRequest?.request + 1 : 0 + 1,
  //     // };
  //     // await fetch.put("/user/update", JSON.stringify({ ...profileData, pricingRequest: pricingRequest }));
  //     // updateProfileData({ ...profileData, pricingRequest: pricingRequest });
  //   },
  //   [pricingModalStatus]
  // );
  // const handleAcceptPlan = async (plan) => {
  //   onFinish();
  // };
  // const onFinish = useCallback(() => {
  //   setNavigate("/");
  // }, []);

  const editslide = useCallback(async (rows) => {
    setNavigate(`/announcementBar?id=${rows._id}&type=${rows.slideType}`);
  }, []);

  const removeSlide = useCallback(async (rows) => {
    let id = rows._id;
    await fetch.delete(`announcement/${id}`);
    showToast("Delete successfully");
    fetchData();
  });

  const copyslide = useCallback(async (rows) => {
    await fetch.post("annoucement/copy", rows);
    showToast("Copy successfully");
    fetchData();
  });

  const copyToClipboard = async (row) => {
    await navigator.clipboard.writeText(JSON.stringify(row));
    showToast("Link copied to clipboard.");
  };

  const showTemplates = useCallback(() => {
    // if (initialAnnouncementList.length === 0 && profileData?.showVideoRequest < 1) {
    //   setVideoModalStatus(true);
    // } else {
    setTemplateModal(true);
    // }
  }, []);

  const enableSlide = useCallback(async (rows) => {
    rows.slideEnabled = !rows.slideEnabled;
    let res = await fetch.put(`announcement/${rows._id}`, { slideEnabled: rows.slideEnabled });
    const message = res.data.slideEnabled ? "Enable" : "Disable";
    showToast(`${message} successfully`);
    fetchData();
  }, []);

  var firstSlideEnabledIndex = rowsData.findIndex((item) => item.slideEnabled);
  const DraggableRow = React.forwardRef(({ item, index, ...props }, ref) => (
    <Draggable
      key={item._id}
      item={item}
      draggableId={String(index + 1)}
      index={index}
      isDragDisabled={!draggable}
    >
      {(provided) => (
        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <td className="Polaris-IndexTable__TableCell">
            <Text alignment="center">{index + 1}</Text>
          </td>
          <td className="Polaris-IndexTable__TableCell">
            <div style={{ maxWidth: "300px", width: "150px", whiteSpace: "normal", overflowWrap: "break-word" }}>
              {
                <Text variation="strong">
                  {!item.campaignTitle
                    ? item.htmlDesign
                        ?.find((item) => item.type === "Text")
                        ?.desktopSetting.textEditor.replace(/<[^>]*>/g, "") ||
                      item.htmlDesign?.find((item) => item.type === "freeShippingBar")?.desktopSetting
                        .shippingBarMessage.messageStart
                    : item.campaignTitle}
                </Text>
              }
            </div>
          </td>
          {/* <td className="Polaris-IndexTable__TableCell">
            <div
              style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "flex-start",
                padding: "10px",
                width: profileData?.recurringPlanName === "Free" ? "65px" : "inherit",
                filter: profileData?.recurringPlanName === "Free" ? "blur(4px)" : "inherit",
              }}
            >
              <Text variant="headingSm">{item.views ? item.views : "—"}</Text>
            </div>
          </td> */}
          <td className="Polaris-IndexTable__TableCell">
            <div
              style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "flex-start",
                padding: "10px",
                width: profileData?.recurringPlanName === "Free" ? "65px" : "inherit",
                filter: profileData?.recurringPlanName === "Free" ? "blur(4px)" : "inherit",
              }}
            >
              <Text variant="headingSm">{item.clicks ? item.clicks : "—"}</Text>
            </div>
          </td>
          <td className="Polaris-IndexTable__TableCell">
            <div
              style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "flex-start",
                padding: "10px",
                width: profileData?.recurringPlanName === "Free" ? "100px" : "inherit",
                filter: profileData?.recurringPlanName === "Free" ? "blur(4px)" : "inherit",
              }}
            >
              <Text variant="headingSm">{item.submits ? item.submits : "—"}</Text>
            </div>
          </td>
          <td className="Polaris-IndexTable__TableCell">
            <div style={{ display: "flex", textAlign: "center", justifyContent: "center" }}>
              <Switch checked={item.slideEnabled} onChange={() => enableSlide(item)} />
            </div>
          </td>
          <td className="Polaris-IndexTable__TableCell">
            {profileData?.recurringPlanName === "Free" ? (
              index === firstSlideEnabledIndex ? (
                <Badge tone="success">
                  <Text variant="headingSm">{t(`common.${"Visible"}`)}</Text>
                </Badge>
              ) : (
                <Badge tone="critical">
                  <Text variant="headingSm">{t(`common.${"Invisible"}`)}</Text>
                </Badge>
              )
            ) : (
              <Badge tone={item.slideEnabled ? "success" : "critical"}>
                <Text variant="headingSm">{item.slideEnabled ? t("common.Visible") : t("common.Invisible")}</Text>
              </Badge>
            )}
          </td>
          <td className="Polaris-IndexTable__TableCell">
            <div style={{ display: "flex", textAlign: "center", justifyContent: "center" }}>
              <SlideHideReason item={item} />
            </div>
          </td>
          <td className="Polaris-IndexTable__TableCell">
            <ButtonGroup noWrap="true">
              <Button variant="plain" onClick={() => editslide(item)}>
                <Icon source={EditIcon} tone="base" />
              </Button>
              <Button variant="plain" onClick={() => removeSlide(item)}>
                <Icon source={DeleteIcon} tone="base" />
              </Button>
              <Button variant="plain" onClick={() => copyslide(item)}>
                <Icon source={DuplicateIcon} tone="base" />
              </Button>
              {isAdmin() && (
                <Button variant="plain" onClick={() => copyToClipboard(item)}>
                  <Icon source={DuplicateIcon} tone="base" />
                </Button>
              )}
            </ButtonGroup>
          </td>
        </tr>
      )}
    </Draggable>
  ));

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedItems = Array.from(rowsData);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    setRowsData(reorderedItems);
  };

  const cancelReorderSlide = () => {
    setRowsData(initialAnnouncementList);
    setDraggable(!draggable);
  };

  const toggleReorderSlide = useCallback(async () => {
    if (draggable) {
      const reArrangedSlides = [];
      rowsData.map((slide, index) => {
        reArrangedSlides.push({
          updateOne: {
            filter: { _id: slide._id },
            update: { $set: { index: index } },
          },
        });
      });

      await fetch.post("/annoucement/reorder", reArrangedSlides);
      showToast(t("common.Reorder successfully"));
      fetchData();
    }
    setDraggable(!draggable);
  }, [draggable, rowsData]);

  return (
    <>
      {/* <VideoAnnouncement
        videoModalStatus={videoModalStatus}
        setVideoModalStatus={setVideoModalStatus}
        setTemplateModal={setTemplateModal}
        videoLink="https://www.loom.com/embed/0409a8ca69234e4f9a5f30ed9e146d87"
        skip={true}
      /> */}
      <Templates templateModal={templateModal} setTemplateModal={setTemplateModal} />
      {/* <Modal
        size="large"
        open={pricingModalStatus}
        onClose={(e) => closePricingPopUp(false)}
        title={t("common.Pricing")}
      >
        <Modal.Section>
          <InlineGrid rows={2} gap="400">
            <div className="priceBanner">
              <Banner
                tone="warning"
                title={t(
                  `animation.${"Only 1 slide is visible for FREE plan. To activate All slides subscribe Premium Plan."}`
                )}
              ></Banner>
            </div>
            <Pricing config={pricingConfig} onAcceptPlan={handleAcceptPlan} />
          </InlineGrid>
        </Modal.Section>
      </Modal> */}

      <InlineGrid columns={1} gap="400">
        <InlineStack blockAlign="baseline" gap="1000" align="space-between">
          <Text variant="headingLg" as="h4">
            {t(`common.${"My Announcements"}`)}
          </Text>
          <ButtonGroup noWrap>
            {reorderStatus && (
              <Button size="medium" onClick={toggleReorderSlide}>
                <InlineStack blockAlign="center" gap={100}>
                  <Icon source={DragHandleIcon} color="#FFFFFF" />
                  {draggable ? t("common.Save order") : t("common.Reorder Slides")}
                </InlineStack>
              </Button>
            )}
            {draggable && (
              <Button variant="primary" onClick={cancelReorderSlide}>
                <span>{t(`common.${"Cancel"}`)}</span>
              </Button>
            )}
            {!draggable && (
              <Button variant="primary" size="medium" onClick={showTemplates}>
                <InlineStack blockAlign="center" gap={100}>
                  <Icon source={PlusIcon} color="#FFFFFF" />
                  {t(`common.${"Add bar"}`)}
                </InlineStack>
              </Button>
            )}
          </ButtonGroup>
        </InlineStack>
        <div className="table">
          <Card padding="0">
            {rowsData && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <IndexTable
                        itemCount={rowsData.length}
                        selectable={false}
                        emptyState={
                          <EmptyState
                            heading={t(`common.${"No Announcements Found"}`)}
                            image={Images.EmptyReuslt}
                          />
                        }
                        headings={[
                          { title: t(`common.${"Number"}`) },
                          { title: t(`common.${"Title"}`) },
                          // {
                          //   title: <PremiumIcon label={t(`common.${"Views"}`)} onlyIcon={true} />,
                          //   id: "Views",
                          // },
                          {
                            title: <PremiumIcon label={t(`common.${"Clicks"}`)} onlyIcon={true} />,
                            id: "Clicks",
                          },
                          {
                            title: <PremiumIcon label={t(`common.${"Submits"}`)} onlyIcon={true} />,
                            id: "Submits",
                          },
                          { title: t(`common.${"Slide Activation"}`) },
                          { title: t(`common.${"Status"}`) },
                          { title: t(`common.${"Targeting"}`) },
                          // { title: t(`common.${"Create At"}`) },
                          { title: t(`common.${"Actions"}`) },
                        ]}
                      >
                        {rowsData.map((item, index) => (
                          <DraggableRow key={item._id} item={item} index={index} />
                        ))}
                      </IndexTable>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Card>
        </div>
      </InlineGrid>
    </>
  );
}

export default AnnouncementTable;
