import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE specific entry by ID
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract ID from URL
    const url = request.url;
    const entryId = url.split("/").pop();

    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Check if entry exists and belongs to the user
    const entry = await prisma.userEntry.findUnique({
      where: {
        id: entryId,
        userId: userId,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // Delete the entry
    await prisma.userEntry.delete({
      where: {
        id: entryId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete entry error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the entry" },
      { status: 500 },
    );
  }
}
