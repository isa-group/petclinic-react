import { registerFormValidators } from "../../register/form/registerFormValidators";

export const loginFormInputs = [
  {
    tag: "Username",
    name: "username",
    type: "text",
    defaultValue: "",
    isRequired: true,
    validators: [registerFormValidators.notEmptyValidator],
  },
  {
    tag: "Password",
    name: "password",
    type: "password",
    defaultValue: "",
    isRequired: true,
    validators: [registerFormValidators.notEmptyValidator],
  },
];