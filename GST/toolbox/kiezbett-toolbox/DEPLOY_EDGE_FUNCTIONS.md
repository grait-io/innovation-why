# 🚀 Deploy Edge Functions to Development Supabase

## ❌ **Current Issue**
CORS errors indicate Edge Functions are not deployed to your dev Supabase project:
```
Access to fetch at 'https://zdpboccjipkgnjjzojnc.supabase.co/functions/v1/orders' 
from origin 'https://kiezbett.aicd.me' has been blocked by CORS policy
```

## 🔧 **Solution: Deploy Edge Functions**

### **Step 1: Navigate to Backend Directory**
```bash
cd backend
```

### **Step 2: Login to Supabase CLI**
```bash
supabase login
```
Follow the browser login process.

### **Step 3: Link to Your Development Project**
```bash
supabase link --project-ref zdpboccjipkgnjjzojnc
```

### **Step 4: Deploy All Functions**
```bash
supabase functions deploy
```

Or deploy individually:
```bash
supabase functions deploy orders
supabase functions deploy order-links
```

### **Step 5: Verify Deployment**
Check your Supabase dashboard:
1. Go to https://zdpboccjipkgnjjzojnc.supabase.co
2. Navigate to **Edge Functions**
3. Should see: `orders` and `order-links` functions

## 🎯 **Expected Result**
After deployment:
- ✅ No more CORS errors
- ✅ API calls work from your domain
- ✅ Orders load properly
- ✅ Token generation works

## 🔍 **Troubleshooting**

**If deployment fails:**
1. Make sure you're logged into Supabase CLI
2. Verify project reference is correct
3. Check that functions exist in `backend/supabase/functions/`

**If CORS still occurs:**
1. Verify functions are active in Supabase dashboard
2. Check function logs for errors
3. Ensure your domain is allowed in Supabase settings