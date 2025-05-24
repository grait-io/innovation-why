# 🔗 Test Deep Link URLs

## 📱 **Deep Link URL Formats**

Based on your routing configuration in `src/App.tsx`, here are the deep link formats:

### **Single Order Deep Link**
```
https://kiezbett.aicd.me/public/order/{TOKEN}
```

### **All Orders Deep Link (Global)**
```
https://kiezbett.aicd.me/public/orders/{TOKEN}
```

## 🧪 **How to Get Test Tokens**

### **Option 1: Generate via Admin Interface**
1. **Login to admin**: `https://kiezbett.aicd.me/login`
2. **Go to settings**: `https://kiezbett.aicd.me/settings`
3. **Generate tokens** using the interface
4. **Copy the generated URLs**

### **Option 2: Use Development Token Script**
If you have the dev token script working:
```bash
node scripts/generate-dev-token.js
```

## 📋 **Example Test URLs**

**Once you generate tokens, your URLs will look like:**

### **Single Order Example:**
```
https://kiezbett.aicd.me/public/order/dev-single-1748075074714-abc123xyz
```

### **Global Orders Example:**
```
https://kiezbett.aicd.me/public/orders/dev-global-1748075074714-xyz789abc
```

## 🔧 **Current Status**

**Before you can test these links, you need to:**

1. ✅ **Deploy Edge Functions** (follow `FIX_CORS_AND_DEPLOYMENT.md`)
2. ✅ **Create database table** in your dev Supabase
3. ✅ **Generate actual tokens** via admin interface
4. ✅ **Fix CORS issues** by deploying functions

## 🎯 **Testing Steps**

### **Step 1: Complete Setup**
Follow the deployment guide to fix CORS issues first.

### **Step 2: Generate Token**
1. Login to admin interface
2. Go to settings page
3. Click "Generate Global Token" or "Generate Single Order Token"
4. Copy the generated URL

### **Step 3: Test Deep Link**
1. Open the copied URL in a new browser/incognito window
2. Should show mobile-friendly order overview
3. No login required for public links

## 📱 **Mobile Testing**

**Test on mobile devices:**
- Open the deep link URL on your phone
- Should display mobile-optimized interface
- Touch-friendly navigation
- Responsive design

## 🆘 **If Links Don't Work**

**Common issues:**
1. **CORS errors** → Deploy Edge Functions first
2. **Token not found** → Generate new token via admin
3. **Database errors** → Create order_tokens table
4. **404 errors** → Check URL format matches routes

---

**🚀 Once you complete the Edge Functions deployment, you can generate real test tokens via the admin interface!**