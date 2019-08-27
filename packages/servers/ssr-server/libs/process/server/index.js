const { EnvironmentListener } = require('./EnvironmentListener');
const { RenderResponseListener } = require('./RenderResponseListener');
const { RenderRequestTracker } = require('../../request/RenderRequestTracker');
const { RenderRequestRouter } = require('../../request/router');
const { ProcessMessageLoop, IpcMessageAdapter } = require('../ipc');
const ipc = require('../ipc');

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

  ipc.server.start(id).then(server => {
    environmentListener.listenTo(server);
    responseListener.listenTo(server);
  });

  for (let i in processNotify) {
    processNotify[i].send({
      type: ipc.message.types['SERVER_AWAITING_ENVIRONMENTS'],
      server: id,
    });
  }

  config.router.setRoutes(config.routes)
    .setEnvironments(config.environments)
    .setConnections(await environmentListener.getConnections());

  await config.server.start(config.router);

  for (let i in processNotify) {
    processNotify[i].send({
      type: ipc.message.types['SERVER_READY'],
      server: id,
    });
  }
}

module.exports = {
  start,
  EnvironmentListener,
  RenderResponseListener,
};

