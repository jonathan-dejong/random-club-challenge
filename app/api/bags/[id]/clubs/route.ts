import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server-db';

// GET /api/bags/[id]/clubs - Get clubs for a bag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const bagId = parseInt(id);
    const db = getDb();

    const relations = db.prepare(
      'SELECT * FROM golfClubRelations WHERE bagId = ?'
    ).all(bagId);

    return NextResponse.json(relations);
  } catch (error) {
    console.error('Error fetching bag clubs:', error);
    return NextResponse.json({ error: 'Failed to fetch bag clubs' }, { status: 500 });
  }
}

// POST /api/bags/[id]/clubs - Add club to bag
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { clubId } = body;
    const bagId = parseInt(id);

    const db = getDb();
    const now = new Date().toISOString();

    const stmt = db.prepare(
      'INSERT INTO golfClubRelations (bagId, clubId, createdAt) VALUES (?, ?, ?)'
    );
    stmt.run(bagId, clubId, now);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding club to bag:', error);
    return NextResponse.json({ error: 'Failed to add club to bag' }, { status: 500 });
  }
}

// DELETE /api/bags/[id]/clubs - Remove club from bag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId');
    const bagId = parseInt(id);

    if (!clubId) {
      return NextResponse.json({ error: 'clubId is required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare(
      'DELETE FROM golfClubRelations WHERE bagId = ? AND clubId = ?'
    ).run(bagId, parseInt(clubId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing club from bag:', error);
    return NextResponse.json({ error: 'Failed to remove club from bag' }, { status: 500 });
  }
}
