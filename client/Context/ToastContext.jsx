import React, { createContext, useCallback, useState } from "react";
import { Toast } from "@shopify/polaris";

export const ToastContext = createContext();
export const ToastContextProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isErrorToast, setIsErrorToast] = useState(false);
  const [customCSS, setCustomCSS] = useState(``);
  const [time, setTime] = useState(5000);

  const getCss = (otherProps) => {
    let css = ``;
    if (otherProps?.backColor) css += `.Polaris-Frame-Toast{background-color: ${otherProps?.backColor};}`;
    if (otherProps?.textColor)
      css += `.Polaris-Frame-Toast .Polaris-Text--root.Polaris-Text--medium{color: ${otherProps?.textColor};} .Polaris-Frame-Toast .Polaris-Frame-Toast__CloseButton{color: ${otherProps?.textColor};}`;
    return css;
  };

  const showToast = useCallback((err, isError, otherProps) => {
    setCustomCSS(getCss(otherProps));
    if (otherProps?.duration) setTime(otherProps?.duration);
    setToastMessage(err);
    setIsToastVisible(true);
    setIsErrorToast(isError || false);
  }, []);

  const hideToast = useCallback(() => {
    setIsToastVisible(false);
    setIsErrorToast(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <style dangerouslySetInnerHTML={{ __html: customCSS }} />
      {isToastVisible && (
        <Toast error={isErrorToast} content={toastMessage} onDismiss={hideToast} duration={time} />
      )}
    </ToastContext.Provider>
  );
};
