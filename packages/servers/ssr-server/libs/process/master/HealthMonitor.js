const ipc = require('../ipc');
const sandbox = require('../sandbox');

class HealthMonitor extends ipc.Listener {
  constructor() {
    super();
    this.servers = new Map();
    this.children = new Map();
  }

  async listenTo(subject) {
    subject.on('message', async message => {
      if (message.type == ipc.message.types['INSTRUMENT_UPDATE']) {
        if (message.snapshot.avgwall > 0 && this.children.has(message.pid)) {
          const oldChild = this.children.get(message.pid);
          delete this.children.delete(message.pid);

          const serverIds = Array.from(this.servers, ([id, server]) => id),
            newChild = await sandbox.fork(message.environment, serverIds);
          this.addChild(newChild);

          setTimeout(() => oldChild.kill('SIGINT'), 5000);
        }
      }
    });
  }

  addServer(server) {
    this.servers.set(server.id, server);
  }

  addChild(child) {
    this.children.set(child.pid, child);
    this.listenTo(child);
  }

  monitor(process) {
    if (process.pid) {
      this.addChild(process);
    }
    else if (process.id) {
      this.addServer(process);
    }
    else {
      throw new Error("Invalid process passed to HealthMonitor.monitor()");
    }
  }
}

module.exports = {
  HealthMonitor,
};
