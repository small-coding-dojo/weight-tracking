import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE all entries for the current user
export async function DELETE() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete all entries for the user
    const result = await prisma.userEntry.deleteMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Delete all entries error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting entries" },
      { status: 500 },
    );
  }
}
