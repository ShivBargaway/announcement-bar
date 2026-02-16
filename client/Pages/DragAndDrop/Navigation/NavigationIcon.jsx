import React, { useState } from "react";
import { Button, Icon, InlineGrid, InlineStack, Tooltip } from "@shopify/polaris";
import { AppsIcon, ClockIcon, LayoutSectionIcon, SettingsIcon } from "@shopify/polaris-icons";

export default function NavigationIcon(props) {
  const { setActiveNavigation } = props;
  const mockButtons = [
    { id: "home", icon: LayoutSectionIcon, content: "Campaign Setting" },
    { id: "background", icon: SettingsIcon, content: "Background Setting" },
    { id: "advance", icon: AppsIcon, content: "Target Setting" },
    { id: "schedule", icon: ClockIcon, content: "Scheduling" },
  ];
  const [selectedButton, setSelectedButton] = useState("home");

  const handleClick = (navigationId) => {
    if (selectedButton !== navigationId) {
      setSelectedButton(navigationId);
      setActiveNavigation(navigationId);
    }
  };

  return (
    <div className="sideBar">
      <InlineStack alignment="center">
        <div style={{ width: "52px", position: "relative", top: "10px" }}>
          <InlineGrid gap="400" columns={1}>
            {mockButtons.map((button) => (
              <div key={button.id} style={{ textAlign: "center" }}>
                <Tooltip content={button.content} dismissOnMouseOut>
                  <Button
                    variant="tertiary"
                    onClick={() => handleClick(button.id)}
                    pressed={selectedButton === button.id}
                  >
                    <Icon source={button.icon} />
                  </Button>
                </Tooltip>
              </div>
            ))}
          </InlineGrid>
        </div>
      </InlineStack>
    </div>
  );
}
