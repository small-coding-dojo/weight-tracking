import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch user settings
export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find user settings
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST: Create or update user settings
export async function POST(req: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get data from request body
    const { weightGoal, lossRate, carbFatRatio, bufferValue } = await req.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert user settings (create if doesn't exist or update if exists)
    const updatedSettings = await prisma.userSettings.upsert({
      where: {
        userId: user.id
      },
      update: {
        weightGoal,
        lossRate,
        carbFatRatio,
        bufferValue,
      },
      create: {
        userId: user.id,
        weightGoal,
        lossRate,
        carbFatRatio,
        bufferValue,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully',
      settings: updatedSettings 
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}