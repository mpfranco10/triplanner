import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import moment from 'moment';

class CustomModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            startDate: undefined,
            endDate: undefined,
            duration: '-',
            invalidData: true,
            errors: {},
            includeTime: false,
            startHour: this.props.minimumHour,
            endHour: this.props.minimumHour,
            lastHour: this.props.minimumHour,
        };
        //console.log(props.placeToSchedule);
    }

    componentWillUpdate(nextProps, nextState) {
        nextState.invalidData = !(nextState.startDate && nextState.endDate);
    };

    hideModal = () => {
        const fullname = this.fullname.value;
        const phone = this.phone.value;
        this.props.onSave({
            fullname,
            phone,
        });
    }

    handleRemove = () => {
        this.props.onRemove();
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.minimumHour !== this.state.lastHour) {
            var startDate = moment(nextProps.start.format('yyyy-MM-DD') + ' ' + nextProps.minimumHour);
            this.setState({ startDate: startDate });
            var endDate = moment(nextProps.start.format('yyyy-MM-DD') + ' ' + nextProps.minimumHour).add(1, 'hours');
            this.setState({ endDate: endDate });

            this.setState({ lastHour: nextProps.minimumHour });
            this.setState({ startHour: nextProps.minimumHour });
            this.setState({ endHour: endDate.format('HH:mm') });
            this.setState({ duration: '1 hora' });
        }
    }

    handleValidation() {
        let errors = {};
        let formIsValid = true;

        //console.log(this.state.endDate <= this.state.startDate);
        //Name
        if (this.state.endDate <= this.state.startDate) {
            formIsValid = false;
            errors["endDate"] = "La fecha de fin debe ser mayor que la fecha de inicio";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    handleSave = () => {

        if (this.handleValidation()) {
            const fullname = this.fullname.value;
            var phone = this.phone.value;
            var start = this.state.startDate;
            const end = this.state.endDate;
            const fromSchedule = true;
            var isMovement = false;
            var intervals = [];
            const color = this.hexToRgb(this.props.placeToSchedule.colorCode);
            const placeId = this.props.placeToSchedule.id;
            //console.log(color);

            intervals.push({
                fromSchedule,
                start,
                end,
                fullname,
                phone,
                isMovement,
                color,
                placeId,
            });

            if (this.state.includeTime) {
                var minutes = parseInt(this.props.placeToSchedule.duration.split(" ")[0]);
                var initOfMove = start.clone().subtract(minutes, "minutes");
                isMovement = true;
                var movement = {
                    fromSchedule,
                    start: initOfMove,
                    end: start,
                    isMovement,
                };
                intervals.push(movement);
            }

            this.props.onSave(intervals);


        } else {
            alert("Form has errors.");
        }
    }

    handleClose = () => {
        this.props.onModalClose();
    }

    handleStartDateChange = (event) => {
        this.setState({ startHour: event.target.value });
        var startDate = moment(this.props.start.format('yyyy-MM-DD') + ' ' + event.target.value);
        this.setState({ startDate: startDate });

        if (this.state.endDate !== undefined) {
            var minutes = this.state.endDate.diff(startDate, 'minutes');
            var quotient = minutes / 60.0;
            this.setState({ duration: moment(quotient) + ' hora(s)' });
        }
    }

    handleEndDateChange = (event) => {
        this.setState({ endHour: event.target.value });
        var endDate = moment(this.props.start.format('yyyy-MM-DD') + ' ' + event.target.value);
        this.setState({ endDate: endDate });

        if (this.state.startDate !== undefined) {
            var minutes = endDate.diff(this.state.startDate, 'minutes');
            var quotient = minutes / 60.0;
            this.setState({ duration: moment(quotient) + ' hora(s)' });
        }
    }

    handleCheckbox = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            includeTime: value
        });
    }

    render() {
        const {
            phone,
            start,
        } = this.props;

        const dow = this.props.start !== undefined ? this.props.start.day() === 0 ? 6 : this.props.start.day()-1 : '1';
        const opHour = this.props.placeToSchedule !== undefined && this.props.placeToSchedule.opHours !== undefined ? this.props.placeToSchedule.opHours.weekday_text[parseInt(dow)] : '-';

        return (
            <Modal style={{ minWidth: '500px' }} show={this.props.show}>
                <Modal.Header>
                    <Modal.Title>Planear visita</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label">Hora de apertura
                        </label>
                        <div className="col-sm-8">
                            <input type="text" readOnly className="form-control" value={opHour} disabled />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Fecha</label>
                        <div className="col-sm-4">
                            <input type="text" readOnly className="form-control" value={start.format('DD/MM/yyyy')} disabled />
                        </div>
                        <label className="col-sm-2 col-form-label">Inicio</label>
                        <div className="col-sm-4">
                            <input type="time" className="appt" name="appt" required
                                onChange={e => this.handleStartDateChange(e)} value={this.state.startHour} />
                            <span className="error" style={{ color: "red" }}>{this.state.errors["startDate"]}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Fin</label>
                        <div className="col-sm-4">
                            <input type="time" className="appt" name="appt" required
                                onChange={e => this.handleEndDateChange(e)} value={this.state.endHour} />
                            <span className="error" style={{ color: "red" }}>{this.state.errors["endDate"]}</span>
                        </div>
                        <label className="col-sm-2 col-form-label">Duración</label>
                        <div className="col-sm-4">
                            <input type="text" readOnly className="form-control" value={this.state.duration} disabled />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Lugar</label>
                        <div className="col-sm-10">
                            <input type="text" readOnly ref={el => this.fullname = el}
                                className="form-control" value={this.props.placeToSchedule !== undefined ? this.props.placeToSchedule.name : ''} disabled />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Detalle</label>
                        <div className="col-sm-10">
                            <input
                                ref={el => this.phone = el}
                                className="form-control"
                                type="text"
                                placeholder="Ingrese información adicional para la visita"
                                defaultValue={phone}
                                id="usr2"
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <div className="form-check center">
                            <input className="form-check-input" type="checkbox" checked={this.state.includeTime} onChange={this.handleCheckbox} />
                            <label className="form-check-label">
                                Incluir trayecto desde {this.props.parentOfPlace !== undefined ? this.props.parentOfPlace.name : ''} ({this.props.placeToSchedule !== undefined ? this.props.placeToSchedule.duration : ' '})
                            </label>
                        </div>
                    </div>



                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSave} disabled={this.state.invalidData}>Guardar</Button>
                </Modal.Footer>
            </Modal>


        );
    }
}

export default CustomModal;