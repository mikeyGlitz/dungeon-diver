import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleSidebar as toggle } from '../../actions/sidebar';
import WikiContent from '../WikiContent';
import Beastiary from '../Beastiary';
import DiceRoller from '../dice-roller/DiceRoller';

import pinIcon from './map-pin.svg';
import diceIcon from './dice.svg';
import monsterIcon from './dragon.svg';

class SidebarContainer extends Component {
  static propTypes = {
    selectedPin: PropTypes.shape({
      name: PropTypes.string,
    }),
    collapsed: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
  }
  static defaultProps = {
    selectedPin: null,
  }

  render() {
    const {
      selectedPin,
      collapsed,
      toggleSidebar,
      tab,
    } = this.props;
    return (
      <Sidebar
        id="sidebar"
        collapsed={collapsed}
        selected={tab}
        onClose={() => toggleSidebar(true)}
        onOpen={(id) => {
          toggleSidebar(false, id);
        }}
      >
        <Tab
          id="dice"
          header="Dice Roller"
          icon={<img
            src={diceIcon}
            alt="dice"
            style={{ height: 32, width: 32, margin: 3 }}
          />}
        >
          <DiceRoller />
        </Tab>
        <Tab
          id="monsters"
          header="Bestiary"
          icon={<img
            src={monsterIcon}
            alt="monsters"
            style={{ height: 32, width: 32, margin: 3 }}
          />}
        >
          <Beastiary />
        </Tab>
        <Tab
          id="wikiContent"
          header={(selectedPin && selectedPin.name) || 'Location Details'}
          icon={<img
            src={pinIcon}
            alt="location"
            style={{ height: 32, width: 32, margin: 3 }}
          />}
        >
          {
            selectedPin ? <WikiContent ep="places" page={selectedPin.name} /> :
            <span>No location has been selected</span>
        }
        </Tab>
      </Sidebar>
    );
  }
}

export default connect(
  ({ map, sidebar }) => ({
    selectedPin: map.selectedPin,
    collapsed: sidebar.collapsed,
    tab: sidebar.tab,
  }),
  dispatch => ({
    toggleSidebar: bindActionCreators(toggle, dispatch),
  }),
)(SidebarContainer);
