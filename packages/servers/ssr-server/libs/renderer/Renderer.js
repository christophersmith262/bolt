class Renderer {
  constructor() {
    this.started = false;
  }

  async start() {
    this.started = true;
  }

  async render(html) {
  }
}

module.exports = {
  Renderer,
};
