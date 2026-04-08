import { NextResponse } from 'next/server';
import { generateNotes, translateNotes } from '@/lib/gemini';
import { saveNotes } from '@/lib/firestore';
import { hasApiKey } from '@/lib/firebase';

export async function POST(request) {
  try {
    const { transcript, language, videoId, videoTitle, videoUrl, uid } = await request.json();

    console.log(`[Generate API] Processing request for videoId: ${videoId}, lang: ${language}`);

    if (!transcript) {
      console.warn('[Generate API] Transcript missing');
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    if (!uid) {
      console.warn('[Generate API] UUID missing');
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 });
    }

    // Truncate transcript if too long (Gemini free tier limits)
    const maxLength = 30000;
    const truncatedTranscript =
      transcript.length > maxLength
        ? transcript.substring(0, maxLength) + '\n\n[Transcript truncated due to length]'
        : transcript;

    console.log(`[Generate API] Calling Gemini...`);
    // Generate notes using Gemini
    let notes = await generateNotes(truncatedTranscript);

    // Translate if not English
    if (language && language !== 'en') {
      console.log(`[Generate API] Translating to ${language}`);
      notes = await translateNotes(notes, language);
    }

    let noteId;
    if (hasApiKey) {
      console.log(`[Generate API] Saving to Firestore for UID: ${uid}`);
      // Save to Firestore
      noteId = await saveNotes(uid, {
        videoId,
        videoTitle: videoTitle || 'YouTube Video',
        videoUrl: videoUrl || `https://youtube.com/watch?v=${videoId}`,
        notes,
        language: language || 'en',
      });
    } else {
      console.log(`[Generate API] Demo mode: Skipping Firestore save`);
      noteId = `mock-${Date.now()}`;
    }

    console.log(`[Generate API] Success! Note ID: ${noteId}`);
    return NextResponse.json({
      success: true,
      noteId,
      notes,
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate notes. Please try again.' },
      { status: 500 }
    );
  }
}
