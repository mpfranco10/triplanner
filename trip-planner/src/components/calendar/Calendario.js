import React from 'react';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import CustomModal from '../modals/CustomModal';
import CustomModalForCalendar from '../modals/CustomModalForCalendar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { TwitterPicker } from 'react-color';
import ListGroup from 'react-bootstrap/ListGroup';
import CustomEvent from './CustomEvent';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaQuestionCircle } from "react-icons/fa";
import { BsFillGearFill } from "react-icons/bs";
import CalendarModal from '../modals/CalendarModal';

const GOOGLE_API_KEY = "AIzaSyDSymRKtpFQbaTLW8RovSLfZpjaD0WQow4";

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

export default class Calendario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastUid: 1,
            selectedIntervals: [
                /* {
                    uid: 1,
                    start: moment('2021-12-25 09:12'),
                    end: moment('2021-12-25 12:15'),
                    value: "Booked by Smith",
                    isMovement: false,
                }, {
                    uid: 2,
                    start: moment('2021-12-25 9:12'),
                    end: moment('2021-12-25 12:10'),
                    value: "Booked by Bohr",
                    isMovement: false,
                }, */
            ],
            myPlaces: [],
            colors: [],
            value: '0',
            background: '#000000',
            colorPlaces: [],
            hotel: '',
            transportMode: 'transit',
            path: [],
            listOfDates: [],
            colorDate: '',
            colorMoment: moment(),
            origin: {},
            showModal: false,
            pathSchedule: [],
            minimumHour: '06:00',
            addedDelta: false,
            showCalendarModal: false,
            minimumCalendarHour: '06:00',
            unit: 30,
            calendarStart: { h: 6, m: 0 }
        };

        this.handleEventRemove = this.handleEventRemove.bind(this);
        this.handleEventUpdate = this.handleEventUpdate.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.placeSelected = this.placeSelected.bind(this);
        this.dynamicSort = this.dynamicSort.bind(this);
        this.handleHotelSelection = this.handleHotelSelection.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.computeDistances = this.computeDistances.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDeleteFromPath = this.handleDeleteFromPath.bind(this);
        this.scheduleVisit = this.scheduleVisit.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.patchTripCalendar = this.patchTripCalendar.bind(this);

    }

    patchTripCalendar(changes) {
        axios.put('http://localhost:5000/hotels/' + this.props.tripId, changes)
            .then(res => {
                console.log("updated calendar");
            });
    }

    componentDidMount() {
        axios.get('http://localhost:5000/places/' + this.props.tripId, //proxy uri
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                const places = res.data;
                places.sort(this.dynamicSort("name"));
                this.setState({ myPlaces: places });
                const uniqueColors = [...new Set(places.map(item => item.colorCode))];
                var newArray = uniqueColors.map(x => x !== undefined ? x : "#000000");
                this.setState({ colors: newArray });

                var days = [];
                var day = this.props.firstDay;
                this.setState({ colorMoment: day });
                this.setState({ colorDate: day.format('dddd - DD/MM/YYYY') });
                var endOfWeek = day.clone().add(this.props.numOfDays - 1, 'd');

                while (day <= endOfWeek) {
                    days.push(day.format('dddd - DD/MM/YYYY'));
                    day = day.clone().add(1, 'd');
                }

                this.setState({ listOfDates: days });
            });

        axios.get('http://localhost:5000/events/' + this.props.tripId, //proxy uri
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                const sevents = res.data;
                var lastuid = 1;
                sevents.forEach(function (obj) {
                    if (obj.uid > lastuid) {
                        lastuid = obj.uid;
                    }
                    obj.start = moment(obj.startString);
                    obj.end = moment(obj.endString);
                });
                this.setState({ selectedIntervals: sevents, lastUid: lastuid + 1 });
            });

        axios.get('http://localhost:5000/hotels/' + this.props.tripId, //proxy uri
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                const hotel = res.data;
                if (hotel.length > 0) {
                    var hotelId = hotel[0].placeId !== undefined ? hotel[0].placeId : '';
                    var unit = hotel[0].unit !== undefined ? hotel[0].unit : this.state.unit;
                    var calendarStart = hotel[0].calendarStart !== undefined ? hotel[0].calendarStart : this.state.calendarStart;
                    var minimumCalendarHour = this.state.minimumCalendarHour;
                    if (hotel[0].calendarStart !== undefined) {
                        var h = hotel[0].calendarStart.h;
                        var m = hotel[0].calendarStart.m;
                        var hh = h > 9 ? "" + h : "0" + h;
                        var mm = m > 9 ? "" + m : "0" + m;
                        minimumCalendarHour = hh + ':' + mm;
                    }
                    this.setState({ hotel: hotelId, unit: unit, calendarStart: calendarStart, minimumCalendarHour: minimumCalendarHour });
                } else {
                    var newObj = { id: this.props.tripId, placeId: '', unit: this.state.unit, calendarStart: this.state.calendarStart };
                    axios.post('http://localhost:5000/hotels', newObj)
                        .then(res => {
                        });
                }
            });

    }

    handleEventRemove = (event) => {
        const { selectedIntervals } = this.state;
        var index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({ selectedIntervals });
        }

        axios.delete('http://localhost:5000/events/' + this.props.tripId + '/' + event.uid)
            .then(res => {
                console.log("deleted event");
            });

        //fix path delete
        var data = [...this.state.path];
        index = data.findIndex(obj => obj.id === event.placeId);
        if (index !== -1 && index === data.length - 1) {
            data[index].canSchedule = true;
            data[index].scheduled = false;
            this.setState({ path: data });

        }
    }

    handleEventUpdate = (event) => {
        const selectedIntervals = this.state.selectedIntervals;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            event.value = event.fullname + ' - ' + event.phone
            selectedIntervals[index] = event;
            this.setState({ selectedIntervals: selectedIntervals });
        }

        delete event._id
        event.startString = event.start.format("yyyy-MM-DD HH:mm");
        event.endString = event.end.format("yyyy-MM-DD HH:mm");

        axios.put('http://localhost:5000/events/' + this.props.tripId + '/' + event.uid, event)
            .then(res => {
                console.log("updated event");
            });
    }

    handleSelect = (newIntervals) => {
        //console.log(newIntervals[0].start.format("dd/MM/yyyy hh:mm"));
        console.log(newIntervals);
        const { lastUid, selectedIntervals } = this.state;
        const intervals = newIntervals.map((interval, index) => {
            var val = '';
            if (interval.fullname !== undefined) {
                val += interval.fullname;
            }
            if (interval.phone !== undefined) {
                if (val === '') {
                    val += interval.phone;
                } else {
                    val += ' - ' + interval.phone;
                }
            }
            return {
                ...interval,
                uid: lastUid + index,
                value: val,
                isMovement: interval.isMovement,
                color: interval.color,
                tripId: this.props.tripId,
                startString: interval.start.format("yyyy-MM-DD HH:mm"),
                endString: interval.end.format("yyyy-MM-DD HH:mm"),

            }
        });

        //compute minimum hour for this path
        var minima = this.state.minimumHour;
        var placeId = '';
        newIntervals.forEach((interval) => {
            if (interval.placeId !== undefined) {
                placeId = interval.placeId;
            }
            var startInterval = interval.end.format('dddd - DD/MM/YYYY');
            if (startInterval === this.state.colorDate) {
                var horas = interval.end.format('HH:mm').split(":");
                var horaMin = minima.split(":");
                var hora1 = parseInt(horas[0]);
                var hora2 = parseInt(horaMin[0]);
                var horamin1 = parseInt(horas[1]);
                var horamin2 = parseInt(horaMin[1]);
                if (hora1 > hora2 || (hora1 === hora2 && horamin1 > horamin2)) {
                    var nuevaminima = interval.end.format('HH:mm');
                    minima = nuevaminima;
                }
            }
        })

        this.setState({ minimumHour: minima });

        //update path buttons
        if (placeId !== '') {
            var data = [...this.state.path];
            var index = data.findIndex(obj => obj.id === placeId);
            if (index !== -1) {
                data[index].canSchedule = false;
                data[index].scheduled = true;
                this.setState({ addedDelta: false });
                if (index + 1 < data.length) { //there is another element to shedule
                    data[index + 1].canSchedule = true;
                } 
            }
        }

        axios.post('http://localhost:5000/events', intervals)
            .then(res => {
                console.log("savedSchedule");
            });

        this.setState({
            selectedIntervals: selectedIntervals.concat(intervals),
            lastUid: lastUid + newIntervals.length
        })

        this.setState({ showModal: false });
    }

    onModalClose = (event) => {
        this.setState({ showModal: false });
    }

    onCalendarModalClose = (event) => {
        this.setState({ showCalendarModal: false });
    }

    openCalendarModal = () => {
        this.setState({ showCalendarModal: true });
    }

    handleCalendarSave = (configurations) => {
        var calendarStart = { h: parseInt(configurations.calendarStart.split(':')[0]), m: parseInt(configurations.calendarStart.split(':')[1]) };
        this.setState({ showCalendarModal: false, unit: configurations.unit, calendarStart: calendarStart });
        this.patchTripCalendar({ unit: configurations.unit, calendarStart: calendarStart });
    }


    handleChangeComplete = (color) => {
        var col = color.hex;
        this.setState({ background: col });
        var data = [...this.state.myPlaces];
        var colorPlaces = [];
        if (col === '#000000') {
            colorPlaces = data.filter(function (el) {
                return el.colorCode === undefined;
            });
        } else {
            colorPlaces = data.filter(function (el) {
                return el.colorCode === col;
            });
        }

        if (this.state.hotel !== '') {
            var index = colorPlaces.findIndex(obj => obj.id === this.state.hotel);
            var hotelPlace = null;
            if (index !== -1) {
                hotelPlace = colorPlaces[index];
                colorPlaces.splice(index, 1);
            } else {
                index = data.findIndex(obj => obj.id === this.state.hotel);
                hotelPlace = data[index];
            }
            var path = [...this.state.path];
            path = []; //temporal
            if (path.length === 0) {
                hotelPlace.durationValue = 0;
                path.push(hotelPlace)
                this.setState({ path: path });
            }
            this.setState({ origin: hotelPlace });

            if (colorPlaces.length > 0) {
                this.computeDistances(hotelPlace, colorPlaces);
            } else {
                this.setState({ colorPlaces: [] });
            }
        }
    };

    computeDistances(origin, colorPlaces) {
        var locationSeparator = ',';
        var placesSeparator = '|';

        var origins = origin.location.lat + locationSeparator + origin.location.lng;
        var dests = [];
        colorPlaces.forEach(function (arrayItem) {
            dests.push(arrayItem.location.lat + locationSeparator + arrayItem.location.lng);
        });
        var destinations = dests.join(placesSeparator);
        var params = { origins: origins, destinations: destinations, key: GOOGLE_API_KEY, mode: this.state.transportMode };

        //console.log(params);
        axios.get('http://localhost:5000/matrix',
            { params },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(resp => {
                var matrix = resp.data;
                //console.log(matrix);
                for (let i = 0; i < matrix.length; i++) {
                    //console.log(matrix[i]);
                    if (matrix[i].result.status === 'OK') {
                        colorPlaces[i].distance = matrix[i].result.distance.text;
                        colorPlaces[i].distanceValue = matrix[i].result.distance.value;
                        colorPlaces[i].duration = matrix[i].result.duration.text;
                        colorPlaces[i].durationValue = matrix[i].result.duration.value;
                    } else {
                        colorPlaces[i].duration = '';
                    }
                }
                colorPlaces.sort(this.dynamicSort("distanceValue"));
                this.setState({ colorPlaces: colorPlaces });
            });
    }

    handleHotelSelection = (event) => {
        var selected = event.target.value;
        if (selected !== '' && selected !== this.state.hotel) {
            this.setState({ hotel: event.target.value });
            var selectedHotel = { id: this.props.tripId, placeId: event.target.value };
            if (this.state.hotel === '') {
                axios.post('http://localhost:5000/hotels', selectedHotel)
                    .then(res => {
                        console.log("savedHotel");
                    });
            } else {
                axios.put('http://localhost:5000/hotels/' + this.props.tripId, selectedHotel)
                    .then(res => {
                        console.log("updatedHotel");
                    });
            }
        }
    };

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

    placeSelected = (event, place) => {
        var data = [...this.state.colorPlaces];
        var index = data.findIndex(obj => obj.id === place.id);
        data.splice(index, 1);
        this.setState({ colorPlaces: data });

        var opHours = place.detail.opening_hours;
        place.opHours = opHours;

        this.setState({ origin: place });
        if (data.length > 0) {
            this.computeDistances(place, data);
        }

        var path = [...this.state.path];
        var intervals = [...this.state.selectedIntervals];
        var intindex = intervals.findIndex(obj => obj.placeId === place.id);
        if (intindex === -1) {
            if (path.length === 1) {
                place.canSchedule = true;
            } else {
                if (this.computePlacesToSchedule() === 0) {
                    place.canSchedule = true;
                } else {
                    place.canSchedule = false;
                }
            }
            place.scheduled = false;
        } else { //there is an event for this place already
            place.canSchedule = false;
            place.scheduled = true;
        }

        //console.log(place);
        path.push(place);
        this.setState({ path: path });
        //console.log(path);
    }

    computePlacesToSchedule = () => {
        var path = [...this.state.path];
        var count = path.filter((obj) => obj.scheduled === false).length;
        return count;
    };

    handleModeChange = (event) => {
        this.setState({ transportMode: event.target.value });
    };

    handleDateChange = (event) => {
        this.setState({ colorDate: event.target.value });
        var colorMoment = moment(event.target.value.split("-")[1].trim(), 'DD/MM/YYYY');
        this.setState({ colorMoment: colorMoment });
    };

    handleDeleteFromPath = (event, place) => {
        var data = [...this.state.path];
        var newOrigin = data[data.length - 2];

        if (place.canSchedule || this.computePlacesToSchedule() === 0) {
            var events = [...this.state.selectedIntervals];
            var index = events.findIndex(obj => obj.placeId == data[data.length - 2].id);
            if (index === -1) {
                data[data.length - 2].canSchedule = true;
            }
        }

        data.splice(data.length - 1, 1);
        this.setState({ path: data });

        var colorPlaces = [...this.state.colorPlaces];
        colorPlaces.push(place);
        this.setState({ colorPlaces: colorPlaces });
        this.setState({ origin: newOrigin });
        this.computeDistances(newOrigin, colorPlaces);


    }

    scheduleVisit = (event, place) => {
        var data = [...this.state.path];
        var index = data.findIndex(obj => obj.id === place.id);
        this.setState({ placeToSchedule: data[index] });
        this.setState({ parentOfPlace: data[index - 1] });
        this.setState({ showModal: true });

        //add duration delay
        if (!this.state.addedDelta) {
            var minima = this.state.minimumHour;
            var deltaMinima = moment(this.state.colorMoment.format('yyyy-MM-DD') + ' ' + minima);
            var minutes = parseInt(data[index].duration.split(" ")[0]);
            var newMinima = deltaMinima.add(minutes, 'minutes').format('HH:mm');
            this.setState({ minimumHour: newMinima });
            this.setState({ addedDelta: true });
        }

    }

    render() {
        return (
            <>
                <CustomModal end={this.props.lastDay} start={this.state.colorMoment} show={this.state.showModal} onSave={this.handleSelect} onModalClose={this.onModalClose}
                    placeToSchedule={this.state.placeToSchedule} parentOfPlace={this.state.parentOfPlace} minimumHour={this.state.minimumHour} />
                <CalendarModal show={this.state.showCalendarModal} onSave={this.handleCalendarSave} onModalClose={this.onCalendarModalClose}
                    minimumHour={this.state.minimumCalendarHour} unit={this.state.unit} key={this.state.minimumCalendarHour} />
                <div className="container-fluid">
                    <Row>
                        <Col xs={12} xl={9}>
                            <Row >
                                <WeekCalendar
                                    dayFormat='dd, DD/MM'
                                    firstDay={this.props.firstDay}
                                    numberOfDays={this.props.numOfDays}
                                    selectedIntervals={this.state.selectedIntervals}
                                    onIntervalSelect={this.handleSelect}
                                    onIntervalUpdate={this.handleEventUpdate}
                                    onIntervalRemove={this.handleEventRemove}
                                    scaleUnit={this.state.unit}
                                    modalComponent={CustomModalForCalendar}
                                    eventComponent={CustomEvent}
                                    scaleFormat='hh:mm a'
                                    startTime={moment({ h: this.state.calendarStart.h, m: this.state.calendarStart.m })}
                                />
                            </Row >

                            <br />
                            <Row >
                                <div className="ruta roboto" style={{ fontSize: '13px' }}>
                                    <h1><span>
                                        {popover("En esta sección se muestran en orden los lugares que vas a visitar en un día específico. Puedes agregarlos al calendario teniendo en cuenta el tiempo de trayecto.")}
                                        Ruta ({this.state.colorDate})
                                    </span></h1>
                                    <p className="duracion"> {this.state.path.length > 1 ? 'Tiempo total en trayectos: ' + ((this.state.path.reduce((a, b) => +a + +b.durationValue, 0)) / 60.0).toFixed(2) + ' minutos' : ''} </p>
                                    <ListGroup horizontal style={{ marginLeft: '20px', overflowX: 'auto', whiteSpace: 'nowrap', overflowY: 'hidden' }}>
                                        {this.state.path.map((place) =>
                                            <ListGroup.Item style={{ padding: '0', border: 'none' }} key={place.id}>
                                                <ListGroup>
                                                    <ListGroup.Item>

                                                        {place.id === this.state.hotel ? 'Hotel' : place.name} &nbsp;

                                                        <button type="button" className="btn btn-danger float-right" aria-label="Close"
                                                            style={{
                                                                padding: '0 4px 0 4px', fontSize: '13px', marginLeft: '10px',
                                                                display: place.id === this.state.hotel || place.id !== this.state.origin.id ? 'none' : '',
                                                            }}
                                                            onClick={e => this.handleDeleteFromPath(e, place)}>X</button>

                                                    </ListGroup.Item>
                                                    <ListGroup.Item style={{ display: place.duration !== undefined ? '' : 'none' }}>
                                                        Trayecto: {place.duration} - {place.distance}
                                                    </ListGroup.Item>
                                                    <ListGroup.Item style={{ display: place.id === this.state.hotel || place.canSchedule ? 'none' : '' }}>
                                                        {place.scheduled ? <p className="center" style={{ marginBottom: '0' }}>Agendado</p> :
                                                            <p>{place.detail.opening_hours.weekday_text[parseInt(this.state.colorMoment.day() === 0 ? 6 : this.state.colorMoment.day() - 1)]}</p>
                                                        }

                                                    </ListGroup.Item>
                                                    <ListGroup.Item style={{ display: place.id === this.state.hotel || !place.canSchedule ? 'none' : '' }}>
                                                        <button type="button" className="btn btn-success" aria-label="Close"
                                                            style={{
                                                                padding: '0 4px 0 4px', fontSize: '13px', width: '100%'
                                                            }}
                                                            onClick={e => this.scheduleVisit(e, place)}>Agendar</button>
                                                    </ListGroup.Item>

                                                </ListGroup>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>



                                </div>

                            </Row >
                        </Col>
                        <Col xs={12} xl={3}>
                            <div className="div-border">
                                <h4>
                                    Crear una ruta
                                    <button type="button" className="float-right" style={{ backgroundColor: 'white', borderStyle: 'none' }} onClick={this.openCalendarModal}>
                                        <BsFillGearFill className="hover-button" color="grey" size="1.3em" />
                                    </button>
                                </h4>
                                <div className="form-group">
                                    <label>
                                        {popover("Seleccione el lugar en el que se hospedará. Este será el punto de partida de cada día en la ruta.")}
                                        Hotel
                                    </label>
                                    <Form.Select aria-label="Default select example" id="hotel" onChange={e => this.handleHotelSelection(e)} value={this.state.hotel}>
                                        <option value=''>Configura tu hotel</option>
                                        {this.state.myPlaces.map((place) =>
                                            <option value={place.id} key={place.id}>{place.name}</option>
                                        )}
                                    </Form.Select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        {popover("El tiempo de recorrido entre lugares se calculará teniendo en cuenta el medio de transporte.")}
                                        Medio de transporte
                                    </label>
                                    <Form.Select aria-label="Default select example" onChange={e => this.handleModeChange(e)} value={this.state.transportMode}>
                                        <option value='driving'>Vehículo</option>
                                        <option value='walking'>A pie</option>
                                        <option value='bicycling'>Bicicleta</option>
                                        <option value='transit'>Transporte público</option>
                                    </Form.Select>
                                </div>

                                <div className="form-group">
                                    <label >
                                        {popover("Al seleccionar un lugar se muestran los lugares que agrupó por ese mismo color.")}
                                        Selecciona un color
                                    </label>
                                    <TwitterPicker id="colors" width="100%" colors={this.state.colors} color={this.state.background} onChange={e => this.handleChangeComplete(e)} />
                                </div>

                                <div className="form-group">
                                    <label>
                                        {popover("Seleccione una fecha en la que desearía visitar todos estos lugares. Al agregar los eventos al calendario, se pondrán en esa fecha.")}
                                        Asignar día para este color
                                    </label>
                                    <Form.Select aria-label="Default select example" onChange={e => this.handleDateChange(e)} value={this.state.colorDate}>
                                        {this.state.listOfDates.map((date) =>
                                            <option value={date} key={date}>{date}</option>
                                        )}
                                    </Form.Select>
                                </div>

                                <div className="form-group" style={{ display: this.state.colorPlaces.length > 0 ? '' : 'none' }}>
                                    <label >
                                        {popover("Seleccione el primer lugar a visitar. Las distancias y tiempos de recorrido se actualizarán teniendo como origen el lugar seleccionado. De esta manera puede planear su ruta acortando trayectos.")}
                                        Selecciona un lugar para agregar un lugar a la ruta
                                    </label>
                                    <div style={{ overflowY: 'scroll', height: '32vh', border: '1px solid' }}>
                                        <ListGroup id="places">
                                            {this.state.colorPlaces.map((place, index) =>
                                                <ListGroup.Item action style={{ marginBottom: '1px' }} key={index} onClick={e => this.placeSelected(e, place)}>
                                                    {place.name} ({place.duration} - {place.distance} desde {this.state.origin.name} , horario de {place.detail.opening_hours.weekday_text[parseInt(this.state.colorMoment.day() === 0 ? 6 : this.state.colorMoment.day() - 1)]})
                                                </ListGroup.Item>

                                            )}
                                        </ListGroup>
                                    </div>
                                </div>



                            </div>
                        </Col>
                    </Row >

                </div >
            </>
        );
    }
}