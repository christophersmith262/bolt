const messages = require('../process/ipc/messages');

class EnvironmentConnectionPool {
  constructor() {
    this.environments = {};
  }

  async addConnection(handlerId, connection) {
    if (!(handlerId in this.environments)) {
      this.environments[handlerId] = [];
    }
    this.environments[handlerId].push(connection);
  }

  async getConnections(handlerId) {
    return this.environments[handlerId];
  }
}

module.exports = {
  EnvironmentConnectionPool,
};
