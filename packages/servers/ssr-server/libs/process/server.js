const ipc = require('node-ipc');
const messages = require('./ipc/messages');
const { ProcessMessageLoop, IpcMessageAdapter } = require('./ipc/messages');
const { EnvironmentListener } = require('./state/EnvironmentListener');
const { RenderResponseListener } = require('./state/RenderResponseListener');
const { RenderRequestTracker } = require('./state/RenderRequestTracker');
const { RenderRequestExecutor } = require('./state/RenderRequestExecutor');

async function start(config, processNotify, id) {
  const requests = new RenderRequestTracker(process.pid),
    environmentListener = new EnvironmentListener(config, requests),
    responseListener = new RenderResponseListener(requests);

  for (let i in processNotify) {
    if (processNotify[i].isProcessMessageLoop) {
      const adapter = new IpcMessageAdapter(processNotify[i]);
      environmentListener.listenTo(adapter);
      responseListener.listenTo(adapter);
    }
  }

  ipc.config.id = `bolt/ssr-server/server/${id}`;
  ipc.config.retry = 500;
  ipc.config.silent = true;

  ipc.serve(`/tmp/bolt-ssr-server-${id}`, () => {
    environmentListener.listenTo(ipc.server);
    responseListener.listenTo(ipc.server);
  });
  ipc.server.start();

  for (let i in processNotify) {
    processNotify[i].send({
      type: messages.types['SERVER_AWAITING_ENVIRONMENTS'],
      server: id,
    });
  }

  const executor  = new RenderRequestExecutor(await environmentListener.getEnvironments());

  await config.server.start(config.handlers, executor);

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
