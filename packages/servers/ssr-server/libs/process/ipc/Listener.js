class Listener {
  constructor(config, listeners) {
    this.config = config || {};
    this.listeners = listeners || [];
  }

  async listenTo(subject) {
  }
}

module.exports = {
  Listener,
};
