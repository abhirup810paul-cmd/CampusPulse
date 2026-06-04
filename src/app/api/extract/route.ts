import { NextResponse } from 'next/server';
import { extractEvent } from '@/lib/extract';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.type || (body.type !== 'image' && body.type !== 'link')) {
      return NextResponse.json({ error: 'Invalid input type. Must be "image" or "link".' }, { status: 400 });
    }

    if (body.type === 'image' && !body.image_base64) {
      return NextResponse.json({ error: 'Missing image_base64 for image extraction.' }, { status: 400 });
    }

    if (body.type === 'link' && !body.url) {
      return NextResponse.json({ error: 'Missing url for link extraction.' }, { status: 400 });
    }

    // Call the ML extraction logic
    const extractedData = await extractEvent({
      type: body.type,
      url: body.url,
      image_base64: body.image_base64
    });

    return NextResponse.json({ data: extractedData }, { status: 200 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Extraction failed on the server.' }, { status: 500 });
  }
}
