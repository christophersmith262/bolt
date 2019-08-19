const path = require('path'),
  ssr = require('@bolt/ssr-server'),
  { getConfig } = require('@bolt/build-tools/utils/config-store.js'),
  { BoltWebpackCompiler } = require('./BoltWebpackCompiler.js');

const ssrComponents = () => [
  'bolt-button',
  'bolt-icon',
  'bolt-text',
];

async function compile(version) {
  let config = await getConfig();

  config.components.individual = [];
  config.prod = true;
  config.enableCache = true;
  config.mode = 'server';
  config.env = 'pwa';
  config.sourceMaps = false;
  config.copy = [];
  config.webpackDevServer = false;
  config.buildDir = path.join(config.wwwDir, 'build-ssr');
  config.dataDir = path.join(config.wwwDir, 'build-ssr', 'data');
  config.version = version;

  return (app) => {
    const webpackCompiler = new BoltWebpackCompiler(config);

    app.events.on('master:startup', async () => {
      await webpackCompiler.compile();
    });

    app.events.on('*:environment:parse', async environment => {
      if (environment.renderer.dom) {
        const assets = await webpackCompiler.getAssets();
        environment.renderer.dom.setAssets(Object.values(assets).map(value => {
          return value;
        }));
      }
    });
  };
}

const webpackLoader = () => new ssr.dom.jsdom.FilesystemResourceLoader('www');

module.exports = {
  webpackLoader,
  ssrComponents,
  compile,
};
