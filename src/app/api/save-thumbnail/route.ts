import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const thumbnail = formData.get('thumbnail') as Blob;
    const filename = formData.get('filename') as string;

    if (!thumbnail || !filename) {
      return NextResponse.json(
        { error: 'Thumbnail or filename missing' },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await thumbnail.arrayBuffer());
    const filepath = join(process.cwd(), 'public', 'video_reels', 'thumbnails', filename);

    await writeFile(filepath, bytes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to save thumbnail' },
      { status: 500 }
    );
  }
} 