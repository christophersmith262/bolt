const cluster = require('cluster');
const { ProcessMessageLoop, IpcMessageAdapter } = require('../ipc');
const { Process } = require('../Process');
const { MasterStateListener } = require('./MasterStateListener');
const { HealthMonitor } = require('./HealthMonitor');
const ipc = require('../ipc');
const environment = require('../../environment');
const sandbox = require('../sandbox');

async function start(config) {
  const app = new Process(config, 'master'),
    servers = {};

  await app.startup();

  const healthMonitor = new HealthMonitor();
  const listener = new MasterStateListener(config);
  if (config.cluster) {
    for (let i = 0; i < config.cluster; i++) {
      const server = cluster.fork();
      servers[server.id] = server;
    }
  }
  else {
    servers[1] = new ProcessMessageLoop(1);
  }

  for (let i in servers) {
    listener.listenTo(servers[i]);
    healthMonitor.monitor(servers[i]);
  }

  if (!config.cluster) {
    servers[1].send({
      type: ipc.message.types['SERVER_PROCESS_READY'],
      server: 1,
    });
  }

  await listener.readyToStart();

  for (let i in config.environments) {
    const environmentDef = config.environments[i];
    if (environmentDef.sandboxes) {
      for (let j = 0; j < environmentDef.sandboxes; j++) {
        await new Promise(async accept => {
          const child = await sandbox.fork(i, Object.keys(servers).join(','));
          healthMonitor.monitor(child);
          setTimeout(accept, 500);
        });
      }
    }
    else if (!config.cluster) {
      environment.create(config, environmentDef, [new IpcMessageAdapter(servers[1])]);
    }
  }

  await listener.started();
}

module.exports = {
  start,
  HealthMonitor,
  MasterStateListener,
}
