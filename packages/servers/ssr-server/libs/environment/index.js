const { IpcMessageAdapter } = require('../process/ipc');
const { RenderRequestListener } = require('./RenderRequestListener');
const { EnvironmentConnection } = require('./EnvironmentConnection');
const { EnvironmentConnectionPool } = require('./EnvironmentConnectionPool');
const ipc = require('../process/ipc');

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

  const renderListener = new RenderRequestListener(config, new IpcMessageAdapter(process), environment);
  process.on('SIGINT', async () => {
    await Promise.race([
      new Promise(async accept => {
        for (let i in ipcNotify) {
          ipcNotify[i].emit('message', {
            type: ipc.message.types['ENVIRONMENT_SHUTDOWN'],
            environment: environment.id,
          });
        }

        await renderListener.canShutdown();
      }),
      new Promise(accept => {
        setTimeout(accept, 5000);
      }),
    ]);

    process.exit();
  });

  for (let i in ipcNotify) {
    const server = ipcNotify[i];

    renderListener.listenTo(server);

    server.emit('message', {
      type: ipc.message.types['ENVIRONMENT_READY'],
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
