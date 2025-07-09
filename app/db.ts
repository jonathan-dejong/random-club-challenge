import initWasm from '@vlcn.io/crsqlite-wasm';

let dbInstance: any = null;

// Schema SQL
const schemaSQL = `
CREATE TABLE IF NOT EXISTS golfClubs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  createdAt TEXT
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

export async function getDb() {
  if (dbInstance) return dbInstance;
  const sqlite3 = await initWasm();
  dbInstance = await sqlite3.open();
  // Run schema setup
  for (const stmt of schemaSQL.split(';')) {
    if (stmt.trim()) await dbInstance.exec(stmt);
  }
  return dbInstance;
}

// Example: List all bags
export async function getAllBags() {
  const db = await getDb();
  const result = await db.exec(`SELECT * FROM golfBags`);
  return result;
}

// Add more helpers for CRUD as needed...
