import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Schema SQL
const schemaSQL = `
CREATE TABLE IF NOT EXISTS golfClubs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  createdAt TEXT,
  isDefault INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS golfBags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
CREATE TABLE IF NOT EXISTS golfClubRelations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT,
  clubId INTEGER NOT NULL,
  bagId INTEGER NOT NULL,
  FOREIGN KEY(clubId) REFERENCES golfClubs(id),
  FOREIGN KEY(bagId) REFERENCES golfBags(id)
);
`;

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  // Create database in the project root
  const dbPath = path.join(process.cwd(), 'data', 'golf-clubs.db');

  // Ensure the data directory exists
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Run schema setup
  const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
  for (const stmt of statements) {
    db.exec(stmt);
  }

  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
