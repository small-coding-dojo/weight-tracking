import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handler für GET-Anfragen - Gibt alle Einträge zurück
export async function GET() {
  try {
    const entries = await prisma.userEntry.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Fehler beim Abrufen der Einträge:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Einträge' },
      { status: 500 }
    );
  }
}

// Handler für POST-Anfragen - Erstellt einen neuen Eintrag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validiere die Eingabedaten
    if (!body.value || isNaN(parseFloat(String(body.value)))) {
      return NextResponse.json(
        { error: 'Ungültiger Wert' },
        { status: 400 }
      );
    }

    // Erstelle den neuen Eintrag
    const entry = await prisma.userEntry.create({
      data: {
        value: parseFloat(String(body.value)),
        notes: body.notes,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen des Eintrags:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Eintrags' },
      { status: 500 }
    );
  }
}