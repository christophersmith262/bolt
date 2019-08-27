const { Process } = require('./Process');

module.exports = {
  ipc: require('./ipc'),
  master: require('./master'),
  program: require('./program'),
  sandbox: require('./sandbox'),
  server: require('./server'),
  worker: require('./worker'),
  Process,
};
