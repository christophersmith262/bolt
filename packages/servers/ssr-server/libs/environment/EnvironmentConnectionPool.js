const messages = require('../process/ipc/messages');

class EnvironmentConnectionPool {
  constructor() {
    this.environments = {};
  }

  async addConnection(environmentId, connection) {
    if (!(environmentId in this.environments)) {
      this.environments[environmentId] = [];
    }
    this.environments[environmentId].push(connection);
  }

  async getConnections(environmentId) {
    return this.environments[environmentId];
  }
}

module.exports = {
  EnvironmentConnectionPool,
};
