// src/api/authApi.ts

import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zdpboccjipkgnjjzojnc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJvY2NqaXBrZ25qanpvam5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjcyMTQsImV4cCI6MjA2MzY0MzIxNH0.OQ3DRMGiYUJG09bTPf7vdnO9Jr2N0QX-eIfYLj5Cwb4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
};

export const getAuthHeader = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error('No active session found');

    return {
        Authorization: `Bearer ${data.session.access_token}`,
        'Content-Type': 'application/json',
    };
};