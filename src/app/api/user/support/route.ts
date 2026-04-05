import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// Validation schema
const supportRequestSchema = z.object({
  email: z.string().email(),
  category: z.enum(['bug', 'payment', 'listing', 'account', 'other']),
  message: z.string().min(10).max(2000),
});

// Rate limiting helper
const rateLimitKey = (identifier: string) => `support:${identifier}`;
const rateLimit = new Map<string, number[]>();

function checkRateLimit(identifier: string, limit = 3, windowMs = 3600000): boolean {
  const key = rateLimitKey(identifier);
  const now = Date.now();
  
  if (!rateLimit.has(key)) {
    rateLimit.set(key, []);
  }
  
  const timestamps = rateLimit.get(key)!;
  const recentRequests = timestamps.filter(t => now - t < windowMs);
  
  if (recentRequests.length >= limit) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(key, recentRequests);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = supportRequestSchema.parse(body);
    
    // Get session if user is logged in
    const session = await getSession();
    const userId = session?.user?.id;
    
    // Rate limiting: use email or user ID
    const identifier = userId || validatedData.email;
    if (!checkRateLimit(identifier, 3, 3600000)) {
      return NextResponse.json(
        { error: 'Too many support requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Create support request in database
    const supportRequest = await prisma.supportRequest.create({
      data: {
        userId: userId || null,
        email: validatedData.email,
        category: validatedData.category,
        message: validatedData.message,
        status: 'open',
      },
    });
    
    // Send notification email to admin
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || 'nuethiopia2026@gmail.com',
        subject: `New Support Request: ${validatedData.category.toUpperCase()}`,
        html: `
          <h2>New Support Request</h2>
          <p><strong>Category:</strong> ${validatedData.category}</p>
          <p><strong>From:</strong> ${validatedData.email}</p>
          ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          <p><small>Request ID: ${supportRequest.id}</small></p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send support email notification:', emailError);
      // Don't fail the request if email sending fails
    }
    
    // Send confirmation email to user
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'We received your support request',
        html: `
          <p>Hi,</p>
          <p>Thank you for contacting NU support. We have received your request and will get back to you as soon as possible.</p>
          <p><strong>Request ID:</strong> ${supportRequest.id}</p>
          <p><strong>Category:</strong> ${validatedData.category}</p>
          <p>Best regards,<br>The NU Team</p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Support request submitted successfully',
        requestId: supportRequest.id,
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
    
    console.error('Support request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit support request' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's support requests (authenticated)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const requests = await prisma.supportRequest.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching support requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support requests' },
      { status: 500 }
    );
  }
}
