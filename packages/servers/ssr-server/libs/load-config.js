const os = require('os'),
  path = require('path'),
  chalk = require('chalk'),
  { fileExists } = require('@bolt/build-tools/utils/general');

async function loadConfig(overrides) {
  const cpuCount = os.cpus().length,
    configFileName = overrides.configFile || '.boltssrc.js',
    configFilePath = path.resolve(process.cwd(), configFileName);

  if (!await fileExists(configFilePath)) {
    console.log('');
    console.log(chalk.red(`Could not load config file "${configFileName}"!`));
    console.log('');
    console.log(chalk.yellow('It looks like you may not have a config file setup yet.'));
    console.log(chalk.yellow('Please refer to README.md to get started.'));
    console.log('');
    process.exit();
  }
  let config = require(configFilePath),
    errors = 0;

  if (typeof config == 'function') {
    config = await Promise.resolve(config());
  }

  if (!config.cluster) {
    config.cluster = 0;
  }
  else if (config.cluster === true) {
    config.cluster = cpuCount;
  }

  if (!config.handlers) {
    config.handlers = {};
  }

  for (let i in config.handlers) {
    const handler = config.handlers[i];

    if (!handler.sandboxes) {
      handler.sandboxes = 0;
    }
    else if (handler.sandboxes === true) {
      handler.sandboxes = cpuCount;
    }

    handler.plugins = handler.plugins || []

    for(let j in handler.plugins) {
      handler.plugins[j] = Promise.resolve(handler.plugins[j]);
    }

    handler.id = i;

    if (!handler.renderer) {
      console.log('');
      console.log(chalk.red(`No renderer service specified for request handler "${i}".`));
      console.log('');
      console.log(chalk.yellow('Update the request handler to include a Renderer in the "renderer" key.'));
      console.log('');
      errors++;
    }

    if (!handler.balancer) {
      handler.balancer = require('./balancer').random();
    }
  }

  if (!('default' in config.handlers)) {
    console.log('');
    console.log(chalk.red('No default request handler provided.'));
    console.log('');
    console.log(chalk.yellow('Your config file should have an entry that looks like:'));
    console.log('');
    console.log(chalk.dim('  module.exports = {'));
    console.log(chalk.dim('    handlers: {'));
    console.log(chalk.dim('      "default": {'));
    console.log(chalk.dim('        ...'));
    console.log(chalk.dim('      }'));
    console.log(chalk.dim('    }'));
    console.log(chalk.dim('  }'));
    console.log('');
    errors++;
  }

  if (errors) {
    process.exit(errors);
  }

  return config;
}

module.exports = {
  loadConfig,
};
