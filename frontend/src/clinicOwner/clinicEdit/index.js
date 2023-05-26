import "../../static/css/auth/authButton.css";
import "../../static/css/auth/authPage.css";
import tokenService from "../../services/token.service";
import getIdFromUrl from "../../util/getIdFromUrl";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";
import { clinicEditInputs } from "./form/clinicEditInputs";
import FormGenerator from "../../components/formGenerator/formGenerator";
import { useState, useEffect, useRef } from "react";

const user = tokenService.getUser();
const jwt = tokenService.getLocalAccessToken();

export default function EditClinic() {
  const id = getIdFromUrl(2);

  const emptyItem = {
    id: "",
    name: "",
    address: "",
    telephone: "",
    plan: null,
  };
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [clinic, setClinic] = useFetchState(
    emptyItem,
    `/api/v1/clinics/${id}`,
    jwt,
    setMessage,
    setVisible,
    id
  );
  const [dataLoaded, setDataLoaded] = useState(false);

  const editClinicFormRef = useRef(null);

  function handleSubmit({ values }) {
    if (!editClinicFormRef.current.validate()) return;
    console.log(values);
  }

  useEffect(() => {
    if (clinic.id !== "") {
      clinicEditInputs.forEach((input) => {
        input.defaultValue = clinic[input.name];
        setDataLoaded(true);
      });
    } else {
      clinicEditInputs.forEach((input) => {
        input.defaultValue = "";
      });
    }
  }, [clinic]);

  const modal = getErrorModal(setVisible, visible, message);

  return (
    <div className="auth-page-container">
      {<h2>{id !== "new" ? "Edit Clinic" : "Add Clinic"}</h2>}
      {modal}
      <div className="auth-form-container">
        {dataLoaded ? (
          <FormGenerator
            ref={editClinicFormRef}
            inputs={clinicEditInputs}
            onSubmit={handleSubmit}
            buttonText="Edit"
            buttonClassName="auth-button"
          />
        ) : (
          <FormGenerator
            ref={editClinicFormRef}
            inputs={clinicEditInputs}
            onSubmit={handleSubmit}
            buttonText="Add"
            buttonClassName="auth-button"
          />
        )}
      </div>
    </div>
  );
}
