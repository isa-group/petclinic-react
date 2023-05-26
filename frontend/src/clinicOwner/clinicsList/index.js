import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Table } from "reactstrap";
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import getErrorModal from "../../util/getErrorModal";
import deleteFromList from "../../util/deleteFromList";
import "../../static/css/admin/adminPage.css";

const user = tokenService.getUser();
const jwt = tokenService.getLocalAccessToken();

export default function ClinicsList(){
    const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [clinicOwner, setClinicOwner] = useFetchState(
    null,
    `/api/v1/clinics?userId=${user.id}`,
    jwt,
    setMessage,
    setVisible
  );
  const [alerts, setAlerts] = useState([]);

  const clinicsList = clinicOwner !== null ? clinicOwner.clinics.map((clinic) => {

    return (
      <tr key={clinic.id}>
        <td>{clinic.name}</td>
        <td>{clinic.address}</td>
        <td>{clinic.telephone}</td>
        <td>{clinic.plan}</td>
        <td>
          <ButtonGroup>
            <Button
              size="sm"
              color="primary"
              aria-label={"edit-" + clinic.name}
              tag={Link}
              to={"/clinics/" + clinic.id}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="danger"
              aria-label={"delete-" + clinic.name}
              onClick={() => {
                setClinicOwner(null);
                deleteFromList(
                  `/api/v1/clinics/${clinic.id}`,
                  clinic.id,
                  [clinicOwner, setClinicOwner],
                  [alerts, setAlerts],
                  setMessage,
                  setVisible
                )
              }
              }
            >
              Delete
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  })
  :
  <></>
  ;

  const modal = getErrorModal(setVisible, visible, message);

  return (
    <div>
      <div className="admin-page-container">
        <h1 className="text-center">My Clinics</h1>
        {alerts.map((a) => a.alert)}
        {modal}
        <div className="float-right">
          <Button color="success" tag={Link} to="/clinicss/new">
            Add clinic
          </Button>
        </div>
        <div>
          <Table aria-label="clinicss" className="mt-4">
            <thead>
              <tr>
                <th width="10%">Name</th>
                <th width="10%">Address</th>
                <th width="10%">Telephone</th>
                <th width="10%">Plan</th>
                <th width="40%">Actions</th>
              </tr>
            </thead>
            <tbody>{clinicsList}</tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}