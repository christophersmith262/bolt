const { Listener } = require('./Listener');
const messages = require('../ipc/messages');

class RenderRequestListener extends Listener {
  constructor(config, handler) {
    super(config);
    this.handler = handler;
  }

  async listenTo(subject) {
    subject.on('message', async message => {
      if (message.type == messages.types['RENDER_REQUEST']) {
        let rendered = await this.handler.renderer.render(message.markup);

        /*for (var i in processors) {
          rendered = await processors[i].process(rendered);
        }*/

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
