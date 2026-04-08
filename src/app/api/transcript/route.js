import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    console.log(`[Transcript API] Fetching transcript for videoId: ${videoId}`);
    
    // Fetch transcript using youtube-transcript package
    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (transcriptError) {
      console.warn(`[Transcript API] Native transcript error for ${videoId}:`, transcriptError.message);
      return NextResponse.json(
        {
          error:
            'Could not fetch transcript. This video may not have captions/subtitles available, or it passes a block/captcha.',
        },
        { status: 404 }
      );
    }

    if (!transcriptItems || transcriptItems.length === 0) {
      console.warn(`[Transcript API] No transcript items returned for ${videoId}`);
      return NextResponse.json(
        { error: 'Transcript is empty or not found for this video.' },
        { status: 404 }
      );
    }
    
    console.log(`[Transcript API] Successfully fetched ${transcriptItems.length} transcript segments.`);

    // Format transcript with timestamps
    const formattedTranscript = transcriptItems
      .map((item) => {
        const minutes = Math.floor(item.offset / 60000);
        const seconds = Math.floor((item.offset % 60000) / 1000);
        const timestamp = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
        return `${timestamp} ${item.text}`;
      })
      .join('\n');

    // Also create a plain text version (for shorter prompts)
    const plainTranscript = transcriptItems.map((item) => item.text).join(' ');

    return NextResponse.json({
      transcript: formattedTranscript,
      plainTranscript,
      duration: transcriptItems.length > 0
        ? Math.ceil(transcriptItems[transcriptItems.length - 1].offset / 60000)
        : 0,
      segments: transcriptItems.length,
    });
  } catch (error) {
    console.error('Transcript error:', error);
    return NextResponse.json(
      { error: 'Failed to process transcript request.' },
      { status: 500 }
    );
  }
}
