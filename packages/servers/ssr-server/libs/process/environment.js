const { RenderRequestListener } = require('./state/RenderRequestListener');
const messages = require('./ipc/messages');

async function create(config, handler, ipcNotify) {
  handler.renderer.setDom(handler.dom);

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

  for (let i in ipcNotify) {
    const server = ipcNotify[i],
      renderListener = new RenderRequestListener(config, handler);

    renderListener.listenTo(server);

    server.emit('message', {
      type: messages.types['ENVIRONMENT_READY'],
      handler: handler.id,
    });
  }
}

module.exports = {
  create,
};
