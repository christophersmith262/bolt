const { Instrument } = require('../Instrument');

class MemoryUsageInstrument extends Instrument {
  constructor() {
    super();
    this.usage = process.memoryUsage();
  }

  async snapshotAfter(snapshot) {
    this.usage = snapshot.usage = process.memoryUsage();
  }

  async getDisplay() {
    return this.usage;
  }
}

module.exports = () => {
  return new MemoryUsageInstrument();
};

module.exports.MemoryUsageInstrument = MemoryUsageInstrument;
