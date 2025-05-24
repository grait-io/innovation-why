# 🔐 Admin Login Credentials Setup

## 🎯 **Quick Admin User Creation**

Here are the exact steps to create your admin login credentials:

### **Step 1: Create Admin User in Supabase Dashboard**

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your development project
3. Go to **Authentication** → **Users**
4. Click **Add User** button
5. Use these credentials:

```
Email: admin@kiezbett.dev
Password: KiezAdmin2024!
✅ Check "Email Confirm" (to skip email verification)
```

6. Click **Create User**

### **Step 2: Test Login Credentials**

Once you've:
- Updated your `.env` file with your Supabase credentials
- Restarted your development server (`npm run dev`)

**Test these login credentials:**

```
🔑 LOGIN CREDENTIALS:
Email: admin@kiezbett.dev
Password: KiezAdmin2024!
```

**Login URL:** `http://localhost:5173/login`

### **Step 3: Alternative - Use SQL to Create User**

If you prefer SQL, run this in your Supabase SQL Editor:

```sql
-- Create admin user with specific credentials
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
    'admin@kiezbett.dev',
    crypt('KiezAdmin2024!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);
```

## 🧪 **Testing Your Setup**

1. **Start your dev server**: `npm run dev`
2. **Go to login page**: `http://localhost:5173/login`
3. **Use credentials**:
   - Email: `admin@kiezbett.dev`
   - Password: `KiezAdmin2024!`
4. **Should redirect to**: Settings page after login
5. **Test token generation**: Click "Global Dev Token" button

## 🔒 **Security Notes**

- These are **development credentials only**
- Change the password for production use
- The email domain `.dev` is clearly for development
- You can create additional admin users as needed

## 🎯 **Expected Flow**

1. ✅ Login with provided credentials
2. ✅ Access settings page automatically
3. ✅ Generate development tokens
4. ✅ Test deep links with real data

---

**🚀 Ready-to-use credentials: `admin@kiezbett.dev` / `KiezAdmin2024!`**