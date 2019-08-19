const { Filter } = require('../Filter');
const { SimpleTagLexer } = require('./SimpleTagLexer');
const { SimpleTagParser } = require('./SimpleTagParser');
const { SimpleTagSerializer } = require('./SimpleTagSerializer');

class RenderTagsFilter extends Filter {
  constructor(config) {
    super();
    this.config = config;
  }

  async apply(environment, route, type, input) {
    const lexer = new SimpleTagLexer(input, this.config.tags),
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
        rendered = await environment.render(await serializer.serialize(tag));

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

module.exports = {
  RenderTagsFilter,
};
