import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Fullscreen } from "@shopify/app-bridge/actions";
import { Button, ButtonGroup, FullscreenBar, Icon, InlineError, InlineStack, Select } from "@shopify/polaris";
import { DesktopIcon, MobileIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import debounce from "lodash/debounce";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CreditOnReview from "@/Components/Common/CreditOnReview";
import { ToastContext } from "@/Context/ToastContext";
import { isAdmin } from "@/Utils/Index";
import { getcountryData, getpageData } from "../../../Assets/Mocks/CountryObj";
import {
  buttonFormvalue,
  buttonInitialValue,
  cartFormvalue,
  cartInitialValue,
  countdownFormvalue,
  countdownInitialValues,
  couponFormvalue,
  couponbtninitialValue,
  emailFormvalue,
  emailInitialValue,
  entireFormvalue,
  entireinitialValue,
  promotionFormvalue,
  promotionInitialValues,
  shippingBarFormvalue,
  shippingBarInitialValues,
} from "../../../Assets/Mocks/Slide.mock";
import { navigate } from "../../../Components/Common/NavigationMenu";
import {
  MakeProperData,
  MakeProperSlideData,
  convertIsoDate,
  convertToLocaleString,
  generateSlideHTML,
  getApp,
} from "../../../Utils/AppUtils";
import AllComponents from "../Component/AllComponents";
import { initialValues } from "../Mocks/AnnouncementSetting.mock";
import UnSavePopup from "../Mocks/UnSavePopup";
import NavigationBar from "../Navigation/Navigation";
import NavigationIcon from "../Navigation/NavigationIcon";
import Preview from "../Preview/Preview";

export default function AnnouncementBar() {
  const components = AllComponents();
  const countryData = getcountryData();
  const pageData = getpageData();
  const setNavigate = navigate();
  const [navigationItems, setNavigationItems] = useState([]);
  const [mobileView, setMobileView] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const fetch = useAuthenticatedFetch();
  const urlParams = new URLSearchParams(location.search);
  const getUrlParam = (param) => urlParams.get(param);
  const [annoucementId, setannoucementId] = useState();
  const { showToast } = useContext(ToastContext);
  const [activeNavigation, setActiveNavigation] = useState(null);
  const divRef = useRef(null);
  const [divHeight, setDivHeight] = useState(150);
  const [unSave, setUnSave] = useState(false);
  const [allFormValue, setAllFormValue] = useState();
  const [allOnChangeValue, setAllOnChangeValue] = useState(formValues);
  const formRef = useRef();
  const [selected, setSelected] = useState("message");
  const [campaignError, setCampaignError] = useState(false);
  const [animationSetting, setAnimationSetting] = useState({});
  const [announcementLength, setAnnouncementLength] = useState({});

  const handleSelectChange = useCallback((value) => setSelected(value), [selected]);
  const mockData = {
    shippingBar: [
      { label: "Free Shipping Message", value: "message" },
      { label: "Progress Message", value: "progressMessage" },
      { label: "Goal Message", value: "goalMessage" },
    ],
    email: [
      { label: "Email Bar", value: "banner" },
      { label: "Thanks Message", value: "thanksMessage" },
    ],
  };

  const handleComparison = (obj1, obj2) => {
    const str1 = JSON.stringify(obj1);
    const str2 = JSON.stringify(obj2);
    return str1 === str2;
  };
  if (!isAdmin()) {
    const app = getApp();
    const fullscreen = Fullscreen.create(app);

    const handleExit = useCallback(() => {
      if (allFormValue && allOnChangeValue) {
        if (handleComparison(allFormValue, allOnChangeValue)) {
          setNavigate("/");
        } else {
          fullscreen.dispatch(Fullscreen.Action.ENTER);
          setUnSave(true);
        }
      }
    }, [allFormValue, allOnChangeValue]);

    useEffect(() => {
      const unsubscribeExit = app.subscribe(Fullscreen.Action.EXIT, handleExit);
      fullscreen.dispatch(Fullscreen.Action.ENTER);
      return () => {
        unsubscribeExit();
      };
    }, [allFormValue, allOnChangeValue]);
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch.get(`animation-backend?type=all`);
      setAnnouncementLength(res.data.annoucements.length);
      delete res?.data?.annoucements;
      delete res?.data?.cartControls;
      setAnimationSetting(res.data);
      const annoucementId = getUrlParam("id");
      const slideId = getUrlParam("slideId");
      if (annoucementId) {
        const res = await fetch.get(`annoucement/${annoucementId}`);
        const data = res.data;
        const properData = MakeProperData(data, countryData, pageData);
        setAllFormValue(data);
        setAllOnChangeValue(data);
        setannoucementId(data._id);
        setNavigationItems(properData.htmlDesign);
        setFormValues(properData);
      } else if (slideId) {
        const res = await fetch.get(`announcement-preview/${slideId}`);
        const properData = MakeProperSlideData(res.data);
        const mergedData = { ...formValues, ...properData };
        setNavigationItems(properData.htmlDesign);
        setFormValues(mergedData);
        setAllFormValue(mergedData);
        setAllOnChangeValue(mergedData);
      } else {
        const type = getUrlParam("type");
        const typeMap = {
          promotionBar: { initialValues: promotionInitialValues, formValue: promotionFormvalue },
          embeded: { initialValues: countdownInitialValues, formValue: countdownFormvalue },
          shippingBar: { initialValues: shippingBarInitialValues, formValue: shippingBarFormvalue },
          entire: { initialValues: entireinitialValue, formValue: entireFormvalue },
          button: { initialValues: buttonInitialValue, formValue: buttonFormvalue },
          coupon: { initialValues: couponbtninitialValue, formValue: couponFormvalue },
          email: { initialValues: emailInitialValue, formValue: emailFormvalue },
          cart: { initialValues: cartInitialValue, formValue: cartFormvalue },
        };
        const { initialValues = [], formValue = {} } = typeMap[type] || {};
        setNavigationItems(initialValues);
        setFormValues({ ...formValues, ...formValue });
      }
      setNavigationItems((prevNavigationItems) => {
        const updatedNavigationItems = prevNavigationItems.map((navigationItem) => {
          const component = components.find((comp) => comp.type === navigationItem.type);
          if (component) {
            let updatedChildComponent = [];

            if (navigationItem.childComponent && component.childComponent) {
              updatedChildComponent = navigationItem.childComponent.map((item) => {
                const matchingChild = component.childComponent.find((child) => child.type === item.type);

                return matchingChild
                  ? {
                      ...item,
                      component: matchingChild.component,
                      icon: matchingChild.icon,
                      label: matchingChild.label,
                    }
                  : item;
              });
              return {
                ...navigationItem,
                childComponent: updatedChildComponent,
                component: component.component,
                icon: component.icon,
                label: component.label,
              };
            } else {
              return {
                ...navigationItem,
                component: component.component,
                icon: component.icon,
                label: component.label,
              };
            }
          }
          return navigationItem;
        });
        return updatedNavigationItems;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [
    setNavigationItems,
    annoucementId,
    allFormValue,
    formValues,
    allOnChangeValue,
    animationSetting,
    announcementLength,
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const debouncedEffect = debounce(() => {
    if (divRef.current) {
      setDivHeight(divRef.current.clientHeight);
    }
  }, 300);

  useEffect(() => {
    debouncedEffect();
  }, [formValues, mobileView, debouncedEffect]);

  const handleBack = useCallback(() => {
    if (allFormValue && allOnChangeValue) {
      if (handleComparison(allFormValue, allOnChangeValue)) {
        setNavigate("/");
      } else {
        setUnSave(true);
      }
    }
  }, [allFormValue, allOnChangeValue]);

  const finalizeData = (data) => {
    if (data?.displayTime?.startTime) {
      data.displayTime.startTime = convertToLocaleString(data.displayTime.startTime);
    }
    if (data?.displayTime?.endTime) {
      data.displayTime.endTime = convertToLocaleString(data.displayTime.endTime);
    }
  };
  const submitForm = useCallback(
    async (type) => {
      if (type === "save") {
        if (formRef.current || formValues?.campaignTitle !== "") {
          if (formRef.current) {
            await formRef.current.handleSubmit();
          }
          if (formRef?.current?.values?.campaignTitle || formValues?.campaignTitle !== "") {
            onSubmit(type, false);
          }
        } else {
          onSubmit(type, false);
        }
      } else {
        onSubmit(type, false);
      }
    },
    [navigationItems, formValues]
  );
  const onSubmit = useCallback(
    async (type, close) => {
      const updatedNavigationItems = navigationItems.map((item) => {
        const { component, icon, label, initialValues, showfield, ...rest } = item;
        return { ...rest, id: item.id, type: item.type };
      });
      formValues["htmlDesign"] = updatedNavigationItems;
      let data = {
        ...formValues,
      };
      if (data?.countryData || data?.type) {
        const countrydata = data?.countryData?.map((e) => e.value) || [];
        const typedata = data?.type?.map((e) => e.value) || [];
        data.type = typedata;
        data.countryData = countrydata;
      }
      if (data?.displayTime?.startTime) {
        data.displayTime.startTime = convertIsoDate(data.displayTime.startTime);
      }
      if (data?.displayTime?.endTime) {
        data.displayTime.endTime = convertIsoDate(data.displayTime.endTime);
      }

      for (let i = 0; i < data.htmlDesign.length; i++) {
        const element = data.htmlDesign[i];
        if (element?.type === "Clock") {
          element.desktopSetting.timer = convertIsoDate(element.desktopSetting.timer);
          element.desktopSetting.repeatedTimer.repeatTimerCreateDate = convertIsoDate(
            element.desktopSetting.repeatedTimer.repeatTimerCreateDate
          );
          if (element?.mobileSetting) {
            element.mobileSetting.timer = convertIsoDate(element.mobileSetting.timer);
            element.desktopSetting.repeatedTimer.repeatTimerCreateDate = convertIsoDate(
              element.desktopSetting.repeatedTimer.repeatTimerCreateDate
            );
          }
        }
      }
      const mobile = generateSlideHTML(data, data.htmlDesign, true);
      const desktop = generateSlideHTML(data, data.htmlDesign, false);
      data.htmlLayout = {
        mobile: mobile,
        desktop: desktop,
      };
      setCampaignError(data.campaignTitle === "" ? true : false);
      if (data._id) delete data._id;
      if (type === "save") {
        if (data.campaignTitle !== "") {
          const slideType = getUrlParam("type");
          data.slideType = slideType;
          data.index = announcementLength + 1 || 1;
          if (close !== true) {
            let res = await fetch.post(`announcement?multiple=false`, data);
            showToast(t("common.Created successfully"));
            setAllFormValue(data);
            setAllOnChangeValue(data);
            if (res) {
              setNavigate(`/announcementBar?id=${res.data._id}&type=${res.data.slideType}`);
              setannoucementId(res.data._id);
            }
          }
        } else if (close === true && !annoucementId) {
          if (data.campaignTitle !== "") {
            await fetch.post(`announcement?multiple=false`, data);
            showToast(t("common.Created successfully"));
            setNavigate("/");
          }
        }
      } else if (type === "Update") {
        if (data.campaignTitle !== "") {
          await fetch.put(`announcement/${annoucementId}`, data);
          showToast(t("common.Update successfully"));
          setAllFormValue(data);
          setAllOnChangeValue(data);
          if (close === true) setNavigate("/");
        }
      }
      // Dispatch crispAutomation event for review request
      window.dispatchEvent(
        new CustomEvent("crispAutomation", {
          detail: {
            type: "reviewRequest",
          },
        })
      );
      finalizeData(data);
    },
    [navigationItems, formValues, allFormValue, allOnChangeValue, navigate, annoucementId, campaignError]
  );

  const toggleView = useCallback(
    (view) => {
      setMobileView(view);
    },
    [mobileView, formValues]
  );
  const options = formValues && formValues.slideType === "shippingBar" ? mockData.shippingBar : mockData.email;
  const imageUrl = `${process.env.SHOPIFY_APP_URL}/background/productImage.png`;
  return (
    <>
      <div style={{ position: "fixed", top: "0px", width: "100%", zIndex: 99 }}>
        <FullscreenBar onAction={handleBack}>
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            <InlineStack gap={500} blockAlign="center" align="center">
              <ButtonGroup variant="segmented">
                <Button pressed={mobileView === false} onClick={() => toggleView(false)}>
                  <Icon source={DesktopIcon} tone="base" />
                </Button>
                <Button pressed={mobileView === true} onClick={() => toggleView(true)}>
                  <Icon source={MobileIcon} tone="base" />
                </Button>
              </ButtonGroup>
            </InlineStack>
            {formValues && (formValues.slideType === "shippingBar" || formValues.slideType === "email") && (
              <Select options={options} onChange={handleSelectChange} value={selected} />
            )}
            <ButtonGroup>
              {campaignError && <InlineError message="Please enter a campaign title." fieldID="myFieldID" />}
              {!annoucementId && (
                <Button variant="primary" onClick={(e) => submitForm("save")}>
                  {t(`common.${"Save"}`)}
                </Button>
              )}
              {annoucementId && (
                <Button variant="primary" onClick={(e) => submitForm("Update")}>
                  {t(`common.${"Update"}`)}
                </Button>
              )}
            </ButtonGroup>
          </div>
        </FullscreenBar>
      </div>

      <div className="navigation">
        <style
          dangerouslySetInnerHTML={{
            __html: `@media only screen and (max-width: 767px) {
              .navigation{
              margin-top:  ${divHeight}px;
            }
            .previewHeight.desktop .product-page{
              margin-top: ${divHeight}px;
            }
          }`,
          }}
        />

        <NavigationIcon setActiveNavigation={setActiveNavigation} />
        <NavigationBar
          setNavigationItems={setNavigationItems}
          navigationItems={navigationItems}
          setFormValues={setFormValues}
          formValues={formValues}
          onSubmit={onSubmit}
          activeNavigation={activeNavigation}
          mobileView={mobileView}
          setAllOnChangeValue={setAllOnChangeValue}
          setCampaignError={setCampaignError}
          formRef={formRef}
        />
      </div>
      <div className={`previewHeight ${mobileView == false ? "desktop" : "mobile"}`}>
        <div className="preview-bar" ref={divRef}>
          {navigationItems && (
            <Preview
              values={formValues}
              mobile={mobileView}
              navigationItems={navigationItems}
              selected={selected || undefined}
              animationSetting={animationSetting}
            />
          )}
        </div>

        <div className="product-page" style={{ padding: "3rem", overflow: "scroll" }}>
          <div
            className="preview-product-image"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="preview-product-details">
            <div>Product Title</div>
            <div>$ 47.99 </div>
            <div className="preview-atc">ADD TO CART</div>
          </div>
        </div>
      </div>
      <UnSavePopup setUnSave={setUnSave} unSave={unSave} onSubmit={onSubmit} annoucementId={annoucementId} />
    </>
  );
}
