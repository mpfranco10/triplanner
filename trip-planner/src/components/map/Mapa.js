import React from 'react';
import Banner from "../Banner";
import GMapReact from './GMapReact';
import moment from 'moment';
import { connect } from 'react-redux';

class Mapa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 37.7824134,
        lng: -122.4088472
      },
      zoom: 13,
      tripId: this.props.todos.id,
      numOfDays: 3,
      country: '',
    };

    this.recenterMap = this.recenterMap.bind(this)
  }
  componentDidMount() {
    const trip = this.props.todos;

    if (trip !== undefined) {
      this.setState({ trip: trip });
      this.setState({
        center: {
          lat: parseFloat(trip.selectedCity.split(",")[1]),
          lng: parseFloat(trip.selectedCity.split(",")[2])
        }
      });
      this.setState({ tripId: trip.id });
      var a = moment(trip.calendar.startDate);
      var b = moment(trip.calendar.endDate);
      var numDays = b.diff(a, 'days') + 1;
      this.setState({ numOfDays: numDays });
      this.setState({ country: trip.selectedCountry.toUpperCase() });
    } else {
      this.props.history.push('/plan');
    }

  }

  recenterMap(value) {
    if (this.state.center !== value) {
      console.log("dif");
      this.setState({ center: value });
      this.setState({ zoom: 16 });
    }
  }

  render() {
    const center = this.state.center;
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
            <li className="breadcrumb-item active" aria-current="page">Mapa</li>
          </ol>
        </div>
        <div>
          <GMapReact center={center} zoom={this.state.zoom} tripId={this.state.tripId} numOfDays={this.state.numOfDays} onChange={this.recenterMap} country={this.state.country} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ todos: state.trip.selectedTrip });

export default connect(mapStateToProps)(Mapa)