const { Listener } = require('./Listener');
const messages = require('../ipc/messages');

class RenderRequestListener extends Listener {
  constructor(config, environment) {
    super(config);
    this.environment = environment;
  }

  async listenTo(subject) {
    subject.on('message', async message => {
      if (message.type == messages.types['RENDER_REQUEST']) {
        let rendered = await this.environment.renderer.render(message.markup);

        subject.emit('message', {
          type: messages.types['RENDER_RESPONSE'],
          markup: rendered,
          id: message.id,
        });
      }
    });
  }
}


module.exports = {
  RenderRequestListener,
};
