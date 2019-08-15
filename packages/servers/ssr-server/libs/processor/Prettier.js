const prettier = require('prettier');
const { Processor } = require('./Processor');

class Prettier extends Processor {

  async process(html) {
    return prettier.format(html, {
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      jsxBracketSameLine: true,
      parser: 'html',
    });
  }

}

module.exports = {
  Prettier,
};
