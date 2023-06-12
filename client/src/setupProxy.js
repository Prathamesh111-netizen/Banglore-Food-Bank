const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('process.env.REACT_APP_BACKEND_SERVER', process.env.REACT_APP_BACKEND_SERVER);
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_SERVER,
      changeOrigin: true,
    })
  );
};