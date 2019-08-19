const { Format } = require('./Format');

class JsonFormat extends Format {
  async encode(input) {
    return JSON.stringify(input);
  }

  async decode(input) {
    return JSON.parse(input);
  }
}

module.exports = () => {
  return new JsonFormat();
};

module.exports.JsonFormat = JsonFormat;
