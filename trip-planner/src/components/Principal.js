import React from 'react';
import Banner from "./Banner"
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import configureStore from '../store';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { BsFillPinMapFill, BsFillCalendarEventFill, BsFillBasket3Fill } from "react-icons/bs";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const url = process.env.REACT_APP_BACK_URL || '/api/v1';

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6
};

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

const { store } = configureStore();

export default class Principal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripDate: '',
      city: '',
      endDate: undefined,
      places: 0,
      events: 0,
      objects: 0,
    };
  }
  componentDidMount() {

    const trip = store.getState().trip.selectedTrip;
    if (trip !== undefined) {
      this.setState({ trip: trip });
      var dateTrip = new Date(trip.calendar.startDate);
      var month = dateTrip.toLocaleString('default', { month: 'long' });
      this.setState({ tripDate: month + ', ' + dateTrip.getDate() + ', ' + dateTrip.getFullYear() });
      this.setState({ city: trip.selectedCity.split(",")[0] });
      this.setState({ endDate: dateTrip });

      var tripId = trip.id;
      axios.get(url + '/widgets/' + tripId, //proxy uri
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          const resp = res.data;
          this.setState({ places: resp.places, events: resp.events, objects: resp.objects });
        });
    } else {
      this.props.history.push('/plan');
    }

  }
  render() {
    if (this.state.endDate === undefined) {
      return (
        <div className="container-fluid">
          <div className="row" id="banner">
            <div className="col-2 col-offset-0">
              <Banner />
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <div className="color">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Inicio</a></li>
              <li className="breadcrumb-item active" aria-current="page">Resumen</li>
            </ol>
          </div>
        </div>
      );
    }
    const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
    const endTime = this.state.endDate / 1000;  // use UNIX timestamp in seconds

    const remainingTime = endTime - stratTime;
    const days = Math.ceil(remainingTime / daySeconds);
    const daysDuration = days * daySeconds;

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
            <li className="breadcrumb-item active" aria-current="page">Resumen</li>
          </ol>
        </div>

        <div className="container-fluid" >
          <div className="hero-image-2">
            <div className="hero-text-2">
              <h1>Mi viaje a {this.state.city}</h1>
              <div className="App">
                <CountdownCircleTimer
                  {...timerProps}
                  colors={[["#05668d"]]}
                  duration={daysDuration}
                  initialRemainingTime={remainingTime}
                >
                  {({ elapsedTime }) =>
                    renderTime("días", getTimeDays(daysDuration - elapsedTime))
                  }
                </CountdownCircleTimer>
                <CountdownCircleTimer
                  {...timerProps}
                  colors={[["#679436"]]}
                  duration={daySeconds}
                  initialRemainingTime={remainingTime % daySeconds}
                  onComplete={(totalElapsedTime) => [
                    remainingTime - totalElapsedTime > hourSeconds
                  ]}
                >
                  {({ elapsedTime }) =>
                    renderTime("horas", getTimeHours(daySeconds - elapsedTime))
                  }
                </CountdownCircleTimer>
                <CountdownCircleTimer
                  {...timerProps}
                  colors={[["#000000"]]}
                  duration={hourSeconds}
                  initialRemainingTime={remainingTime % hourSeconds}
                  onComplete={(totalElapsedTime) => [
                    remainingTime - totalElapsedTime > minuteSeconds
                  ]}
                >
                  {({ elapsedTime }) =>
                    renderTime("minutos", getTimeMinutes(hourSeconds - elapsedTime))
                  }
                </CountdownCircleTimer>
                <CountdownCircleTimer
                  {...timerProps}
                  colors={[["#05668d"]]}
                  duration={minuteSeconds}
                  initialRemainingTime={remainingTime % minuteSeconds}
                  onComplete={(totalElapsedTime) => [
                    remainingTime - totalElapsedTime > 0
                  ]}
                >
                  {({ elapsedTime }) =>
                    renderTime("segundos", getTimeSeconds(elapsedTime))
                  }
                </CountdownCircleTimer>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ marginTop: '50px', marginBottom: '50px' }} >
          <Row>
            <Col className="page-hero d-flex align-items-center justify-content-center">
              <Card className="text-center" style={{ width: '18rem', height: '11rem' }}>
                <Card.Header>Lugares guardados</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <h1> <BsFillPinMapFill style={{ marginRight: '10px' }} />
                      {this.state.places}</h1>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col className="page-hero d-flex align-items-center justify-content-center">
              <Card className="text-center" style={{ width: '18rem', height: '11rem' }}>
                <Card.Header>Eventos planeados</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <h1><BsFillCalendarEventFill style={{ marginRight: '10px' }} /> {this.state.events}</h1>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col className="page-hero d-flex align-items-center justify-content-center">
              <Card className="text-center" style={{ width: '18rem', height: '11rem' }}>
                <Card.Header>Objetos en listas de compras</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <h1><BsFillBasket3Fill style={{ marginRight: '10px' }} /> {this.state.objects}</h1>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

      </div>
    );
  }
}