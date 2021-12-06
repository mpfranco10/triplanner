import React from 'react';
import Banner from "../Banner";
import axios from 'axios';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ShopTable from './ShopTable';
import configureStore from '../../store';

const { store } = configureStore();

export default class ListaCompras extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trip: {},
      beforeList: [],
      afterList: [],
      k1: 0,
      k2: 1,
    };
  }

  saveList = (objs, tableNumber) => {
    var tripId = this.state.trip.id;

    var newObj = {};
    if (tableNumber === "1") {
      newObj.beforeList = objs;
    } else {
      newObj.afterList = objs;
    }

    document.querySelectorAll(".tooltip").forEach(element => {
      element.style.display = 'none';
    });

    axios.put('http://localhost:5000/shoppingLists/' + tripId, newObj)
      .then(res => {
        console.log("updated lists");
      });
  }

  componentDidMount() {
    const trip = store.getState().trip.selectedTrip;
    if (trip !== undefined) {
      this.setState({ trip: trip });
    } else {
      this.props.history.push('/plan');
    }

    //create empty object if necessary
    var tripId = trip.id;
    axios.get('http://localhost:5000/shoppingLists/' + tripId, //proxy uri
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const resp = res.data;
        if (resp.length === 0) { //there is nothing, so post
          var newObj = { tripId: tripId, beforeList: [], afterList: [] };
          axios.post('http://localhost:5000/shoppingLists', newObj)
            .then(res => {
              console.log("savedNewList");
            });
        } else {
          this.setState({ beforeList: resp[0].beforeList, afterList: resp[0].afterList, k1: this.state.k1 + 1, k2: this.state.k2 + 1 });
        }
      });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row" id="banner">
          <div className="col-2 col-offset-0">
            <Banner showLinks={true} history={this.props.history} />
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div className="color">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Inicio</a></li>
            <li className="breadcrumb-item">Información útil</li>
            <li className="breadcrumb-item active" aria-current="page">Lista de compras</li>
          </ol>
        </div>


        <Container fluid={true}>
          <Row>
            <Col xs={12} xl={6}>
              <ShopTable title="Compras antes del viaje" tableNumber="1" saveList={this.saveList} objList={this.state.beforeList} key={this.state.k1} titleTooltip="Objetos que desea comprar antes del viaje. Puede guardarlos en la tabla con su respectivo link de compra (si aplica) para recordar comprarlos." />
            </Col>
            <Col xs={12} xl={6}>
              <ShopTable title="Compras durante el viaje" tableNumber="2" saveList={this.saveList} objList={this.state.afterList} key={this.state.k2} titleTooltip="Objetos que desea comprar durante el viaje. Puede guardarlos en la tabla con su respectivo link de compra (si aplica) para recordar comprarlos." />
            </Col>
          </Row>
        </Container>


      </div>
    );
  }
}