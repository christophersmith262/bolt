class EnvironmentConnectionPool {
  constructor() {
    this.environments = {};
  }

  async addConnection(environmentId, connection) {
    if (!(environmentId in this.environments)) {
      this.environments[environmentId] = new Map();
    }
    this.environments[environmentId].set(connection.socket, connection);
  }

  async removeConnection(environmentId, socket) {
    if (environmentId in this.environments) {
      this.environments[environmentId].delete(socket);
    }
  }

  async getConnections(environmentId) {
    return this.environments[environmentId].values();
  }
}

module.exports = {
  EnvironmentConnectionPool,
};
