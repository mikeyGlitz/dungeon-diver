const queryLocations = places =>
  Promise.all(places.map(place => fetch(`/data/${place}`)
    .then(resp => resp.json())
    .then(data => data.features
      .filter(item => item.geometry.type === 'Point')
      .map(({ properties: { name }, geometry }) => ({
        name,
        location: geometry.coordinates,
        type: place,
      })))))
    .then(locations => locations.reduce((acc, location) => [...acc, ...location], []));

export default queryLocations;
