# 🚀 Andy Bakery Production Deployment Checklist

## Pre-Deployment (Local Testing)

- [ ] Run `npm run check-db` locally
- [ ] Verify all database tables exist
- [ ] Test `/api/products` endpoint locally
- [ ] Check that `.env.local` is NOT committed to git
- [ ] Verify `prisma/migrations/` folder is committed
- [ ] All environment variables documented

## Render Setup - PostgreSQL

- [ ] Create PostgreSQL instance on Render
- [ ] Database name: `bakery` (or your choice)
- [ ] Copy Internal URL (if backend in same region): `postgresql://...`
- [ ] Copy External URL (if cross-region): `postgresql://...`
- [ ] Test connection locally with psql or Prisma Studio

## Render Setup - Backend Service

### Environment Variables (Dashboard → Settings → Environment)

```
DATABASE_URL = postgresql://username:password@host:port/dbname?schema=public
NODE_ENV = production
CLOUDINARY_CLOUD_NAME = your_cloudinary_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
FRONTEND_URL = https://your-frontend.vercel.app
```

- [ ] DATABASE_URL set
- [ ] All Cloudinary variables set
- [ ] FRONTEND_URL set to your Vercel domain
- [ ] No secrets in code

### Build & Start Commands (Dashboard → Settings)

**Build Command (leave empty or):**
```bash
npm install
```

**Start Command:**
```bash
prisma migrate deploy && node server.js
```

- [ ] Start command includes `prisma migrate deploy`
- [ ] Prisma dev dependency included in package.json

## Git Deployment

```bash
# From your project root
git add -A
git commit -m "chore: Production deployment setup - Add Prisma migrations"
git push origin main
```

- [ ] package.json updated with migration script
- [ ] scripts/checkDatabase.js committed
- [ ] RENDER_DEPLOYMENT_GUIDE.md committed
- [ ] .env NOT committed (add to .gitignore)

## Testing Deployment

### 1. Watch Render Logs
- Dashboard → Logs
- Watch for deployment messages:
  - ✅ "npm install" completion
  - ✅ "prisma migrate deploy" running
  - ✅ "Server running on" message
  - ✅ Database connection log

### 2. Test Health Endpoint
```bash
curl https://andy-bakery-backend.onrender.com/
```

Expected response:
```json
{ "message": "Andy Bakery API is running 🎂" }
```

### 3. Test Products Endpoint
```bash
curl https://andy-bakery-backend.onrender.com/api/products
```

Expected: `[]` (empty array) or array of products

### 4. Frontend Test
- Open https://your-frontend.vercel.app
- Navigate to Products page
- Should display products (or empty if database empty)
- No 500 error

## If Still Getting 500 Error

### Debug Steps

1. **Check Render logs** for exact error:
   ```
   • "relation 'products' does not exist" → Migrations not applied
   • "column X does not exist" → Schema mismatch
   • "ENOTFOUND host" → DATABASE_URL wrong
   • "ECONNREFUSED" → Can't reach PostgreSQL
   ```

2. **Verify DATABASE_URL** is exactly right:
   - Check for typos (underscores vs dashes)
   - Check password doesn't have special chars (URL encode if needed)
   - Check port number
   - Check schema=public is included

3. **Manually trigger migration**:
   - SSH into Render service (if available)
   - Run: `npx prisma migrate status`
   - Check what migrations exist

4. **Check Prisma Client generated**:
   - In Render logs, should see migration output
   - If missing, try force regenerate:
   ```bash
   npx prisma generate
   ```

5. **Verify PostgreSQL is running**:
   - Check Render PostgreSQL service is in "Available" state
   - Not "Suspended" or "Crashed"

## Monitoring Post-Deployment

### Daily Checks
- [ ] Backend health endpoint responds
- [ ] Products page loads without errors
- [ ] Create/update product functionality works (if admin)
- [ ] No database connection errors in logs

### Weekly Reviews
- [ ] Check Render metrics (CPU, RAM, connections)
- [ ] Review error logs for patterns
- [ ] Verify backups are running (if configured)

## Data Management

### Initial Data
Add sample products after first deployment:
```bash
curl -X POST https://andy-bakery-backend.onrender.com/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chocolate Cake",
    "description": "Rich chocolate cake",
    "price": 25,
    "category": "Cakes",
    "imageUrl": "https://..."
  }'
```

Or use the admin panel to add products.

### Backups
- Render PostgreSQL automatically backs up (check Render docs)
- Consider setting up automated exports
- Document backup/restore procedures

## Environment-Specific Differences

| Aspect | Local | Render |
|--------|-------|--------|
| DATABASE_URL | `localhost` | Cloud host |
| Node Env | `development` | `production` |
| Logs | Console | Dashboard |
| Restart | Manual `npm run dev` | Auto-deploy on git push |
| Database | Local PostgreSQL | Managed Render PostgreSQL |
| Images | Local files or Cloudinary | Cloudinary only |

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 500 on /api/products | Tables don't exist | Run `prisma migrate deploy` |
| ENOTFOUND database | Wrong DATABASE_URL | Copy correct URL from Render |
| ECONNREFUSED | Can't reach database | Check PostgreSQL is running |
| Column not found | Schema mismatch | Check Prisma schema matches DB |
| Prisma Client error | Not generated | Run `npx prisma generate` |
| Infinite redirects | CORS misconfigured | Check FRONTEND_URL in .env |

## Rollback Procedure

If something breaks:

1. **Revert code**:
   ```bash
   git revert HEAD
   git push
   ```
   Render auto-deploys reverted code

2. **Database rollback**:
   - Previous state in Render PostgreSQL backups
   - Contact Render support for restore

3. **Check logs** before pushing again

## Success Criteria ✅

- [ ] Render dashboard shows "Available" (green)
- [ ] No errors in deployment logs
- [ ] `GET /api/products` returns 200 status
- [ ] Frontend products page loads
- [ ] No CORS errors
- [ ] No database connection errors

---

**Last Updated:** May 27, 2026
**Team:** Andy Bakery Development
