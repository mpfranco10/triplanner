import React from 'react';
import Banner from "../Banner";
import moment from 'moment';
import Calendario from "./Calendario";
import configureStore from '../../store';

const { store } = configureStore();

export default class Itinerario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripId: '',
      startDate: new Date(),
    };

    this.renderCalendar = this.renderCalendar.bind(this);
  }
  componentDidMount() {
    const trip = store.getState().trip.selectedTrip;
    if (trip !== undefined) {
      this.setState({ trip: trip });
      this.setState({ tripId: trip.id });
      this.setState({ startDate: trip.calendar.startDate });
      this.setState({ endDate: trip.calendar.endDate });
      var a = moment(trip.calendar.startDate);
      var b = moment(trip.calendar.endDate);
      var numDays = b.diff(a, 'days') + 1;
      this.setState({ numOfDays: numDays });
    } else {
      this.props.history.push('/plan');
    }
  }

  renderCalendar() {
    return (<Calendario
      firstDay={moment(this.state.startDate)}
      lastDay={moment(this.state.endDate)}
      numOfDays={this.state.numOfDays}
      tripId={this.state.tripId} />);
  }

  render() {
    const numberOfDays = this.state.numOfDays
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
            <li className="breadcrumb-item active" aria-current="page">Itinerario</li>
          </ol>
        </div>
        <div>
          {numberOfDays !== undefined ? this.renderCalendar() : (
            <span>Cargando...</span>)}
        </div>
      </div>
    );

  }
}