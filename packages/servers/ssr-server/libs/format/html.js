const { Format } = require('./Format');

class HtmlFormat extends Format {
  async encode(input) {
    return input;
  }

  async decode(input) {
    return input;
  }
}

module.exports = () => {
  return new HtmlFormat();
}

module.exports.HtmlFormat = HtmlFormat;
