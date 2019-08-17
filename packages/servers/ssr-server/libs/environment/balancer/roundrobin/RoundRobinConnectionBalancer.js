const { EnvironmentConnectionBalancer } = require('../EnvironmentConnectionBalancer');

class RoundRobinConnectionBalancer extends EnvironmentConnectionBalancer {
  constructor() {
    super();
    this.current = 0;
  }

  async getKey(keys) {
    this.current++;
    if (this.current >= keys.length) {
      this.current = 0;
    }
    return keys[this.current];
  }
}

module.exports = () => {
  return new RoundRobinConnectionBalancer();
};

module.exports.RoundRobinConnectionBalancer = RoundRobinConnectionBalancer;
