const events = require('events');

class ProcessMessageLoop {
  constructor(id) {
    this.id = id;
    this.events = new events.EventEmitter();
    this.isProcessMessageLoop = true;
    this.connected = true;
  }

  send(message) {
    this.events.emit('message', message);
  }

  on(name, cb) {
    this.events.on(name, cb);
  }
}

module.exports = {
  ProcessMessageLoop,
};
