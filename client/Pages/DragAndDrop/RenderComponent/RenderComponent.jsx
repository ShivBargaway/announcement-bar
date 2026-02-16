import React, { useState } from "react";
import MultipleCardWrapper from "./MultipleCardWrapper";

export default function RenderComponent(props) {
  const { provided, item, setNavigationItems, setCardVisibilityId, cardVisibilityId, mobileView } = props;
  const [hoveredItem, setHoveredItem] = useState(null);
  const [parentId, setParentId] = useState("");

  const handleClick = (item) => {
    if (cardVisibilityId === item.id) {
      setCardVisibilityId(null);
    } else {
      setCardVisibilityId(item.id);
    }
  };
  const onParentClick = (item) => {
    if (parentId === item.parentId) {
      setParentId(null);
    } else {
      setParentId(item.parentId);
    }
  };

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId);
  };

  const handleItemHoverEnd = () => {
    setHoveredItem(null);
  };

  const deleteMenu = (itemId) => {
    setNavigationItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.id !== itemId);

      const updatedItems = filteredItems.map((item, index) => ({
        ...item,
        id: `${item.type}_${index + 1}`,
        desktopSetting: {
          ...item.desktopSetting,
          btnlength: index + 1,
          id: `${item.type}_${index + 1}`,
        },
        mobileSetting: item.mobileSetting
          ? {
              ...item.mobileSetting,
              btnlength: index + 1,
              id: `${item.type}_${index + 1}`,
            }
          : undefined, // Optional chaining can also be used here if supported
      }));

      return updatedItems;
    });
  };

  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      onMouseOver={() => handleItemHover(item.id)}
      onMouseOut={handleItemHoverEnd}
    >
      <MultipleCardWrapper
        item={item}
        hoveredItem={hoveredItem}
        handleClick={handleClick}
        handleDelete={deleteMenu}
        handleItemHover={handleItemHover}
        handleItemHoverEnd={handleItemHoverEnd}
        cardVisibilityId={cardVisibilityId}
        mobileView={mobileView}
        onChange={props.onChange}
        onSubmit={props.onSubmit}
        parentId={parentId}
        onParentClick={onParentClick}
      />
      {provided.placeholder}
    </div>
  );
}
