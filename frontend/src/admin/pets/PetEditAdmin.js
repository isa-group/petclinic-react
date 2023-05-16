import { useEffect, useRef, useState } from "react";
import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal";
import useFetchData from "../../util/useFetchData";
import useFetchState from "../../util/useFetchState";
import getIdFromUrl from "../../util/getIdFromUrl";
import FormGenerator from "../../components/formGenerator/formGenerator";
import { petEditInputs } from "./form/petEditInputs";
import { Label, Input } from "reactstrap";

const jwt = tokenService.getLocalAccessToken();

export default function PetEditAdmin() {
  const emptyItem = {
    id: null,
    name: "",
    birthDate: "",
    type: null,
    owner: null,
  };
  const id = getIdFromUrl(2);
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pet, setPet] = useFetchState(
    emptyItem,
    `/api/v1/pets/${id}`,
    jwt,
    setMessage,
    setVisible,
    setLoaded,
    id
  );
  const types = useFetchData(`/api/v1/pets/types`, jwt);
  const owners = useFetchData(`/api/v1/owners`, jwt);

  const petEditFormRef = useRef(null);

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "type") {
      const type = types.find((type) => type.id === Number(value));
      setPet({ ...pet, type: type });
    } else if (name === "owner") {
      const owner = owners.find((owner) => owner.id === Number(value));
      setPet({ ...pet, owner: owner });
    } else setPet({ ...pet, [name]: value });
  }

  function handleSubmit({ values }) {
    if (!petEditFormRef.current.validate()) return;

    fetch("/api/v1/pets" + (pet.id ? "/" + pet.id : ""), {
      method: pet.id ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...pet,
        ...values,
        type: types.filter((t) => t.name === values.type)[0],
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else window.location.href = "/pets";
      })
      .catch((message) => alert(message));
  }

  const modal = getErrorModal(setVisible, visible, message);
  const ownerOptions = owners.map((owner) => (
    <option key={owner.id} value={owner.id}>
      {owner.user.username}
    </option>
  ));

  useEffect(() => {
    if (id !== "new" && loaded) {
      petEditInputs.forEach((input) => {
        if (input.name !== "birthDate") {
          input.defaultValue = pet[input.name];
          if (input.name === "type" && input.values.length === 1) {
            input.defaultValue = pet.type.name;
            input.values = [...input.values, ...types.map((t) => t.name)];
          } else if (input.name === "type") {
            input.defaultValue = pet.type.name;
          }

          if (input.name === "owner" && input.values.length === 1) {
            input.defaultValue = pet.owner.id;
            input.values = [...input.values, ...ownerOptions];
          }
        }
      });
    } else {
      petEditInputs.forEach((input) => {
        if (input.name !== "birthDate") {
          input.defaultValue = "";
          if (input.name === "type" && input.values.length === 1) {
            input.values = [...input.values, ...types.map((t) => t.name)];
          }

          if (input.name === "owner" && input.values.length === 1) {
            input.values = [...input.values, ...ownerOptions];
          }
        }
      });
    }
  }, [loaded]);

  return (
    <div className="auth-page-container">
      {<h2>{pet.id ? "Edit Pet" : "Add Pet"}</h2>}
      {modal}
      <div className="auth-form-container">
        {loaded && (
          <FormGenerator
            ref={petEditFormRef}
            inputs={petEditInputs}
            onSubmit={handleSubmit}
            buttonText={id !== "new" ? "Save" : "Add"}
            buttonClassName="auth-button"
            childrenPosition={-1}
          >
            <div className="custom-form-input">
              <label className="custom-form-input-label">Owner</label>
              <Input
                type="select"
                disabled
                name="owner"
                id="owner"
                value={pet.owner?.id || ""}
                onChange={handleChange}
              >
                <option value="">None</option>
                {ownerOptions}
              </Input>
            </div>
          </FormGenerator>
        )}
        {!loaded && (
          <FormGenerator
            ref={petEditFormRef}
            inputs={petEditInputs}
            onSubmit={handleSubmit}
            buttonText={id !== "new" ? "Save" : "Add"}
            buttonClassName="auth-button"
            childrenPosition={-1}
          >
            <div className="custom-form-input">
              <label className="custom-form-input-label">Owner</label>
              <Input
                type="select"
                required
                name="owner"
                id="owner"
                value={pet.owner?.id || ""}
                onChange={handleChange}
              >
                <option value="">None</option>
                {ownerOptions}
              </Input>
            </div>
          </FormGenerator>
        )}
        {/*] <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" required name="name" id="name" value={pet.name || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="birthDate">Birth Date</Label>
                        <Input type="date" name="birthDate" id="birthDate" value={pet.birthDate || ''}
                            onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="type">Type</Label>
                        <Input type="select" required name="type" id="type" value={pet.type?.id}
                            onChange={handleChange}>
                            <option value="">None</option>
                            {typeOptions}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/pets">Cancel</Button>
                    </FormGroup>
                </Form> */}
      </div>
    </div>
  );
}
