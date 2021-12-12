import React from 'react';
import Button from 'react-bootstrap/Button'
import { FaPlus, FaSave, FaTrashAlt, FaRegEyeSlash, FaRegEye, FaPen, FaQuestionCircle } from "react-icons/fa";
import ListModal from '../modals/ListModal';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Prompt } from 'react-router-dom';
import ChangesSavedModal from '../modals/ChangesSavedModal';

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

class ShopTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objectsList: [],
            show: false,
            toEdit: undefined,
            showSaved: false,
            shouldBlockNavigation: false,
        };
    }

    componentDidMount() {
        this.setState({ objectsList: this.props.objList });
    }

    componentDidUpdate = () => {
        if (this.state.shouldBlockNavigation) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
    }

    handleEdit = (event, id) => {
        var data = [...this.state.objectsList];
        var index = data.findIndex(obj => obj.id === id);
        this.setState({ toEdit: data[index], show: true });
    }

    handleUpdate = (edited) => {
        var data = [...this.state.objectsList];
        var index = data.findIndex(obj => obj.id === edited.id);
        data[index] = edited;
        this.setState({ objectsList: data, toEdit: undefined });
        this.setState({ shouldBlockNavigation: true });
    }

    handleIgnore = (event, id) => {
        var data = [...this.state.objectsList];
        var index = data.findIndex(obj => obj.id === id);
        data[index].ignore = !data[index].ignore;
        this.setState({ objectsList: data });
        this.setState({ shouldBlockNavigation: true });
    }

    handleDelete = (event, id) => {
        var data = [...this.state.objectsList];
        var index = data.findIndex(obj => obj.id === id);
        data.splice(index, 1);

        data.forEach(function (row, index) {
            row.id = index;
        });

        this.setState({ objectsList: data });
        this.setState({ shouldBlockNavigation: true });
    }

    handlePayed = (event, id) => {
        var data = [...this.state.objectsList];
        var index = data.findIndex(obj => obj.id === id);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        data[index].buyed = value;
        this.setState({ objectsList: data });
        this.setState({ shouldBlockNavigation: true });
    }

    handleSave = (obj) => {
        var data = this.state.objectsList;
        obj.id = data.length;
        data.push(obj);
        this.setState({ objectsList: data });
        this.setState({ shouldBlockNavigation: true });
    }

    handleShow = (s) => {
        this.setState({ show: s, toEdit: undefined });
    }

    handleClose = () => {
        this.setState({ showSaved: false });
    }

    handleSaveChanges = () => {
        this.props.saveList(this.state.objectsList, this.props.tableNumber);
        this.setState({ showSaved: true });
        this.setState({ shouldBlockNavigation: false });
    }

    render() {
        return (
            <div>
                <Prompt
                    when={this.state.shouldBlockNavigation}
                    message='Hay cambios sin guardar. ¿Desea salir sin guardarlos?'
                />

                <ListModal show={this.state.show} handleSave={this.handleSave} handleShow={this.handleShow} toEdit={this.state.toEdit} handleUpdate={this.handleUpdate} />

                <ChangesSavedModal title={'Lista de compras'} showSaved={this.state.showSaved} handleShow={this.handleClose} />

                <Row>
                    <Col xs={6} lg={4} >  <h3>
                        {popover(this.props.titleTooltip)}
                        {this.props.title}
                    </h3></Col>

                    <Col xs={6} lg={8}>
                        <div className="float-right">
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 200 }}
                                overlay={<Tooltip>Guardar la tabla. Si no se guarda, se descartarán los cambios al salir de la pestaña.</Tooltip>}
                            >
                                <Button variant="success" className="inline" onClick={this.handleSaveChanges} disabled={!this.state.shouldBlockNavigation}>
                                    <FaSave style={{ marginRight: '10px' }} />
                                    <span className="hideOnShrink">
                                        Guardar cambios
                                    </span>
                                </Button>

                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 200 }}
                                overlay={<Tooltip>Agregar un elemento a la tabla.</Tooltip>}
                            >
                                <Button variant="primary" className="inline" onClick={this.handleShow}>
                                    <FaPlus style={{ marginRight: '10px' }} />
                                    <span className="hideOnShrink">
                                        Agregar objeto
                                    </span>
                                </Button>

                            </OverlayTrigger>
                        </div>
                    </Col>
                </Row>

                <div class="scrollme">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }} >#</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Comprado</th>
                                <th>
                                    {popover("Puede editar el elemento, ignorar el elemento (para no tenerlo en cuenta en el total) o eliminarlo de la tabla.")}
                                    Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.objectsList.map((o) =>
                                <tr key={o.id} style={{ backgroundColor: o.ignore ? 'grey' : '' }}>
                                    <td>{o.id}</td>
                                    <td>{o.link !== '' ? <a href={o.link} target="_blank" rel="noopener noreferrer">{o.name}</a> : o.name}</td>
                                    <td>${parseInt(o.price).toLocaleString()}</td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={o.buyed} onChange={e => this.handlePayed(e, o.id)} />
                                        </div>
                                    </td>

                                    <td>

                                        <div id="wrap">
                                            <div id="left"><Button variant="info" className="center" onClick={e => this.handleEdit(e, o.id)}>
                                                <FaPen />
                                            </Button></div>
                                            <div id="left"><Button variant="secondary" className="center" onClick={e => this.handleIgnore(e, o.id)}>
                                                {o.ignore ? <FaRegEye /> : <FaRegEyeSlash />}
                                            </Button></div>
                                            <div id="right"><Button variant="danger" className="center" onClick={e => this.handleDelete(e, o.id)}>
                                                <FaTrashAlt />
                                            </Button></div>
                                        </div>

                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </Table>
                </div>
                <p>Total compras: ${((this.state.objectsList.filter(({ ignore }) => ignore === false).reduce((a, b) => a + parseInt(b.price), 0))).toLocaleString()} </p>
            </div>
        );
    }
}

export default ShopTable;