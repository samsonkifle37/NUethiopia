import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// Validation schema
const reportPlaceSchema = z.object({
  placeId: z.string().uuid(),
  reason: z.enum(['incorrect_info', 'unsafe', 'scam', 'closed_permanently', 'other']),
  notes: z.string().max(1000).optional(),
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
    const validatedData = reportPlaceSchema.parse(body);
    
    // Verify place exists
    const place = await prisma.place.findUnique({
      where: { id: validatedData.placeId },
      select: { id: true, name: true, slug: true },
    });
    
    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }
    
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
    const report = await prisma.reportPlace.create({
      data: {
        placeId: validatedData.placeId,
        userId: userId || null,
        reason: validatedData.reason,
        notes: validatedData.notes || null,
        status: 'open',
      },
    });
    
    // Send notification to admin
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || 'nuethiopia2026@gmail.com',
        subject: `New Place Report: ${place.name} - ${validatedData.reason}`,
        html: `
          <h2>New Place Report</h2>
          <p><strong>Place:</strong> ${place.name}</p>
          <p><strong>Slug:</strong> ${place.slug}</p>
          <p><strong>Reason:</strong> ${validatedData.reason}</p>
          ${validatedData.notes ? `<p><strong>Notes:</strong></p><p>${validatedData.notes.replace(/\n/g, '<br>')}</p>` : ''}
          <p><small>Report ID: ${report.id}</small></p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send place report email:', emailError);
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Place report submitted successfully',
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
    
    console.error('Place report error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
