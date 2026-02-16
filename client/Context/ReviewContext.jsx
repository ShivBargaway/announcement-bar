import React, { createContext, useState } from "react";

export const ReviewModalContext = createContext();

export const ReviewModalContextProvider = ({ children }) => {
  const [reviewModalData, setReviewModalData] = useState({ isOpen: false });

  return (
    <ReviewModalContext.Provider value={{ reviewModalData, setReviewModalData }}>
      {children}
    </ReviewModalContext.Provider>
  );
};
