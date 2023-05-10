import { registerFormVetInputs } from "./registerFormVetInputs";
import { registerFormValidators } from "./registerFormValidators";

export const registerFormOwnerInputs = [
  ...registerFormVetInputs,
  {
    tag: "Address",
    name: "address",
    type: "text",
    defaultValue: "",
    isRequired: true,
    validators: [registerFormValidators.notEmptyValidator],
  },
  {
    tag: "Telephone",
    name: "telephone",
    type: "text",
    defaultValue: "",
    isRequired: true,
    validators: [registerFormValidators.notEmptyValidator, registerFormValidators.telephoneValidator],
  },
];
