const cluster = require('cluster');
const server = require('../server');
const { IpcMessageAdapter } = require('../ipc');
const ipc = require('../ipc');
const environment = require('../../environment');

class WorkerStateListener extends ipc.Listener {
  async listenTo(subject) {
    subject.on('message', async (message, sock) => {
      if (message.type == ipc.message.types['SERVER_START']) {
        await server.start(this.config, this.listeners, cluster.worker.id);
      }
      else if (message.type == ipc.message.types['SERVER_AWAITING_ENVIRONMENTS']) {
        for (let i in this.config.environments) {
          const environmentDef = this.config.environments[i];

          if (!environmentDef.sandboxes) {
            environment.create(this.config, environmentDef, [new IpcMessageAdapter(subject)]);
          }
        }
      }
    });
  }
}

module.exports = {
  WorkerStateListener,
};
