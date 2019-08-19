const { RenderRequestListener } = require('../process/state/RenderRequestListener');
const { EnvironmentConnection } = require('./EnvironmentConnection');
const { EnvironmentConnectionPool } = require('./EnvironmentConnectionPool');
const messages = require('../process/ipc/messages');

async function create(config, environment, ipcNotify) {
  await Promise.race([
    environment.renderer.start(),
    new Promise(async (accept, reject) => {
      setTimeout(() => {
        reject();
      }, 5000);
    }),
  ]).catch(() => {
    console.log("Renderer did not start after 5 seconds!");
    process.exit();
  });

  const renderListener = new RenderRequestListener(config, environment);
  for (let i in ipcNotify) {
    const server = ipcNotify[i];

    renderListener.listenTo(server);

    server.emit('message', {
      type: messages.types['ENVIRONMENT_READY'],
      environment: environment.id,
    });
  }
}

module.exports = {
  create,
  EnvironmentConnection,
  EnvironmentConnectionPool,
  balancer: require('./balancer'),
};
