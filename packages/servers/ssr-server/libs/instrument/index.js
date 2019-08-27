const { Instrument } = require('./Instrument');
const { InstrumentedOperation } = require('./InstrumentedOperation');

module.exports = {
  Instrument,
  InstrumentedOperation,
  memory: require('./memory'),
  wallavg: require('./wallavg'),
};
