import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class BudgetModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
        };
    }

    handleValidation() {
        let errors = {};
        let formIsValid = true;

        if (this.name.value === '') {
            formIsValid = false;
            errors["name"] = "Ingrese el nombre del elemento";
        }

        if (this.price.value === '') {
            formIsValid = false;
            errors["price"] = "Ingrese el precio del elemento";
        } else if (parseInt(this.price.value <= 0)) {
            formIsValid = false;
            errors["price"] = "El precio debe ser un valor positivo";
        }

        if (this.quantity.value === '') {
            formIsValid = false;
            errors["quantity"] = "Ingrese la cantidad del elemento";
        } else if (parseInt(this.quantity.value <= 0)) {
            formIsValid = false;
            errors["quantity"] = "La cantidad debe ser un valor positivo";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSave = () => {
        const objName = this.name.value;
        const objDesc = this.description.value;
        const objPrice = this.price.value;
        const objQuantity = this.quantity.value;
        if (this.handleValidation()) {
            this.handleClose();
            var newObj = {};
            if (this.props.toEdit !== undefined) {
                newObj = {
                    id: this.props.toEdit.id,
                    name: objName,
                    price: objPrice,
                    description: objDesc,
                    quantity: objQuantity,
                    ignore: this.props.toEdit.ignore,
                };
                this.props.handleUpdate(newObj);
            } else {
                newObj = {
                    name: objName,
                    price: objPrice,
                    description: objDesc,
                    quantity: objQuantity,
                    ignore: false,
                };
                this.props.handleSave(newObj);
            }

        }
    }

    handleShow = () => {
        this.props.handleShow(true);
    }

    handleClose = () => {
        this.props.handleShow(false);
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar elemento al presupuesto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre del elemento" ref={el => this.name = el} defaultValue={this.props.toEdit !== undefined ? this.props.toEdit.name : ''} maxLength="30" />
                            <span className="error" style={{ color: "red" }}>{this.state.errors["name"]}</span>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" placeholder="Descripción del elemento" ref={el => this.description = el} defaultValue={this.props.toEdit !== undefined ? this.props.toEdit.description : ''} maxLength="30" />
                            <span className="error" style={{ color: "red" }}>{this.state.errors["description"]}</span>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" placeholder="Precio del objeto" ref={el => this.price = el} defaultValue={this.props.toEdit !== undefined ? this.props.toEdit.price : ''} min="1" step="any" />
                            <span className="error" style={{ color: "red" }}>{this.state.errors["price"]}</span>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="number" placeholder="Cantidad" ref={el => this.quantity = el} defaultValue={this.props.toEdit !== undefined ? this.props.toEdit.quantity : ''} min="1" step="any" />
                            <span className="error" style={{ color: "red" }}>{this.state.errors["quantity"]}</span>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSave}>
                        {this.props.toEdit !== undefined ? 'Editar' : 'Agregar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default BudgetModal;