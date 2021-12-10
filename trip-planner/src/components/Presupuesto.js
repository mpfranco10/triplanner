import React from 'react';
import Banner from "./Banner";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaSave, FaTrashAlt, FaRegEyeSlash, FaRegEye, FaPen, FaQuestionCircle } from "react-icons/fa";
import BudgetModal from './modals/BudgetModal';
import axios from 'axios';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ChangesSavedModal from './modals/ChangesSavedModal';
import { Prompt } from 'react-router-dom';
import configureStore from '../store';

const { store } = configureStore();
const url = process.env.REACT_APP_BACK_URL || '';

const popover = (msg) => (
  <OverlayTrigger
    placement="bottom"
    delay={{ show: 250, hide: 200 }}
    overlay={<Tooltip>{msg}</Tooltip>}
  >
    <button type="button" style={{ backgroundColor: 'white', borderStyle: 'none' }}><FaQuestionCircle color="grey" size="1.3em" />
    </button>

  </OverlayTrigger>
);

export default class Presupuesto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 5000,
      total: 2800,
      elements: [
        {
          id: 1,
          name: 'Comida',
          description: 'Costo diario',
          price: 100,
          quantity: 10,
          total: 1000,
          ignore: false
        }, {
          id: 2,
          name: 'Entretenimiento',
          description: 'Costo diario',
          price: 40,
          quantity: 10,
          total: 400,
          ignore: false
        }, {
          id: 3,
          name: 'Hotel',
          description: 'Habitación',
          price: 1400,
          quantity: 1,
          total: 1400,
          ignore: false
        }
      ],
      show: false,
      toEdit: undefined,
      trip: {},
      showSaved: false,
      localCurrency: 1,
      shouldBlockNavigation: false,
    };
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
    axios.get(url + '/budgets/' + tripId, //proxy uri
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const resp = res.data;
        console.log(resp);
        if (resp.length === 0) { //there is nothing, so post
          var newObj = { tripId: tripId, val: this.state.val, total: this.state.total, elements: this.state.elements, localCurrency: this.state.localCurrency };
          axios.post(url + '/budgets', newObj)
            .then(res => {
              console.log("savedNewBudget");
            });
        } else {
          this.setState({ val: resp[0].val, total: resp[0].total, elements: resp[0].elements, localCurrency: resp[0].localCurrency });
        }
      });
  }

  componentDidUpdate = () => {
    if (this.state.shouldBlockNavigation) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  handleValChange = (event) => {
    this.setState({ val: parseInt(event.target.value), shouldBlockNavigation: true });
  }

  handlCurrencyChange = (event) => {
    if (parseInt(event.target.value) > 0) {
      this.setState({ localCurrency: parseInt(event.target.value) });
    } else {
      this.setState({ localCurrency: 1 });
    }
    this.setState({ shouldBlockNavigation: true });
  }

  handleEdit = (event, id) => {
    var data = [...this.state.elements];
    var index = data.findIndex(obj => obj.id === id);
    this.setState({ toEdit: data[index], show: true });
  }

  handleUpdate = (edited) => {
    edited.total = parseInt(edited.price) * parseInt(edited.quantity);
    var data = [...this.state.elements];
    var index = data.findIndex(obj => obj.id === edited.id);
    data[index] = edited;
    var newTotal = data.filter(({ ignore }) => ignore === false).reduce((a, b) => a + parseInt(b.total), 0);
    this.setState({ elements: data, toEdit: undefined, total: newTotal });
    this.setState({ shouldBlockNavigation: true });
  }

  handleIgnore = (event, id) => {
    var data = [...this.state.elements];
    var index = data.findIndex(obj => obj.id === id);
    data[index].ignore = !data[index].ignore;
    var newTotal = data.filter(({ ignore }) => ignore === false).reduce((a, b) => a + parseInt(b.total), 0);
    this.setState({ elements: data, total: newTotal });
    this.setState({ shouldBlockNavigation: true });
  }

  handleDelete = (event, id) => {
    var data = [...this.state.elements];
    var index = data.findIndex(obj => obj.id === id);
    var newTotal = data.filter(({ ignore }) => ignore === false).reduce((a, b) => a + parseInt(b.total), 0);
    data.splice(index, 1);

    data.forEach(function (row, index) {
      row.id = index;
    });

    if (data.length === 0) {
      newTotal = 0;
    }
    this.setState({ elements: data, total: newTotal });
    this.setState({ shouldBlockNavigation: true });
  }

  handleSave = (obj) => {
    var data = this.state.elements;
    obj.total = parseInt(obj.price) * parseInt(obj.quantity);
    obj.id = data.length;
    data.push(obj);
    var newTotal = data.filter(({ ignore }) => ignore === false).reduce((a, b) => a + parseInt(b.total), 0);
    this.setState({ elements: data, total: newTotal });
    this.setState({ shouldBlockNavigation: true });
  }

  handleShow = (s) => {
    this.setState({ show: s, toEdit: undefined });
  }

  handleSaveChanges = () => {
    document.querySelectorAll(".tooltip").forEach(element => {
      element.style.display = 'none';
    });
    var tripId = this.state.trip.id;
    var newObj = { val: this.state.val, total: this.state.total, elements: this.state.elements, localCurrency: this.state.localCurrency };
    axios.put(url + '/budgets/' + tripId, newObj)
      .then(res => {
        console.log("updated budget");
        this.setState({ showSaved: true });
        this.setState({ shouldBlockNavigation: false });
      });
  }

  handleClose = () => {
    this.setState({ showSaved: false });
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
            <li className="breadcrumb-item active" aria-current="page">Presupuesto</li>
          </ol>
        </div>

        <Prompt
          when={this.state.shouldBlockNavigation}
          message='Hay cambios sin guardar. ¿Desea salir sin guardarlos?'
        />

        <BudgetModal show={this.state.show} handleSave={this.handleSave} handleShow={this.handleShow} toEdit={this.state.toEdit} handleUpdate={this.handleUpdate} />

        <ChangesSavedModal title={'Presupuesto'} showSaved={this.state.showSaved} handleShow={this.handleClose} />

        <div className="pcontainer container-fluid">
          <Form style={{ paddingTop: '10px' }}>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">

              <Form.Label column xs={6} md="2">
                {popover("Ingrese un estimado de lo que planea gastar en el viaje. El avance se calcula con respecto a esto.")}
                Presupuesto objetivo
              </Form.Label>
              <Col xs={6} md="2">
                <Form.Control type="number" placeholder="$ Ingrese el presupuesto inicial" value={this.state.val} onChange={this.handleValChange} />
              </Col>
              <Col xs={12} md="8">
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 200 }}
                  overlay={<Tooltip>Porcentaje del presupuesto objetivo gastado.</Tooltip>}
                >
                  <ProgressBar animated
                    now={this.state.val === 0 ? 50 : (this.state.total / this.state.val) * 100.0}
                    label={this.state.val === 0 ? 'Porcentaje gastado del presupuesto' : `${((this.state.total / this.state.val) * 100.0).toFixed(2)}%`}
                    style={{ height: '38px' }} />

                </OverlayTrigger>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Form.Label column xs={6} md="2">
                {popover("Suma de los costos totales de los elementos en la tabla.")}
                Costo total del viaje

              </Form.Label>
              <Col xs={6} md="2">
                <Form.Control plaintext readOnly value={'$' + this.state.total.toLocaleString()} />
              </Col>

              <Form.Label column xs={6} md="2">
                {popover("Si ingresó la tabla en una moneda extranjera, puede ingresar aquí a cuanto equivale una (1) unidad en su moneda local. (Por ejemplo ingrese 30 si la tabla está en dólares y 1 dolar equivale a 30 en su moneda local)")}

                Convertir a moneda local
              </Form.Label>
              <Col xs={6} md="2">
                <Form.Control type="number" placeholder="$ Ingrese el valor de conversión" value={this.state.localCurrency} onChange={this.handlCurrencyChange} />
              </Col>

              <Form.Label column xs={6} md="2">
                Costo total en moneda local
              </Form.Label>
              <Col xs={6} md="2">
                <Form.Control plaintext readOnly value={'$' + (this.state.total * this.state.localCurrency).toLocaleString()} />
              </Col>
            </Form.Group>
          </Form>
          <hr />
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
            <Form.Label column xs={2} md="2">
              {popover("Dinero que queda del presupuesto objetivo.")}
              Dinero restante

            </Form.Label>
            <Col xs={2} md="2">
              <Form.Control plaintext readOnly value={'$' + (this.state.val - this.state.total).toLocaleString()} />
            </Col>

            <Col xs={8} md="8">
              <div className="inline float-right">

                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 200 }}
                  overlay={<Tooltip>Guardar la tabla. Si no se guarda, se descartarán los cambios al salir de la pestaña.</Tooltip>}
                >
                  <Button variant="success" className="inline" onClick={this.handleSaveChanges} disabled={!this.state.shouldBlockNavigation} >
                    <FaSave style={{ marginRight: '10px' }} />
                    Guardar cambios
                  </Button>

                </OverlayTrigger>

                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 200 }}
                  overlay={<Tooltip>Agregar un elemento a la tabla.</Tooltip>}
                >
                  <Button variant="primary" className="inline float-right" onClick={this.handleShow}>
                    <FaPlus style={{ marginRight: '10px' }} />
                    Agregar elemento
                  </Button>

                </OverlayTrigger>

              </div>

            </Col>
          </Form.Group>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Elemento</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>
                  {popover("Puede editar el elemento, ignorar el elemento (para no tenerlo en cuenta en el total) o eliminarlo de la tabla.")}
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.elements.map((o, index) =>
                <tr key={o.name} style={{ backgroundColor: o.ignore ? 'grey' : '' }}>
                  <td>{o.name}</td>
                  <td>{o.description}</td>
                  <td>${parseInt(o.price).toLocaleString()}</td>
                  <td>{o.quantity}</td>
                  <td>${parseInt(o.total).toLocaleString()}</td>
                  <td>

                    <div id="wrap">
                      <div id="left">
                        <Button variant="info" className="center" onClick={e => this.handleEdit(e, index)}>
                          <FaPen />
                        </Button></div>
                      <div id="left"><Button variant="secondary" className="center" onClick={e => this.handleIgnore(e, index)}>
                        {o.ignore ? <FaRegEye /> : <FaRegEyeSlash />}
                      </Button></div>
                      <div id="right"><Button variant="danger" className="center" onClick={e => this.handleDelete(e, index)}>
                        <FaTrashAlt />
                      </Button></div>
                    </div>

                  </td>
                </tr>
              )}

            </tbody>
          </Table>


        </div>

      </div>
    );
  }
}