/* eslint-disable no-empty-function */

class DomImplementation {
  constructor() {
    this.assets = [];
  }

  async start() {}

  async stop() {}

  async getWindow() {}

  async getAssets() { return this.assets; }

  setAssets(assets) {
    this.assets = assets;
  }

  addAsset(asset) {
    this.assets.push(asset);
  }
}

module.exports = {
  DomImplementation,
};
