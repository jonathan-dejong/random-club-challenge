import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server-db';

// Define the club type to match the database schema
interface GolfClub {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: string | null;
  isDefault: number; // SQLite stores booleans as integers (0 or 1)
}

// PUT /api/clubs/[id] - Update a club
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, description, icon } = body;
    const clubId = parseInt(id);

    const db = getDb();

    // Check if this is a seeded club using isDefault
    const club = db.prepare('SELECT * FROM golfClubs WHERE id = ?').get(clubId) as GolfClub | undefined;
    if (club && club.isDefault) {
      return NextResponse.json({ error: 'Cannot edit default clubs' }, { status: 403 });
    }

    const stmt = db.prepare(
      'UPDATE golfClubs SET name = ?, description = ?, icon = ? WHERE id = ?'
    );
    stmt.run(name, description || '', icon || '', clubId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating club:', error);
    return NextResponse.json({ error: 'Failed to update club' }, { status: 500 });
  }
}

// DELETE /api/clubs/[id] - Delete a club
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const clubId = parseInt(id);
    const db = getDb();

    // Check if this is a seeded club using isDefault
    const club = db.prepare('SELECT * FROM golfClubs WHERE id = ?').get(clubId) as GolfClub | undefined;
    if (club && club.isDefault) {
      return NextResponse.json({ error: 'Cannot delete default clubs' }, { status: 403 });
    }

    // Delete related club relations first (foreign key constraint)
    db.prepare('DELETE FROM golfClubRelations WHERE clubId = ?').run(clubId);

    // Delete the club
    db.prepare('DELETE FROM golfClubs WHERE id = ?').run(clubId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting club:', error);
    return NextResponse.json({ error: 'Failed to delete club' }, { status: 500 });
  }
}
