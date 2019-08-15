const { SimpleTagLexer } = require('./SimpleTagLexer');
const { SimpleTagParser } = require('./SimpleTagLexer');
const { SimpleTagSerializer } = require('./SimpleTagLexer');
const { WebComponentRenderer } = require('./WebComponentRenderer');

module.exports = (backend, components) => {
  return new WebComponentRenderer(backend, components);
};

module.exports.SimpleTagLexer = SimpleTagLexer;
module.exports.SimpleTagParser = SimpleTagParser;
module.exports.SimpleTagSerializer = SimpleTagSerializer;
module.exports.WebComponentRenderer = WebComponentRenderer;
