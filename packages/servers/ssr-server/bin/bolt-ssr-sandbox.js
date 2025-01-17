#!/usr/bin/env node

const path = require('path');
const ipc = require('node-ipc');
const program = require('../libs/process/program');
const { loadConfig } = require('../libs/load-config');
const { SandboxProcess, startSandbox } = require('../libs/process');

program
  .option(
    '--handler-id <[0-9]+>',
    'the handler that this sandbox serves.',
  )
  .option(
    '--sandbox-id <[0-9]+>',
    'the id of this sandbox instance.',
  )
  .option(
    '--server-ids <([0-9]+,?)*>',
    'a comma separated list of servers that will use this sandbox.',
  )
  .parse(process.argv);

loadConfig(program).then(async config => {
  const serverIds = program.serverIds.split(',')
    handlerId = program.handlerId,
    handler = config.handlers[handlerId];

  await startSandbox(config, program.sandboxId, serverIds, handler);
});
