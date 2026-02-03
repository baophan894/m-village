import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Employee from '@/lib/models/Employee';

// POST - Reset tất cả nhân viên về trạng thái chưa trúng giải
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    await Employee.updateMany(
      {},
      {
        $set: {
          hasWonPrize: false,
          prizeType: null,
          wonAt: null,
        },
      }
    );

    return NextResponse.json({ message: 'Đã reset tất cả nhân viên' });
  } catch (error) {
    console.error('Error resetting employees:', error);
    return NextResponse.json({ error: 'Failed to reset employees' }, { status: 500 });
  }
}
