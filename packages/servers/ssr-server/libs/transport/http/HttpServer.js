const { Server } = require('../Server');
const http = require('http'),
  https = require('https');

class HttpServer extends Server {

  constructor(config, useHttp) {
    super();

    config = config || {};
    config.options = config.options || {};

    if (!useHttp) {
      if (config.options.key && config.options.cert) {
        useHttp = https;
      }
      else {
        config.options.key = null;
        config.options.cert = null;
        useHttp = http;
      }
    }

    this.protocol = 'http';
    if (useHttp == http && (config.options.key || config.options.cert)) {
      throw new Error('Key / cert pair provided but http implementation in use.');
    }
    else if (useHttp == https && (!config.options.key || !config.options.cert)) {
      throw new Error('Need key / cert pair for https.');
    }

    this.curlOpts = '';

    if (this.protocol == 'https') {
      this.port = config.port || 443;
    }
    else {
      this.port = config.port || 80;
    }

    if (this.protocol == 'https' && this.port == 443) {
      this.isDefaultPort = true;
    }
    else if (this.protocol == 'http' && this.port == 80) {
      this.isDefaultPort = true;
    }

    this.http = useHttp;
    this.options = config.options;
    this._server = this.http.createServer(this.options);
  }

  async startEventLoop(router) {
    this._server.on('request', async (req, res) => {
      const routeId = await this._getRouteId(req.url);

      if (req.method.toLowerCase() !== 'post') {
        res.writeHead(405);
        res.end();
      }
      else {
        const chunks = [];
        req.on('data', chunk => {
          chunks.push(chunk);
        });

        req.on('end', async () => {
          const type = req.headers['content-type'];

          try {
            const rendered = await router.execute(routeId, type, chunks.join());
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end(rendered + "\n");
          } catch (e) {
            if (e.constructor.name == 'MissingRouteError') {
              res.writeHead(404);
              res.end();
            }
            else {
              res.writeHead(500, { 'content-type': 'application/json' });
              res.end(JSON.stringify({
                error: {
                  name: e.name,
                  message: e.message,
                  fileName: e.fileName,
                  lineNumber: e.lineNumber,
                },
              }) + "\n");
            }
          }
        });
      }
    });
  }

  async start(routes, router) {
    this.startEventLoop(routes, router);
    this._server.listen(this.port);
  }

  async description() {
    const port = this.isDefaultPort ? '' : `:${this.port}`;

    return `
listening on port ${this.port}...

Test the server by running:
curl ${this.protocol}://localhost${port} -v${this.curlOpts} -X POST -d "<bolt-button>hello world</bolt-button><bolt-icon name=\'close\'></bolt-icon>"
    `;
  }

  async _getRouteId(requestPath) {
    if (requestPath == '/') {
      return 'default';
    }
    else {
      return requestPath.replace(/^\/+/, '');
    }
  }

}

module.exports = {
  HttpServer,
};
