const fork = require('child_process').fork;
const path = require('path');
const cluster = require('cluster');
const ipc = require('node-ipc');
const { ProcessMessageLoop, IpcMessageAdapter } = require('./ipc/messages');
const { Process } = require('./Process');
const messages = require('./ipc/messages');
const environment = require('./environment');
const server = require('./server');
const { ServerStateListener } = require('./state/ServerStateListener');

async function startSandbox(config, sandboxId, serverIds, handler) {
  const app = new Process(config, 'sandbox'),
    channels = [];
  await app.startup();

  ipc.config.id = `bolt/ssr-server/sandbox/${sandboxId}`;
  ipc.config.retry = 500;
  ipc.config.silent = true;
  ipc.logger = () => {};

  for (let i in serverIds) {
    const serverId = serverIds[i],
      channelId = `bolt/ssr-server/server/${serverId}`;

    ipc.connectTo(channelId, `/tmp/bolt-ssr-server-${serverId}`, () => {
      channels.push(ipc.of[channelId]);
    });
  }

  await environment.create(config, handler, channels);
}

async function startClusterMaster(config) {
  const app = new Process(config, 'master'),
    servers = {},
    readyToSpawn = [],
    readyToServe = [];

  await app.startup();

  if (config.cluster) {
    for (let i = 0; i < config.cluster; i++) {
      const server = cluster.fork();
      servers[server.id] = server;
    }
  }
  else {
    servers[1] = new ProcessMessageLoop(1);
  }

  const listener = new ServerStateListener(config);
  for (let i in servers) {
    listener.listenTo(servers[i]);
  }

  if (!config.cluster) {
    servers[1].send({
      type: messages.types['SERVER_PROCESS_READY'],
      server: 1,
    });
  }

  await listener.readyToStart();

  const binDir = path.dirname(process.mainModule.filename),
    sandboxModulePath = path.resolve(binDir, './bolt-ssr-sandbox.js')
    processArgs = [];

  for (let i = 2; i < process.argv.length; i++) {
    processArgs.push(process.argv[i]);
  }

  for (let i in config.handlers) {
    const handler = config.handlers[i];
    if (handler.sandboxes) {
      for (let j = 0; j < handler.sandboxes; j++) {
        const serverIds = Object.keys(servers).join(','),
          args = [
            `--handler-id=${i}`,
            `--sandbox-id=sandbox:${i}:${j}`,
            `--server-ids=${serverIds}`,
          ];

        for (k in processArgs) {
          args.push(processArgs[k]);
        }

        fork(sandboxModulePath, args, ['pipe', 'pipe', 'pipe']);
      }
    }
    else if (!config.cluster) {
      environment.create(config, handler, [new IpcMessageAdapter(servers[1])]);
    }
  }

  await listener.started();
}

async function startClusterWorker(config) {
  const app = new Process(config, 'server'),
    messageLoop = new ProcessMessageLoop(cluster.worker.id);

  await app.startup();

  const messageHandler = async message => {
    if (message.type == messages.types['SERVER_START']) {
      await server.start(config, [messageLoop, process], cluster.worker.id);
    }
    else if (message.type == messages.types['SERVER_AWAITING_ENVIRONMENTS']) {
      for (let i in config.handlers) {
        const handler = config.handlers[i];

        if (!handler.sandboxes) {
          environment.create(config, handler, [new IpcMessageAdapter(messageLoop)]);
        }
      }
    }
  };

  messageLoop.on('message', messageHandler);
  process.on('message', messageHandler);

  process.send({
    type: messages.types['SERVER_PROCESS_READY'],
    server: cluster.worker.id,
  });
}


module.exports = {
  startClusterMaster,
  startClusterWorker,
  startSandbox,
};
