const { Http2Server } = require('./Http2Server');
const { HttpServer } = require('./HttpServer');

module.exports = function http(config) {
  config = config || {};
  config.version = config.version || 1;

  if (config.version == 2) {
    return new Http2Server(config);
  }
  else if (config.version == 1) {
    return new HttpServer(config);
  }
  else {
    throw new Error('Invalid version http version.');
  }
};

module.exports.HttpServer = HttpServer;
module.exports.Http2Server = Http2Server;
