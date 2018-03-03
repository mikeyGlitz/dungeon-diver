const { Router } = require('express');
const WikiRouter = require('./WikiRouter');
const proxy = require('http-proxy-middleware');

const router = new Router();

router.use('/data', proxy({
  target: 'https://loremaps.azurewebsites.net',
  changeOrigin: true,
  pathRewrite: (path) => {
    const index = path.lastIndexOf('/');
    const name = path.slice(index + 1);

    const finalPath = `/data/Faerun/${name}.json`;
    return finalPath;
  },
}));
router.use('/wiki', WikiRouter);

// catch 404 and forward to error handler
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;
