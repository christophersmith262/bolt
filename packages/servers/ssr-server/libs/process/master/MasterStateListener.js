const ipc = require('../ipc');
const server = require('../server');

class MasterStateListener extends ipc.Listener {
  constructor(config) {
    super(config);
    this._readyToSpawn = [];
    this._readyToServe = [];
  }

  async listenTo(subject) {
    this._readyToServe.push(new Promise(acceptingConnections => {
      this._readyToSpawn.push(new Promise(acceptingRegistrations => {
        subject.on('message', async message => {
          if (message.type == ipc.message.types['SERVER_START']) {
            await server.start(this.config, [subject], 1);
          }
          else if (message.type == ipc.message.types['SERVER_AWAITING_ENVIRONMENTS'] && message.server == subject.id) {
            acceptingRegistrations();
          }
          else if (message.type == ipc.message.types['SERVER_READY'] && message.server == subject.id) {
            acceptingConnections();
          }
          else if (message.type == ipc.message.types['SERVER_PROCESS_READY'] && message.server == subject.id) {
            subject.send({
              type: ipc.message.types['SERVER_START'],
            });
          }
        });
      }));
    }));
  }

  async readyToStart() {
    return Promise.all(this._readyToSpawn);
  }

  async started() {
    return Promise.all(this._readyToServe);
  }
}

module.exports = {
  MasterStateListener,
};