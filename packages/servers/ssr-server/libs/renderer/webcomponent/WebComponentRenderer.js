const Tokenizer = require('parse5/lib/tokenizer');
const { Renderer } = require('../Renderer');
const { SimpleTagLexer } = require('./SimpleTagLexer');
const { SimpleTagParser } = require('./SimpleTagParser');
const { SimpleTagSerializer } = require('./SimpleTagSerializer');

class WebComponentRenderer extends Renderer {
  constructor(components) {
    super();
    this.components = components;
  }

  async render(html) {
    const lexer = new SimpleTagLexer(html, this.components),
      parser = new SimpleTagParser(lexer),
      serializer = new SimpleTagSerializer(),
      tags = await parser.filterTags(),
      promises = [];

    for (var  i in tags) {
      const tag = tags[i], origChildren = tag.children;

      tag.children = [{
        type: 'text',
        text: '!placeholder',
      }];

      promises.push(serializer.serialize(tag).then(async rendered => {
        rendered = await Renderer.prototype.render.call(this, await serializer.serialize(tag));
        tag.type = 'text';

        tag.text = rendered.replace('!placeholder', await serializer.serialize({
          type: 'root',
          children: origChildren,
        }))

        delete tag.openTag
        delete tag.closeTag
        delete tag.children
      }))
    }

    await Promise.all(promises)

    return await serializer.serialize(await parser.getAST());
  }

  async start() {
    await Renderer.prototype.start.call(this);

    const window = await this.dom.getWindow();
    const promises = this.components.map(name =>
      window.customElements.whenDefined(name)
    );
    await Promise.all(promises);
  }
}

module.exports = {
  WebComponentRenderer,
};
