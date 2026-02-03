import { connectDB } from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid candidate IDs' }, { status: 400 });
    }

    // Delete multiple candidates at once
    const result = await Candidate.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error bulk deleting candidates:', error);
    return NextResponse.json({ error: 'Failed to delete candidates' }, { status: 500 });
  }
}
