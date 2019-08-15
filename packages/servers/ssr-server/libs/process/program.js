const program = require('commander');
const packageJson = require('../../package.json');

program
  .version(packageJson.version)
  .option(
    '-C --config-file <path>',
    'pass in a specific config file instead of the default ".boltssrc.js".',
  )
  .option(
    '-w --worker-count <[0-9]+>',
    'number of worker processes for serving client requests.',
  )

module.exports = program;
