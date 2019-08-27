class IpcMessageAdapter {
  constructor(process) {
    this.process = process;
    this.pid = process.pid;
  }

  emit(sock, name, message) {
    if (typeof sock == 'string') {
      message = name;
    }
    if (this.process.connected) {
      this.process.send(message);
    }
  }

  on(name, cb) {
    this.process.on(name, cb);
  }
}

module.exports = {
  IpcMessageAdapter
};
