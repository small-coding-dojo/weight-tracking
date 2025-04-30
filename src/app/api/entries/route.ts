import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handler for GET requests - Returns all entries
export async function GET() {
  try {
    const entries = await prisma.userEntry.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error retrieving entries:', error);
    return NextResponse.json(
      { error: 'Error retrieving entries' },
      { status: 500 }
    );
  }
}

// Handler for POST requests - Creates a new entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    if (!body.value || isNaN(parseFloat(String(body.value)))) {
      return NextResponse.json(
        { error: 'Invalid value' },
        { status: 400 }
      );
    }

    // Create the new entry
    const entry = await prisma.userEntry.create({
      data: {
        value: parseFloat(String(body.value)),
        notes: body.notes,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Error creating entry' },
      { status: 500 }
    );
  }
}