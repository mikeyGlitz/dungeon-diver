const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const proxy = require('http-proxy-middleware');
const fetch = require('node-fetch');

const app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/wiki/:name', (req, resp) => {
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

app.use('/data', proxy({
  target: 'https://loremaps.azurewebsites.net',
  changeOrigin: true,
  pathRewrite: (path) => {
    const index = path.lastIndexOf('/');
    const name = path.slice(index + 1);

    const finalPath = `/data/Faerun/${name}.json`;
    return finalPath;
  },
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
