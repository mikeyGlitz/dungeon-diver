const { Router } = require('express');
const fetch = require('node-fetch');
const { Observable } = require('rxjs');

const realmsUrl = 'https://forgottenrealms.wikia.com';

const router = new Router();

router.get('/places/:name', (req, resp) => {
  const { name } = req.params;
  fetch(`${realmsUrl}/api.php?page=${name}&prop=text&redirects=true&action=parse&format=json`)
    .then(response => response.json())
    .then((data) => {
      const content = data.error ?
        `No references found for ${name}.` :
        data.parse.text['*'].replace(/\/wiki/g, `${realmsUrl}/wiki`);
      resp.json({ content });
    });
});

const dungeonsUrl = 'https://dungeons.wikia.com';

const queryMonsters = async (pagesQ = '') => {
  const response = await
    fetch(`${dungeonsUrl}/api.php?action=query&list=categorymembers&cmtitle=Category:Monster&cmlimit=500&cmtype=page&cmprop=title${pagesQ}&format=json`);
  let data = await response.json();
  data = {
    continue: data['query-continue'],
    monsters: data.query.categorymembers
      .map(member => member.title),
  };

  if (!data.continue) {
    return data.monsters;
  }
  const page = `&cmcontinue=${data.continue.categorymembers.cmcontinue}`;
  return [...data.monsters, ...await queryMonsters(page)];
};


router.get('/monsters', (_, resp) => {
  queryMonsters().then(data => resp.json(data));
});

router.get('/monsters/:name', (req, resp) => {
  const { name } = req.params;
  fetch(`${dungeonsUrl}/api.php?page=${name}&prop=text&redirects=true&action=parse&format=json`)
    .then(response => response.json())
    .then((data) => {
      const content = data.error ?
        `No references found for ${name}.` :
        data.parse.text['*'].replace(/\/wiki/g, `${dungeonsUrl}/wiki`);
      resp.json({ content });
    });
});

router.get('/monsters/searchsuggestions', (req, resp) => {
  const { search: term, count = 5 } = req.query;
  queryMonsters()
    .then((monsters) => {
      Observable.from(monsters)
        .filter(monster => monster.toLowerCase().indexOf(term) >= 0)
        .take(count)
        .toArray()
        .subscribe(suggestions => resp.json(suggestions));
    });
});

module.exports = router;
