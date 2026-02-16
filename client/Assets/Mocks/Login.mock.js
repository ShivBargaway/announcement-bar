export const formFields = [
  {
    id: "email",
    name: "email",
    label: "Email",
    validated: true,
    type: "email",
    errormsg: "Email is required",
  },
  {
    id: "password",
    name: "password",
    label: "Password",
    validated: true,
    type: "password",
    errormsg: "Password is required",
  },
  {
    id: "adminkey",
    name: "adminKey",
    label: "AdminKey",
    validated: true,
    type: "text",
    errormsg: "Admin Key is required",
  },
];

export const initialValues = {
  email: "",
  password: "",
  adminKey: "",
};
