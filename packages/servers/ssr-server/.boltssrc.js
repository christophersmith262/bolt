const ssr = require('@bolt/ssr-server'),
  bolt = require('./platforms/bolt');

module.exports = {
  cluster: true,
  server: ssr.transport.http({
    port: 8080,
  }),
  plugins: [bolt.compile()],
  environments: {
    'dom': {
      renderer: ssr.renderer.dom({
        dom: ssr.dom.jsdom(bolt.webpackLoader()),
        components: bolt.ssrComponents(),
      }),
      sandboxes: 1,
    },
  },
  routes: {
    'default': {
      format: ssr.format.html(),
      filters: [
        ssr.filter.rendertags({
          tags: bolt.ssrComponents(),
        })
      ],
      environment: 'dom',
    },
  }
}
