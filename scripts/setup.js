#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TEMPLATE_DB = path.join(__dirname, '..', 'database.template.sqlite');
const TARGET_DB = path.join(DATA_DIR, 'golf-clubs.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
  console.log('Created data/ directory.');
}

// Copy template database if target does not exist
if (!fs.existsSync(TARGET_DB)) {
  if (fs.existsSync(TEMPLATE_DB)) {
    fs.copyFileSync(TEMPLATE_DB, TARGET_DB);
    console.log('Copied database.template.sqlite to data/golf-clubs.db');
  } else {
    console.error('Template database not found: database.template.sqlite');
    process.exit(1);
  }
} else {
  console.log('Database already exists at data/golf-clubs.db');
}

console.log('Setup complete!');
