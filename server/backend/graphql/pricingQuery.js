export const appCreateOnetimeQuery = `
mutation appPurchaseOneTimeCreate($name: String!, $price: MoneyInput!, $returnUrl: URL! , $test: Boolean) {
    appPurchaseOneTimeCreate(name: $name, price: $price, returnUrl: $returnUrl, test: $test) {
        appPurchaseOneTime {
        id
        status
      }
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }`;

export const recurringAppCreateQuery = `
  mutation appSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $test: Boolean, $trialDays : Int) {
    appSubscriptionCreate(name: $name, lineItems: $lineItems, returnUrl: $returnUrl,test: $test, trialDays:$trialDays) {
      appSubscription {
        id
      }
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }`;

export const appSubscriptionCancelQuery = `
  mutation appSubscriptionCancel($id: ID!) {
    appSubscriptionCancel(id: $id) {
        appSubscription {
             id
            status
        }
        userErrors {
             field
            message
        }
    }
 }`;
