export const currentAppQuery = `
{
  currentAppInstallation {
    id
  }
}
`;

export const createAppMetafieldsQuery = `
mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafieldsSetInput) {
    metafields {
      id
      namespace
      key
      value
      type
      ownerType
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const getAppMetafieldsQuery = (fields) => `
{
  currentAppInstallation {
    metafield(namespace: "${fields.namespace}", key: "${fields.key}") {
      id
      namespace
      key
      value
    }
  }
}
`;

export const deleteAppMetafieldsQuery = (id) => `
mutation {
  metafieldDelete(input: {
    id: "${id}",
    }) {
    deletedId
  userErrors {
    field
    message
    }
  }
}
`;
