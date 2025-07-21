#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source directory ${src} does not exist`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Copy admit_cards directory to dist
const admitCardsSource = path.resolve(projectRoot, 'server', 'admit_cards');
const admitCardsDestination = path.resolve(distDir, 'admit_cards');

console.log('Copying assets for production build...');
copyDir(admitCardsSource, admitCardsDestination);

console.log('Assets copied successfully!');
