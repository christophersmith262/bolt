const path = require('path');
const childProcess = require('child_process');
const environment = require('../environment');
const ipc = require('./ipc');
const { Process } = require('./Process');

let nextSandboxId = 1;

async function fork(environmentId, serverIds) {
  const binDir = path.dirname(process.mainModule.filename),
    sandboxModulePath = path.resolve(binDir, './bolt-ssr-sandbox.js')
    processArgs = [];

  for (let i = 2; i < process.argv.length; i++) {
    processArgs.push(process.argv[i]);
  }

  const args = [
    `--environment-id=${environmentId}`,
    `--sandbox-id=sandbox:${environmentId}:${nextSandboxId}`,
    `--server-ids=${serverIds}`,
  ];

  for (k in processArgs) {
    args.push(processArgs[k]);
  }

  console.log(`starting sandbox ${environmentId}:${nextSandboxId}...`);
  const child = childProcess.fork(sandboxModulePath, args, ['pipe', 'pipe', 'pipe']);

  child.id = nextSandboxId;
  nextSandboxId++;

  return child;
}

async function start(config, sandboxId, serverIds, environmentDef) {
  const app = new Process(config, 'sandbox'),
    channels = [];
  await app.startup();

  for (let i in serverIds) {
    channels.push(ipc.client.start(sandboxId, serverIds[i]));
  }

  await environment.create(config, environmentDef, await Promise.all(channels));
}

module.exports = {
  fork,
  start,
};
