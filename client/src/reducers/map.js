import {
  SELECT_MARKER,
  INIT_LOCATION_REQUEST,
  SET_LOCATIONS,
} from '../actions/map';

const dimensions = {
  height: 4763,
  width: 3185,
};

const tileSize = 256;

const INITIAL_STATE = {
  loading: false,
  zoom:
    Math.ceil(Math.log(Math.max(dimensions.width, dimensions.height) / tileSize) / Math.log(2)),
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
};

export default (state = INITIAL_STATE, { type, ...action }) => {
  switch (type) {
    case SELECT_MARKER:
      return { ...state, selectedPin: action.marker };
    case INIT_LOCATION_REQUEST:
      return { ...state, loading: true };
    case SET_LOCATIONS:
      return { ...state, loading: false, locations: { ...action.locations } };
    default:
      return state;
  }
};
