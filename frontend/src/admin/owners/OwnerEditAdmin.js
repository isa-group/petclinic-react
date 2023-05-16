import { useEffect, useRef, useState } from "react";
import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";
import getIdFromUrl from "../../util/getIdFromUrl";
import FormGenerator from "../../components/formGenerator/formGenerator";
import { ownerEditInputs } from "./form/ownerEditInputs";
import "../../static/css/auth/authButton.css";
import "../../static/css/auth/authPage.css";

const jwt = tokenService.getLocalAccessToken();

export default function OwnerEditAdmin() {
  const emptyItem = {
    id: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    telephone: "",
    plan: null,
  };
  const id = getIdFromUrl(2);
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [owner, setOwner] = useFetchState(
    emptyItem,
    `/api/v1/owners/${id}`,
    jwt,
    setMessage,
    setVisible,
    setLoaded,
    id
  );

  const ownerEditFormRef = useRef(null);

  function handleSubmit({ values }) {

    if (!ownerEditFormRef.current.validate()) return;

    fetch("/api/v1/owners" + (owner.id ? "/" + owner.id : ""), {
      method: owner.id ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...owner, ...values }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else window.location.href = "/owners";
      })
      .catch((message) => alert(message));
  }

  const modal = getErrorModal(setVisible, visible, message);

  useEffect(() => {
    if (id !== "new") {
      ownerEditInputs.forEach((input) => {
        input.defaultValue = owner[input.name];
      });
    }else{
      ownerEditInputs.forEach((input) => {
        input.defaultValue = "";
      })
    }
  }, [loaded]);

  return (
    <div className="auth-page-container">
      {<h2>{id !== "new" ? "Edit Owner" : "Add Owner"}</h2>}
      {modal}
      <div className="auth-form-container">
        {
          loaded &&
          <FormGenerator
          ref={ownerEditFormRef}
          inputs={ownerEditInputs}
          onSubmit={handleSubmit}
          buttonText={id !== "new" ? "Save" : "Add"}
          buttonClassName="auth-button"
        />
        }
        {
          !loaded &&
          <FormGenerator
          ref={ownerEditFormRef}
          inputs={ownerEditInputs}
          onSubmit={handleSubmit}
          buttonText={id !== "new" ? "Save" : "Add"}
          buttonClassName="auth-button"
        />
        }
      </div>
    </div>
  );
}
