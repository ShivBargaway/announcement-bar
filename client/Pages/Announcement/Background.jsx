import React, { useCallback } from "react";
import { BlockStack, InlineGrid, Scrollable } from "@shopify/polaris";

const backgroundImages = [
  { backgroundUrl: "light.png" },
  { backgroundUrl: "santa.png" },
  { backgroundUrl: "back-19.jpeg" },
  { backgroundUrl: "back-18.png" },
  { backgroundUrl: "back-20.jpeg" },
  { backgroundUrl: "back-23.png" },
  { backgroundUrl: "back-14.png" },
  { backgroundUrl: "back-15.png" },
  { backgroundUrl: "back-16.png" },
  { backgroundUrl: "back-17.png" },
  { backgroundUrl: "back-2.png" },
  { backgroundUrl: "back-3.png" },
  { backgroundUrl: "back-4.png" },
  { backgroundUrl: "back-5.png" },
  { backgroundUrl: "back-6.png" },
  { backgroundUrl: "back-7.png" },
  { backgroundUrl: "back-8.png" },
  { backgroundUrl: "back-11.png" },
];

const GradientBackground = [
  { backgroundUrl: "linear-gradient(to right, rgb(86, 20, 176), rgb(219, 214, 92))" },
  { backgroundUrl: "linear-gradient(to right, rgb(252, 74, 26), rgb(247, 183, 51))" },
  { backgroundUrl: "linear-gradient(to right, rgb(95, 44, 130), rgb(73, 160, 157))" },
  { backgroundUrl: "linear-gradient(rgb(255, 255, 255) 0%, rgb(141, 149, 173) 50%, rgb(150, 103, 103) 100%)" },
  { backgroundUrl: "linear-gradient(to right, #fa709a 0%, #fee140 100%)" },
  { backgroundUrl: "radial-gradient(circle, red, yellow, green)" },
  { backgroundUrl: "linear-gradient(to right, #2193b0 0%, #6dd5ed 100%)" },
  { backgroundUrl: "linear-gradient(to right, #ee9ca7 0%, #ee9ca7 100%)" },
  { backgroundUrl: "linear-gradient(to right, #eb3349 0%, #f45c43 100%)" },
  { backgroundUrl: "linear-gradient(to right, #ffb347 0%, #ffcc33 100%)" },
  { backgroundUrl: "linear-gradient(to right, #1e130c 0%, #9a8478 100%)" },
  { backgroundUrl: "linear-gradient(to right, #ffffff 0%, #ffffff 100%)" },
];

export default function Background({ form: { setFieldValue }, field: { name } }) {
  const handleClick = useCallback((item) => setFieldValue(name, item.backgroundUrl), [name, setFieldValue]);

  return (
    <BlockStack gap="400">
      <InlineGrid columns={2} gap="400">
        <BlockStack>
          <Scrollable shadow style={{ height: "175px", width: "100%" }}>
            {backgroundImages.map((item, index) => (
              <div
                key={index}
                className="items"
                onClick={() => handleClick(item)}
                style={{ backgroundImage: `url(background/${item.backgroundUrl})` }}
              />
            ))}
          </Scrollable>
        </BlockStack>
        <BlockStack>
          <Scrollable shadow style={{ height: "175px", width: "100%" }}>
            {GradientBackground.map((item, index) => (
              <div
                key={index}
                className="items"
                onClick={() => handleClick(item)}
                style={{ backgroundImage: item.backgroundUrl }}
              />
            ))}
          </Scrollable>
        </BlockStack>
      </InlineGrid>
    </BlockStack>
  );
}
