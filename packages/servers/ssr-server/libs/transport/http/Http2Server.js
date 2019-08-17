const { HttpServer } = require('./HttpServer');
const http2 = require('http2');

class Http2Server extends HttpServer {

  constructor(config) {
    super(config, http2);
    this.curlOpts += ' --http2-prior-knowledge';
  }

  async startEventLoop(handlers, executor) {
    this._server.on('stream', async (stream, headers) => {
      const handler = await this._getHandler(handlers, headers[':path']);

      if (!handler) {
        stream.respond({ ':status': 404 });
        stream.end();
      } else if (headers[':method'].toLowerCase() !== 'post') {
        stream.respond({ ':status': 405 });
        stream.end();
      } else {
        const chunks = [];
        stream.on('data', chunk => {
          chunks.push(chunk);
        });
        stream.on('end', async () => {
          try {
            const rendered = await executor.render(handler, chunks.join());

            stream.respond({
              ':status': 200,
              'content-type': 'text/html',
            });

            stream.end(rendered + "\n");
          } catch (e) {
            stream.respond({
              ':status': 500,
              'content-type': 'application/json',
            });

            stream.end(JSON.stringify({
              error: {
                name: e.name,
                message: e.message,
                fileName: e.fileName,
                lineNumber: e.lineNumber,
              },
            }) + "\n");
          }
        });
      }
    });
  }

}

module.exports = {
  Http2Server,
};
