// Vercel Serverless Function & Node.js Entrypoint for CEGS Portal
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.lottie': 'application/zip',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf'
};

module.exports = (req, res) => {
  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

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
        const queryObj = {};
        for (const [key, value] of reqUrl.searchParams.entries()) {
          queryObj[key] = value;
        }
        req.query = queryObj;

        if (bodyData) {
          try {
            req.body = JSON.parse(bodyData);
          } catch (e) {
            req.body = bodyData;
          }
        } else if (!req.body) {
          req.body = {};
        }

        // Add helper methods if missing
        if (!res.status) {
          res.status = function(code) {
            this.statusCode = code;
            return this;
          };
        }
        if (!res.json) {
          res.json = function(data) {
            this.setHeader('Content-Type', 'application/json; charset=utf-8');
            this.end(JSON.stringify(data));
          };
        }

        try {
          const handler = require(handlerFile);
          return handler(req, res);
        } catch (apiErr) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: apiErr.message }));
        }
      });
      return;
    }
  }

  // 2. Normalize routing for root and admin
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html') {
    pathname = '/admin.html';
  }

  // Strip leading slash for relative path joining
  const cleanPath = pathname.replace(/^\/+/, '');
  let filePath = path.join(__dirname, cleanPath);
  let ext = path.extname(filePath).toLowerCase();

  // If no extension and exists as .html file (e.g. /admin -> admin.html)
  if (!ext && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
    ext = '.html';
  }

  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(`404 Not Found: ${pathname}`);
      }

      fs.readFile(path.join(__dirname, 'index.html'), (err2, indexContent) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexContent);
        }
      });
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    }
  });
};
