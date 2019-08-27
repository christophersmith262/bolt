const cluster = require('cluster');
const { ProcessMessageLoop } = require('../ipc');
const { Process } = require('../Process');
const ipc = require('../ipc');
const { WorkerStateListener } = require('./WorkerStateListener');

async function start(config) {
  const app = new Process(config, 'server'),
    messageLoop = new ProcessMessageLoop(cluster.worker.id);

  await app.startup();

  const listener = new WorkerStateListener(config, [messageLoop, process]);
  listener.listenTo(messageLoop);
  listener.listenTo(process);

  process.send({
    type: ipc.message.types['SERVER_PROCESS_READY'],
    server: cluster.worker.id,
  });
}

module.exports = {
  start,
  WorkerStateListener,
}
