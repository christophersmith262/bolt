const ipc = require('../process/ipc');

class EnvironmentConnection {
  constructor(server, socket, requests) {
    this.server = server;
    this.socket = socket;
    this.requests = requests;
  }

  async render(markup) {
    return new Promise(async accept => {
      this.server.emit(this.socket, 'message', {
        type: ipc.message.types['RENDER_REQUEST'],
        id: await this.requests.create(accept),
        markup,
      });
    });
  }
}

module.exports = {
  EnvironmentConnection,
};
