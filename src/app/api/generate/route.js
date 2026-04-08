import { NextResponse } from 'next/server';
import { generateNotes, translateNotes } from '@/lib/gemini';
import { saveNotes } from '@/lib/firestore';

export async function POST(request) {
  try {
    const { transcript, language, videoId, videoTitle, videoUrl, uid } = await request.json();

    console.log('[Generate API] Processing request for videoId: ' + videoId);

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    if (!uid) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 });
    }

    const maxLength = 30000;
    const truncatedTranscript =
      transcript.length > maxLength
        ? transcript.substring(0, maxLength) + '\n\n[Transcript truncated due to length]'
        : transcript;

    console.log('[Generate API] Calling Gemini...');
    let notes = await generateNotes(truncatedTranscript);

    if (language && language !== 'en') {
      console.log('[Generate API] Translating to ' + language);
      notes = await translateNotes(notes, language);
    }

    console.log('[Generate API] Saving to Firestore for UID: ' + uid);
    const noteId = await saveNotes(uid, {
      videoId,
      videoTitle: videoTitle || 'YouTube Video',
      videoUrl: videoUrl || 'https://youtube.com/watch?v=' + videoId,
      notes,
      language: language || 'en',
    });

    console.log('[Generate API] Success! Note ID: ' + noteId);
    return NextResponse.json({ success: true, noteId, notes });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate notes. Please try again.' },
      { status: 500 }
    );
  }
}
