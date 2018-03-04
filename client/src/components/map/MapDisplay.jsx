import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-geosearch/assets/css/leaflet.css';
import 'sidebar-v2/css/leaflet-sidebar.css';
import 'sidebar-v2/css/gmaps-sidebar.css';
import 'font-awesome/css/font-awesome.css';
import L from 'leaflet';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  LayersControl,
  LayerGroup,
  TileLayer,
  FeatureGroup,
  Marker,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import PrintControl from 'react-leaflet-easyprint';

import Sidebar from './Sidebar';
import SearchControl from './SearchControl';

import './MapPane.css';
import mapMarker from './map-marker-pin.svg';

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

const minZoom = 0;
const maxZoom = 6;

export default class MapDisplay extends Component {
  static propTypes = {
    onMarkerSelect: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    locations: PropTypes.shape({
      ports: PropTypes.arrayOf(PropTypes.object),
      cities: PropTypes.arrayOf(PropTypes.object),
      capitals: PropTypes.arrayOf(PropTypes.object),
      fortresses: PropTypes.arrayOf(PropTypes.object),
      sites: PropTypes.arrayOf(PropTypes.object),
      temples: PropTypes.arrayOf(PropTypes.object),
      ruins: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    zoom: PropTypes.number.isRequired,
  }
  state = {
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
    center: [0, 0],
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

    /* eslint-disable react/no-did-mount-set-state */
    this.setState({ center: new L.LatLngBounds(this.mapBounds).getCenter() });
    /* eslint-enable */

    const places = this.props.locations;
    const newLocations = Object.keys(places)
      .reduce((acc, place) => {
        const locs = places[place]
          .map(location => ({ ...location, location: map.unproject(location.location) }));
        acc[place] = locs;
        return acc;
      }, {});
    /* eslint-disable react/no-did-mount-set-state */
    this.setState({ bounds, locations: newLocations });
    /* eslint-enable */
  }

  render() {
    const { zoom, onMarkerSelect, toggleSidebar } = this.props;
    const locations = Object.keys(this.state.locations)
      .map(key => (
        <LayersControl.Overlay key={key} name={key} checked>
          <LayerGroup>
            {this.state.locations[key]
              .map(location => (
                <Marker
                  icon={L.icon({ iconUrl: mapMarker, iconSize: [32, 32] })}
                  position={location.location}
                  onclick={() => {
                    this.setState({ center: location.location });
                    onMarkerSelect(location);
                    toggleSidebar();
                  }}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
      ));

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Sidebar />
        <Map
          className="sidebar-map"
          zoom={zoom}
          maxZoom={maxZoom}
          minZoom={minZoom}
          center={this.state.center}
          maxBounds={this.mapBounds}
          ref={(map) => { this.map = map && map.leafletElement; }}
        >
          <LayersControl position="topright">
            {locations}
          </LayersControl>
          <FeatureGroup>
            <EditControl position="topright" />
          </FeatureGroup>
          <FeatureGroup>
            <SearchControl position="topleft" />
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
