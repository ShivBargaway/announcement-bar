import React, { useCallback, useContext } from "react";
import { Modal } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { ProfileContext } from "@/Context/ProfileContext";
import { navigate } from "../../Components/Common/NavigationMenu";

function VideoAnnouncement({ videoModalStatus, setVideoModalStatus, videoLink, skip, setTemplateModal }) {
  const setNavigate = navigate();
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const fetch = useAuthenticatedFetch();

  const onSkip = useCallback(async () => {
    const showVideoRequest = 1;
    await fetch.put("/user/update", JSON.stringify({ ...profileData, showVideoRequest: showVideoRequest }));
    updateProfileData({ ...profileData, showVideoRequest: showVideoRequest });
    setVideoModalStatus(false);
    setTemplateModal(true);
  }, [setNavigate, profileData, setTemplateModal]);

  const handleClose = useCallback(async () => {
    if (!skip) {
      setVideoModalStatus(false);
    } else {
      setVideoModalStatus(false);
      setTemplateModal(true);
      const showVideoRequest = 1;
      await fetch.put("/user/update", JSON.stringify({ ...profileData, showVideoRequest: showVideoRequest }));
      updateProfileData({ ...profileData, showVideoRequest: showVideoRequest });
    }
  }, [setVideoModalStatus, skip, profileData, setTemplateModal]);
  return (
    <>
      <Modal
        title={t("common.Learn About Add Announcement")}
        open={videoModalStatus}
        size="large"
        onClose={handleClose}
        primaryAction={
          skip === false
            ? null
            : {
                content: `${t("common.Skip And Add Announcement")}`,
                onAction: onSkip,
              }
        }
      >
        <Modal.Section>
          <iframe
            src={videoLink}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            autoPlay="0"
            style={{ height: "540px", width: "100%", display: "inline-block", verticalAlign: "middle" }}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </Modal.Section>
      </Modal>
    </>
  );
}

export default VideoAnnouncement;
