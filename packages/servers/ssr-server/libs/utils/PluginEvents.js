class PluginEvents {

  constructor() {
    this.registry = {};
  }

  on(name, cb) {
    if (!(name in this.registry)) {
      this.registry[name] = [];
    }
    this.registry[name].push(cb);
  }

  async emit(name) {
    const evtArgs = [];

    for (let i = 1; i < arguments.length; i++) {
      evtArgs.push(arguments[i]);
    }

    const promises = [];
    for (let i in this.registry[name]) {
      const cb = this.registry[name][i];
      promises.push(Promise.resolve(cb.apply(null, evtArgs)));
    }

    return await Promise.all(promises);
  }

}

module.exports = {
  PluginEvents,
};
