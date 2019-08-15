const { PluginEvents } = require('../utils/PluginEvents');

class Process {

  constructor(config, type) {
    this.config = config;
    this.events = new PluginEvents();
    this.type = type;
  }

  async startup() {
    const pluginsFinished = [];

    for (let i in this.config.handlers) {
      const handler = this.config.handlers[i];
      for (let j in handler.plugins) {
        const plugin = await handler.plugins[j];
        pluginsFinished.push(Promise.resolve(plugin(this, handler)));
      }
    }

    await Promise.all(pluginsFinished);
    await this.emit('startup');
  }

  async emit(name) {
    await this.events.emit(`${this.type}:${name}`);
    await this.events.emit(`*:${name}`);
  }

}

module.exports = {
  Process,
};
