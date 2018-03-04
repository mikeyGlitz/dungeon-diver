import PropTypes from 'prop-types';
import L, { Map } from 'leaflet';
import { MapControl } from 'react-leaflet';
import { GeoSearchControl, Provider as BaseProvider } from 'leaflet-geosearch';
import { connect } from 'react-redux';

/* eslint-disable class-methods-use-this */
class SearchControl extends MapControl {
  static contextTypes = {
    map: PropTypes.instanceOf(Map),
  }
  static propTypes = {
    zoom: PropTypes.number.isRequired,
  }

  createLeafletElement() {
    const { map } = this.context;
    const { zoom } = this.props;
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
          const location = map.unproject(place.location, zoom);
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

export default connect(({ map }) => ({
  zoom: map.zoom,
}))(SearchControl);
