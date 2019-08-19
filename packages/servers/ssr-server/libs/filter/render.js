const { Filter } = require('./Filter');

class RenderFilter {
  async apply(environment, handler, input) {
    return await environment.render(input);
  }
}

module.exports = () => {
  return new RenderFilter();
};

module.exports.RenderFilter = RenderFilter;
