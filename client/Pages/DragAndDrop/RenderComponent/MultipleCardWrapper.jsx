import React from "react";
import { Box } from "@shopify/polaris";
import NavigationItem from "../Navigation/NavigationItem";
import MultipleCard from "./MultipleCard";

const MultipleCardWrapper = ({
  item,
  hoveredItem,
  handleClick,
  handleDelete,
  handleItemHover,
  handleItemHoverEnd,
  cardVisibilityId,
  mobileView,
  onChange,
  onSubmit,
  parentId,
  onParentClick,
}) => {
  const renderMultipleCard = (cardItem) => (
    <MultipleCard
      onChange={onChange}
      item={cardItem}
      cardVisibilityId={cardVisibilityId}
      onSubmit={onSubmit}
      mobileView={mobileView}
    />
  );
  const renderNavigationItem = (navItem) => (
    <NavigationItem
      item={navItem}
      hoveredItem={hoveredItem}
      onHover={() => handleItemHover(navItem.id)}
      onHoverEnd={handleItemHoverEnd}
      onClick={handleClick}
      onDelete={handleDelete}
      cardVisibilityId={cardVisibilityId}
      onParentClick={onParentClick}
      parentId={parentId}
    />
  );
  return (
    <>
      {renderNavigationItem(item)}
      {item.childComponent && item.childComponent && parentId === item.parentId
        ? item.childComponent.map((childComponent) => (
            <Box paddingInlineStart="500" padding={200} key={childComponent.id}>
              {renderNavigationItem(childComponent)}
              {renderMultipleCard(childComponent)}
            </Box>
          ))
        : renderMultipleCard(item)}
    </>
  );
};

export default MultipleCardWrapper;
