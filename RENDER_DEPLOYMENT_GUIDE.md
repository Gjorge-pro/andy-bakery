# Andy Bakery Backend - Render Deployment & Debug Guide

## 🔴 Current Issue: 500 Error on `/api/products`

### Root Causes (Most Common)
1. **Prisma migrations NOT applied** to production database
2. **DATABASE_URL not set** in Render environment variables
3. **Prisma Client not generated** on server startup
4. **Tables don't exist** in PostgreSQL database

---

## 📋 Step 1: Check Render Logs (Identify Exact Error)

### Option A: Render Dashboard Logs
1. Go to https://dashboard.render.com
2. Select your **andy-bakery-backend** service
3. Click **Logs** tab
4. Look for errors when the app starts or when you hit `/api/products`
5. Common errors to look for:
   - `Can't reach database server` → DATABASE_URL issue
   - `column "..." does not exist` → Tables missing (migrations not run)
   - `relation "products" does not exist` → Tables not created
   - `ENOTFOUND` → Network connectivity issue

### Option B: SSH into Render (Advanced)
If Logs don't show the error, you can SSH into the service:
```bash
# Render provides SSH access - use your service's shell option
# Then run:
npm run check-db
```

---

## 🔧 Step 2: Verify DATABASE_URL on Render

### Check Environment Variables
1. Go to Render Dashboard → Service Settings → Environment
2. Verify `DATABASE_URL` exists and format is correct:
   ```
   postgresql://username:password@host:port/database_name?schema=public
   ```
3. If missing, copy from your PostgreSQL database settings in Render
   - Go to your PostgreSQL service
   - Copy the **Internal Database URL** (for same region)
   - Or **External Database URL** (for cross-region)

### Verify DATABASE_URL Locally
Create a test script to check:
```bash
node -e "console.log(process.env.DATABASE_URL)"
```

---

## 🚀 Step 3: Apply Prisma Migrations on Render

### THE FIX: Add Migration Script to package.json
The issue is likely that migrations aren't running on deployment. Update your `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "prisma migrate deploy && node server.js",
    "seed": "node src/scripts/createAdmin.js"
  }
}
```

**Key change:** `"start": "prisma migrate deploy && node server.js"`

This ensures:
- ✅ All pending migrations run first
- ✅ Tables are created in production database
- ✅ App only starts after database is ready

### Manual Migration (If Needed)
If you need to manually run migrations:

```bash
# Locally (against production database - CAREFUL!)
DATABASE_URL="your_production_url" npx prisma migrate deploy

# Or create a one-time migration:
DATABASE_URL="your_production_url" npx prisma migrate status
```

---

## 🔍 Step 4: Verify Product Table Exists

Create a diagnostic script to check:

```bash
# File: scripts/checkDatabase.js
const prisma = require('../src/db/prisma');

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Test connection
    await prisma.$executeRaw`SELECT 1`;
    console.log('✅ Database connection OK');
    
    // Check products table exists
    const products = await prisma.product.findMany({ take: 1 });
    console.log('✅ Products table exists');
    console.log('Products count:', await prisma.product.count());
    
    // Check schema
    const result = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tables in database:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
```

Run locally:
```bash
node scripts/checkDatabase.js
```

---

## 🛠️ Step 5: Fix productController (Handle Edge Cases)

Add error logging to identify the exact failure:

```javascript
// src/controllers/productController.js
const getProducts = async (req, res, next) => {
  try {
    console.log('📦 Fetching products...');
    
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    console.log(`✅ Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};
```

---

## 📱 Step 6: Production Deployment Checklist

### Before Deploying to Render:

- [ ] **DATABASE_URL** set in Render environment
- [ ] **start script** includes `prisma migrate deploy`
- [ ] **Prisma schema** matches production database
- [ ] **prisma/migrations/** folder exists in git
- [ ] **All migrations committed** to git
- [ ] **No hardcoded environment variables** (use Render secrets)
- [ ] **Error logging** in place (logging middleware)

### Render Deployment Steps:

1. **Push code to GitHub** with updated start script
   ```bash
   git add .
   git commit -m "Fix: Add Prisma migration to start script"
   git push
   ```

2. **Render auto-deploys** on git push
   - Check deployment in Render dashboard
   - Watch logs for "prisma migrate deploy"

3. **Test endpoint** after deployment:
   ```bash
   curl https://andy-bakery-backend.onrender.com/api/products
   ```

4. **If still 500 error**: Check Render logs again

---

## 🚨 If Migrations Were Never Run

If tables don't exist at all, you have two options:

### Option A: Create New Migration (Recommended)
```bash
# This creates a new migration that will create all tables
npx prisma migrate deploy
```

### Option B: Reset Database (DESTRUCTIVE - Deletes All Data)
```bash
# ONLY if you have no production data yet
DATABASE_URL="your_production_url" npx prisma db push --skip-generate
```

---

## 🔗 Full Production Setup Example

### package.json (Corrected)
```json
{
  "name": "andy-bakery-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "prisma migrate deploy && node server.js",
    "seed": "node src/scripts/createAdmin.js",
    "check-db": "node scripts/checkDatabase.js"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0"
  }
}
```

### .env.local (Never commit - for local testing)
```
DATABASE_URL=postgresql://user:password@localhost:5432/bakery
```

### Render Environment (Dashboard)
```
DATABASE_URL = postgresql://...@your-render-postgres.onrender.com/...
NODE_ENV = production
```

---

## ✅ Testing After Fix

1. **Local test** (against production DB):
   ```bash
   DATABASE_URL="your_render_url" npm run check-db
   ```

2. **Render deployment** - automatically redeploys on git push

3. **Frontend test** - Open products page in Vercel app

4. **Verify logs** - No errors in Render dashboard

---

## 📚 Render + Prisma Best Practices

| Step | What to Do |
|------|-----------|
| **Before first deploy** | Run `npx prisma migrate dev` locally to create initial migration |
| **In git** | Commit `/prisma/migrations/` folder |
| **Start script** | Always use `prisma migrate deploy` before starting app |
| **DATABASE_URL** | Copy from Render PostgreSQL service settings |
| **Prisma Client** | Auto-generated on install, regenerate if needed: `npx prisma generate` |
| **Logs** | Check Render logs for "Prisma migration" messages |

---

## 🎯 Quick Fix Checklist

If 500 error persists:

1. ✅ Check Render logs for exact error
2. ✅ Verify DATABASE_URL is set
3. ✅ Update start script with migration command
4. ✅ Redeploy (git push)
5. ✅ Watch logs for "prisma migrate deploy"
6. ✅ Test `/api/products` endpoint
7. ✅ Check product table exists: `prisma studio` (local) or check logs

---

## 🆘 Still Not Working?

If you've done all this, the error is likely one of:
- **Connection timeout** - Check Render PostgreSQL is running
- **Schema mismatch** - Check Prisma schema matches actual database
- **Permissions** - Check DATABASE_URL user has correct privileges
- **Network** - Render backend can't reach Render PostgreSQL (same region?)

**Next step:** Share Render logs with exact error message.
