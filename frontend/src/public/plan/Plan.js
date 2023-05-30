import "../../static/css/pricing/pricingPage.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BsDot } from "react-icons/bs";

export default function Plan({name, price, icon, maxPets, maxVisitsPerMonthAndPet, 
                              supportPriority, haveVetSelection, haveCalendar, 
                              havePetsDashboard, haveOnlineConsultations}){
    
    const options = {
        "pets": maxPets,
        "visit per month and pet": maxVisitsPerMonthAndPet,
        "support priority": supportPriority,
        "Vet Selection for Visits": haveVetSelection,
        "Calendar with Upcoming Visits": haveCalendar,
        "Dashboard of your Pets": havePetsDashboard,
        "Online Consultation": haveOnlineConsultations
    }
    
    return(
        <div className="pricing-card text-center">
              <div className="title">
                <div className="icon">
                    {icon}
                </div>
                <h2>{name}</h2>
              </div>
              <div className="plan-price">
                <h4>{price === 0 ? "FREE" : `${price}€`}</h4>
              </div>
              <div className="option">
                <ul>
                {
                    Object.keys(options)?.map((option) => {
                        if (typeof options[option] === "boolean"){
                            return (
                                <li>
                                    {options[option] ? <FaCheck color="green" /> : <FaTimes color="red" />} {option}
                                </li>
                            );
                        }else{
                            return(
                                <li>
                                    <BsDot color="white" /> {options[option]} {option}
                                </li>
                            );
                        }
                    })
                }
                </ul>
              </div>
            </div>
    )
}