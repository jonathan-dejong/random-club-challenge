import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server-db';

// GET /api/bags/[id]/random - Get random club from bag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
      try {
      const bagId = parseInt(id);
      const db = getDb();

    const clubs = db.prepare(`
      SELECT c.* FROM golfClubs c
      JOIN golfClubRelations r ON c.id = r.clubId
      WHERE r.bagId = ?
    `).all(bagId);

    if (clubs.length === 0) {
      return NextResponse.json(null);
    }

    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    return NextResponse.json(randomClub);
  } catch (error) {
    console.error('Error getting random club:', error);
    return NextResponse.json({ error: 'Failed to get random club' }, { status: 500 });
  }
}
