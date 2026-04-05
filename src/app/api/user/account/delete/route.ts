import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Validation schema - require confirmation
const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password required for confirmation'),
  confirmPhrase: z.string().refine(val => val === 'DELETE', {
    message: 'Please type DELETE to confirm',
  }),
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(req: NextRequest) {
  try {
    // Get session
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse and validate request
    const body = await req.json();
    const validatedData = deleteAccountSchema.parse(body);
    
    // Fetch user to verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // 1. Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Identity verification failed.' },
        { status: 401 }
      );
    }
    
    // Begin deletion cascade
    // We'll perform critical deletions explicitly to ensure no orphans and for logging purposes
    try {
      console.log(`Starting permanent deletion for user: ${userId} (${user.email})`);

      // We rely primarily on Prisma's onDelete: Cascade defined in schema.prisma
      // for most tables (StayListing, Review, Favorite, Itinerary, etc.)
      
      // Some join tables or complex relations might need explicit cleanup if not cascaded correctly
      // (Though schema looks good with Cascades)

      // For some tables, we use SetNull in the schema (e.g., NotificationLog, OwnerClaim).
      // We'll delete these explicitly to ensure full data erasure as requested.
      
      await prisma.notificationLog.deleteMany({
        where: { userId },
      });
      
      await prisma.ownerClaim.deleteMany({
        where: { userId },
      });

      // 10. Finally, delete the user record (This triggers cascades in DB for others)
      await prisma.user.delete({
        where: { id: userId },
      });
      
      // Delete from Supabase Auth if it exists there
      // This is crucial if we are using Supabase as our auth provider
      try {
        if (supabase) {
          // Attempt to delete user by ID in Supabase Auth
          const { error: authError } = await supabase.auth.admin.deleteUser(userId);
          if (authError) {
             console.warn('Supabase auth deletion warning (might not exist in auth.users):', authError.message);
          }
        }
      } catch (authError) {
        console.warn('Could not delete Supabase auth user:', authError);
      }
      
      // Clear the session cookie
      const response = NextResponse.json(
        {
          success: true,
          message: 'Your account and all associated data have been permanently deleted.',
        },
        { status: 200 }
      );

      response.cookies.delete('auth-token');
      
      return response;
    } catch (deletionError) {
      console.error('Error during database account deletion:', deletionError);
      return NextResponse.json(
        { error: 'Failed to delete account data. Please contact support.' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      );
    }
    
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

