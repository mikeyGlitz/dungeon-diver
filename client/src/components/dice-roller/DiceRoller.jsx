import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import DiceDisplay from './DiceDisplay';

import d4Icon from './d4.svg';
import d6Icon from './d6.svg';
import d8Icon from './d8.svg';
import d10Icon from './d10.svg';
import d12Icon from './d12.svg';
import d20Icon from './d20.svg';


const generateRandomNumber = upperBound =>
  Math.floor(Math.random() * upperBound) + 1;

export default class DiceRoller extends Component {
  constructor(props) {
    super(props);
    this.rollDice = this.rollDice.bind(this);
  }

  state = {
    d20: 0,
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
  };

  rollDice(numSides) {
    const rollResult = generateRandomNumber(numSides);
    const dice = {};
    dice[`d${numSides}`] = rollResult;
    this.setState(dice);
  }

  render() {
    return (
      <Grid>
        <DiceDisplay
          image={d20Icon}
          alt="d20"
          heading="D20"
          lastRoll={this.state.d20}
          action={() => {
            this.rollDice(20);
          }}
        />
        <DiceDisplay
          image={d4Icon}
          alt="D4"
          heading="D4"
          lastRoll={this.state.d4}
          action={() => {
            this.rollDice(4);
          }}
        />
        <DiceDisplay
          image={d6Icon}
          alt="d6"
          heading="D6"
          lastRoll={this.state.d6}
          action={() => {
            this.rollDice(6);
          }}
        />
        <DiceDisplay
          image={d8Icon}
          alt="d8"
          heading="D8"
          lastRoll={this.state.d8}
          action={() => {
            this.rollDice(8);
          }}
        />
        <DiceDisplay
          image={d10Icon}
          alt="d10"
          heading="D10"
          lastRoll={this.state.d10}
          action={() => {
            this.rollDice(10);
          }}
        />
        <DiceDisplay
          image={d12Icon}
          alt="d12"
          heading="D12"
          lastRoll={this.state.d12}
          action={() => {
            this.rollDice(12);
          }}
        />
      </Grid>
    );
  }
}
