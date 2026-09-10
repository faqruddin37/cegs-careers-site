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

  const cleanPath = pathname.replace(/^\/+/, '');
  const candidatePaths = [
    path.join(__dirname, cleanPath),
    path.join(__dirname, 'public', cleanPath),
    path.join(__dirname, 'dist', cleanPath)
  ];

  let resolvedFile = null;
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        resolvedFile = p;
        break;
      }
      if (!path.extname(p) && fs.existsSync(p + '.html') && fs.statSync(p + '.html').isFile()) {
        resolvedFile = p + '.html';
        break;
      }
    } catch (e) {
      // Continue to next candidate path
    }
  }

  if (resolvedFile) {
    const ext = path.extname(resolvedFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(resolvedFile).pipe(res);
  } else {
    const ext = path.extname(pathname).toLowerCase();
    if (ext && ext !== '.html') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(`404 Not Found: ${pathname}`);
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
  }
};
