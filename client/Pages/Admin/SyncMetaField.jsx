import React, { useCallback, useState } from "react";
import { Button, InlineStack, Modal, Text } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";

function SyncMetaField({ row }) {
  const [syncMeta, setSyncMeta] = useState(false);
  const [metafieldRes, setMetafieldRes] = useState(null);
  const fetch = useAuthenticatedFetch();

  const openSyncMetafieldPopup = useCallback(() => {
    setSyncMeta(true);
    setMetafieldRes("");
  }, []);

  const handleSyncMeta = useCallback(async () => {
    try {
      const res = await fetch.put("admin/syncMetafield", row);
      if (res.success) {
        setMetafieldRes(
          <Text variant="headingSm" as="h6" tone="success">
            Sync Successful
          </Text>
        );
      } else {
        setMetafieldRes(
          <Text variant="headingSm" as="h6" tone="critical">
            Error in sync: {res.message}
          </Text>
        );
      }
    } catch (error) {
      setMetafieldRes(
        <Text variant="headingSm" as="h6" tone="critical">
          Error in sync: {error.message}
        </Text>
      );
    }
  }, []);

  const handleSyncMetaClose = useCallback(() => {
    setSyncMeta(false);
  }, []);

  return (
    <>
      <Button onClick={openSyncMetafieldPopup}>Sync Metafield</Button>
      <Modal
        open={syncMeta}
        title="Are you sure you want to sync Metafield?"
        onClose={handleSyncMetaClose}
        primaryAction={{
          content: "Yes",
          onAction: handleSyncMeta,
        }}
        secondaryActions={[
          {
            content: "No",
            onAction: handleSyncMetaClose,
          },
        ]}
        size="small"
      >
        <InlineStack align="center">{metafieldRes}</InlineStack>
      </Modal>
    </>
  );
}

export default SyncMetaField;
