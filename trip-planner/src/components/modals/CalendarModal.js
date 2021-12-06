import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaQuestionCircle } from "react-icons/fa";

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

class CalendarModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            startHour: this.props.minimumHour,
        };
    }

    handleValidation() {
        let errors = {};
        let formIsValid = true;
        if (this.unit.value === '') {
            formIsValid = false;
            errors["unit"] = "Ingrese una unidad para el calendario";
        } else if (parseInt(this.unit.value) < 1 || parseInt(this.unit.value) > 60) {
            formIsValid = false;
            errors["unit"] = "Ingrese una unidad entre 1 y 120";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSave = () => {
        if (this.handleValidation()) {
            this.props.onSave({unit: this.unit.value, calendarStart: this.state.startHour});
        }
    }


    handleClose = () => {
        this.props.onModalClose();
    }

    handleStartDateChange = (event) => {
        this.setState({ startHour: event.target.value });
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Configuraciones del calendario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>
                                {popover("Cantidad de minutos que representan un cuadro en el calendario.")}
                                Unidad del calendario
                            </Form.Label>
                            <Form.Control type="number" placeholder="Ingrese un valor de 1 a 60" ref={el => this.unit = el} defaultValue={this.props.unit} />
                            <span className="error" style={{ color: "red" }}>{this.state.errors["unit"]}</span>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>
                                {popover("El calendario se mostrará desde esta hora.")}
                                Hora de inicio del calendario
                            </Form.Label>
                            <input type="time" className="appt" name="appt" onChange={e => this.handleStartDateChange(e)} value={this.state.startHour} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={this.handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CalendarModal;