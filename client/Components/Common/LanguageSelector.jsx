import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { formFields, initialValues } from "@/Assets/Mocks/Language.mock";
import CommonForm from "@/Components/Common/CommonForm";
import { ProfileContext } from "@/Context/ProfileContext";
import { ToastContext } from "@/Context/ToastContext";

function LanguageSelector() {
  const { t } = useTranslation();
  const formRef = useRef();
  const fetch = useAuthenticatedFetch();
  const { updateProfileData, profileData } = useContext(ProfileContext);
  const [values, setValues] = useState({});
  const { showToast } = useContext(ToastContext);

  const handleSubmit = async (value) => {
    const response = await fetch.put(`/user/update`, value);
    if (response) showToast(t("common.Update Successfully"));
    updateProfileData(response.data);
  };

  useEffect(() => {
    if (!profileData?.appLanguage) {
      setValues({ ...initialValues });
    } else {
      setValues({ ...initialValues, appLanguage: profileData?.appLanguage });
    }
  }, [profileData]);

  return (
    <div>
      <CommonForm
        onSubmit={handleSubmit}
        initialValues={values}
        formFields={formFields()}
        title={t("common.Select language")}
        formRef={formRef}
        isSave={true}
        enableReinitialize={true}
        noValueChanged={false}
      />
    </div>
  );
}

export default LanguageSelector;
