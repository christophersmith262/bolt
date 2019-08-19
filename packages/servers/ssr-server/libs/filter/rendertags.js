const { Filter } = require('./Filter');

class RenderTagsFilter extends Filter {
  constructor(config) {
    this.config = config;
  }

  async apply(environment, handler, input) {
    const lexer = new SimpleTagLexer(input.markup, this.config.components),
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
        rendered = await environment.render({
          markup: await serializer.serialize(tag),
        });

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
}

module.exports = (config) => {
  return new RenderTagsFilter(config);
}

module.exports.RenderTagsFilter = RenderTagsFilter; 
