const messages = require('./process/ipc/messages');

class SocketWorkerPool {
  constructor(server) {
    this.channels = [];
    this.messages = [];
    this.server = server;
  }

  async start() {
    this.server.on('message', (message, socket) => {
      if (message.type == messages.types['RENDER_RESPONSE']) {
        const callback = this.messages[message.id];

        if (callback) {
          callback(message.markup);
          delete this.messages[message.id];
        }
      }
    });
  }

  async addChannel(socket) {
    this.channels.push(socket);
  }

  async render(markup) {
    let callback;
    const selected = Math.floor((Math.random() * this.channels.length)),
      promise = new Promise(accept => {
        callback = accept;
      });

    const id = this.messages.push(callback) - 1;
    this.server.emit(this.channels[selected], 'message', {
      type: messages.types['RENDER_REQUEST'],
      id,
      markup,
    });

    return promise;
  }
}

module.exports = {
  SocketWorkerPool,
};
