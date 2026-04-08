import { NextResponse } from 'next/server';
import { getUserUsage, incrementUsage, getUserNotes, getNotesById } from '@/lib/firestore';
import { hasApiKey } from '@/lib/firebase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const action = searchParams.get('action');
    const noteId = searchParams.get('noteId');

    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!hasApiKey) {
      // Mock Demo Data
      if (action === 'history') return NextResponse.json({ notes: [] });
      if (action === 'usage') return NextResponse.json({ usage: { videosProcessed: 0 } });
      if (action === 'note') return NextResponse.json({ 
        note: {
          id: noteId || 'mock-id',
          uid,
          videoTitle: 'Demo Generated Note',
          notes: `# Example Notes\n\n## Summary\nThis is a mock generation since no API keys are provided.\n\n## Key Concepts\n- Demo mode is active.\n- Please add FIREBASE and GEMINI keys to .env.local to enable real processing.`,
          language: 'en'
        }
      });
      return NextResponse.json({ usage: { videosProcessed: 0 } });
    }

    switch (action) {
      case 'usage': {
        const usage = await getUserUsage(uid);
        return NextResponse.json({ usage });
      }

      case 'history': {
        const notes = await getUserNotes(uid);
        return NextResponse.json({ notes });
      }

      case 'note': {
        if (!noteId) {
          return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
        }
        const note = await getNotesById(noteId);
        if (!note) {
          return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        // Verify ownership
        if (note.uid !== uid) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.json({ note });
      }

      default:
        const usage = await getUserUsage(uid);
        return NextResponse.json({ usage });
    }
  } catch (error) {
    console.error('Usage GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!hasApiKey) {
      return NextResponse.json({ success: true, usage: { videosProcessed: 1 } });
    }

    await incrementUsage(uid);

    const usage = await getUserUsage(uid);

    return NextResponse.json({
      success: true,
      usage,
    });
  } catch (error) {
    console.error('Usage POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update usage' },
      { status: 500 }
    );
  }
}
