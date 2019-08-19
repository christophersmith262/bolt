const { DomRenderer } = require('./DomRenderer');

module.exports = (backend, components) => {
  return new DomRenderer(backend, components);
};

module.exports.DomRenderer = DomRenderer;
