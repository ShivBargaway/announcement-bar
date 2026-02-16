import React, { useContext } from "react";
import { Modal } from "@shopify/polaris";
import { ProfileContext } from "@/Context/ProfileContext";
import TabularPricing from "./TabularPricing";

export default function PricingGate() {
  return (
    <Modal open={true} onClose={() => {}} title="Upgrade to a paid plan">
      <Modal.Section>
        <TabularPricing hasBillingButton={true} hideFreePlan={true} />
      </Modal.Section>
    </Modal>
  );
}
