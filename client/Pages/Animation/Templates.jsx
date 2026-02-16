import React, { useCallback, useEffect, useState } from "react";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Image,
  InlineError,
  InlineGrid,
  InlineStack,
  Link,
  Modal,
  Text,
} from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { gettemplatesList } from "../../Assets/Mocks/Templates.mock";
import { navigate } from "../../Components/Common/NavigationMenu";
import { PremiumButton } from "../../Components/Common/PremiumBadge";
import DuplicatePreview from "./DuplicatePreview";

export default function Templates(props) {
  const { templateModal, setTemplateModal } = props;
  const setNavigate = navigate();
  const templatesList = gettemplatesList();
  const [previewModal, setPreviewModal] = useState(false);
  const [formData, setFormData] = useState([]);
  const [navigationItems, setNavigationItems] = useState([]);
  const [mobileView, setMobileView] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const fetch = useAuthenticatedFetch();
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch.get(`all-preview`);
      if (res.data && res.data.length > 0) {
        setFilteredData(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [filteredData]);

  useEffect(() => {
    fetchData();
  }, []);

  const onClick = useCallback(
    async (type) => {
      if (filteredData.length > 0) {
        const data = filteredData.filter((item) => item.slideType === type);
        for (let i = 0; i < data.length; i++) {
          const section = data[i];
          for (let j = 0; j < section.htmlDesign.length; j++) {
            const element = section.htmlDesign[j];
            if (element.type === "Clock") {
              let timerDate = new Date();
              timerDate.setDate(timerDate.getDate() + 2);
              let currentDate = new Date();
              element.desktopSetting.timer = timerDate;
              element.desktopSetting.repeatedTimer.repeatTimerCreateDate = currentDate;
            }
          }
        }
        setFormData(data);
        setNavigationItems(data.map((item) => item.htmlDesign));

        if (data.length > 0) {
          setTemplateModal(false);
          setPreviewModal(true);
        } else {
          setNavigate(`/announcementBar?type=${type}`);
        }
      } else {
        setNavigate(`/announcementBar?type=${type}`);
      }
    },
    [filteredData, formData, navigationItems]
  );

  const handleUnlockClick = useCallback(() => {
    setPreviewModal(!previewModal);
    setTemplateModal(false);
    setSelectedData(null);
  }, [previewModal]);

  const handlePrevious = useCallback(() => {
    setPreviewModal(!previewModal);
    setTemplateModal(true);
    setSelectedData(null);
  }, [previewModal]);

  const handleClick = (data) => {
    setSelectedData(data);
    setError(false);
  };

  const handleNextButtonClick = () => {
    if (selectedData) {
      setNavigate(`/announcementBar?slideId=${selectedData._id}&type=${selectedData.slideType}`);
    } else {
      setError(true);
    }
  };
  const handleBack = useCallback(() => {
    setTemplateModal(false);
  }, []);

  return (
    <>
      <Modal size="large" title={t("common.Create Campaign")} open={templateModal} onClose={handleBack}>
        <Modal.Section>
          <div style={{ marginBottom: "50px" }}>
            <BlockStack gap="500">
              <InlineGrid
                gap={{ xs: "200", sm: "200", md: "300", lg: "400", xl: "400" }}
                columns={{ xs: "1", sm: "2", md: "3", lg: "3", xl: "3" }}
              >
                {templatesList.map((list, index) => (
                  <Card key={index}>
                    <BlockStack gap="400">
                      <div className="tmpImage">
                        <Image source={list.image} />
                      </div>
                      <Text variant="headingMd" as="span">
                        {t(`common.${list?.title}`)}
                      </Text>
                      <Text variant="bodySm" as="p">
                        {t(`common.${list?.text}`)}
                      </Text>
                      <InlineStack align="end" blockAlign="center">
                        <ButtonGroup>
                          {!list.premium ? (
                            <Button size="slim" onClick={(e) => onClick(`${list.type}`)}>
                              {t(`common.${list?.buttonName}`)}
                            </Button>
                          ) : (
                            <PremiumButton unlockTitle="Premium" redirectToPricing={true}>
                              <Button size="slim" onClick={(e) => onClick(`${list.type}`)}>
                                {t(`common.${list?.buttonName}`)}
                              </Button>
                            </PremiumButton>
                          )}
                        </ButtonGroup>
                      </InlineStack>
                    </BlockStack>
                  </Card>
                ))}
              </InlineGrid>
            </BlockStack>
          </div>
        </Modal.Section>
      </Modal>
      <Modal
        size="large"
        title={t("common.Select Announcement Bar")}
        open={previewModal}
        onClose={handleUnlockClick}
        primaryAction={{
          content: t("common.Next"),
          onAction: handleNextButtonClick,
        }}
        secondaryActions={{
          content: t("common.Previous"),
          onAction: handlePrevious,
        }}
        footer={error && <InlineError message={t("common.Please select template.")} fieldID="myFieldID" />}
      >
        <Modal.Section>
          <BlockStack gap={600}>
            {formData.map((data, index) => (
              <Link removeUnderline monochrome key={data._id} onClick={(e) => handleClick(data)}>
                <div
                  style={{
                    border: selectedData && selectedData._id === data._id ? "2px solid #000" : "2px solid #fff",
                  }}
                >
                  <DuplicatePreview
                    key={`preview_${data._id}`}
                    values={data}
                    mobile={mobileView}
                    navigationItems={navigationItems[index]}
                  />
                </div>
              </Link>
            ))}
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}
