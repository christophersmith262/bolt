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

  async emit(name, args) {
    const promises = [];
    for (let i in this.registry[name]) {
      const cb = this.registry[name][i];
      promises.push(Promise.resolve(cb.apply(null, args)));
    }

    return await Promise.all(promises);
  }

}

module.exports = {
  PluginEvents,
};
