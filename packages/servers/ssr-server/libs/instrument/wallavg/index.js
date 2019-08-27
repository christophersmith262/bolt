const { Instrument } = require('../Instrument');

class RunningWallAverageInstrument extends Instrument {
  constructor(size) {
    super();
    this.size = size;
    this.times = [];
    this.runningWall = 0;
    this.runningAvg = 0;
  }

  async snapshotBefore(snapshot) {
    snapshot.startTime = this.hrtime();
  }

  async snapshotAfter(snapshot) {
    snapshot.endTime = this.hrtime();
    snapshot.wall = (snapshot.endTime - snapshot.startTime) / 1e9;

    this.runningWall += snapshot.wall;
    this.times.push(snapshot.wall);

    while (this.times.length > this.size) {
      const wall = this.times.shift();
      this.runningWall -= wall;
    }

    this.runningAvg = this.runningWall / this.times.length;
  }

  async getDisplay() {
    return this.runningAvg;
  }

  hrtime() {
    const t = process.hrtime();
    return t[0]*1e9 + t[1];
  }
}

module.exports = () => {
  return new RunningWallAverageInstrument();
};

module.exports.RunningWallAverageInstrument = RunningWallAverageInstrument;
