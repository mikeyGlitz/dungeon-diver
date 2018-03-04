import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const DiceDisplay = props => (
  <div style={{ textAlign: 'center' }}>
    <h2>{props.heading}</h2>
    <div>
      <img
        src={props.image}
        alt={props.altText}
        style={{ height: '100px', width: '100px' }}
      />
    </div>
    <p><b>Last Roll:</b>&nbsp;{props.lastRoll}</p>
    <Button onClick={props.action}>Roll</Button>
    <hr />
  </div>
);

DiceDisplay.propTypes = {
  heading: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  lastRoll: PropTypes.number.isRequired,
  altText: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};

export default DiceDisplay;
