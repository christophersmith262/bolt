class InstrumentedOperation {
  constructor(instruments) {
    this.instruments = instruments;
  }

  async execute(op, timeout) {
    const snapshot = {},
      instruments = Object.values(this.instruments);

    const beforePromises = [];
    instruments.forEach(instrument => {
      beforePromises.push(instrument.snapshotBefore(snapshot));
    });
    await Promise.all(beforePromises);

    if (!timeout) {
      snapshot.output = await Promise.resolve(op());
    }
    else {
      snapshot.output = await Promise.race([
        Promise.resolve(op()),
        new Promise(accept => {
          setTimeout(() => accept(undefined), timeout);
        }),
      ])

      snapshot.timeout = (typeof snapshot.output === 'undefined');
    }

    const afterPromises = [];
    instruments.forEach(instrument => {
      afterPromises.push(instrument.snapshotAfter(snapshot));
    });
    await Promise.all(afterPromises);

    return snapshot;
  }
}

module.exports = {
  InstrumentedOperation,
};
