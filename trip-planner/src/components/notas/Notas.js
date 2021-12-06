import React from 'react';
import Banner from "../Banner"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaSave } from "react-icons/fa";
import Nota from './Nota';
import axios from 'axios';
import ChangesSavedModal from '../modals/ChangesSavedModal';
import { Prompt } from 'react-router-dom';
import configureStore from '../../store';

const { store } = configureStore();

export default class Notas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickyNotes: [{
        id: 0,
        title: "Título nota",
        text: "Modifica este texto!",
      }],
      showSaved: false,
      shouldBlockNavigation: false,
    };
    this.contentEditable = React.createRef();
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
    axios.get('http://localhost:5000/notes/' + tripId, //proxy uri
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const resp = res.data;
        console.log(resp);
        if (resp.length === 0) { //there is nothing, so post
          var newObj = { tripId: tripId, stickyNotes: this.state.stickyNotes };
          axios.post('http://localhost:5000/notes', newObj)
            .then(res => {
              console.log("savedNewNote");
            });
        } else {
          this.setState({ stickyNotes: resp[0].stickyNotes });
        }
      });
  }

  handleAdd = () => {
    var data = [...this.state.stickyNotes];
    data.push({
      id: data.length,
      title: "Título nota",
      text: "Modifica este texto!"
    });
    this.setState({ stickyNotes: data, shouldBlockNavigation: true });
  }

  handleDeleteNote = (id) => {
    var data = [...this.state.stickyNotes];
    data.splice(id, 1);

    data.forEach(function (row, index) {
      row.id = index;
    });

    this.setState({ stickyNotes: data, shouldBlockNavigation: true });
  }

  handleNoteChange = (id, title, text) => {
    var data = [...this.state.stickyNotes];
    data[id].title = title;
    data[id].text = text;
    this.setState({ stickyNotes: data, shouldBlockNavigation: true });
  }

  handleSaveChanges = () => {
    document.querySelectorAll(".tooltip").forEach(element => {
      element.style.display = 'none';
    });
    var tripId = this.state.trip.id;
    axios.put('http://localhost:5000/notes/' + tripId, { stickyNotes: this.state.stickyNotes })
      .then(res => {
        console.log("updated notes");
        this.setState({ showSaved: true, shouldBlockNavigation: false });
      });
  }

  handleClose = () => {
    this.setState({ showSaved: false });
  }

  render() {
    return (
      <div className="container-fluid" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="row" id="banner">
          <div className="col-2 col-offset-0">
            <Banner showLinks={true} history={this.props.history} />
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div className="color">
          <ol className="breadcrumb" style={{ marginBottom: '0px', marginLeft: '0px' }}>
            <li className="breadcrumb-item"><a href="/">Inicio</a></li>
            <li className="breadcrumb-item">Información útil</li>
            <li className="breadcrumb-item active" aria-current="page">Notas</li>
          </ol>
        </div>

        <Prompt
          when={this.state.shouldBlockNavigation}
          message='Hay cambios sin guardar. ¿Desea salir sin guardarlos?'
        />

        <ChangesSavedModal title={'Notas'} showSaved={this.state.showSaved} handleShow={this.handleClose} />

        <div style={{ backgroundColor: '#666', height: '70px' }}>
          <div className="inline float-right" style={{ paddingTop: '10px', paddingBottom: '20px' }}>

            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 200 }}
              overlay={<Tooltip>Guardar las notas. Si no se guardan, se descartarán los cambios al salir de la pestaña.</Tooltip>}
            >
              <Button variant="success" className="inline" onClick={this.handleSaveChanges} disabled={!this.state.shouldBlockNavigation}>
                <FaSave style={{ marginRight: '10px' }} />
                Guardar cambios
              </Button>

            </OverlayTrigger>

            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 200 }}
              overlay={<Tooltip>Agregar una nota.</Tooltip>}
            >
              <Button variant="primary" className="inline float-right" onClick={this.handleAdd}>
                <FaPlus style={{ marginRight: '10px' }} />
                Agregar nota
              </Button>

            </OverlayTrigger>

          </div>
        </div>


        <div className="container-fluid notes-container" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
          <ul style={{ paddingTop: '30px' }}>
            {this.state.stickyNotes.map((o, index) =>
              <li key={index}>
                <Nota noteId={index} deleteNote={this.handleDeleteNote} handleChange={this.handleNoteChange} title={o.title} text={o.text} />
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}