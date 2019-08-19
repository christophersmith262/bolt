class RenderRequestExecutor {
  constructor(environments) {
    this.environments = environments;
  }

  async render(handler, markup) {
    const connections = await this.environments.getConnections(handler.id);

    if (!connections) {
      throw new Error(`No render environments exist for handler "${handler.id}".`);
    }

    const environment = await handler.balancer.select(connections);

    return await environment.render(markup);
  }

  async doRender(environment, handler, input) {
  }
}

class JsonFormat {
  async encode(input) {
    return JSON.stringify(input);
  }

  async decode(input) {
    return JSON.parse(input);
  }
}

class RawMarkupFormat {
  async encode(input) {
    return input;
  }

  async decode(input) {
    return { markup: input };
  }
}

class EachFilter {
  constructor(filters) {
    super();

    if (typeof filters !== 'object' || filters.constructor.name.toLowerCase() != 'array') {
      filters = [filters];
    }

    this.filters = filters;
  }

  async apply(environment, handler, input) {
    if (typeof input !== 'object') {
      throw new Error('each() applied to a non object / array!');
    }

    const promises = [];
    for (let i in input) {
      promises.push(new Promise(async accept => {
        for (let j in this.filters) {
          input[i] = await this.filters[j].apply(environment, handler, input[i]));
        }
        accept();
      }));
    }

    await Promise.all(promises);

    return input;
  }
}

class RenderFilter {
  async apply(environment, handler, input) {
    return await environment.render(input);
  }
}

class RenderTagsFilter {
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

module.exports = {
  RenderRequestExecutor,
};
