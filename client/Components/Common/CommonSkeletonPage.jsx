import React from "react";
import { Card, Layout, SkeletonBodyText, SkeletonPage, Text } from "@shopify/polaris";

export default function CommonSkeletonPage() {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
          <br />
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
          <br />
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
          <br />
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
          <br />
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card>
            <SkeletonBodyText lines={2} />
            <br />
            <SkeletonBodyText lines={1} />
          </Card>
          <br />
          <Card subdued>
            <SkeletonBodyText lines={2} />
            <br />
            <SkeletonBodyText lines={2} />
          </Card>
          <br />
          <Card subdued>
            <SkeletonBodyText lines={2} />
            <br />
            <SkeletonBodyText lines={2} />
          </Card>
          <br />
          <Card subdued>
            <SkeletonBodyText lines={2} />
            <br />
            <SkeletonBodyText lines={2} />
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
