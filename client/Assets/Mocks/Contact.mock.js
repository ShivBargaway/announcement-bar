const makeChoiceField = (field, nestedKey, label, choices) => {
  const key = nestedKey ? { nestedKey } : {};
  return {
    key: field,
    label: label || field,
    formFields: [
      {
        id: field,
        name: field,
        label: field,
        type: "choiceList",
        choices: choices,
        allowMultiple: true,
      },
    ],
    initialValue: [],
    filterType: "array",
    ...key,
  };
};

export const getFilterField = (choices) => {
  return [makeChoiceField("campaignTitle", "campaignId", "Campaign Title", choices)];
};
