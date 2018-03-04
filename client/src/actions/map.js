import { sendRequest } from './util';

export const SELECT_MARKER = 'select-marker';
export const INIT_LOCATION_REQUEST = 'init-location-request';
export const SET_LOCATIONS = 'set-locations';

export const selectMarker = marker => ({
  type: SELECT_MARKER,
  marker,
});

const markersLoading = () => ({
  type: INIT_LOCATION_REQUEST,
});

const setLocations = (locations) => {
  const places = {
    ports: locations.filter(location => location.type === 'Ports'),
    cities: locations.filter(location => location.type === 'Cities'),
    temples: locations.filter(location => location.type === 'Temples'),
    sites: locations.filter(location => location.type === 'Sites'),
    ruins: locations.filter(location => location.type === 'Ruins'),
    fortresses: locations.filter(location => location.type === 'Fortresses'),
    capitals: [
      ...locations.filter(location => location.type === 'Capitals'),
      ...locations.filter(location => location.type === 'PortCapitals'),
    ],
  };

  const action = { type: SET_LOCATIONS, locations: places };

  return action;
};

export const getMarkers = dispatch =>
  () => sendRequest(dispatch)('/places', null, markersLoading, setLocations);
