import { NextResponse } from 'next/server';
import { translateNotes } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { notes, language } = await request.json();

    if (!notes) {
      return NextResponse.json({ error: 'Notes content is required' }, { status: 400 });
    }

    if (!language || language === 'en') {
      return NextResponse.json({ error: 'Target language must be specified (not English)' }, { status: 400 });
    }

    const translatedNotes = await translateNotes(notes, language);

    return NextResponse.json({
      success: true,
      translatedNotes,
      language,
    });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to translate notes.' },
      { status: 500 }
    );
  }
}
