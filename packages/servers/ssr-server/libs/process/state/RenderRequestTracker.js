class RenderRequestTracker {
  constructor(namespace, maxId) {
    this.namespace = namespace;
    this.requests = {};
    this.i = 0;
    this.maxId = maxId || 999999999999;
  }

  async create(callback) {
    const requestId = await this._id();
    this.requests[requestId] = callback;
    return requestId;
  }

  async resolve(id, result) {
    const callback = this.requests[id];
    if (callback) {
      callback(result);
      delete this.requests[id];
    }
  }

  async _id() {
    const nextId = `${this.namespace}:${this.i++}`;

    if (this.i >= this.maxId) {
      this.i = 0;
    }

    return nextId;
  }
}

module.exports = {
  RenderRequestTracker,
};
