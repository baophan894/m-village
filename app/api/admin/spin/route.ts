import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Employee from '@/lib/models/Employee';

type PrizeType = 'special' | 'first' | 'second' | 'third' | 'consolation' | 'compensation';

interface SpinRequest {
  prizeType: PrizeType;
  count: number;
}

// POST - Quay số ngẫu nhiên
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body: SpinRequest = await request.json();
    const { prizeType, count } = body;

    if (!prizeType || !count || count < 1) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Lấy danh sách nhân viên chưa trúng giải
    const eligibleEmployees = await Employee.find({ hasWonPrize: false });

    if (eligibleEmployees.length < count) {
      return NextResponse.json(
        { 
          error: `Không đủ nhân viên để quay. Cần ${count} người nhưng chỉ còn ${eligibleEmployees.length} người.` 
        },
        { status: 400 }
      );
    }

    // Random chọn nhân viên
    const shuffled = eligibleEmployees.sort(() => Math.random() - 0.5);
    const winners = shuffled.slice(0, count);

    // Cập nhật trạng thái trúng giải
    const winnerIds = winners.map((w) => w._id);
    await Employee.updateMany(
      { _id: { $in: winnerIds } },
      {
        $set: {
          hasWonPrize: true,
          prizeType: prizeType,
          wonAt: new Date(),
        },
      }
    );

    // Trả về danh sách người trúng giải
    const winnersData = winners.map((w) => ({
      _id: w._id,
      employeeCode: w.employeeCode,
      name: w.name,
      department: w.department,
      prizeType: prizeType,
    }));

    return NextResponse.json({
      winners: winnersData,
      remaining: eligibleEmployees.length - count,
    });
  } catch (error) {
    console.error('Error spinning:', error);
    return NextResponse.json({ error: 'Failed to spin' }, { status: 500 });
  }
}

// GET - Lấy danh sách người đã trúng giải
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const prizeType = searchParams.get('prizeType');
    
    let query: any = { hasWonPrize: true };
    if (prizeType) {
      query.prizeType = prizeType;
    }
    
    const winners = await Employee.find(query).sort({ wonAt: -1 });
    
    // Group by prize type
    const grouped = {
      special: winners.filter((w) => w.prizeType === 'special'),
      first: winners.filter((w) => w.prizeType === 'first'),
      second: winners.filter((w) => w.prizeType === 'second'),
      third: winners.filter((w) => w.prizeType === 'third'),
      consolation: winners.filter((w) => w.prizeType === 'consolation'),
      compensation: winners.filter((w) => w.prizeType === 'compensation'),
    };

    return NextResponse.json({
      winners,
      grouped,
      total: winners.length,
    });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json({ error: 'Failed to fetch winners' }, { status: 500 });
  }
}
