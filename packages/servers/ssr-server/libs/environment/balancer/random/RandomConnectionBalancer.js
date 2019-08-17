const { EnvironmentConnectionBalancer } = require('../EnvironmentConnectionBalancer');

class RandomConnectionBalancer extends EnvironmentConnectionBalancer {
  async getKey(keys) {
    return keys[Math.floor((Math.random() * keys.length))];
  }
}

module.exports = {
  RandomConnectionBalancer,
};
