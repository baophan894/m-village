import { connectDB } from '@/lib/db';
import VotingSession from '@/lib/models/VotingSession';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sessions = await VotingSession.find({});
    const result = {
      queen: sessions.find((s) => s.category === 'queen')?.isActive ?? true,
      king: sessions.find((s) => s.category === 'king')?.isActive ?? true,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching voting sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch voting sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { category, isActive } = await req.json();

    if (!category || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    let session = await VotingSession.findOne({ category });

    if (!session) {
      session = await VotingSession.create({ category, isActive });
    } else {
      session.isActive = isActive;
      await session.save();
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating voting session:', error);
    return NextResponse.json({ error: 'Failed to update voting session' }, { status: 500 });
  }
}
