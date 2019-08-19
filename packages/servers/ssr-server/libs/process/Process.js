const { PluginEvents } = require('../utils/PluginEvents');

class Process {

  constructor(config, type) {
    this.config = config;
    this.events = new PluginEvents();
    this.type = type;
  }

  async startup() {
    const pluginsFinished = [];

    for (let i in this.config.plugins) {
      const plugin = await this.config.plugins[i];
      pluginsFinished.push(Promise.resolve(plugin(this)));
    }

    await Promise.all(pluginsFinished);
    await this.emit('startup');

    const promises = [];
    for (let i in this.config.environments) {
      promises.push(this.emit('environment:parse', this.config.environments[i], i));
    }
    for (let i in this.config.routes) {
      promises.push(this.emit('route:parse', this.config.routes[i], i));
    }
    await Promise.all(promises);
  }

  async emit(name) {
    const args = [];
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    await this.events.emit(`${this.type}:${name}`, args);
    await this.events.emit(`*:${name}`, args);
  }

}

module.exports = {
  Process,
};
