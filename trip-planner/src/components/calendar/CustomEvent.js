
import React from 'react';
import clock from '../images/subway-solid.svg'

const customEvent = (props) => {
  const isMovement = props.isMovement;
  const color = props.color;
  if (isMovement !== undefined && isMovement) {
    return (<div className="evento center" style={{ backgroundColor: "rgb(57,111,158,.6)" }}>
      <img width="20" src={clock} height="20" alt="" className="pad-icon"></img>
      <span>{`${props.start.format('HH:mm')} - ${props.end.format('HH:mm')}`}</span>
    </div>);
  }
  else if (color !== undefined) {
    const colorString = color.r + ',' + color.g + ',' + color.b + ',.4 ';
    return (<div className="evento" style={{ backgroundColor: "rgb(" + colorString + ")" }} >
      <span>{`${props.start.format('HH:mm')} - ${props.end.format('HH:mm')}`}</span>
      <br />
      {props.value}
    </div>);
  } else {
    return (<div className="evento" style={{ backgroundColor: "rgb(139,195,74,.4)" }} >
      <span>{`${props.start.format('HH:mm')} - ${props.end.format('HH:mm')}`}</span>
      <br />
      {props.value}
    </div>);
  }

};

export default customEvent;