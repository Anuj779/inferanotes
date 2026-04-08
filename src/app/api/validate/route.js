import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // YouTube URL patterns
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    let videoId = null;
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        videoId = match[1];
        break;
      }
    }

    if (!videoId) {
      console.warn(`[Validate API] Invalid YouTube URL provided: ${url}`);
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please provide a valid YouTube video link.' },
        { status: 400 }
      );
    }

    console.log(`[Validate API] Extracted videoId: ${videoId}`);

    // Try to get video info from oEmbed (no API key needed)
    let title = 'YouTube Video';
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        title = oembedData.title || title;
      }
    } catch (e) {
      console.warn(`[Validate API] oEmbed fetch failed, ignoring: ${e.message}`);
    }

    return NextResponse.json({
      valid: true,
      videoId,
      title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  } catch (error) {
    console.error('Validate error:', error);
    return NextResponse.json(
      { error: 'Failed to validate URL' },
      { status: 500 }
    );
  }
}
