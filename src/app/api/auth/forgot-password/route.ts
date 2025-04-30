import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// Configure email transport (for production, use real SMTP settings)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.example.com",
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER || "user@example.com",
    pass: process.env.EMAIL_SERVER_PASSWORD || "password"
  }
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user with the provided email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Don't reveal if email exists for security reasons
    if (!user) {
      return NextResponse.json(
        { message: "If the email exists, a reset link will be sent" }, 
        { status: 200 }
      );
    }

    // Generate a random token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Save token to the user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: user.email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetUrl}`,
        html: `
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
        `
      });
    } catch (error) {
      console.error("Error sending email:", error);
      // Don't expose email sending errors to client
    }

    return NextResponse.json(
      { message: "If the email exists, a reset link will be sent" }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling password reset request:", error);
    return NextResponse.json(
      { error: "Failed to process reset request" },
      { status: 500 }
    );
  }
}