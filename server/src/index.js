const { createServer } = require('http');
const app = require('./app');

const port = process.env.PORT || 8080;

createServer(app).listen(port);
