const { RandomConnectionBalancer } = require('./RandomConnectionBalancer');

module.exports = () => {
  return new RandomConnectionBalancer();
}

module.exports.RandomConnectionBalancer = RandomConnectionBalancer;
