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
  cluster: true,
  server: ssr.transport.http({
    port: 8080,
  }),
  handlers: {
    'default': {
      plugins: [bolt.compile()],
      balancer: ssr.environment.balancer.random(),
      renderer: ssr.renderer.webcomponent({
        dom: ssr.dom.jsdom(bolt.webpackLoader()),
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
