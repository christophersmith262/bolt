const { Listener } = require('./Listener');
const { EnvironmentConnectionPool } = require('../../environment/EnvironmentConnectionPool');
const { EnvironmentConnection } = require('../../environment/EnvironmentConnection');
const messages = require('../ipc/messages');

class EnvironmentListener extends Listener {
  constructor(config, requests) {
    super(config);
    this.environments = new EnvironmentConnectionPool();
    this.requests = requests;
    this.promise = new Promise(ready => {
      this._ready = ready;
    });
  }

  async listenTo(subject) {
    const environments = this.environments;

    subject.on('message', (message, socket) => {
      if (message.type == messages.types['ENVIRONMENT_READY']) {
        this.environments.addConnection(message.handler, new EnvironmentConnection(subject, socket, this.requests));

        // Ready once there is at least one worker for each handler.
        if (environments.length == this.config.handlers.length) {
          this._ready(environments);
        }
      }
    });
  }

  async getEnvironments() {
    return await this.promise;
  }
}

module.exports = {
  EnvironmentListener,
};
