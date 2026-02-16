import { useContext } from "react";
import FrillEmbeddedWidget from "@/Components/Common/FrillEmbeddedWidget";
import { ProfileContext } from "@/Context/ProfileContext";

const Feedback = () => {
  const { profileData } = useContext(ProfileContext);

  return (
    <div className="feedback-page">
      {profileData?.frillSSOToken && (
        <FrillEmbeddedWidget widgetKey="5a75c18d-d063-49bd-a721-4876e1c559ca" frame={true} />
      )}
    </div>
  );
};

export default Feedback;
