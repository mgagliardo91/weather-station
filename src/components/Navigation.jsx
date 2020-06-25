import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

const Navigation = () => {
  return (
  <Navbar bg="dark"  expand="lg" variant="dark">
    <Navbar.Brand href="/">ndustrial Weather Station</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/logout">Log Out</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  );
};

export default Navigation;