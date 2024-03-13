import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Table } from "reactstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import tokenService from "../../services/token.service";
import pricingService from "services/pricing.service";
import useFetchState from "../../util/useFetchState";
import getErrorModal from "../../util/getErrorModal";
import deleteFromList from "../../util/deleteFromList";
import "../../static/css/admin/adminPage.css";

const jwt = tokenService.getLocalAccessToken();

export default function PlanListAdmin() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [plans, setPlans] = useFetchState(
    [],
    `/api/v1/plans`,
    jwt,
    setMessage,
    setVisible
  );
  const [alerts, setAlerts] = useState([]);

  const planList = plans.map((plan) => {

    plan["id"] = plan.name;
    let valueMap = pricingService.getValueMapOfPlanFeatures(plan);

    return (
      <tr key={plan.id}>
        <td className="text-center">{plan.name}</td>
        <td className="text-center">{`${plan.monthlyPrice}€`}</td>
        <td className="text-center">{valueMap.pets}</td>
        <td className="text-center">{valueMap.visits}</td>
        <td className="text-center">{valueMap.supportPriority}</td>
        <td className="text-center">{valueMap.haveVetSelection ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
        <td className="text-center">{valueMap.haveCalendar ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
        <td className="text-center">{valueMap.havePetsDashboard ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
        <td className="text-center">{valueMap.haveOnlineConsultation ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
        <td className="text-center">
          <ButtonGroup>
            <Button
              size="sm"
              color="primary"
              aria-label={"edit-" + plan.name}
              tag={Link}
              to={"/plansAdmin/" + plan.name}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="danger"
              aria-label={"delete-" + plan.name}
              onClick={() =>
                deleteFromList(
                  `/api/v1/plans/${plan.name}`,
                  plan.id,
                  [plans, setPlans],
                  [alerts, setAlerts],
                  setMessage,
                  setVisible
                )
              }
            >
              Delete
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  });

  const modal = getErrorModal(setVisible, visible, message);

  return (
    <div>
      <div className="admin-page-container">
        <h1 className="text-center">Plans</h1>
        {alerts.map((a) => a.alert)}
        {modal}
        <div className="float-right">
          <Button color="success" tag={Link} to="/plansAdmin/new">
            Add Plan
          </Button>
        </div>
        <div>
          <Table aria-label="owners" className="mt-4">
            <thead>
              <tr>
                <th width="12%" className="text-center">Name</th>
                <th width="12%" className="text-center">Price</th>
                <th width="12%" className="text-center">Max Pets</th>
                <th width="12%" className="text-center">Max Visits Pet/Month</th>
                <th width="12%" className="text-center">Support Priority</th>
                <th width="5%" className="text-center">Vet Selection</th>
                <th width="5%" className="text-center">Calendar</th>
                <th width="5%" className="text-center">Pets Dashboard</th>
                <th width="5%" className="text-center">Online Consultations</th>
                <th width="20%" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{planList}</tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
