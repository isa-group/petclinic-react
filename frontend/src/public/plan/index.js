import "../../static/css/pricing/pricingPage.css";

import { FaPaperPlane } from "react-icons/fa";
import { ImAirplane } from "react-icons/im";
import { BsFillRocketTakeoffFill} from "react-icons/bs";
import { useState } from "react";
import { TfiReload } from "react-icons/tfi";

import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";
import Plan from "./Plan";

import pricingService from "../../services/pricing.service";

const jwt = tokenService.getLocalAccessToken();

export default function PlanList() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [plans, setPlans] = useFetchState(
    [],
    `/api/v1/plans`,
    jwt,
    setMessage,
    setVisible
  );

  const modal = getErrorModal(setVisible, visible, message);

  function updateJWTToken() {
    tokenService.updateJWTToken()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {console.log(error)});
  }

  return (
    <div className="pricing-page-container">
      {modal}
      <button className="update-token-button" onClick={updateJWTToken}>
        <TfiReload className="update-token-icon" color="white"/>
        <div className="update-token-text">Update token</div>
      </button>
      <div>
        <h1 className="pricing-title">Pricing Plans</h1>
      </div>
      <div className="section-pricing">
        <div className="pricing-container">
          {plans?.map((plan) => {
            
            let icon;

            switch (plan.name) {
              case "BASIC":
                icon = <FaPaperPlane color="white" />;
                break;
              case "GOLD":
                icon = <ImAirplane color="white" />;
                break;
              case "PLATINUM":
                icon = <BsFillRocketTakeoffFill color="white" />;
                break;
              default:
                icon = <></>;
                break;
            }

            let valueMap = pricingService.getValueMapOfPlanFeatures(plan);

            return (
              <Plan
                icon={icon}
                name={plan.name}
                price={plan.monthlyPrice}
                maxPets={valueMap.pets}
                maxVisitsPerMonthAndPet={valueMap.visits}
                supportPriority={valueMap.supportPriority}
                haveVetSelection={valueMap.haveVetSelection}
                haveCalendar={valueMap.haveCalendar}
                havePetsDashboard={valueMap.havePetsDashboard}
                haveOnlineConsultations={valueMap.haveOnlineConsultation}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
