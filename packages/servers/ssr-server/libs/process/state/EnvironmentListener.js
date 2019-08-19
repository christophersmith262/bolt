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
        this.environments.addConnection(message.environment, new EnvironmentConnection(subject, socket, this.requests));

        // Ready once there is at least one worker for each environment.
        if (environments.length == this.config.environments.length) {
          this._ready(environments);
        }
      }
    });
  }

  async getConnections() {
    return await this.promise;
  }
}

module.exports = {
  EnvironmentListener,
};
