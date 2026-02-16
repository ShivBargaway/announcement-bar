import { BlockStack, Page, Text } from "@shopify/polaris";

export default function PrivacyPolicy() {
  return (
    <Page title="Webrex: SEO & Speed Optimizer Privacy Policy">
      <BlockStack gap="500">
        <Text>
          Webrex: SEO & Speed Optimizer is an application that enables Rich Snippets for your store, products,
          product reviews, blog articles, and social media profiles. It provides search engines with snippets of
          information to enhance search results, distinguishing your store from the competition. Rich snippets are
          structured data markups that allow search engines to better understand the information contained in your
          store, products, and blog articles.
        </Text>
        <Text variant="headingXl" as="h4">
          Personal Information the App Collects
        </Text>
        <Text>
          Upon installation of the app, we gain automatic access to certain types of information from your Shopify
          account: Shopify Profile, Products, and app/uninstall Webhook API.
        </Text>
        <Text>
          Additionally, we collect the following types of personal information from you and/or your customers:
          Profile product and order Information about you and others who may access the app on behalf of your
          store, such as your name, address, email address, phone number, and billing information.
        </Text>
        <Text variant="headingXl" as="h4">
          Usage of Personal Information
        </Text>
        <Text>
          We use the personal information collected from you and your customers to provide the service and operate
          the app. In addition, this personal information is used to communicate with you, optimize or improve the
          app, and provide you with information or advertising relating to our products or services. Furthermore,
          we may also share your personal information to comply with applicable laws and regulations, to respond to
          a subpoena, search warrant, or other lawful request for information we receive, or to otherwise protect
          our rights.
        </Text>
        <Text variant="headingXl" as="h4">
          Data Retention
        </Text>
        <Text>
          When you place an order through the site, we will maintain your order information for our records unless
          and until you ask us to delete this information.
        </Text>
        <Text variant="headingXl" as="h4">
          Changes to Privacy Policy
        </Text>
        <Text>
          We may update this privacy policy from time to time to reflect changes to our practices or for other
          operational, legal, or regulatory reasons.
        </Text>
        <Text variant="headingXl" as="h4">
          Contact Us
        </Text>
        <Text>
          For more information about our privacy practices, if you have questions, or if you would like to make a
          complaint, please contact us by e-mail at hello@webrexstudio.com or by mail using the details provided
          below:
        </Text>
        <Text>209, Saumya Square near Goverdhan party plot, Thaltej 380052, Ahmedabad, India.</Text>
        <Text></Text>
      </BlockStack>
    </Page>
  );
}
