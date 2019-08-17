class Renderer {
  constructor() {
    this.started = false;
  }

  async start() {
    this.started = true;
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
}

module.exports = {
  Renderer,
};
