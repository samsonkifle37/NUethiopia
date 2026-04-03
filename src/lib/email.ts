import nodemailer from 'nodemailer';
import prisma from './prisma';

// Create a generic transporter abstraction
// Set NEXT_PUBLIC_BASE_URL internally or via env
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === "production" ? "https://nu-ethiopia.vercel.app" : "http://localhost:3000");

let transporter: nodemailer.Transporter;

// We use dummy/fallback so the app doesn't crash if SMTP is unconfigured locally
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn("⚠️ SMTP credentials not found in environment. Emails will be logged to console instead of sending.");
  transporter = {
    sendMail: async (options: any) => {
      console.log('=== DUMMY EMAIL LOG ===');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Body: ${options.html || options.text}`);
      console.log('=======================');
      return { messageId: 'dummy-id' };
    }
  } as unknown as nodemailer.Transporter;
}

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || '"NU Ethiopia" <noreply@nuethiopia.com>';

export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html?: string, text?: string }) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html
    });

    // Log the event securely into our new audit schema for monetization/admin view
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        body: String(html || text || "").substring(0, 5000),
        status: "SENT",
      }
    });

    return { success: true, info };
  } catch (error: any) {
    console.error("Email sending failed:", error);

    await prisma.emailLog.create({
      data: {
        to,
        subject,
        body: String(html || text || "").substring(0, 5000),
        status: "FAILED",
        errorMessage: String(error.message).substring(0, 1000)
      }
    });

    return { success: false, error };
  }
}

// ── Pre-built templates ────────────────────

export async function sendVerificationEmail(userId: string, email: string, token: string) {
  const verifyLink = `${BASE_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1612;">
      <h2 style="color: #C9973B;">Welcome to NU Ethiopia!</h2>
      <p>Thank you for signing up. To fully enable your property owner and Stays features, please verify your email address.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyLink}" style="background-color: #1A1612; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p style="color: #888; font-size: 12px;">If the button doesn't work, copy and paste this link: <br/>${verifyLink}</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verify your email - NU Ethiopia",
    html
  });
}

export async function sendAdminNewUserAlert({ name, email, accountType, isBusiness }: { name: string, email: string, accountType: string, isBusiness: boolean }) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>🚨 New User Registration</h2>
      <p>A new user has signed up for NU Ethiopia.</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Account Type:</strong> ${accountType} ${isBusiness ? '(Business Profile Selected)' : ''}</li>
        <li><strong>Time:</strong> ${new Date().toISOString()}</li>
      </ul>
      <p><em>Check the Admin dashboard for more details.</em></p>
    </div>
  `;

  return sendEmail({
    to: "nuethiopia2026@gmail.com",
    subject: `New Signup: ${name} [${accountType.toUpperCase()}]`,
    html
  });
}
