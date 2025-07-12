import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server-db';
import { defaultClubs } from '@/app/clubSeeds';

// GET /api/clubs - Get all clubs
export async function GET() {
  try {
    const db = getDb();
    let clubs = db.prepare('SELECT * FROM golfClubs').all();

    // Seed clubs if table is empty
    if (clubs.length === 0) {
      const now = new Date().toISOString();
      const insertStmt = db.prepare(
        'INSERT INTO golfClubs (name, description, icon, createdAt, isDefault) VALUES (?, ?, ?, ?, 1)'
      );

      for (const club of defaultClubs) {
        insertStmt.run(club.name, club.description || null, club.icon, now);
      }

      clubs = db.prepare('SELECT * FROM golfClubs').all();
    }

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 });
  }
}

// POST /api/clubs - Create a new club
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon } = body;

    if (!name || !icon) {
      return NextResponse.json({ error: 'Name and icon are required' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    const stmt = db.prepare(
      'INSERT INTO golfClubs (name, description, icon, createdAt, isDefault) VALUES (?, ?, ?, ?, 0)'
    );
    const result = stmt.run(name, description || null, icon, now);

    const newClub = db.prepare('SELECT * FROM golfClubs WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(newClub);
  } catch (error) {
    console.error('Error creating club:', error);
    return NextResponse.json({ error: 'Failed to create club' }, { status: 500 });
  }
}

// DELETE /api/clubs - Delete only custom clubs (preserve default clubs)
export async function DELETE() {
  try {
    const db = getDb();

    // Get all custom clubs (isDefault = 0)
    const customClubs = db.prepare('SELECT id FROM golfClubs WHERE isDefault = 0').all();
    const customClubIds = customClubs.map((club: any) => club.id);

    if (customClubIds.length > 0) {
      // Delete club relations for custom clubs first (foreign key constraint)
      const placeholders = customClubIds.map(() => '?').join(',');
      db.prepare(`DELETE FROM golfClubRelations WHERE clubId IN (${placeholders})`).run(...customClubIds);

      // Delete custom clubs
      db.prepare(`DELETE FROM golfClubs WHERE id IN (${placeholders})`).run(...customClubIds);
    }

    return NextResponse.json({
      success: true,
      deletedCount: customClubIds.length,
      message: `Deleted ${customClubIds.length} custom clubs`
    });
  } catch (error) {
    console.error('Error deleting custom clubs:', error);
    return NextResponse.json({ error: 'Failed to delete custom clubs' }, { status: 500 });
  }
}
