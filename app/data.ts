import { getDb } from './db';

// Golf Bags
export async function getAllBags() {
  const db = await getDb();
  const { rows } = await db.exec(`SELECT * FROM golfBags`);
  return rows || [];
}

export async function getBagById(id: number) {
  const db = await getDb();
  const { rows } = await db.exec(`SELECT * FROM golfBags WHERE id = ?`, [id]);
  return rows[0] || null;
}

export async function createBag(data: { name: string; description?: string; icon?: string }) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.exec(
    `INSERT INTO golfBags (name, description, icon, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.description || '', data.icon || '', now, now]
  );
}

export async function updateBag(id: number, data: { name?: string; description?: string; icon?: string }) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.exec(
    `UPDATE golfBags SET name = ?, description = ?, icon = ?, updatedAt = ? WHERE id = ?`,
    [data.name, data.description, data.icon, now, id]
  );
}

export async function deleteBag(id: number) {
  const db = await getDb();
  await db.exec(`DELETE FROM golfBags WHERE id = ?`, [id]);
}

// Golf Clubs
export async function getAllClubs() {
  const db = await getDb();
  const { rows } = await db.exec(`SELECT * FROM golfClubs`);
  return rows || [];
}

export async function getClubById(id: number) {
  const db = await getDb();
  const { rows } = await db.exec(`SELECT * FROM golfClubs WHERE id = ?`, [id]);
  return rows[0] || null;
}

export async function createClub(data: { name: string; description?: string; icon?: string }) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.exec(
    `INSERT INTO golfClubs (name, description, icon, createdAt) VALUES (?, ?, ?, ?)`,
    [data.name, data.description || '', data.icon || '', now]
  );
}

export async function updateClub(id: number, data: { name?: string; description?: string; icon?: string }) {
  const db = await getDb();
  await db.exec(
    `UPDATE golfClubs SET name = ?, description = ?, icon = ? WHERE id = ?`,
    [data.name, data.description, data.icon, id]
  );
}

export async function deleteClub(id: number) {
  const db = await getDb();
  await db.exec(`DELETE FROM golfClubs WHERE id = ?`, [id]);
}

// Golf Club Relations
export async function getClubsForBag(bagId: number) {
  const db = await getDb();
  const { rows } = await db.exec(`SELECT * FROM golfClubRelations WHERE bagId = ?`, [bagId]);
  return rows || [];
}

export async function addClubToBag(bagId: number, clubId: number) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.exec(
    `INSERT INTO golfClubRelations (bagId, clubId, createdAt) VALUES (?, ?, ?)`,
    [bagId, clubId, now]
  );
}

export async function removeClubFromBag(bagId: number, clubId: number) {
  const db = await getDb();
  await db.exec(
    `DELETE FROM golfClubRelations WHERE bagId = ? AND clubId = ?`,
    [bagId, clubId]
  );
}

// Random club from bag
export async function getRandomClubFromBag(bagId: number) {
  const db = await getDb();
  const { rows } = await db.exec(
    `SELECT c.* FROM golfClubs c JOIN golfClubRelations r ON c.id = r.clubId WHERE r.bagId = ?`,
    [bagId]
  );
  if (rows.length === 0) return null;
  const randomClub = rows[Math.floor(Math.random() * rows.length)];
  return randomClub;
}
