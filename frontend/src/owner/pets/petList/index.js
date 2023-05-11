import "../../../static/css/owner/petList.css";
import "../../../static/css/auth/authButton.css";
import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Link } from "react-router-dom";
import tokenService from "../../../services/token.service";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import moment from "moment";

class OwnerPetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: [],
      message: null,
      modalShow: false,
    };
    this.removePet = this.removePet.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.removeVisit = this.removeVisit.bind(this);
    this.jwt = tokenService.getLocalAccessToken();
    this.user = tokenService.getUser();
  }

  async componentDidMount() {
    let pets = await (
      await fetch(`/api/v1/pets?userId=${this.user.id}`, {
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
      })
    ).json();
    if (pets.message) this.setState({ message: pets.message });
    else {
      for (let pet of pets) {
        let index = pets.findIndex((obj) => obj.id === pet.id);
        const visits = await (
          await fetch(`/api/v1/pets/${pet.id}/visits`, {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
              "Content-Type": "application/json",
            },
          })
        ).json();
        if (visits.message) this.setState({ message: visits.message });
        else pets[index]["visits"] = visits;
      }
      this.setState({ pets: pets });
    }
  }

  async removePet(id) {
    await fetch(`/api/v1/pets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          let updatedPets = [...this.state.pets].filter((i) => i.id !== id);
          this.setState({ pets: updatedPets });
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          message: data.message,
          modalShow: true,
        });
      });
  }

  async removeVisit(petId, visitId) {
    let status = "";
    await fetch(`/api/v1/pets/${petId}/visits/${visitId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) status = "200";
        return response.json();
      })
      .then((data) => {
        this.setState({
          message: data.message,
          modalShow: true,
        });
      });

    if (status === "200") {
      let pets = this.state.pets;
      const index = pets.findIndex((i) => i.id === petId);
      let pet = [...this.state.pets].filter((i) => i.id === petId);
      let updatedVisits = pet[0].visits.filter((i) => i.id !== visitId);
      if (updatedVisits.length > 0) pet[0].visits = updatedVisits;
      else pet[0].visits = [];
      pets[index] = pet[0];

      this.setState({ pets: pets });
    }
  }

  handleShow() {
    let modalShow = this.state.modalShow;
    this.setState({ modalShow: !modalShow });
  }

  render() {
    const { pets, isLoading } = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    }

    let modal = <></>;
    if (this.state.message) {
      const show = this.state.modalShow;
      const closeBtn = (
        <button className="close" onClick={this.handleShow} type="button">
          &times;
        </button>
      );
      modal = (
        <div>
          <Modal isOpen={show} toggle={this.handleShow} keyboard={false}>
            <ModalHeader toggle={this.handleShow} close={closeBtn}>
              Alert!
            </ModalHeader>
            <ModalBody>{this.state.message || ""}</ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleShow}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
    const petList = pets.map((pet) => {
      const visits = pet["visits"];

      return (
        <div key={pet.id} className="pet-row">
          <div className="pet-data">
            <h4 className="pet-name">{pet.name}</h4>
            <span>
              <strong>Date of birth:</strong> {pet.birthDate}
            </span>
            <span>
              <strong>Type:</strong> {pet.type.name}
            </span>
          </div>
          <div className="pet-options">
            <Link
              to={"/myPets/" + pet.id}
              className="auth-button blue"
              style={{ textDecoration: "none" }}
            >
              Edit
            </Link>
            <button
              onClick={() => this.removePet(pet.id)}
              className="auth-button danger"
            >
              Delete
            </button>
          </div>
          <div className="pet-visits">
            {visits.length > 0 ? (
              <Splide
                aria-label="My Favorite Images"
                className="visits-carousel"
              >
                {visits.map((visit) => {
                  return (
                    <SplideSlide className="carousel-slide">
                      <span>
                        <strong>Date and Time:</strong> {moment(visit.datetime).format("DD/MM/YYYY HH:mm")}
                      </span>
                      <span>
                        <strong>Vet:</strong> {visit.vet.firstName}{" "}
                        {visit.vet.lastName}
                      </span>
                      <div className="options-row">
                        {new Date(visit.datetime) > Date.now() && (
                          <button
                            className="cancel-visit-button"
                            onClick={() => this.removeVisit(pet.id, visit.id)}
                          >
                            Cancel
                          </button>
                        )}
                        <Link
                          to={`/myPets/${pet.id}/visits/${visit.id}`}
                          className="edit-visit-button"
                          style={{ textDecoration: "none" }}
                        >
                          Edit
                        </Link>
                      </div>
                    </SplideSlide>
                  );
                })}
              </Splide>
            ) : (
              <></>
            )}
            <Link
              to={`/myPets/${pet.id}/visits/new`}
              className="auth-button blue"
              style={{ textDecoration: "none" }}
            >
              Add Visit
            </Link>
          </div>
        </div>
      );
    });

    return (
      <div>
        {/* <AppNavbar /> */}
        <div className="pet-list-page-container">
            <Link to="/myPets/new" className="auth-button" style={{textDecoration: "none", marginBottom: "2rem"}}>
              Add Pet
            </Link>
          <h3 className="pet-list-title">Pets</h3>
          {petList}
          {modal}
        </div>
      </div>
    );
  }
}

export default OwnerPetList;
