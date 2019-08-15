const { Listener } = require('./Listener');
const { SocketWorkerPool } = require('../../SocketWorkerPool');
const messages = require('../ipc/messages');

class EnvironmentListener extends Listener {
  constructor(config) {
    super(config);
    this.workers = {};
    this.promise = new Promise(ready => {
      this._ready = ready;
    });
  }

  async listenTo(subject) {
    const workers = this.workers;

    subject.on('message', (message, socket) => {
      if (message.type == messages.types['ENVIRONMENT_READY']) {
        if (!(message.handler in workers)) {
          workers[message.handler] = new SocketWorkerPool(subject);
          workers[message.handler].start();
          this.config.handlers[message.handler].workers = workers[message.handler];
        }
        workers[message.handler].addChannel(socket);

        // Ready once there is at least one worker for each handler.
        if (workers.length == this.config.handlers.length) {
          this._ready(workers);
        }
      }
    });
  }

  async getWorkers() {
    return await this.promise;
  }
}

module.exports = {
  EnvironmentListener,
};
