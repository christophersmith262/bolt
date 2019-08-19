<h1>
  <img align="left" width="40" src="https://raw.githubusercontent.com/bolt-design-system/bolt/master/docs-site/src/assets/images/bolt-logo.png">
  Bolt Design System
</h1>

## Quickstart Guide

First install the render server:

```
yarn add @bolt/ssr-server
```

Then create a `.boltssrc.js` file:

```js
const ssr = require('@bolt/ssr-server'),
  bolt = require('./platforms/bolt');

module.exports = {
  server: ssr.transport.http({
    port: 8080,
  }),
  handlers: {
    'default': {
      balancer: ssr.environment.balancer.random(),
      plugins: [bolt.compile()],
      processors: {
        'text/html': {
          format: ssr.format.rawmarkup(),
          filters: [
            ssr.filters.rendertags({
              components: bolt.ssrComponents(),
            }),
          ],
        }),
      },
      renderer: ssr.renderer.dom({
        dom: ssr.dom.jsdom(),
        components: bolt.ssrComponents(),
      })
    }
  }
}
```

Then start the server:

```
yarn bolt-ssr-server
```
