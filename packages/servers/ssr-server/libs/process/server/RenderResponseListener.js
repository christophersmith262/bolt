const ipc = require('../ipc');

class RenderResponseListener extends ipc.Listener {
  constructor(requests) {
    super();
    this.requests = requests;
  }

  async listenTo(subject) {
    subject.on('message', (message, socket) => {
      if (message.type == ipc.message.types['RENDER_RESPONSE']) {
        this.requests.resolve(message.id, message.markup);
      }
    });
  }
}

module.exports = {
  RenderResponseListener,
};
