import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Select from 'react-select';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import moment from 'moment';
import 'moment/locale/es';
import Banner from './Banner';
import { connect } from 'react-redux';
import { selectedTripChanged } from "../reducers/TripReducer";
import configureStore from '../store';

const { store } = configureStore();
const url = process.env.REACT_APP_BACK_URL || '/api/v1';

class Picker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar: {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            },
            countries: [],
            isClearable: true,
            cities: [],
            isDisabled: true,
            selectedCountry: '',
            selectedCity: '',
            invalidData: true,
            numOfTrips: '',
            trips: [],
            userId: '',
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleCountrySelect = this.handleCountrySelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.promiseOptions = this.promiseOptions.bind(this);
        this.mapOptionsToValues = this.mapOptionsToValues.bind(this);
        this.handleCitySelect = this.handleCitySelect.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        nextState.invalidData = !(nextState.selectedCity && nextState.selectedCountry);
    };

    componentDidMount() {
        const user = store.getState().user.user;
        if (user === undefined) {
            this.props.history.push('/');
        }
        let userID = user.sub;
        this.setState({ userId: user.sub });
        axios.get(url + '/countries', //proxy uri
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                const options = res.data.map(function (row) {

                    // This function defines the "mapping behaviour". name and title 
                    // data from each "row" from your columns array is mapped to a 
                    // corresponding item in the new "options" array

                    return { value: row.code, label: row.name }
                });

                this.setState({ countries: options });
            });

        axios.get(url + '/userTrips/' + userID, //proxy uri
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                var resp = res.data;
                if (resp.length === 0) { //there is nothing, so post
                    var newObj = { userId: userID, trips: [] };
                    axios.post(url + '/userTrips', newObj)
                        .then(res => {
                            console.log("savedNewUserTrips");
                        });
                } else {
                    const trips = res.data[0].trips;
                    this.setState({ numOfTrips: trips.length, trips: trips });
                }
            });
    }

    handleCountrySelect(inputValue) {
        if (inputValue) {
            this.setState({ isDisabled: false });
            this.setState({ selectedCountry: inputValue.value });
        } else {
            this.setState({ isDisabled: true });
            this.setState({ selectedCountry: '' });
        }

    }

    handleCitySelect(inputValue) {
        if (inputValue) {
            this.setState({ selectedCity: inputValue.value });
        } else {
            this.setState({ selectedCity: '' });
        }

    }

    handleSelect(ranges) {
        this.setState({ calendar: ranges });
    }

    handleSubmit(event) {
        event.preventDefault();
        var toSave = {
            id: this.state.userId + (this.state.numOfTrips + 1).toString(),
            calendar: this.state.calendar,
            selectedCountry: this.state.selectedCountry,
            selectedCity: this.state.selectedCity
        };
        axios.post(url + '/trips', toSave)
            .then(res => {
                var data = this.state.trips;
                data.push(toSave);
                var newObj = {
                    trips: data.map(a => a.id),
                };
                axios.put(url + '/userTrips/' + this.state.userId, newObj)
                    .then(res => {
                        console.log("updated trips");
                        this.setState({ trips: data });
                        this.props.changeTrip(toSave);
                        this.props.history.push('/mytrip');
                    });

            });

    }

    selectTrip = (event, obj) => {
        this.props.changeTrip(obj);
        this.props.history.push('/mytrip');
    }

    deleteTrip = (event, obj) => {
        if (window.confirm("¿Está seguro de que desea eliminar el viaje a " + obj.selectedCity.split(",")[0] + "?")) {
            var data = [...this.state.trips];
            var index = data.findIndex(o => o.id === obj.id);
            data.splice(index, 1);
            axios.delete(url + '/trips/' + obj.id)
                .then(res => {
                    var newObj = {
                        trips: data.map(a => a.id),
                    };
                    axios.put(url + '/userTrips/' + this.state.userId, newObj)
                        .then(res => {
                            console.log("updated trips");
                            this.setState({ trips: data });
                        });
                });
        }
    }

    promiseOptions = (inputValue, callback) => {
        if (!inputValue) {
            return callback([]);
        } else if (inputValue.length >= 3) {
            axios.get(url + '/countries/' + this.state.selectedCountry + '/' + inputValue, //proxy uri
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    callback(this.mapOptionsToValues(res.data));
                });
        }
    };

    mapOptionsToValues = options => {
        return options.map(option => ({
            value: option.city + "," + option.latitude + "," + option.longitude,
            label: option.city + " - " + option.region
        }));
    };

    render() {
        return (
            <div>
                <Banner isLoggedIn showLinks={false} history={this.props.history} />

                <div className="hero-container" >
                    <div className="hero-image" >
                        <Container fluid className="hero-text roboto" >
                            <Row >
                                <div id="section1" >
                                    <div>
                                        <h1 className="title" > La nueva manera de planear tu viaje </h1>
                                    </div>
                                </div>
                            </Row>
                            <Row >
                                <div className="placeform" >
                                    <form className="placeformform roboto"
                                        onSubmit={this.handleSubmit} >
                                        <Row >
                                            <Col xs={12} md={12} lg={5} > < Row > <label className="labelmargin"> Fechas </label>
                                            </Row >
                                                <Row >
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <DateRange editableDateInputs={true}
                                                            moveRangeOnFirstSelection={false}
                                                            ranges={
                                                                [this.state.calendar]}
                                                            onChange={item => this.handleSelect(item.selection)}
                                                            minDate={new Date()} />
                                                    </div>
                                                </Row>
                                            </Col> <Col xs={0}
                                                md={0}
                                                lg={1} >
                                            </Col>
                                            <Col xs={12}
                                                md={12}
                                                lg={6} >
                                                <Row >
                                                    <label className="labelmargin" > País </label>
                                                </Row>
                                                <Row className="geoInput" >
                                                    <div className="vertical">
                                                        <Select options={this.state.countries}
                                                            isClearable={this.state.isClearable}
                                                            placeholder="Ingresa el país destino"
                                                            onChange={this.handleCountrySelect}
                                                        /> </div>

                                                </Row>
                                                <Row >
                                                    <label className="labelmargin" > Ciudad </label>
                                                </Row>
                                                <Row className="geoInput">
                                                    <div className="vertical">
                                                        <AsyncSelect cacheOptions loadOptions={this.promiseOptions}
                                                            placeholder="Ingresa la ciudad destino"
                                                            isDisabled={this.state.isDisabled}
                                                            onChange={this.handleCitySelect}
                                                            theme={
                                                                (theme) => ({
                                                                    ...theme,
                                                                    borderRadius: 0,
                                                                    colors: {
                                                                        ...theme.colors,
                                                                        neutral5: 'silver',
                                                                        neutral10: 'silver',
                                                                        primary: 'black',
                                                                    },
                                                                })
                                                            }
                                                        /> </div>

                                                </Row>
                                                <Row >
                                                    <button type="submit"
                                                        className="btn btn-primary submitbtn"
                                                        disabled={this.state.invalidData} > Aceptar </button>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </form> </div> </Row>
                        </Container>
                    </div>
                </div>

                <div style={{ backgroundColor: 'black' }} >
                    <div className="trips-container" >
                        <h2 className="left-pad">Mis viajes</h2>
                        <div className="left-pad">
                            <Row>
                                {this.state.trips.map((o) =>
                                    <Col lg={4} key={o.id}>
                                        <Card style={{ marginBottom: '15px' }} >
                                            <Card.Header as="h5">{o.selectedCity.split(",")[0]}</Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    {moment(o.calendar.startDate).format('DD/MMM/YYYY')} - {moment(o.calendar.endDate).format('DD/MMM/YYYY')}
                                                </Card.Text>
                                                <form className="my-2 my-lg-0 center">
                                                    <Button variant="primary" onClick={e => this.selectTrip(e, o)} className="inline center">Seleccionar</Button>
                                                    <Button variant="danger" className="inline center" onClick={e => this.deleteTrip(e, o)}>
                                                        Eliminar viaje
                                                    </Button>
                                                </form>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeTrip: (value) => dispatch(selectedTripChanged(value))
    };
};
export default connect(null, mapDispatchToProps)(Picker)