# 🔍 Troubleshooting Supabase Login Issues

## 🎯 **Quick Verification Steps**

### **Step 1: Verify Environment Variables Are Loading**

1. **Restart your development server** (this is crucial!):
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Check browser console** for debug messages:
   - Open browser dev tools (F12)
   - Look for messages starting with "🔧 Supabase Configuration:"
   - Should show your dev URL: `https://zdpboccjipkgnjjzojnc.supabase.co`

### **Step 2: Verify Your Supabase Project Setup**

**In your Supabase dashboard (`https://zdpboccjipkgnjjzojnc.supabase.co`):**

1. **Check Authentication Settings**:
   - Go to **Authentication** → **Settings**
   - **Site URL**: Should be `http://localhost:5173`
   - **Redirect URLs**: Should include `http://localhost:5173`
   - **Enable email confirmations**: Should be **DISABLED** for testing

2. **Create/Verify Admin User**:
   - Go to **Authentication** → **Users**
   - Look for user: `admin@kiezbett.dev`
   - If not exists, click **Add User**:
     ```
     Email: admin@kiezbett.dev
     Password: KiezAdmin2024!
     ✅ Email Confirm: CHECKED (skip verification)
     ```

3. **Check Database Table**:
   - Go to **SQL Editor**
   - Run this query to verify the table exists:
     ```sql
     SELECT * FROM order_tokens LIMIT 5;
     ```
   - If table doesn't exist, run the creation script from `SETUP_DEV_ENVIRONMENT.md`

### **Step 3: Test Login Process**

1. **Clear browser cache/cookies** for localhost
2. **Go to login page**: `http://localhost:5173/login`
3. **Use credentials**:
   ```
   Email: admin@kiezbett.dev
   Password: KiezAdmin2024!
   ```
4. **Check browser network tab** for API calls to your dev Supabase URL

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still Using Production Supabase**
**Symptoms**: Console shows `bxdlbbljmpersaoxvnnt.supabase.co`
**Solution**: 
- Restart development server
- Check `.env` file is in root directory
- Verify environment variables start with `VITE_`

### **Issue 2: User Not Found**
**Symptoms**: "Invalid login credentials" error
**Solution**:
- Verify user exists in your dev Supabase project
- Check email/password exactly match
- Ensure email confirmations are disabled

### **Issue 3: CORS Errors**
**Symptoms**: Network errors in browser console
**Solution**:
- Check Site URL and Redirect URLs in Supabase settings
- Ensure Edge Functions are deployed to correct project

### **Issue 4: Environment Variables Not Loading**
**Symptoms**: Console shows fallback production URL
**Solution**:
```bash
# Check if .env file exists and has correct format
cat .env | grep VITE_SUPABASE

# Should show:
# VITE_SUPABASE_URL=https://zdpboccjipkgnjjzojnc.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 **Debug Commands**

### **Verify Environment Variables**
```bash
# In your project root
echo "VITE_SUPABASE_URL: $VITE_SUPABASE_URL"
echo "Check .env file:"
cat .env | grep VITE_SUPABASE_URL
```

### **Test Supabase Connection**
Add this to your browser console after page loads:
```javascript
// Check which Supabase URL is being used
console.log('Current Supabase URL:', window.location.origin);
// Look for the debug messages in console
```

## ✅ **Expected Results**

When everything is working correctly:

1. **Console shows**: `📍 URL: https://zdpboccjipkgnjjzojnc.supabase.co`
2. **Login succeeds** with `admin@kiezbett.dev`
3. **Redirects to settings page** after login
4. **Token generation works** without CORS errors
5. **Network tab shows** calls to your dev Supabase project

## 🆘 **Still Not Working?**

If login still fails after these steps:

1. **Share the browser console output** (especially the Supabase configuration debug messages)
2. **Check network tab** for failed requests and their URLs
3. **Verify the exact error message** you're seeing
4. **Confirm which Supabase project** the requests are going to

---

**🎯 The key is making sure you restart your dev server and see your dev URL in the console debug messages!**