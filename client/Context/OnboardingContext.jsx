import { createContext, useEffect, useState } from "react";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { getDynamicSuggestedItems } from "@/Assets/Mocks/SuggestedItems.mock";

export const OnboardingContext = createContext();
export const OnboardingContextProvider = ({ children }) => {
  const dynamicSuggestedItems = getDynamicSuggestedItems();
  const [onboardingData, setOnboardingData] = useState();
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const fetch = useAuthenticatedFetch();
  const fetchOnboardingData = async () => {
    try {
      setIsOnboardingLoading(true);
      const res = await fetch.get("user/onboarding");
      setIsOnboardingLoading(false);
      setOnboardingData(res?.data || true);
    } catch (err) {
      console.log(err);
      setIsOnboardingLoading(false);
      const authErr = err?.response?.status === 403 && err?.response?.data?.message === "Don't Refresh";
      if (!authErr) {
        setOnboardingData({ error: true });
      }
    }
  };

  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const updateOnboardingData = (e) => {
    setOnboardingData(e);
  };

  const updateSuggestedItem = (key, status) => {
    updateSuggestionStatus({ [key]: status });
    let i = suggestedItems.findIndex((item) => item.id === key);
    if (i !== -1) {
      let newSuggestedItems = [...suggestedItems];
      newSuggestedItems[i]["status"] = status;
      setSuggestedItems(newSuggestedItems);
    } else {
      let j = dynamicSuggestedItems.findIndex((item) => item.id === key);
      if (j !== -1) {
        let dynamicSuggestedItem = dynamicSuggestedItems[j];
        dynamicSuggestedItem["status"] = status;
        setSuggestedItems([...suggestedItems, dynamicSuggestedItem]);
      }
    }
  };

  const updateSuggestionStatus = async (e) => {
    const response = await fetch.post("/onboarding/suggestionStatus", e);
  };

  useEffect(() => {
    let suggestedItems = dynamicSuggestedItems.map((item) => {
      return { ...item, status: onboardingData?.suggestion?.[item.id] || false };
    });
    setSuggestedItems(suggestedItems);
  }, [onboardingData]);

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        isOnboardingLoading,
        updateOnboardingData,
        fetchOnboardingData,
        suggestedItems,
        updateSuggestedItem,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
