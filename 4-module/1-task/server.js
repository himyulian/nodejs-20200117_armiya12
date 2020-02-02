const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  console.log("TCL: pathname", pathname)

  const filepath = path.join(__dirname, 'files', pathname);
  console.log("TCL: filepath", filepath)

  switch (req.method) {
    case 'GET':
      const isNestedPath = /[\\/]/g.test(pathname);
      if (isNestedPath) {
        res.statusCode = 400;
        res.end();
        break;
      } else if (pathname !== 'index.js') {
        res.statusCode = 404;
        res.end();
        break;
      }
      const read = fs.createReadStream(filepath);
      read.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
