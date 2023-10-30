import { Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Button } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  let navigate = useNavigate();

  return (
    <>
      <Navbar
        sticky="top"
        expand={"sm"}
        className="bg-secondary"
      >
        <Container fluid>
          <Navbar.Brand role="button" onClick={() => navigate("/")}>
            Každodenní recepty
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
          <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm`}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                Každodenní recepty
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1">
                <Button className="m-1" variant="primary" onClick={() => navigate("/recipes")}>Recepty</Button>
                <Button className="m-1" variant="success" onClick={() => navigate("/ingredients")}>Ingredience</Button>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}

export default App;