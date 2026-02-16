import React, { Suspense, lazy, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initReactI18next } from "react-i18next";
import { useCustomerly } from "react-live-chat-customerly";
import { Routes as ReactRouterRoutes, Route, useLocation, useNavigate } from "react-router-dom";
import Hotjar from "@hotjar/browser";
import { Loading } from "@shopify/polaris";
import i18n from "i18next";
import { AppNavigationMenu } from "@/Components/Common/NavigationMenu";
import { logger } from "@/Services/Logger/Index";
import { adminEnvAndTeamCheck, checkPartenerAcc, isAdmin, setSessionStorageItem } from "@/Utils/Index";
import NoAccessStoreDesign from "./Components/Common/NoAccessStoreDesign";
import { ProfileContext } from "./Context/ProfileContext";
import { AppRoute } from "./PrivateRoute";
import { getSessionStorageItem } from "./Utils/Index";

// Import your components using lazy
const Home = lazy(() => import("@/Pages/Home/Home"));
const NotFound = lazy(() => import("@/Pages/NotFound/NotFound"));
const Pricing = lazy(() => import("@/Pages/Pricing/Pricing"));
const Settings = lazy(() => import("@/Pages/Settings/Settings"));
const OnBoarding = lazy(() => import("@/Pages/OnBoarding/OnBoarding"));
const FallbackUIComponent = lazy(() => import("@/Components/Common/FallbackUIComponent"));
// const Support = lazy(() => import("@/Components/Common/Support"));
const Animation = lazy(() => import("@/Pages/Animation/CustomCss"));
const AnnouncementBar = lazy(() => import("@/Pages/DragAndDrop/MainComponent/AnnouncementBar"));
const Templates = lazy(() => import("@/Pages/Animation/Templates"));
const Contacts = lazy(() => import("@/Pages/Contact/Contacts"));
const Feedback = lazy(() => import("@/Pages/Feedback/Feedback"));
const Review = lazy(() => import("@/Pages/Review/Review"));
const AnimationSetting = lazy(() => import("@/Pages/Animation/AnimationSetting"));
// const AppUninstall = lazy(() => import("@/Components/Common/AppUninstall"));
const CustomPlanModal = lazy(() => import("@/Pages/Pricing/CustomPlanModal"));
const OneTimeServicePrice = lazy(() => import("@/Pages/Pricing/OneTimeServicePrice"));
const Partners = lazy(() => import("@/Pages/Partners/Partners"));
const WebrexCrispAutomation = lazy(() =>
  import("@/Components/Common/WebrexCrispAutomation/WebrexCrispAutomation")
);
const RightSideButton = lazy(() => import("@/Components/Common/RightSideButton"));

const Routes = () => {
  const { profileData } = useContext(ProfileContext);
  let location = useLocation();
  const { update } = useCustomerly();
  const navigate = useNavigate();
  const [visitedPaths, setVisitedPaths] = useState(getSessionStorageItem("wsvisitedPaths") || []);
  const skipPaths = [];
  const addQueryStringPath = [];

  useEffect(() => {
    update({
      email: profileData?.email,
    });
  }, [location]);

  useEffect(() => {
    if (profileData && !adminEnvAndTeamCheck(profileData)) {
      if (process.env.HOTJAR_TRACKING_ID) Hotjar.init(process.env.HOTJAR_TRACKING_ID, process.env.HOTJAR_VERSION);
    }
  }, [profileData]);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        await i18n.use(initReactI18next).init();

        let languageToLoad = "en"; // Default to English
        if (!isAdmin() && profileData?.appLanguage) {
          languageToLoad = profileData.appLanguage;
        }
        const languageResource = await import(`@/LanguageJS/${languageToLoad}.js`);
        i18n.addResourceBundle(languageToLoad, "translation", languageResource.default);
        await i18n.changeLanguage(languageToLoad);
        setSessionStorageItem("appLanguage", languageToLoad);
      } catch (error) {
        logger.error(error);
      }
    };

    initializeI18n();
  }, [profileData?.appLanguage, i18n]);

  var simulateMouseEvent = function (element, eventName, coordX, coordY) {
    element.dispatchEvent(
      new MouseEvent(eventName, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: coordX,
        clientY: coordY,
        button: 0,
      })
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const theButton = document.getElementById("component");
      if (theButton) {
        var box = theButton.getBoundingClientRect(),
          coordX = box.left + (box.right - box.left) / 2,
          coordY = box.top + (box.bottom - box.top) / 2;
        simulateMouseEvent(theButton, "click", coordX, coordY);
      }
    }, 1000);
  }, []);

  const handleBackClick = useCallback(() => {
    if (visitedPaths.length > 1 && location.pathname === visitedPaths.at(-1)?.pathname) {
      const lastPath = visitedPaths.at(-2);
      const updatedPaths = visitedPaths.slice(0, -1);
      setVisitedPaths(updatedPaths);
      navigate(`${lastPath.pathname}${lastPath.queryString}`);
    }
  }, [visitedPaths]);

  const backbutton = useMemo(
    () => (visitedPaths?.length > 1 ? { content: "Back", onAction: handleBackClick } : null),
    [visitedPaths]
  );

  useEffect(() => {
    const queryString = location.pathname === "/" ? "" : window.location.search;
    const shouldSkip = skipPaths.some((e) => location.pathname.startsWith(e));
    const isAddQueryString = addQueryStringPath.some((e) => location.pathname.startsWith(e));
    if (!shouldSkip) {
      if (visitedPaths.at(-1)?.pathname !== location.pathname) {
        setVisitedPaths((prev) => [...prev, { pathname: location.pathname, queryString }]);
      } else if (isAddQueryString && visitedPaths.at(-1)?.queryString !== queryString) {
        setVisitedPaths((prev) => [...prev, { pathname: location.pathname, queryString }]);
      } else {
        setVisitedPaths((prev) => {
          const updatedPaths = [...prev];
          updatedPaths[updatedPaths.length - 1] = {
            ...updatedPaths.at(-1),
            queryString,
          };
          return updatedPaths;
        });
      }
    }
  }, [location]);

  useEffect(() => {
    setSessionStorageItem("wsvisitedPaths", visitedPaths);
  }, [visitedPaths]);
  if (profileData && profileData.error) {
    return <FallbackUIComponent />;
  }
  if (checkPartenerAcc(profileData)) {
    return <NoAccessStoreDesign />;
  }

  return (
    <React.Fragment>
      {!profileData && <div className="loading-overlay"></div>}
      <Suspense fallback={<Loading />}>
        {/* <ReviewPopup /> */}
        {/* <Support /> */}
        <AppNavigationMenu />
        <WebrexCrispAutomation />
        <RightSideButton />
        <div id="component"></div>
        {/* <AppUninstall /> */}
        <ReactRouterRoutes>
          {profileData && !profileData.isOnBoardingDone ? (
            <Route path="*" element={<OnBoarding />} />
          ) : (
            <>
              <Route path="/announcementBar" element={<AnnouncementBar backbutton={backbutton} />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/animation" element={<Animation backbutton={backbutton} />} />
              <Route path="/animationSetting" element={<AnimationSetting backbutton={backbutton} />} />
              <Route path="/" element={<Home backbutton={backbutton} />} />
              <Route path="/pricing" element={<Pricing hasBillingButton={true} backbutton={backbutton} />} />
              <Route path="/templates" element={<Templates backbutton={backbutton} />} />
              <Route path="/contacts" element={<Contacts backbutton={backbutton} />} />
              <Route path="/Partners" element={<Partners backbutton={backbutton} />} />
              <Route element={<AppRoute type="private" />}>
                <Route path="/settings" element={<Settings backbutton={backbutton} />} />
              </Route>

              {/* extra routes */}
              <Route path="/review" element={<Review />} />
              <Route path="/pricing/one-time-plan" element={<OneTimeServicePrice backbutton={backbutton} />} />
              <Route path="/pricing/custom-plan/:type" element={<CustomPlanModal backbutton={backbutton} />} />
            </>
          )}
        </ReactRouterRoutes>
      </Suspense>
    </React.Fragment>
  );
};

export default Routes;
