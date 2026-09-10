// build.js - Prepares static output for Vercel Build Output API & standard static hosts
const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.vercel') continue;
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Build .vercel/output for modern Vercel deployments
const outputDir = path.join(__dirname, '.vercel', 'output');
const staticDir = path.join(outputDir, 'static');
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

[staticDir, distDir, publicDir].forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Copy root HTML files
const rootFiles = ['index.html', 'admin.html', 'database_migration.sql', 'README_ADMIN.md'];
rootFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    [staticDir, distDir, publicDir].forEach(target => {
      fs.copyFileSync(filePath, path.join(target, file));
    });
  }
});

// Copy static directories
const dirsToCopy = ['css', 'js', 'images', 'uploads'];
dirsToCopy.forEach(dirName => {
  const src = path.join(__dirname, dirName);
  [staticDir, distDir, publicDir].forEach(target => {
    copyDirRecursive(src, path.join(target, dirName));
  });
});

// Write .vercel/output/config.json
const configContent = {
  version: 3,
  routes: [
    {
      src: '^/admin/?$',
      dest: '/admin.html'
    },
    {
      handle: 'filesystem'
    }
  ]
};

fs.writeFileSync(
  path.join(outputDir, 'config.json'),
  JSON.stringify(configContent, null, 2),
  'utf-8'
);

console.log('Build completed successfully!');
console.log('Static assets generated in: .vercel/output/static, dist/, and public/');
