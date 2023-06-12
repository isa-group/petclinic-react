import { useState } from "react";
import { Link } from "react-router-dom";
import { Button} from "reactstrap";
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import getErrorModal from "../../util/getErrorModal";
import "../../static/css/admin/adminPage.css";

const jwt = tokenService.getLocalAccessToken();

export default function ParserPlanListAdmin() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(window.location.search.includes("success"));
  const [parserPlans, setParserPlans] = useFetchState(
    [],
    `/api/v1/plans/parser`,
    jwt,
    setMessage,
    setVisible
  );
  const [alerts, setAlerts] = useState([]);

  const modal = getErrorModal(setVisible, visible, message);

  const infoModal = getErrorModal(setVisibleInfo, visibleInfo, "Parser plan updated successfully!");

  return (
    <div>
      <div className="admin-page-container">
        <h1 className="text-center mt-5">Parser Plan</h1>
        {alerts.map((a) => a.alert)}
        {modal}
        {infoModal}
        <h5 style={{ color: "#525151", margin: "30px 0" }}>
          In this view you can edit the logic with whom pricing plans will be
          automatically applied to users
        </h5>
        {parserPlans.length > 0 && (
          <Button
            size="lg"
            color="primary"
            aria-label={"edit-" + parserPlans[0].id}
            tag={Link}
            to={"/parserPlansAdmin/" + parserPlans[0].id}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
