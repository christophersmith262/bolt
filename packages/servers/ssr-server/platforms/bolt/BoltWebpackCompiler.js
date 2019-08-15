const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const createWebpackConfig = require('@bolt/build-tools/create-webpack-config');
const { fileExists } = require('@bolt/build-tools/utils/general');

class BoltWebpackCompiler {

  constructor(config) {
    this.config = config;
    this.manifestPath = path.join(config.buildDir, 'bolt-webpack-manifest.server.json');
  }

  async compile() {

    // return early if we already have what we need to do a build
    if (await fileExists(this.manifestPath)) {
      console.log('webpack ready...');
      return;
    } else {
      console.log('compiling webpack...');

      const webpackConfig = await createWebpackConfig(this.config);

      // strip out Sass files + other duplicate / not as necessary package files for server-side rendering (speeds up compile times)
      webpackConfig[0].entry['bolt-global'] = webpackConfig[0].entry[
        'bolt-global'
      ].filter(
        item =>
          !item.includes('.scss') &&
          !item.includes('critical-fonts') &&
          !item.includes('bolt-critical-css') &&
          !item.includes('bolt-critical-vars') &&
          !item.includes('bolt-smooth-scroll') &&
          !item.includes('bolt-sticky') &&
          !item.includes('bolt-placeholder') &&
          !item.includes('bolt-li') &&
          !item.includes('packages/core') &&
          !item.includes('bolt-dropdown') &&
          !item.includes('global/styles/index.js') &&
          !item.includes('bolt-copy-to-clipboard') &&
          !item.includes('bolt-icons') &&
          !item.includes('bolt-video'),
      );

      await new Promise(accept => {
        webpack(webpackConfig, async (err, webpackStats) => {
          // @todo: handle webpack errors
          // if (err || webpackStats.hasErrors()) {}

          // after the build completes, pass along the webpack manifest data like we do for builds already having been cached
          accept();
        });
      });

      console.log('webpack ready...');
    }
  }

  async getAssets() {
    return new Promise(accept => {
      fs.readFile(this.manifestPath, (err, data) => {
        accept(err ? {} : JSON.parse(data));
      });
    });
  }

}

module.exports = {
  BoltWebpackCompiler,
};
