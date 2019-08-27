#!/usr/bin/env node

const program = require('../libs/process/program');
const sandbox = require('../libs/process/sandbox');
const { loadConfig } = require('../libs/load-config');

program
  .option(
    '--environment-id <[0-9]+>',
    'the environment that this sandbox serves.',
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
    environmentId = program.environmentId,
    environmentDef = config.environments[environmentId];

  await sandbox.start(config, program.sandboxId, serverIds, environmentDef);
});
