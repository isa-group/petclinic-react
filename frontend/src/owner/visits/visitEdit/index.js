import "../../../static/css/auth/authButton.css";
import "../../../static/css/auth/authPage.css";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import FormGenerator from "../../../components/formGenerator/formGenerator";
import { visitEditFormInputs } from "./form/visitEditFormInputs";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import { Feature, On, Default, feature } from "pricing4react";
import jwt_decode from "jwt-decode";
import { VetOptions } from "./VetOptions";

export default function OwnerVisitEdit() {
  let [visit, setVisit] = useState({
    id: null,
    datetime: "",
    description: "",
    pet: {},
    vet: {
      id: null,
      city: "",
    },
  });

  let [pet, setPet] = useState({});
  let [city, setCity] = useState(null);
  let [vets, setVets] = useState([]);
  let [message, setMessage] = useState(null);
  let [modalShow, setModalShow] = useState(false);
  let [cities, setCities] = useState([]);

  let visitEditFormRef = useRef(null);

  const pricingToken = jwt_decode(localStorage.getItem("pricingToken"));
  const currPlan = pricingToken.planContext.name;

  const jwt = JSON.parse(window.localStorage.getItem("jwt"));
  let pathArray = window.location.pathname.split("/");
  const petId = pathArray[2];
  const visitId = pathArray[4];

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let visitAux = { ...visit };
    if (name === "vet") {
      visitAux[name].id = value;
    } else visitAux[name] = value;
    setVisit(visitAux);
  }

  function handleCityChange({ value }) {
    setCity(value);

    if (currPlan === "BASIC") {
      vets = vets.filter((vet) => vet.city === value);
      let randomIndex = Math.floor(Math.random() * vets.length);
      visit.vet = vets[randomIndex];
    }
  }

  function handleShow() {
    setModalShow(!modalShow);
  }

  function VetSelectionInput({ visit, datetime }) {
    return (
      <Feature>
        <On expression={feature("vetSelection")}>
          <Input
            type="select"
            required
            name="vet"
            id="vet"
            value={visit.vet.id ? visit.vet.id : ""}
            onChange={handleChange}
          >
            <VetOptions vets={vets} city={city} />
          </Input>
        </On>
        <Default>
          <Input
            type="text"
            disabled={visit.id && datetime < Date.now()}
            readOnly
            name="vet"
            id="vet"
            value={
              visit.vet.id ? visit.vet.firstName + " " + visit.vet.lastName : ""
            }
            onChange={handleChange}
          />
        </Default>
      </Feature>
    );
  }

  async function handleSubmit({ values }) {
    if (!visitEditFormRef.current.validate()) return;

    let visitRequest = {
      ...visit,
      datetime: moment(values.datetime).format("YYYY-MM-DDTHH:mm:ss"),
      description: values.description,
    };

    visitRequest["pet"] = pet;

    const submit = await (
      await fetch(
        `/api/v1/pets/${petId}/visits` +
          (visitRequest.id ? "/" + visitRequest.id : ""),
        {
          method: visitRequest.id ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitRequest),
        }
      )
    ).json();
    if (submit.message) {
      setMessage(submit.message);
      setModalShow(true);
    } else {
      window.location.href = `/myPets`;
    }
  }

  async function setUp() {
    const petResponse = await (
      await fetch(`/api/v1/pets/${petId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
    ).json();
    if (petResponse.message) {
      setMessage(petResponse.message);
      setModalShow(true);
    } else setPet(petResponse);

    if (!message) {
      const vetsResponse = await (
        await fetch(`/api/v1/vets`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
      ).json();
      if (vetsResponse.message) {
        setMessage(vetsResponse.message);
        setModalShow(true);
      } else setVets(vetsResponse);

      if (visitId !== "new" && !message) {
        const visitResponse = await (
          await fetch(`/api/v1/pets/${petId}/visits/${visitId}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
        ).json();
        if (visitResponse.message) {
          setMessage(visitResponse.message);
          setModalShow(true);
        } else {
          setVisit(visitResponse);
          setCity(visitResponse.vet.city);
        }
      }
    }
  }

  useEffect(() => {
    setUp();
  }, []);

  useEffect(() => {
    const datetimeInput = visit.datetime || moment().format("YYYY-MM-DD HH:mm");

    if (visitEditFormInputs[0].defaultValue === "") {
      visitEditFormInputs[0].defaultValue = datetimeInput;
    }

    let cities = [];
    vets.forEach((vet) => {
      if (!cities.includes(vet.city)) cities.push(vet.city);
    });

    if (visitEditFormInputs[2].values.length === 1 && cities.length >= 1) {
      visitEditFormInputs[2].values = [
        ...visitEditFormInputs[2].values,
        ...cities,
      ];
      setCities(visitEditFormInputs[2].values);
    }

    if (visit.id !== null) {
      visitEditFormInputs[0].defaultValue = visit.datetime;
      visitEditFormInputs[1].defaultValue = visit.description;
      visitEditFormInputs[2].defaultValue = visit.vet.city;
    }

    visitEditFormInputs[2].onChange = handleCityChange;
  }, [visit, city, vets, cities]);

  return (
    <div className="auth-page-container">
      <h2 className="text-center">{visit.id ? "Edit Visit" : "Add Visit"}</h2>
      <div className="auth-form-container">
        {visitEditFormInputs[2].values.length !== 1 && (
          <FormGenerator
            ref={visitEditFormRef}
            inputs={visitEditFormInputs}
            onSubmit={handleSubmit}
            buttonText="Save"
            buttonClassName="auth-button"
            childrenPosition={-1}
          >
            <VetSelectionInput
              visit={visit}
              datetime={new Date(visit.datetime)}
            />
          </FormGenerator>
        )}
      </div>
      <Modal isOpen={modalShow} toggle={handleShow} keyboard={false}>
        {message && message.includes("limit") ? (
          <ModalHeader>Warning!</ModalHeader>
        ) : (
          <ModalHeader
            toggle={handleShow}
            close={
              <button className="close" onClick={handleShow} type="button">
                &times;
              </button>
            }
          >
            Error!
          </ModalHeader>
        )}
        <ModalBody>{message || ""}</ModalBody>
        <ModalFooter>
          <Button color="info" onClick={handleShow} type="button">
            Close
          </Button>
          <Button color="primary" tag={Link} to={`/myPets`}>
            Back
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
