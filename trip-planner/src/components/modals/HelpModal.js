import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';

function HelpModal(props) {
    var h = "";
    if (props.pageNumber === 1) {
        h = "En esta sección puede ingresar la información básica de su viaje: el rango de fechas del viaje, el país y la ciudad que desea visitar. Al hacer click en aceptar podrá empezar a planear su viaje. \n Si ya tiene viajes planeados, puede verlos en la sección mis viajes.";
    } else if (props.pageNumber === 2) {
        h = "Para planear su viaje puede buscar los lugares que desee visitar en el mapa, agendarlos en el calendario, agregar listas de compras, presupuesto, y notas. En cada página, encontrará el símbolo '?', que le ayudará a entender el propósito de cada herramienta.";
    }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ayuda</Modal.Title>
            </Modal.Header>
            <Modal.Body>{h}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.handleClose}>
                    Entendido
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default HelpModal;