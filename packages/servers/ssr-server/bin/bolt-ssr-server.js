#!/usr/bin/env node

const cluster = require('cluster');
const program = require('../libs/process/program');
const { loadConfig } = require('../libs/load-config');
const processManager = require('../libs/process');

program.parse(process.argv);

loadConfig(program).then(async config => {
  if (cluster.isMaster) {
    await processManager.master.start(config);
    console.log(await config.server.description());
  }
  else {
    await processManager.worker.start(config);
  }
});
