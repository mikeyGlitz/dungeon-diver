import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'react-bootstrap';

const DiceDisplay = props => (
  <Grid style={{ textAlign: 'center' }}>
    <h2>{props.heading}</h2>
    <div>
      <img
        src={props.image}
        alt={props.altText}
        style={{ height: 100, width: 100 }}
      />
    </div>
    <p><b>Last Roll:</b>&nbsp;{props.lastRoll}</p>
    <Button onClick={props.action}>Roll</Button>
    <hr />
  </Grid>
);

DiceDisplay.propTypes = {
  heading: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  lastRoll: PropTypes.number.isRequired,
  altText: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};

export default DiceDisplay;
