import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BlockStack, Button, ButtonGroup, InlineStack, Modal, Page, Text } from "@shopify/polaris";
import { Crisp } from "crisp-sdk-web";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { getUninstallFormField, uninstallFormValue } from "@/Assets/Mocks/App.mock";
import CommonForm from "@/Components/Common/CommonForm";
import Meeting from "@/Components/Common/Meeting";
import { ProfileContext } from "@/Context/ProfileContext";
import { logger } from "@/Services/Logger/Index";
import DismissibleBanner from "./DismissibleBanner";

export default function AppUninstall() {
  const formRef = useRef();
  let location = useLocation();
  const fetch = useAuthenticatedFetch();
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const [uninstallPopup, setUninstallPopup] = useState(false);
  const [supportPopup, setSupportPopup] = useState(false);
  const [formValue, setFormValue] = useState(uninstallFormValue);

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const closePopup = () => {
    setUninstallPopup(false);
    setFormValue(uninstallFormValue);
    setSupportPopup(false);
  };

  const openCrispChat = () => {
    Crisp.chat.open();
    closePopup();
  };

  const uninstallApp = useCallback(
    async (e) => {
      setUninstallPopup(false);
      const storeUrl = profileData?.shopUrl?.split(".myshopify.com")[0];
      window.open(
        `https://admin.shopify.com/store/${storeUrl}/settings/apps/app_installations/app/${process.env.SHOPIFY_APP_URL_FOR_PRICING}`
      );
      const res = await fetch.put("/user/update", JSON.stringify({ uninstallReason: { ...e } }));
      updateProfileData(res.data);
      logger.error(`Uninstall App - ${profileData?.shopUrl} --- Reason : ${e.reason} ${e.reasonValue}`, {
        extras: { user: res?.data, reasonValue: e },
      });
    },
    [profileData]
  );

  useEffect(() => closePopup(), [location]);

  useEffect(() => {}, [profileData]);

  const getGMTtime = () => {
    const date = new Date();
    const hours = date.getUTCHours().toString().padStart(2, "0");
    return hours;
  };

  const getHours = (StandardHours) => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, "0");
    let time = offset > 0 ? StandardHours - parseInt(hours) : StandardHours + parseInt(hours);
    if (time <= 0) 24 + parseInt(time);
    if (time < 12) return `${time} AM`;
    else return `${time % 12 == 0 ? 12 : time % 12} PM`;
  };

  const calculateTime = () => {
    const GMTtime = parseInt(getGMTtime());
    const date = new Date();
    const dayOfWeek = date.getUTCDay();
    if (dayOfWeek == 0 || dayOfWeek == 6 || (dayOfWeek == 5 && GMTtime > 19)) {
      return (
        <InlineStack>
          <Text>
            {t(
              `common.Our support team is currently unavailable on weekends and will be available on weekdays according to your time zone from `
            )}
            <b>
              {getHours(4)} {t(`common.to`)} {getHours(14)}
            </b>
            {t(
              `common. as we operate from India. You can still leave a message. Please expect some delay in our response. Thank you for your patience.`
            )}
          </Text>
        </InlineStack>
      );
    } else {
      if (GMTtime >= 4 && GMTtime <= 14) return false;
      else if (GMTtime > 14 && GMTtime < 19)
        return (
          <BlockStack gap={300}>
            <Text>
              {t(`common.Our support team is partially available according to your time zone from `)}
              <b>
                {getHours(14)} {t(`common.to`)} {getHours(19)}
              </b>
              {t(
                `common. as we operate from India. Responses may take 30 minutes to an hour during this time. Please leave a message, and we'll respond as soon as possible. Thank you for your patience.`
              )}
            </Text>
            <InlineStack align="end" gap={300}>
              <Meeting
                page="https://appt.link/webrex-studio/announcement-bar-demo"
                button={t("common.Schedule meeting")}
              />
            </InlineStack>
          </BlockStack>
        );
      else
        return (
          <BlockStack gap={300}>
            <Text>
              {t(
                `common.Our support team is currently unavailable and will be available according to your time zone from `
              )}
              <b>
                {getHours(4)} {t(`common.to`)} {getHours(14)}
              </b>
              {t(
                `common. as we operate from India. You can still leave a message. Please expect some delay in our response. Thank you for your patience.`
              )}
            </Text>
            <InlineStack align="end" gap={300}>
              <Meeting
                page="https://appt.link/webrex-studio/announcement-bar-demo"
                button={t("common.Schedule meeting")}
              />
            </InlineStack>
          </BlockStack>
        );
    }
  };

  const openSupportPopup = () => {
    const GMTtime = parseInt(getGMTtime());
    const date = new Date();
    const dayOfWeek = date.getUTCDay();
    if (GMTtime >= 4 && GMTtime <= 14 && dayOfWeek !== 0 && dayOfWeek !== 6) openCrispChat();
    else setSupportPopup(true);
  };

  return (
    <Page>
      <DismissibleBanner
        tone="info"
        title={t(`common.Are you facing any issues understanding the features of our app?`)}
        bannerName={"appUninstallBanner"}
        skipRemove={true}
        bannerText={
          <ButtonGroup>
            <Button onClick={openSupportPopup}>{t(`common.Contact Our Support`)}</Button>
            <Button target="_blank" url="https://www.loom.com/embed/0409a8ca69234e4f9a5f30ed9e146d87">
              {t("common.Visit Help Center")}
            </Button>
            <Button onClick={() => setUninstallPopup(true)}>{t(`common.Uninstall App`)}</Button>
          </ButtonGroup>
        }
      />
      <Modal
        open={uninstallPopup}
        onClose={closePopup}
        title={t(`common.We're sorry to see you go!`)}
        primaryAction={{
          content: "Uninstall",
          onAction: submitForm,
          destructive: true,
        }}
        secondaryActions={[{ content: t("common.Cancel"), onAction: closePopup }]}
      >
        <Modal.Section>
          <BlockStack gap={400}>
            <CommonForm
              onSubmit={uninstallApp}
              formRef={formRef}
              initialValues={uninstallFormValue}
              formFields={getUninstallFormField(formValue?.reason === "Other")}
              isSave={false}
              onFormChange={(e) => setFormValue(e)}
            />
            {formValue?.support && (
              <ButtonGroup>
                <Meeting
                  page="https://appt.link/webrex-studio/announcement-bar-demo"
                  button={t("common.Schedule meeting")}
                />
                <Button
                  onClick={() => {
                    closePopup();
                    openSupportPopup();
                  }}
                >
                  {t(`common.Contact Support`)}
                </Button>
              </ButtonGroup>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
      <Modal
        open={supportPopup}
        onClose={closePopup}
        title={t(`common.Thank You For Reaching Out`)}
        primaryAction={{
          content: t(`common.Leave a message`),
          onAction: openCrispChat,
        }}
        secondaryActions={[{ content: t("common.Cancel"), onAction: closePopup }]}
      >
        <Modal.Section>{calculateTime()}</Modal.Section>
      </Modal>
    </Page>
  );
}
