import React from "react";
import { Modal, Text } from "@shopify/polaris";

export function BannerModal(props) {
  return (
    <Modal {...props}>
      {props.isScrollTo ? (
        props.children
      ) : (
        <Modal.Section>
          <Text as="p">{props.subtitle}</Text>
          {props.children}
        </Modal.Section>
      )}
    </Modal>
  );
}
