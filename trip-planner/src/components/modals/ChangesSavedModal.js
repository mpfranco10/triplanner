import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class ChangesSavedModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    handleClose = () => {
        this.props.handleShow(false);
    }

    render() {
        return (
            <Modal show={this.props.showSaved}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false} >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Cambios guardados
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleClose}>Ok</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}