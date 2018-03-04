const { Router } = require('express');
const { Observable } = require('rxjs');
const fetch = require('rxjs-fetch');

const router = new Router();

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

router.get('/', (req, resp) => {
  const { search, limit } = req.query;
  Observable.from(places)
    .flatMap(place => fetch(`https://loremaps.azurewebsites.net/data/Faerun/${place}.json`).text()
      .map(text => JSON.parse(text.trim()))
      .map(data => data.features.filter(feature => feature.geometry.type === 'Point'))
      .map(locations => locations.map(({ properties: { name }, geometry }) => ({
        name,
        type: place,
        location: geometry.coordinates,
      }))))
    .map((locations => locations.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;

      if (nameA > nameB) return 1;
      if (nameA < nameB) return -1;
      return 0;
    })))
    .mergeAll()
    .filter((item) => {
      const matches = search ?
        item.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 :
        true;
      return matches;
    })
    .take(limit || Infinity)
    .toArray()
    .subscribe(locations => resp.json(locations));
});

module.exports = router;
