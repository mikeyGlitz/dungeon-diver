const { Router } = require('express');
const fetch = require('node-fetch');

const router = new Router();

router.get('/:name', (req, resp) => {
  const { name } = req.params;
  fetch(`https://forgottenrealms.wikia.com/api.php?page=${name}&prop=text&redirects=true&action=parse&format=json`)
    .then(response => response.json())
    .then((data) => {
      const content = data.error ?
        `No references found for ${name}.` :
        data.parse.text['*'];
      resp.status(200).json({ content });
    });
});

module.exports = router;
