import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getMarkers, selectMarker } from '../../actions/map';
import { toggleSidebar } from '../../actions/sidebar';
import MapDisplay from './MapDisplay';

class MapPane extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    fetchLocations: PropTypes.func.isRequired,
    collapseSidebar: PropTypes.func.isRequired,
    zoom: PropTypes.number.isRequired,
    locations: PropTypes.shape({
      ports: PropTypes.arrayOf(PropTypes.object),
      cities: PropTypes.arrayOf(PropTypes.object),
      capitals: PropTypes.arrayOf(PropTypes.object),
      fortresses: PropTypes.arrayOf(PropTypes.object),
      sites: PropTypes.arrayOf(PropTypes.object),
      temples: PropTypes.arrayOf(PropTypes.object),
      ruins: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    selectPin: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.fetchLocations();
  }

  render() {
    const {
      loading,
      locations,
      selectPin,
      collapseSidebar,
      zoom,
    } = this.props;
    if (loading) return <div>Loading...</div>;
    return (
      <MapDisplay
        locations={locations}
        onMarkerSelect={selectPin}
        toggleSidebar={() => collapseSidebar(false, 'wikiContent')}
        zoom={zoom}
      />
    );
  }
}

export default connect(
  ({ map }) => ({
    loading: map.loading,
    locations: map.locations,
    zoom: map.zoom,
  }),
  dispatch => ({
    fetchLocations: getMarkers(dispatch),
    selectPin: bindActionCreators(selectMarker, dispatch),
    collapseSidebar: bindActionCreators(toggleSidebar, dispatch),
  }),
)(MapPane);
