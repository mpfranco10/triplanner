import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import moment from 'moment';

class CustomModalForCalendar extends React.Component {
    constructor(props) {
        super(props);
        var minutes = this.props.end.diff(this.props.start, 'minutes');
        var quotient = (minutes / 60.0).toFixed(1);
        this.state = {
            startDate: this.props.start,
            endDate: this.props.end,
            startHour: this.props.start.format("HH:mm"),
            endHour: this.props.end.format("HH:mm"),
            duration: quotient + ' hora(s)',
            errors: {},
        };
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

    handleRemove = () => {
        this.props.onRemove();
    }

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

    handleSave = () => {
        if (this.handleValidation()) {
            const fullname = this.fullname.value;
            const phone = this.phone.value;
            var start = this.state.startDate;
            const end = this.state.endDate;
            if (this.props.uid !== undefined) {
                this.props.onSave({
                    fullname,
                    phone,
                    uid: this.props.uid,
                    start,
                    end,
                });
            } else {
                this.props.onSave({
                    fullname,
                    phone,
                    start,
                    end,
                });
            }
        }

    }

    handleStartDateChange = (event) => {
        this.setState({ startHour: event.target.value });
        var startDate = moment(this.props.start.format('yyyy-MM-DD') + ' ' + event.target.value);
        this.setState({ startDate: startDate });

        if (this.state.endDate !== undefined) {
            var minutes = this.state.endDate.diff(startDate, 'minutes');
            var quotient = (minutes / 60.0).toFixed(1);
            this.setState({ duration: quotient + ' hora(s)' });
        }
    }

    handleEndDateChange = (event) => {
        this.setState({ endHour: event.target.value });
        var endDate = moment(this.props.start.format('yyyy-MM-DD') + ' ' + event.target.value);
        this.setState({ endDate: endDate });

        if (this.state.startDate !== undefined) {
            var minutes = endDate.diff(this.state.startDate, 'minutes');
            var quotient = (minutes / 60.0).toFixed(1);
            this.setState({ duration: quotient + ' hora(s)' });
        }
    }

    render() {
        const {
            fullname,
            phone,
            start,
            end,
            actionType
        } = this.props;

        const action = actionType === "create" ? "Agendar" : "Actualizar"

        return (
            <Modal.Dialog style={{ minWidth: '500px' }}>
                <Modal.Header>
                    <Modal.Title>Planear visita</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Fecha</label>
                        <div className="col-sm-4">
                            <input type="text" readOnly className="form-control" value={start.format('DD/MM/yyyy')} disabled />
                        </div>
                        <label className="col-sm-2 col-form-label">Inicio</label>
                        <div className="col-sm-4">
                            {actionType === "create" ? <input type="text" readOnly className="form-control" value={start.format('hh:mm a')} disabled /> :
                                <><input type="time" className="appt" name="appt" required
                                    onChange={e => this.handleStartDateChange(e)} value={this.state.startHour} /><span className="error" style={{ color: "red" }}>{this.state.errors["startDate"]}</span></>
                            }
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Fin</label>
                        <div className="col-sm-4">
                            {actionType === "create" ? <input type="text" readOnly className="form-control" value={end.format('hh:mm a')} disabled /> :
                                <> <input type="time" className="appt" name="appt" required
                                    onChange={e => this.handleEndDateChange(e)} value={this.state.endHour} />
                                    <span className="error" style={{ color: "red" }}>{this.state.errors["endDate"]}</span></>
                            }
                        </div>
                        <label className="col-sm-2 col-form-label">Duración</label>
                        <div className="col-sm-4">
                            <input type="text" readOnly className="form-control" value={this.state.duration} disabled />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Lugar</label>
                        <div className="col-sm-10">
                            <input
                                ref={el => this.fullname = el}
                                className="form-control"
                                type="text"
                                placeholder="Full name"
                                defaultValue={fullname}
                                id="usr"
                            />
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

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleRemove}>Borrar</Button>
                    <Button variant="primary" onClick={this.handleSave}>{action}</Button>
                </Modal.Footer>
            </Modal.Dialog>


        );
    }
}

export default CustomModalForCalendar;