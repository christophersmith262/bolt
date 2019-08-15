const { template } = require('./template');
const { FilesystemResourceLoader } = require('./FilesystemResourceLoader');
const { JsDomImplementation } = require('./JsDomImplementation');

module.exports = (resourceLoader) => {
  return new JsDomImplementation(resourceLoader);
};

module.exports.JsDomImplementation = JsDomImplementation;
module.exports.FilesystemResourceLoader = FilesystemResourceLoader;
module.exports.template = template;
