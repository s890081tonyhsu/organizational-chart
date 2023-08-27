import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { openModal } from "../slices/uiSlice";
import modals from "../static/modal.json";
import flowChartImage from "../assets/flow-chart.png";

function CustomNavbar() {
  const dispatch = useDispatch();

  const handleClick = (name) => dispatch(openModal(name));

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <img src={flowChartImage} alt="logo" width="30" height="30" />{" "}
          Organizational Chart
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {Object.entries(modals).map(([name, { title }]) => (
              <Nav.Link key={name} href="#" onClick={() => handleClick(name)}>
                {title}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
