const { Renderer } = require('../Renderer');

class DomRenderer extends Renderer {
  constructor(config) {
    super();
    this.dom = config.dom;
    this.config = config;
  }

  async render(html) {
    const result = await new Promise(async (resolve, reject) => {
      const div = this.window.document.createElement('div');
      div.innerHTML = html;

      const scripts = div.getElementsByTagName('script');
      let i = scripts.length;
      while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
        delete scripts[i];
      }

      this.body.appendChild(div);

      return setTimeout(() => {
        const result = div.innerHTML.replace(/<!---->/g, '');
        this.body.removeChild(div);
        resolve(result);
      }, 0);
    });

    return result;
  }

  async start() {
    await this.dom.start();

    this.window = await this.dom.getWindow();
    this.body = this.window.document.querySelector('body');

    const promises = this.config.components.map(name =>
      this.window.customElements.whenDefined(name)
    );
    await Promise.all(promises);

    await Renderer.prototype.start.call(this);
  }
}

module.exports = {
  DomRenderer,
};
