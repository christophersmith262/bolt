const events = require('events');

const types = {
  SERVER_PROCESS_READY: 0x00,
  SERVER_START: 0x01,
  SERVER_AWAITING_ENVIRONMENTS: 0x02,
  SERVER_READY: 0x03,
  ENVIRONMENT_READY: 0x04,
  RENDER_REQUEST: 0x05,
  RENDER_RESPONSE: 0x06,
};

class ProcessMessageLoop {
  constructor(id) {
    this.id = id;
    this.events = new events.EventEmitter();
    this.isProcessMessageLoop = true;
  }

  send(message) {
    this.events.emit('message', message);
  }

  on(name, cb) {
    this.events.on(name, cb);
  }
}

class IpcMessageAdapter {
  constructor(process) {
    this.process = process;
  }

  emit(sock, name, message) {
    if (typeof sock == 'string') {
      message = name;
    }
    this.process.send(message);
  }

  on(name, cb) {
    this.process.on(name, cb);
  }
}

module.exports = {
  types,
  ProcessMessageLoop,
  IpcMessageAdapter,
};
