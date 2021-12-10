// src/App.js

import React from 'react';
import { withRouter } from 'react-router-dom';
import Callback from './Callback/Callback';
import './App.css';
import Principal from "./components/Principal";
import Mapa from "./components/map/Mapa";
import Itinerario from "./components/calendar/Itinerario";
import Presupuesto from './components/Presupuesto';
import Documentos from './components/Documentos';
import ListaCompras from './components/shopping/ListaCompras';
import Notas from './components/notas/Notas';
import Picker from './components/Picker';
import { Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import Banner from './components/Banner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from "react-redux";
import { userChanged } from "./reducers/UserReducer";
import { selectedTripChanged } from "./reducers/TripReducer";
import axios from 'axios';

function HomePage(props) {
    const { loginWithRedirect } = useAuth0();
    const url = process.env.REACT_APP_BACK_URL || '';
    axios.get(url + '/api/v1/greetings', //proxy uri
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      const resp = res.data;
      console.log(resp);
    });


    return (
        <div className="container-fluid" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
            <div className="row" id="banner">
                <div className="col-2 col-offset-0">
                    <Banner showLinks={false} history={props.history} />
                </div>
            </div>
            <div className="init-hero-image">
                <div className="init-hero-text" style={{ fontFamily: 'roboto' }}>
                    <img src="logotrip.png" alt="tripplanner icon" className="init-icon" />
                    <h1>Bienvenido a TriPlanner</h1>
                    <p>Aquí puedes planear tu viaje de manera fácil y divertida</p>

                    <div class="container">
                        <Row>
                            <Col className="page-hero d-flex align-items-center justify-content-center">
                                <Card style={{ width: '18rem', height: '26rem' }}>
                                    <Card.Img variant="top" src="route_google_map.png" style={{ height: '16rem' }} />
                                    <Card.Body>
                                        <Card.Title>Selecciona lugares</Card.Title>
                                        <Card.Text>
                                            Busca los lugares que quieres visitar en el mapa, guárdalos y organízalos por colores.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="page-hero d-flex align-items-center justify-content-center">
                                <Card style={{ width: '18rem', height: '26rem' }}>
                                    <Card.Img variant="top" src="schedule.png" style={{ height: '16rem' }} />
                                    <Card.Body>
                                        <Card.Title>Planea tus visitas</Card.Title>
                                        <Card.Text>
                                            Planea cuando quieres visitar cada lugar seleccionado, teniendo en cuenta el tiempo de transporte
                                            entre lugares.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="page-hero d-flex align-items-center justify-content-center">
                                <Card style={{ width: '18rem', height: '26rem' }} className="budget-card">
                                    <Card.Img variant="top" src="budget.png" style={{ height: '16rem' }} />
                                    <Card.Body>
                                        <Card.Title>Planea tus gastos</Card.Title>
                                        <Card.Text>
                                            Crea listas de compras y crea un presupuesto para tu viaje.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <br />
                    <p>Inicia sesión para planear tu viaje</p>
                    <Button variant="success" className="center" onClick={() => loginWithRedirect()}>Iniciar sesión</Button>

                </div>
            </div>
        </div >
    );
}

function App(props) {
    //const dispatch = useDispatch();
    //dispatch(userChanged(undefined));
    //dispatch(selectedTripChanged(undefined));

    return (
        <div>
            <Route
                exact
                path="/callback"
                render={() => <Callback auth={props.auth} />}
            />
            <Route
                exact
                path="/"
                render={() => (
                    <HomePage
                        authenticated={false}
                        //auth={props.auth}
                        history={props.history}
                    />
                )}
            />
            <PrivateRoute path="/plan" component={Picker} exact />
            <PrivateRoute path="/mytrip" component={Principal} exact />
            <PrivateRoute path="/map/" component={Mapa} exact />
            <PrivateRoute path="/schedule" component={Itinerario} exact />
            <PrivateRoute path="/budget" component={Presupuesto} exact />
            <PrivateRoute path="/documents" component={Documentos} exact />
            <PrivateRoute path="/list" component={ListaCompras} exact />
            <PrivateRoute path="/notes" component={Notas} exact />
        </div>
    );
}

export default withRouter(App);