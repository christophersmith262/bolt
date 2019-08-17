const { Listener } = require('./Listener');
const messages = require('../ipc/messages');

class RenderResponseListener extends Listener {
  constructor(requests) {
    super();
    this.requests = requests;
  }

  async listenTo(subject) {
    subject.on('message', (message, socket) => {
      if (message.type == messages.types['RENDER_RESPONSE']) {
        this.requests.resolve(message.id, message.markup);
      }
    });
  }
}

module.exports = {
  RenderResponseListener,
};
