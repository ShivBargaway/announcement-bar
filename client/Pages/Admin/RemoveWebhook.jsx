import React, { useCallback, useState } from "react";
import { Button, Modal, Text } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";

export default function RemoveWebhook({ row }) {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const fetch = useAuthenticatedFetch();

  const handleRemoveWebhook = useCallback(async () => {
    const response = await fetch.post("/admin/removeWebhook", { shopUrl: row.shopUrl });
    setMessage(response?.data);
  }, [row]);

  const closeModal = useCallback(() => {
    setOpenModal(false);
    setMessage("");
  }, []);

  return (
    <>
      <Button variant="primary" onClick={() => setOpenModal(true)}>
        <Text variant="bodyMd">Remove Webhook</Text>
      </Button>
      <Modal
        open={openModal}
        onClose={closeModal}
        title="Remove Webhook"
        primaryAction={{ content: "Remove Webhook", onAction: handleRemoveWebhook }}
        secondaryActions={[{ content: "Cancel", onAction: closeModal }]}
      >
        <Modal.Section>
          <p>Are you sure you want to remove the webhook?</p>
          <br />
          <Text variant="headingMd" alignment="center" tone="success">
            {message}
          </Text>
        </Modal.Section>
      </Modal>
    </>
  );
}
