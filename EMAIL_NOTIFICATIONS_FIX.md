# 📧 Email Notifications Fix - Production Ready

## Problem Fixed

**Error:** `connect ENETUNREACH ... port 465` 
**Cause:** Render environment blocks port 465 (SSL) but allows port 587 (TLS)
**Solution:** Use TLS (port 587, secure: false) instead of SSL

---

## ✅ What Was Fixed

### Backend Changes
- **NEW:** `src/utils/emailService.js` - Dedicated email service module
  - ✅ Proper Gmail SMTP configuration (port 587, TLS)
  - ✅ Transporter initialization with timeouts
  - ✅ Graceful error handling (email failure doesn't break orders)
  - ✅ Startup verification
  - ✅ Admin notification support

- **UPDATED:** `server.js` - Email service initialization
  - ✅ Calls `initializeEmailService()` on startup
  - ✅ Logs email service status
  - ✅ Fails gracefully if email not configured

- **UPDATED:** `src/controllers/orderController.js`
  - ✅ Uses new email service
  - ✅ Sends customer confirmation emails
  - ✅ Sends admin notifications
  - ✅ Non-blocking (orders save even if email fails)

---

## 🔧 Configuration Required

### Render Environment Variables

You need to set these in your Render dashboard:

```
EMAIL_USER = your-gmail@gmail.com
EMAIL_PASS = xxxx xxxx xxxx xxxx
```

**IMPORTANT:** 
- `EMAIL_PASS` must be a **Gmail App Password**, NOT your regular Gmail password
- Create App Password: Google Account → Security → App passwords

### How to Create Gmail App Password

1. Go to https://myaccount.google.com/security
2. Scroll to "App passwords" (or search for it)
3. Select "Mail" and "Windows Computer" (or your OS)
4. Generate password - it will be 16 characters (4 groups of 4)
5. Copy it exactly as shown (with spaces)
6. Paste into Render `EMAIL_PASS` field

---

## 🚀 Gmail SMTP Configuration (Now Correct)

```javascript
// Port 587 (TLS) - Works on Render ✅
// Port 465 (SSL) - Fails on Render ❌

{
  host: 'smtp.gmail.com',
  port: 587,          // ← TLS port (works on Render)
  secure: false,       // ← Use STARTTLS instead of SSL
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,  // ← Must be App Password
  },
  // Timeouts for reliability
  connectionTimeout: 20000,
  socketTimeout: 20000,
}
```

---

## 📝 How It Works

### Flow: Customer Places Order → Emails Sent

```
1. Customer submits order
   ↓
2. Backend creates order in database
   ↓
3. Response sent to frontend immediately (fast!)
   ↓
4. In background (non-blocking):
   - Send confirmation email to customer
   - Send admin notification to you
   ↓
5. Even if emails fail, order is already saved ✅
```

### Benefits of Non-Blocking Email

- ✅ Orders save quickly (users get instant confirmation)
- ✅ Email failures don't break the app
- ✅ Better user experience (no waiting for email service)
- ✅ Production-ready reliability

---

## 🧪 Testing

### Local Testing

1. **Set up Gmail App Password** (see above)

2. **Add to .env.local:**
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

3. **Start backend:**
   ```bash
   cd andy-bakery-backend
   npm run dev
   ```

4. **Look for startup logs:**
   ```
   📧 Initializing email service...
      User: your-gmail@gmail.com
      Host: smtp.gmail.com
      Port: 587 (TLS)
   ✅ Email service ready - SMTP verified
   ```

5. **Create an order from frontend** (use test email)

6. **Check logs for:**
   ```
   ✅ Order confirmation email sent to customer@example.com
   ✅ Admin notification sent for order abc123
   ```

7. **Check your Gmail inbox** for the emails

### Production Testing (Render)

1. **Set `EMAIL_USER` and `EMAIL_PASS` in Render dashboard**
   - Service → Settings → Environment Variables
   - Add both variables
   - Save

2. **Deploy:**
   ```bash
   git push origin main
   ```

3. **Check Render logs:**
   - Wait for deployment (~2 min)
   - Go to Logs tab
   - Look for "Email service ready"

4. **Test in production:**
   - Go to frontend app
   - Create an order with your email
   - Check your inbox for confirmation email

---

## 🔍 Troubleshooting

### Issue: "Email service: SMTP verification returned false"

**Cause:** Gmail App Password is incorrect or missing
**Fix:**
1. Go to https://myaccount.google.com/apppasswords
2. Create a new app password for Mail/Windows
3. Copy exactly as shown (16 chars with spaces)
4. Update `EMAIL_PASS` in Render environment

### Issue: "Email skipped: Service not configured"

**Cause:** `EMAIL_USER` or `EMAIL_PASS` not set
**Fix:** 
1. Check Render environment variables
2. Restart the service after adding them
3. Check that values don't have extra spaces

### Issue: Email doesn't arrive

**Causes:**
- Check spam/promotions folder
- Verify customer email is correct in order
- Check Render logs for errors
- Verify Gmail allows "Less secure app access" (or use App Password - recommended)

---

## 📊 Email Service Status

Check email service status at startup:

```
Backend starts
   ↓
Database check ✅
   ↓
Email service check ✅
   ↓
Server ready
```

If email fails, it logs a warning but server still starts (graceful degradation).

---

## 🎯 Files Changed

| File | Change |
|------|--------|
| `src/utils/emailService.js` | NEW - Email service module |
| `server.js` | UPDATED - Initialize email on startup |
| `src/controllers/orderController.js` | UPDATED - Use new email service |

---

## 🚀 Deployment Commands

```bash
# Stage all changes
git add .

# Commit with clear message
git commit -m "fix: Implement production-ready email notifications

- Create dedicated emailService.js module
- Use port 587 (TLS) for Render compatibility
- Add transporter verification on startup
- Non-blocking email (orders save immediately)
- Send customer confirmation + admin notification
- Graceful error handling (email failures don't break orders)"

# Push to Render
git push origin main
```

---

## ✨ Production Checklist

Before going live with emails:

- [ ] Gmail App Password created
- [ ] `EMAIL_USER` set in Render environment
- [ ] `EMAIL_PASS` set in Render environment (App Password)
- [ ] Code deployed to Render
- [ ] Backend logs show "Email service ready"
- [ ] Test order created
- [ ] Confirmation email received
- [ ] Admin notification received
- [ ] Orders still save if email fails (test by stopping SMTP)

---

## 🔐 Security Notes

- ✅ Never commit `.env` files with passwords
- ✅ Use Render environment variables (not hard-coded)
- ✅ Use Gmail App Password, not regular Gmail password
- ✅ Emails are transactional (not marketing), so email reputation is good
- ✅ No sensitive data in emails (just order details)

---

## 📚 References

- Gmail SMTP: https://support.google.com/mail/answer/185833
- Nodemailer: https://nodemailer.com/
- Render Environment: https://render.com/docs/environment-variables
- TLS vs SSL: Port 587 (TLS/STARTTLS) vs 465 (SSL/SMTPS)

---

**Status:** ✅ Production ready  
**Render Compatible:** ✅ Uses port 587 (TLS)  
**Order Flow:** ✅ Non-blocking (orders save immediately)  
**Error Handling:** ✅ Graceful (app survives email failures)
