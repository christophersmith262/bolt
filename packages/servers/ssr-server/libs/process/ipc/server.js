const rawIpc = require('node-ipc');

async function start(id) {
  const ipc = new rawIpc.IPC;

  ipc.config.id = `bolt/ssr-server/server/${id}`;
  ipc.config.retry = 500;
  ipc.config.silent = true;

  return new Promise(accept => {
    ipc.serve(`/tmp/bolt-ssr-server-${id}`, () => {
      accept(ipc.server);
    });
    ipc.server.start();
  });
}

module.exports = {
  start,
};
