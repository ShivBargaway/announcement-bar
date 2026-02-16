import React from "react";
import { Button, Icon, InlineGrid, InlineStack } from "@shopify/polaris";
import { ChevronDownIcon, ChevronRightIcon, DeleteIcon, DragHandleIcon } from "@shopify/polaris-icons";

const NavigationItem = ({
  item,
  hoveredItem,
  onHover,
  onHoverEnd,
  onClick,
  onDelete,
  cardVisibilityId,
  onParentClick,
  parentId,
}) => {
  const isParent = !item.parentId;
  const isVisible = isParent ? cardVisibilityId === item.id : parentId === item.parentId;
  const handleClick = isParent ? onClick : onParentClick;

  return (
    <InlineStack blockAlign="center" onMouseOver={onHover} onMouseOut={onHoverEnd}>
      <InlineStack align="space-between" gap="100">
        <Button onClick={() => handleClick(item)} variant="plain">
          <Icon source={isVisible ? ChevronDownIcon : ChevronRightIcon} />
        </Button>
      </InlineStack>
      <InlineGrid columns={1} gap="100">
        <InlineStack gap="1000" align="space-between">
          <Button onClick={() => handleClick(item)} variant="plain">
            <InlineStack gap={100}>
              <Icon source={hoveredItem === item.id ? DragHandleIcon : item.icon} color="inkLightest" />
              {item.label}
            </InlineStack>
          </Button>
          {!item.hideDeleteButton && (
            <Button onClick={() => onDelete(item.id)} variant="plain">
              <Icon source={hoveredItem === item.id ? DeleteIcon : ""} color="inkLightest" />
            </Button>
          )}
        </InlineStack>
      </InlineGrid>
    </InlineStack>
  );
};

export default NavigationItem;
