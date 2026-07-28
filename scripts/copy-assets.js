#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const distPublicDir = path.resolve(distDir, 'public');
const clientPublicDir = path.resolve(projectRoot, 'client', 'public');

// Ensure dist directories exist
if (!fs.existsSync(distPublicDir)) {
  fs.mkdirSync(distPublicDir, { recursive: true });
}

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
    }
  }
}

console.log('Copying assets for production build...');

// 1. Copy admit/ PDFs to dist/public/admit and client/public/admit
const admitSource = path.resolve(projectRoot, 'admit');
const admitDistPublic = path.resolve(distPublicDir, 'admit');
const admitClientPublic = path.resolve(clientPublicDir, 'admit');

copyDir(admitSource, admitDistPublic);
copyDir(admitSource, admitClientPublic);
console.log(`Copied admit card PDFs to production assets.`);

// 2. Generate SHA-256 hashed candidate lookup table from _SCNTSE 2026 (Responses).xlsx Sheet1
const excelPath = path.resolve(projectRoot, '_SCNTSE 2026 (Responses).xlsx');
if (fs.existsSync(excelPath)) {
  try {
    const wb = XLSX.readFile(excelPath);
    const sheet = wb.Sheets['Sheet1'];
    if (sheet) {
      const rows = XLSX.utils.sheet_to_json(sheet);
      const db = {};

      for (const row of rows) {
        const name = (row['Name'] || '').toString().trim();
        const ht = (row['Hall ticket number'] || '').toString().trim();

        let rawA = (row['Aadhar Number'] || '').toString().trim();
        if (rawA.endsWith('.0')) rawA = rawA.slice(0, -2);
        const cleanA = rawA.replace(/[^\d]/g, '');

        const e1 = (row['Email Address'] || '').toString().trim().toLowerCase();
        const e2 = (row['Email'] || '').toString().trim().toLowerCase();

        if (e1 && cleanA) {
          const k1 = crypto.createHash('sha256').update(`${e1}:${cleanA}`).digest('hex');
          db[k1] = { name, ht, aadhar: cleanA, pdf: `/admit/${cleanA}.pdf` };
        }
        if (e2 && e2 !== e1 && cleanA) {
          const k2 = crypto.createHash('sha256').update(`${e2}:${cleanA}`).digest('hex');
          db[k2] = { name, ht, aadhar: cleanA, pdf: `/admit/${cleanA}.pdf` };
        }
      }

      const jsonContent = JSON.stringify(db);
      fs.writeFileSync(path.resolve(distPublicDir, 'admit-db.json'), jsonContent);
      fs.writeFileSync(path.resolve(clientPublicDir, 'admit-db.json'), jsonContent);
      console.log(`Generated secure hashed candidate database (${Object.keys(db).length} entries).`);
    }
  } catch (err) {
    console.error('Error generating hashed candidate database:', err);
  }
}

// 3. Copy server/admit_cards directory to dist/admit_cards
const admitCardsSource = path.resolve(projectRoot, 'server', 'admit_cards');
const admitCardsDestination = path.resolve(distDir, 'admit_cards');
copyDir(admitCardsSource, admitCardsDestination);

console.log('Production build assets compiled successfully!');
