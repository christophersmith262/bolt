const { Renderer } = require('../Renderer');

class DomRenderer extends Renderer {
  constructor(config) {
    super();
    this.dom = config.dom;
    this.config = config;
  }

  async render(html) {
    const window = await this.dom.getWindow(),
      body = window.document.querySelector('body');

    return new Promise(async (resolve, reject) => {
      const div = window.document.createElement('div');
      div.innerHTML = html;

      const scripts = div.getElementsByTagName('script');
      let i = scripts.length;
      while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
      }

      body.appendChild(div);

      return setTimeout(() => {
        resolve(div.innerHTML.replace(/<!---->/g, ''));
      }, 0);
    });
  }

  async start() {
    await this.dom.start();

    const window = await this.dom.getWindow();
    const promises = this.config.components.map(name =>
      window.customElements.whenDefined(name)
    );
    await Promise.all(promises);

    await Renderer.prototype.start.call(this);
  }
}

module.exports = {
  DomRenderer,
};
