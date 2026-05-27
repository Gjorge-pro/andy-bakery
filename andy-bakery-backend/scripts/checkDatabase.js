#!/usr/bin/env node
/**
 * Database Diagnostic Script
 * Usage: npm run check-db
 * Checks if database is connected and tables exist
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('\n🔍 DATABASE DIAGNOSTIC CHECK\n');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
    
    // Test connection
    console.log('\n1️⃣  Testing database connection...');
    await prisma.$executeRaw`SELECT 1`;
    console.log('   ✅ Connected to database');
    
    // Check admin table
    console.log('\n2️⃣  Checking tables...');
    const adminCount = await prisma.admin.count();
    console.log(`   ✅ admins table exists (${adminCount} records)`);
    
    const productCount = await prisma.product.count();
    console.log(`   ✅ products table exists (${productCount} records)`);
    
    const orderCount = await prisma.order.count();
    console.log(`   ✅ orders table exists (${orderCount} records)`);
    
    const orderItemCount = await prisma.orderItem.count();
    console.log(`   ✅ order_items table exists (${orderItemCount} records)`);
    
    // Check schema
    console.log('\n3️⃣  Database tables:');
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    tables.forEach(t => console.log(`   • ${t.table_name}`));
    
    // Check columns in products table
    console.log('\n4️⃣  Products table schema:');
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products'
      ORDER BY ordinal_position
    `;
    columns.forEach(c => {
      const nullable = c.is_nullable === 'YES' ? '(nullable)' : '(required)';
      console.log(`   • ${c.column_name}: ${c.data_type} ${nullable}`);
    });
    
    // Try fetching products
    console.log('\n5️⃣  Testing getProducts query...');
    const products = await prisma.product.findMany({ take: 1 });
    console.log(`   ✅ Can fetch products (${products.length} sample)`);
    
    console.log('\n✅ ALL CHECKS PASSED!\n');
    console.log('Your database is ready. The /api/products endpoint should work.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ DIAGNOSTIC FAILED\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔧 Fix: DATABASE_URL hostname not found');
      console.error('   → Check DATABASE_URL is set correctly in Render');
    } else if (error.message.includes('does not exist')) {
      console.error('\n🔧 Fix: Tables not created');
      console.error('   → Run: npx prisma migrate deploy');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('\n🔧 Fix: Cannot connect to database');
      console.error('   → Check PostgreSQL is running on Render');
    }
    
    console.error('\nFull error stack:', error.stack);
    process.exit(1);
  }
}

checkDatabase();
