const cluster = require('cluster');
const { Listener } = require('./Listener');
const server = require('../server');
const { IpcMessageAdapter } = require('../ipc/messages');
const messages = require('../ipc/messages');
const environment = require('../../environment');

class WorkerStateListener extends Listener {
  async listenTo(subject) {
    subject.on('message', async message => {
      if (message.type == messages.types['SERVER_START']) {
        await server.start(this.config, this.listeners, cluster.worker.id);
      }
      else if (message.type == messages.types['SERVER_AWAITING_ENVIRONMENTS']) {
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
