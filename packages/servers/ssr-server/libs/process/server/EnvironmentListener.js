const { EnvironmentConnectionPool } = require('../../environment/EnvironmentConnectionPool');
const { EnvironmentConnection } = require('../../environment/EnvironmentConnection');
const ipc = require('../ipc');

class EnvironmentListener extends ipc.Listener {
  constructor(config, requests) {
    super(config);
    this.environments = new EnvironmentConnectionPool();
    this.requests = requests;
    this.promise = new Promise(ready => {
      this._ready = ready;
    });
  }

  async listenTo(subject) {
    subject.on('message', async (message, socket) => {
      if (message.type == ipc.message.types['ENVIRONMENT_READY']) {
        await this.environments.addConnection(message.environment, new EnvironmentConnection(subject, socket, this.requests));

        // Ready once there is at least one worker for each environment.
        if (this.environments.length == this.config.environments.length) {
          this._ready(this.environments);
        }
      }
      else if (message.type == ipc.message.types['ENVIRONMENT_SHUTDOWN']) {
        this.environments.removeConnection(message.environment, socket);

        if (socket) {
          socket.emit('message', {
            type: ipc.message.types['ENVIRONMENT_SHUTDOWN_ACK'],
          });
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
