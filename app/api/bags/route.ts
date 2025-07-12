import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server-db';

// GET /api/bags - Get all bags
export async function GET() {
  try {
    const db = getDb();
    const bags = db.prepare('SELECT * FROM golfBags').all();
    return NextResponse.json(bags);
  } catch (error) {
    console.error('Error fetching bags:', error);
    return NextResponse.json({ error: 'Failed to fetch bags' }, { status: 500 });
  }
}

// POST /api/bags - Create a new bag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon } = body;

    const db = getDb();
    const now = new Date().toISOString();

    const stmt = db.prepare(
      'INSERT INTO golfBags (name, description, icon, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, description || '', icon || '', now, now);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating bag:', error);
    return NextResponse.json({ error: 'Failed to create bag' }, { status: 500 });
  }
}
