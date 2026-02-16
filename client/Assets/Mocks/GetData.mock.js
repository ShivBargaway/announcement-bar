const defaultOptions = [
  { label: "users", value: "users" },
  { label: "deletedusers", value: "deletedusers" },
  { label: "plans", value: "plans" },
];

export const formFields = (options) => [
  {
    nested: "group",
    groupSize: 2,
    section: false,
    subfields: [
      {
        id: "collectionName",
        name: "collectionName",
        label: "Database Name",
        validated: false,
        type: "select",
        options: options || defaultOptions,
      },
      {
        id: "searchType",
        name: "searchType",
        label: "Search Type",
        validated: false,
        type: "select",
        options: [
          { label: "find", value: "find" },
          { label: "distinct", value: "distinct" },
          { label: "count", value: "count" },
        ],
      },
      {
        id: "distinctField",
        name: "distinctField",
        label: "Distinct Field",
        validated: true,
        type: "text",
        errmsg: "distinct Field a required field",
        dependOn: {
          name: "searchType",
          value: "distinct",
          type: "hidden",
        },
      },
      {
        id: "query",
        name: "query",
        label: "database Query",
        validated: false,
        type: "text",
        helpText: `This field is optional. Add information only if necessary. format - {"shopUrl":"drasti-test.myshopify.com", "id":"xyz"}`,
      },

      // {
      //   id: "sort",
      //   name: "sort",
      //   label: "sort Query",
      //   validated: false,
      //   type: "text",
      //   helpText: `format - {"shopUrl":"drasti-test.myshopify.com", "id":"xyz"}`,
      // },
      {
        id: "limit",
        name: "limit",
        label: "limit",
        validated: false,
        type: "number",
        min: 1,
        helpText: "This field is optional. Add information only if necessary.",
        dependOn: {
          name: "searchType",
          value: "find",
          type: "hidden",
        },
      },
      {
        id: "skip",
        name: "skip",
        label: "skip",
        validated: false,
        type: "number",
        min: 0,
        helpText: "This field is optional. Add information only if necessary.",
        dependOn: {
          name: "searchType",
          value: "find",
          type: "hidden",
        },
      },
      {
        id: "fields",
        name: "fields",
        label: "Get Particular Field",
        validated: false,
        type: "text",
        helpText: `This field is optional. Add information only if necessary. format - {"shopUrl":1, "_id":0}`,
        dependOn: {
          name: "searchType",
          value: "find",
          type: "hidden",
        },
      },
    ],
  },
];
export const initialValues = {
  collectionName: "users",
  searchType: "find",
  query: "",
  fields: "",
  distinctField: "",
};
