import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, FormGroup, Input, Label, Col } from "reactstrap";
import tokenService from "../../services/token.service";
// import tokenService from "../../services/token.service";
// import { useLocalState } from "../../util/useLocalStorage";
// import api from '../../services/api';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [, setJwt] = useLocalState("jwt", "");
  // const jwt = tokenService.getLocalAccessToken();

  function sendLoginRequest() {
    const reqBody = {
      username: username,
      password: password,
    };

    fetch("/api/v1/auth/signin", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(reqBody),
    })
      .then(function (response) {
        if (response.status === 200)
          return response.json();
        else
          return Promise.reject("Invalid login attempt");
      })
      .then(function (data) {
        // setJwt(data.token);
        tokenService.updateLocalAccessToken(data.token)
        window.location.href = "dashboard";
      }).catch((message) => {
        alert(message);
      });
    // api.post("/auth/signin", {
    //   username, password
    // }).then(response => {
    //   if (response.data.token) {
    //     // setJwt(response.data.token);
    //     tokenService.setUser(response.data);
    //     window.location.href = "dashboard";
    //   }

    //   return response.data;
    // }).catch((message) => {
    //   alert(message);
    // });
  }

  return (
    <>
      <Container className="d-flex justify-content-center">
        <Form>
          <Col>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input type="text" required name="username" id="username" value={username || ''}
                onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" required name="password" id="password" value={password || ''}
                onChange={(e) => setPassword(e.target.value)} autoComplete="lastName" />
            </FormGroup>
            <br />
            <FormGroup>
              <Button color="primary" onClick={() => sendLoginRequest()}>Login</Button>{' '}
              <Button color="secondary" tag={Link} to="/">Cancel</Button>
            </FormGroup>
          </Col>
        </Form>
      </Container>
      {/* <div>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button id="submit" onClick={() => sendLoginRequest()}>
          Login
        </button>
      </div> */}
    </>
  );
};

export default Login;