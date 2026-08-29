const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const BASE_DIR = __dirname;
let PORT = parseInt(process.env.PORT || '3005', 10);

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.lottie': 'application/zip',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. Route API requests
  if (pathname.startsWith('/api/')) {
    let handlerFile = null;
    if (pathname === '/api/jobs' || pathname === '/api/jobs.js') handlerFile = './api/jobs.js';
    else if (pathname === '/api/candidates' || pathname === '/api/candidates.js') handlerFile = './api/candidates.js';
    else if (pathname === '/api/enquiries' || pathname === '/api/enquiries.js') handlerFile = './api/enquiries.js';

    if (handlerFile) {
      let bodyData = '';
      req.on('data', chunk => {
        bodyData += chunk;
      });
      req.on('end', () => {
        req.query = parsedUrl.query || {};
        if (bodyData) {
          try {
            req.body = JSON.parse(bodyData);
          } catch (e) {
            req.body = bodyData;
          }
        } else {
          req.body = {};
        }

        // Add express-like helper methods
        res.status = function(code) {
          this.statusCode = code;
          return this;
        };
        res.json = function(data) {
          this.setHeader('Content-Type', 'application/json; charset=utf-8');
          this.end(JSON.stringify(data));
        };

        try {
          const handler = require(handlerFile);
          return handler(req, res);
        } catch (apiErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: apiErr.message }));
        }
      });
      return;
    }
  }

  // 2. Route Admin shorthand
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html') {
    pathname = '/admin.html';
  } else if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(BASE_DIR, pathname);
  let ext = path.extname(filePath).toLowerCase();

  // 3. If PHP file requested, execute with local PHP if available
  if (ext === '.php') {
    const { execFile } = require('child_process');
    const phpPath = 'C:\\\\xampp\\\\php\\\\php.exe';
    if (fs.existsSync(phpPath) && fs.existsSync(filePath)) {
      execFile(phpPath, [filePath], (phpErr, stdout) => {
        if (phpErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('PHP error: ' + phpErr.message);
        }
        res.writeHead(200, { 'Content-Type': pathname.includes('api/') ? 'application/json' : 'text/html' });
        res.end(stdout);
      });
      return;
    }
  }

  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(BASE_DIR, 'index.html'), (err2, indexContent) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`CEGS Website is live and running at: http://localhost:${port}`);
    console.log(`CEGS Admin Portal is live at: http://localhost:${port}/admin`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(PORT);
