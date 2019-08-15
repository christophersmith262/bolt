const ipc = require('node-ipc');
const messages = require('./ipc/messages');
const { ProcessMessageLoop, IpcMessageAdapter } = require('./ipc/messages');
const { EnvironmentListener } = require('./state/EnvironmentListener');

async function start(config, processNotify, id) {
  const listener = new EnvironmentListener(config);

  for (let i in processNotify) {
    if (processNotify[i].isProcessMessageLoop) {
      listener.listenTo(new IpcMessageAdapter(processNotify[i]));
    }
  }

  ipc.config.id = `bolt/ssr-server/server/${id}`;
  ipc.config.retry = 500;
  ipc.config.silent = true;

  ipc.serve(`/tmp/bolt-ssr-server-${id}`, () => {
    listener.listenTo(ipc.server);
  });
  ipc.server.start();

  for (let i in processNotify) {
    processNotify[i].send({
      type: messages.types['SERVER_AWAITING_ENVIRONMENTS'],
      server: id,
    });
  }

  config.server.setWorkers(await listener.getWorkers());
  await config.server.start();

  for (let i in processNotify) {
    processNotify[i].send({
      type: messages.types['SERVER_READY'],
      server: id,
    });
  }
}

module.exports = {
  start,
};
