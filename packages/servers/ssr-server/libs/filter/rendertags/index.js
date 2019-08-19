const { RenderTagsFilter } = require('./RenderTagsFilter');
const { SimpleTagLexer } = require('./SimpleTagLexer');
const { SimpleTagParser } = require('./SimpleTagParser');
const { SimpleTagSerializer } = require('./SimpleTagSerializer');

module.exports = (config) => {
  return new RenderTagsFilter(config);
}

module.exports.RenderTagsFilter = RenderTagsFilter; 
module.exports.SimpleTagLexer = SimpleTagLexer;
module.exports.SimpleTagParser = SimpleTagParser;
module.exports.SimpleTagSerializer = SimpleTagSerializer;
