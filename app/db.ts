import initWasm from '@vlcn.io/crsqlite-wasm';

// The type for the DB instance is unknown due to lack of types in @vlcn.io/crsqlite-wasm
let dbInstance: unknown = null;

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

type DBWithExec = {
  exec: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }>;
  execO: <T = unknown>(sql: string, params?: unknown[]) => Promise<T[]>;
};

export async function getDb() {
  if (dbInstance) return dbInstance as unknown as DBWithExec;
  const sqlite3 = await initWasm();
  dbInstance = await sqlite3.open('random-club-challenge.db');
  // Run schema setup
  for (const stmt of schemaSQL.split(';')) {
    if (stmt.trim()) await (dbInstance as unknown as DBWithExec).exec(stmt);
  }
  return dbInstance as unknown as DBWithExec;
}

// Example: List all bags
export async function getAllBags() {
  const db = await getDb();
  const result = await db.exec(`SELECT * FROM golfBags`);
  return result;
}

// Add more helpers for CRUD as needed...
