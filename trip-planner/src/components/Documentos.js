import React from 'react';
import Banner from "./Banner"
export default class Documentos extends React.Component {
  componentDidMount() {
  }
  state = {
    "restaurantes": []
  };
  render() {
    return (
      <div className="container-fluid">
        <div className="row" id="banner">
          <div className="col-2 col-offset-0">
            <Banner showLinks={true} history={this.props.history}/>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div className="color">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Inicio</a></li>
            <li className="breadcrumb-item">Información útil</li>
            <li className="breadcrumb-item active" aria-current="page">Documentos</li>
          </ol>
        </div>
      </div>
    );
  }
}