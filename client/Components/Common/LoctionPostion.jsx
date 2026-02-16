import React, { useCallback, useEffect, useState } from "react";
import { Button, InlineStack, Text } from "@shopify/polaris";
import { getValueFromNestedObject } from "@/Utils/Index";

export default function LoctionPostion(props) {
  const {
    form: { values, setFieldValue },
    field: { name, label },
  } = props;
  const value = getValueFromNestedObject(values, name);
  const [inputValue, setInputValue] = useState(value);

  const onFormChange = useCallback(
    (e) => {
      setInputValue(e);
    },
    [inputValue]
  );
  useEffect(() => {
    setFieldValue(name, inputValue);
  }, [inputValue]);

  return (
    <>
      <InlineStack gap="600">
        <Button variant="plain" onClick={(e) => onFormChange("bottomLeft")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="77"
              height="77"
              fill={value === "bottomLeft" ? "#E9F2FF" : "white"}
              stroke="#D2D5D8"
            />
            <rect
              x="62.5"
              y="8.5"
              width="7"
              height="7"
              rx="3.5"
              stroke="#8C9196"
              fill={value === "bottomLeft" ? "" : "white"}
            />
            <path
              d="M16.1875 26.4375H60.8125V62.5625H16.1875V26.4375ZM17.8005 28.0126V60.9874H59.1995V28.0126H17.8005Z"
              fill={value === "bottomLeft" ? "" : "#5C5F62"}
            />
            <path d="M19.375 54.0625H30V59.375H19.375V54.0625Z" fill={value === "bottomLeft" ? "" : "#5C5F62"} />
          </svg>
        </Button>
        <Button variant="plain" onClick={(e) => onFormChange("bottomRight")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="77"
              height="77"
              stroke="#D2D5D8"
              fill={value === "bottomRight" ? "#E9F2FF" : "white"}
            />
            <rect
              x="62.5"
              y="8.5"
              width="7"
              height="7"
              rx="3.5"
              stroke="#8C9196"
              fill={value === "bottomRight" ? "" : "white"}
            />
            <path
              d="M16.1875 26.4375H60.8125V62.5625H16.1875V26.4375ZM17.8005 28.0126V60.9874H59.1995V28.0126H17.8005Z"
              fill={value === "bottomRight" ? "" : "#5C5F62"}
            />
            <path d="M47 54.0625H57.625V59.375H47V54.0625Z" fill={value === "bottomRight" ? "" : "#5C5F62"} />
          </svg>
        </Button>
        <Button variant="plain" onClick={(e) => onFormChange("topLeft")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="77"
              height="77"
              stroke="#D2D5D8"
              fill={value === "topLeft" ? "#E9F2FF" : "white"}
            />
            <rect
              x="62.5"
              y="8.5"
              width="7"
              height="7"
              rx="3.5"
              stroke="#8C9196"
              fill={value === "topLeft" ? "" : "white"}
            />
            <path
              d="M16.1875 26.4375H60.8125V62.5625H16.1875V26.4375ZM17.8005 28.0126V60.9874H59.1995V28.0126H17.8005Z"
              fill={value === "topLeft" ? "" : "#5C5F62"}
            />
            <path d="M19.375 29.625H30V34.9375H19.375V29.625Z" fill={value === "topLeft" ? "" : "#5C5F62"} />
          </svg>
        </Button>
        <Button variant="plain" onClick={(e) => onFormChange("topRight")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="77"
              height="77"
              stroke="#D2D5D8"
              fill={value === "topRight" ? "#E9F2FF" : "white"}
            />
            <rect
              x="62.5"
              y="8.5"
              width="7"
              height="7"
              rx="3.5"
              stroke="#8C9196"
              fill={value === "topRight" ? "" : "white"}
            />
            <path
              d="M16.1875 26.4375H60.8125V62.5625H16.1875V26.4375ZM17.8005 28.0126V60.9874H59.1995V28.0126H17.8005Z"
              fill={value === "topRight" ? "" : "#5C5F62"}
            />

            <path d="M47 29.625H57.625V34.9375H47V29.625Z" fill={value === "topRight" ? "" : "#5C5F62"} />
          </svg>
        </Button>
      </InlineStack>
    </>
  );
}
