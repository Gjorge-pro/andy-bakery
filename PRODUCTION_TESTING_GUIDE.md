# 🚀 Andy Bakery Production Testing & Deployment Guide

## 📋 Complete Checklist

### ✅ What's Deployed
- **Backend**: Node.js + Express on Render
- **Database**: PostgreSQL on Render  
- **Frontend**: React + Vite on Vercel
- **Images**: Cloudinary storage
- **Email**: Gmail SMTP (port 587, TLS)
- **Real-time**: Socket.IO for notifications

---

## 🔐 PRE-DEPLOYMENT SETUP

### 1. Gmail App Password Setup

**Required ONCE - Do this first:**

1. Go to https://myaccount.google.com/
2. Click "Security" in left sidebar
3. Scroll to "App passwords" (requires 2FA enabled)
4. Select "Mail" and your device
5. Generate - you'll see 16-char password
6. **Copy exactly** (with spaces): `xxxx xxxx xxxx xxxx`

**Don't use:**
- ❌ Your regular Gmail password
- ❌ Password without spaces
- ❌ Password with typos

---

## 📝 RENDER BACKEND SETUP

### Configure Environment Variables

**Go to:** https://render.com → Dashboard → Your Service → Settings → Environment

Add these variables:

```
EMAIL_USER
your-gmail@gmail.com

EMAIL_PASS
xxxx xxxx xxxx xxxx    (paste exactly from Gmail setup)
```

**Save** → Service restarts automatically

**Verify:**
1. Wait 1-2 minutes for restart
2. Go to Logs tab
3. Look for lines:
   ```
   📧 Initializing email service...
   ✅ Email service ready - SMTP verified
   ```

If you see warnings instead, double-check EMAIL_PASS.

---

## 🧪 LOCAL TESTING (Before Production)

### Backend Email Testing

**1. Set environment variables:**

Create/update `.env` in `andy-bakery-backend/`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/andybakery
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

**2. Start backend:**
```bash
cd andy-bakery-backend
npm install
npm run dev
```

**3. Check startup logs:**
```
🔍 Testing database connection...
✅ Database connected successfully

📧 Initializing email service...
   User: your-gmail@gmail.com
   Host: smtp.gmail.com
   Port: 587 (TLS)
✅ Email service ready - SMTP verified

✅ Server running on http://localhost:3000
```

**4. Start frontend:**
```bash
cd andy-bakery-frontend
npm install
npm run dev
```

Open http://localhost:5173

**5. Test product creation (Admin):**
- Go to Admin → Manage Products
- Create new product with image
- Check backend logs: `✅ Image uploaded to Cloudinary`
- Verify image displays

**6. Test order creation:**
- Go to Products → Add items to cart
- Checkout with test email
- Check backend logs:
  ```
  ✅ Order confirmation email sent to test@example.com
  ✅ Admin notification sent for order abc123
  ```
- Check your Gmail for confirmation email

---

## 🌍 PRODUCTION TESTING (After Render Deployment)

### Test 1: Check Backend Health

**1. Verify Render is running:**
- Open https://andy-bakery-backend-render.onrender.com/api/products
- Should see JSON array of products

**2. Check backend logs:**
- Render Dashboard → Logs tab
- Should show startup messages including email verification

### Test 2: Test API Endpoints

**Using Postman or Terminal:**

```bash
# GET products
curl https://andy-bakery-backend-render.onrender.com/api/products

# Check if you get products array
```

If working, you'll get products. If database empty, that's fine - create products via admin.

### Test 3: Create Test Product (Admin)

**1. Go to admin login:**
- https://your-vercel-app.vercel.app/admin

**2. Login** with your admin credentials

**3. Add new product:**
- Name: "Test Cupcake"
- Price: 5.99
- Image: Upload any image file
- Click Save

**4. Check for:**
- ✅ No errors
- ✅ Image uploaded
- ✅ Product appears in list

**5. Check Render logs:**
```
✅ Image uploaded to Cloudinary
✅ Product saved to database
```

### Test 4: Create Test Order + Email

**1. Go to public site:**
- https://your-vercel-app.vercel.app/

**2. Order something:**
- Click Products
- Add items
- Go to Cart
- Checkout
- Enter YOUR EMAIL address (so you receive test email)
- Submit order

**3. Check order response:**
- Should see order confirmation on screen
- Order should appear in OrderTracking

**4. Check backend logs (Render):**
- Go to Render → Logs
- Should see:
  ```
  ✅ Order confirmation email sent to your@email.com
  ✅ Admin notification sent for order xyz
  ```

**5. Check your Gmail:**
- Wait 10-20 seconds
- Check inbox AND spam/promotions folders
- Should see email from andy-bakery with order details

**6. Check admin notification:**
- Check your Gmail (same as EMAIL_USER)
- Should get "New Order #xyz" email
- Shows customer details and order items

### Test 5: Test SPA Routing

**Frontend routing - all should work:**

1. **On Vercel frontend:**
   - Click Products link → should show products
   - Refresh page → should stay on /products (not 404)

2. **Try direct URLs:**
   - https://your-vercel-app.vercel.app/products → works?
   - https://your-vercel-app.vercel.app/admin → works?
   - https://your-vercel-app.vercel.app/orders → works?

**If any return 404, you need vercel.json**

### Test 6: Test Order Tracking

1. **Go to Order Tracking:**
   - https://your-vercel-app.vercel.app/trackorders

2. **Enter order ID** (from order confirmation)

3. **Should see:**
   - Order details
   - Items ordered
   - Current status
   - Live updates when admin changes status

---

## 🔍 TROUBLESHOOTING

### Email Not Arriving

**Check 1: Verify startup logs**
```
Render → Logs → Search for "Email service"
```

Should show ✅ (not ⚠️ warning)

**Check 2: Try again from Admin**
1. Create another test order
2. Use DIFFERENT email address (Gmail may throttle)
3. Check spam folder

**Check 3: Verify EMAIL_PASS**
1. Go to Render Settings
2. Check EMAIL_PASS value
3. Must be App Password from Gmail (not regular password)
4. Must have exactly 16 chars with spaces
5. Save → restart service

**Check 4: Enable Less Secure Apps (Alternative)**
If App Password doesn't work:
1. Go to https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure app access"
3. Wait 5-10 minutes
4. Try again

### Products Not Showing

**Issue:** `/api/products` returns empty or error

**Check:**
1. Database connected? (Render logs show ✅ Connected)
2. Create product via admin first
3. Check Render logs for errors
4. Go to Render Data tab (if available) to verify schema

### Admin Login Not Working

**Check:**
1. Admin user exists in database
2. PASSWORD is hashed (not plain text)
3. Try resetting with admin script:
   ```bash
   cd andy-bakery-backend
   npm run create-admin
   ```

### 404 on Route Refresh

**This means vercel.json not deployed**

**Fix:**
1. Verify file exists: `andy-bakery-frontend/vercel.json`
2. Content should have catch-all rewrite
3. Redeploy frontend: `git push`
4. Wait 2 min for Vercel build
5. Test again

---

## 📊 FINAL VERIFICATION CHECKLIST

After all testing, verify these are ✅:

### Backend (Render)

- [ ] Backend running at https://andy-bakery-backend.onrender.com
- [ ] `/api/products` returns products
- [ ] `/api/products` accepts admin product creation
- [ ] Images upload to Cloudinary successfully
- [ ] Database is populated (run queries if needed)
- [ ] Logs show "Email service ready"
- [ ] No ENETUNREACH or ECONNREFUSED errors

### Frontend (Vercel)

- [ ] Frontend running at https://your-app.vercel.app
- [ ] Products page displays all products with images
- [ ] Cart functionality works
- [ ] Checkout creates orders
- [ ] SPA routing works (refresh on /products, /admin, etc.)
- [ ] Admin login works
- [ ] Admin can create products

### Email (Gmail + Render)

- [ ] Startup shows "Email service ready - SMTP verified"
- [ ] Customer receives confirmation emails
- [ ] Admin receives new order notifications
- [ ] Emails arrive within 10-30 seconds
- [ ] Email content is correct with order details
- [ ] No email errors in Render logs

### Database (PostgreSQL on Render)

- [ ] Tables exist: products, orders, orderItems, admins
- [ ] Products can be created and queried
- [ ] Orders can be created and tracked
- [ ] No schema errors in logs

---

## 🎯 DEPLOYMENT COMPLETED

**What's now live:**

✅ **Backend API** - Render (auto-scales, database connected)
✅ **Frontend SPA** - Vercel (CDN, instant deploys)
✅ **Product Images** - Cloudinary (optimized delivery)
✅ **Email Notifications** - Gmail SMTP (port 587 TLS)
✅ **Database** - PostgreSQL on Render (persistent)
✅ **Real-time Updates** - Socket.IO (order notifications)

---

## 📞 Support

**If something breaks:**

1. Check Render logs first (90% of issues are there)
2. Check Vercel logs for frontend issues
3. Check `.env` variables are set correctly
4. Check Gmail App Password is correct
5. Restart service (Render dashboard → Manual Restart)

**Common fixes:**
- Email not working → Check EMAIL_PASS is App Password
- Products empty → Create products via admin
- Routes 404 → Check vercel.json exists
- 500 errors → Check database is connected (Render logs)

---

**Status:** ✅ Production Ready  
**Last Updated:** Today  
**Test Before Going Live:** Yes - complete all checklist items  

Good luck! 🍰
