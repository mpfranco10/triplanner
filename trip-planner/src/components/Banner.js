import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import HelpModal from './modals/HelpModal';
import { Redirect } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { userChanged } from "../reducers/UserReducer";
import { selectedTripChanged } from "../reducers/TripReducer";

function Banner(props) {

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const { user } = useAuth0();

/*   const cleanVariables = ()  => {
    const dispatch = useDispatch();
          dispatch(userChanged(undefined));
          dispatch(selectedTripChanged(undefined));
  } */

  const AuthenticationButton = () => {
    const { isAuthenticated, logout, loginWithRedirect } = useAuth0();

    return isAuthenticated ? <Nav className="justify-content-center"><Nav.Link className="center">
      <button type="button" className="btn btn-info" data-toggle="modal" data-target="#miModal4" onClick={handleShow}>
        Ayuda
      </button>
    </Nav.Link>
      <Nav.Link className="center">
        <Button variant="danger" onClick={() => {     
          logout();
          return <Redirect push to="/" />
        }
        }>
          Cerrar sesión
        </Button>
      </Nav.Link> </Nav> : <Nav className="justify-content-center"><Nav.Link className="center">
        <Button variant="success" onClick={() => loginWithRedirect()}>
          Iniciar sesión
        </Button>
      </Nav.Link> </Nav>;
  };

  const showLinks = props.showLinks;
  let links;
  if (showLinks) {
    links = (
      <Nav justify className="me-auto">
        <Nav.Link><Link to={`/mytrip`}> Resumen</Link></Nav.Link>
        <Nav.Link><Link to={`/map`}> Mapa</Link></Nav.Link>
        <NavDropdown title="Información útil" id="collasible-nav-dropdown">
          <NavDropdown.Item><Link to={`/list`} className="dropdown-item">Lista de compras</Link></NavDropdown.Item>
          <NavDropdown.Item> <Link to={`/notes`} className="dropdown-item">Notas</Link></NavDropdown.Item>
        </NavDropdown>
        <Nav.Link><Link to={`/schedule`}>Itinerario</Link></Nav.Link>
        <Nav.Link><Link to={`/budget`}>Presupuesto</Link></Nav.Link>
      </Nav>);
  } else {
    links = <Nav justify className="me-auto">
    </Nav>;
  }

  const pageNumber = showLinks ? 2 : 1;

  return (<>
    <HelpModal show={show} handleClose={handleClose} pageNumber={pageNumber} />
    <Navbar collapseOnSelect expand="lg" className="color" fixed="top" >
      <Container fluid >
        <Navbar.Brand>
          <Link to={{
            pathname: '/plan',
            state: { user: user }
          }}>
            <img width="30" src="logotrip.png" height="30" className="d-inline-block align-top" alt=""></img>
            <span className=" logo-pad">
              TriPlanner </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {links}
          <AuthenticationButton />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </>
  );

}

export default Banner;

