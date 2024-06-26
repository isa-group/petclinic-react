import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Label } from "reactstrap";
import tokenService from "../../services/token.service";
import pricingService from "../../services/pricing.service";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";
import getIdFromUrl from "../../util/getIdFromUrl";
import { fetchWithPricingInterceptor } from "pricing4react";

const jwt = tokenService.getLocalAccessToken();

export default function PlanEditAdmin() {
  const emptyItem = {
    id: "",
    name: "",
    monthlyPrice: 0.0,
    pets: true,
    visits: true,
    supportPriority: "",
    haveVetSelection: false,
    haveCalendar: false,
    havePetsDashboard: false,
    consultations: false,
  };
  const id = getIdFromUrl(2);
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [plan, setPlan] = useFetchState(
    emptyItem,
    `/api/v1/plans/${id}`,
    jwt,
    setMessage,
    setVisible,
    id
  );

  function handleChange(event) {
    const target = event.target;
    let value;
    try{
      value = parseInt(target.value);
    } catch (error){
      value = target.value;
    }

    const name = target.name;

    setPlan({ ...plan, [name]: value });
  }

  function handleCheckboxChange(event){
    const target = event.target;
    const name = target.name;

    setPlan({ ...plan, [name]: target.checked ? true : false });
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetchWithPricingInterceptor("/api/v1/plans" + (id !== "new" ? "/" + id : ""), {
      method: id !== "new" ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plan),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else window.location.href = "/plansAdmin";
      })
      .catch((message) => alert(message));
  }

  const modal = getErrorModal(setVisible, visible, message);

  useEffect(() => {
    if (plan.name !== undefined && plan.features !== undefined){
      let valueMap = pricingService.getValueMapOfPlanFeatures(plan);
      let formattedPlanObject = {
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        pets: valueMap.pets,
        visits: valueMap.visits,
        supportPriority: valueMap.supportPriority,
        haveVetSelection: valueMap.haveVetSelection,
        haveCalendar: valueMap.haveCalendar,
        havePetsDashboard: valueMap.havePetsDashboard,
        consultations: valueMap.consultations,
      }
      setPlan(formattedPlanObject);
    }
  }, [plan])

  return (
    <div className="auth-page-container">
      {<h2>{id !== "new" ? "Edit Plan" : "Add Plan"}</h2>}
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
              value={plan.name || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="monthlyPrice" className="custom-form-input-label">
              Price (in €)
            </Label>
            <Input
              type="number"
              step="0.01"
              required
              name="monthlyPrice"
              id="monthlyPrice"
              value={plan.monthlyPrice === undefined ? "" : plan.monthlyPrice}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="maxPets" className="custom-form-input-label">
              Max Pets
            </Label>
            <Input
              type="number"
              required
              name="pets"
              id="pets"
              value={plan.pets || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="maxVisitsPerMonthAndPet" className="custom-form-input-label">
              Max Visits per Pet and Month
            </Label>
            <Input
              type="number"
              required
              name="visits"
              id="visits"
              value={plan.visits || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="supportPriority" className="custom-form-input-label">
              Support Priority
            </Label>
            <Input
              id="supportPriority"
              name="supportPriority"
              required
              type="select"
              value={plan.supportPriority || ""}
              onChange={handleChange}
              className="custom-input"
            >
              <option value="">None</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </Input>
          </div>
          <div className="checkbox-row">
            Have vet selection
            <label className="checkbox-container">
              <Input type="checkbox" name="haveVetSelection" id="haveVetSelection" checked={plan.haveVetSelection} onChange={handleCheckboxChange}/>
              <div className="checkbox-checkmark"></div>
            </label>
          </div>
          <div className="checkbox-row">
            Have calendar
            <label className="checkbox-container">
              <Input type="checkbox" name="haveCalendar" id="haveCalendar" checked={plan.haveCalendar} onChange={handleCheckboxChange}/>
              <div className="checkbox-checkmark"></div>
            </label>
          </div>
          <div className="checkbox-row">
            Have pets dashboard
            <label className="checkbox-container">
              <Input type="checkbox" name="havePetsDashboard" id="havePetsDashboard" checked={plan.havePetsDashboard} onChange={handleCheckboxChange}/>
              <div className="checkbox-checkmark"></div>
            </label>
          </div>
          <div className="checkbox-row">
            Have online consultations
            <label className="checkbox-container">
              <Input type="checkbox" name="consultations" id="consultations" checked={plan.consultations} onChange={handleCheckboxChange}/>
              <div className="checkbox-checkmark"></div>
            </label>
          </div>
          <div className="custom-button-row">
            <button className="auth-button">Save</button>
            <Link
              to={`/plansAdmin`}
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
