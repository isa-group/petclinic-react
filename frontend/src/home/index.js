import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {
    render() {
        return (
            <div>
                {/* <AppNavbar/> */}
                <Container fluid>
                    <Button color="link"><Link to="/api/v1/owners">Owners</Link></Button>
                    <Button color="link"><Link to="/api/v1/vets">Vets</Link></Button>
                </Container>
            </div>
        );
    }
}
export default Home;