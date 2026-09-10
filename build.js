// build.js - Prepares static output for Vercel deployment in public/ and dist/
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

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

[publicDir, distDir].forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Copy root HTML and documentation files
const rootFiles = ['index.html', 'admin.html', 'database_migration.sql', 'README_ADMIN.md'];
rootFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    [publicDir, distDir].forEach(target => {
      fs.copyFileSync(filePath, path.join(target, file));
    });
  }
});

// Copy static directories (css, js, images, uploads, source)
const dirsToCopy = ['css', 'js', 'images', 'uploads', 'source'];
dirsToCopy.forEach(dirName => {
  const src = path.join(__dirname, dirName);
  [publicDir, distDir].forEach(target => {
    copyDirRecursive(src, path.join(target, dirName));
  });
});

console.log('Build completed successfully! Static files synchronized in public/ and dist/');
