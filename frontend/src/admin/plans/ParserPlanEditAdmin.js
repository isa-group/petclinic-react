import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";
import getIdFromUrl from "../../util/getIdFromUrl";
import { fetchWithInterceptor } from "../../services/api";

const jwt = tokenService.getLocalAccessToken();

export default function ParserPlanEditAdmin() {
  const emptyItem = {
    id: "",
    maxPetsParser: "",
    maxVisitsPerMonthAndPetParser: "",
    supportPriorityParser: "",
    haveVetSelectionParser: "",
    haveCalendarParser: "",
    havePetsDashboardParser: "",
    haveOnlineConsultationsParser: "",
  };
  const id = getIdFromUrl(2);
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [parserPlan, setParserPlan] = useFetchState(
    emptyItem,
    `/api/v1/plans/parser/${id}`,
    jwt,
    setMessage,
    setVisible,
    id
  );

  function handleInfoModalVisible() {
    setVisibleInfo(!visibleInfo);
  }

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setParserPlan({ ...parserPlan, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetchWithInterceptor(`/api/v1/plans/parser/${parserPlan.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parserPlan),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else setVisibleInfo(true);
      })
      .catch((message) => alert(message));
  }

  const modal = getErrorModal(setVisible, visible, message);
  const infoModalCloseBtn = (
    <button
      className="close"
      onClick={() => handleInfoModalVisible()}
      type="button"
    >
      &times;
    </button>
  );

  return (
    <div className="auth-page-container">
      <h2 style={{marginTop: "-5%"}}>Edit Parser Plan</h2>
      {modal}
      <Modal
          isOpen={visibleInfo}
          toggle={() => handleInfoModalVisible()}
          keyboard={false}
        >
          <ModalHeader
            toggle={() => handleInfoModalVisible()}
            close={infoModalCloseBtn}
          >
            Change Applied!
          </ModalHeader>
          <ModalBody>Parser plan updated successfully!</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => handleInfoModalVisible()}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      <h5 style={{ color: "#525151", margin: "30px 0" }}>
          In this view you can edit the logic with whom pricing plans will be
          automatically applied to users
        </h5>
      <div className="auth-form-container">
        <Form onSubmit={handleSubmit}>
          <div className="custom-form-input">
            <Label for="maxPetsParser" className="custom-form-input-label">
              Max Pets Parser
            </Label>
            <Input
              type="text"
              name="maxPetsParser"
              id="maxPetsParser"
              value={parserPlan.maxPetsParser || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="maxVisitsPerMonthAndPetParser" className="custom-form-input-label">
              Max Visits per Pet and Month Parser
            </Label>
            <Input
              type="text"
              name="maxVisitsPerMonthAndPetParser"
              id="maxVisitsPerMonthAndPetParser"
              value={parserPlan.maxVisitsPerMonthAndPetParser || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="supportPriorityParser" className="custom-form-input-label">
              Support Priority Parser
            </Label>
            <Input
              id="supportPriorityParser"
              name="supportPriorityParser"
              type="text"
              value={parserPlan.supportPriorityParser || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="haveVetSelectionParser" className="custom-form-input-label">
                Have vet selection Parser
            </Label> 
            <Input
              id="haveVetSelectionParser"
              name="haveVetSelectionParser"
              type="text"
              value={parserPlan.haveVetSelectionParser || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="haveCalendarParser" className="custom-form-input-label">
                Have calendar Parser
            </Label>
            <Input
              id="haveCalendarParser"
              name="haveCalendarParser"
              type="text"
              value={parserPlan.haveCalendarParser || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="havePetsDashboardParser" className="custom-form-input-label">
                Have pets dashboard Parser
            </Label> 
            <Input
              id="havePetsDashboardParser"
              name="havePetsDashboardParser"
              type="text"
              value={parserPlan.havePetsDashboardParser || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="haveOnlineConsultationsParser" className="custom-form-input-label">
                Have online consultations Parser
            </Label> 
            <Input
              id="haveOnlineConsultationsParser"
              name="haveOnlineConsultationsParser"
              type="text"
              value={parserPlan.haveOnlineConsultationsParser || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-button-row">
            <button className="auth-button">Save</button>
            <Link
              to={`/`}
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
