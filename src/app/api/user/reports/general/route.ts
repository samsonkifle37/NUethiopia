import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// Validation schema
const reportGeneralSchema = z.object({
  issueType: z.enum(['bug', 'security', 'content', 'payment', 'other']),
  description: z.string().min(20).max(2000),
  screenshotUrl: z.string().url().optional().or(z.literal('')),
});

// Rate limiting
const rateLimit = new Map<string, number[]>();

function checkRateLimit(identifier: string, limit = 5, windowMs = 3600000): boolean {
  const now = Date.now();
  
  if (!rateLimit.has(identifier)) {
    rateLimit.set(identifier, []);
  }
  
  const timestamps = rateLimit.get(identifier)!;
  const recentRequests = timestamps.filter(t => now - t < windowMs);
  
  if (recentRequests.length >= limit) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(identifier, recentRequests);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = reportGeneralSchema.parse(body);
    
    // Get session if user is logged in
    const session = await getSession();
    const userId = session?.user?.id;
    
    // Rate limit
    const identifier = userId || req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(identifier, 5, 3600000)) {
      return NextResponse.json(
        { error: 'Too many reports. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Create report
    const report = await prisma.reportGeneral.create({
      data: {
        userId: userId || null,
        issueType: validatedData.issueType,
        description: validatedData.description,
        screenshotUrl: validatedData.screenshotUrl || null,
        status: 'open',
      },
    });
    
    // Send notification to admin
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || 'nuethiopia2026@gmail.com',
        subject: `New Report: ${validatedData.issueType.toUpperCase()}`,
        html: `
          <h2>New Problem Report</h2>
          <p><strong>Type:</strong> ${validatedData.issueType}</p>
          <p><strong>Description:</strong></p>
          <p>${validatedData.description.replace(/\n/g, '<br>')}</p>
          ${validatedData.screenshotUrl ? `<p><strong>Screenshot:</strong> <a href="${validatedData.screenshotUrl}">${validatedData.screenshotUrl}</a></p>` : ''}
          <p><small>Report ID: ${report.id}</small></p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send report email:', emailError);
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Report submitted successfully',
        reportId: report.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Report error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
