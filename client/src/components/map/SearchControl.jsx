import PropTypes from 'prop-types';
import L, { Map } from 'leaflet';
import { MapControl } from 'react-leaflet';
import { GeoSearchControl, Provider as BaseProvider } from 'leaflet-geosearch';

/* eslint-disable class-methods-use-this */
export default class SearchControl extends MapControl {
  static contextTypes = {
    map: PropTypes.instanceOf(Map),
  }

  createLeafletElement() {
    const { map } = this.context;
    class Provider extends BaseProvider {
      endpoint({ query }) {
        const params = this.getParamString({
          ...this.options.params,
          search: query,
        });

        return `/places?${params}`;
      }

      parse({ data }) {
        return data.map((place) => {
          const location = map.unproject(place.location, 5);
          const bounds = L.latLngBounds(location);
          return {
            x: location.lng,
            y: location.lat,
            label: place.name,
            bounds,
          };
        });
      }
    }

    return GeoSearchControl({
      provider: new Provider({
        params: {
          limit: 5,
        },
      }),
      autoClose: true,
      searchLabel: 'Search',
      retainZoomLevel: false,
      animateZoom: true,
      showMarker: true,
      showPopup: false,
      keepResult: false,
    });
  }
}
/* eslint-enable */
