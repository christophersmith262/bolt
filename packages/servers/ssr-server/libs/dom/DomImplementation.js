/* eslint-disable no-empty-function */

class DomImplementation {
  constructor() {
    this.assets = [];
    this.window = null;
  }

  async start() {}

  async stop() {}

  async getWindow() {
    return this.window;
  }

  async getAssets() {
    return this.assets;
  }

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
