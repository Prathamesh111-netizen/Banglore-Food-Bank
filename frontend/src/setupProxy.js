const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://server-prathameshpawarspit.cloud.okteto.net',
      // target: 'http://localhost:2525',
      changeOrigin: true,
    })
  );
};