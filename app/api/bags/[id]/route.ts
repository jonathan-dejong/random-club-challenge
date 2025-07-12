import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server-db';

// PUT /api/bags/[id] - Update a bag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, description, icon } = body;
    const bagId = parseInt(id);

    const db = getDb();
    const now = new Date().toISOString();

    const stmt = db.prepare(
      'UPDATE golfBags SET name = ?, description = ?, icon = ?, updatedAt = ? WHERE id = ?'
    );
    stmt.run(name, description, icon, now, bagId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating bag:', error);
    return NextResponse.json({ error: 'Failed to update bag' }, { status: 500 });
  }
}

// DELETE /api/bags/[id] - Delete a bag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
      try {
      const bagId = parseInt(id);
      const db = getDb();

        // Delete related club relations first
    db.prepare('DELETE FROM golfClubRelations WHERE bagId = ?').run(bagId);

    // Delete the bag
    db.prepare('DELETE FROM golfBags WHERE id = ?').run(bagId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bag:', error);
    return NextResponse.json({ error: 'Failed to delete bag' }, { status: 500 });
  }
}
