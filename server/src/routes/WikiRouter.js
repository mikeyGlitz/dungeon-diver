const { Router } = require('express');
const fetch = require('node-fetch');
const { Observable } = require('rxjs');

const realmsUrl = 'https://forgottenrealms.wikia.com';

const buildUrlString = params => Object.keys(params)
  .map(key => `${key}=${params[key]}`)
  .join('&');

const router = new Router();

router.get('/places/:name', (req, resp) => {
  const { name } = req.params;

  const params = {
    page: name,
    prop: 'text',
    redirects: true,
    action: 'parse',
    format: 'json',
  };

  const queryParams = buildUrlString(params);

  fetch(`${realmsUrl}/api.php?${queryParams}`)
    .then(response => response.json())
    .then((data) => {
      const content = data.error ?
        `No references found for ${name}.` :
        data.parse.text['*'].replace(/\/wiki/g, `${realmsUrl}/wiki`);
      resp.json({ content });
    });
});

const dungeonsUrl = 'https://dnd-wiki.org';

const { Agent } = require('https');

const agent = new Agent({
  rejectUnauthorized: false,
});

const queryMonsters = async (cmcontinue) => {
  const params = {
    rawcontinue: '',
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:Monster',
    cmlimit: '500',
    cmtype: 'page',
    cmprop: 'title',
    format: 'json',
  };
  if (cmcontinue) params.cmcontinue = cmcontinue;

  const queryParams = buildUrlString(params);

  const response = await
    fetch(`${dungeonsUrl}/w/api.php?${queryParams}`, { agent });
  let data = await response.json();
  data = {
    continue: data['query-continue'],
    monsters: data.query.categorymembers
      .map(member => member.title),
  };

  if (!data.continue) {
    return data.monsters;
  }
  const { cmcontinue: cmContinue } = data.continue.categorymembers;
  return [...data.monsters, ...await queryMonsters(cmContinue)];
};

router.get('/monsters', (_, resp) => {
  Observable.from(queryMonsters())
    .mergeAll()
    .toArray()
    .map(monsters => monsters.sort())
    .subscribe(data => resp.json(data));
});

router.get('/monsters/searchsuggestions', (req, resp) => {
  const { search = '', count = 5 } = req.query;
  const term = search.toLowerCase();
  Observable.from(queryMonsters())
    .mergeAll()
    .toArray()
    .flatMap(monsters => monsters.sort())
    .filter(monster => monster.toLowerCase().indexOf(term) >= 0)
    .take(count)
    .toArray()
    .subscribe(suggestions => resp.json(suggestions));
});


router.get('/monsters/:name', (req, resp) => {
  const { name } = req.params;
  const params = {
    page: name,
    prop: 'text',
    redirects: true,
    action: 'parse',
    format: 'json',
  };

  const queryParams = buildUrlString(params);

  fetch(`${dungeonsUrl}/w/api.php?${queryParams}`, { agent })
    .then(response => response.json())
    .then((data) => {
      const content = data.error ?
        `No references found for ${name}.` :
        data.parse.text['*']
          .replace(/\/wiki/g, `${dungeonsUrl}/wiki`)
          .replace(/\/w\//g, `${dungeonsUrl}/w/`);
      resp.json({ content });
    });
});

module.exports = router;
