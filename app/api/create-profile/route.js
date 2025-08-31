import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // This is your service role key
);

export async function POST(request) {
  try {
    const profileData = await request.json();
    
    console.log('API: Received profile data:', profileData);

    // Insert profile using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert([profileData])
      .select();

    if (error) {
      console.error('API: Profile creation error:', error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('API: Profile created successfully:', data);
    return Response.json({ success: true, data });

  } catch (error) {
    console.error('API: Catch error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
