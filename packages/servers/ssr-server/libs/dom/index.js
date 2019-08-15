const { DomImplementation } = require('./DomImplementation');

module.exports = {
  DomImplementation,
  jsdom: require('./jsdom'),
  pupeteer: require('./pupeteer'),
};
