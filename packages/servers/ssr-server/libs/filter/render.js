const { Filter } = require('./Filter');

class RenderFilter {
  async apply(environment, route, type, input) {
    return await environment.render(input);
  }
}

module.exports = () => {
  return new RenderFilter();
};

module.exports.RenderFilter = RenderFilter;
