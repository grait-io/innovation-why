# 🚨 Fix CORS Errors and Deploy Edge Functions

## 🎯 **Issues Identified**

### **1. CORS Errors (Main Issue)**
```
Access to fetch at 'https://zdpboccjipkgnjjzojnc.supabase.co/functions/v1/orders' 
from origin 'https://kiezbett.aicd.me' has been blocked by CORS policy
```
**Cause**: Edge Functions not deployed to your dev Supabase project

### **2. Public Path Warning (Minor)**
```
Files in the public directory are served at the root path.
Instead of /public/orders/..., use /orders/...
```
**Cause**: Vite serving static files (this is just a warning, not an error)

## 🔧 **Solution Steps**

### **Step 1: Deploy Edge Functions to Your Dev Project**

**Navigate to backend directory:**
```bash
cd backend
```

**Login to Supabase (if not already):**
```bash
supabase login
```

**Link to your development project:**
```bash
supabase link --project-ref zdpboccjipkgnjjzojnc
```

**Deploy all functions:**
```bash
supabase functions deploy
```

### **Step 2: Create Database Table**

In your Supabase dashboard (`https://zdpboccjipkgnjjzojnc.supabase.co`):

1. Go to **SQL Editor**
2. Run this SQL:

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

### **Step 3: Configure Authentication**

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. **Site URL**: Add `https://kiezbett.aicd.me`
3. **Redirect URLs**: Add `https://kiezbett.aicd.me`
4. **Enable email confirmations**: Disable for easier testing

### **Step 4: Create Admin User**

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Use credentials:
   ```
   Email: admin@kiezbett.dev
   Password: KiezAdmin2024!
   ✅ Email Confirm: CHECKED
   ```

### **Step 5: Test the System**

1. **Restart your dev server**: `npm run dev`
2. **Login**: Use the admin credentials
3. **Check for CORS errors**: Should be gone
4. **Test token generation**: Should work without errors

## ✅ **Expected Results**

After completing these steps:

- ✅ **No more CORS errors**
- ✅ **Orders load properly** from Shopware API
- ✅ **Token generation works**
- ✅ **Deep links function correctly**
- ✅ **Admin login successful**

## 🔍 **Verification Commands**

**Check if functions are deployed:**
```bash
supabase functions list
```

**Check function logs:**
```bash
supabase functions logs orders
supabase functions logs order-links
```

## 🆘 **If Still Having Issues**

1. **Verify functions exist** in Supabase dashboard → Edge Functions
2. **Check function logs** for deployment errors
3. **Ensure project reference** is correct: `zdpboccjipkgnjjzojnc`
4. **Verify authentication** settings allow your domain

---

**🚀 The main fix is deploying the Edge Functions to your dev Supabase project!**