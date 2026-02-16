import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { formFields, initialValues } from "@/Assets/Mocks/Login.mock";
import CommonForm from "@/Components/Common/CommonForm";
import { ToastContext } from "@/Context/ToastContext";
import { getLocalStorageItem, isAdminPanelAccess, setLocalStorageItem } from "@/Utils/Index";

function Login() {
  const fetch = useAuthenticatedFetch();
  const [formValues, setFormValues] = useState(initialValues);
  const formRef = useRef();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const response = await fetch.post(`admin/login`, { ...values });
        showToast(`Login successfully`);
        setLocalStorageItem("adminPanelAccessToken", response.data.token);
        const accessToken = getLocalStorageItem("adminPanelAccessToken");
        navigate("/admin/user");
      } catch (err) {
        console.error(err);
      }
    },
    [history]
  );

  const submitForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }, []);

  if (isAdminPanelAccess()) {
    return <Navigate to="/admin/user" />;
  }

  return (
    <div className="login-page">
      <CommonForm
        onSubmit={handleSubmit}
        initialValues={formValues}
        formFields={formFields}
        title="Admin Pannel"
        formRef={formRef}
        isSave={false}
      />
      <br />
      <Button variant="primary" onClick={submitForm}>
        Login
      </Button>
    </div>
  );
}

export default Login;
