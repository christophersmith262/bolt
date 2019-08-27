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

  if (!config.routes) {
    config.routes = {};
  }

  if (!config.router) {
    config.router = require('./request/router')();
  }

  config.admin = config.admin || {};
  config.admin.port = config.admin.port || 3000

  for (let i in config.environments) {
    const environmentDef = config.environments[i];

    environmentDef.id = i;

    if (!environmentDef.sandboxes) {
      environmentDef.sandboxes = 0;
    }
    else if (environmentDef.sandboxes === true) {
      environmentDef.sandboxes = cpuCount;
    }

    if (!environmentDef.renderer) {
      console.log('');
      console.log(chalk.red(`No renderer service specified for environment "${i}".`));
      console.log('');
      console.log(chalk.yellow('Update the request route to include a Renderer in the "renderer" key.'));
      console.log('');
      errors++;
    }

    if (!environmentDef.balancer) {
      environmentDef.balancer = require('./environment/balancer').random();
    }
  }

  for (let i in config.routes) {
    if (!Array.isArray(config.routes[i])) {
      config.routes[i] = [config.routes[i]];
    }

    const route = {
      id: i,
      handlers: config.routes[i],
    };

    for (let j in route.handlers) {
      const handler = route.handlers[j];

      handler.types = handler.types || [];
      handler.types = new Set(handler.types);

      if (!handler.format) {
        console.log('');
        console.log(chalk.red(`No format provided in route handler "${i}[${j}]".`));
        console.log('');
        console.log(chalk.yellow('Update the route to include a format in the "format" key.'));
        console.log('');
        errors++;
      }

      if (!handler.filters) {
        console.log('');
        console.log(chalk.red(`No filter chain provided in route handler "${i}[${j}]".`));
        console.log('');
        console.log(chalk.yellow('Update the route to include a filter chain in the "filters" key.'));
        console.log('');
        errors++;
      }

      if (!handler.environment) {
        console.log('');
        console.log(chalk.red(`No render environment specified for request handler "${i}[${j}]".`));
        console.log('');
        console.log(chalk.yellow('Update the request handler to include a render environment in the "environment" key.'));
        console.log('');
        errors++;
      }
      else if (!(handler.environment in config.environments)) {
        console.log('');
        console.log(chalk.red(`Invalid render environment specified for request handler "${i}[${j}]": "${handler.environment}".`));
        console.log('');
        console.log(chalk.yellow('Update the request handler to include a valid render environment in the "environment" key.'));
        console.log('');
        errors++;
      }
    }

    config.routes[i] = route;
  }

  if (!('default' in config.routes)) {
    console.log('');
    console.log(chalk.red('No default request route provided.'));
    console.log('');
    console.log(chalk.yellow('Your config file should have an entry that looks like:'));
    console.log('');
    console.log(chalk.dim('  module.exports = {'));
    console.log(chalk.dim('    routes: {'));
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
