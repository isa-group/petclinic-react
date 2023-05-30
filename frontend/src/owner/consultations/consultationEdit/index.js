import "../../../static/css/auth/authButton.css"
import "../../../static/css/auth/authPage.css"
import {Input } from 'reactstrap';
import {consultationEditFormInputs} from "./form/consultationEditFormInputs";
import { useEffect, useState, useRef } from 'react';
import tokenService from '../../../services/token.service';
import FormGenerator from "../../../components/formGenerator/formGenerator";

export default function OwnerConsultationEdit(){

    let [consultation, setConsultation] = useState({
        id: null,
        title: '',
        status: 'PENDING'
    });

    let [pets, setPets] = useState([]);
    let [owner, setOwner] = useState({});
    let [message, setMessage] = useState(null);

    const consultationEditFormRef = useRef();

    const jwt = JSON.parse(window.localStorage.getItem("jwt"));

    let pathArray = window.location.pathname.split('/');
    const id = pathArray[2];
    const userId = tokenService.getUser().id;

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let consultationAux = { ...consultation };
        if (name === "pet")
            consultationAux.pet = pets.filter((pet) => pet.id === Number(value))[0];
        else
            consultationAux[name] = value;
        setConsultation(consultationAux);
    }

    async function handleSubmit({values}) {
        
        if(!consultationEditFormRef.current.validate()) return;

        let consultationRequest = {
            ...consultation,
            title: values.title,
        };
        consultationRequest["owner"] = owner;

        const response = await (await fetch('/api/v1/consultations' + (consultationRequest.id ? '/' + id : ''), {
            method: consultationRequest.id ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consultationRequest),
        })).json();
        if (response.message) setMessage(response.message);
        else window.location.href = '/consultations';
    }

    async function setUp() {
        if (id !== "new") {
            const consultation = await (await fetch(`/api/v1/consultations/${id}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                },
            })).json();
            if (consultation.message) setMessage(consultation.message);
            else
                setConsultation(consultation);

        }
        if (!message) {
            const pets = await (await fetch(`/api/v1/pets?userId=${userId}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                },
            })).json();
            if (pets.message) setMessage(pets.message);
            else {
                setPets(pets);
                setOwner(pets[0].owner);
            }
        }
    }

    useEffect(() => {
        setUp();
        if(consultation.id && consultation.pet) consultationEditFormInputs[0].defaultValue = consultation.title;
        else consultationEditFormInputs[0].defaultValue = "";
    }, []);

    if (message) return <h2 className="text-center">{message}</h2>

    return(
<div className="auth-page-container">
<h2 className="text-center">{consultation.id ? 'Edit Consultation' : 'Add Consultation'}</h2>
                <div className="auth-form-container">
                <FormGenerator
                    ref={consultationEditFormRef}
                    inputs={consultationEditFormInputs}
                    onSubmit={handleSubmit}
                    childrenPosition={-1}
                    buttonText="Save"
                    buttonClassName="auth-button"
                >
                    
                    <Input type="select" disabled={consultation.id!==null} required={consultation.id===null} name="pet" id="pet" value={consultation.pet?.id || ""}
                        onChange={handleChange} >
                        <option value="">None</option>
                        {
                            pets && pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)
                        }
                    </Input> 
                </FormGenerator>
                </div>
            </div>
    );

}