export const productQuery = `
query GetProduct($productId: ID!) {
  product(id: $productId) {
    title
    vendor
    id
    createdAt
    media(first: 50) {
      edges {
        node {
          id
           alt
          preview {
            image {
              id
              url
            }
          }
        }
      }
    }
  }
}
`;

export const fileCreateMutation = `
mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
     id
     alt
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const fileUpdateMutation = `
mutation fileUpdate($input: [FileUpdateInput!]!) {
  fileUpdate(files: $input) {
    files {
      ... on MediaImage {
        id
        preview {
        image {
          url
         altText
        }
       }
      }
    }
    userErrors {
      message
    }
  }
}`;

export const fetchImageDataQuery = `
query ($id: ID!) {
  node(id: $id) {
    ... on MediaImage {
      id
      image {
        id
        url
        altText
      }
    }
  }
}`;

export const fetchFileInfoQuery = `
  query( $first: Int,$query: String) {
    files(first: $first, query: $query,) {
      edges {
        node {
          createdAt
          alt
          ... on MediaImage {
            id
            image {
              id
              originalSrc: url
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const createNode = (type) => {
  let node = {
    products: `node {
      title
      vendor
      id
      createdAt
      media(first: 25) {
        edges {
          node {
            id
            preview {
              image {
                id
                url
                altText
              }
            }
          }
        }
      }
    }`,
    collections: `node {
      id
      title
      descriptionHtml
      image {
        id
        url
        altText
      }
    }`,
    files: `node {
      ... on MediaImage {
        id
        createdAt
        alt
        preview {
          image {
            id
            url
          }
        }
      }
    }`,
  };

  return node[type];
};

export const getRelatedProductsQuery = `
query ($query: String!) {
  products(first: 5, query: $query) {
    edges {
      node {
        id
        title
        handle
        description
        productType
        vendor
        tags
        onlineStorePreviewUrl
        featuredMedia {
          id
          preview {
            image {
              url
            }
          }
        }
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  }
}`;

export const getRelatedCollectionsQuery = `
query ($id: ID!) {
  collection(id: $id) {
    id
    title
    handle
    products(first: 5) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          vendor
          onlineStorePreviewUrl
          featuredMedia {
          id
          preview {
            image {
              url
             }
            }
          }
          tags
        }
      }
    }
  }
}`;
