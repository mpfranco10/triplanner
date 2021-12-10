import React from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { Accordion, Card, ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CirclePicker } from 'react-color';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { FaQuestionCircle, FaTrashAlt, FaMapMarkerAlt, FaRegClock, FaExternalLinkAlt } from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const url = process.env.REACT_APP_BACK_URL || '';

const containerStyle = {
  width: '100%',
  height: '85vh'
};

const libraries = ['places'];

const image = {
  url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|f47373",
};

const myColorList = ['#E91E63', '#673AB7', '#FFEB3B', '#9C27B0', '#00BCD4', '#607D88', '#CDDC39', '#8ED1FC',
  '#F78DA7', '#FCB900', '#4CAF50', '#BF360C', '#13567C', '#AEA1FF', '#008B02', '#', '#808900', '#7BDCB5', '#A1887F', '#525252', '#FA28FF', '#FF8A65', '#880E4F'];


const popover = (title, msg) => (
  <OverlayTrigger
    placement="right"
    overlay={<Popover id="popover-basic">
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body>
        {msg}
      </Popover.Body>
    </Popover>}
  >
    <button type="button" style={{ backgroundColor: 'white', borderStyle: 'none', paddingTop: '5px' }}><FaQuestionCircle color="grey" size="1.5em" />
    </button>

  </OverlayTrigger>

);

export default class GMapReact extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      myPlaces: [],
      activeKey: "0",
      value: '0'
    };

    this.autocomplete = null

    this.onLoad = this.onLoad.bind(this)
    this.onPlaceChanged = this.onPlaceChanged.bind(this)
    this.handleChangeComplete = this.handleChangeComplete.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
    this.deletePlace = this.deletePlace.bind(this)
    this.sortPlaces = this.sortPlaces.bind(this)
    this.dynamicSort = this.dynamicSort.bind(this)
    this.resetColors = this.resetColors.bind(this)
    this.centerMarker = this.centerMarker.bind(this)
  }

  componentDidMount() {
    axios.get(url + '/places/' + this.props.tripId, //proxy uri
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const places = res.data;
        this.setState({ myPlaces: places });
        const ev = { target: { value: '2' } };
        this.sortPlaces(ev);
      });
  }

  onLoad(autocomplete) {
    //console.log('autocomplete: ', autocomplete)
    //console.log(this.props.tripId);
    this.autocomplete = autocomplete
  }

  onPlaceChanged() {
    if (this.autocomplete !== null) {
      //console.log(this.autocomplete.getPlace());
      var placeId = this.autocomplete.getPlace().place_id;
      if (this.state.myPlaces.some(e => e.id === placeId)) {
        //console.log("place exists");
      } else {
        var lat = this.autocomplete.getPlace().geometry.location.lat();
        var lng = this.autocomplete.getPlace().geometry.location.lng();
        var name = this.autocomplete.getPlace().name;
        var myPlaces = this.state.myPlaces;
        var place = { id: this.autocomplete.getPlace().place_id, location: { lat: lat, lng: lng }, name: name, detail: this.autocomplete.getPlace(), tripId: this.props.tripId };
        //console.log(place);
        myPlaces.unshift(place);
        this.setState({ myPlaces: myPlaces });

        axios.post(url + '/places', place)
          .then(res => {
            console.log("saved");
          });
      }
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  handleMarkerClick = (event, id) => {
    var data = [...this.state.myPlaces];
    var index = data.findIndex(obj => obj.id === id);
    var place = data[index];
    data.splice(index, 1);
    data.unshift(place);
    this.setState({ myPlaces: data });
    //document.getElementById(id).getElementsByTagName("button")[0].click()
  };

  deletePlace = (event, id) => {
    var data = [...this.state.myPlaces];
    var index = data.findIndex(obj => obj.id === id);
    data.splice(index, 1);
    this.setState({ myPlaces: data });

    axios.delete(url + '/places/' +  this.props.tripId + '/' + id)
      .then(res => {
        console.log("deleted place");
      });
  }

  sortPlaces = (event) => {
    var criteria = event.target.value; 
    var data = [];
    if (criteria === '1') {
      data = [...this.state.myPlaces];
      data.sort(this.dynamicSort("colorCode"));
      this.setState({ myPlaces: data });
    } else if (criteria === '2') {
      data = [...this.state.myPlaces];
      data.sort(this.dynamicSort("name"));
      this.setState({ myPlaces: data });
    }
    this.setState({ value: criteria });
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var aval = a[property];
      var bval = b[property];
      if (aval === undefined) {
        aval = 'zzzzzz';
      } if (bval === undefined) {
        bval = 'zzzzzz';
      }
      var result = (aval < bval) ? -1 : (aval > bval) ? 1 : 0;

      return result * sortOrder;
    }
  }

  resetColors() {
    var data = [...this.state.myPlaces];
    data.forEach(function (arrayItem) {
      delete arrayItem.colorCode;
      delete arrayItem.color;
    });
    this.setState({ myPlaces: data });
    axios.put(url + '/places/' + this.props.tripId + '/colors')
      .then(res => {
        console.log("updated colors");
      });
  }

  handleChangeComplete = (color, id) => {
    var col = color.hex.replace('#', '');
    var newImage = {
      url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + col,
    };
    var data = [...this.state.myPlaces];
    var index = data.findIndex(obj => obj.id === id);
    data[index].color = newImage;
    data[index].colorCode = color.hex;
    var place = data[index];
    delete place._id;
    this.setState({ myPlaces: data });

    axios.put(url + '/places/' + this.props.tripId + '/' + id, place)
      .then(res => {
        console.log("updated color");
      });

  };

  centerMarker = (event, location) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(location);
    }
  }


  render() {
    const { center, zoom } = this.props;
    return (


      <div style={{ height: '80vh', width: '100%' }}>

        <Row >
          <Col xl={8} >
            <LoadScript
              googleMapsApiKey={GOOGLE_API_KEY}
              id="script-loader"
              libraries={libraries}
              language="es"
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                id="googleMapS"
                center={center}
                zoom={zoom}
              >
                <Autocomplete
                  onLoad={this.onLoad}
                  onPlaceChanged={this.onPlaceChanged}
                  restrictions={{ country: this.props.country }}
                >
                  <input
                    type="text"
                    placeholder="Buscar un lugar para agregar"
                    onFocus={e => e.target.value = ''}
                    style={{
                      boxSizing: `border-box`,
                      border: `1px solid transparent`,
                      width: `50%`,
                      height: `32px`,
                      padding: `0 12px`,
                      borderRadius: `3px`,
                      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                      fontSize: `14px`,
                      outline: `none`,
                      textOverflow: `ellipses`,
                      position: "absolute",
                      left: "50%",
                      marginLeft: "-120px"
                    }}
                  />
                </Autocomplete>
                {this.state.myPlaces.map((place, index) =>
                  <Marker
                    position={place.location}
                    //label={{ text: place.name, fontFamily: 'roboto', fontWeight: 'bold', color: '#14213D' }}
                    key={place.name}
                    icon={place.color === undefined ? image : place.color}
                    onClick={e => this.handleMarkerClick(e, place.id)}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </Col>
          <Col xl={4}>
            <Row style={{ marginBottom: '10px' }} className="map-right-div">
              <Col xs={6} lg={7}>
                <div style={{ margin: 'auto' }}>
                  <div id="first">{popover("Mapa de lugares", "Busca un lugar y seleccionalo para agregarlo a la lista. Puedes ver la información del lugar, y asignarle un color. Agrupa los lugares que quieres visitar en el mismo día en un mismo color. Esto te servirá para planear el itinerario.")}</div>
                  <div id="second">
                    <select className="form-select" aria-label="Default select example"
                      value={this.state.value}
                      onChange={e => this.sortPlaces(e)}
                      style={{ display: 'inline-block' }}>
                      <option value="1">Ordenar por color</option>
                      <option value="2">Ordenar por nombre</option>
                    </select></div>
                  <div id="clear"></div>
                </div>
              </Col>
              <Col xs={6} lg={5}>
                <button type="button" className="btn btn-danger float-right"  onClick={this.resetColors}>Reiniciar colores</button>
              </Col>
            </Row >
            <div>
              <Accordion defaultActiveKey={this.state.activeKey} style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                {this.state.myPlaces.map((place, index) =>
                  <Accordion.Item eventKey={index.toString()} key={index} id={place.id}>
                    <Accordion.Header>
                      <img width="30" src={place.detail.icon} height="30" className="d-inline-block align-top" alt=""></img>
                      <span className="accordion-pad"
                        style={{
                          textDecorationLine: place.colorCode === undefined ? 'none' : 'underline',
                          textDecorationColor: place.colorCode === undefined ? '' : place.colorCode,
                          textDecorationThickness: place.colorCode === undefined ? '' : '3px'
                        }}>
                        {place.name}
                      </span>

                    </Accordion.Header>
                    <Accordion.Body>
                      <Card>
                        <Card.Header style={{ backgroundColor: place.colorCode === undefined ? '' : place.colorCode, color: 'black' }}>
                          <Button variant="info" className="float-left" onClick={e => this.centerMarker(e, place.location)}>
                            <BiTargetLock /> Ver en el mapa
                          </Button>
                          <Button variant="danger" className="float-right" onClick={e => this.deletePlace(e, place.id)}>
                            <FaTrashAlt />
                          </Button>
                        </Card.Header>
                        <ListGroup>
                          <ListGroup.Item>
                            <FaMapMarkerAlt className="pad-icon" />
                            {place.detail.formatted_address}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="btn-group" style={{ width: '100%' }}>
                              <button type="button" className="btn btn-outline-info col-12 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                              >
                                <FaRegClock className="pad-icon" />
                                Horas de apertura
                              </button>
                              <div className="dropdown-menu">
                                {place.detail.opening_hours !== undefined ? place.detail.opening_hours.weekday_text.map((text) =>
                                  <span className="dropdown-item" href="#" key={text}>{text}</span>
                                ) : '-'}
                              </div>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <FaExternalLinkAlt className="pad-icon" />
                            <a href={place.detail.website} target="_blank" rel="noreferrer">Visitar URL</a>
                          </ListGroup.Item>
                        </ListGroup>
                        <Card.Footer>
                          <div className="circlecontainer">
                            <div className="child">
                              <CirclePicker onChange={e => this.handleChangeComplete(e, place.id)} color={place.colorCode} colors={myColorList.slice(0, this.props.numOfDays)} />
                            </div>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Accordion.Body>
                  </Accordion.Item>

                )}
              </Accordion>
              {this.state.myPlaces.length === 0 ? 'Empieza buscando lugares que quieras visitar en este viaje' : ''}
            </div>
          </Col>
        </Row>

      </div>
    );
  }
}