import React, { useContext, useEffect, useState } from "react";
import { useCallback } from "react";
import { Banner } from "@shopify/polaris";
import { ProfileContext } from "@/Context/ProfileContext";

export default function DismissibleBanner(props) {
  const { updateDismissProperty, dismissProperty } = useContext(ProfileContext);
  const { bannerName, bannerText, skipRemove } = props;
  const [showBanner, setShowBanner] = useState(skipRemove ? true : false);

  const DismissibleBanner = useCallback(() => {
    const updateValue = { ...dismissProperty, banner: { ...dismissProperty?.banner, [bannerName]: true } };
    updateDismissProperty(updateValue);
    setShowBanner(false);
  }, [dismissProperty, bannerName]);

  useEffect(() => {
    const getItem = dismissProperty?.banner?.[bannerName];
    if (!bannerName || !getItem || skipRemove) setShowBanner(true);
    else setShowBanner(false);
  }, [bannerName, dismissProperty]);

  return (
    <>
      {showBanner && (
        <Banner {...props} onDismiss={!skipRemove ? () => DismissibleBanner() : null}>
          {bannerText}
        </Banner>
      )}
    </>
  );
}
