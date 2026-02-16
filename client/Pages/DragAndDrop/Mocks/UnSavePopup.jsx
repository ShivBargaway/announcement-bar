import React, { useCallback } from "react";
import { Modal, Text } from "@shopify/polaris";
import { t } from "i18next";
import { navigate } from "../../../Components/Common/NavigationMenu";

export default function UnSavePopup(props) {
  const { setUnSave, unSave, onSubmit, annoucementId } = props;
  const setNavigate = navigate();
  const handleUnSaved = useCallback(() => {
    setNavigate("/");
  }, []);
  const handleClose = useCallback(() => {
    setUnSave(false);
  }, []);
  return (
    <Modal
      open={unSave}
      title={t("common.You have unsaved changes")}
      onClose={handleClose}
      primaryAction={{
        content: t(`common.${"Save Changes"}`),
        onAction: () => onSubmit(!annoucementId ? "save" : "Update", true),
      }}
      secondaryActions={[
        {
          content: t(`common.${"Leave widthout saving"}`),
          onAction: handleUnSaved,
        },
      ]}
    >
      <Modal.Section>
        <Text>
          {t("common.Your campaign has unsaved changes. Changes will be lost if you leave without saving.")}
        </Text>
      </Modal.Section>
    </Modal>
  );
}
