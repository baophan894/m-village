import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Employee from '@/lib/models/Employee';

// GET - Lấy danh sách nhân viên
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const hasWonPrize = searchParams.get('hasWonPrize');
    
    let query: any = {};
    if (hasWonPrize !== null) {
      query.hasWonPrize = hasWonPrize === 'true';
    }
    
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

// POST - Upload danh sách nhân viên từ Excel
export async function POST(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { employees, clearExisting } = body;

    if (!employees || !Array.isArray(employees)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Nếu clearExisting = true, xóa tất cả nhân viên cũ
    if (clearExisting) {
      await Employee.deleteMany({});
    }

    // Thêm nhân viên mới
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const emp of employees) {
      try {
        // Kiểm tra xem nhân viên đã tồn tại chưa
        const existing = await Employee.findOne({ employeeCode: emp.employeeCode.toUpperCase() });
        if (existing) {
          // Cập nhật thông tin
          existing.name = emp.name;
          existing.department = emp.department;
          await existing.save();
        } else {
          // Tạo mới
          await Employee.create({
            employeeCode: emp.employeeCode.toUpperCase(),
            name: emp.name,
            department: emp.department,
            hasWonPrize: false,
          });
        }
        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${emp.employeeCode}: ${err.message}`);
      }
    }

    return NextResponse.json({
      message: `Đã xử lý ${results.success} nhân viên thành công, ${results.failed} thất bại`,
      ...results,
    });
  } catch (error) {
    console.error('Error uploading employees:', error);
    return NextResponse.json({ error: 'Failed to upload employees' }, { status: 500 });
  }
}

// DELETE - Xóa tất cả nhân viên
export async function DELETE(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    await Employee.deleteMany({});

    return NextResponse.json({ message: 'Đã xóa tất cả nhân viên' });
  } catch (error) {
    console.error('Error deleting employees:', error);
    return NextResponse.json({ error: 'Failed to delete employees' }, { status: 500 });
  }
}
