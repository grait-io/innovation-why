// Quick test to verify environment variables are being read correctly
console.log('=== Environment Variables Test ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('Expected URL should be: https://zdpboccjipkgnjjzojnc.supabase.co');
console.log('===================================');