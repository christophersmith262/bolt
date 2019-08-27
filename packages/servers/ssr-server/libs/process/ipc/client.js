const rawIpc = require('node-ipc');

async function start(sandboxId, serverId) {
  const ipc = new rawIpc.IPC,
    channelId = `bolt/ssr-server/server/${serverId}`;

  ipc.config.id = `bolt/ssr-server/sandbox/${sandboxId}`;
  ipc.config.retry = 500;
  ipc.config.silent = true;
  ipc.logger = () => {};

  return new Promise(accept => {
    ipc.connectTo(channelId, `/tmp/bolt-ssr-server-${serverId}`, () => {
      accept(ipc.of[channelId]);
    });
  });
}

module.exports = {
  start,
};
