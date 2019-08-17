const { RenderRequestListener } = require('../process/state/RenderRequestListener');
const { EnvironmentConnection } = require('./EnvironmentConnection');
const { EnvironmentConnectionPool } = require('./EnvironmentConnectionPool');
const messages = require('../process/ipc/messages');

async function create(config, handler, ipcNotify) {
  await Promise.race([
    handler.renderer.start(),
    new Promise(async (accept, reject) => {
      setTimeout(() => {
        reject();
      }, 5000);
    }),
  ]).catch(() => {
    console.log("Renderer did not start after 5 seconds!");
    process.exit();
  });

  const renderListener = new RenderRequestListener(config, handler);
  for (let i in ipcNotify) {
    const server = ipcNotify[i];

    renderListener.listenTo(server);

    server.emit('message', {
      type: messages.types['ENVIRONMENT_READY'],
      handler: handler.id,
    });
  }
}

module.exports = {
  create,
  EnvironmentConnection,
  EnvironmentConnectionPool,
  balancer: require('./balancer'),
};
