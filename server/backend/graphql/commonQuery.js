export const marketsQuery = `
query Markets ($first:Int, $after: String, $last:Int, $before: String){
  markets(first: $first, after: $after, last:$last, before: $before) {
    nodes {
      name
      regions(first:200){
        nodes{
          name 
        }
      }
    }
    pageInfo{
      startCursor
      endCursor
      hasNextPage
    }
  }
}`;

export const fetchShopifyImageQuery = `
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

export const productcountQuery = `query {
  productsCount(limit: null) {
      count
      precision
   }
}`;

export const fetchAllWebhookQuery = `
 query {
  webhookSubscriptions(first: 20) {
    nodes {
        id
        topic
        endpoint {
          __typename
          ... on WebhookHttpEndpoint {
            callbackUrl
          }
          ... on WebhookEventBridgeEndpoint {
            arn
          }
          ... on WebhookPubSubEndpoint {
            pubSubProject
            pubSubTopic
          }
        }
    }
  }
}
`;

export const deleteWebhookQuery = `
mutation webhookSubscriptionDelete($id: ID!) {
  webhookSubscriptionDelete(id: $id) {
    userErrors {
      field
      message
    }
    deletedWebhookSubscriptionId
  }
}
`;
