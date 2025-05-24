# 🚀 Development Environment Setup Guide

## ✅ **What's Already Done**

1. ✅ **Supabase CLI installed** via Homebrew
2. ✅ **Code updated** to use environment variables instead of hardcoded credentials
3. ✅ **Environment file prepared** for your development credentials

## 🔧 **Next Steps - Complete the Setup**

### **Step 1: Get Your Development Supabase Credentials**

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your development project (or create a new one if needed)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (the `anon` key)

### **Step 2: Update Your .env File**

Replace the placeholder values in your `.env` file:

```bash
# Current placeholders in .env:
VITE_SUPABASE_URL=your-dev-project-url-here
VITE_SUPABASE_ANON_KEY=your-dev-anon-key-here

# Replace with your actual values:
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### **Step 3: Enable Email Authentication**

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Make sure **Enable email confirmations** is **DISABLED** (for easier setup)
3. Under **Site URL**, add your development URL: `http://localhost:5173`
4. Under **Redirect URLs**, add: `http://localhost:5173`

### **Step 4: Set Up Your Development Database**

In your development Supabase project, you need to create the order tokens table:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL to create the table:

```sql
-- Create order_tokens table for the deep link system
CREATE TABLE IF NOT EXISTS order_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    order_id VARCHAR(255), -- NULL for global tokens
    token_type VARCHAR(50) NOT NULL DEFAULT 'single', -- 'single' or 'global'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    used_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_order_tokens_token ON order_tokens(token);
CREATE INDEX IF NOT EXISTS idx_order_tokens_expires_at ON order_tokens(expires_at);
```

### **Step 5: Create Your First Admin User**

**Option A: Create User via Supabase Dashboard (Recommended)**

1. In your Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** button
3. Fill in:
   - **Email**: `admin@yourdomain.com` (or your preferred admin email)
   - **Password**: Choose a secure password
   - **Email Confirm**: ✅ Check this box (to skip email verification)
4. Click **Create User**

**Option B: Create User via SQL (Alternative)**

If you prefer SQL, run this in the SQL Editor:

```sql
-- Insert admin user directly (replace with your email and a secure password)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@yourdomain.com', -- Replace with your email
    crypt('your-secure-password', gen_salt('bf')), -- Replace with your password
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);
```

**Important**: Replace `admin@yourdomain.com` and `your-secure-password` with your actual credentials!

### **Step 6: Deploy Edge Functions**

Once your `.env` is updated, deploy the Edge Functions:

```bash
# Navigate to backend directory
cd backend

# Link to your development project (replace with your project ID)
supabase link --project-ref your-project-id

# Deploy the functions
supabase functions deploy orders
supabase functions deploy order-links
```

### **Step 7: Test the System**

1. **Restart your development server** to pick up the new environment variables:
   ```bash
   npm run dev
   ```

2. **Test the admin interface**:
   - Go to `https://localhost:5173/settings` (or your dev URL)
   - Generate a new token
   - It should now connect to your development Supabase project

3. **Test the deep links**:
   - Use the generated token URL
   - Should now show real data from your Shopware API

## 🎯 **Expected Results**

After completing these steps:

✅ **Development environment** separated from production  
✅ **Real data** from Shopware API (no more mock data)  
✅ **Working token generation** in admin interface  
✅ **Functional deep links** with real order information  
✅ **CORS issues resolved** through proper Edge Function deployment  

## 🔍 **Troubleshooting**

**If you still see mock data:**
- Check that your `.env` variables are correctly set
- Restart your development server
- Verify the Edge Functions deployed successfully

**If CORS errors persist:**
- Make sure you deployed to the correct Supabase project
- Check that the functions are active in your Supabase dashboard

**If token generation fails:**
- Verify your database table was created correctly
- Check the Edge Function logs in Supabase dashboard

---

**🚀 Once complete, your deep link system will be fully functional with real data!**