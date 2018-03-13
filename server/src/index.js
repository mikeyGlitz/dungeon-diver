const { createServer } = require('https');
const app = require('./app');
const { certPromise, secretPromise, port } = require('./config');

(async () => {
  const cert = await certPromise;
  const secret = await secretPromise;

  createServer({ key: secret, cert }, app)
    .listen(port, () => console.info(`Now listening on ${port}...`));
})();
