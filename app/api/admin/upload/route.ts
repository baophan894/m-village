import { connectDB } from '@/lib/db';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Extract filename without path and extension
    const fullName = file.name.split('/').pop() || file.name; // Remove path
    const filename = fullName.replace(/\.[^/.]+$/, ''); // Remove extension

    const result = (await uploadToCloudinary(buffer, filename)) as any;

    return NextResponse.json({
      url: result.secure_url,
      cloudinaryId: result.public_id,
      filename: filename,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    
    // Return detailed error message
    const errorMessage = error?.message || 'Failed to upload file';
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
