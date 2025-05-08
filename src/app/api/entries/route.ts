import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Handler for GET requests - Returns all entries for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // If not authenticated, return unauthorized
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await prisma.userEntry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error retrieving entries:", error);
    return NextResponse.json(
      { error: "Error retrieving entries" },
      { status: 500 },
    );
  }
}

// Handler for POST requests - Creates a new entry for the current user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // If not authenticated, return unauthorized
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input data
    if (!body.value || isNaN(parseFloat(String(body.value)))) {
      return NextResponse.json({ error: "Invalid value" }, { status: 400 });
    }

    // Create the new entry associated with the current user
    const entry = await prisma.userEntry.create({
      data: {
        value: parseFloat(String(body.value)),
        notes: body.notes,
        userId: session.user.id,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { error: "Error creating entry" },
      { status: 500 },
    );
  }
}
