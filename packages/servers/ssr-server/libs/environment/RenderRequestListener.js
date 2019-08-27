const { InstrumentedOperation } = require('../instrument/InstrumentedOperation');
const { MemoryUsageInstrument } = require('../instrument/memory');
const { RunningWallAverageInstrument } = require('../instrument/wallavg');
const ipc = require('../process/ipc');

class RenderRequestListener extends ipc.Listener {
  constructor(config, broadcast, environment) {
    super(config);
    this.rendering = 0;
    this.listeners = 0;
    this.broadcast = broadcast;
    this.environment = environment;

    this.renderInstrument = new InstrumentedOperation({
      'memory': new MemoryUsageInstrument(),
      'avgwall': new RunningWallAverageInstrument(10),
    });

    setInterval(async () => {
      const snapshot = {};

      for (let i in this.renderInstrument.instruments) {
        snapshot[i] = await this.renderInstrument.instruments[i].getDisplay();
      }

      this.broadcast.emit('message', {
        type: ipc.message.types['INSTRUMENT_UPDATE'],
        tags: ['sandbox'],
        pid: process.pid,
        environment: environment.id,
        snapshot,
      })
    }, 1000);
  }

  async listenTo(subject) {
    ++this.listeners;

    subject.on('message', async message => {
      if (message.type == ipc.message.types['ENVIRONMENT_SHUTDOWN_ACK']) {
        this.listeners--;
        if (this.listeners < 0) {
          this.listeners = 0;
        }
      }
      else if (message.type == ipc.message.types['RENDER_REQUEST']) {
        this.rendering++;

        try {
          const snapshot = await this.renderInstrument.execute(async () => {
            return this.environment.renderer.render(message.markup);
          }, 2000);

          subject.emit('message', {
            type: ipc.message.types['RENDER_RESPONSE'],
            markup: snapshot.output,
            id: message.id,
          });
        }
        catch (e) {
        }

        this.rendering--;
      }
    });
  }

  async canShutdown() {
    return new Promise(accept => {
      setTimeout(() => {
        if (!this.rendering && !this.listeners) {
          accept();
        }
      }, 500);
    });
  }
}


module.exports = {
  RenderRequestListener,
};
