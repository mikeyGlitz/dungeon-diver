import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'sidebar-v2/css/leaflet-sidebar.css';
import 'sidebar-v2/css/gmaps-sidebar.css';
import 'font-awesome/css/font-awesome.css';
import L from 'leaflet';
import React, { Component } from 'react';
import {
  Map,
  LayersControl,
  LayerGroup,
  TileLayer,
  FeatureGroup,
  Marker,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
import PrintControl from 'react-leaflet-easyprint';

import queryLocations from '../../helpers';
import WikiContent from '../WikiContent';
import Beastiary from '../Beastiary';

import './MapPane.css';
import mapMarker from './map-marker-pin.svg';
import pinIcon from './map-pin.svg';
import diceIcon from './dice.svg';
import monsterIcon from './dragon.svg';

const attribution = `
<a href="https://loremaps.azurewebsites.net">LoreMaps</a> |
Map Data <a href="https://pocketplane.net">PocketPlane</a> |
Info <a href="https://forgottenrealms.wikia.com">Forgotten Realms Wiki</a> |
Info <a href="https://dungeons.wikia.com">D&D Wiki</a>
`;

const dimension = {
  height: 4763,
  width: 3185,
};

const tilesize = 256;

const minZoom = 0;
const maxZoom = 6;
const zoomLevel =
  Math.ceil(Math.log(Math.max(dimension.width, dimension.height) / tilesize) / Math.log(2));

export default class MapPane extends Component {
  state = {
    collapsed: true,
    bounds: null,
    locations: {
      ports: [],
      cities: [],
      capitals: [],
      fortresses: [],
      sites: [],
      temples: [],
      ruins: [],
    },
    selectedPin: null,
    selected: 'dice',
  };

  componentDidMount() {
    const { map } = this;
    const southWest = map.unproject([0, dimension.height]);
    const northEast = map.unproject([dimension.width, 0]);
    /* eslint-disable new-cap */
    const bounds = new L.latLngBounds(southWest, northEast);
    /* eslint-enable */

    this.mapBounds = [
      [northEast.lat, southWest.lng],
      [northEast.lng, southWest.lat].map(coord => Math.abs(coord)),
    ];

    this.centerPoint = new L.LatLngBounds(this.mapBounds).getCenter();

    const places = [
      'Ports',
      'Cities',
      'Capitals',
      'PortCapitals',
      'Temples',
      'Sites',
      'Ruins',
      'Fortresses',
    ];

    queryLocations(places)
      .then(locations => locations
        .map(location => ({ ...location, location: map.unproject(location.location) })))
      .then(locations => this.setState({
        bounds,
        locations: {
          ports: locations.filter(location => location.type === 'Ports'),
          cities: locations.filter(location => location.type === 'Cities'),
          temples: locations.filter(location => location.type === 'Temples'),
          sites: locations.filter(location => location.type === 'Sites'),
          ruins: locations.filter(location => location.type === 'Ruins'),
          fortresses: locations.filter(location => location.type === 'Fortresses'),
          portCapitals: [
            ...locations.filter(location => location.type === 'Capitals'),
            ...locations.filter(location => location.type === 'PortCapitals'),
          ],
        },
      }));
  }

  render() {
    const locations = Object.keys(this.state.locations)
      .map(key => (
        <LayersControl.Overlay name={key} checked>
          <LayerGroup>
            {this.state.locations[key]
              .map(location => (
                <Marker
                  icon={L.icon({ iconUrl: mapMarker, iconSize: [32, 32] })}
                  position={location.location}
                  onclick={() => {
                    this.centerPoint = location.location;
                    this.setState({
                      ...this.state,
                      collapsed: false,
                      selected: 'wikiContent',
                      selectedPin: location.name,
                    });
                  }}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
      ));

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Sidebar
          collapsed={this.state.collapsed}
          selected={this.state.selected}
          onClose={() => this.setState({ ...this.state, selectedPin: null, collapsed: true })}
          onOpen={id => this.setState({ ...this.state, collapsed: false, selected: id })}
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
            <div>
              Coming Soon...
            </div>
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
            header={this.state.selectedPin || 'Location Details'}
            icon={<img
              src={pinIcon}
              alt="location"
              style={{ height: 32, width: 32, margin: 3 }}
            />}
          >
            {
              this.state.selectedPin ? <WikiContent ep="places" page={this.state.selectedPin} /> :
              <span>No location has been selected</span>
          }

          </Tab>
        </Sidebar>
        <Map
          className="sidebar-map"
          zoom={zoomLevel}
          maxZoom={maxZoom}
          minZoom={minZoom}
          center={this.centerPoint || [0, 0]}
          maxBounds={this.mapBounds}
          onfocus={() => this.setState({ ...this.state, selectedPin: null })}
          ref={(map) => { this.map = map && map.leafletElement; }}
        >
          <LayersControl position="topright">
            {locations}
          </LayersControl>
          <FeatureGroup>
            <EditControl position="topright" />
          </FeatureGroup>
          <PrintControl
            position="topleft"
            sizeModes={['Current', 'A4Portrait', 'A4Landscape']}
            hideControlContainer={false}
            title="Export as PNG"
            exportOnly
          />
          <TileLayer
            attribution={attribution}
            url="https://loremaps.github.io/LoreMaps-Faerun-Tiles/Tiles/{z}/{x}/{y}.png"
            noWrap={!0}
            bounds={this.state.bounds}
          />
        </Map>
      </div>
    );
  }
}
