import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const callbackUrl = requestUrl.searchParams.get('callbackUrl') || '/profile';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
        // If we want to maintain compatibility with the custom auth-token cookie:
        // We might need to manually set the auth-token if we're bridging systems.
        // But for now, let's assume Supabase handles its own session via cookies if configured.
    }
  }

  return NextResponse.redirect(new URL(callbackUrl, request.url));
}
