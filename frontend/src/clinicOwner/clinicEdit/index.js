import "../../static/css/auth/authButton.css";
import "../../static/css/auth/authPage.css";
import tokenService from "../../services/token.service";
import getIdFromUrl from "../../util/getIdFromUrl";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";
import { useState } from "react";
import { Form, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";

const user = tokenService.getUser();
const jwt = tokenService.getLocalAccessToken();

export default function EditClinic() {
  const id = getIdFromUrl(2);
  const navigator = useNavigate();

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

  const [plans, setPlans] = useFetchState(
    [],
    `/api/v1/plans`,
    jwt,
    setMessage,
    setVisible
  );

  function handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "plan"){
      setClinic({ ...clinic, [name]: {
        name: value
      } });
    }else{
      setClinic({ ...clinic, [name]: value });
    }
  }

  function handleSubmit(event) {
    
    event.preventDefault();

    clinic.plan = plans.find((plan) => plan.name === clinic.plan.name);

    if (id !== "new") {
      fetch(`/api/v1/clinics${id !== "new" ? `/${id}` : ""}`, {
        method: id !== "new" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(clinic),
      })
      .then((res) => {
        navigator("/clinics");
      })
      .catch((err) => {
        setMessage(err.message);
      });;
    }
  }

  const modal = getErrorModal(setVisible, visible, message);

  return (
    <div className="auth-page-container">
      {<h2>{id !== "new" ? "Edit Clinic" : "Add Clinic"}</h2>}
      {modal}
      <div className="auth-form-container">
        <Form onSubmit={handleSubmit}>
          <div className="custom-form-input">
            <Label for="name" className="custom-form-input-label">
              Name
            </Label>
            <Input
              type="text"
              required
              name="name"
              id="name"
              value={clinic.name || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="address" className="custom-form-input-label">
              Address
            </Label>
            <Input
              type="text"
              required
              name="address"
              id="address"
              value={clinic.address || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="telephone" className="custom-form-input-label">
                Telephone
            </Label>
            <Input
              type="text"
              required
              name="telephone"
              id="telephone"
              value={clinic.telephone || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="plan" className="custom-form-input-label">
              Plan
            </Label>
            <Input
              id="plan"
              name="plan"
              required
              type="select"
              value={clinic.plan?.name || ""}
              onChange={handleChange}
              className="custom-input"
            >
              <option value="">None</option>
              {plans.map((plan) => {
                return(
                    <option value={plan.name}>{plan.name}</option>
                );
              })}
              
            </Input>
          </div>
          <div className="custom-button-row">
            <button className="auth-button">Save</button>
            <Link
              to={`/clinicOwners`}
              className="auth-button"
              style={{ textDecoration: "none" }}
            >
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
