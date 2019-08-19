const { Filter } = require('./Filter');

class PrettierFilter extends Filter {
  constructor(config) {
    super();
    this.config = config || {
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      jsxBracketSameLine: true,
      parser: 'html',
    };
  }

  async apply(environment, route, type, input) {
    return prettier.format(html, this.config);
  }
}

module.exports = (config) => {
  return new PrettierFilter(config);
}

module.exports.PrettierFilter = PrettierFilter;
