import { connectDB } from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import Vote from '@/lib/models/Vote';
import VotingSession from '@/lib/models/VotingSession';
import { NextRequest, NextResponse } from 'next/server';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { candidateId, category } = await req.json();
    const ipAddress = getClientIp(req);

    if (!candidateId || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if voting is active
    const votingSession = await VotingSession.findOne({ category });
    if (!votingSession?.isActive) {
      return NextResponse.json({ error: 'Voting is currently closed for this category' }, { status: 403 });
    }

    // Increment candidate vote count and update lastVotedAt
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { 
        $inc: { votes: 1 },
        $set: { lastVotedAt: new Date() }
      },
      { new: true }
    );

    // Record vote for analytics (browser check via localStorage, not IP)
    Vote.create({
      candidateId,
      ipAddress,
      category,
    }).catch(err => console.log('Vote record error (non-critical):', err));

    return NextResponse.json({
      success: true,
      votes: candidate.votes,
    });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { candidateId } = await req.json();

    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
    }

    // Decrement candidate vote count (ensure it doesn't go below 0)
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    if (candidate.votes > 0) {
      candidate.votes -= 1;
      await candidate.save();
    }

    return NextResponse.json({
      success: true,
      votes: candidate.votes,
    });
  } catch (error) {
    console.error('Error removing vote:', error);
    return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as 'queen' | 'king' | null;
    const ipAddress = searchParams.get('ip');

    if (!category || !ipAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const votes = await Vote.find({ ipAddress, category });
    const votedCandidateIds = votes.map((v) => v.candidateId);

    return NextResponse.json({
      votedCandidateIds,
    });
  } catch (error) {
    console.error('Error fetching vote status:', error);
    return NextResponse.json({ error: 'Failed to fetch vote status' }, { status: 500 });
  }
}
